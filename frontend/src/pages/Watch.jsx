import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ThumbsUp, Share2, Plus, Flag, ChevronDown, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { Lock, Star } from 'lucide-react';

const Watch = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const [videoRes, recsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/videos/${id}`),
          axios.get('http://localhost:5000/api/videos')
        ]);
        setVideo(videoRes.data);
        if (user) {
          setLiked(videoRes.data.likes?.includes(user.id) || false);
          setDisliked(videoRes.data.dislikes?.includes(user.id) || false);
          
          // Record watch history
          const token = localStorage.getItem('token');
          if (token) {
            await axios.put(`http://localhost:5000/api/users/history/${id}`, {}, {
              headers: { 'x-auth-token': token }
            }).catch(e => console.error('Failed to update history', e));
          }
          // Fetch My List status
          if (token) {
            axios.get('http://localhost:5000/api/users/mylist', {
              headers: { 'x-auth-token': token }
            }).then(res => {
              setSaved(res.data.some(v => v._id === id || v === id));
            }).catch(e => console.error('Failed to fetch my list', e));
          }
        }
        setRecommendations(recsRes.data.filter(v => v._id !== id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoData();
    window.scrollTo(0, 0);
  }, [id, user]);

  const handleToggleMyList = async () => {
    if (!user) return navigate('/auth');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(`http://localhost:5000/api/users/mylist/${id}`, {}, {
        headers: { 'x-auth-token': token }
      });
      setSaved(data.some(v => v._id === id || v === id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    if (!user) return navigate('/auth');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(`http://localhost:5000/api/videos/${id}/like`, {}, {
        headers: { 'x-auth-token': token }
      });
      setVideo({ ...video, likes: data.likes, dislikes: data.dislikes });
      setLiked(!liked);
      if (disliked) setDisliked(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async () => {
    if (!user) return navigate('/auth');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(`http://localhost:5000/api/videos/${id}/dislike`, {}, {
        headers: { 'x-auth-token': token }
      });
      setVideo({ ...video, likes: data.likes, dislikes: data.dislikes });
      setDisliked(!disliked);
      if (liked) setLiked(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`http://localhost:5000/api/videos/${id}/comment`, { text: commentText }, {
        headers: { 'x-auth-token': token }
      });
      setVideo({ ...video, comments: data });
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  if (loading) return <div className="pt-32 px-10 text-center animate-pulse">Loading Cinema...</div>;
  if (!video) return <div className="pt-32 px-10 text-center">Video not found.</div>;

  // Helper to extract YouTube ID
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytId = getYouTubeId(video.videoUrl);

  return (
    <div className="pt-28 px-10 pb-20 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      {/* Video Player & Info */}
      <div className="lg:col-span-8 space-y-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-video rounded-[2.5rem] overflow-hidden bg-[#0a0a0f] shadow-2xl border border-white/5 relative"
        >
          {(!user || !user.isPremium) ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black/80 to-black p-8 text-center z-10 backdrop-blur-sm">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
                <Lock size={32} className="text-yt-gray" />
              </div>
              <h2 className="text-3xl font-black mb-3">Premium Content Locked</h2>
              <p className="text-yt-gray max-w-md mb-8">This cinematic masterpiece is reserved for StreamHub Premium members. Upgrade now to unlock instant access.</p>
              <Link 
                to="/premium"
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold px-10 py-4 rounded-full shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform flex items-center gap-2"
              >
                <Star fill="currentColor" size={20} />
                Subscribe to Watch
              </Link>
            </div>
          ) : ytId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation"
              className="w-full h-full pointer-events-auto"
            ></iframe>
          ) : (
            <video
              src={video.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          )}
        </motion.div>

        <div className="space-y-6">
          <h1 className="text-3xl font-black tracking-tight leading-tight">{video.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg overflow-hidden">
                {video.userId?.avatar ? (
                  <img src={video.userId.avatar} alt="Creator" className="w-full h-full object-cover" />
                ) : (
                  video.userId?.username?.[0].toUpperCase() || 'Y'
                )}
              </div>
              <div>
                <h4 className="font-bold text-lg">{video.userId?.username}</h4>
                <p className="text-yt-gray text-[10px] uppercase tracking-[0.2em] font-bold">Verified Content Partner</p>
              </div>
              <button 
                onClick={() => setSubscribed(!subscribed)}
                className={`ml-6 px-8 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 flex items-center gap-2 ${
                  subscribed 
                    ? 'bg-white/10 text-white border border-white/10' 
                    : 'bg-white text-black hover:bg-yt-gray'
                }`}
              >
                {subscribed && <Check size={16} />}
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10 shadow-lg">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-l-full transition-all border-r border-white/10 ${
                    liked ? 'text-blue-400 bg-blue-400/10' : 'hover:bg-white/5'
                  }`}
                >
                  <ThumbsUp size={18} fill={liked ? "currentColor" : "none"} />
                  <span className="font-bold text-sm">{video.likes?.length || 0}</span>
                </button>
                <button 
                  onClick={handleDislike}
                  className={`flex items-center px-4 py-2.5 hover:bg-white/5 rounded-r-full transition-colors ${
                    disliked ? 'text-rose-400 bg-rose-400/10' : 'hover:bg-white/5'
                  }`}
                >
                  <ThumbsUp size={18} className="rotate-180" fill={disliked ? "currentColor" : "none"} />
                </button>
              </div>
              
              <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-full font-bold text-sm hover:bg-white/10 transition-all">
                <Share2 size={18} />
                Share
              </button>
              
              <button 
                onClick={handleToggleMyList}
                className={`p-3 rounded-full border border-white/10 transition-all ${
                  saved ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/20' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {saved ? <Check size={20} /> : <Plus size={20} />}
              </button>
            </div>
          </div>

          <div className="bg-white/[0.03] p-8 rounded-[2rem] border border-white/5 space-y-4 backdrop-blur-sm">
            <div className="flex gap-6 font-bold text-sm uppercase tracking-widest text-yt-gray">
              <span className="text-white">{video.views.toLocaleString()} views</span>
              <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
            </div>
            <p className="text-yt-gray leading-relaxed text-[15px] font-medium whitespace-pre-line">
              {video.description || "In a world of two realities: one, everyday life; the other, what lies behind it."}
            </p>
          </div>

          {/* Comments Section */}
          <div className="pt-8 space-y-8">
            <h3 className="text-2xl font-bold tracking-tight">
              {video.comments?.length || 0} Comments
            </h3>

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center font-bold text-lg flex-shrink-0 overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="You" className="w-full h-full object-cover" />
                ) : (
                  user?.username?.[0].toUpperCase() || '?'
                )}
              </div>
              <div className="flex-1 space-y-3">
                <textarea
                  className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none resize-none pb-2 text-sm transition-colors placeholder:text-yt-gray"
                  placeholder="Add a public comment..."
                  rows={2}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={!user}
                />
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setCommentText('')}
                    className="px-4 py-2 text-sm font-bold hover:bg-white/10 rounded-full transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={!commentText.trim() || !user}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-sm font-bold rounded-full transition-colors"
                  >
                    Comment
                  </button>
                </div>
                {!user && <p className="text-xs text-rose-400 text-right">You must be logged in to comment.</p>}
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-8 pt-6">
              {video.comments?.map((c, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden border border-white/5">
                    {c.userId?.avatar ? (
                      <img src={c.userId.avatar} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      c.userId?.username?.[0].toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">@{c.userId?.username || 'user'}</span>
                      <span className="text-xs text-yt-gray">{formatDistanceToNow(new Date(c.createdAt))} ago</span>
                    </div>
                    <p className="text-sm leading-relaxed">{c.text}</p>
                    <div className="flex items-center gap-4 pt-1 text-yt-gray">
                      <button className="hover:text-white transition-colors"><ThumbsUp size={14} /></button>
                      <button className="hover:text-white transition-colors"><ThumbsUp size={14} className="rotate-180" /></button>
                      <button className="text-xs font-bold hover:text-white transition-colors">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Sidebar */}
      <div className="lg:col-span-4 space-y-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-black tracking-tight">Up Next</h3>
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-1 rounded">Autoplay On</span>
        </div>
        
        <div className="flex flex-col gap-6">
          {recommendations.length > 0 ? recommendations.slice(0, 12).map((v) => (
            <Link to={`/watch/${v._id}`} key={v._id} className="flex gap-4 group">
              <div className="relative w-48 aspect-video rounded-2xl overflow-hidden flex-shrink-0 shadow-xl border border-white/5">
                <img src={v.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 scale-75 group-hover:scale-100 transition-transform">
                     <ThumbsUp size={16} fill="white" />
                   </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 py-1">
                <h4 className="font-bold text-[14px] line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">{v.title}</h4>
                <div className="text-yt-gray text-[12px] font-medium">
                  <p className="hover:text-white transition-colors">{v.userId?.username}</p>
                  <p className="text-[11px] font-bold uppercase tracking-tighter mt-1">{v.views.toLocaleString()} views</p>
                </div>
              </div>
            </Link>
          )) : (
            <div className="text-yt-gray text-sm italic">Loading recommendations...</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Watch;
