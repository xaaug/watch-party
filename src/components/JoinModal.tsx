import { ComposedModal, Button, ModalBody, ModalHeader, TextInput, ButtonSet } from "@carbon/react"
import { useState } from "react"
import ReactDOM from "react-dom"
import { Link } from "react-router-dom"

const JoinModal: React.FC = () => {
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
                    <TextInput id="room-code-input" placeholder="Enter room code" labelText='Room Code'/>
                    <div className="mt-8">
                    <ButtonSet >
                      <Button kind="tertiary" onClick={() => setOpen(false)}>Cancel</Button>
                      <Link to="/4" >
                      <Button kind="primary">Join Room</Button>
                      </Link>
                    </ButtonSet>
                    </div>
                    </div>
                </ModalBody>
              </ComposedModal>,
              document.body
            )}
        <Button kind="secondary" onClick={() => setOpen(true)}>
          Join Room
        </Button>
      </>)
}

export default JoinModal