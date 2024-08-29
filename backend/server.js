require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db/connect");
const cors = require("cors");
const authRoute = require("./routes/auth");
const documentRoute = require("./routes/documents");
const shareRoute = require("./routes/share");
const Document = require("./modals/Document");
const cookieParser = require("cookie-parser");
const {backendURL, frontEndURL} = require("./utils/config");
const PORT = 3001;
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");
app.use(express.json());
app.use(
  cors({
    // origin: "https://drawhub-two.vercel.app",
    origin: frontEndURL,
    methods: ["GET", "POST"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  })
);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: "https://drawhub-two.vercel.app",
    origin: frontEndURL,
    methods: ["GET", "POST"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  },
});

app.use(cookieParser());
app.use("/auth", authRoute);
app.use("/document", documentRoute);
app.use("/share", shareRoute);

app.get("/", (req,res)=>{
  res.send("You are on Backend of DrawHub!");
})

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("userJoined", async (data) => {
    console.log(data);
    const {
      name,
      roomId,
      userId,
      userName,
      host,
      presenter,
      editAccess,
      email,
      title,
    } = data;
    const document = await findOrCreateDocument(roomId);
    socket.join(roomId);
    socket.roomId = roomId; // Store roomId in socket's custom data
    socket.email = email;
    socket.title = title;
    const users = addUser({
      name,
      roomId,
      userId,
      userName,
      host,
      presenter,
      editAccess,
      socketId: socket.id,
    });
    socket.emit("userConnected", { success: true });
    io.to(roomId).emit("usersList", { users: users });
    socket.emit("load-document", document.data);
  });

  socket.on("draw", ({ data, history }) => {
    const roomId = socket.roomId;
    // console.log(roomId);
    if (roomId) {
      socket.to(roomId).emit("onDraw", { data, history });
    }
  });

  socket.on("save", async (data) => {
    // console.log(data, socket.email, socket.title);

    try {
      const filter = { roomId: socket.roomId }; // Filter to find the document
      const update = { data: data, email: socket.email, title: socket.title }; // Update to be applied

      // Find the document with the specified roomId and update it with the new data and email
      if (socket.title != "") {
        const updatedDocument = await Document.findOneAndUpdate(
          filter,
          update,
          {
            new: true, // Return the modified document rather than the original
            upsert: true, // Create the document if it doesn't exist
          }
        );
        // console.log("Document updated:", updatedDocument);
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  });

  socket.on("updateEditAccess", async ({ userId, roomId, users }) => {
    // console.log(userId, roomId);
    // const users = await getUsersInRoom(roomId);
    const userToUpdate = await users.find((user) => user.userId === userId);
    console.log(userToUpdate);
    if (userToUpdate) {
      // console.log("hey", userToUpdate);
      userToUpdate.editAccess = !userToUpdate.editAccess;
      io.to(roomId).emit("usersList", { users: users });
      // io.to(roomId).emit("changeControls", { socketId: userToUpdate.socketId });
    }
  });

  socket.on("changeControls", ({ socketId, showControls }) => {
    // console.log(showControls);
    io.to(socketId).emit("sendControls", showControls);
  });

  socket.on("disconnect", async () => {
    const user = await removeUser(socket.id);
    const users = getUsersInRoom(user.roomId);
    // console.log(user);
    if (user) {
      io.to(user.roomId).emit("usersList", { users: users });
    }
    console.log(`User ${socket.id} disconnected`);
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findOne({ roomId: id });
  if (document) return document;
  return await Document.create({ roomId: id, data: {} });
}

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("server running on port", PORT);
  });
});



// module.exports = app;  // For deplotying on vercel
