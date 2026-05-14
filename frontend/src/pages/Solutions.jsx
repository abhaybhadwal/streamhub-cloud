import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Gamepad2, Building2, Film, ArrowRight } from 'lucide-react';

const Solutions = () => {
  const [searchParams] = useSearchParams();
  const feature = searchParams.get('feature');

  const displayTitle = feature 
    ? feature.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Solutions'
    : 'Industry Solutions';

  const solutionsData = [
    { icon: BookOpen, title: 'EdTech & E-Learning', desc: 'Interactive whiteboards, reliable screen sharing, and recording capabilities for virtual classrooms.' },
    { icon: Gamepad2, title: 'Gaming & Esports', desc: 'Sub-second latency streaming to keep audiences engaged during live tournaments and events.' },
    { icon: Building2, title: 'Enterprise Communications', desc: 'Secure, scalable video conferencing and town halls for globally distributed workforces.' },
    { icon: Film, title: 'Media & Entertainment', desc: 'Broadcast-quality 4K streaming pipelines with DRM and advanced monetization tools built-in.' }
  ];

  return (
    <div className="pt-32 px-6 min-h-[70vh] bg-slate-50 flex flex-col items-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto mb-20">
        <h1 className="text-5xl md:text-6xl font-black text-[#0f172a] mb-6">{displayTitle}</h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {feature 
            ? `Specialized cloud streaming architecture optimized perfectly for the ${displayTitle.replace(' Solutions', '')} industry. Deliver unmatched experiences to your users.`
            : `Tailored cloud streaming infrastructure designed to solve the hardest problems across Education, Entertainment, Gaming, and Enterprise.`}
        </p>
      </motion.div>

      {/* Solutions Grid */}
      <div className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
        {solutionsData.map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="flex flex-col md:flex-row gap-6 p-8 border border-slate-200 rounded-[2rem] bg-white shadow-sm hover:shadow-xl transition-all group"
          >
             <div className="w-16 h-16 flex-shrink-0 bg-blue-50 text-[#2b6bff] rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#2b6bff] group-hover:text-white transition-all">
               <item.icon size={28} />
             </div>
             <div>
               <h3 className="text-2xl font-bold mb-3 text-slate-800">{item.title}</h3>
               <p className="text-slate-500 text-sm leading-relaxed mb-4">{item.desc}</p>
               <button className="flex items-center gap-2 text-[#2b6bff] text-sm font-bold group-hover:gap-3 transition-all">
                  View Case Study <ArrowRight size={16} />
               </button>
             </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
export default Solutions;
