var express = require("express");
var router = express.Router();
const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://d2:d2@cluster0.akv9o8h.mongodb.net/?retryWrites=true&w=majority";

const mongoClient = new MongoClient(uri);

const dbName = "DIPLOMNA";
const collectionName = "accounts";

const clientPromise = mongoClient.connect();

router.post("/", async (req, res) => {
  const database = (await clientPromise).db(dbName);
  const collection = database.collection(collectionName);

  const requestData = req.body;
  const name = requestData.name;
  const password = requestData.password;

  const account = await collection.findOne({ name: name });

  try {
    if (!account) {
      res.send({ message: "account does not exist" });
    } else if (account.password !== password) {
      res.send({ message: "wrong password" });
    } else {
      res.send({ message: "successfully logged in" });
    }
  } catch (e) {
    console.error("Error:", e);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
