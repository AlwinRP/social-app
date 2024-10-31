const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');
const authMiddleware = require('../middleware/auth');

// Create a new comment
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.body.post);
    if (!post) return res.status(404).send('Post not found');

    const newComment = new Comment({
      content: req.body.content,
      author: req.user.id,
      post: req.body.post
    });
    await newComment.save();

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'An error occurred while creating the comment' });
  }
});

// Get all comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('author').sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'An error occurred while fetching the comments' });
  }
});

// Update a comment
router.put('/update/:commentId', authMiddleware, async (req, res) => {
  try {
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: req.params.commentId, author: req.user.id },
      { content: req.body.content },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(updatedComment);
  } catch (err) {
    console.error('Error updating comment:', err);
    res.status(500).json({ error: 'An error occurred while updating the comment' });
  }
});

// Delete a comment by author only
router.delete('/delete/:commentId', authMiddleware, async (req, res) => {
  try {
    const deletedComment = await Comment.findOneAndDelete({ _id: req.params.commentId, author: req.user.id });
    if (!deletedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const post = await Post.findById(deletedComment.post);
    post.comments.pull(deletedComment._id);
    await post.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'An error occurred while deleting the comment' });
  }
});

module.exports = router;
