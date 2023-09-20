var express = require("express");
var router = express.Router();
var OpenAI = require("openai");
const authenticate = require('../authentication');

const openai = new OpenAI({
  apiKey: "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",
});

async function chatGptResponse(messages) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
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
  const requestData = req.body;
  const oldMessages = requestData.messages;
  const newMessage = await chatGptResponse(oldMessages);
  res.send(newMessage);
});

module.exports = router;
