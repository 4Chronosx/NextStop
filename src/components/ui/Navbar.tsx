import "./Navbar.css";

import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      className="navbar sticky-top navbar-expand-lg bg-body-tertiary bg-dark border-bottom border-body"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src="src\assets\Logo.png"
            alt="Logo"
            style={{ height: "2rem" }}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">
                Create Itinerary
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/create-with-ai">
                Create with AI
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">
                Map View
              </Link>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search my Itinerary"
              aria-label="Search"
            />
            <button className="btn custom-button" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
