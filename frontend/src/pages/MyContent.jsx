import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Eye, Calendar, Film, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyContent = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', thumbnailUrl: '' });
  const { user } = useAuth();

  const fetchMyVideos = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/videos');
      setVideos(data.filter(v => v.userId?.username === user?.username || v.userId?.username === "You"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyVideos();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this masterpiece?")) {
      try {
        await axios.delete(`http://localhost:5000/api/videos/${id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setVideos(videos.filter(v => v._id !== id));
      } catch (err) {
        alert("Delete failed. Please try again.");
      }
    }
  };

  const openEditModal = (video) => {
    setEditingVideo(video);
    setEditForm({
      title: video.title,
      description: video.description || '',
      thumbnailUrl: video.thumbnailUrl
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/videos/${editingVideo._id}`, editForm, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setEditingVideo(null);
      fetchMyVideos();
      alert("Changes saved successfully!");
    } catch (err) {
      alert("Update failed. Please try again.");
    }
  };

  return (
    <div className="pt-28 px-10 pb-20 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-blue-600/20 rounded-[2rem] flex items-center justify-center text-blue-400 border border-blue-400/20 shadow-xl">
             <Film size={32} />
           </div>
           <div>
             <h1 className="text-4xl font-black tracking-tight">Creator Studio</h1>
             <p className="text-yt-gray text-sm mt-1 uppercase tracking-widest font-bold">Manage your digital library</p>
           </div>
        </div>
        <Link to="/upload" className="bg-white text-black px-8 py-3 rounded-2xl font-bold hover:bg-yt-gray transition-all shadow-xl">
           Upload New Video
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-yt-gray animate-pulse">Accessing Studio...</div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
           {videos.map((video) => (
             <motion.div 
               layout
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               key={video._id}
               className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-8 group hover:bg-white/[0.05] transition-all"
             >
                <div className="relative w-full md:w-64 aspect-video rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
                   <img src={video.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                </div>
                
                <div className="flex-1 space-y-3">
                   <h3 className="text-xl font-bold tracking-tight">{video.title}</h3>
                   <div className="flex flex-wrap gap-6 text-[12px] font-bold text-yt-gray uppercase tracking-widest">
                      <span className="flex items-center gap-2"><Eye size={14} /> {video.views.toLocaleString()} Views</span>
                      <span className="flex items-center gap-2"><Calendar size={14} /> 2026</span>
                   </div>
                   <p className="text-yt-gray text-sm line-clamp-2 leading-relaxed">
                      {video.description || "No description provided."}
                   </p>
                </div>

                <div className="flex gap-3 ml-auto">
                   <button 
                     onClick={() => openEditModal(video)}
                     className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl font-bold text-xs hover:bg-white/10 transition-all"
                   >
                      <Edit2 size={16} />
                      Edit Details
                   </button>
                   <button 
                     onClick={() => handleDelete(video._id)}
                     className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-5 py-2.5 rounded-2xl font-bold text-xs text-rose-400 hover:bg-rose-500/20 transition-all"
                   >
                      <Trash2 size={16} />
                      Delete
                   </button>
                </div>
             </motion.div>
           ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 gap-4 text-center">
           <div className="text-6xl mb-4 opacity-20">📽️</div>
           <h2 className="text-2xl font-bold">You haven't uploaded any videos yet</h2>
           <Link to="/upload" className="text-blue-400 font-bold hover:underline mt-4">Start your first upload</Link>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingVideo && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingVideo(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-[#161b2e] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-blue-600/10 to-transparent">
                <h2 className="text-2xl font-black tracking-tight">Edit Masterpiece</h2>
                <button onClick={() => setEditingVideo(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-yt-gray">Title</label>
                  <input 
                    type="text" 
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-yt-gray">Description</label>
                  <textarea 
                    rows="4"
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 transition-all resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-yt-gray">Thumbnail URL</label>
                  <input 
                    type="text" 
                    value={editForm.thumbnailUrl}
                    onChange={(e) => setEditForm({...editForm, thumbnailUrl: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                     type="button"
                     onClick={() => setEditingVideo(null)}
                     className="flex-1 px-6 py-4 rounded-2xl font-bold text-sm bg-white/5 hover:bg-white/10 transition-all"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit"
                     className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
                   >
                     <Save size={18} />
                     Save Changes
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyContent;
