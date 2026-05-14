import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="pt-32 px-6 min-h-[70vh] max-w-5xl mx-auto flex flex-col items-center text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 w-full max-w-xl">
        <h1 className="text-5xl font-black text-[#0f172a]">Talk to us</h1>
        <p className="text-slate-500 text-lg mx-auto mb-8">
          Have questions about our API or enterprise plans? Our engineering team is here to help.
        </p>
        <form className="space-y-4 text-left bg-white p-8 border border-slate-200 rounded-[2rem] shadow-lg">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Work Email</label>
            <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#2b6bff]" placeholder="name@company.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">How can we help?</label>
            <textarea rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#2b6bff]" placeholder="Tell us about your project..."></textarea>
          </div>
          <button className="w-full bg-[#2b6bff] text-white font-bold py-3.5 rounded-xl hover:bg-blue-600 transition-colors">Submit Request</button>
        </form>
      </motion.div>
    </div>
  );
};
export default Contact;
