import { Button, Loading } from "@carbon/react";
import Modal from "../components/JoinModal";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

interface Props {
    fetchData: () =>  Promise<{ id: string; roomId: string }[] | undefined>
    }


const Home: React.FC<Props> = ({fetchData}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const addRoom = async () => {
    setLoading(true);
    const room_id = Math.random().toString(36).substring(2, 10);
    try {
        const docRef = await addDoc(collection(db, "rooms"), {
            roomId: room_id,
            hostId: user?.uid,
            thumbnail: "",
            participants: [],
            videoData: {},
            messages: []
        });
        navigate(`room/${room_id}`);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? <Loading active description="Loading" /> : null}
      <div className="flex flex-col md:items-center gap-6 mt-60">
        <h2 className="font-mono font-bold">
          Watch Together, Anytime, Anywhere
        </h2>
        <div>
          <Button onClick={addRoom}>Create Room</Button>
          <Modal fetchData={fetchData}/>
        </div>
      </div>
    </>
  );
};

export default Home;
