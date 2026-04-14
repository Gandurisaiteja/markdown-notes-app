import React, { useState } from 'react';
import './App.css';
import Login from './Login';
import Notes from './Notes';

function App() {

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [dark, setDark] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) return <Login setToken={setToken} />;

  return (
    <div className={dark ? "app dark" : "app"}>

      <div className="topbar">
  <h2>Notes App</h2>

  <div className="topbar-actions">
  <button className="theme-btn" onClick={() => setDark(!dark)}>
  {dark ? "Light Mode" : "Dark Mode"}
</button>
    <button onClick={logout}>Logout</button>
  </div>
</div>

      <Notes token={token} />
    </div>
  );
}

export default App;