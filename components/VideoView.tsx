
import React, { useState, useEffect } from 'react';
import { GeneratedVideo, CreationItem } from '../types';
import { startVideoGeneration, pollVideoOperation } from '../services/geminiService';
import { ArrowLeft } from 'lucide-react';

interface VideoViewProps {
  onBack?: () => void;
}

const VideoView: React.FC<VideoViewProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<GeneratedVideo[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      const selected = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(selected);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    await (window as any).aistudio.openSelectKey();
    setHasKey(true); // Proceed as instructed
  };

  const saveToArchive = (item: GeneratedVideo) => {
    const archiveStr = localStorage.getItem('creation_archive') || '[]';
    const archive: CreationItem[] = JSON.parse(archiveStr);
    const newItem: CreationItem = {
      id: `vid-${item.timestamp}`,
      type: 'video',
      url: item.url,
      prompt: item.prompt,
      timestamp: item.timestamp
    };
    // Videos are large (Blobs), so we keep only a few most recent ones in session memory vs localStorage
    const updatedArchive = [newItem, ...archive].slice(0, 20);
    localStorage.setItem('creation_archive', JSON.stringify(updatedArchive));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setStatusMessage('Initiating video pipeline...');
    try {
      let operation = await startVideoGeneration(prompt);
      
      const loadingMessages = [
        "Rendering cinematic frames...",
        "Applying neural temporal consistency...",
        "Simulating high-resolution lighting...",
        "Finalizing MP4 stream encoding...",
        "Optimizing for playback..."
      ];
      
      let msgIdx = 0;
      const interval = setInterval(() => {
        setStatusMessage(loadingMessages[msgIdx % loadingMessages.length]);
        msgIdx++;
      }, 10000);

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await pollVideoOperation(operation);
      }

      clearInterval(interval);
      
      const downloadLink = (operation as any).response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await videoResponse.blob();
        const videoUrl = URL.createObjectURL(blob);
        const newVid = { url: videoUrl, prompt, timestamp: Date.now() };
        setHistory(prev => [newVid, ...prev]);
        saveToArchive(newVid);
        setStatusMessage('');
      }
    } catch (error) {
      console.error(error);
      const errStr = String(error);
      if (errStr.includes("Requested entity was not found")) {
        alert("API Key issue. Please re-select your key.");
        setHasKey(false);
      } else {
        alert('Video generation failed. Please check console.');
      }
    } finally {
      setIsGenerating(false);
      setStatusMessage('');
    }
  };

  if (hasKey === false) {
    return (
      <div className="h-full flex items-center justify-center p-10 bg-slate-900">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-10 text-center space-y-6 shadow-2xl relative">
          {onBack && (
             <button onClick={onBack} className="absolute top-6 left-6 p-2 text-slate-500 hover:text-white transition-colors">
                <ArrowLeft size={24} />
             </button>
          )}
          <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto text-orange-500">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Paid API Key Required</h2>
            <p className="text-slate-400">Veo Video Generation requires a selected API key from a paid GCP project.</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleSelectKey}
              className="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-lg shadow-orange-600/20"
            >
              Select API Key
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              className="block text-sm text-slate-500 hover:text-slate-300 underline"
            >
              Learn about billing
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 p-6 md:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-6">
            {onBack && (
              <button 
                onClick={onBack}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Cinematic Veo</h2>
              <p className="text-slate-400">Next-generation video synthesis at 720p 16:9.</p>
            </div>
          </div>
          <button onClick={handleSelectKey} className="text-xs text-slate-500 hover:text-orange-400 border border-slate-800 hover:border-orange-500/30 px-3 py-1.5 rounded-lg transition-all">
            Switch Key
          </button>
        </header>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="relative group">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your scene... e.g., 'A neon hologram of a cat driving a spaceship at top speed'"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-6 px-8 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold hover:from-orange-500 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-orange-600/20"
            >
              {isGenerating ? 'Synthesizing...' : 'Generate'}
            </button>
          </div>
        </form>

        {isGenerating && (
          <div className="bg-slate-800/40 rounded-3xl border border-slate-700 p-16 text-center space-y-8 animate-pulse">
            <div className="flex justify-center gap-2">
              <div className="w-3 h-12 bg-orange-500/60 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
              <div className="w-3 h-12 bg-orange-500/80 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
              <div className="w-3 h-12 bg-orange-500 rounded-full animate-bounce"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">{statusMessage}</h3>
              <p className="text-slate-500 text-sm">This can take a few minutes. Grab a coffee!</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {history.map((video, idx) => (
            <div key={idx} className="group bg-slate-800/30 rounded-3xl border border-slate-700/50 overflow-hidden hover:border-orange-500/30 transition-all shadow-xl">
              <div className="aspect-video bg-black relative">
                <video src={video.url} controls className="w-full h-full object-contain" />
              </div>
              <div className="p-6">
                <p className="text-slate-300 font-medium leading-relaxed italic">"{video.prompt}"</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{new Date(video.timestamp).toLocaleString()}</span>
                  <a href={video.url} download="nexus-video.mp4" className="text-orange-500 text-xs font-bold hover:underline">Download MP4</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoView;
