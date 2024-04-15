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

  const requestData = req.body;
  const name = requestData.name;
  const password = requestData.password;

  if (await collection.findOne({ name: name })) {
    res.send({ message: "this name has already been used" });
  } else {
    collection.insertOne({ name: name, password: password, chats: [], waiting: [] });
    res.send({ message: "created new account" });
  }
});

module.exports = router;
