import { Link } from "react-router-dom";
import "./Navbar.scss";

const NavMenuItem = ({ title, routeLink }) => {
    return (
        <li className="nav-item">
            <Link to={routeLink} className="nav-link">
            {/* <a className="nav-link"> */}
                {title}
            {/* </a> */}
            </Link>
        </li>
    );
}

export default NavMenuItem;