import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Pages/home/page";
import CreateItinerary from "./components/Pages/create-itinerary/page";
import CreateAi from "./components/Pages/create-ai/page";
import ViewPage from "./components/Pages/view-page/page";
import "./App.css";
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/create-itinerary" element={<CreateItinerary />}></Route>
        <Route path="/create-with-ai" element={<CreateAi />}></Route>
        <Route path="/view-itinerary" element={<ViewPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
