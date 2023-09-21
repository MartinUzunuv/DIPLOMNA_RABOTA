const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://d2:d2@cluster0.akv9o8h.mongodb.net/?retryWrites=true&w=majority";

const mongoClient = new MongoClient(uri);

const dbName = "DIPLOMNA";
const collectionName = "accounts";

const clientPromise = mongoClient.connect();

async function authenticate(req, res, next) {
  const requestData = req.body;
  if (requestData.name && requestData.password) {
    const database = (await clientPromise).db(dbName);
    const collection = database.collection(collectionName);
    if (
      await collection.findOne({
        name: requestData.name,
        password: requestData.password,
      })
    ) {
      return next();
    } else {
      res.redirect("http://localhost:3000/login");
    }
  } else {
    res.redirect("http://localhost:3000/login");
  }
}

module.exports = authenticate;
