const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// User registration
router.post('/register', async (req, res) => 
  { const newUser = new User(req.body); 
    await newUser.save(); 
    res.send('User registered!');
  });

// User login
router.post('/login', async (req, res) => 
  { const { username, password } = req.body; 
try 
{ const user = await User.findOne({ username }); 
if (!user) return res.status(400).json({ error: 'Invalid username or password' }); 
const isMatch = await user.comparePassword(password); 
if (!isMatch) return res.status(400).json({ error: 'Invalid username or password' }); 
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); 
res.json({ token, userId: user._id }); // Include userId in the response 
} catch (err) { console.error('Error during user login:', err); 
  res.status(500).json({ error: 'An error occurred while logging in the user' });
}
});

module.exports = router;
