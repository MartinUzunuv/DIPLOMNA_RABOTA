var express = require("express");
var router = express.Router();
const authenticate = require("../authentication");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGODB;

const mongoClient = new MongoClient(uri);

const dbName = "DIPLOMNA";
const collectionName = "accounts";
const collectionName2 = "chats";
const collectionName3 = "declinedChatInvitations";

const clientPromise = mongoClient.connect();

router.post("/", authenticate, async (req, res) => {
  const database = (await clientPromise).db(dbName);
  const collection = database.collection(collectionName);
  const collection2 = database.collection(collectionName2);
  const collection3 = database.collection(collectionName3);

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

  collection3.insertOne({ date: new Date(), chatId: chatId, name: name });

  res.send({});
});

module.exports = router;
