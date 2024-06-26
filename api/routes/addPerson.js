var express = require("express");
var router = express.Router();
const authenticate = require("../authentication");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGODB;

const mongoClient = new MongoClient(uri);

const dbName = "DIPLOMNA";
const collectionName = "chats";
const collectionName2 = "accounts";
const collectionName3 = "invitations";

const clientPromise = mongoClient.connect();

router.post("/", authenticate, async (req, res) => {
  const database = (await clientPromise).db(dbName);
  const collection = database.collection(collectionName);
  const collection2 = database.collection(collectionName2);
  const collection3 = database.collection(collectionName3);

  const requestData = req.body;
  const newPerson = requestData.newPerson;
  const name = requestData.name;
  const chatId = requestData.chatId;

  let newId = chatId;

  collection3.insertOne({date: new Date(), from: name, to: newPerson, chatId: chatId})

  if (
    !(await collection.findOne({ id: newId, owners: { $in: [newPerson] } }))
  ) {
    if (newId !== 0) {
      collection.updateOne(
        { id: newId, owners: { $in: [name] } },
        { $push: { owners: newPerson } }
      );
    } else {
      do {
        newId = Math.random() * 10000;
      } while (await collection.findOne({ id: newId }));
      await collection.insertOne({
        owners: [name, newPerson],
        id: newId,
        messages: [
          {
            role: "assistant",
            content: "Hi, how can I help you today?",
          },
        ],
      });
    }

    if (
      !(await collection2.findOne({
        name: newPerson,
        chats: { $in: [newId] },
      })) &&
      !(await collection2.findOne({
        name: newPerson,
        waiting: { $in: [newId] },
      }))
    ) {
      if (await collection2.findOne({ name: newPerson })) {
        collection2.updateOne(
          { name: newPerson },
          { $push: { waiting: newId } }
        );
      }
    }
  }

  res.send({ id: newId });
});

module.exports = router;
