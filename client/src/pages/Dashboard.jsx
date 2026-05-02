import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const currentName = localStorage.getItem('username') || 'Student';

  // The Bouncer: Checks if the user is allowed here
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // The Upgraded Logout Function
  const handleLogout = async () => {
    try {
      // 1. Tell the backend to scrub the database clean
      await fetch('http://localhost:5000/api/users/reset-labs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // 2. Delete the digital pass from the browser's vault
      localStorage.removeItem('token');
      localStorage.removeItem('username'); // We clear the saved name too!

      // 3. Kick the user back to the login screen
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout safely:', error);
    }
  };

  // Styles for the lab buttons
  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#004085', 
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  };

  // Styles for the white cards
  const cardStyle = {
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9'
  };

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header section with the new Logout button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* NEW: We wrap the title and greeting in their own div so they stack vertically */}
        <div>
          <h1 style={{ marginTop: '0', marginBottom: '5px' }}>Educational Security Platform</h1>
          <h3 style={{ marginTop: '0', color: '#555' }}>Welcome back, {currentName}!</h3>
        </div>

        <button 
          onClick={handleLogout}
          style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Logout
        </button>
      </div>

      <p>Select a lab to begin your cybersecurity training.</p>
      
      <div className="lab-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
        
        <div className="lab-card" style={cardStyle}>
          <h3>Lab 1: IDOR</h3>
          <p>Learn how broken access control allows data leaks.</p>
          <Link to="/profile">
            <button style={buttonStyle}>Start Lab</button>
          </Link>
        </div>

        <div className="lab-card" style={cardStyle}>
          <h3>Lab 2: NoSQL Injection</h3>
          <p>Learn how to bypass search filters and dump the database.</p>
          <Link to="/lab/sqli">
            <button style={buttonStyle}>Start Lab</button>
          </Link>
        </div>

        <div className="lab-card" style={cardStyle}>
          <h3>Lab 3: Stored XSS</h3>
          <p>Discover how unscrubbed input allows malicious scripts to execute.</p>
          <Link to="/lab/xss">
            <button style={buttonStyle}>Start Lab</button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;