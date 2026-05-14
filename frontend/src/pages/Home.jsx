import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Play, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-white min-h-screen pt-16">
      
      {/* Top Promotional Banner */}
      <div className="w-full bg-[#E5F0FF] py-3 px-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-[#dbeafe] transition-colors group">
        <div className="bg-[#1e293b] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center">
          AI
        </div>
        <p className="text-sm text-[#0f172a] font-medium">
          Conversational AI: Build conversational AI in minutes. Ultra-low latency, human-like, and cross-platform support!
        </p>
        <ArrowRight size={16} className="text-[#0f172a] group-hover:translate-x-1 transition-transform" />
      </div>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-4 pt-20 pb-32 max-w-5xl mx-auto relative z-10">
        
        {/* Eyebrow text */}
        <p className="text-[13px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-6">
          THE ESSENTIAL CLOUD STREAMING API
        </p>
        
        {/* Main Headline */}
        <h1 className="text-5xl md:text-[64px] font-bold text-[#0f172a] leading-[1.1] tracking-tight mb-4">
          Best <span className="text-[#2B6BFF]">Cloud Video SDK & API</span><br />
          All features, instant access, unlimited bandwidth
        </h1>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <button 
            onClick={() => navigate('/auth')}
            className="bg-[#2B6BFF] hover:bg-blue-600 text-white font-medium px-8 py-3.5 rounded-full shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 text-[15px]"
          >
            Get started for free
          </button>
          
          <button 
            onClick={() => navigate('/search')}
            className="border border-[#2B6BFF] text-[#2B6BFF] hover:bg-blue-50 font-medium px-8 py-3.5 rounded-full transition-all text-[15px]"
          >
            Try demo
          </button>

          <button 
            className="border border-[#2B6BFF] text-[#2B6BFF] hover:bg-blue-50 font-medium px-8 py-3.5 rounded-full transition-all text-[15px]"
          >
            Documentation
          </button>
        </div>
      </section>

      {/* Illustration Area */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 pb-32 flex justify-center mt-[-40px]">
        
        {/* Decorative Floating Elements */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute left-[10%] top-[20%] text-purple-500 blur-[1px]"
        >
          <Sparkles size={64} className="fill-purple-500 opacity-60" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
          className="absolute right-[15%] top-[10%] text-blue-400 blur-[1px]"
        >
          <Sparkles size={48} className="fill-blue-400 opacity-60" />
        </motion.div>

        {/* Mockups Container */}
        <div className="relative w-full max-w-[900px] aspect-[16/9] flex items-end justify-center">
          
          {/* Main Desktop Mockup */}
          <div className="w-[80%] h-[90%] bg-white rounded-t-3xl border-t border-x border-slate-200 shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.1)] relative z-10 flex flex-col overflow-hidden">
            {/* Browser Header */}
            <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="mx-auto w-1/2 h-5 bg-white rounded border border-slate-200"></div>
            </div>
            {/* Mock Chat / Video Interface */}
            <div className="flex-1 flex p-4 gap-4 bg-slate-50/50">
              {/* Sidebar */}
              <div className="w-1/4 space-y-3">
                <div className="h-10 bg-white rounded-lg border border-slate-100 flex items-center px-3 gap-3">
                   <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xs"><Play size={12} fill="currentColor"/></div>
                   <div className="h-3 w-16 bg-slate-200 rounded"></div>
                </div>
                <div className="h-10 bg-white rounded-lg border border-slate-100 flex items-center px-3 gap-3">
                   <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center text-xs"><MessageSquare size={12} fill="currentColor"/></div>
                   <div className="h-3 w-20 bg-slate-200 rounded"></div>
                </div>
              </div>
              {/* Main Feed */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="w-full h-40 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800" className="w-full h-full object-cover opacity-80" alt="Meeting" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 flex gap-2">
                     <div className="w-6 h-6 rounded bg-white/20 backdrop-blur border border-white/30"></div>
                     <div className="w-6 h-6 rounded bg-white/20 backdrop-blur border border-white/30"></div>
                  </div>
                </div>
                {/* Chat bubbles */}
                <div className="flex flex-col gap-3 px-2">
                   <div className="self-end bg-blue-500 text-white text-[10px] px-3 py-2 rounded-l-xl rounded-tr-xl max-w-[80%] shadow-sm">
                     Who was that photographer you shared with me recently?
                   </div>
                   <div className="self-start bg-white border border-slate-200 text-slate-700 text-[10px] px-3 py-2 rounded-r-xl rounded-tl-xl max-w-[80%] shadow-sm">
                     That's him! What was his vision statement?
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Mockup Overlay */}
          <div className="absolute left-4 bottom-0 w-[240px] h-[400px] bg-white rounded-[2rem] border-[6px] border-slate-800 shadow-2xl z-20 flex flex-col overflow-hidden">
             {/* Notch */}
             <div className="h-6 bg-white w-full flex justify-center">
               <div className="w-20 h-4 bg-slate-800 rounded-b-xl"></div>
             </div>
             {/* Chat Interface */}
             <div className="flex-1 bg-slate-50 p-3 flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xs"><Play size={14} fill="currentColor"/></div>
                  <div>
                    <div className="w-16 h-2 bg-slate-300 rounded mb-1"></div>
                    <div className="w-10 h-1.5 bg-slate-200 rounded"></div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2 mt-auto pb-4 justify-end">
                   <div className="self-end bg-blue-500 text-white text-[9px] px-2.5 py-1.5 rounded-l-lg rounded-tr-lg max-w-[85%]">
                     Hello, morning Jess! I ask how long it will take for the takeout I ordered to arrive 🤔
                   </div>
                   <div className="self-start bg-white border border-slate-200 text-slate-700 text-[9px] px-2.5 py-1.5 rounded-r-lg rounded-tl-lg max-w-[85%]">
                     It will probably take about five minutes. 😊
                   </div>
                </div>
             </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
