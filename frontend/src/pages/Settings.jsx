import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Save, AlertCircle, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      setFormData({
        username: user.username || '',
        email: user.email || ''
      });
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
    window.scrollTo(0, 0);
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      submitData.append('username', formData.username);
      submitData.append('email', formData.email);
      if (avatarFile) {
        submitData.append('avatar', avatarFile);
      }

      const { data } = await axios.put('http://localhost:5000/api/users/profile', submitData, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      updateUser(data);
      setSuccess('Profile updated successfully!');
      setAvatarFile(null); // Reset file input after successful upload
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="pt-24 px-10 pb-20 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
          <SettingsIcon className="text-blue-500" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Account Settings</h1>
          <p className="text-yt-gray text-sm">Update your profile information</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
        <form onSubmit={handleSubmit} className="space-y-8 max-w-lg">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-3 text-sm">
              <Save size={18} />
              {success}
            </div>
          )}

          {/* Avatar Upload */}
          <div className="flex items-center gap-6">
            <div 
              className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-3xl shadow-lg border-2 border-white/20 cursor-pointer group overflow-hidden"
              onClick={() => fileInputRef.current.click()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{formData.username?.[0]?.toUpperCase() || '?'}</span>
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <div>
              <p className="font-bold mb-1">Profile Picture</p>
              <p className="text-sm text-yt-gray mb-3">Upload a new avatar (JPG, PNG)</p>
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full font-bold transition-colors"
              >
                Change Picture
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-yt-gray uppercase tracking-widest">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-yt-gray uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={loading || (!avatarFile && formData.username === user.username && formData.email === user.email)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold transition-all"
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
