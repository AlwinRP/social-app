import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import Comment from './Comment';
import { AuthContext } from '../context/AuthContext';

const ViewPost = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(post.likes || []);
  const [updateKey, setUpdateKey] = useState(0); // Add a key for forcing re-render
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetchComments();
  }, [updateKey]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/post/${post._id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await api.post('/comments/create', { content: newComment, post: post._id });
      setComments([response.data, ...comments]);
      setNewComment('');
      setUpdateKey(prev => prev + 1); // Force re-render
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUpdateComment = (updatedComment) => {
    setComments(comments.map(comment => (comment._id === updatedComment._id ? updatedComment : comment)));
    setUpdateKey(prev => prev + 1); // Force re-render
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(comment => comment._id !== commentId));
    setUpdateKey(prev => prev + 1); // Force re-render
  };

  const handleLikeDislike = async () => {
    try {
      const response = await api.post(`/posts/${post._id}/like`);
      setLikes(response.data.likes);
      setUpdateKey(prev => prev + 1); // Force re-render
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const isLikedByUser = Array.isArray(likes) && likes.includes(auth.userId);

  return (
    <div className="post-card" key={updateKey}>
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
        <div>
          <button onClick={handleLikeDislike}>
            {isLikedByUser ? 'Dislike' : 'Like'}
          </button>
          <p>{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</p>
        </div>
        <div>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>
      </div>
      <div className="comments-section">
        {comments.map(comment => (
          <Comment
            key={comment._id}
            comment={comment}
            onUpdate={handleUpdateComment}
            onDelete={handleDeleteComment}
          />
        ))}
      </div>
      <div className="post-card-footer">
        <p><strong>Created At:</strong> {new Date(post?.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ViewPost;
