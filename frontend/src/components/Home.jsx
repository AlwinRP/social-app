import React from 'react';
import { Link } from 'react-router-dom';
import './LoginForm.css'

const Home = () => {
  return (
    <div id='login-form'>
      <div id='welcome'>
      <h1>Welcome to Social Media Platform</h1>
      <div>
        <Link to="/login">
          <button id='button'>Existing User</button>
        </Link>
        <Link to="/register">
          <button id='button'>New Account</button>
        </Link>
      </div>
      </div>
    </div>
  );
};

export default Home;
