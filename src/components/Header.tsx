import { Link } from 'react-router-dom'
import { auth } from '../firebaseConfig'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import useAuth from '../hooks/useAuth'
import { Button } from '@carbon/react'

const Header: React.FC = () => {
    const {user} = useAuth()

    const signIn = async () => {
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          console.log("Google Sign-In successful:", result.user);
        } catch (error) {
          console.error("Google Sign-In error:", error);
        }
      };

      const logout = async () => {
        try {
          await signOut(auth);
          console.log("User signed out");
        } catch (error) {
          console.error("Sign out error:", error);
        }
      };

    return (<>
    <header className='bg-[#161616]  px-6 py-3'>
        <nav className='flex justify-between items-center '>
            <Link to='/'  className='text-white'>Home</Link>
            <div className='flex gap-6 items-center'>
            <Link to='rooms' className='text-white'>Rooms</Link>
            <Button onClick={user ? logout : signIn}>{!user ? 'Sign In' : 'Sign Out'}
            </Button>
            </div>
        </nav>
    </header>
    </>)
}


export default Header
