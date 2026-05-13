const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Get user history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'history',
      populate: {
        path: 'userId',
        select: 'username avatar'
      }
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user.history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add video to history
router.put('/history/:videoId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Remove if already exists so we can push it to the top
    user.history = user.history.filter(id => id.toString() !== req.params.videoId);
    
    // Add to beginning of array
    user.history.unshift(req.params.videoId);

    // Keep only last 100 watched
    if (user.history.length > 100) {
      user.history.pop();
    }

    await user.save();
    res.json(user.history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user My List
router.get('/mylist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'myList',
      populate: {
        path: 'userId',
        select: 'username avatar'
      }
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user.myList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle video in My List
router.put('/mylist/:videoId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const videoId = req.params.videoId;
    const isSaved = user.myList.some(id => id.toString() === videoId);

    if (isSaved) {
      user.myList = user.myList.filter(id => id.toString() !== videoId);
    } else {
      user.myList.unshift(videoId);
    }

    await user.save();
    res.json(user.myList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user profile
router.put('/profile', auth, upload.single('avatar'), async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if new username/email is already taken by someone else
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: 'Username is already taken' });
      user.username = username;
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) return res.status(400).json({ message: 'Email is already registered' });
      user.email = email;
    }

    if (req.file) {
      user.avatar = `http://localhost:5000/${req.file.path.replace(/\\/g, '/')}`;
    }

    await user.save();
    
    res.json({ id: user.id, username: user.username, email: user.email, avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
