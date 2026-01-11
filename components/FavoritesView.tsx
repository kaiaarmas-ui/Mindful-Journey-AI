
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, Compass, ArrowLeft, Trash2, Clock, Zap, Brain, Wind, MapPin, Dumbbell, Heart, Lightbulb, Hand } from 'lucide-react';
import { AppView, FavoriteItem } from '../types';

interface FavoritesViewProps {
  onViewChange?: (view: AppView) => void;
  onBack?: () => void;
}

const IconMap: Record<string, any> = {
  Wind,
  MapPin,
  Dumbbell,
  Brain,
  Hand,
  Heart,
  Lightbulb,
  Zap,
  Star
};

const FavoritesView: React.FC<FavoritesViewProps> = ({ onViewChange, onBack }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mindful_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const removeFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('mindful_favorites', JSON.stringify(updated));
  };

  const handleNavigate = (sourceView: AppView) => {
    onViewChange?.(sourceView);
  };

  return (
    <div className="flex flex-col h-full bg-[#111827] overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full p-8 md:p-16 flex flex-col items-center min-h-[80vh] space-y-12 relative pb-32">
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute left-16 top-16 p-2 text-slate-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        
        {/* Header Section */}
        <header className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-[#b0cc8a]/30 text-[#b0cc8a]">
            <Star size={32} />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-serif">Your Favorites</h1>
            <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed font-light">
              Your curated collection of peace and focus.
            </p>
          </div>
        </header>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <AnimatePresence>
              {favorites.map((item) => {
                const Icon = IconMap[item.iconName] || Star;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-slate-800/20 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/30 transition-all group flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-indigo-400 border border-slate-800 group-hover:border-indigo-500/30 transition-colors">
                          <Icon size={24} />
                        </div>
                        <button 
                          onClick={(e) => removeFavorite(e, item.id)}
                          className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                            {item.sourceView === 'quick-relief' ? 'Quick Relief' : 'Guided Session'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
                        {item.description && (
                          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed italic">
                            "{item.description}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      {item.duration && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <Clock size={14} />
                          {item.duration}
                        </div>
                      )}
                      <button 
                        onClick={() => handleNavigate(item.sourceView)}
                        className="text-indigo-400 font-bold text-xs flex items-center gap-1 hover:text-indigo-300 transition-colors"
                      >
                        Go to Practice
                        <Compass size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State Box */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl bg-slate-800/10 border border-slate-800/60 rounded-[32px] p-16 md:p-24 flex flex-col items-center justify-center space-y-8"
          >
            <div className="relative">
              <Star size={80} className="text-slate-700" strokeWidth={1} />
              <div className="absolute -top-2 -right-2 text-slate-600">
                <Sparkles size={24} />
              </div>
              <div className="absolute -bottom-1 -left-3 text-slate-700/50">
                <Sparkles size={16} />
              </div>
            </div>

            <div className="space-y-3 text-center">
              <h3 className="text-2xl font-bold text-white font-serif">No favorites yet</h3>
              <p className="text-slate-500 text-[15px] font-medium max-w-xs mx-auto">
                Start exploring and tap the star icon to save your favorite content
              </p>
            </div>

            <button 
              onClick={() => onViewChange?.('dashboard')}
              className="px-8 py-3.5 bg-[#b0cc8a] hover:bg-[#a2bf7c] text-slate-900 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              Explore Content
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FavoritesView;
