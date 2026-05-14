import { Search, Globe, ChevronDown, PlaySquare as Youtube, LogOut, Settings, Film, Clock, Star, Sun, Moon } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
      if (navRef.current && !navRef.current.contains(event.target)) setActiveDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setActiveDropdown(null);
  }, [location.pathname]);

  const ProfileLink = ({ icon: Icon, label, path, onClick, color }) => (
    <button 
      onClick={() => {
        if (onClick) onClick();
        if (path) navigate(path);
        setShowProfileMenu(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-2xl transition-colors text-sm font-medium ${color || 'text-slate-700'}`}
    >
      <Icon size={18} className={color ? '' : 'text-slate-400'} />
      {label}
    </button>
  );

  const navItems = [
    { label: 'Products', path: '/products', subItems: ['Video API', 'Live Streaming', 'CDN', 'Analytics'] },
    { label: 'Solutions', path: '/solutions', subItems: ['Education', 'Gaming', 'Enterprise', 'Media'] },
    { label: 'Developers', path: '/developers', subItems: ['Documentation', 'API Reference', 'SDKs', 'Community'] },
    { label: 'Demo', path: '/demo', subItems: null },
    { label: 'Pricing', path: '/pricing', subItems: null },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 lg:px-10 z-[100] bg-white border-b border-slate-200" ref={navRef}>
      
      {/* Left: Logo & Links */}
      <div className="flex items-center gap-10 h-full">
        <Link to="/" className="text-xl font-black tracking-tight text-[#0f172a] flex items-center gap-2">
          <div className="text-[#2B6BFF]">
            <Youtube size={28} fill="currentColor" />
          </div>
          <span>StreamHub</span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-6 h-full">
          {navItems.map((item) => (
            <div 
              key={item.label}
              className="relative h-full flex items-center"
              onMouseEnter={() => item.subItems && setActiveDropdown(item.label)}
              onMouseLeave={() => item.subItems && setActiveDropdown(null)}
            >
              <div 
                onClick={() => navigate(item.path)}
                className="flex items-center gap-1 cursor-pointer hover:text-[#2b6bff] transition-colors text-[14px] font-medium text-slate-700"
              >
                {item.label} 
                {item.subItems && <ChevronDown size={14} className={`text-slate-400 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />}
              </div>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                {activeDropdown === item.label && item.subItems && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-16 left-0 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden py-2"
                  >
                    {item.subItems.map(sub => (
                      <div 
                        key={sub}
                        onClick={() => navigate(`${item.path}?feature=${sub.toLowerCase().replace(/\s+/g, '-')}`)}
                        className="px-4 py-2 text-sm text-slate-600 hover:text-[#2b6bff] hover:bg-blue-50 cursor-pointer font-medium"
                      >
                        {sub}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <Link to="/company" className="text-[14px] font-medium text-slate-700 hover:text-[#2b6bff] transition-colors">
            Company
          </Link>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        
        {/* Language Toggle */}
        <div 
          className="relative hidden md:flex items-center h-full"
          onMouseEnter={() => setActiveDropdown('lang')}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="flex items-center gap-2 text-slate-700 cursor-pointer hover:text-[#2b6bff] text-[14px] font-medium py-4">
            <Globe size={18} className="text-slate-400" />
            EN
          </div>
          <AnimatePresence>
            {activeDropdown === 'lang' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-14 right-0 w-32 bg-white border border-slate-200 rounded-2xl shadow-xl py-2"
              >
                {['English (EN)', 'Español (ES)', 'Français (FR)'].map(lang => (
                  <div key={lang} className="px-4 py-2 text-sm text-slate-600 hover:text-[#2b6bff] hover:bg-blue-50 cursor-pointer font-medium">
                    {lang}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme} 
          className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <Moon size={18} className="text-slate-600" />
          ) : (
            <Sun size={18} className="text-yellow-500 fill-yellow-500" />
          )}
        </motion.button>

        <button onClick={() => navigate('/search')} className="text-slate-500 hover:text-[#2b6bff] transition-colors">
          <Search size={20} />
        </button>

        <Link to="/contact" className="hidden md:flex items-center justify-center px-5 py-2 rounded-full border border-[#2b6bff] text-[#2b6bff] font-medium text-[14px] hover:bg-blue-50 transition-colors">
          Talk to us
        </Link>
        
        {user ? (
          <div className="relative" ref={profileRef}>
             <motion.button 
               whileTap={{ scale: 0.9 }}
               onClick={() => setShowProfileMenu(!showProfileMenu)}
               className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-md text-white overflow-hidden ring-2 ring-white"
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
                    className="absolute right-0 mt-4 w-72 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden z-[200] p-2"
                 >
                    <div className="p-4 border-b border-slate-100 mb-2">
                       <p className="font-bold text-sm text-slate-800">{user.username}</p>
                       <p className="text-[11px] text-slate-500 mt-1">{user.email}</p>
                    </div>
                    
                    <ProfileLink icon={Film} label="Creator Studio" path="/my-content" />
                    <ProfileLink icon={Clock} label="Watch History" path="/history" />
                    <ProfileLink icon={Star} label="Premium Membership" path="/premium" color="text-[#2b6bff]" />
                    
                    <div className="h-px bg-slate-100 my-2 mx-4" />
                    
                    <ProfileLink icon={Settings} label="Settings" path="/settings" />
                    <ProfileLink icon={LogOut} label="Sign Out" onClick={logout} color="text-rose-500 hover:bg-rose-50" />
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        ) : (
          <Link to="/auth" className="bg-[#2b6bff] text-white px-6 py-2 rounded-full text-[14px] font-medium shadow-md hover:bg-blue-600 transition-all">
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
