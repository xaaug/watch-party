import { Button } from "@carbon/react"
import Modal from "../components/JoinModal"
import {  useNavigate } from "react-router-dom"


const Home: React.FC = () => {
    const navigate = useNavigate()

    const generateRoomId = () => {
        const room_id = Math.random().toString(36).substring(2, 10)
        navigate(`room/${room_id}`)
    }

    return (
        <>
        <div className="flex flex-col md:items-center gap-6 mt-60">
            <h2 className="font-mono font-bold">Watch Together, Anytime, Anywhere</h2>
            <div>
                <Button onClick={generateRoomId}>Create Room</Button>
                <Modal />
            </div>
        </div>
        </>
    )
}

export default Home