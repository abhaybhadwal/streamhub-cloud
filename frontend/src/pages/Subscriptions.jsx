import { motion } from 'framer-motion';
import { PlaySquare } from 'lucide-react';

const Subscriptions = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-10 text-center gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10"
      >
        <PlaySquare size={48} className="text-yt-gray" />
      </motion.div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Don't miss a thing</h2>
        <p className="text-yt-gray max-w-sm">
          Subscribe to your favorite Hollywood and Bollywood channels to see their latest videos here.
        </p>
      </div>
      <button className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-yt-gray transition-all mt-4">
        Discover Channels
      </button>
    </div>
  );
};

export default Subscriptions;
