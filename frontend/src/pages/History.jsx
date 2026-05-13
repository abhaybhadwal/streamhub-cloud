import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard';
import { History as HistoryIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/users/history', {
          headers: { 'x-auth-token': token }
        });
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
    window.scrollTo(0, 0);
  }, [user, navigate]);

  if (loading) return <div className="pt-32 px-10 text-center animate-pulse">Loading history...</div>;

  return (
    <div className="pt-24 px-10 pb-20">
      <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
          <HistoryIcon className="text-rose-500" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Watch History</h1>
          <p className="text-yt-gray text-sm">Videos you have watched recently</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="text-6xl mb-4">👀</div>
          <h2 className="text-2xl font-bold">Your watch history is empty</h2>
          <p className="text-yt-gray max-w-sm text-center">
            Watch a few videos to see them show up here!
          </p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
          >
            Explore Home
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {history.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
