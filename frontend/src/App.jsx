import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MyList from './pages/MyList';
import MyContent from './pages/MyContent';
import { MessageCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Auth from './pages/Auth';
import Upload from './pages/Upload';
import Search from './pages/Search';
import Subscriptions from './pages/Subscriptions';
import History from './pages/History';
import Settings from './pages/Settings';
import ComingSoon from './pages/ComingSoon';
import Premium from './pages/Premium';
import Products from './pages/Products';
import Solutions from './pages/Solutions';
import Developers from './pages/Developers';
import Demo from './pages/Demo';
import Pricing from './pages/Pricing';
import Company from './pages/Company';
import Contact from './pages/Contact';
import { AuthProvider } from './context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
          <Navbar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/search" element={<Search />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/history" element={<History />} />
              <Route path="/my-content" element={<MyContent />} />
              <Route path="/mylist" element={<MyList />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/products" element={<Products />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/developers" element={<Developers />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/company" element={<Company />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          
          <footer className="bg-slate-50 border-t border-slate-200 py-20 px-10">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-[#2b6bff]">StreamHub</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  The future of cloud-native streaming. Powering the next generation of entertainment across all devices.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Platform</h4>
                <ul className="space-y-4 text-yt-gray text-sm">
                  <li><Link to="/coming-soon" className="hover:text-white transition-colors">Platform Status</Link></li>
                  <li><Link to="/coming-soon" className="hover:text-white transition-colors">API Docs</Link></li>
                  <li><Link to="/coming-soon" className="hover:text-white transition-colors">Developer Portal</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Company</h4>
                <ul className="space-y-4 text-yt-gray text-sm">
                  <li><Link to="/coming-soon" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/coming-soon" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link to="/coming-soon" className="hover:text-white transition-colors">Security</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Connect</h4>
                <ul className="space-y-4 text-yt-gray text-sm">
                  <li><Link to="/coming-soon" className="hover:text-blue-600 transition-colors">Contact Sales</Link></li>
                  <li><Link to="/coming-soon" className="hover:text-blue-600 transition-colors">Support Center</Link></li>
                </ul>
              </div>
            </div>
            <div className="max-w-[1400px] mx-auto mt-20 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[12px] uppercase tracking-widest">
              <p>© 2026 StreamHub Systems. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">Twitter</a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">Github</a>
                <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">Discord</a>
              </div>
            </div>
          </footer>
          
          {/* Ask Me Floating Button */}
          <button 
            onClick={() => setChatOpen(!chatOpen)}
            className="fixed bottom-8 right-8 z-[100] bg-[#2b6bff] text-white px-5 py-3 rounded-full font-bold shadow-2xl shadow-blue-500/30 flex items-center gap-2 hover:-translate-y-1 hover:shadow-blue-500/40 transition-all"
          >
            <MessageCircle size={20} />
            Ask Me
          </button>

          {/* Ask Me Chat Modal */}
          <AnimatePresence>
            {chatOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-24 right-8 z-[100] w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
              >
                <div className="bg-[#2b6bff] text-white p-4 font-bold flex justify-between items-center">
                  <span>StreamHub AI Support</span>
                  <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white">&times;</button>
                </div>
                <div className="h-64 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-3">
                   <div className="bg-white border border-slate-200 text-slate-700 text-sm p-3 rounded-2xl rounded-tl-sm self-start shadow-sm">
                     Hi there! 👋 How can I help you with StreamHub today?
                   </div>
                </div>
                <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                  <input type="text" placeholder="Type a message..." className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 text-sm outline-none focus:border-[#2b6bff]" />
                  <button className="w-9 h-9 rounded-full bg-[#2b6bff] text-white flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
