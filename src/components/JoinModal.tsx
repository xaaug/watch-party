import { ComposedModal, Button, ModalBody, ModalHeader, TextInput, ButtonSet } from "@carbon/react"
import { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { useNavigate } from "react-router-dom"

interface Room {
  roomId: string;
}

interface Props {
  fetchData: () => [];
}

const JoinModal: React.FC<Props> = ({fetchData}) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [error, setError] = useState<boolean>(false)
  const [rooms, setRooms] = useState([])

  const navigate = useNavigate()

 useEffect(() => {
  const fetchCollection = async () => {
    try {
      const fetchedData = await fetchData();
      setRooms(fetchedData);
    //   setRoomPresent(fetchedData.find((dt: Room) => dt.roomId === roomId));
    } catch (error) {
      console.error("Error fetching collection:", error);
    } 
  };
  fetchCollection();
 }, [fetchData, inputValue, ] )

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)

  }

  const handleSubmit = () => {
    if ((rooms.find((room: Room) => room.roomId === inputValue))) {
      navigate(`/room/${inputValue}`)
    } else {
      setError(true)
    }
  }
  
    const [open, setOpen] = useState<boolean>(false)
    return (  <>
        {typeof document === 'undefined'
          ? null
          : ReactDOM.createPortal(
              <ComposedModal open={open} onClose={() => setOpen(false)}>
                <ModalHeader closeModal={() => setOpen(false)}>
                    <h3>Join a room</h3>
                </ModalHeader>
                <ModalBody >
                    <div className="flex flex-col gap-4">
                    <p>Enter the room code to sync up and start watching together.</p>
                    <TextInput id="room-code-input" invalid={error} invalidText='Room not found' onChange={(e) => handleInput(e)} placeholder="Enter room code" labelText='Room Code'/>
                    <div className="mt-8">
                    <ButtonSet >
                      <Button kind="tertiary" onClick={() => setOpen(false)}>Cancel</Button>
                      <Button kind="primary" onClick={handleSubmit}>Join Room</Button>
                    </ButtonSet>
                    </div>
                    </div>
                </ModalBody>
              </ComposedModal>,
              document.body
            )}
        <Button kind="secondary" onClick={() => {setOpen(true)}}>
          Join Room
        </Button>
      </>)
}

export default JoinModal