import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express() // Initialize Server
app.use(cors()) //Aloows connection between frontedn and backend

const server  = createServer(app) 
const io = new Server(server, {
  cors: {
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST']
  }
})

io.on("connection", socket => {
  console.log('A user connected', socket.id)

  socket.on("sendMessasge", message => {
    console.log('Message sent', message)
    io.emit('receivedMessage', message) // Sends message to all clients
  })

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id)
  })
})

const PORT = 8080
server.listen(PORT, console.log('Server listening at port 8080'))