import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Page Imports
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SearchLab from './pages/SearchLab';
import Login from './pages/Login';
import XssProfile from './pages/XssProfile';

function App() {
  return (
    <Router>
      <div className="App">
        {/* The Routes block acts like a switchboard, picking the right page to show */}
        <Routes>
          {/* The Login Page */}
          <Route path="/login" element={<Login />} />
          {/* The Homepage */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Lab 1: The Profile Pages */}
          {/* This route catches the standard click from the dashboard */}
          <Route path="/profile" element={<Profile />} />
          {/* This route handles the IDOR manipulation when users change the URL */}
          <Route path="/profile/:id" element={<Profile />} />
          
          {/* Lab 2: The Search Page */}
          <Route path="/lab/sqli" element={<SearchLab />} />
          {/* Lab 3: The XSS Page */}
          <Route path="/lab/xss" element={<XssProfile/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;