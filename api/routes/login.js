var express = require("express");
var router = express.Router();
const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGODB;

const mongoClient = new MongoClient(uri);

const dbName = "DIPLOMNA";
const collectionName = "accounts";
const collectionName2 = "loginHistory";

const clientPromise = mongoClient.connect();

router.post("/", async (req, res) => {
  const database = (await clientPromise).db(dbName);
  const collection = database.collection(collectionName);
  const collection2 = database.collection(collectionName2);

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
      collection2.insertOne({name: name, date: new Date()})
      res.send({ message: "successfully logged in" });
    }
  } catch (e) {
    console.error("Error:", e);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
