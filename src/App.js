import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient"; // Your Supabase config
import Papa from "papaparse";


export default function App() {
  const [nameOrId, setNameOrId] = useState("");
  const [matched, setMatched] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [logs, setLogs] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [newEmployee, setNewEmployee] = useState("");
  const [isAdminView, setIsAdminView] = useState(false);
  
  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from("employees").select("name");
      if (error) {
        console.error("Error fetching employees:", error.message);
      } else {
        const names = data.map((emp) => emp.name);
        setEmployeeList(names);
      }
    };
  
    fetchEmployees();
  }, []);

  
  

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    let greeting = "Welcome back, buddy!";
    if (hour >= 5 && hour < 12) greeting = "Good morning, UPSCALE!";
    else if (hour >= 12 && hour < 18) greeting = "Good afternoon, UPSCALE!";
    else greeting = "Good evening, UPSCALE!";
    alert(greeting);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDownloadCSV = () => {
    if (logs.length === 0) {
      alert("No logs available to download.");
      return;
    }
  
    const csv = Papa.unparse(logs); // Convert logs to CSV format
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "time_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  

  const handleAddEmployee = async () => {
    const name = formatName(newEmployee.trim());
    if (!name) {
      alert("Please enter a name.");
      return;
    }
  
    if (employeeList.includes(name)) {
      alert("Employee already exists.");
      return;
    }
  
    const { error } = await supabase.from("employees").insert([{ name }]);
    if (error) {
      console.error("Failed to add employee:", error.message);
      alert("Failed to add employee.");
    } else {
      alert(`Employee "${name}" added successfully!`);
      setEmployeeList([...employeeList, name]);
      setNewEmployee("");
    }
  };

  const formatName = (name) =>
    name.trim().replace(/\b\w/g, (char) => char.toUpperCase());

  const handleTimeLog = async (type) => {
    const name = formatName(nameOrId.trim());
    if (!employeeList.includes(name)) {
      alert("Please enter a valid name from the list.");
      return;
    }

    const timestamp = new Date().toISOString();
    let updates = {
      name_or_id: name,
      created_at: timestamp,
    };

    if (type === "Time In") {
      updates.time_in = timestamp;
    } else {
      updates.time_out = timestamp;
    }

    const { data, error } = await supabase.from("time_logs").insert([updates]);

    if (error) {
      console.error("Error saving log:", error.message);
      alert("Failed to save log.");
    } else {
      console.log(`${type} logged successfully`, data);
      const newLog = {
        name,
        type,
        time: new Date(timestamp).toLocaleString(),
      };
      setLogs((prev) => [newLog, ...prev]);
      setNameOrId("");
      setMatched(false);
    }
  };

  const filteredSuggestions = employeeList.filter(
    (name) =>
      name.toLowerCase().includes(nameOrId.toLowerCase()) &&
      nameOrId.trim() !== ""
  );

  return (
    <div style={{ textAlign: "center", paddingTop: "40px" }}>
      <h2 style={{ color: "green" }}>
        {currentTime.toLocaleString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </h2>

      <h1>⏰ Upscale Specs Time Tracker</h1>
      <p>Enter your name or ID below</p>

      <input
        type="text"
        value={nameOrId}
        onChange={(e) => {
          const val = e.target.value;
          setNameOrId(val);
          setMatched(employeeList.includes(formatName(val)));
        }}
        onBlur={() => setNameOrId(formatName(nameOrId))}
        list="suggestions"
        placeholder="Enter name"
        style={{ padding: "8px", fontSize: "16px", width: "200px" }}
      />
      <datalist id="suggestions">
        {filteredSuggestions.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>


      <div style={{ marginTop: "20px" }}> 
        <button
          disabled={!matched}
          onClick={() => handleTimeLog("Time In")}
          style={{ marginRight: "10px", padding: "10px 20px" }}
        >
          Time In
        </button>
        <button
          disabled={!matched}
          onClick={() => handleTimeLog("Time Out")}
          style={{ padding: "10px 20px" }}
        >
          Time Out
        </button>
      </div>

      <div style={{ marginTop: "40px", borderTop: "1px solid #ccc", paddingTop: "20px" }}>
  <h3>Add New Employee (Admin Only)</h3>
  <input
    type="text"
    placeholder="Enter new employee name" 
    value={newEmployee}
    onChange={(e) => setNewEmployee(e.target.value)}
    style={{ padding: "8px", fontSize: "16px", width: "200px", marginRight: "10px" }}
  />
  <br>
  </br>
  <button onClick={handleAddEmployee} style={{ padding: "10px 20px" }}>
    Add Employee
  </button>
  <br>
  </br>

  <button
  onClick={() => setIsAdminView(!isAdminView)}
  style={{ margin: "10px", padding: "8px 16px", background: "#333", color: "white" }}
>
  {isAdminView ? "Switch to User View" : "Switch to Admin View"}
</button>

</div>  

{isAdminView && (
  <div style={{ maxHeight: "400px", overflowY: "scroll", marginTop: "20px" }}>
    <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", fontSize: "14px" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Status</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id}>
            <td>{log.id}</td>
            <td>{log.name}</td>
            <td>{log.status}</td>
            <td>{new Date(log.timestamp).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

<button
  onClick={handleDownloadCSV}
  style={{ marginTop: "20px", padding: "10px 20px" }}
>
  📁 Download Logs as CSV
</button>

      <h2 style={{ marginTop: "40px" }}>Logs</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {logs.map((log, index) => (
          <li key={index}>
            {log.name} - {log.type} at {log.time}
          </li>
        ))}
      </ul>
    </div>

    

  );

  
}
