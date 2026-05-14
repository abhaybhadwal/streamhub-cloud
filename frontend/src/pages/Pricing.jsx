import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, HelpCircle, AlertCircle, CreditCard, Calendar, Lock, User, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showMockGateway, setShowMockGateway] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  // Mock Form States
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  // Formats card: "424242..." -> "4242 4242 4242..." (16 digits max)
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').substring(0, 16);
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(' ') : '';
  };

  // Formats expiry: "1224" -> "12/24" (4 digits max)
  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').substring(0, 4);
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
    return digits;
  };

  // Formats CVC: restrict to 4 digits only
  const formatCvc = (value) => {
    return value.replace(/\D/g, '').substring(0, 4);
  };

  const handleAction = async (planName) => {
    if (planName === 'Developer') {
      navigate('/auth');
      return;
    }
    
    if (planName === 'Enterprise') {
      navigate('/contact');
      return;
    }

    if (planName === 'Pro') {
      if (!user) {
        navigate('/auth?redirect=/pricing');
        return;
      }
      setShowMockGateway(true);
    }
  };

  const handleMockSubmit = async (e) => {
    e.preventDefault();
    if (!cardNum || !expiry || !cvc || !name) {
      setError('Please fill out all payment details.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call simulated backend to update isPremium status in DB
      const response = await fetch('http://localhost:5000/api/payment/mock-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Update real user context state immediately!
        updateUser({ isPremium: true });
        
        // Simulate beautiful payment processing animation
        setTimeout(() => {
          setLoading(false);
          setPaymentSuccess(true);
        }, 2000);
      } else {
        setError(data.message || 'Failed to process mock subscription.');
        setLoading(false);
      }
    } catch (err) {
      setError('Network error connecting to local backend server.');
      setLoading(false);
    }
  };

  const plans = [
    {
      name: "Developer",
      desc: "Perfect for testing and prototyping your ideas.",
      monthlyPrice: 0,
      annualPrice: 0,
      btnText: "Start for free",
      btnClass: "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50",
      features: [
        { name: "10,000 streaming minutes/mo", included: true },
        { name: "Standard 1080p resolution", included: true },
        { name: "Community support", included: true },
        { name: "Custom branding", included: false },
        { name: "Advanced analytics", included: false },
      ]
    },
    {
      name: "Pro",
      desc: "For production applications needing high availability.",
      monthlyPrice: 99,
      annualPrice: 79,
      badge: "MOST POPULAR",
      btnText: user?.isPremium ? "Current Plan" : "Start 14-day trial",
      btnClass: user?.isPremium 
        ? "bg-green-50 text-green-600 border border-green-200 cursor-not-allowed" 
        : "bg-[#2b6bff] text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 border border-transparent",
      highlight: true,
      features: [
        { name: "100,000 streaming minutes/mo", included: true },
        { name: "Ultra-low latency 4K streaming", included: true },
        { name: "Priority email support", included: true },
        { name: "Custom branding & CNAMEs", included: true },
        { name: "Advanced real-time analytics", included: true },
      ]
    },
    {
      name: "Enterprise",
      desc: "Custom infrastructure for massive global scale.",
      priceLabel: "Custom",
      btnText: "Contact Sales",
      btnClass: "bg-slate-900 text-white hover:bg-slate-800 border border-transparent",
      features: [
        { name: "Unlimited streaming minutes", included: true },
        { name: "Dedicated account manager", included: true },
        { name: "24/7 phone & Slack support", included: true },
        { name: "Custom SLA (99.999% uptime)", included: true },
        { name: "On-premise deployment options", included: true },
      ]
    }
  ];

  const faqs = [
    { q: "Can I change my plan later?", a: "Yes, you can upgrade or downgrade your plan at any time from your billing dashboard. Prorated charges will be applied automatically." },
    { q: "What happens if I exceed my minutes?", a: "On the Developer plan, streaming will be paused. On the Pro plan, you will be billed $0.002 per additional minute." },
    { q: "Do you offer a discount for open-source projects?", a: "Yes! We love the open-source community. Contact us with your repository link to get a free Pro license." },
    { q: "Is there a long-term contract?", a: "No, all standard plans are month-to-month or year-to-year. You can cancel your subscription at any time." },
  ];

  return (
    <div className="pt-24 pb-32 px-6 min-h-screen bg-slate-50 flex flex-col items-center relative">
      
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl font-black text-[#0f172a] mb-6 tracking-tight">Pricing that scales with you</h1>
        <p className="text-slate-500 text-lg md:text-xl">
          Start building for free. No credit card required. Upgrade when you need massive global distribution.
        </p>

        {/* Toggle Switch */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <span className={`text-sm font-bold ${!isAnnual ? 'text-[#0f172a]' : 'text-slate-400'}`}>Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-16 h-8 rounded-full bg-[#2b6bff] flex items-center px-1 transition-all"
          >
            <div className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm font-bold flex items-center gap-2 ${isAnnual ? 'text-[#0f172a]' : 'text-slate-400'}`}>
            Annually <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Save 20%</span>
          </span>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 relative z-10">
        {plans.map((plan, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={plan.name} 
            className={`relative rounded-[2rem] p-8 md:p-10 flex flex-col ${
              plan.highlight 
                ? 'bg-white border-2 border-[#2b6bff] shadow-[0_20px_50px_-15px_rgba(43,107,255,0.2)] md:-translate-y-4' 
                : 'bg-white border border-slate-200 shadow-sm'
            }`}
          >
            {plan.badge && (
              <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2">
                <span className="bg-[#2b6bff] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                  {plan.badge}
                </span>
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-sm text-slate-500 min-h-[40px]">{plan.desc}</p>
            </div>

            <div className="mb-8">
              {plan.priceLabel ? (
                <div className="text-5xl font-black text-slate-900">{plan.priceLabel}</div>
              ) : (
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-slate-400 -mb-1">$</span>
                  <span className="text-6xl font-black text-slate-900 tracking-tighter">
                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-slate-500 font-medium mb-1">/mo</span>
                </div>
              )}
            </div>

            <button 
              onClick={() => handleAction(plan.name)}
              disabled={plan.name === 'Pro' && user?.isPremium}
              className={`w-full py-4 rounded-xl font-bold transition-all mb-10 flex justify-center items-center ${plan.btnClass}`}
            >
              {plan.btnText}
            </button>

            <div className="space-y-4 mt-auto">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">What's included</p>
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  {feature.included ? (
                    <div className="w-5 h-5 rounded-full bg-blue-50 text-[#2b6bff] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X size={12} strokeWidth={3} />
                    </div>
                  )}
                  <span className={`text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQs */}
      <div className="w-full max-w-3xl border-t border-slate-200 pt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-500">Have questions? We're here to help.</p>
        </div>
        
        <div className="space-y-8">
          {faqs.map((faq, i) => (
            <div key={i} className="flex gap-4">
              <HelpCircle className="text-slate-300 flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MOCK PAYMENT GATEWAY MODAL */}
      <AnimatePresence>
        {showMockGateway && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }} 
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
            >
              {!paymentSuccess ? (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Secure Payment</h3>
                      <p className="text-slate-500 text-sm">Activate StreamHub Pro Plan</p>
                    </div>
                    <button 
                      onClick={() => { setShowMockGateway(false); setError(null); }}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-4 mb-6 flex items-center justify-between border border-blue-100">
                     <span className="text-slate-700 text-sm font-medium">Pro Edition ({isAnnual ? 'Annual' : 'Monthly'})</span>
                     <span className="text-slate-900 font-black text-lg">${isAnnual ? 79 : 99}/mo</span>
                  </div>

                  {error && (
                    <div className="bg-rose-50 text-rose-600 p-3 rounded-xl border border-rose-100 text-sm flex items-center gap-2 mb-6">
                       <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <form onSubmit={handleMockSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Cardholder Name</label>
                      <div className="relative">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                         <input 
                           type="text" 
                           placeholder="Jane Doe" 
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           className="w-full bg-slate-50 border border-slate-200 focus:border-[#2b6bff] rounded-xl py-3.5 pl-11 pr-4 outline-none text-sm font-medium text-slate-800 transition-all"
                         />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Card Number</label>
                      <div className="relative">
                         <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                         <input 
                           type="text" 
                           placeholder="4242 4242 4242 4242" 
                           value={cardNum}
                           onChange={(e) => setCardNum(formatCardNumber(e.target.value))}
                           maxLength={19}
                           className="w-full bg-slate-50 border border-slate-200 focus:border-[#2b6bff] rounded-xl py-3.5 pl-11 pr-4 outline-none text-sm font-medium text-slate-800 transition-all font-mono"
                         />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Expiration</label>
                         <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                              type="text" 
                              placeholder="MM / YY" 
                              value={expiry}
                              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                              maxLength={5}
                              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2b6bff] rounded-xl py-3.5 pl-11 pr-4 outline-none text-sm font-medium text-slate-800 transition-all"
                            />
                         </div>
                       </div>
                       <div>
                         <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">CVC</label>
                         <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                              type="password" 
                              placeholder="•••" 
                              value={cvc}
                              onChange={(e) => setCvc(formatCvc(e.target.value))}
                              maxLength={4}
                              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2b6bff] rounded-xl py-3.5 pl-11 pr-4 outline-none text-sm font-medium text-slate-800 transition-all"
                            />
                         </div>
                       </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-[#2b6bff] text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-600 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 transition-all mt-4 flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        `Pay $${isAnnual ? 79 : 99}.00 Now`
                      )}
                    </button>
                    <p className="text-center text-[11px] text-slate-400 mt-2">
                      🔒 256-bit bank level encryption active
                    </p>
                  </form>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 flex flex-col items-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/10"
                  >
                     <CheckCircle2 size={44} />
                  </motion.div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">Success!</h3>
                  <p className="text-slate-500 text-sm mb-8 max-w-xs leading-relaxed">
                     Thank you! Your subscription is now active. You have been successfully upgraded to the **StreamHub Pro** plan.
                  </p>
                  <button 
                    onClick={() => { setShowMockGateway(false); setPaymentSuccess(false); navigate('/'); }}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-md hover:bg-slate-800 transition-colors"
                  >
                    Continue to Platform
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Pricing;
