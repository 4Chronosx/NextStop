import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Pages/home/page';
import CreateItinerary from './components/Pages/create-itinerary/page';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/create-itinerary" element={<CreateItinerary />}></Route>
      </Routes>
    </Router>

  );
}

export default App
