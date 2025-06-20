import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { LuShoppingCart } from "react-icons/lu";

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
                <li>
                    <Link to='/catalogo'>Catalogo</Link>
                </li>
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
                <li>
                    <Link to={'/carrito'}><LuShoppingCart /></Link>
                </li>
            </ul>
        </nav>
    )
}