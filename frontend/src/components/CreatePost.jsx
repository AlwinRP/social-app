import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    if (selectedFile) {
      formData.append('media', selectedFile);
    }

    try {
      await api.post('/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(`/profile`); // Navigate back to the profile page after submitting the post
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="form-container">
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
