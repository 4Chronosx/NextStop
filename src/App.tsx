import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home/page';
import CreateAi from './components/create-ai/page';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/create-with-ai" element={<CreateAi />}></Route>
      </Routes>
    </Router>

  );
}

export default App
