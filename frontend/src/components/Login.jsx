import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './LoginForm.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      console.log('Login response:', response.data); // Log the login response
      localStorage.setItem('token',response.data.token);
      setAuth({ token: response.data.token, userId: response.data.userId });
      navigate('/page');  // Navigate to the protected page
    } catch (error) {
      console.error('Login failed:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div id='login-form'>
    <form onSubmit={handleSubmit} >
      <h2>Login</h2>
      <label htmlFor="username">Username:</label>

      <input 
        type="text" 
        
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <label htmlFor="password">Password:</label>

      <input 
        type="password" 
        
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit">Submit</button>
    </form>
    </div>
  );
};

export default Login;
