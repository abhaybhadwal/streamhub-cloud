import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Auth from './pages/Auth';
import Upload from './pages/Upload';
import Search from './pages/Search';
import Subscriptions from './pages/Subscriptions';
import History from './pages/History';
import Settings from './pages/Settings';
import MyList from './pages/MyList';
import MyContent from './pages/MyContent';
import ComingSoon from './pages/ComingSoon';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-yt-black text-white selection:bg-yt-red selection:text-white">
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
            </Routes>
          </main>
          
          <footer className="bg-black/40 border-t border-white/5 py-20 px-10">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="space-y-6">
                <h2 className="text-2xl font-black">StreamHub</h2>
                <p className="text-yt-gray text-sm leading-relaxed">
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
                  <li><Link to="/coming-soon" className="hover:text-white transition-colors">Contact Sales</Link></li>
                  <li><Link to="/coming-soon" className="hover:text-white transition-colors">Support Center</Link></li>
                </ul>
              </div>
            </div>
            <div className="max-w-[1400px] mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-yt-gray text-[12px] uppercase tracking-widest">
              <p>© 2026 StreamHub Systems. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Twitter</a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Github</a>
                <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Discord</a>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
