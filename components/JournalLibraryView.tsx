import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Brain, Palette, Hash, Star, Moon, Sun, Heart, Zap, Infinity as InfinityIcon, Target } from 'lucide-react';
import { JournalTemplate } from '../types';

const CATEGORIES = ["All", "Daily", "Art", "Patterns", "Kids", "Focus"];

const BASE_TEMPLATES: JournalTemplate[] = [
  { id: 'dot-1', title: 'The Shining Star', category: 'Patterns', mode: 'dot-to-dot', iconName: 'Hash', description: 'Follow the numbers to find a star.', prompt: 'Star' },
  { id: 'dot-2', title: 'Mountain Peak', category: 'Patterns', mode: 'dot-to-dot', iconName: 'Hash', description: 'Climb the numbers to a serene summit.', prompt: 'Mountain' },
  { id: 'art-1', title: 'Feelings Color Wheel', category: 'Art', mode: 'art', iconName: 'Palette', description: 'Paint your feelings with colors.', prompt: 'Draw how you feel right now using only colors.' },
  { id: 'art-2', title: 'Zen Doodles', category: 'Art', mode: 'art', iconName: 'Palette', description: 'Grow a garden of meditative doodles.', prompt: 'Draw simple repeating patterns to calm your mind.' },
  { id: 'daily-1', title: 'Morning Check-in', category: 'Daily', iconName: 'Sun', description: 'Start your day with intent.', prompt: 'How do you want to feel today? What is one small goal?' },
  { id: 'kids-1', title: 'Happy Monster', category: 'Kids', mode: 'art', iconName: 'Heart', description: 'Draw a silly happy monster!', prompt: 'Draw your happy monster and tell us his name.' }
];

const ICON_MAP: Record<string, any> = { Brain, Palette, Hash, Star, Moon, Sun, Heart, Zap, Target };

const JournalLibraryView: React.FC<{ onBack: () => void, onSelectTemplate: (t: JournalTemplate) => void }> = ({ onBack, onSelectTemplate }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = BASE_TEMPLATES.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full bg-main text-main overflow-y-auto selection:bg-indigo-500/20 custom-scrollbar">
      <div className="max-w-7xl mx-auto py-16 px-6 space-y-12 pb-40">
        <header className="space-y-8 relative text-center">
          <button onClick={onBack} className="absolute left-0 top-0 p-2.5 hover:bg-sub rounded-full text-sub hover:text-main border border-main">
            <ArrowLeft size={24} />
          </button>
          <div className="flex justify-center">
             <div className="w-20 h-20 bg-indigo-600/10 border border-indigo-500/20 rounded-[28px] flex items-center justify-center text-indigo-500 shadow-sm"><InfinityIcon size={40} /></div>
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tighter">Journal Library</h1>
            <p className="text-xl text-sub font-light max-w-2xl mx-auto">Explore different ways to reflect and create today.</p>
          </div>
        </header>

        <div className="sticky top-0 z-30 pt-4 pb-8 bg-main/90 backdrop-blur-md space-y-6">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-sub" size={22} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates..." className="w-full bg-sub border border-main rounded-2xl py-5 pl-16 pr-8 text-main focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-xl text-xs font-bold uppercase transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-sub border border-main text-sub hover:text-main'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((template) => {
            const Icon = ICON_MAP[template.iconName] || Brain;
            return (
              <button key={template.id} onClick={() => onSelectTemplate(template)} className="bg-sub border border-main p-10 rounded-[48px] text-left hover:border-indigo-500/40 transition-all group flex flex-col justify-between shadow-sm min-h-[350px]">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-main border border-main flex items-center justify-center text-sub group-hover:text-indigo-500 transition-all"><Icon size={32} /></div>
                  <div className="space-y-3">
                    <span className="text-[9px] font-bold text-indigo-500 uppercase px-2 py-1 rounded-full bg-indigo-500/5">{template.category}</span>
                    <h3 className="text-2xl font-bold tracking-tight">{template.title}</h3>
                    <p className="text-sub text-sm font-light italic">"{template.description}"</p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-main flex items-center justify-between text-indigo-500 font-bold text-[10px] uppercase group-hover:translate-x-1 transition-transform">
                  <span>Start Journal</span>
                  <ArrowLeft className="rotate-180" size={14} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JournalLibraryView;