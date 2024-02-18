
import "./Navbar.scss";
import NavMenuItem from "./NavMenuItem";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext';
import useLogout from '../../hooks/useLogout';

const Navbar = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  const logout = useLogout();
  const handleLogout = () => {
    logout();
    navigate("/login");
  }
  return (
    <nav>
      <div className="navbar container">
        <div className="navbar-left">
          <div className="nav-logo">
            <NavLink to="/">BugTracker</NavLink>
          </div>
        </div>
        <div className="navbar-middle">
          <ul>
            <NavMenuItem title="BugZone" routeLink="/bugzone" />
            <NavMenuItem title="Projects" routeLink="/projects" />
            <NavMenuItem title="Tickets" routeLink="/issues" />
            <NavMenuItem title="Search" routeLink="/search" />
          </ul>
        </div>
        <div className="navbar-right">
          <div className="auth">
            { user &&
              user.isLoggedIn ? 
              <>
                <NavLink to="/profile" className="profile">Profile</NavLink>
                <button className="logout" onClick={handleLogout}>Logout</button>
              </>
              :
              <>
                <NavLink to="/login" className="login">Login</NavLink>
                <NavLink to="/register" className="onboarding">Register</NavLink>
              </>
            }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
