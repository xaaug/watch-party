import socketIO from 'socket.io-client'
const socket = socketIO.connect('http://localhost:4000')

export default function WebSocketComponent () {
    return (
        <div>
          <p>Hello World!</p>
        </div>
      );
}