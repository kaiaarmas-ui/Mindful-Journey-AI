
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageSquare, Mail, HelpCircle, Send, CheckCircle2, LifeBuoy } from 'lucide-react';

interface SupportViewProps {
  onBack: () => void;
}

const SupportView: React.FC<SupportViewProps> = ({ onBack }) => {
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      onBack();
    }, 2500);
  };

  return (
    <div className="h-full bg-[#0f172a] text-slate-300 flex flex-col overflow-hidden">
      <div className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2.5 hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-white border border-slate-800/50"
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <LifeBuoy size={18} className="text-indigo-400" />
          Support Sanctuary
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-3xl mx-auto py-8 space-y-12 pb-40">
          <header className="space-y-4">
            <h1 className="text-3xl font-bold text-white">How can we guide you today?</h1>
            <p className="text-slate-500">Our team is here to help you harmonize your mindful experience.</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[32px] space-y-4">
              <Mail size={24} className="text-indigo-400" />
              <h3 className="font-bold text-white">Direct Assistance</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Reach out directly for account issues or technical guidance.</p>
              <a href="mailto:mindfuljourneyai@gmail.com" className="text-indigo-400 text-sm font-bold hover:underline">mindfuljourneyai@gmail.com</a>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[32px] space-y-4">
              <HelpCircle size={24} className="text-emerald-400" />
              <h3 className="font-bold text-white">Knowledge Base</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Explore our library of common questions and practice guides.</p>
              <button className="text-emerald-400 text-sm font-bold hover:underline text-left">Browse Articles</button>
            </div>
          </section>

          <section className="bg-slate-900/60 border border-slate-800 rounded-[40px] p-10 md:p-12 shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-6">
                  <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
                  <h2 className="text-2xl font-bold text-white">Message Synthesized</h2>
                  <p className="text-slate-500 mt-2">Our guides will respond within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Send a Direct Echo</h2>
                    <p className="text-slate-500 text-sm">Describe your inquiry and we will dispatch a response soon.</p>
                  </div>
                  <textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" className="w-full bg-slate-950/50 border border-slate-800 rounded-3xl p-6 min-h-[200px] text-white focus:outline-none focus:border-indigo-500/50 transition-all resize-none" />
                  <button type="submit" disabled={!message.trim()} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-3">
                    <Send size={18} /> Dispatch Inquiry
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SupportView;
