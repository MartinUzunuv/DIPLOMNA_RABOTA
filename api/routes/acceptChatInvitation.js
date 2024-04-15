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
const collectionName3 = "acceptedChatInvites";

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

  collection3.insertOne({date: new Date(), name: name, chatId: chatId})

  collection.updateOne(
    {
      name: name,
      password: password,
    },
    {
      $pull: { waiting: chatId },
    }
  );

  const chat = await collection2.findOne({ id: chatId });

  if (chat) {
    collection.updateOne(
      {
        name: name,
        password: password,
      },
      {
        $addToSet: {
          chats: { id: chatId, title: chat.messages[1].content },
        },
      }
    );
  }

  res.send({});
});

module.exports = router;
