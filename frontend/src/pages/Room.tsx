import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "@carbon/icons-react";
import {
  Button,
  Checkbox,
  ExpandableTile,
  Loading,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
} from "@carbon/react";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

import Chat from "../components/Chat";
import Video from "../components/Video";
import useAuth from "../hooks/useAuth";
import ActiveUsers from "../components/ActiveUsers";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebaseConfig";

interface VideoData {
  url: string
}

interface Room {
  roomId: string;
  id: string
  messages: Message[]
  videoData: VideoData
  hostId: string
}

type Message = {
  message: string;
  sender: string;
};

interface Props {
  socket: Socket;
  fetchData: () => Promise<Room[] | undefined>;
}

const Room: React.FC<Props> = ({ socket, fetchData }) => {
  const [chatExpanded, setChatExpanded] = useState<boolean>(false);
  const [roomPresent, setRoomPresent] = useState<boolean | undefined>(true);
  const [roomData, setRoomData] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { roomId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      try {
        const fetchedData = await fetchData();
        if (fetchedData)  
          { setRoomPresent(!!fetchedData.find((dt: Room) => dt.roomId === roomId));  setRoomData(fetchedData.filter((dt: Room) => dt.roomId === roomId));}

      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();

    if (user?.displayName ) {
          socket.emit("join", {
            roomId: roomId,
            user: user.displayName.split(" ")[0],
          });}


  }, [roomId, fetchData, user, socket]);

 const updateRoom = async (
    roomId: string,
    userId: string
  ) => {
    try {
      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, {
        participants: arrayUnion(userId)
      });
      console.log("Room updated successfully!");
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };


  useEffect(() => {
    if (user?.displayName && roomData.length > 0) {
      socket.emit("join", {
        roomId: roomId,
        user: user.displayName.split(" ")[0],
      });
  
      updateRoom(roomData[0].id, user.uid); // ✅ Ensure `roomData[0]` is available
    }
  }, [roomId, socket, user, roomData]);

 

  const handleChatChange = () => {
    setChatExpanded((prev) => !prev);
  };

  

  return (
    <>
      {loading ? (
        <Loading active />
      ) : (
        <div className="py-6 px-2">
          {roomPresent ? (
            <div>
              <Link
                to="../rooms"
                className="flex items-center text-base gap-2 hover:underline"
              >
                <ArrowLeft size="18" />
                All Rooms
              </Link>

              <div className="mt-6">
                <Checkbox
                  labelText="Show Chat"
                  id="show-chat"
                  onChange={handleChatChange}
                />

                <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:min-w-[80%]">
                <Video socket={socket} fetchRoomData={fetchData}/>
                </div>
                 <div className="flex flex-col gap-8">
                 <ExpandableTile
                    expanded={chatExpanded}
                    id="expandable-tile-1"
                    tileCollapsedIconText="Interact to Expand tile"
                    tileExpandedIconText="Interact to Collapse tile"
                  >
                    <TileAboveTheFoldContent>
                      <div>
                        <p className="text-sm font-mono">
                          Chat with people in the room
                        </p>
                      </div>
                    </TileAboveTheFoldContent>
                    <TileBelowTheFoldContent>
                      <Chat socket={socket} roomInfo={roomData} />
                    </TileBelowTheFoldContent>
                  </ExpandableTile>
                <ActiveUsers socket={socket}/>
                 </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 mt-6">
              <p className="text-lg">Room Not Found</p>
              <Link to="../rooms">
                <Button>All Rooms</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Room;
