import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PlaySquare as Youtube, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.username, formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-yt-black to-yt-black">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/[0.03] backdrop-blur-2xl p-10 rounded-[2.5rem] w-full max-w-md border border-white/10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)]"
      >
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-yt-red to-rose-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yt-red/20">
            <Youtube className="text-white" size={36} fill="currentColor" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">{isLogin ? 'Welcome Back' : 'Get Started'}</h1>
            <p className="text-yt-gray text-sm mt-1">Experience the future of streaming</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-yt-gray" size={20} />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-yt-gray" size={20} />
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-yt-gray" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          
          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-rose-400 text-sm bg-rose-400/10 p-3 rounded-xl border border-rose-400/20 text-center"
            >
              {error}
            </motion.p>
          )}

          <button 
            disabled={loading}
            className="w-full bg-white text-yt-black hover:bg-yt-gray font-bold py-4 rounded-2xl transition-all mt-4 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-yt-gray hover:text-white text-sm font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="text-blue-400 ml-1">
              {isLogin ? 'Sign up for free' : 'Sign in here'}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
