import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, FileText, Lock, Eye, Globe } from 'lucide-react';

interface LegalViewProps {
  type: 'privacy' | 'terms';
  onBack: () => void;
}

const LegalView: React.FC<LegalViewProps> = ({ type, onBack }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="h-full bg-[#0f172a] text-slate-300 overflow-y-auto selection:bg-indigo-500/20">
      <div className="max-w-3xl mx-auto py-16 px-6 space-y-12 pb-40">
        <header className="space-y-6 relative">
          <button 
            onClick={onBack}
            className="absolute -left-12 top-1 p-2 hover:bg-slate-800 rounded-full transition-all text-slate-500 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              {isPrivacy ? <Shield size={28} /> : <FileText size={28} />}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
              </h1>
              <p className="text-slate-500 font-medium">Last updated: January 12, 2026</p>
            </div>
          </div>
        </header>

        <section className="bg-slate-900/40 border border-slate-800 rounded-[32px] p-8 md:p-12 prose prose-invert max-w-none space-y-8 shadow-2xl">
          {isPrivacy ? (
            <>
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Lock size={20} className="text-indigo-400" />
                  Local-First Commitment
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  Mindful Journey is designed with a "Local-First" architecture. Your personal reflections, journal entries, and manifestations are stored directly in your browser's local storage. We do not sync these private thoughts to our servers.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Globe size={20} className="text-indigo-400" />
                  AI Data Processing
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  We utilize the Google Gemini API to provide intelligent guidance and creative synthesis. When you interact with the Soul Guide or generate art, your specific prompts are sent to Google's servers for processing. This data is governed by Google's Enterprise Privacy commitments.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Eye size={20} className="text-indigo-400" />
                  Usage Analytics
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  We collect anonymous, aggregated usage data (such as feature popularity and session length) to improve the experience. We never link this data to your personal journal content.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
                <p className="text-slate-400 leading-relaxed">
                  By accessing Mindful Journey, you agree to be bound by these terms. This platform is a tool for self-reflection and creative exploration, powered by experimental AI technologies.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">2. AI Disclaimer</h2>
                <p className="text-slate-400 leading-relaxed">
                  The Soul Guide and other AI features provide generative responses. These should not be considered medical, psychological, or professional advice. Always consult a qualified professional for health concerns.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">3. User Conduct</h2>
                <p className="text-slate-400 leading-relaxed">
                  Users are expected to use the platform for its intended mindful purposes. Abuse of generative features to create harmful or illegal content is strictly prohibited and may result in account termination.
                </p>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">4. Membership</h2>
                <p className="text-slate-400 leading-relaxed">
                  Presence Architect membership grants access to advanced AI models and extended features. Subscriptions are processed via secure channels and can be managed in your settings.
                </p>
              </div>
            </>
          )}
        </section>

        <footer className="text-center pt-8">
           <p className="text-xs text-slate-600 font-bold uppercase tracking-[0.2em]">© 2026 Mindful Journey • Architecture of Presence</p>
        </footer>
      </div>
    </div>
  );
};

export default LegalView;