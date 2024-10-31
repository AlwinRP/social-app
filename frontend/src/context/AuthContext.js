import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        try {
          const response = await api.get('/users/profile');
          setAuth(response.data);
          const postsResponse = await api.get('/posts/user');
          setPosts(postsResponse.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, posts, setPosts }}>
      {children}
    </AuthContext.Provider>
  );
};
