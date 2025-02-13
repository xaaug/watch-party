import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Room from "./pages/Room";
import Rooms from "./pages/Rooms";

import {io} from "socket.io-client";
const socket = io("http://localhost:4000");

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="rooms" element={<Rooms />}/>
          <Route path="room/:id" element={<Room socket={socket}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
