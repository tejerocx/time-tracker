// src/App.js
import React, { useState } from 'react';

function App() {
  const [employee, setEmployee] = useState('');
  const [logs, setLogs] = useState([]);

  const handleTime = (type) => {
    const now = new Date();
    const timestamp = now.toLocaleString();
    const newLog = {
      employee,
      type,
      time: timestamp,
    };
    setLogs([newLog, ...logs]);
  };

  return (
    <div style={styles.container}>
      <h2>🕒 Time Tracker</h2>
      
      <input
        type="text"
        placeholder="Enter Employee ID or Name"
        value={employee}
        onChange={(e) => setEmployee(e.target.value)}
        style={styles.input}
      />

      {employee && (
        <div style={styles.buttonContainer}>
          <button onClick={() => handleTime('Time In')} style={styles.button}>TIME IN</button>
          <button onClick={() => handleTime('Time Out')} style={styles.button}>TIME OUT</button>
        </div>
      )}

      <h4 style={{ marginTop: '30px' }}>Logs:</h4>
      <ul style={styles.logList}>
        {logs.map((log, index) => (
          <li key={index}>
            <strong>{log.employee}</strong> - {log.type} at {log.time}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'sans-serif',
    padding: '40px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
    background: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
  },
  input: {
    padding: '10px',
    width: '80%',
    marginBottom: '20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#0070f3',
    color: '#fff',
    cursor: 'pointer',
  },
  logList: {
    listStyle: 'none',
    padding: 0,
    textAlign: 'left',
  },
};

export default App;
