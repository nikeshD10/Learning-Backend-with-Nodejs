// I want to set up the code that will allow us to connect to the SQL database and then also give us
// back a connection object so to say which allows us to run queries. For this I'll
// first of all import that MySQL package and store it in a MySQL constant,

const mysql = require("mysql2");
// Two ways to connect to mysql database
//
// 1. Create a connection to run queries and should be closed after running queries downside is we need to
//    reexcute the code to create a connection for every new query. And it's inefficient.
// 2. Create a pool of connections and use it to run queries. It's efficient and we don't need to reexcute

// To create such a pool, we will create a new constant pool
// and we will use the createPool method which is available on the MySQL package
// and this createPool method expects a JavaScript object where we can configure
// the pool and the connection to the database.

// We need to configure the pool with the database we want to connect to
// and the user we want to use to connect to the database and the password
// and the database we want to connect to.

// We can also configure the host and the port but we don't have to do that
// because the default values are the ones we need here.

// We also don't have to configure the user and the password because we'll
// get those from the environment variables.

// THis allows us to always reach out to it whenever we need to run a query
// and then we get a new connection from that pool which manages the multiple connections
// for us and we can then run multiple queries becaues each query needs its own connection and once
// the query is done, the connection will be handled by the pool and it's available again for the next query.
// And then pool can then be finished when our application shuts down.
const pool = mysql.createPool({
  // contains information of the database we want to connect to
  // first we need to add the host
  host: "localhost",
  // then we need to define username
  user: "root",
  // then we need to define exact database name or our schema name
  database: "node-complete",
  // then we need to define password
  password: "nikesh2001",
});

module.exports = pool.promise();
