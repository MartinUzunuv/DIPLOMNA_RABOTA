const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const authenticate = require("../authentication");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGODB;

const mongoClient = new MongoClient(uri);

const dbName = "DIPLOMNA";
const collectionName = "chats";

const clientPromise = mongoClient.connect();

const openai = new OpenAI({
  apiKey: "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",
});

async function chatGptResponse(messages, model) {
  const response = await openai.chat.completions.create({
    model: model || "gpt-4",
    messages: messages,
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return response.choices[0].message.content;
}

router.post("/", authenticate, async (req, res) => {
  const database = (await clientPromise).db(dbName);
  const collection = database.collection(collectionName);
  const requestData = req.body;
  const oldMessages = requestData.messages;
  const chatId = requestData.chatId;
  const model = requestData.model;
  const newMessage = await chatGptResponse(oldMessages, model);
  if (chatId === 0) {
    let newId = 0;
    do {
      newId = Math.random() * 10000;
    } while (await collection.findOne({ id: newId }));
    collection.insertOne({
      owners: [requestData.name],
      id: newId,
      messages: [...oldMessages, { content: newMessage, role: "assistant" }],
    });
    const collection2 = database.collection("accounts");
    collection2.updateOne(
      { name: requestData.name },
      { $push: { chats: { id: newId, title: oldMessages[1].content } } }
    );
    res.send({ messages: newMessage, id: newId });
  } else {
    collection.updateOne(
      { id: chatId, owners: { $in: [requestData.name] } },
      {
        $set: {
          messages: [
            ...oldMessages,
            { content: newMessage, role: "assistant" },
          ],
        },
      }
    );
    res.send({ messages: newMessage, id: chatId });
  }
});

module.exports = router;
