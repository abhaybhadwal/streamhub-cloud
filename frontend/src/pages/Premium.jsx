import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, Play } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Premium = () => {
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('http://localhost:5000/api/users/upgrade', {}, {
        headers: { 'x-auth-token': token }
      });
      updateUser({ isPremium: true });
      setTimeout(() => {
        navigate('/'); // Redirect to home or wherever
      }, 1500);
    } catch (err) {
      console.error('Upgrade failed', err);
      setLoading(false);
    }
  };

  if (user?.isPremium) {
    return (
      <div className="pt-32 px-10 min-h-[80vh] flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-yellow-500/20"
        >
          <Star size={40} className="text-white fill-white" />
        </motion.div>
        <h1 className="text-4xl font-black mb-4">You are a Premium Member!</h1>
        <p className="text-yt-gray text-lg max-w-md mx-auto mb-8">Enjoy unlimited, ad-free streaming of all blockbuster content in native 4K.</p>
        <button onClick={() => navigate('/')} className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">Start Watching</button>
      </div>
    );
  }

  return (
    <div className="pt-28 px-6 pb-20 max-w-[1200px] mx-auto min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 pb-2">
            StreamHub Premium
          </h1>
          <p className="text-xl text-yt-gray mt-4 font-medium">
            Unlock the ultimate cinematic experience. No limits. No ads. Pure entertainment.
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {/* Features */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8 flex flex-col justify-center"
        >
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
              <Play size={24} className="fill-amber-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Unlimited Access</h3>
              <p className="text-yt-gray text-sm">Watch every single video on the platform without restrictions or paywalls.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500 flex-shrink-0">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Ad-Free Experience</h3>
              <p className="text-yt-gray text-sm">Zero interruptions. Immerse yourself completely in the story.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-500 flex-shrink-0">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Premium Support</h3>
              <p className="text-yt-gray text-sm">Get priority access to our 24/7 concierge support team.</p>
            </div>
          </div>
        </motion.div>

        {/* Pricing Card */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-b from-[#1c2238] to-[#121629] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <div className="bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-6">
              Most Popular
            </div>
            <h2 className="text-3xl font-black mb-2">Pro Plan</h2>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-black">$9.99</span>
              <span className="text-yt-gray font-medium">/month</span>
            </div>

            <ul className="space-y-4 mb-10">
              {['Access to all blockbuster movies', '4K Ultra HD & HDR streaming', 'Download for offline viewing', 'Cancel anytime'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                  <Check size={18} className="text-amber-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-white font-bold py-4 rounded-full text-lg shadow-lg shadow-orange-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <Star fill="currentColor" size={20} />
                  Subscribe Now
                </>
              )}
            </button>
            <p className="text-center text-xs text-yt-gray mt-4">Secure, 1-click mock payment for demo purposes.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Premium;
