import React from 'react';

function LabInstructions({ title, mission, hint }) {
  return (
    <div style={{ 
      backgroundColor: '#e3f2fd', 
      borderLeft: '5px solid #2196f3', 
      padding: '15px', 
      marginBottom: '20px',
      borderRadius: '4px' 
    }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p><strong>Your Mission:</strong> {mission}</p>
      <details>
        <summary style={{ cursor: 'pointer', color: '#1976d2', fontWeight: 'bold' }}>
          Click for a Hint
        </summary>
        <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>{hint}</p>
      </details>
    </div>
  );
}

export default LabInstructions;