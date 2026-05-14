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
    <div className="min-h-[90vh] flex items-center justify-center p-6 bg-slate-50 pt-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[2rem] w-full max-w-md border border-slate-200 shadow-xl"
      >
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-[#2B6BFF] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Youtube className="text-white" size={36} fill="currentColor" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{isLogin ? 'Welcome Back' : 'Get Started'}</h1>
            <p className="text-slate-500 text-sm mt-1">Experience the best cloud video API</p>
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
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          
          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-rose-500 text-sm bg-rose-50 p-3 rounded-xl border border-rose-200 text-center"
            >
              {error}
            </motion.p>
          )}

          <button 
            disabled={loading}
            className="w-full bg-[#2B6BFF] text-white hover:bg-blue-600 font-bold py-4 rounded-2xl transition-all mt-4 flex items-center justify-center gap-2 group disabled:opacity-50 shadow-md"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="text-[#2B6BFF] ml-1">
              {isLogin ? 'Sign up for free' : 'Sign in here'}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
