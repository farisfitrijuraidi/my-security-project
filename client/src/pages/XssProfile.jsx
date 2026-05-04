import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LabInstructions from '../components/LabInstructions';

function XssProfile() {
  const navigate = useNavigate();
  const [bioInput, setBioInput] = useState('');
  
  // We keep the default text, but it will be instantly overwritten if they have a real bio
  const [displayBio, setDisplayBio] = useState('Write something about yourself!');

  // --- NEW CODE: The On-Load Fetch Logic ---
  useEffect(() => {
    const fetchRealBio = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // If there is no token, just stop.

        // Ask the database for this specific user's profile
        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token // Using your exact security header
          }
        });

        if (response.ok) {
          const userData = await response.json();
          // Overwrite the default text with the actual database content!
          if (userData.bio) {
            setDisplayBio(userData.bio);
          }
        }
      } catch (error) {
        console.error('Error fetching bio on load:', error);
      }
    };

    fetchRealBio();
  }, []); // The empty brackets mean "only run this once when the page loads"
  // --- END NEW CODE ---

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
        scenario="We suspect the platform's profile system does not sanitise user input. If true, an attacker could plant a malicious script in their bio that attacks anyone who views it."
        mission="Weaponise your own profile bio and test it against an administrator."
        steps={[
          "Type the payload <svg onload=\"alert('Hacked!')\"> into your Update Bio box and click Save.",
          "Log out of your account.",
          "Log in using the administrator credentials (alice@staff.unikl.edu.my / Password123!).",
          "Go to Lab 1 and search for your original Participant ID. If an alert box pops up, the exploit is successful!",
          "Finally, open VS Code, locate the XssProfile.jsx file, and change the dangerouslySetInnerHTML code to standard text rendering to fix the bug."
        ]}
        hint="If the standard script tag is blocked, try using an image tag that triggers an error, like <img src=x onerror=alert('Hacked!')>."
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