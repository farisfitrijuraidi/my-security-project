import React from 'react';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Educational Security Platform</h1>
      <p>Select a lab to begin your cybersecurity training.</p>
      
      <div className="lab-list">
        <div className="lab-card">
          <h3>Lab 1: IDOR</h3>
          <p>Learn how broken access control allows data leaks.</p>
          <button>Start Lab</button>
        </div>
        
        {/* We will add SQLi and XSS cards here later! */}
      </div>
    </div>
  );
}

export default Dashboard;