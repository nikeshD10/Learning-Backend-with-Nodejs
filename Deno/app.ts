import { Application } from "https://deno.land/x/oak/mod.ts";
import todosRouter from "./routes/todos.ts";

const app = new Application();

/*
  So oak, always auto sends the response back when ever it is done executing any middleware not all.
  But it does not send back the response when it is done executing a route handler middleware which performs async operations.
  So next will not wait before route handles executing the requests and sending back the response.
  So to prevent this when we use async operations in middleware we have to use await next() to wait for the route handler to finish executing.
  So that oak can send back the response.

  Example:

  app.use(async (ctx, next) => {
    console.log("Middleware!");
    await next();
  });
*/

// Registering a routes
app.use(todosRouter.routes());

// This allowedMethods() method is used to handle the OPTIONS request
// that the browser sends to the server to check which methods are allowed.

app.use(todosRouter.allowedMethods()); // Allow GET, POST, PUT, DELETE

await app.listen({ port: 8000 });
