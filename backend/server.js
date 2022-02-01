const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(9000, {
    cors: {
      origin: "http://localhost:3000",
    }
})
app.use(cors());
var users=[]
io.on("connection", (socket) => {
    //when ceonnect
    //take userId and socketId from user
    socket.on("addUser",(room,message,user) => {
        console.log(user)
        socket.join(room)
    console.log(user)
      var data={'message':message,'user':user}
      io.to(room).emit("getusers",data);
    });
  
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
     
      const user = getUser(receiverId);
      console.log(user)
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");

    
    });
  });
server.listen('8000',()=>{
    console.log('connected')
})
