import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, ChevronDown, Star, Calendar, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CategoryCard = ({ title, img, color }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      onClick={() => navigate(`/search?q=${title.toLowerCase()}`)}
      className="relative h-64 rounded-[2.5rem] overflow-hidden group cursor-pointer border border-white/5"
    >
      <img src={img} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" alt="" />
      <div className={`absolute inset-0 bg-gradient-to-tr ${color} to-transparent opacity-60 group-hover:opacity-40 transition-opacity`} />
      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-4xl font-black tracking-[0.2em] drop-shadow-2xl">{title}</h3>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [myListIds, setMyListIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/videos');
        setVideos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchMyList = async () => {
        try {
          const token = localStorage.getItem('token');
          const { data } = await axios.get('http://localhost:5000/api/users/mylist', {
            headers: { 'x-auth-token': token }
          });
          setMyListIds(data.map(v => v._id || v));
        } catch (err) {
          console.error(err);
        }
      };
      fetchMyList();
    } else {
      setMyListIds([]);
    }
  }, [user]);

  // Auto-rotate hero section
  useEffect(() => {
    if (videos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % Math.min(videos.length, 5));
    }, 8000);
    return () => clearInterval(interval);
  }, [videos]);

  const genres = ["All Genres", "Sci-Fi", "Action", "Drama", "Documentary"];

  const handleWatchNow = () => {
    if (videos.length > 0) {
      navigate(`/watch/${videos[currentHeroIndex]._id}`);
    }
  };

  const handleToggleMyList = async () => {
    if (!user) return navigate('/auth');
    if (videos.length === 0) return;
    const videoId = videos[currentHeroIndex]._id;
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(`http://localhost:5000/api/users/mylist/${videoId}`, {}, {
        headers: { 'x-auth-token': token }
      });
      setMyListIds(data.map(v => v._id || v));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col bg-[#050811]">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center px-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {videos.length > 0 && (
            <motion.div
              key={`bg-${currentHeroIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 z-0"
            >
              <img 
                src={videos[currentHeroIndex].thumbnailUrl} 
                className="w-full h-full object-cover" 
                alt="Hero" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050811] via-[#050811]/60 to-transparent" />
              <div className="absolute inset-0 hero-gradient" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {videos.length > 0 && (
            <motion.div 
              key={`content-${currentHeroIndex}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 max-w-2xl space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="bg-red-600 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-[0.2em] border border-red-500 shadow-lg shadow-red-600/20">Trending #{currentHeroIndex + 1}</span>
                <span className="text-white text-[10px] uppercase font-bold tracking-widest bg-white/10 px-3 py-1 rounded backdrop-blur-md">Now Streaming</span>
              </div>
              
              <h1 className="text-7xl font-black tracking-tight leading-[0.9] drop-shadow-2xl text-white">
                {videos[currentHeroIndex].title}
              </h1>
              
              <p className="text-white/80 text-lg leading-relaxed max-w-lg drop-shadow-md font-medium line-clamp-3">
                {videos[currentHeroIndex].description || "Experience the most highly anticipated blockbuster of the year."}
              </p>

              <div className="flex items-center gap-4 pt-4">
                <button 
                  onClick={handleWatchNow}
                  className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-yt-gray transition-all shadow-xl shadow-white/5 active:scale-95"
                >
                  <Play fill="currentColor" size={20} />
                  Watch Now
                </button>
                <button 
                  onClick={handleToggleMyList}
                  className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all text-white active:scale-95"
                >
                  {myListIds.includes(videos[currentHeroIndex]._id) ? <Check size={20} className="text-green-400" /> : <Plus size={20} />}
                  {myListIds.includes(videos[currentHeroIndex]._id) ? 'Added to List' : 'My List'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Genres & Filters */}
      <section className="px-10 -mt-16 relative z-20">
        <div className="glass p-2 rounded-2xl flex items-center justify-between border border-white/5 shadow-2xl">
          <div className="flex gap-2">
            {genres.map((g, i) => (
              <button 
                key={g} 
                onClick={() => navigate(`/search?q=${g.toLowerCase()}`)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover:bg-white/5 text-yt-gray hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="flex gap-6 text-yt-gray text-xs font-bold mr-4">
             <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
               <Calendar size={14} />
               <span>2026</span>
               <ChevronDown size={14} />
             </div>
             <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
               <Star size={14} />
               <span>4.5+</span>
               <ChevronDown size={14} />
             </div>
          </div>
        </div>
      </section>

      {/* Content Rows */}
      <section className="px-10 py-20 space-y-24">
        
        {/* Trending Now */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Trending Now</h2>
            <button 
              onClick={() => navigate('/search?q=trending')}
              className="text-yt-gray text-xs font-bold hover:text-white transition-colors uppercase tracking-[0.2em]"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {videos.slice(0, 12).map((v) => (
              <Link to={`/watch/${v._id}`} key={v._id} className="relative aspect-video rounded-3xl overflow-hidden group cursor-pointer shadow-2xl border border-white/5">
                <img src={v.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-5 left-6">
                  <h4 className="font-bold text-sm tracking-wide">{v.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-8 pb-20">
          <h2 className="text-3xl font-bold tracking-tight">Browse By Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <CategoryCard title="ACTION" img="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800" color="from-orange-500/40" />
             <CategoryCard title="HORROR" img="https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800" color="from-red-600/40" />
             <CategoryCard title="COMEDY" img="https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800" color="from-yellow-400/40" />
          </div>
        </div>

      </section>
    </div>
  );
};

export default Home;
