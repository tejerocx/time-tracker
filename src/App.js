import React, { useState } from 'react';
import './App.css';

function App() {
  const [logs, setLogs] = useState([]);

  const handleLog = (type) => {
    const now = new Date().toLocaleString();
    const newLog = `${type} at ${now}`;
    setLogs([newLog, ...logs]);
  };

  return (
    <div className="App">
      <h1>🕒 Time Tracker</h1>
      <div>
        <button onClick={() => handleLog('🟢 Time In')}>TIME IN</button>
        <button onClick={() => handleLog('🔴 Time Out')}>TIME OUT</button>
      </div>
      <h2>Logs:</h2>
      <ul>
        {logs.map((log, index) => (
          
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
