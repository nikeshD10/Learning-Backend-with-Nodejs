// resolver is an exported object with a resolver function for each API endpoint
// resolver functions are called by the GraphQL server when a query or mutation is executed
// the resolver function for the hello endpoint returns a string
// the resolver function for the hello endpoint is called when a query is executed
// the query is defined in the GraphQL/Backend/graphql/schema.js file

module.exports = {
  hello() {
    return {
      text: "Hello World!",
      views: 1234,
    };
  },
};

// Now we have the resolver and the schema we need to  expose them to public access
