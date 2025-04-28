import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { openDB } from "idb";
import { useEffect, useState } from "react";

interface ActivityDetail {
  date: string;
  title: string;
  type: string;
  duration: string;
  timeSlot: string;
  budget: string;
  location: string;
}

interface DayItinerary {
  date: string;
  details: ActivityDetail[];
}

interface Itinerary {
  title: string;
  days: DayItinerary[];
}

const defaultItinerary: Itinerary[] = [
  {
    title: "myItinerary",
    days: [
      {
        date: "Day 1",
        details: [
          {
            date: "Day 1",
            title: "Activity 1",
            type: "Type 1",
            duration: "2 hours",
            timeSlot: "Morning",
            budget: "$100",
            location: "Location 1",
          },
        ],
      },
    ],
  },
];



const Navbar = () => {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate();
  const [data, setData] = useState<Itinerary[]>(defaultItinerary);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] =
    useState<Itinerary[]>([]);

  useEffect(() => {
    const initDB = async () => {
      const db = await openDB("MyDatabase", 11, {
        upgrade(db) {
          // Create an object store for "data" with auto-incrementing keys
          db.createObjectStore("data", { autoIncrement: true });
        },
      });
      const count = await db.count("data");
      if (count > 0) {
        const allData = await db.getAll("data");
        setData(allData); // Ensure consistent display order
      }
    };

    initDB();
  }, []);

  const handleClickResult = (itinerary: Itinerary) => {
    navigate("/view-itinerary", {
      state: { itinerary: itinerary } // Pass the itinerary data as state
    });
  }

  // Handle input changes and filter itineraries
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const filteredResults = data.filter((itinerary) =>
        itinerary.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <nav
      className="navbar sticky-top navbar-expand-lg bg-body-tertiary border-body"
      
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src="src/assets/Logo.png"
            alt="Logo"
            style={{ height: "3rem" }}
          />
        </Link>
        <span className="brandname">NextStop</span>
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
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                aria-current="page"
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/create-itinerary" ? "active" : ""
                }`}
                to="/create-itinerary"
              >
                Create Itinerary
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/create-with-ai" ? "active" : ""
                }`}
                to="/create-with-ai"
              >
                Create with AI
              </Link>
            </li>
          </ul>
          <form className="d-flex position-relative" role="search">
            <input
              className="form-control me-2 search"
              type="search"
              placeholder="Search my Itinerary"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchInput}
            />
            
            {searchResults.length > 0 && (
              <ul className="list-group position-absolute w-100 mt-5 search-list">
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleClickResult(result)}
                  >
                    {result.title}
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
