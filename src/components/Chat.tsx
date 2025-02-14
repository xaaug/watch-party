import { Send } from "@carbon/icons-react";
import { TextInput, Button } from "@carbon/react";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import useAuth from "../hooks/useAuth";
import { db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

type SocketMessage = {
  text: string;
  id: string;
  socketID: string;
  sender: string;
};

type Message = {
  message: string;
  sender: string;
};

type Props = {
  socket: Socket;
  roomInfo: { roomId: string; messages: Message[]; id: string }[];
};

const Chat: React.FC<Props> = ({ socket, roomInfo }) => {
  // const { roomId } = useParams();

  const [chatInputValue, setChatInputValue] = useState("");
  const [prevMessages, setPrevMessages] = useState<Message[]>([]);
  const [messages, setMessages] = useState<SocketMessage[]>([]);

  const roomDataObj = roomInfo?.[0];

  // console.log(roomDataObj.roomId);

  const { user } = useAuth();

  useEffect(() => {

    const handleMessageResponse = (data: SocketMessage) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("messageResponse", handleMessageResponse);

    if (roomDataObj?.messages.length > 0) {
      setPrevMessages(roomDataObj.messages as Message[]);
    }

    return () => {
      socket.off("messageResponse", handleMessageResponse);
    };
  }, [socket, roomDataObj]);

  const updateRoom = async (
    roomId: string,
    newData: Partial<{ messages: { message: string; sender: string }[] }>
  ) => {
    try {
      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, newData);
      console.log("Room updated successfully!");
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  const handleSubmit = () => {
    if (chatInputValue.trim()) {
      socket.emit("message", {
        text: chatInputValue,
        id: `${socket.id}${Math.random()}`,
        sender: user?.displayName?.split(" ")[0],
        socketID: socket.id,
        roomId: roomDataObj.roomId,
      });

      updateRoom(roomDataObj.id, {
        messages: [
          ...(roomDataObj.messages ?? []), // Ensure messages is an array
          { message: chatInputValue, sender: user?.displayName ?? "Unknown" },
        ],
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
          {prevMessages.length > 0 && (
            <div className="flex flex-col gap-4">
              {prevMessages.map((message) => (
                <li>
                  <span className="text-xs text-gray-500">
                    {message.sender}
                  </span>
                  <p className="text-sm">{message.message}</p>
                </li>
              ))}
            </div>
          )}
          
            {messages.map((message) => (
            <li>
              <span className="text-xs text-gray-500">{message.sender}</span>
              <p className="text-sm">{message.text}</p>
            </li>
          ))}

          {messages.length == 0 || prevMessages.length == 0 &&  <p className="text-sm text-gray-500">Start the conversation</p>}
        </ul>

        <div className="flex gap-4 items-center">
          <TextInput
            onChange={(e) => handleInput(e)}
            placeholder="Send message"
            id="room-chat-input"
            labelText=""
            value={chatInputValue}
          />
          <Button renderIcon={Send} hasIconOnly onClick={handleSubmit}/>
        </div>
      </div>
    </>
  );
};

export default Chat;
