import { Outlet } from "react-router-dom"
import Header from "./Header"

const Layout: React.FC = () => {
    return (<>
    <Header/>
    <div className="px-3">
    <Outlet />
    </div>
    </>)
}

export default Layout