import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LabInstructions from '../components/LabInstructions';

function XssProfile() {
  const navigate = useNavigate();
  const [bioInput, setBioInput] = useState('');
  const [displayBio, setDisplayBio] = useState('Write something about yourself!');

  // This function sends the XSS payload to your backend
  const handleUpdateBio = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/bio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token // Your custom security gate
        },
        body: JSON.stringify({ bio: bioInput })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update the screen with the payload returned from the database
        setDisplayBio(updatedUser.bio);
      }
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  const buttonStyle = {
    padding: '8px 15px',
    backgroundColor: '#004085',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      
      <button 
        onClick={() => navigate('/')} 
        style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}
      >
        ← Back to Dashboard
      </button>

      <LabInstructions 
        title="Lab 3: Stored Cross-Site Scripting (XSS)"
        mission="Update your profile bio with a malicious JavaScript payload. Can you force the browser to execute an alert box when the page loads?"
        hint="Try a standard image payload if the script tag gets blocked."
      />

      <h2>Edit Your Profile</h2>

      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9', marginBottom: '20px' }}>
        <form onSubmit={handleUpdateBio}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Update Bio:</label>
          <textarea 
            value={bioInput}
            onChange={(e) => setBioInput(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="Type your new bio here..."
          />
          <button type="submit" style={buttonStyle}>Save Bio</button>
        </form>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff' }}>
        <h3>Current Bio:</h3>
        {/* VULNERABILITY POINT: dangerouslySetInnerHTML executes the code instead of reading it as text */}
        <div dangerouslySetInnerHTML={{ __html: displayBio }} />
      </div>

    </div>
  );
}

export default XssProfile;