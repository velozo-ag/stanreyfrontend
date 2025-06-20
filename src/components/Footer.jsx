import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { LuShoppingCart } from "react-icons/lu";

export const Footer = () => {
    return (
        <nav className="footer">
            <hr></hr>

            <div className="content">
                <Link className="logo">STANREY®</Link>
                <ul>
                    <li>
                        since 2025 making the best mates
                    </li>
                    <li>
                    </li>
                </ul>
            </div>
        </nav>
    )
}