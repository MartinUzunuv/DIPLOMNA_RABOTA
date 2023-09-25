var express = require("express");
var router = express.Router();
const authenticate = require("../authentication");
const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://d2:d2@cluster0.akv9o8h.mongodb.net/?retryWrites=true&w=majority";

const mongoClient = new MongoClient(uri);

const dbName = "DIPLOMNA";
const collectionName = "chats";
const collectionName2 = "accounts";

const clientPromise = mongoClient.connect();

router.post("/", authenticate, async (req, res) => {
  const database = (await clientPromise).db(dbName);
  const collection = database.collection(collectionName);
  const collection2 = database.collection(collectionName2);

  const requestData = req.body;
  const newPerson = requestData.newPerson;
  const name = requestData.name;
  const chatId = requestData.chatId;

  let newId = chatId;

  if (
    await collection.findOne({ id: newId, owners: { $in: [name, newPerson] } })
  ) {
    res.send({ id: newId });
  }

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
      owners: [requestData.name, newPerson],
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
      collection2.updateOne({ name: newPerson }, { $push: { waiting: newId } });
    }
  }

  res.send({ id: newId });
});

module.exports = router;
