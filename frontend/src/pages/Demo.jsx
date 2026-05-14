import { motion } from 'framer-motion';

const Demo = () => {
  return (
    <div className="pt-32 px-6 min-h-[70vh] max-w-5xl mx-auto flex flex-col items-center text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h1 className="text-5xl font-black text-[#0f172a]">Interactive Demo</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Experience the power of our real-time streaming engine. Launch a sandbox environment directly in your browser.
        </p>
      </motion.div>
    </div>
  );
};
export default Demo;
