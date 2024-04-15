var express = require("express");
var router = express.Router();
const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGODB;

const mongoClient = new MongoClient(uri);

const dbName = "DIPLOMNA";
const collectionName = "accounts";

const clientPromise = mongoClient.connect();

router.post("/", async (req, res) => {
  const database = (await clientPromise).db(dbName);
  const collection = database.collection(collectionName);
  const collection2 = database.collection("chats");

  const requestData = req.body;
  const name = requestData.name;

  const account = await collection.findOne({ name: name });

  let newArray = [];

  if (account && account.waiting) {
    for (let i = 0; i < account.waiting.length; i++) {
      const newChat = await collection2.findOne({ id: account.waiting[i] });
      newArray.push({
        owners: newChat.owners,
        name: newChat.messages[1],
        id: newChat.id,
      });
    }
  }
  console.log(newArray);

  res.send({ chats: newArray });
});

module.exports = router;
