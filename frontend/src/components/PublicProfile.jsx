import React, { useState, useEffect,useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import '../index.css';
import NavBar from './NavBar';


const PublicProfile = () => {
  const { userId } = useParams();
  const { auth } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [userId]);

  useEffect(() => {
    if (profile) {
      checkIfFollowing();
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile for user:', userId);
      const response = await api.get(`/users/${userId}`);
      console.log('Profile data:', response.data);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      console.log('Fetching posts for user:', userId);
      const response = await api.get(`/posts/user/${userId}`);
      console.log('Posts data:', response.data);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const checkIfFollowing = async () => {
    try {
      const response = await api.get('/users/profile');
      const following = response.data.following.map(user => user._id);
      setIsFollowing(following.includes(userId));
    } catch (error) {
      console.error('Error checking if following:', error);
    }
  };

  const handleFollow = async () => {
    try {
      await api.post(`/users/${userId}/follow`);
      setIsFollowing(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await api.post(`/users/${userId}/unfollow`);
      setIsFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
    <NavBar />
    <div className='profile-card'>
      <h1>{profile.username}'s Profile</h1>
      <p> {profile.username}</p>
      {profile.profilePic && ( <img src={`http://localhost:5000/users/profilePic/${profile.profilePic}`} alt="Profile" width="150" height="150" />)}
      <p>Followers: {profile.followers.length}</p>
      <p>Following: {profile.following.length}</p>
      {isFollowing ? (
        <button onClick={handleUnfollow} className='button'>Unfollow</button>
      ) : (
        <button onClick={handleFollow}className='button'>Follow</button>
      )}
      {auth && auth.userId !== userId && (
        <Link to={`/chat/${userId}`}>
          <button className='button'>Chat</button>
        </Link>
      )}
      <h2>User's Posts</h2>
      <div className='post-list'>

      <ul className='post-item'>
        {posts.map((post) => (
          <li key={post._id}>
            <p>{post.content}</p>
            <p><strong>Created At:</strong> {new Date(post.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
      </div>
    </div>
    </div>
  );
};

export default PublicProfile;
