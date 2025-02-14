import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Room from "./pages/Room";
import Rooms from "./pages/Rooms";

import {io} from "socket.io-client";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import NotFound from "./pages/NotFoundPage";
const socket = io("https://watch-party-2.onrender.com");


const App: React.FC = () => {

    const fetchCollection = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "rooms"));
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            roomId: (doc.data()).roomId, // Ensure `roomId` exists
            messages: (doc.data()).messages ?? [], // Default empty array
            videoData: (doc.data()).videoData ?? { url: "" }, // Default empty object
            hostId: (doc.data()).hostId ?? "", // Default empty string
            participants: (doc.data()).participants ?? [], // Default empty array
          }));
         if(data){
           return data;
         } else {
          return undefined;
         }
        } catch (error) {
          console.error("Error fetching collection:", error);
        }
      };
    
      
  
  return (


    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home fetchData={fetchCollection}/>} />
          <Route path="rooms" element={<ProtectedRoute><Rooms fetchData={fetchCollection}/></ProtectedRoute>}/>
          <Route path="room/:roomId" element={<ProtectedRoute><Room fetchData={fetchCollection} socket={socket}/></ProtectedRoute>} />
          <Route path="/login" element={<Login />}/>

          <Route path="*" element={<NotFound />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
