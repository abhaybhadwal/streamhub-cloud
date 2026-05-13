const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'mock_db.json');

// Helper to load/save
const loadData = () => {
  if (!fs.existsSync(DB_PATH)) {
    return { users: [], videos: [] };
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
};

const saveData = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

const MemoryStore = {
  get data() { return loadData(); },
  
  get users() { return this.data.users; },
  get videos() { return this.data.videos; },

  findUser: (query) => {
    const data = loadData();
    return data.users.find(u => u.email === query.email || u.username === query.username);
  },
  
  saveUser: (user) => {
    const data = loadData();
    const newUser = { ...user, _id: Date.now().toString() };
    data.users.push(newUser);
    saveData(data);
    return newUser;
  },
  
  getVideos: () => loadData().videos,
  
  saveVideo: (video) => {
    const data = loadData();
    // Prevent duplicates for pre-loaded videos
    if (video._id && data.videos.find(v => v._id === video._id)) return video;
    
    const newVideo = { 
      _id: video._id || Date.now().toString(), 
      ...video, 
      createdAt: video.createdAt || new Date() 
    };
    data.videos.push(newVideo);
    saveData(data);
    return newVideo;
  },

  updateVideo: (id, updates) => {
    const data = loadData();
    const index = data.videos.findIndex(v => v._id === id);
    if (index === -1) return null;
    
    data.videos[index] = { ...data.videos[index], ...updates };
    saveData(data);
    return data.videos[index];
  },

  deleteVideo: (id) => {
    const data = loadData();
    const filtered = data.videos.filter(v => v._id !== id);
    saveData({ ...data, videos: filtered });
    return true;
  }
};

module.exports = MemoryStore;
