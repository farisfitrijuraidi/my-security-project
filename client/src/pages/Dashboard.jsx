import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  // We define the button style once here to keep the code clean
  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#004085', // A deep, professional blue
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  };

  // We can also do the same for the card to tidy up the HTML below
  const cardStyle = {
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9'
  };

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Educational Security Platform</h1>
      <p>Select a lab to begin your cybersecurity training.</p>
      
      <div className="lab-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '0px' }}>
        
        {/* Lab 1: IDOR */}
        <div className="lab-card" style={cardStyle}>
          <h3>Lab 1: IDOR</h3>
          <p>Learn how broken access control allows data leaks.</p>
          <Link to="/profile">
            <button style={buttonStyle}>Start Lab</button>
          </Link>
        </div>

        {/* Lab 2: NoSQL Injection */}
        <div className="lab-card" style={cardStyle}>
          <h3>Lab 2: NoSQL Injection</h3>
          <p>Learn how to bypass search filters and dump the database.</p>
          <Link to="/lab/sqli">
            <button style={buttonStyle}>Start Lab</button>
          </Link>
        </div>

        {/* Lab 3: Stored XSS */}
        <div className="lab-card" style={cardStyle}>
          <h3>Lab 3: Stored XSS</h3>
          <p>Discover how unscrubbed input allows malicious scripts to execute.</p>
          <Link to="/profile">
            <button style={buttonStyle}>Start Lab</button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;