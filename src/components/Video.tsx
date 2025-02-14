import {
  Pause,
  Play,
  Send,
  StopFilledAlt,
  VolumeMute,
  VolumeUp,
} from "@carbon/icons-react";
import { Tile, Button, TextInput } from "@carbon/react";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import { Socket } from "socket.io-client";
import { db } from "../firebaseConfig";
import useAuth from "../hooks/useAuth";
interface VideoData {
  url: string
}

interface Room {
  roomId: string;
  id: string
  videoData: VideoData
  hostId: string
}

interface Props {
  socket: Socket;
  fetchRoomData: () => Room[]}

const Video: React.FC<Props> = ({ socket, fetchRoomData }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number | undefined>(0);
  const [playerSize, setPlayerSize] = useState({ width: 640, height: 360 });
  const [mute, setMute] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<string>("");
  const [youtubeLink, setYoutubeLink] = useState<string>("");
  const [inputError, setInputError] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isHost, setIsHost] = useState<boolean>(false)
  
  const [roomData, setRoomData] = useState<Room[]>([]);

  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { roomId } = useParams();
  const {user }= useAuth()

  // TODO: Prevent the rerenders
  useEffect(() => {
    // Wait for the container to be available
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);

    updateSize(); // Run once on mount

    window.addEventListener("resize", updateSize);

    const fetchCollection = async () => {
      try {
        const fetchedData = await fetchRoomData();
        setRoomData(fetchedData.filter((dt: Room) => dt.roomId === roomId));
        if (roomData[0].videoData.url) {
          setVideoId(roomData[0].videoData.url)
        }
        if (roomData[0].hostId === user?.uid) {
          setIsHost(true)
        }
      } catch (error) {
        console.error("Error fetching collection:", error);
      } 
    };

    fetchCollection()


    const handlePlayEvent = (data: { playing: boolean, roomId: string }) => {
      setIsPlaying(data.playing);
      if (playerRef.current) {
        if (data.playing) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      }
    };

    const handleStopEvent = (data: { playing: boolean , roomId: string}) => {
      setIsPlaying(data.playing);
      if (playerRef.current) {
          playerRef.current.stopVideo();
        }
      
    };


    const updateTimeInterval = setInterval(() => {
      //    setCurrentTime(playerRef.current?.getCurrentTime())
    }, 500);

    const handleCurrentTime = (data: { time: number }) => {
      setCurrentTime(data.time);
      if (playerRef.current) {
        playerRef.current.seekTo(data.time, false);
      }
    };

    socket.on("PLAYEVENT", handlePlayEvent);
    socket.on("STOPEVENT", handleStopEvent);
    socket.on("CURRENTTIMEEVENT", handleCurrentTime);

    return () => {
      clearInterval(updateTimeInterval);
      window.removeEventListener("resize", updateSize);
      observer.disconnect();

      socket.off("PLAYEVENT", handlePlayEvent);
    };
  }, [socket, fetchRoomData, roomId, roomData, user]);

  

  const getYouTubeVideoId = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/
    );
    return match ? match[1] : null;
  };

  const updateSize = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const newHeight = (containerWidth * 9) / 16; // Maintain 16:9 aspect ratio
      setPlayerSize({ width: containerWidth, height: newHeight });
    }
  };

  const options = {
    width: playerSize.width,
    height: playerSize.height,
    playerVars: {
      controls: 0,
      disablekb: 1,
      rel: 0,
    },
  };

  const updateRoom = async (
    roomId: string,
    newData: Partial<{ videoData: { url: string } }>
  ) => {
    try {
      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, newData);
      console.log("Room updated successfully!");
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  const onPlayerReady = (e: { target: YT.Player }) => {
    playerRef.current = e.target;
    updateSize();
    socket.emit("PLAY", {
      playing: playerRef.current?.getPlayerState() === 1,
    });
    socket.emit("CURRENTTIME", { time: playerRef.current.getCurrentTime() });
  };

  const play = () => {
    setIsPlaying((prev) => {
      const newState = !prev;
      socket.emit("PLAY", { playing: newState, roomId: roomId });

      console.log(playerRef.current?.getCurrentTime());
      if (playerRef.current) {
        if (newState) {
          playerRef.current.playVideo();
        } else if (!newState) playerRef.current.pauseVideo();
      }

      return newState;
    });
  };

  const onPlay = () => {
    socket.emit("PLAY", { playing: true, roomId: roomId });
    playerRef.current?.playVideo()
  };

  const onPause = () => {
    socket.emit("PLAY", { playing: false, roomId: roomId });
    playerRef.current?.pauseVideo()
  };


  const muteEvent = () => {
    setMute((prev) => {
      const newState = !prev;

      if (playerRef.current) {
        if (newState) {
          playerRef.current.mute();
        } else if (!newState) playerRef.current.unMute();
      }

      return newState;
    });
  };

  const handleLinkSubmit = () => {
    const videoLink = getYouTubeVideoId(youtubeLink) || "";
    if (videoLink.length > 0) {
      setVideoId(videoLink);
      setInputError(false);
      updateRoom(roomData[0].id, {
        videoData: {
          url: videoLink
        }
      });
    } else {
      setInputError(true);
    }


  };

  const handleLinkInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeLink(e.target.value);
  };

  const handeleVideoError = () => {
    setVideoError(true);
  };

  //   TODO Emit to all
  const stopVideo = () => {
    socket.emit("STOP", { playing: false, roomId: roomId });
    playerRef.current?.stopVideo()
  };

  return (
  <><Tile>
      {videoId.length > 0 ? (
        <div>
          {videoError ? (
            <h2 className="text-lg text-[#da1e28]">Something went wrong</h2>
          ) : (
            <div ref={containerRef}>
              <YouTube
                opts={options}
                videoId={videoId}
                onReady={onPlayerReady}
                onError={handeleVideoError}
                onPlay={onPlay}
                onPause={onPause}
              />
              <div>
                <Button
                  kind="ghost"
                  renderIcon={!isPlaying ? Play : Pause}
                  hasIconOnly
                  onClick={play}
                />
                <Button
                  kind="ghost"
                  renderIcon={mute ? VolumeMute : VolumeUp}
                  hasIconOnly
                  onClick={muteEvent}
                />
               {isHost && <Button
                  kind="ghost"
                  renderIcon={StopFilledAlt}
                  hasIconOnly
                  onClick={stopVideo}
                />}
              </div>
            </div>
          )}{" "}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <h4 className="font-mono font-semibold">
            Paste Youtube Link to Start Watching
          </h4>
          <div className="flex gap-5 items-center">
            <TextInput
              onChange={handleLinkInput}
              placeholder="Youtube Link"
              labelText=""
              id="yt-link-input"
              invalidText="Please input a valid youtube link"
              invalid={inputError}
            />
            <Button hasIconOnly renderIcon={Send} onClick={handleLinkSubmit} />
          </div>
        </div>
      )}
    </Tile> 
  </>
  );
};

export default Video;
