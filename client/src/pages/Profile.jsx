import DOMPurify from 'dompurify';
import LabInstructions from '../components/LabInstructions';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Profile() {
  // useParams is a tool that grabs the "id" part from the web address
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // This function runs as soon as the page loads
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/profile/${id}`);
        const data = await response.json();

        if (response.ok) {
          setUserData(data);
        } else {
          setError(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('Server error. Make sure your backend is running!');
      }
    };

    fetchProfile();
  }, [id]); // This runs again if the ID in the address bar changes

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!userData) return <div>Loading student profile...</div>;

  return (
    <div className="profile-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <LabInstructions 
        title="Lab 3: Stored XSS"
        mission="Someone has hidden malicious code in their profile bio. If you view their profile, their code will run in YOUR browser. Can you find the infected profile?"
        hint="Look for the 'About Me' section. XSS usually triggers a popup alert or tries to steal information from your browser's local storage."
      />

      <h2>Student Profile View</h2>
      <div className="profile-card" style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Role:</strong> {userData.role}</p>
        <p><strong>Database ID:</strong> {id}</p>
        
        <hr style={{ margin: '20px 0' }} />
        
        <h3>About Me:</h3>
        {/* VULNERABLE CODE: This allows raw JavaScript to execute! */}
        <div 
          className="bio-content" 
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userData.bio) }} 
        />
      </div>
    </div>
  );
}

export default Profile;