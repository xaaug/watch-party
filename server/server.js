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

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });

    socket.on('message', data => {
       socketIO.emit('messageResponse', data)
    })

    socket.on('PLAY', data => {
      socketIO.emit('PLAYEVENT' , data)
    })

    socket.on('MUTE', data => {
      socketIO.emit('MUTEEVENT', data)
    })

    socket.on('CURRENTTIME', data => {
      socketIO.emit('CURRENTTIMEEVENT', data)
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