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
const ko = require("socket.io")(7000, {
  cors: {
    origin: "http://localhost:3000",
  }
})
var a=['X','O']
app.use(cors());
var users=[]
var i=0
ko.on("connection", (socket) => {
  //when ceonnect
  //take userId and socketId from user
 
  console.log('connected')
  socket.on('getpiece',()=>{
    var pis=a[i]
 
    ko.emit('piece',pis)
    console.log(pis,'119')
    i=i+1
    if(i>1){
      i=0
    }
    console.log(i)
  })
  socket.on("gamestate",(array,name) => {
    var nam=name
    const data={name:name,array:array}
      ko.emit('setboard',data)
     
  });
  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
  });
});
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
    socket.on("gamestate",(gandi) => {
      console.log(gandi)  
  });
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");

    
    });
  });
server.listen('8000',()=>{
    console.log('connected')
})
