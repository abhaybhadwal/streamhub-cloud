import { Home, Compass, PlaySquare, Clock, ThumbsUp, History } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
  <motion.div
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link
      to={path}
      className={`flex items-center gap-5 px-3 py-2.5 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-white/10 text-white font-bold backdrop-blur-md border border-white/5 shadow-lg' 
          : 'text-yt-gray hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      <span className="text-sm tracking-wide">{label}</span>
    </Link>
  </motion.div>
);

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-yt-black border-r border-white/5 p-4 flex flex-col gap-2 overflow-y-auto hidden md:flex">
      <div className="flex flex-col gap-1">
        <SidebarItem icon={Home} label="Home" path="/" active={location.pathname === '/'} />
        <SidebarItem icon={Compass} label="Shorts" path="/shorts" active={location.pathname === '/shorts'} />
        <SidebarItem icon={PlaySquare} label="Subscriptions" path="/subscriptions" active={location.pathname === '/subscriptions'} />
      </div>
      
      <div className="h-px bg-white/5 my-4" />
      
      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-bold text-yt-gray px-3 mb-2 uppercase tracking-widest">Library</h3>
        <SidebarItem icon={History} label="History" path="/history" active={location.pathname === '/history'} />
        <SidebarItem icon={Clock} label="My List" path="/mylist" active={location.pathname === '/mylist'} />
        <SidebarItem icon={ThumbsUp} label="Liked videos" path="/playlist/ll" active={location.pathname === '/playlist/ll'} />
      </div>

      <div className="mt-auto p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-white/5">
        <p className="text-[10px] text-yt-gray leading-relaxed">
          Sign in to like videos, comment, and subscribe.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
