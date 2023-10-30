import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

interface Todo {
  id: string;
  text: string;
}

let todos: Todo[] = [];

router.get("/todos", (ctx) => {
  // with the oak framework, we can set the response body to an object and it will automatically be converted to JSON data
  ctx.response.body = { todos: todos };
});

router.post("/todos", async (ctx) => {
  // with the oak framework, we can access the request body with the request object
  const result = ctx.request.body({ type: "json" });
  const data = await result.value;
  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: data.text,
  };

  todos.push(newTodo);

  ctx.response.body = { message: "Created todo!", todo: newTodo };
});

router.put("/todos/:todoId", async (ctx) => {
  const tid = ctx.params.todoId;
  // Find the index of the todo with the given id
  const todoIndex = todos.findIndex((todo) => {
    return todo.id === tid;
  });
  // If the todo with the given id is not found, return a 404 error
  if (todoIndex < 0) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Could not find todo for this id." };
    return;
  }
  // Get the request body
  const result = ctx.request.body({ type: "json" });
  const data = await result.value;
  // Update the todo with the given id
  todos[todoIndex] = { id: todos[todoIndex].id, text: data.text };

  // Return the updated todo
  ctx.response.body = { message: "Updated todo!" };
});

router.delete("/todos/:todoId", (ctx) => {
  const tid = ctx.params.todoId;
  // Filter out the todo with the given id
  todos = todos.filter((todo) => todo.id !== tid);
  ctx.response.body = { message: "Deleted todo! " + tid };
});

export default router;
