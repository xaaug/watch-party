import { Link } from "react-router-dom";
import { ArrowLeft } from "@carbon/icons-react";
import {
  Checkbox,
  ExpandableTile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
} from "@carbon/react";
import { useState } from "react";
import { Socket } from "socket.io-client";

import Chat from "../components/Chat";
import Video from "../components/Video";


interface Props {
  socket: Socket
}

const Room: React.FC<Props> = ({socket}) => {
  const [chatExpanded, setChatExpanded] = useState<boolean>(false);

  const handleChatChange = () => {
    setChatExpanded((prev) => !prev);
  };

  return (
    <>
      <div className="py-6 px-2">
        <Link
          to="../rooms"
          className="flex items-center text-base gap-2 hover:underline"
        >
          <ArrowLeft size="18" />
          Back
        </Link>

        <div className="mt-6">
          <Checkbox
            labelText="Show Chat"
            id="show-chat"
            onChange={handleChatChange}
          />

          <div className="flex flex-col gap-8">
            <Video />
            <ExpandableTile
              expanded={chatExpanded}
              id="expandable-tile-1"
              tileCollapsedIconText="Interact to Expand tile"
              tileExpandedIconText="Interact to Collapse tile"
            >
              <TileAboveTheFoldContent>
                <div>
                  <p className="text-sm">Chat with people in the room</p>
                </div>
              </TileAboveTheFoldContent>
              <TileBelowTheFoldContent>
                <Chat socket={socket}/>
              </TileBelowTheFoldContent>
            </ExpandableTile>
          </div>
        </div>
      </div>
    </>
  );
};

export default Room;
