import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, History, Clock, ChevronRight, Flower2, Layers, Mic, Video, Search, Accessibility, Book } from 'lucide-react';

const TimelineView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  return (
    <div className="h-full bg-main text-main overflow-y-auto selection:bg-indigo-500/20 custom-scrollbar">
      <div className="max-w-4xl mx-auto py-16 px-6 space-y-12 pb-40">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 border-b border-main relative">
          {onBack && (
            <button onClick={onBack} className="absolute -left-12 top-0 p-2 hover:bg-sub rounded-full text-sub hover:text-main border border-main">
              <ArrowLeft size={24} />
            </button>
          )}
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tighter flex items-center gap-4">
              <History className="text-indigo-400" size={32} />
              The Journey Log
            </h1>
            <p className="text-sub font-medium">A history of how we grow together.</p>
          </div>
        </header>

        <div className="space-y-8">
          <Event title="Brand New Look" date="Jan 12, 2026" icon={Flower2} desc="We launched our new MJ logo and simpler design." color="text-indigo-400" />
          <Event title="Voice Chat" date="Nov 5, 2025" icon={Mic} desc="Talk to your guide with zero delay using native audio." color="text-purple-400" />
          <Event title="AI Video" date="Sep 14, 2025" icon={Video} desc="Generate peaceful dream videos for relaxation." color="text-orange-400" />
          <Event title="Launch Day" date="Mar 22, 2024" icon={Search} desc="The very first version of Mindful Journey went live." color="text-sky-400" />
        </div>
      </div>
    </div>
  );
};

const Event = ({ title, date, icon: Icon, desc, color }: any) => (
  <div className="bg-sub border border-main p-8 rounded-[40px] flex gap-8 hover:border-indigo-500/20 transition-all shadow-sm">
    <div className={`w-14 h-14 rounded-2xl bg-main border border-main flex items-center justify-center flex-shrink-0 ${color} shadow-sm`}>
      <Icon size={26} />
    </div>
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{title}</h3>
        <span className="text-[10px] font-bold text-sub flex items-center gap-1"><Clock size={12}/> {date}</span>
      </div>
      <p className="text-sub text-sm leading-relaxed font-light">{desc}</p>
    </div>
  </div>
);

export default TimelineView;