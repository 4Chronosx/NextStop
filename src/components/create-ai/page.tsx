// src/pages/CreateAi.tsx
import Navbar from "../ui/Navbar";
import Chatbox from "../ui/Chatbox";
import Map from "../google-maps/maps"; // Import your Map component

import "./page.css";

const CreateAi = () => {
  return (
    <>
      <Navbar />
      <div className="content-wrapper">
        <div className="layout-container">
          <div className="chat-container">
            <Chatbox />
          </div>
          <div className="map-container">
            <Map /> {/* Map component now handles the route logic */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAi;
