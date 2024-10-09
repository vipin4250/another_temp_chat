// require('dotenv').config();
const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddlewares"); 
const path = require("path");

dotenv.config();
connectDB();
const port = process.env.PORT || 3000

const app = express();

app.use(express.json());

  app.use(cors({
    origin: ["http://localhost:3001","https://another-temp-chat.vercel.app"] ,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));

app.get("/" , (req, res) => {
    res.send("This is my first chat app");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


// // --------------------------deployment------------------------------

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

// // --------------------------deployment------------------------------

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`.yellow.bold);
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io vipin");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
        console.log("New message received: ", newMessageReceived);  // Log the new message
    
        var chat = newMessageReceived.chat;
    
        if (!chat.users) {
            console.log("chat.users not found");
            return;
        }
    
        // Log the users in the chat
        console.log("Chat users: ", chat.users);
    
        chat.users.forEach((user) => {
            console.log(`Checking user: ${user._id}`);
            
            if (user._id == newMessageReceived.sender._id) {
                console.log("Skipping sender:", user._id);
                return; // Don't emit to the sender
            }
    
            console.log(`Emitting to user: ${user._id}`);
            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });
    
    
});
