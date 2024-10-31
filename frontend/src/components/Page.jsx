import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import ViewPost from './ViewPost';
import NavBar from './NavBar';


const Page = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts/all');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div>
      <NavBar/>
    <div className="page-container">
      <h1>All Posts</h1>
      {posts.map(post => (
        <ViewPost
          key={post._id}
          post={post}
        />
      ))}
    </div>
    </div>
  );
};

export default Page;
