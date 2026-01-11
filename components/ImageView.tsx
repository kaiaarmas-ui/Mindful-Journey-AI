import React, { useState, useEffect } from 'react';
import { GeneratedImage, CreationItem } from '../types';
import { generateImage } from '../services/geminiService';
import { Sparkles, Download, History, Palette, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageViewProps {
  onBack?: () => void;
}

const ImageView: React.FC<ImageViewProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const saveToArchive = (item: GeneratedImage) => {
    const archiveStr = localStorage.getItem('creation_archive') || '[]';
    const archive: CreationItem[] = JSON.parse(archiveStr);
    const newItem: CreationItem = {
      id: `img-${item.timestamp}`,
      type: 'image',
      url: item.url,
      prompt: item.prompt,
      timestamp: item.timestamp
    };
    const updatedArchive = [newItem, ...archive].slice(0, 20);
    localStorage.setItem('creation_archive', JSON.stringify(updatedArchive));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setCurrentImage(null);
    try {
      const imageUrl = await generateImage(prompt);
      setCurrentImage(imageUrl);
      const newImg = { url: imageUrl, prompt, timestamp: Date.now() };
      setHistory(prev => [newImg, ...prev]);
      saveToArchive(newImg);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-main overflow-hidden relative">
      {/* Sticky Navigation Header */}
      <div className="sticky top-0 inset-x-0 p-6 border-b border-main bg-sub/90 backdrop-blur-xl z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2.5 hover:bg-main rounded-full transition-all text-sub hover:text-main border border-main"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 className="text-xl font-bold text-main tracking-tight flex items-center gap-3">
            <Palette className="text-indigo-400" size={20} />
            Peaceful Canvas
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
           AI Art Studio
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-sub">
        <div className="max-w-7xl mx-auto w-full p-8 md:p-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-10">
              <header className="space-y-4">
                <p className="text-sub text-lg font-light leading-relaxed">Create your inner tranquility through deep generative art.</p>
              </header>

              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="relative group">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe a serene landscape..."
                    className="w-full bg-main border border-main rounded-[32px] p-8 min-h-[160px] text-main placeholder-slate-600 focus:outline-none focus:border-indigo-500/40 transition-all shadow-xl resize-none text-lg font-light"
                  />
                  <div className="absolute bottom-6 right-6">
                     <button
                      type="submit"
                      disabled={!prompt.trim() || isGenerating}
                      className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg"
                    >
                      {isGenerating ? <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" /> : <Sparkles size={20} />}
                      {isGenerating ? 'Weaving...' : 'Generate'}
                    </button>
                  </div>
                </div>
              </form>

              <div className="bg-main/40 rounded-[48px] border border-main p-12 flex items-center justify-center min-h-[500px] shadow-2xl relative group overflow-hidden">
                {currentImage ? (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg aspect-square">
                    <img src={currentImage} alt="Zen output" className="rounded-[40px] shadow-2xl w-full h-full object-cover border border-main" />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-[40px] backdrop-blur-sm">
                      <a href={currentImage} download="zen-art.png" className="bg-white/10 p-4 rounded-full text-white backdrop-blur-md border border-white/20 hover:scale-110 transition-transform">
                        <Download size={24} />
                      </a>
                    </div>
                  </motion.div>
                ) : isGenerating ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-sub text-sm font-bold uppercase tracking-[0.2em] animate-pulse">Synthesizing Serenity</p>
                  </div>
                ) : (
                  <div className="text-center space-y-4 max-w-sm">
                    <ImageIcon size={48} className="mx-auto text-slate-700" />
                    <p className="text-sub font-light text-base leading-relaxed italic">Your canvas is waiting. Describe a peaceful vision above.</p>
                  </div>
                )}
              </div>
            </div>

            <aside className="w-full lg:w-80 space-y-8">
              <h3 className="text-xl font-bold text-main flex items-center gap-3">
                <History size={20} className="text-sub" />
                Recent Visions
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
                {history.map((img, idx) => (
                  <button key={idx} onClick={() => setCurrentImage(img.url)} className="relative aspect-square rounded-3xl overflow-hidden border border-main hover:border-indigo-500/40 transition-all group">
                    <img src={img.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </button>
                ))}
                {history.length === 0 && (
                  <div className="h-40 rounded-3xl border border-dashed border-main flex items-center justify-center text-sub italic text-sm">Empty Journal</div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageView;