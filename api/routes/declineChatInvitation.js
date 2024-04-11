var express = require("express");
var router = express.Router();
const authenticate = require("../authentication");
const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://d2:d2@cluster0.akv9o8h.mongodb.net/?retryWrites=true&w=majority";

const mongoClient = new MongoClient(uri);

const dbName = "DIPLOMNA";
const collectionName = "accounts";
const collectionName2 = "chats";

const clientPromise = mongoClient.connect();

router.post("/", authenticate, async (req, res) => {
  const database = (await clientPromise).db(dbName);
  const collection = database.collection(collectionName);
  const collection2 = database.collection(collectionName2);

  const requestData = req.body;
  const name = requestData.name;
  const password = requestData.password;
  const chatId = requestData.chatId;

  collection.updateOne(
    {
      name: name,
      password: password,
    },
    {
      $pull: { waiting: chatId },
    }
  );

  res.send({});
});

module.exports = router;
