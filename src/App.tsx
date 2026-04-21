import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import Home from "./components/Pages/home/page";
import CreateItinerary from "./components/Pages/create-itinerary/page";
import CreateAi from "./components/Pages/create-ai/page";
import ViewPage from "./components/Pages/view-page/page";
import "./App.css";
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 

function App() {
  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-itinerary" element={<CreateItinerary />} />
          <Route path="/create-with-ai" element={<CreateAi />} />
          <Route path="/view-itinerary" element={<ViewPage />} />
        </Routes>
      </Router>
    </LoadScript>
  );
}

export default App;
