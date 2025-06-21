import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { LuShoppingCart, LuUser } from "react-icons/lu";

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
            {user.idUsuario == '' ? (<></>) : (
                <span style={{ color: 'white' }}>Bienvenido <b>{user.usuario}</b></span>
            )}
            <ul>
                <li>
                    <Link to='/catalogo'>Catalogo</Link>
                </li>
                {user.perfilId == 1 ? (
                    <li>
                        <Link to='/admin/productos'>Admin</Link>
                    </li>
                ) :
                    <li>
                        <Link to={'/carrito'}><LuShoppingCart /></Link>
                    </li>
                }
                {user.idUsuario == '' ? (<>
                    <li>
                        <Link to={'/login'} className="nav-button">LogIn</Link>
                    </li>
                    <li>
                        <Link to={'/signup'} className="nav-button">SignUp</Link>
                    </li>
                </>
                ) : (
                    <>
                        <li>
                            <Link onClick={(e) => handleLogout(e)} className="nav-button">Logout</Link>
                        </li>
                    </>
                )
                }
            </ul>
        </nav>
    )
}