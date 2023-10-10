// const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri =
//   "mongodb+srv://ipbcybe2022:M0ngoDBAryan@project0.lyxhh8a.mongodb.net/?retryWrites=true&w=majority";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
//   useUnifiedTopology: true,
// });

// // This function helps us to connect to the mongodb Client but we can't do anything yet
// // And this is not good way to connect to mongodb cause for every operation we need to connect to mongodb
// const mongoConnect = (callback) => {
//   client
//     .connect()
//     .then((client) => {
//       callback(); // when we pass param in callback then it means we are returing the client from here and can be used in other files where we call that callback
//     })
//     .catch((err) => {
//       throw err;
//     });
// };

// // It would be better if you could manage the connection in our database and then simply return access to the client which we
// // set up once from there to the rest of our application that need access to the database

// async function getDb() {
//   try {
//     await client.connect();
//     const database = client.db("admin");
//     return database;
//   } catch (error) {
//     console.error("Error connecting to MongoDB Atlas", error);
//     throw error;
//   }
// }

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://ipbcybe2022:M0ngoDBAryan@project0.lyxhh8a.mongodb.net/shop?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
    }
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
