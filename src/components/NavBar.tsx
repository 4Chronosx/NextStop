import React from 'react'
import "./NavBar.css"

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-menu">
          <li>
            <a href="#home" className="active">Home</a>
          </li>
          <li>
            <a href="#about">Create Itinerary</a>
          </li>
          <li>
            <a href="#services">Create with AI</a>
          </li>
          <li>
            <a href="#contact">Map View</a>
          </li>
          <a href="/" className="navbar-logo">
           (Insert Name and Logo)
          </a>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar