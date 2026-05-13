import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';

const ComingSoon = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-32 px-10 flex flex-col items-center justify-center text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-2xl mb-4">
          <Construction size={40} className="text-blue-500" />
        </div>
        
        <h1 className="text-5xl font-black tracking-tight">Under Construction</h1>
        <p className="text-yt-gray text-lg max-w-md mx-auto leading-relaxed">
          We're working hard to bring you this page. Check back soon for updates!
        </p>
        
        <div className="pt-8">
          <Link 
            to="/" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-600/20"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
