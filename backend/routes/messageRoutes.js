const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");
const route = express.Router();

route.post("/", protect, sendMessage);
route.get("/:chatId", protect, allMessages);

module.exports = route;
