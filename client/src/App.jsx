import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        {/* The Routes block acts like a switchboard, picking the right page to show */}
        <Routes>
          {/* This tells the browser: if the address is just '/', show the Dashboard page */}
          <Route path="/" element={<Dashboard />} />

          {/* This is where we will add your IDOR lab page very soon! */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;