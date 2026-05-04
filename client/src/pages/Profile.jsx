import LabInstructions from '../components/LabInstructions';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [inputId, setInputId] = useState('');

  // --- NEW: Persistent State for the Guided Tour ---
  // We check localStorage first. If a saved step exists, we use it. Otherwise, default to 1.
  const [tutorialStep, setTutorialStep] = useState(() => {
    const savedStep = localStorage.getItem('lab1Step');
    return savedStep !== null ? parseInt(savedStep, 10) : 1;
  });

  // Whenever the tutorialStep changes, immediately save the new number to localStorage.
  useEffect(() => {
    localStorage.setItem('lab1Step', tutorialStep.toString());
  }, [tutorialStep]);
  const [myUserId, setMyUserId] = useState('Loading ID...');

  // This automatically grabs the logged-in user's ID as soon as the page loads
  useEffect(() => {
    const fetchMyId = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // We grab the middle part of the security token and decode it to find their ID
          const payload = JSON.parse(atob(token.split('.')[1]));
          setMyUserId(payload.user.id);
        }
      } catch (err) {
        console.error("Could not decode token:", err);
        setMyUserId('participant_id_not_found');
      }
    };
    fetchMyId();
  }, []);

  // Fetch the profile data whenever the URL ID changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/users/profile/${id}`, {
          method: 'GET',
          headers: { 'x-auth-token': token }
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

  // --- RENDER LOGIC ---
  return (
    <div className="profile-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', position: 'relative', minHeight: '80vh' }}>
      
      {/* Header & Back Button */}
      <button 
        onClick={() => navigate('/')} 
        style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}
      >
        ← Back to Dashboard
      </button>

      {/* Static Instructions */}
      <LabInstructions 
        title="Lab 1: Insecure Direct Object Reference (IDOR)"
        scenario="We suspect the application's profile viewer does not verify if the user is authorized to view specific profiles. If true, an attacker could manipulate the ID in the search box to view anyone's private data."
        mission="Exploit the profile viewer to uncover Admin_Alice's secret profile, then patch the vulnerability."
        steps={[
          "Follow the popup tutorial in the bottom right corner of your screen to complete this lab."
        ]}
        hint="In a secure application, the backend should check if the logged-in user's token matches the profile ID being requested, or if the user has an 'admin' role."
      />

      {/* DYNAMIC CONTENT AREA */}
      {!id ? (
        // VIEW 1: The Search Box (Shows when there is no ID in the URL)
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', marginTop: '20px' }}>
          <h2>Profile Viewer</h2>
          <p>Please enter a Database ID to view a profile.</p>
          <input 
            type="text" 
            placeholder="Paste ID here..." 
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            style={{ padding: '10px', width: '60%', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button 
            onClick={() => navigate(`/profile/${inputId}`)}
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#004085', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            View Profile
          </button>
        </div>
      ) : (
        // VIEW 2: The Profile Results (Shows when there is an ID in the URL)
        <div style={{ marginTop: '20px' }}>
          <h2>Profile View</h2>
          {error ? (
            <div style={{ color: '#dc3545', padding: '15px', border: '1px solid #f5c6cb', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
              <strong>Error:</strong> {error}
            </div>
          ) : !userData ? (
            <div>Loading student profile...</div>
          ) : (
            <div className="profile-card" style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <p><strong>Username:</strong> {userData.username}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Role:</strong> {userData.role}</p>
              <p><strong>Database ID:</strong> {id}</p>
              
              <hr style={{ margin: '20px 0' }} />
              
              <h3>About Me:</h3>
              {/* Note: I intentionally kept this vulnerable so Lab 3 (XSS) still works here! */}
              <div 
                className="bio-content" 
                dangerouslySetInnerHTML={{ __html: userData.bio }} 
              />
            </div>
          )}
        </div>
      )}

      {/* --- THE GUIDED TUTORIAL POPUP --- */}
      {tutorialStep > 0 && (
        <div style={{
          position: 'fixed', bottom: '30px', right: '30px', width: '380px',
          backgroundColor: '#ffffff', border: '3px solid #004085',
          borderRadius: '8px', padding: '20px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          
          {/* STEP 1: View Own Profile */}
          {tutorialStep === 1 && (
            <div>
              <h4 style={{ color: '#004085', marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Step 1: Normal Behaviour</h4>
              <p style={{ fontSize: '0.95rem' }}>Welcome to Lab 1! Let us see how this application normally works.</p>
              <p style={{ fontSize: '0.95rem' }}>We have retrieved your unique Database ID. Please copy it, paste it into the search box, and click View Profile.</p>
              
              <div style={{ backgroundColor: '#e9ecef', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', marginBottom: '15px', wordBreak: 'break-all', border: '1px solid #ced4da' }}>
                <strong>Your ID:</strong> <br/>
                <span style={{ color: '#d63384' }}>{myUserId}</span>
              </div>
              
              <button 
                onClick={() => setTutorialStep(2)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#004085', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Next: I have viewed my profile
              </button>
            </div>
          )}

          {/* STEP 2: The Exploit */}
          {tutorialStep === 2 && (
            <div>
              <h4 style={{ color: '#dc3545', marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Step 2: The IDOR Exploit</h4>
              <p style={{ fontSize: '0.95rem' }}>Good. Now for the exploit. Insecure Direct Object Reference (IDOR) happens when a system does not check if you are actually allowed to view the file you requested.</p>
              <p style={{ fontSize: '0.95rem' }}>Look at the URL address bar at the top of your browser. Notice how your ID is right there in the open?</p>
              <p style={{ fontSize: '0.95rem' }}>Copy Admin Alice's ID below, and replace your ID in the browser's URL address bar with it. Press Enter to load the page.</p>
              
              <div style={{ backgroundColor: '#f8d7da', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', marginBottom: '15px', border: '1px solid #f5c6cb' }}>
                <strong>Admin Alice's ID:</strong> <br/>
                <span style={{ color: '#721c24' }}>69d7c8febb7e5ab84ffbc179</span>
              </div>

              <button 
                onClick={() => setTutorialStep(3)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Next: I have viewed Admin Alice's profile
              </button>
            </div>
          )}

          {/* STEP 3: The Mitigation */}
          {tutorialStep === 3 && (
            <div>
              <h4 style={{ color: '#28a745', marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Step 3: The Mitigation</h4>
              <p style={{ fontSize: '0.95rem' }}>You successfully stole Alice's data! The application blindly trusted the ID you typed in.</p>
              
              <p style={{ fontSize: '0.95rem' }}>To fix this, we need to enforce permissions on the server. Please go to the <strong>VS Code</strong> window that is already open to the <code>user.js</code> file.</p>
              
              <p style={{ fontSize: '0.95rem' }}>Look for the "SECURITY CHECK" section around line 10. The security patch is already written, but it is currently "commented out" (disabled). Delete the two forward slashes (<code>//</code>) at the start of lines 12 to 16 to activate the code.</p>
              
              <p style={{ fontSize: '0.95rem' }}>Press <strong>Ctrl + S</strong> to save the file. Then, come back to this browser.</p>
              
              <button 
                onClick={() => setTutorialStep(4)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
              >
                Next: I have saved the fix
              </button>
            </div>
          )}

          {/* STEP 4: Verification & Teaching Note */}
          {tutorialStep === 4 && (
            <div>
              <h4 style={{ color: '#17a2b8', marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Step 4: Verification</h4>
              <p style={{ fontSize: '0.95rem' }}>Try pasting Admin_Alice's ID (69d7c8febb7e5ab84ffbc179) into the URL bar one more time and press Enter. You should now see an <strong>Error: Access Denied</strong> message!</p>
              
              <div style={{ backgroundColor: '#e0f7fa', padding: '12px', borderRadius: '4px', border: '1px solid #b2ebf2', marginBottom: '15px' }}>
                <strong style={{ color: '#006064' }}>Teaching Note:</strong>
                <p style={{ margin: '5px 0 10px 0', fontSize: '0.9rem', color: '#00838f' }}>
                  By verifying that your secure login token matches the ID requested in the URL, you have successfully prevented unauthorized users from accessing data they do not own. This is the core defence against IDOR!
                </p>
                <p style={{ margin: '0', fontSize: '0.9rem', color: '#00838f' }}>
                  <strong>Real-World Impact:</strong> IDOR is highly dangerous. If an attacker uses this flaw to view an administrator's profile, they could steal massive amounts of critical information, exposing the personal and confidential data of every single user on the platform.
                </p>
              </div>

              <p style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>Lab 1 is complete! Please click the <strong>← Back to Dashboard</strong> button at the top of the screen and proceed to Lab 2.</p>
              
              <button 
                onClick={() => setTutorialStep(0)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                OK
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default Profile;