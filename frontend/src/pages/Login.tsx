import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {auth} from '../firebaseConfig'
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { Button } from "@carbon/react";

const Login: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
          navigate("/Rooms"); // Redirect logged-in users
        }
      }, [user, navigate]);

    const googleSignIn = async () => {
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          console.log("Google Sign-In successful:", result.user);
        } catch (error) {
          console.error("Google Sign-In error:", error);
        }
      };


      return (
        <>
      <div className="mt-16 flex flex-col gap-6">
      <h2>Sign Up to Continue</h2>
      <Button onClick={googleSignIn} >Sign Up</Button>
      </div>
        </>
      )
}

export default Login