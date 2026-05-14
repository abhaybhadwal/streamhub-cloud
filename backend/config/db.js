const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (uri && uri !== 'your_mongodb_atlas_connection_string') {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 }); // Fast fail if not running
      console.log('MongoDB Connected to Atlas/Local');
      return;
    } else {
      throw new Error('No valid MONGO_URI');
    }
  } catch (err) {
    console.log('--- 🚀 INDUSTRY LEVEL MOCK MODE ACTIVATED 🚀 ---');
    console.log('Proceeding with In-Memory store for users and videos.');
    console.log('Starting in-memory MongoDB server... This may take a moment.');
    
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('In-Memory MongoDB Connected successfully!');
      console.log('🔗 MongoDB Compass URI:', mongoUri);
      console.log('-----------------------------------------------');
      
      // Seed Database
      const User = require('../models/User');
      const Video = require('../models/Video');
      
      const videoCount = await Video.countDocuments();
      if (videoCount === 0) {
        console.log('🌱 Database is empty. Seeding default blockbuster content...');
        
        // Create a system user for videos
        const salt = await require('bcryptjs').genSalt(10);
        const passwordHash = await require('bcryptjs').hash('password123', salt);
        
        const adminUser = await User.create({
          username: 'StreamHubStudios',
          email: 'studios@streamhub.com',
          password: passwordHash,
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200'
        });

        const bollywoodUser = await User.create({
          username: 'BollywoodCentral',
          email: 'bollywood@streamhub.com',
          password: passwordHash,
          avatar: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200'
        });

        const defaultVideos = [
          {
            userId: adminUser._id,
            title: "Inception: The Dream Is Real",
            description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
            thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
            videoUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
            views: 45000000,
            tags: ["Action", "Sci-Fi", "Thriller"]
          },
          {
            userId: adminUser._id,
            title: "Interstellar - Official Teaser",
            description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
            thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
            videoUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
            views: 89000000,
            tags: ["Sci-Fi", "Drama", "Space"]
          },
          {
            userId: adminUser._id,
            title: "The Dark Knight Rises",
            description: "Eight years after the Joker's reign of anarchy, Batman, with the help of the enigmatic Catwoman, is forced from his exile to save Gotham City.",
            thumbnailUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800",
            videoUrl: "https://www.youtube.com/watch?v=g8evyE9TuYk",
            views: 75000000,
            tags: ["Action", "Thriller", "Drama"]
          },
          {
            userId: bollywoodUser._id,
            title: "RRR: Roar Rise Revolt",
            description: "A tale of two legendary revolutionaries and their journey far away from home before they began fighting for their country in the 1920s.",
            thumbnailUrl: "https://images.unsplash.com/photo-1514533212735-5df27d970db0?w=800",
            videoUrl: "https://www.youtube.com/watch?v=NgBoMJy386M",
            views: 35000000,
            tags: ["Indian", "Action", "Drama"]
          },
          {
            userId: bollywoodUser._id,
            title: "Jawan: Official Prevue",
            description: "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in society.",
            thumbnailUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
            videoUrl: "https://www.youtube.com/watch?v=MWO1RIVc720",
            views: 95000000,
            tags: ["Indian", "Action", "Thriller"]
          },
          {
            userId: adminUser._id,
            title: "The Conjuring 2 - Official Trailer",
            description: "Ed and Lorraine Warren travel to North London to help a single mother raising four children alone in a house plagued by a supernatural spirit.",
            thumbnailUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800",
            videoUrl: "https://www.youtube.com/watch?v=VFsmuRPClr4",
            views: 12000000,
            tags: ["Horror", "Mystery", "Thriller"]
          },
          {
            userId: adminUser._id,
            title: "Deadpool 3: Official Teaser",
            description: "The Merc with a Mouth returns for more fourth-wall-breaking shenanigans with some very special mutant friends.",
            thumbnailUrl: "https://images.unsplash.com/photo-1608889175123-8ec3a6786547?w=800",
            videoUrl: "https://www.youtube.com/watch?v=73_1biulkIE",
            views: 112000000,
            tags: ["Action", "Comedy"]
          }
        ];

        await Video.insertMany(defaultVideos);
        console.log('🎉 Seeded successfully! 7 dynamic trailers are now live!');
      }
    } catch (mockErr) {
      console.error('Failed to start/seed in-memory mock MongoDB:', mockErr);
    }
  }
};

module.exports = connectDB;
