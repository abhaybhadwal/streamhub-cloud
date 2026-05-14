import { motion } from 'framer-motion';

const Company = () => {
  return (
    <div className="pt-32 px-6 min-h-[70vh] max-w-5xl mx-auto flex flex-col items-center text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h1 className="text-5xl font-black text-[#0f172a]">About StreamHub</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          We are on a mission to democratize enterprise-grade video streaming. Founded by industry veterans to solve the hard problems of global latency.
        </p>
      </motion.div>
    </div>
  );
};
export default Company;
