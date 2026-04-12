import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // This tool lets us redirect the user after a successful login
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    // This stops the browser from refreshing the page
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // We successfully logged in! Save the token to local storage automatically.
        localStorage.setItem('token', data.token);
        
        // Instantly redirect the participant to the dashboard to start the labs
        navigate('/');
      } else {
        // Show an error if they typed the wrong password
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Server error. Is your backend running?');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2>Student Login</h2>
      <p>Please log in to access the security labs.</p>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          required
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#004085', color: '#ffffff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
          Log In
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
    </div>
  );
}

export default Login;