import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    const handleLogout = async (e) => {
        e.preventDefault();

        const success = await logout();

        if (success) {
            navigate('/');
        }
    };

    return (
        <nav className="navbar">
            <Link className="logo">STANREY®</Link>
            <ul>
                {user.perfilId == 1 ? (
                    <li>
                        <Link to='/admin/productos'>Admin</Link>
                    </li>
                ) : (
                    <></>
                )
                }
                <li>
                    {user.idUsuario == '' ? (
                        <Link to={'/login'} className="nav-button">Login</Link>
                    ) : (
                        <Link onClick={(e) => handleLogout(e)} className="nav-button">Logout</Link>
                    )
                    }
                </li>
            </ul>
        </nav>
    )
}