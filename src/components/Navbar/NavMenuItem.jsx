import { NavLink } from "react-router-dom";
import "./Navbar.scss";

const NavMenuItem = ({ title, routeLink }) => {
    return (
        <li className="nav-item">
            <NavLink to={routeLink} className="nav-link">
                {title}
            </NavLink>
        </li>
    );
}

export default NavMenuItem;