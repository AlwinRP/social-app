const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/posts/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Create a new post with optional media file
router.post('/create', authMiddleware, upload.single('media'), async (req, res) => {
  try {
    const newPost = new Post({
      content: req.body.content,
      author: req.user.id,
      media: req.file ? req.file.filename : null // Save the file path if a file was uploaded
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'An error occurred while creating the post' });
  }
});

// Add a comment to a post
router.post('/:postId/comment', authMiddleware, async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).send('Post not found');
  const newComment = new Comment({ ...req.body, author: req.user.id, post: req.params.postId });
  await newComment.save();
  post.comments.push(newComment);
  await post.save();
  res.send('Comment added!');
});

// Like/unlike a post
router.post('/:postId/like', authMiddleware, async (req, res) => {
  try { const post = await Post.findById(req.params.postId); 
    if (!post) return res.status(404).send('Post not found'); 
    if (post.likes.includes(req.user.id)) 
      { post.likes.pull(req.user.id); } 
    else { post.likes.push(req.user.id); } 
    await post.save(); res.json(post); // Return the updated post 
    } catch (err) { console.error('Error liking/unliking post:', err);
       res.status(500).json({ error: 'An error occurred while liking/unliking the post' 
        
       }); }
});

// Fetch all posts
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find().populate('author').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'An error occurred while fetching the posts' });
  }
});

// Fetch posts for a specific user
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId }).populate('author').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching user posts:', err);
    res.status(500).json({ error: 'An error occurred while fetching the user posts' });
  }
});

// Get all posts for a user
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching user posts:', err);
    res.status(500).json({ error: 'An error occurred while fetching the user posts' });
  }
});

// Update a post
router.put('/update/:postId', authMiddleware, upload.single('media'), async (req, res) => {
  try {
    const updateData = { content: req.body.content };
    if (req.file) {
      updateData.media = req.file.filename; // Update the media file if a new file was uploaded
    }
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.postId, author: req.user.id },
      updateData,
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(updatedPost);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'An error occurred while updating the post' });
  }
});

// Delete a post
router.delete('/delete/:postId', authMiddleware, async (req, res) => {
  try {
    const deletedPost = await Post.findOneAndDelete({ _id: req.params.postId, author: req.user.id });
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'An error occurred while deleting the post' });
  }
});

// Serve media files
router.get('/media/:filename', (req, res) => { 
  const filePath = path.join(__dirname, '../uploads/posts', req.params.filename); 
  console.log('Serving file from path:', filePath); // Add logging 
  res.sendFile(filePath, (err) => { 
    if (err) { 
      console.error('Error sending file:', err); 
      res.status(404).send('File not found'); 
    } }); 
  });
module.exports = router;
