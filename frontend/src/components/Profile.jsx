import React, { useContext, useEffect, useState } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Post from './Post';
import NavBar from './NavBar';


const Profile = () => {
  const { auth } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (auth && auth.token) {
      fetchProfile();
      fetchUserPosts();
    }
  }, [auth]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await api.get('/posts/user');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map(post => (post._id === updatedPost._id ? updatedPost : post)));
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const response = await api.post('/users/uploadProfilePic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfile({ ...profile, profilePic: response.data.profilePic });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
    <NavBar />
    <div className="profile-container">
      <h1>{profile.username}'s Profile</h1>
      <p>Email: {profile.email}</p>
      {profile.profilePic && (
        <img src={`http://localhost:5000/users/profilePic/${profile.profilePic}`} alt="Profile" width="150" height="150" />
      )}
      <form>
        <input type="file" onChange={handleFileChange} />
      </form>
      <p>Followers: {profile.followers.length}</p>
      <p>Following: {profile.following.length}</p>
      <Link to="/create-post">
        <button>Create Post</button>
      </Link>
      <h2>Your Posts</h2>
      <ul>
        {posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            onUpdate={handleUpdatePost}
            onDelete={handleDeletePost}
          />
        ))}
      </ul>
    </div>
    </div>
  );
};

export default Profile;
