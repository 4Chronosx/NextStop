// CreateAi.tsx (or page.tsx)
import Navbar from "../ui/Navbar";
import Chatbox from "../ui/Chatbox";
import Map from "../google-maps/maps"; // Import the Map component
import "./page.css";

const CreateAi = () => {
  return (
    <>
      <Navbar />
      <div
        className="d-flex justify-content-between align-items-start py-3"
        style={{ height: "100vh" }}
      >
        {/* Left side for Google Map */}
        <div className="map-container">
          <Map /> {/* Include the Map component here */}
        </div>

        {/* Right side for Chatbox */}
        <div className="d-flex justify-content-center align-items-center py-3">
          <Chatbox />
        </div>
      </div>
    </>
  );
};

export default CreateAi;
