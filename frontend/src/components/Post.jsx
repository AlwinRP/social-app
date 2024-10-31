import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './post.css'
import { AuthContext } from '../context/AuthContext';


const Post = ({ post, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post?.content || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/post/${post._id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('content', content);
    if (selectedFile) {
      formData.append('media', selectedFile);
    }

    try {
      const response = await api.put(`/posts/update/${post._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/delete/${post._id}`);
      onDelete(post._id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="post-card">
      {isEditing ? (
        <>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <div className="post-card-content">
            <p>{post?.content || ''}</p>
            {post?.media && (
              <div className="post-media">
                {post.media.endsWith('.mp4') ? (
                  <video width="100%" controls>
                    <source src={`http://localhost:5000/posts/media/${post.media}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={`http://localhost:5000/posts/media/${post.media}`} alt="Post media" width="100%" />
                )}
              </div>
            )}
            
          </div>
          <div className="post-card-footer">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            <p><strong>Created At:</strong> {new Date(post?.createdAt).toLocaleString()}</p>
          </div>
        </>
      )}
      
    </div>
  );
};

export default Post;
