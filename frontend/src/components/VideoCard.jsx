import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const VideoCard = ({ video }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/watch/${video._id}`} className="flex flex-col gap-3 group">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-yt-hover shadow-xl">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 scale-75 group-hover:scale-100 transition-transform">
              <Play className="text-white fill-white ml-1" size={24} />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-widest border border-white/10">
            12:45
          </div>
        </div>
        
        <div className="flex gap-3 px-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] flex-shrink-0">
            <div className="w-full h-full rounded-full bg-yt-black flex items-center justify-center font-bold text-xs">
              {video.userId?.username?.[0].toUpperCase() || 'Y'}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-bold line-clamp-2 leading-snug text-[15px] group-hover:text-blue-400 transition-colors">
              {video.title}
            </h3>
            <div className="flex flex-col text-yt-gray text-[13px]">
              <span className="hover:text-white transition-colors cursor-pointer">{video.userId?.username}</span>
              <span>
                {video.views.toLocaleString()} views • {formatDistanceToNow(new Date(video.createdAt))} ago
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default VideoCard;
