import './App.css'
import React from 'react';
import NavBar from './components/NavBar';

const App: React.FC = () => {
  return (
    <div>
      <NavBar />
      <main style={{ marginTop: "4rem", padding: "1rem" }}>
        <h1>Welcome to the app</h1>
        <p>Insert stuff below</p>
      </main>
    </div>
  );
};

export default App
