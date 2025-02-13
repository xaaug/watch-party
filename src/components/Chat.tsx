import { Send } from "@carbon/icons-react";
import { TextInput, Button } from "@carbon/react";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type Message = {
    text: string, id: string, socketID: string
}

type Props = {
    socket: Socket
}

const Chat: React.FC<Props> = ({ socket }) => {
  const [chatInputValue, setChatInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on('messageResponse',( data: Message) => setMessages([...messages, data]))
  }, [socket, messages])

  const handleSubmit = () => {
    if (chatInputValue.trim()) {
      socket.emit("message", {
        text: chatInputValue,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
      setChatInputValue("");
    }
  };

  const handleInput = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setChatInputValue(target.value);
  };


  return (
    <>
      <div className="mt-6 mb-12">
        <ul className="p-2 flex flex-col gap-4 mb-2">

          {messages.map((message) => (
            <li key={message.id}>
              <span className="text-xs text-gray-500">{message.socketID}</span>
              <p className="text-sm">{message.text}</p>
            </li>
          ))}
        </ul>
        <div className="flex gap-4 items-center">
          <TextInput
            onChange={(e) => handleInput(e)}
            placeholder="Send message"
            id="room-chat-input"
            labelText=""
            value={chatInputValue}
          />
          <Button renderIcon={Send} onClick={handleSubmit}>
            Send
          </Button>
        </div>
      </div>
    </>
  );
};

export default Chat;
