var express = require("express");
var router = express.Router();
const authenticate = require("../authentication");
const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://d2:d2@cluster0.akv9o8h.mongodb.net/?retryWrites=true&w=majority";

const mongoClient = new MongoClient(uri);

const dbName = "DIPLOMNA";
const collectionName = "chats";

const clientPromise = mongoClient.connect();

router.post("/", authenticate, async (req, res) => {
  const database = (await clientPromise).db(dbName);
  const collection = database.collection(collectionName);

  const requestData = req.body;
  const name = requestData.name;
  const id = requestData.id;

  const messages = await collection.findOne({
    id: id,
    owners: { $in: [name] },
  });
  res.send({ messages: messages.messages });
});

module.exports = router;
