
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  Copy, 
  Check, 
  Rocket, 
  Globe, 
  Target, 
  Megaphone,
  Loader2,
  Image as ImageIcon,
  Share2,
  Zap,
  Layout,
  Type,
  Instagram,
  Smartphone,
  Download,
  Eye,
  Camera,
  UserCircle,
  Mail,
  Smartphone as PhoneIcon,
  Moon,
  Heart,
  MessageCircle,
  Send as SendIcon,
  Bookmark,
  Flag,
  AppWindow,
  Key
} from 'lucide-react';
import { generateMarketingAssets, generateImage } from '../services/geminiService';

interface MarketingToolkitViewProps {
  onBack: () => void;
  isMember?: boolean;
}

const MarketingToolkitView: React.FC<MarketingToolkitViewProps> = ({ onBack, isMember = false }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [adVariants, setAdVariants] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [promoImage, setPromoImage] = useState<string | null>(null);
  
  const [isGeneratingBrand, setIsGeneratingBrand] = useState(false);
  const [brandImage, setBrandImage] = useState<string | null>(null);

  const [isGeneratingFirstPost, setIsGeneratingFirstPost] = useState(false);
  const [firstPostImage, setFirstPostImage] = useState<string | null>(null);
  const [selectedCaption, setSelectedCaption] = useState(0);

  const [activeASO, setActiveASO] = useState(0);

  const asoVariants = [
    {
      label: "App Store Listing (iOS)",
      title: "Mindful Journey: Zen AI Space",
      subtitle: "10 Trillion Paths to Peace",
      desc: "Mindful Journey is the ultimate bridge between neural computation and mindful stillness. Powered by Gemini AI, our app offers a world-class space for high-performance minds seeking composition and calm at www.mindfuljourney.com.\n\nFEATURES:\n• 10 Trillion unique journaling paths\n• Real-time AI Soul Guidance\n• Visual Art Journaling\n• Cinematic Creation with Veo 3.1\n• Zero-latency Voice Presence\n\nExperience the high-performance calm you deserve. Your journey begins with a single reflection.",
      keywords: "meditation, ai, journal, wellness, zen, gratitude, anxiety relief, productivity, mindfulness, gemini, mindfuljourney"
    },
    {
      label: "Play Store Listing (Android)",
      title: "Mindful Journey AI",
      subtitle: "Personalized Wellness & Meditation",
      desc: "Unlock your inner flow. Mindful Journey AI combines cutting-edge neural intelligence with ancient mindfulness practices. Whether you're a CEO, an artist, or a student, our AI-guided reflections and visual creations help you find clarity in a noisy world. Visit www.mindfuljourney.com to learn more.\n\nJoin the 10 Trillion paths today.",
      keywords: "zen, ai journal, stress relief, meditation app, mood tracker, mental health, digital art, mindful journey"
    }
  ];

  const firstPostCaptions = [
    {
      label: "The Intention Hook",
      text: "We’re redefining the ‘I’ in AI. Here, it stands for Intention. 🧘‍♂️\n\nWelcome to Mindful Journey—your personal space for neural creation at www.mindfuljourney.com. Discover 10 Trillion unique journaling paths tailored to your spirit. This is where high-performance meets high-presence.\n\nLink in bio to begin. ✨ #MindfulJourney #GeminiAI #ZenTech #MindfulJourneyCom"
    },
    {
      label: "The Ethereal Reveal",
      text: "Imagine a digital space that breathes with you. 🪷\n\nNo noise. No distraction. Just the calm of a trillion possibilities at www.mindfuljourney.com. We’ve built the bridge between neural computation and mindful stillness.\n\nAre you ready for your first reflection? Start now. 👇 #AIFirst #Mindfulness #TheFutureIsCalm #MindfulJourney"
    },
    {
      label: "The Mystery Call",
      text: "10,240,000,000,000. \n\nThat’s how many ways you can reflect today. Every path is non-repeating. Every thought is private. Every journey is yours. Experience the dimension at www.mindfuljourney.com.\n\nWelcome home. 🏠 #NeuralFlow #MindfulTech #AIBrand #MindfulJourney"
    }
  ];

  const handleGenerateCopy = async () => {
    if (!isMember) return;
    setIsGenerating(true);
    try {
      const copy = await generateMarketingAssets();
      setAdVariants(copy);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="h-full bg-[#0f172a] text-slate-300 overflow-y-auto selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto py-16 px-6 space-y-24 pb-40">
        
        {/* Header */}
        <header className="space-y-6 relative text-center">
          <button 
            onClick={onBack}
            className="absolute left-0 top-0 p-2.5 hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-white border border-slate-800/50"
            title="Back"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex justify-center mb-4">
             <div className="p-4 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 text-indigo-400 shadow-2xl shadow-indigo-500/10">
                <Share2 size={40} />
             </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter">Promotion Studio</h1>
            <p className="text-slate-500 font-medium text-lg">Synthesize professional brand identity and growth assets for www.mindfuljourney.com.</p>
          </div>
        </header>

        {/* APP STORE OPTIMIZATION (ASO) SECTION */}
        <section className="space-y-12">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20">
                <AppWindow size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">App Store ASO</h2>
                <p className="text-slate-500 font-medium">Assets optimized for www.mindfuljourney.com.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 space-y-4">
                 {asoVariants.map((variant, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveASO(idx)}
                      className={`w-full text-left p-6 rounded-3xl border transition-all ${
                        activeASO === idx 
                        ? 'bg-sky-500/10 border-sky-500/30 ring-1 ring-sky-500/20 shadow-xl' 
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                       <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activeASO === idx ? 'text-sky-400' : 'text-slate-500'}`}>{variant.label}</p>
                       <p className="font-bold text-white text-sm">{variant.title}</p>
                    </button>
                 ))}
              </div>

              <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800 rounded-[48px] p-10 space-y-8 shadow-3xl">
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xl font-bold text-white">Full Listing Description</h3>
                       <button 
                        onClick={() => copyToClipboard(asoVariants[activeASO].desc, 500)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition-all"
                       >
                         {copiedIndex === 500 ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                         Copy to Clipboard
                       </button>
                    </div>
                    
                    <div className="space-y-2">
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Title</p>
                       <p className="text-xl font-bold text-white">{asoVariants[activeASO].title}</p>
                    </div>

                    <div className="p-6 bg-slate-950/60 rounded-3xl border border-slate-800">
                       <p className="text-xs text-slate-500 uppercase tracking-widest font-black mb-4">Description Text (includes domain)</p>
                       <p className="text-sm text-slate-400 leading-relaxed font-serif whitespace-pre-wrap italic">
                          {asoVariants[activeASO].desc}
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* FIRST POST SECTION */}
        <section className="space-y-12">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
                  <Rocket size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Social Post Creator</h2>
                  <p className="text-slate-500 font-medium">Ready-to-use captions pointing to www.mindfuljourney.com.</p>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {firstPostCaptions.map((cap, idx) => (
                <div key={idx} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[32px] space-y-4 flex flex-col justify-between">
                   <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase text-indigo-400">{cap.label}</p>
                      <p className="text-xs text-slate-400 leading-relaxed italic">"{cap.text}"</p>
                   </div>
                   <button 
                     onClick={() => copyToClipboard(cap.text, idx)}
                     className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-bold text-white transition-all flex items-center justify-center gap-2"
                   >
                      {copiedIndex === idx ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      Copy Caption
                   </button>
                </div>
              ))}
           </div>
        </section>

        {/* Global Strategy Note */}
        <footer className="bg-indigo-600/10 border border-indigo-500/20 p-10 rounded-[40px] flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
           <Globe className="text-indigo-400 flex-shrink-0" size={40} />
           <div className="space-y-2">
             <p className="text-base text-slate-300 font-bold tracking-tight">Global Domain Strategy</p>
             <p className="text-sm text-slate-400 leading-relaxed italic max-w-3xl">
              "Your app is now configured for <strong>www.mindfuljourney.com</strong>. All SEO tags and social previews are optimized for this specific URI to maximize search authority and brand recognition."
             </p>
           </div>
        </footer>
      </div>
    </div>
  );
};
export default MarketingToolkitView;
