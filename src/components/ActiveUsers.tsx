import {
  ExpandableTile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
} from "@carbon/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import useAuth from "../hooks/useAuth";

interface Props {
  socket: Socket;
}

interface User {
  roomId: string;
  socketId: string;
  user: string;
}

const ActiveUsers: React.FC<Props> = ({ socket }) => {
  const [users, setUsers] = useState([]);
  const { roomId } = useParams();

  const {user } = useAuth()
  console.log(roomId);

  useEffect(() => {
    try {
      socket.on("newMemberResponse", (data) => {
        setUsers(data.filter((dt: User) => dt.roomId === roomId));
      });
    } catch (error) {
      console.error(error);
    }
  }, [socket, roomId, users]);
  return (
    <>
      <div>
        <ExpandableTile
          id="expandable-tile-1"
          tileCollapsedIconText="Interact to Expand tile"
          tileExpandedIconText="Interact to Collapse tile"
        >
          <TileAboveTheFoldContent>
            <div>Active Members</div>
          </TileAboveTheFoldContent>
          <TileBelowTheFoldContent>
            <div className="mt-6 mb-12"><ul className="flex flex-col gap-4 pl-4 list-disc">
                {users.length > 0 ? users.map((user: User) => <li>{user.user}</li>) : <li>{user?.displayName?.split(' ')[0]}</li>}
                </ul>
                </div>
          </TileBelowTheFoldContent>
        </ExpandableTile>
      </div>
    </>
  );
};

export default ActiveUsers;
