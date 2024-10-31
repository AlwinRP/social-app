import React, { useContext, useState, useEffect,useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import '../index.css';


const NavBar = () => {
  const { auth, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => { 
    const handleClickOutside = (event) => { 
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { 
        setSearchResults([]); 
      } 
    }; document.addEventListener('mousedown', handleClickOutside); 
    return () => { document.removeEventListener('mousedown', handleClickOutside); 

    }; }, 
    [dropdownRef]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      console.log('Auth user ID:', auth?.userId); // Log the authenticated user ID
      const response = await api.get(`/users/search?username=${searchTerm}`);
      console.log('Search response:', response.data); // Log the search results
      const filteredResults = response.data.filter(user => user._id !== auth.userId); // Filter out the logged-in user
      console.log('Filtered results:', filteredResults); // Log the filtered results
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    
    <nav>
      <div className='nav-left'>
      <form onSubmit={handleSearch}>
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <button type="submit">Search</button>
  </form>
  {searchResults.length > 0 && (
    <div className="search-dropdown" ref={dropdownRef}>
      <ul>
        {searchResults.map((user) => (
          <li key={user._id}>
            <Link to={`/profile/${user._id}`}>{user.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  )}
  </div>
  <div className='nav-right'>
  <Link to="/page">Home</Link>
  {auth && auth.token ? (
    <>
      <Link to="/profile">Profile</Link>
      <button onClick={handleLogout}>Logout</button>
    </>
  ) : (
    <Link to="/login">Login</Link>
  )}
  </div>
</nav>

  );
};

export default NavBar;
