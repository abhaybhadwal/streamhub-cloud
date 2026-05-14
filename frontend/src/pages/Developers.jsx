import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Terminal, Code2, Smartphone, MonitorSmartphone, ArrowRight } from 'lucide-react';

const Developers = () => {
  const [searchParams] = useSearchParams();
  const feature = searchParams.get('feature');

  const displayTitle = feature 
    ? feature.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Developer Documentation';

  const sdks = [
    { icon: Code2, title: 'Web SDK', desc: 'React, Vue, and Vanilla JS packages available via npm.', color: 'text-blue-500' },
    { icon: Smartphone, title: 'iOS SDK', desc: 'Swift packages with native UI components and camera handling.', color: 'text-slate-800' },
    { icon: MonitorSmartphone, title: 'Android SDK', desc: 'Kotlin SDK optimized for low-end hardware and battery.', color: 'text-green-500' },
    { icon: Terminal, title: 'Server API', desc: 'Node.js, Python, and Go SDKs for backend management.', color: 'text-purple-500' }
  ];

  return (
    <div className="pt-32 px-6 min-h-[70vh] bg-slate-50 flex flex-col items-center">
      
      {/* Hero Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-5xl md:text-6xl font-black text-[#0f172a] mb-6">{displayTitle}</h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {feature 
            ? `Read the complete technical specification and developer guides for integrating ${displayTitle}.`
            : `Integrate our APIs into your application in minutes. Comprehensive SDKs available for React, iOS, Android, and Server.`}
        </p>
      </motion.div>

      {/* Code Snippet Preview */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-[900px] bg-[#1e293b] rounded-2xl overflow-hidden shadow-2xl mb-20 border border-slate-700"
      >
        <div className="h-10 border-b border-slate-700/50 flex items-center px-4 gap-2 bg-[#0f172a]/50">
           <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
           <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
           <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
           <span className="ml-4 text-xs font-mono text-slate-400">Initialize StreamHub</span>
        </div>
        <div className="p-6 overflow-x-auto text-sm font-mono leading-relaxed">
          <pre className="text-slate-300">
            <span className="text-purple-400">import</span> {'{'} StreamHubClient {'}'} <span className="text-purple-400">from</span> <span className="text-green-300">'@streamhub/client'</span>;{'\n\n'}
            <span className="text-slate-500">// Initialize the client with your API key</span>{'\n'}
            <span className="text-purple-400">const</span> client = <span className="text-purple-400">new</span> <span className="text-yellow-300">StreamHubClient</span>({'{'}{'\n'}
            {'  '}apiKey: <span className="text-green-300">'pk_live_your_api_key_here'</span>,{'\n'}
            {'  '}region: <span className="text-green-300">'global'</span>{'\n'}
            {'}'});{'\n\n'}
            <span className="text-slate-500">// Create a new video session</span>{'\n'}
            <span className="text-purple-400">const</span> session = <span className="text-purple-400">await</span> client.video.<span className="text-blue-300">createSession</span>({'{'}{'\n'}
            {'  '}participantLimit: <span className="text-orange-300">100</span>,{'\n'}
            {'  '}record: <span className="text-orange-300">true</span>{'\n'}
            {'}'});{'\n\n'}
            <span className="text-blue-300">console</span>.<span className="text-yellow-300">log</span>(<span className="text-green-300">\`Session created: \${session.id}\`</span>);
          </pre>
        </div>
      </motion.div>

      {/* SDKs Grid */}
      <div className="max-w-[1200px] w-full mb-20">
        <h2 className="text-2xl font-bold text-center mb-10 text-slate-800">Official SDKs & Libraries</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sdks.map((sdk, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
               <sdk.icon size={32} className={`${sdk.color} mb-4 group-hover:scale-110 transition-transform`} />
               <h3 className="font-bold text-lg mb-2 text-slate-800 flex justify-between items-center">
                 {sdk.title} <ArrowRight size={16} className="text-slate-400 group-hover:text-[#2b6bff] transition-colors" />
               </h3>
               <p className="text-sm text-slate-500">{sdk.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
export default Developers;
