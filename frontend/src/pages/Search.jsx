import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:5000/api/videos/search/find?q=${query}`);
        setVideos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (query) {
      fetchResults();
      window.scrollTo(0, 0);
    }
  }, [query]);

  return (
    <div className="pt-24 px-10 pb-20">
      <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
          <SearchIcon className="text-blue-500" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Search Results</h1>
          <p className="text-yt-gray text-sm">Showing results for "{query}"</p>
        </div>
      </div>

      {loading ? (
        <div className="text-yt-gray animate-pulse">Searching the library...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}

      {!loading && videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
           <div className="text-6xl mb-4">🔍</div>
           <h2 className="text-2xl font-bold">No results found</h2>
           <p className="text-yt-gray">Try searching for something else like "Hollywood" or "Action".</p>
        </div>
      )}
    </div>
  );
};

export default Search;
