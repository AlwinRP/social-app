const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profilepic/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/uploadProfilePic', authMiddleware, upload.single('profilePic'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.profilePic = req.file.filename; // Save the file name
    await user.save();

    res.json({ message: 'Profile picture updated successfully', profilePic: user.profilePic });
  } catch (err) {
    console.error('Error uploading profile picture:', err);
    res.status(500).json({ error: 'An error occurred while uploading the profile picture' });
  }
});

router.get('/profilePic/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads/profilepic', req.params.filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).send('File not found');
    }
  });
});

module.exports = router;


// Follow user
router.post('/:userId/follow', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  const targetUser = await User.findById(req.params.userId);
  if (!targetUser) return res.status(404).send('User not found');

  if (user._id.equals(targetUser._id)) {
    return res.status(400).json({ error: 'You cannot follow yourself' });
  }

  if (user.following.includes(targetUser._id)) {
    return res.status(400).json({ error: 'You are already following this user' });
  }

  user.following.push(targetUser._id);
  targetUser.followers.push(user._id);

  await user.save();
  await targetUser.save();

  res.send('Followed user!');
});



router.post('/:userId/unfollow', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  const targetUser = await User.findById(req.params.userId);
  if (!targetUser) return res.status(404).send('User not found');

  user.following.pull(targetUser._id);
  targetUser.followers.pull(user._id);

  await user.save();
  await targetUser.save();

  res.send('Unfollowed user!');
});

router.get('/profile', authMiddleware, async (req, res) => { 
  try { const user = await User.findById(req.user.id).populate('followers').populate('following'); 
    res.json(user); } catch (err) { console.error('Error fetching profile:', err); 
      res.status(500).json({ error: 'An error occurred while fetching the profile' }); }

});

router.get('/search', authMiddleware, async (req, res) => { 
  try { 
    const searchTerm = req.query.username; 
    const users = await User.find({ username: new RegExp(searchTerm, 'i') }).select('username _id'); 
    res.json(users); 
  } catch (err) 
  { console.error('Error searching users:', err); 
    res.status(500).json({ error: 'An error occurred while searching for users' 
    }); }
});

// Fetch user profile by ID
router.get('/:userId', authMiddleware, async (req, res) => { 
  try { const user = await User.findById(req.params.userId).populate('followers').populate('following'); 
    if (!user) { return res.status(404).json({ error: 'User not found' }); 
  } res.json({ username: user.username, email: user.email, profilePic: user.profilePic, // Include profile picture 
    followers: user.followers, 
    following: user.following }); 
  } catch (err) { console.error('Error fetching profile:', err); 
    res.status(500).json({ error: 'An error occurred while fetching the profile' }); } 
  });

module.exports = router;
