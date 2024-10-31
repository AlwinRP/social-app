import React, { useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './Comment.css'

const Comment = ({ comment, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const { auth } = useContext(AuthContext);

  const handleUpdate = async () => {
    try {
      const response = await api.put(`/comments/update/${comment._id}`, { content });
      onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/comments/delete/${comment._id}`);
      onDelete(comment._id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="comment-card">
      {isEditing ? (
        <div>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <p>{comment.content} <strong>----By:</strong> {comment.author.username}</p>
          {comment.author._id === auth.userId && (
            <div>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comment;
