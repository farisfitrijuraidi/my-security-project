import DOMPurify from 'dompurify';
import LabInstructions from '../components/LabInstructions';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate(); // This tool lets us change pages programmatically
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [inputId, setInputId] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return; // Stop if there is no ID in the URL

      try {
        // Grab the token from the browser's memory (Local Storage)
        const token = localStorage.getItem('token');
        
        // Send the token in the headers!
        const response = await fetch(`http://localhost:5000/api/users/profile/${id}`, {
          method: 'GET',
          headers: {
            'x-auth-token': token
          }
        });
        const data = await response.json();

        if (response.ok) {
          setUserData(data);
          setError('');
        } else {
          setError(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('Server error. Make sure your backend is running!');
      }
    };

    fetchProfile();
  }, [id]);

  // If the URL is just '/profile' with no ID, show an input box
  if (!id) {
    return (
      <div className="profile-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h2>Profile Viewer</h2>
        <p>Please enter a Database ID to view a profile.</p>
        <input 
          type="text" 
          placeholder="Paste ID here..." 
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          style={{ padding: '10px', width: '60%', marginRight: '10px' }}
        />
        <button 
          onClick={() => navigate(`/profile/${inputId}`)}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          View Profile
        </button>
      </div>
    );
  }

  if (error) return <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>;
  if (!userData) return <div style={{ marginTop: '20px' }}>Loading student profile...</div>;

  return (
    <div className="profile-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ 
          padding: '8px 15px', 
          backgroundColor: '#6c757d', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer', 
          marginBottom: '20px',
          fontWeight: 'bold'
        }}
      >
        ← Back to Dashboard
      </button>
      <LabInstructions 
        title="Lab 1: Insecure Direct Object Reference (IDOR)"
        mission="You have intercepted the database ID for the platform administrator. Can you manipulate the web application to view her private data?"
        hint="Look at the web address bar. Try replacing your ID with the Admin's ID."
      />

      <h2>Profile View</h2>
      <div className="profile-card" style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Role:</strong> {userData.role}</p>
        <p><strong>Database ID:</strong> {id}</p>
        
        <hr style={{ margin: '20px 0' }} />
        
        <h3>About Me:</h3>
        <div 
          className="bio-content" 
          dangerouslySetInnerHTML={{ __html: userData.bio }} 
        />
      </div>
      
    </div>
  );
}

export default Profile;