import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload as UploadIcon, X, Film, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'link'
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Auto-fetch YouTube metadata
  useEffect(() => {
    if (uploadMode === 'link' && youtubeUrl && youtubeUrl.includes('youtu')) {
      const fetchMeta = async () => {
        try {
          const { data } = await axios.get(`http://localhost:5000/api/videos/youtube-meta?url=${encodeURIComponent(youtubeUrl)}`);
          if (data.title && !title) setTitle(data.title);
          if (data.thumbnailUrl && !thumbnail) setThumbnail(data.thumbnailUrl);
        } catch (err) {
          console.error('Failed to fetch YouTube metadata', err);
        }
      };
      // Debounce slightly to wait for paste to finish
      const timer = setTimeout(fetchMeta, 500);
      return () => clearTimeout(timer);
    }
  }, [youtubeUrl, uploadMode]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (uploadMode === 'file' && !file) return;
    if (uploadMode === 'link' && !youtubeUrl) return;

    setUploading(true);
    const formData = new FormData();
    if (uploadMode === 'file') {
      formData.append('video', file);
    } else {
      formData.append('youtubeUrl', youtubeUrl);
    }
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('thumbnailUrl', thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/videos', formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(true);
      setTimeout(() => navigate('/my-content'), 2000);
    } catch (err) {
      console.error(err);
      const backendError = err.response?.data?.message;
      if (err.response?.status === 401) {
        alert(backendError || 'Authentication error. Please log out and log back in.');
      } else {
        alert(backendError || 'Upload failed: Ensure you have enough disk space and try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-20 gap-6 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
          <AlertCircle size={40} className="text-yt-gray" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Creator Access Restricted</h1>
          <p className="text-yt-gray max-w-sm">Please sign in to your StreamHub account to publish your masterpieces.</p>
        </div>
        <button 
          onClick={() => navigate('/auth')} 
          className="bg-white text-black px-10 py-4 rounded-2xl font-bold hover:bg-yt-gray transition-all shadow-xl mt-4"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-10 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between p-10 border-b border-slate-200 bg-gradient-to-r from-blue-600/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Film className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Publish Masterpiece</h2>
              <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">Studio Mode Active</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleUpload} className="p-10 space-y-10">
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => { setUploadMode('file'); setFile(null); setYoutubeUrl(''); }}
              className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${uploadMode === 'file' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => { setUploadMode('link'); setFile(null); setYoutubeUrl(''); }}
              className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${uploadMode === 'link' ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              YouTube Link
            </button>
          </div>

          <AnimatePresence mode="wait">
            {uploadMode === 'file' ? (
              !file ? (
                <motion.div 
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 flex flex-col items-center gap-6 hover:bg-slate-50 hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input
                    type="file"
                    accept="video/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                      setTitle(e.target.files[0].name.split('.')[0]);
                    }}
                  />
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center border border-slate-200 shadow-xl"
                  >
                    <UploadIcon size={40} className="text-blue-500" />
                  </motion.div>
                  <div className="text-center space-y-2 relative z-20">
                    <p className="text-xl font-bold tracking-tight text-slate-900">Drag & drop your cinematic file</p>
                    <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Up to 100MB • 4K Supported</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="file-details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-12"
                >
                  <div className="space-y-8">
                    <div className="relative aspect-video bg-black rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
                       <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button type="button" onClick={() => setFile(null)} className="bg-rose-500 text-white px-6 py-2 rounded-full font-bold text-xs shadow-lg">Change File</button>
                       </div>
                       <video src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-60" />
                       <div className="absolute bottom-6 left-6 flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={20} /></div>
                          <span className="font-bold text-sm truncate max-w-[150px]">{file.name}</span>
                       </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Movie Title</label>
                      <input type="text" required placeholder="e.g. Crystalline Horizon" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-[#2b6bff] focus:ring-2 focus:ring-blue-100 transition-all font-bold tracking-tight" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Story Description</label>
                      <textarea rows={4} placeholder="Tell the world about your masterpiece..." className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-[#2b6bff] focus:ring-2 focus:ring-blue-100 transition-all resize-none leading-relaxed" value={desc} onChange={(e) => setDesc(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Thumbnail Link</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-[#2b6bff] focus:ring-2 focus:ring-blue-100 transition-all font-medium" placeholder="https://images.unsplash.com/..." value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} />
                    </div>
                    <div className="pt-6">
                      <button type="submit" disabled={uploading || success} className={`w-full relative group overflow-hidden bg-slate-900 text-white font-black py-5 rounded-2xl transition-all shadow-xl ${uploading ? 'opacity-50' : 'hover:-translate-y-1 hover:bg-slate-800'}`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors">
                          {success ? 'PUBLISHED SUCCESSFULLY' : uploading ? 'UPLOADING...' : 'PUBLISH MASTERPIECE'}
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            ) : (
              <motion.div 
                key="link-details"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rose-400 ml-2">YouTube URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-rose-500/5 border border-rose-500/20 rounded-2xl px-6 py-4 outline-none focus:border-rose-500 transition-all font-bold tracking-tight"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Movie Title</label>
                    <input type="text" required placeholder="e.g. Crystalline Horizon" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-[#2b6bff] focus:ring-2 focus:ring-blue-100 transition-all font-bold tracking-tight" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Story Description</label>
                    <textarea rows={4} placeholder="Tell the world about your masterpiece..." className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-[#2b6bff] focus:ring-2 focus:ring-blue-100 transition-all resize-none leading-relaxed" value={desc} onChange={(e) => setDesc(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Thumbnail Link</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-[#2b6bff] focus:ring-2 focus:ring-blue-100 transition-all font-medium" placeholder="https://images.unsplash.com/..." value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} />
                  </div>
                  <div className="pt-6">
                    <button type="submit" disabled={uploading || success} className={`w-full relative group overflow-hidden bg-slate-900 text-white font-black py-5 rounded-2xl transition-all shadow-xl ${uploading ? 'opacity-50' : 'hover:-translate-y-1 hover:bg-slate-800'}`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors">
                        {success ? 'PUBLISHED SUCCESSFULLY' : uploading ? 'PUBLISHING...' : 'PUBLISH LINK'}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
};

export default Upload;
