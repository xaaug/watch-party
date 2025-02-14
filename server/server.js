const express = require('express');
const app = express();
const PORT = 4000;

//New imports
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});

let users = []

app.get("/", (req, res) => {
  res.send("Socket.io Server is running!");
});

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);


  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    users = users.filter((user) => user.socketId !== socket.id);
  });


  socket.on('join', data => {
    const { user, roomId } = data
    users.push({...data, socketId: socket.id})
    console.log(users)
    socket.join(roomId)
    socketIO.to(data.roomId).emit('newMemberResponse', users)
    console.log(`${user} joined in room ${roomId}`)
  })


  socket.on('message', data => {
    console.log(data)
    console.log(`Message in room ${data.roomId}:`, data);
    socketIO.to(data.roomId).emit('messageResponse', data)
  })


  socket.on('PLAY', data => {
    socketIO.to(data.roomId).emit('PLAYEVENT', data)
  })


  socket.on('STOP', data => {
    socketIO.to(data.roomId).emit('STOPEVENT', data)
  })

  socket.on('CURRENTTIME', data => {
    socketIO.to(data.roomId).emit('CURRENTTIMEEVENT', data)
  })
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});