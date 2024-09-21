const express = require("express");
const app = express();
const { chats } = require("./data/data");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
const colors = require("colors");

const path = require("path");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const connecDb = require("./config/db");
connecDb();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
const server = app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`.yellow.bold);
});

// ------------ Deployment----------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    app.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Welcome");
  });
}

const io = require("socket.io")(server, {
  pingTimeout: 8000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // Create user connection with socketIO
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // For Joining the user with ro0m
  socket.on("join_chat", (room) => {
    socket.join(room);
    console.log("User joined the room", room);
  });

  socket.on("new_message", (newMessageReceived) => {
    var chat = newMessageReceived.chatId;

    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      // It means user not receive their messages it self
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("meesage_received", newMessageReceived);
    });
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop_typing", (room) => {
    socket.in(room).emit("stop_typing");
  });

  socket.off("setup", () => {
    console.log("User Disconnectd");
    socket.leave(userData._id);
  });
});
