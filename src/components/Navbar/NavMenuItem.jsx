import { Link } from "react-router-dom";

const NavMenuItem = ({ title, routeLink }) => {
    return (
        <li className="nav-item">
            <Link to={routeLink}>
            <a className="nav-link">
                {title}
            </a>
            </Link>
        </li>
    );
}

export default NavMenuItem;