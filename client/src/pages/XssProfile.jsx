import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LabInstructions from '../components/LabInstructions';
const VulnerableBio = React.memo(({ bio }) => {
  return <div dangerouslySetInnerHTML={{ __html: bio }} />;
  // return <div>{bio}</div>;
});

function XssProfile() {
  const navigate = useNavigate();
  const [bioInput, setBioInput] = useState('');
  const [displayBio, setDisplayBio] = useState('Write something about yourself!');

  // --- Persistent State & Participant ID Fetching ---
  const [myUserId, setMyUserId] = useState('Loading ID...');
  const [tutorialStep, setTutorialStep] = useState(() => {
    const savedStep = localStorage.getItem('lab3Step');
    return savedStep !== null ? parseInt(savedStep, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem('lab3Step', tutorialStep.toString());
  }, [tutorialStep]);

  // Decode the token to grab their ID so they can copy it for the attack phase
  useEffect(() => {
    const fetchMyId = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setMyUserId(payload.user.id);
        }
      } catch (err) {
        console.error("Could not decode token:", err);
      }
    };
    fetchMyId();
  }, []);

  // Fetch their real bio on load
  useEffect(() => {
    const fetchRealBio = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData.bio) {
            setDisplayBio(userData.bio);
          }
        }
      } catch (error) {
        console.error('Error fetching bio on load:', error);
      }
    };

    fetchRealBio();
  }, []);

  const handleUpdateBio = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/bio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ bio: bioInput })
      });

      if (response.ok) {
        const updatedUser = await response.json();
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', position: 'relative', minHeight: '80vh' }}>
      
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
          "Follow the popup tutorial in the bottom right corner of your screen to complete this lab."
        ]}
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
        <VulnerableBio bio={displayBio} />
      </div>

      {/* --- THE GUIDED TUTORIAL POPUP --- */}
      {tutorialStep > 0 && (
        <div style={{
          position: 'fixed', bottom: '30px', right: '30px', width: '380px',
          backgroundColor: '#ffffff', border: '3px solid #004085',
          borderRadius: '8px', padding: '20px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          
          {/* STEP 1: The Exploit */}
          {tutorialStep === 1 && (
            <div>
              <h4 style={{ color: '#dc3545', marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Step 1: The XSS Exploit</h4>
              <p style={{ fontSize: '0.95rem' }}>Let us plant a trap! Cross-Site Scripting (XSS) occurs when an application renders user input as executable code instead of text.</p>
              <p style={{ fontSize: '0.95rem' }}>Copy and paste this exact payload into the <strong>Update Bio</strong> box and click Save. An alert box should pop up immediately!</p>
              
              <div style={{ backgroundColor: '#f8d7da', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', marginBottom: '15px', border: '1px solid #f5c6cb' }}>
                <span style={{ color: '#721c24' }}>{`<img src="x" onerror="alert('XSS Attack Triggered!')">`}</span>
              </div>

              <button 
                onClick={() => setTutorialStep(2)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Next: I saw the alert pop up
              </button>
            </div>
          )}

          {/* STEP 2: The Attack Path */}
          {tutorialStep === 2 && (
            <div>
              <h4 style={{ color: '#fd7e14', marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Step 2: The Attack Path</h4>
              <p style={{ fontSize: '0.95rem' }}>The script executed for you, but Stored XSS is dangerous because it attacks <em>other</em> users. Let us attack Admin Alice.</p>
              
              <ul style={{ paddingLeft: '20px', fontSize: '0.95rem', margin: '10px 0' }}>
                <li>Copy your ID below.</li>
                <li>Log out, then log in as <strong>alice@staff.unikl.edu.my</strong> (Password: <strong>Password123!</strong>).</li>
                <li>Go to <strong>Lab 1</strong>, paste your ID into the search box, and click View Profile to trigger the trap!</li>
                <li>When done, log out of Alice's account, log back in as yourself, and return here.</li>
              </ul>
              
              <div style={{ backgroundColor: '#fff3cd', padding: '10px', borderRadius: '4px', fontFamily: 'monospace', marginBottom: '15px', wordBreak: 'break-all', border: '1px solid #ffeeba' }}>
                <strong>Your ID:</strong> <br/>
                <span style={{ color: '#856404' }}>{myUserId}</span>
              </div>

              <button 
                onClick={() => setTutorialStep(3)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#fd7e14', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Next: I have returned from hacking Alice
              </button>
            </div>
          )}

          {/* STEP 3: The Mitigation */}
          {tutorialStep === 3 && (
            <div>
              <h4 style={{ color: '#28a745', marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Step 3: The Mitigation</h4>
              <p style={{ fontSize: '0.95rem' }}>Welcome back! You just proved that anyone viewing your profile will run your malicious code.</p>
              
              <p style={{ fontSize: '0.95rem' }}>Please open <strong>VS Code</strong> and locate the <code>XssProfile.jsx</code> file.</p>
              
              <p style={{ fontSize: '0.95rem' }}>Look at the very top of the file (around line 4). You will see a custom component called <code>VulnerableBio</code>. The vulnerability is caused by a React property inside it called <code>dangerouslySetInnerHTML</code>.</p>
              
              <p style={{ fontSize: '0.95rem' }}>Delete the inside of that component and replace it with a standard React data binding: <br/><br/><code>return &lt;div&gt;&#123;bio&#125;&lt;/div&gt;;</code></p>
              
              <p style={{ fontSize: '0.95rem' }}>Press <strong>Ctrl + S</strong> to save, then return here.</p>
              
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
              <p style={{ fontSize: '0.95rem' }}>Try typing the <code>{`<img src="x" onerror="alert('Hacked!')">`}</code> payload into your bio one more time and hit save.</p>
              
              <p style={{ fontSize: '0.95rem' }}>Instead of popping up an alert, it should now display completely harmlessly as raw text on the screen!</p>
              
              <div style={{ backgroundColor: '#e0f7fa', padding: '12px', borderRadius: '4px', border: '1px solid #b2ebf2', marginBottom: '15px' }}>
                <strong style={{ color: '#006064' }}>Teaching Note:</strong>
                <p style={{ margin: '5px 0 10px 0', fontSize: '0.9rem', color: '#00838f' }}>
                  Modern frameworks like React are inherently secure against XSS because they automatically encode special characters (like <code>&lt;</code> and <code>&gt;</code>) into safe strings. By relying on native framework data bindings rather than bypassing them, you entirely neutralise this threat.
                </p>
                <p style={{ margin: '0', fontSize: '0.9rem', color: '#00838f' }}>
                  <strong>Real-World Impact:</strong> XSS is devastating, especially when triggered by an administrator. If an attacker steals an admin's session cookie using this script, they instantly gain full control over the platform. For a company, this means total system compromise, massive customer data breaches, and millions of dollars in regulatory fines and ruined reputation.
                </p>
              </div>

              <p style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>Lab 3 is complete! You have finished all the modules.</p>
              
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

export default XssProfile;