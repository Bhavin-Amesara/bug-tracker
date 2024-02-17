// import React from 'react';
import "./Navbar.scss";
import NavMenuItem from "./NavMenuItem";
import { Link } from 'react-router-dom';


const Navbar = ({IsLoggedIn}) => {
  console.log(IsLoggedIn, "IsLoggedIn from Navbar");
  return (
    <nav>
      <div className="navbar container">
        <div className="navbar-left">
          <div className="nav-logo">
            {/* <a href="#">BugTracker</a> */}
            <Link to="/">BugTracker</Link>
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
            {/* link to */}
            {/* check is cookies set or not */}
            { 
              IsLoggedIn ?
              <>
                <Link to="/profile" className="profile">Profile</Link>
                <Link to="/logout" className="logout">Logout</Link>
              </>
              :
              <>
                <Link to="/login" className="login">Login</Link>
                <Link to="/register" className="onboarding">Register</Link>
              </>
            }
            {/* <Link to="/logout" className="logout">Logout</Link> */}
            {/* <Link to="/logout" className="logout">Logout</Link>             */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
