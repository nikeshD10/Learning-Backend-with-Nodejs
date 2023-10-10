// const { MongoClient } = require("mongodb");

// let _db;
// const mongoConnect = (callback) => {
//   MongoClient.connect(
//     "mongodb+srv://ipbcybe2022:M0ngoDBAryan@project0.lyxhh8a.mongodb.net/?retryWrites=true&w=majority"
//   )
//     .then((client) => {
//       console.log("Connected!");
//       _db = client.db();
//       callback();
//     })
//     .catch((err) => {
//       console.log(err);
//       throw err;
//     });
// };

// const getDb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw "No database found!";
// };

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://ipbcybe2022:M0ngoDBAryan@project0.lyxhh8a.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useUnifiedTopology: true,
});

// This function helps us to connect to the mongodb Client but we can't do anything yet
const mongoConnect = (callback) => {
  client
    .connect()
    .then((client) => {
      callback(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     const newClient = await client.connect();
//     console.log(newClient);
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

exports.mongoConnect = mongoConnect;
