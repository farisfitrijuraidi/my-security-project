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
        title="Student Profile"
        mission="View your student profile information."
        hint="The ID in the URL determines which user's profile is displayed. Try changing it to see if you can access other users' profiles!"
      />
      <h2>Student Profile Page</h2>
      <div className="profile-card" style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Role:</strong> {userData.role}</p>
        <p><strong>Database ID:</strong> {id}</p>
      </div>
      
      <p style={{ marginTop: '20px', backgroundColor: '#f9f9f9', padding: '10px' }}>
        <em>Hint for the lab: Look at the ID in your browser's address bar. What happens if you change one character?</em>
      </p>
    </div>
  );
}

export default Profile;