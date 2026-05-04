import React, { useState, useEffect } from 'react';
import LabInstructions from '../components/LabInstructions';
import { useNavigate } from 'react-router-dom';

function SearchLab() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  // --- PERSISTENT STATE FOR THE GUIDED TOUR ---
  const [tutorialStep, setTutorialStep] = useState(() => {
    const savedStep = localStorage.getItem('lab2SearchStep');
    return savedStep !== null ? parseInt(savedStep, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem('lab2SearchStep', tutorialStep.toString());
  }, [tutorialStep]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setResults([]);
    let parsedQuery = query;
    try {
      // If the student types valid JSON (like our exploit), turn it into a real object
      parsedQuery = JSON.parse(query);
    } catch (err) {
      // If it fails, they just typed a normal name. Leave it as a text string.
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/users/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: parsedQuery }),
      });

      const data = await response.json();
      if (response.ok) {
        setResults(data);
      } else {
        setError(data.message || 'Search failed');
      }
    } catch (err) {
      setError('Server error. Is the backend running?');
    }
  };

  return (
    <div className="lab-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', position: 'relative', minHeight: '80vh' }}>
      
      <button 
        onClick={() => navigate('/')} 
        style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}
      >
        ← Back to Dashboard
      </button>

      <LabInstructions 
        title="Lab 2: NoSQL Injection (Information Disclosure)"
        scenario="We suspect the student directory search does not sanitise user inputs. If true, an attacker could inject raw database commands into the search box to force the database to dump every single hidden profile."
        mission="Trick the database into revealing all user accounts, and then write a patch to block the injection."
        steps={[
          "Follow the popup tutorial in the bottom right corner of your screen to complete this lab."
        ]}
      />

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', marginTop: '20px' }}>
        <h2>Student Directory Search</h2>
        <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Search by username..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: '10px', width: '70%', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#004085', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Search
          </button>
        </form>

        {error && <div style={{ color: '#dc3545', padding: '10px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

        <div className="results">
          {results.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left' }}>
                  <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Username</th>
                  <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {results.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>{user.username}</td>
                    <td style={{ padding: '12px' }}>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ fontStyle: 'italic', color: '#6c757d' }}>No students found. Try searching for an exact username.</p>
          )}
        </div>
      </div>

      {/* --- THE GUIDED TUTORIAL POPUP --- */}
      {tutorialStep > 0 && (
        <div style={{
          position: 'fixed', bottom: '30px', right: '30px', width: '380px',
          backgroundColor: '#ffffff', border: '3px solid #004085',
          borderRadius: '8px', padding: '20px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          
          {/* STEP 1: Normal Behaviour */}
          {tutorialStep === 1 && (
            <div>
              <h4 style={{ color: '#004085', marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Step 1: Normal Behaviour</h4>
              <p style={{ fontSize: '0.95rem' }}>Welcome to Lab 2! Let us see how the directory normally works.</p>
              <p style={{ fontSize: '0.95rem' }}>Type <strong>participant1</strong> into the search box and click Search.</p>
              <p style={{ fontSize: '0.95rem' }}>You should see exactly one result appear in the table.</p>
              
              <button 
                onClick={() => setTutorialStep(2)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#004085', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
              >
                Next: I searched for the user
              </button>
            </div>
          )}

          {/* STEP 2: The Exploit */}
          {tutorialStep === 2 && (
            <div>
              <h4 style={{ color: '#dc3545', marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Step 2: The NoSQL Exploit</h4>
              <p style={{ fontSize: '0.95rem' }}>Now for the exploit. MongoDB queries use objects. If we pass a logical operator instead of a text string, we can manipulate the database!</p>
              <p style={{ fontSize: '0.95rem' }}>Clear the search box. Copy and paste this exact payload and click Search:</p>
              
              <div style={{ backgroundColor: '#f8d7da', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', marginBottom: '15px', border: '1px solid #f5c6cb' }}>
                <span style={{ color: '#721c24' }}>{`{"$ne": "null"}`}</span>
              </div>

              <button 
                onClick={() => setTutorialStep(3)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Next: I triggered the data dump
              </button>
            </div>
          )}

          {/* STEP 3: The Mitigation */}
          {tutorialStep === 3 && (
            <div>
              <h4 style={{ color: '#28a745', marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Step 3: The Mitigation</h4>
              <p style={{ fontSize: '0.95rem' }}>Look at the table! You successfully dumped every user in the database. The payload <code>$ne</code> (Not Equal) forced the database to return everyone whose username is "not equal to null".</p>
              
              <p style={{ fontSize: '0.95rem' }}>To fix this, please go to the <strong>VS Code</strong> window that is already open to the <code>user.js</code> file.</p>
              
              <p style={{ fontSize: '0.95rem' }}>Look for the "THE FIX: Type Validation" section around line 35. The security patch is already written, but it is currently "commented out" (disabled). Delete the two forward slashes (<code>//</code>) at the start of lines 37 to 41 to activate the code that forces the query to become a strict String.</p>
              
              <p style={{ fontSize: '0.95rem' }}>Press <strong>Ctrl + S</strong> to save, then come back here.</p>
              
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
              <p style={{ fontSize: '0.95rem' }}>Try pasting the <code>{`{"$ne": "null"}`}</code> payload into the search box one more time. You should now see <strong>Security Alert: Invalid search format. Text only.</strong></p>
              
              <div style={{ backgroundColor: '#e0f7fa', padding: '12px', borderRadius: '4px', border: '1px solid #b2ebf2', marginBottom: '15px' }}>
                <strong style={{ color: '#006064' }}>Teaching Note:</strong>
                <p style={{ margin: '5px 0 10px 0', fontSize: '0.9rem', color: '#00838f' }}>
                  By explicitly checking the data type (Input Validation), you stop the attack before it reaches the database. Because the server now rejects anything that isn't a plain text string, the attacker cannot pass malicious MongoDB objects into the search query.
                </p>
                <p style={{ margin: '0', fontSize: '0.9rem', color: '#00838f' }}>
                  <strong>Real-World Impact:</strong> Information Disclosure via NoSQL injection allows attackers to scrape massive amounts of sensitive data. In the real world, this exact flaw could expose thousands of passwords, emails, and financial records in a single click.
                </p>
              </div>

              <p style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>Lab 2 is complete! Please click <strong>← Back to Dashboard</strong> and proceed to Lab 3.</p>
              
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

export default SearchLab;