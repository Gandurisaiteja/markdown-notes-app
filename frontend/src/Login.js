import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ setToken }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      if (!email || !password) {
        alert("Enter email and password");
        return;
      }

      const res = await axios.post('http://localhost:5000/login', { email, password });

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  const register = async () => {
    try {
      if (!email || !password) {
        alert("Enter email and password");
        return;
      }

      await axios.post('http://localhost:5000/register', { email, password });
      alert("Registered. Now login.");

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.msg || "Register failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h2>Notes App</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={login}>
          Login
        </button>

        <button className="register-btn" onClick={register}>
          Register
        </button>

      </div>
    </div>
  );
}

export default Login;