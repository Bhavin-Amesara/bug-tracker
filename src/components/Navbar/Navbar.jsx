// import React from 'react';
import "./Navbar.scss";


const Navbar = () => {
  return (
    <nav className="navbar navbar_container">
      <div className="navbar_logo">Logo</div>
      <ul className="nav_links">
        <li className="navbar_button">
          <a>BugZone</a>
        </li>
        <li className="navbar_button">
          <a>Projects</a>
        </li>
        <li className="navbar_button">
          <a>Tickets</a>
        </li>
        <li className="navbar_button">
          <a>Search</a>
        </li>
        <li className="navbar_button">
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
