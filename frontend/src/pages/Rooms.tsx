import useAuth from "../hooks/useAuth";
import {
  Button,
  ExpandableTile,
  Tile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
} from "@carbon/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Room {
  hostId: string;
  roomId: string;
  id: string;
  participants: string[];
}

interface Props {
  fetchData: () => Promise<Room[] | undefined>;
}

const Rooms: React.FC<Props> = ({ fetchData }) => {
  const { user } = useAuth();

  const [userRooms, setUserRooms] = useState<Room[]>([]);
  const [roomsIn, setRoomsIn] = useState<Room[]>([]);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const fetchedData = await fetchData();
        if (fetchedData) {
          setUserRooms(
            fetchedData.filter((dt: Room) => dt.hostId === user?.uid)
          );
          setRoomsIn(
            fetchedData.filter((dt: Room) =>
              dt.participants.includes(user!.uid)
            )
          );
        }
      } catch (error) {
        console.error("Error fetching collection:", error);
      }
    };

    fetchCollection();
  }, [user, fetchData]);

  return (
    <>
      <p className="mt-6 text-2xl font-semibold font-mono ">
        Hello {user?.displayName?.split(" ")[0]}👋
      </p>
      <div className="mt-6">
        <ExpandableTile
          id="expandable-tile-1"
          tileCollapsedIconText="Interact to Expand tile"
          tileExpandedIconText="Interact to Collapse tile"
        >
          <TileAboveTheFoldContent>
            <div>
              <h3 className="font-mono text-xl">Your Rooms</h3>
            </div>
          </TileAboveTheFoldContent>
          <TileBelowTheFoldContent>
            {userRooms.length > 0 ? (
              <div className="mt-8 mb-12 flex flex-col gap-2">
                {userRooms.map((room) => (
                  <Link to={`/room/${room.roomId}`}>
                    <Tile>
                      <p>{room.roomId}</p>
                    </Tile>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-6 mt-6">
                <p className="text-lg">You haven't created any rooms</p>
                <Link to="/">
                  <Button>Create a Room</Button>
                </Link>
              </div>
            )}
          </TileBelowTheFoldContent>
        </ExpandableTile>
      </div>

      <div className="my-6">
        <ExpandableTile
          id="expandable-tile-1"
          tileCollapsedIconText="Interact to Expand tile"
          tileExpandedIconText="Interact to Collapse tile"
        >
          <TileAboveTheFoldContent>
            <div>
              <h3 className="font-mono text-xl">Rooms In</h3>
            </div>
          </TileAboveTheFoldContent>
          <TileBelowTheFoldContent>
            {roomsIn.length > 0 ? (
              <div className="mt-8 mb-12 flex flex-col gap-2">
                {roomsIn.map((room) => (
                  <Link to={`/room/${room.roomId}`}>
                    <Tile>
                      <p>{room.roomId}</p>
                    </Tile>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-6 mt-6">
                <p className="text-lg">You haven't joined any rooms</p>
                <Link to="/">
                  <Button kind="secondary">Join a Room</Button>
                </Link>
              </div>
            )}
          </TileBelowTheFoldContent>
        </ExpandableTile>
      </div>
    </>
  );
};

export default Rooms;
