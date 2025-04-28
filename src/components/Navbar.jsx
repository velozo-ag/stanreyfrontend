import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const Navbar = () => {
    const { logout } = useContext(AuthContext);

    const handleLogout = async (e) => {
        e.preventDefault();

        const success = await logout();

        if (success) {
            navigate('/');
        }
    };

    return (
        <nav className="navbar">
            <Link to='/'>Logo</Link>
            <ul>
                <li>
                    <Link to='/admin/productos'>Admin</Link>
                </li>
                <li>
                    <Link onClick={(e) => handleLogout(e)}>Logout</Link>
                </li>
            </ul>
        </nav>
    )
}