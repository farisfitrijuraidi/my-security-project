import React, { useState } from 'react';
import LabInstructions from '../components/LabInstructions';

function SearchLab() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    // This stops the page from reloading when you hit submit
    e.preventDefault();
    setError('');
    let parsedQuery = query;
    try {
      // If the student types valid JSON (like our exploit), turn it into a real object!
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
        // We send the "query" exactly as the student typed it
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
    <div className="lab-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <LabInstructions 
        title="Lab 2: NoSQL Injection"
        mission="Use the search bar to find information about other students. Can you find a way to see EVERYONE in the database at once?"
        hint="In MongoDB, some characters have special meanings. If the server doesn't clean the input, you might be able to send an 'object' instead of just text. Try searching for something that isn't a name."
      />

      <h2>Student Directory Search</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search by username..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '10px', width: '70%', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="results">
        {results.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Username</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {results.map((user) => (
                <tr key={user._id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.username}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students found. Try searching for 'teststudent'.</p>
        )}
      </div>
    </div>
  );
}

export default SearchLab;