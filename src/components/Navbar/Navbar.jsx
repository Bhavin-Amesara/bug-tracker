// import React from 'react';
import "./Navbar.scss";


const Navbar = () => {
  return (
    <nav>
      <div className="navbar container">
        <div className="navbar-left">
          <div className="nav-logo">
            <a href="#">BugTracker</a>
          </div>
        </div>
        <div className="navbar-middle">
          <ul>
            <li className="nav-item">
              <a className="nav-link">BugZone</a>
            </li>
            <li className="nav-item">
              <a className="nav-link">Projects</a>
            </li>
            <li className="nav-item">
              <a className="nav-link">Tickets</a>
            </li>
            <li className="nav-item">
              <a className="nav-link">Search</a>
            </li>
          </ul>
        </div>
        <div className="navbar-right">
          <div className="auth">
            <a href="#" className="profile">Profile</a>
            <a href="#" className="onboarding">Login</a>
            <a href="#" className="onboarding">Register</a>
            <a href="#" className="logout">Logout</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
