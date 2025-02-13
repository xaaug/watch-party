import {User} from '@carbon/icons-react'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
    return (<>
    <header className='bg-[#161616]  px-6 py-3'>
        <nav className='flex justify-between items-center '>
            <Link to='/'  className='text-white'>Home</Link>
            <div className='flex gap-6 items-center'>
            <Link to='rooms' className='text-white'>Rooms</Link>
            <User size='24' className='text-white'/>
            </div>
        </nav>
    </header>
    </>)
}


export default Header
