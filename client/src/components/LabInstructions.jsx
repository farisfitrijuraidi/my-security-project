import React from 'react';

function LabInstructions({ title, scenario, mission, steps, hint }) {
  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      borderLeft: '6px solid #004085', 
      padding: '20px', 
      marginBottom: '25px',
      borderRadius: '6px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <h2 style={{ marginTop: 0, color: '#004085', borderBottom: '1px solid #dee2e6', paddingBottom: '10px' }}>
        {title}
      </h2>

      {/* 1. The Threat Intel Section */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 5px 0', color: '#495057', textTransform: 'uppercase', fontSize: '0.9rem' }}>
          Threat Intelligence (Scenario)
        </h4>
        <p style={{ margin: 0, fontStyle: 'italic', color: '#333', lineHeight: '1.5' }}>
          {scenario}
        </p>
      </div>

      {/* 2. The Step-by-Step Mission */}
      <div style={{ marginBottom: '20px', backgroundColor: '#e9ecef', padding: '15px', borderRadius: '5px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#212529' }}>Action Plan: {mission}</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6', color: '#212529' }}>
          {/* We use .map() to turn our array of steps into bullet points automatically */}
          {steps?.map((step, index) => (
            <li key={index} style={{ marginBottom: '8px' }}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LabInstructions;