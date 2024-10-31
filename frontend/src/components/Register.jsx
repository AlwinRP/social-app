import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './LoginForm.css';


const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', {
        username,
        password,
        email
      });
      setAuth({ token: response.data.token });
      localStorage.setItem('token', response.data.token);
      navigate('/login');  // Navigate to the login page
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div id='login-form'>
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
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
      <label htmlFor="Email">Email:</label>

      <input 
        type="email" 
         

        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <button type="submit">Register</button>
    </form>
    </div>
  );
};

export default Register;
