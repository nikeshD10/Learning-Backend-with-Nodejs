const { buildSchema } = require("graphql");

module.exports = buildSchema(`

  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    status: String!
    posts: [Post!]!
  }

  type AuthData {
    token: String!
    userId: String!
  }

  type PostData {
    posts: [Post!]!
    totalPosts: Int!
  }


  input UserInputData {
    email: String!
    name: String!
    password: String!
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    posts: PostData!
  }

  input PostInputData {
    title: String!
    content: String!
    imageUrl: String!
  }

  type RootMutation {
    createUser(userInput: UserInputData): User!
    createPost(postInput: PostInputData): Post!
  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

// createUser is a mutation which means it will change data on the server. It is like controller in MVC
// userInput is a custom type defined in the schema and UserInputData is a custom type defined in the schema
// UserInputData has 3 fields: email, name and password
// User is a custom type defined in the schema
// ! means the field is required
// schema is a reserved keyword
// mutation is a reserved keyword
// RootMutation is a custom type defined in the schema
// Graphql doesn't know dates so we need to store them to strings
