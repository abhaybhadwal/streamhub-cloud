import { Search, Video, Bell, User, Menu, PlaySquare as Youtube, LogOut, Settings, HelpCircle, Shield, Film, Clock, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, icon: '🔥', color: 'rose-500', title: 'Interactive Features Live!', desc: 'You can now Like, Dislike, and Comment on any cinematic masterpiece.' },
    { id: 2, icon: '🔗', color: 'blue-500', title: 'YouTube Integration', desc: 'Paste YouTube links directly on the Upload page for instant publishing without storage limits.' },
    { id: 3, icon: '🍿', color: 'purple-500', title: 'New Content Dropped', desc: 'Added 10+ new blockbuster trailers across Action, Horror, and Indian Cinema.' },
    { id: 4, icon: '⚡', color: 'green-500', title: 'Performance Boost', desc: 'Videos now seamlessly autoplay, and searching is lightning fast with auto-scroll.' }
  ]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const bellRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
      if (bellRef.current && !bellRef.current.contains(event.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${searchQuery}`);
  };

  const ProfileLink = ({ icon: Icon, label, path, onClick, color }) => (
    <button 
      onClick={() => {
        if (onClick) onClick();
        if (path) navigate(path);
        setShowProfileMenu(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-2xl transition-colors text-sm font-medium ${color || ''}`}
    >
      <Icon size={18} className={color ? '' : 'text-yt-gray'} />
      {label}
    </button>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-10 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-12">
        <Link to="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
          <div className="bg-yt-red p-1 rounded-lg">
            <Youtube className="text-white" size={24} fill="currentColor" />
          </div>
          <span>StreamHub <span className="font-light text-yt-gray">Cloud</span></span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-yt-gray uppercase tracking-widest">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/subscriptions" className="hover:text-white transition-colors">Subscriptions</Link>
          <Link to="/search?q=movie" className="hover:text-white transition-colors">Movies</Link>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex-1 max-w-[580px] flex items-center mx-12 group">
        <div className="flex flex-1 items-center bg-white/5 border border-white/10 rounded-full px-5 py-2.5 group-focus-within:border-blue-500/50 group-focus-within:bg-white/10 transition-all">
          <Search size={18} className="text-yt-gray mr-3 group-focus-within:text-blue-400" />
          <input
            type="text"
            placeholder="Search titles..."
            className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-yt-gray"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      <div className="flex items-center gap-6">
        <Link to="/upload" className="p-2.5 hover:bg-white/10 rounded-full transition-colors text-yt-gray hover:text-white">
          <Video size={22} />
        </Link>

        <div className="relative" ref={bellRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 hover:bg-white/10 rounded-full transition-colors text-yt-gray hover:text-white relative"
          >
            <Bell size={22} />
            {notifications.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-black" />
            )}
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-4 w-80 bg-[#161b2e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-[200]"
              >
                <div className="p-5 border-b border-white/5 flex justify-between items-center">
                  <h4 className="font-bold">Notifications</h4>
                  {notifications.length > 0 && (
                    <button 
                      onClick={() => setNotifications([])}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className="flex gap-4 p-2 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer">
                        <div className={`w-10 h-10 bg-${n.color}/20 rounded-xl flex items-center justify-center text-${n.color} flex-shrink-0`}>{n.icon}</div>
                        <div>
                          <p className="text-xs font-bold">{n.title}</p>
                          <p className="text-[11px] text-yt-gray mt-1">{n.desc}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-yt-gray py-4 text-sm">
                      No new notifications
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {user ? (
          <div className="relative" ref={profileRef}>
             <motion.button 
               whileTap={{ scale: 0.9 }}
               onClick={() => setShowProfileMenu(!showProfileMenu)}
               className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-lg border border-white/20 overflow-hidden"
             >
               {user.avatar ? (
                 <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 user.username[0].toUpperCase()
               )}
             </motion.button>

             <AnimatePresence>
               {showProfileMenu && (
                 <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-72 bg-[#161b2e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-[200] p-2"
                 >
                    <div className="p-4 border-b border-white/5 mb-2">
                       <p className="font-bold text-sm">{user.username}</p>
                       <p className="text-[10px] text-yt-gray uppercase tracking-widest mt-1">{user.email}</p>
                    </div>
                    
                    <ProfileLink icon={Film} label="Creator Studio" path="/my-content" />
                    <ProfileLink icon={Clock} label="Watch History" path="/history" />
                    <ProfileLink icon={Star} label="My List" path="/mylist" />
                    <ProfileLink icon={Star} label="Premium Membership" path="/premium" />
                    
                    <div className="h-px bg-white/5 my-2 mx-4" />
                    
                    <ProfileLink icon={Settings} label="Settings" path="/settings" />
                    <ProfileLink icon={HelpCircle} label="Help Center" />
                    <ProfileLink icon={LogOut} label="Sign Out" onClick={logout} color="text-rose-400 hover:bg-rose-500/10" />
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        ) : (
          <Link to="/auth" className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-yt-gray transition-all">
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
