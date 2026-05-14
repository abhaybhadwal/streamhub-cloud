import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Video, Cloud, Zap, Shield, BarChart, Settings, ArrowRight } from 'lucide-react';

const Products = () => {
  const [searchParams] = useSearchParams();
  const feature = searchParams.get('feature');

  // Format feature string (e.g., "video-api" -> "Video Api")
  const displayTitle = feature 
    ? feature.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Our Products';

  const productData = [
    { icon: Video, title: 'Real-Time Video API', desc: 'Embed ultra-low latency interactive video into your applications with a few lines of code.' },
    { icon: Cloud, title: 'Global Edge CDN', desc: 'Deliver seamless 4K streaming to millions globally using our distributed edge network.' },
    { icon: Zap, title: 'Instant Encoding', desc: 'Automatically transcode and optimize uploaded media formats on the fly.' },
    { icon: Shield, title: 'Enterprise Security', desc: 'End-to-end encryption, DRM protection, and granular access controls built-in.' },
    { icon: BarChart, title: 'Advanced Analytics', desc: 'Real-time telemetry and audience insights to monitor QoS and engagement.' },
    { icon: Settings, title: 'Custom Workflows', desc: 'Build flexible media pipelines using our composable microservices architecture.' },
  ];

  return (
    <div className="pt-32 px-6 min-h-[70vh] bg-slate-50 flex flex-col items-center">
      
      {/* Hero Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto mb-20">
        <h1 className="text-5xl md:text-6xl font-black text-[#0f172a] mb-6">{displayTitle}</h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {feature 
            ? `Deep dive into the robust capabilities of our enterprise ${displayTitle} infrastructure. Designed for developers, built for global scale.`
            : `Explore our suite of cloud video APIs, live streaming SDKs, and global CDN infrastructure designed for infinite scale.`}
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {productData.map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="p-8 border border-slate-200 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all group"
          >
             <div className="w-14 h-14 bg-blue-50 text-[#2b6bff] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#2b6bff] group-hover:text-white transition-all">
               <item.icon size={24} />
             </div>
             <h3 className="text-xl font-bold mb-3 text-slate-800">{item.title}</h3>
             <p className="text-slate-500 text-sm leading-relaxed mb-6">{item.desc}</p>
             <button className="flex items-center gap-2 text-[#2b6bff] text-sm font-bold group-hover:gap-3 transition-all">
                Learn more <ArrowRight size={16} />
             </button>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-[1200px] bg-[#0f172a] rounded-[2.5rem] p-12 md:p-20 text-center flex flex-col items-center mb-20 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
         <h2 className="text-4xl font-black text-white mb-6 relative z-10">Ready to build?</h2>
         <p className="text-slate-300 max-w-xl mx-auto mb-8 relative z-10">Get 10,000 free minutes of HD streaming every month. No credit card required.</p>
         <button className="bg-[#2b6bff] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-blue-600 transition-colors relative z-10">
           Start Building for Free
         </button>
      </div>

    </div>
  );
};
export default Products;
