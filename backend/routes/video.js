const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const auth = require('../middleware/auth');
const upload = require('multer')({ dest: 'uploads/' });
const Video = require('../models/Video');
const User = require('../models/User');

let gfsBucket;
mongoose.connection.once('open', () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'videos'
  });
});

// Fetch YouTube Metadata (oEmbed)
router.get('/youtube-meta', async (req, res) => {
  try {
    const youtubeUrl = req.query.url;
    if (!youtubeUrl) return res.status(400).json({ message: 'URL is required' });
    
    // Using dynamic import for node-fetch if available, or native fetch
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)).catch(() => global.fetch(...args));
    
    const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeUrl)}&format=json`);
    if (!response.ok) return res.status(404).json({ message: 'Could not fetch metadata' });
    
    const data = await response.json();
    res.json({
      title: data.title,
      thumbnailUrl: data.thumbnail_url || `https://img.youtube.com/vi/${data.html?.match(/embed\/([^?]+)/)?.[1]}/maxresdefault.jpg`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload Video (Supports GridFS upload or Direct Link like YouTube)
router.post('/', auth, upload.single('video'), async (req, res) => {
  try {
    const { title, description, thumbnailUrl, youtubeUrl } = req.body;
    
    // If it's a YouTube/Direct Link
    if (youtubeUrl) {
      const newVideo = new Video({
        userId: req.user.id,
        title,
        description,
        thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
        videoUrl: youtubeUrl
      });
      await newVideo.save();
      return res.status(201).json(newVideo);
    }

    // Otherwise, handle File Upload to GridFS
    if (!req.file) {
      return res.status(400).json({ message: 'No video file or URL provided' });
    }

    const uniqueFilename = `${Date.now()}-${req.file.originalname}`;
    const writeStream = gfsBucket.openUploadStream(uniqueFilename, {
      contentType: req.file.mimetype
    });
    
    fs.createReadStream(req.file.path).pipe(writeStream);

    writeStream.on('error', (err) => {
      console.error('GridFS Upload Error:', err);
      res.status(500).json({ message: 'Error uploading to GridFS' });
    });

    writeStream.on('finish', async () => {
      try {
        // Delete the temporary local file
        fs.unlinkSync(req.file.path);
        
        const videoUrl = `http://localhost:5000/api/videos/stream/${uniqueFilename}`;
        
        const newVideo = new Video({
          userId: req.user.id,
          title,
          description,
          thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
          videoUrl
        });
        
        await newVideo.save();
        res.status(201).json(newVideo);
      } catch (err) {
        console.error('Video Save Error:', err);
        if (err.name === 'ValidationError' && err.errors?.userId?.kind === 'ObjectId') {
          return res.status(401).json({ message: 'Invalid session token. Please log out and log back in.' });
        }
        res.status(500).json({ message: 'Error saving video to database' });
      }
    });

  } catch (err) {
    console.error('Upload Route Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Stream Video from GridFS
router.get('/stream/:filename', async (req, res) => {
  try {
    const files = await gfsBucket.find({ filename: req.params.filename }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    const file = files[0];
    const fileSize = file.length;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': file.contentType || 'video/mp4',
      });
      
      const downloadStream = gfsBucket.openDownloadStreamByName(req.params.filename, { start, end: end + 1 });
      downloadStream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': file.contentType || 'video/mp4',
      });
      const downloadStream = gfsBucket.openDownloadStreamByName(req.params.filename);
      downloadStream.pipe(res);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Video
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedVideo = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVideo) return res.status(404).json({ message: 'Video not found' });
    res.json(updatedVideo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().populate('userId', 'username avatar').sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Video
router.delete('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Video by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('userId', 'username avatar')
      .populate('comments.userId', 'username avatar');
      
    if (!video) return res.status(404).json({ message: 'Video not found' });
    
    video.views += 1;
    await video.save();
    
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like a Video
router.put('/:id/like', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    // Check if already liked
    if (video.likes.includes(req.user.id)) {
      video.likes = video.likes.filter(id => id.toString() !== req.user.id);
    } else {
      video.likes.push(req.user.id);
      // Remove from dislikes if present
      video.dislikes = video.dislikes.filter(id => id.toString() !== req.user.id);
    }

    await video.save();
    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dislike a Video
router.put('/:id/dislike', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    // Check if already disliked
    if (video.dislikes.includes(req.user.id)) {
      video.dislikes = video.dislikes.filter(id => id.toString() !== req.user.id);
    } else {
      video.dislikes.push(req.user.id);
      // Remove from likes if present
      video.likes = video.likes.filter(id => id.toString() !== req.user.id);
    }

    await video.save();
    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a Comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const newComment = {
      userId: req.user.id,
      text
    };

    video.comments.unshift(newComment); // Add to beginning of array
    await video.save();

    // Re-fetch to populate user info for the new comment
    const updatedVideo = await Video.findById(req.params.id)
      .populate('comments.userId', 'username avatar');

    res.json(updatedVideo.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search Videos
router.get('/search/find', async (req, res) => {
  try {
    const query = req.query.q;
    const videos = await Video.find({ title: { $regex: query, $options: 'i' } }).populate('userId', 'username avatar');
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
