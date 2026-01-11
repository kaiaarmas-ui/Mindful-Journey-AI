import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Music, 
  Headphones, 
  Zap, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  CheckCircle2, 
  Waves,
  Sparkles,
  Link as LinkIcon,
  Smartphone,
  ExternalLink,
  Loader2,
  X,
  Shield,
  User,
  Lock,
  Wifi,
  Activity,
  AlertCircle,
  Radio,
  ExternalLink as OpenIcon,
  Mic
} from 'lucide-react';

// Spotify OAuth Configuration
const SPOTIFY_CLIENT_ID = 'da6d9258277242c78119020464f8931a'; 
// Updated to use the professional domain
const REDIRECT_URI = 'https://www.mindfuljourney.com';
const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state'
].join('%20');

interface MusicViewProps {
  onBack?: () => void;
}

interface Platform {
  id: string;
  name: string;
  color: string;
  hex: string;
  text: string;
  mockSong?: {
    title: string;
    artist: string;
  };
}

const PLATFORMS: Platform[] = [
  { id: 'spotify', name: 'Spotify', color: 'bg-[#1DB954]', hex: '#1DB954', text: 'text-white', mockSong: { title: "Weightless", artist: "Marconi Union" } },
  { id: 'apple', name: 'Apple Music', color: 'bg-white', hex: '#FFFFFF', text: 'text-black', mockSong: { title: "Spiegel im Spiegel", artist: "Arvo Pärt" } },
  { id: 'youtube', name: 'YouTube Music', color: 'bg-[#FF0000]', hex: '#FF0000', text: 'text-white', mockSong: { title: "Deep Focus", artist: "Solar Fields" } }
];

const NEURAL_TRACKS = [
  { id: 'alpha', name: 'Alpha Focus', desc: '8-14Hz for creative flow' },
  { id: 'delta', name: 'Delta Deep', desc: '0.5-4Hz for restful sleep' },
  { id: 'theta', name: 'Theta Zen', desc: '4-8Hz for deep meditation' }
];

const MusicView: React.FC<MusicViewProps> = ({ onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState(NEURAL_TRACKS[0]);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  
  // Real Spotify Integration State
  const [spotifyToken, setSpotifyToken] = useState<string | null>(() => localStorage.getItem('spotify_access_token'));
  const [realSpotifySong, setRealSpotifySong] = useState<{ title: string; artist: string; progress_ms?: number; duration_ms?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Neural Sync State (Manual Override)
  const [isNeuralSyncing, setIsNeuralSyncing] = useState(false);
  const [neuralSyncInput, setNeuralSyncInput] = useState('');
  const [activeNeuralSync, setActiveNeuralSync] = useState<{ title: string, artist: string } | null>(null);

  // Handle OAuth Return from URL Hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      if (token) {
        setSpotifyToken(token);
        localStorage.setItem('spotify_access_token', token);
        setConnectedPlatforms(prev => Array.from(new Set([...prev, 'spotify'])));
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    } else if (spotifyToken) {
       setConnectedPlatforms(prev => Array.from(new Set([...prev, 'spotify'])));
    }
  }, [spotifyToken]);

  // Fetch Current Spotify Playback
  useEffect(() => {
    if (!spotifyToken || activeNeuralSync) return;

    const fetchCurrentSong = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            'Authorization': `Bearer ${spotifyToken}`
          }
        });

        if (response.status === 200) {
          const data = await response.json();
          if (data && data.item) {
            setRealSpotifySong({
              title: data.item.name,
              artist: data.item.artists.map((a: any) => a.name).join(', '),
              progress_ms: data.progress_ms,
              duration_ms: data.item.duration_ms
            });
            if (data.item.duration_ms) {
               setPlaybackProgress((data.progress_ms / data.item.duration_ms) * 100);
            }
            setIsPlaying(data.is_playing);
            setError(null);
          }
        } else if (response.status === 401) {
          setSpotifyToken(null);
          localStorage.removeItem('spotify_access_token');
          setConnectedPlatforms(prev => prev.filter(p => p !== 'spotify'));
        }
      } catch (err) {
        console.error("Spotify Handshake Error:", err);
        setError("Connection blocked. Please use Manual Neural Handshake.");
      }
    };

    fetchCurrentSong();
    const interval = setInterval(fetchCurrentSong, 5000);
    return () => clearInterval(interval);
  }, [spotifyToken, activeNeuralSync]);

  // Simulation loop for manual entries
  useEffect(() => {
    let interval: any;
    if (isPlaying && (activeNeuralSync || !spotifyToken)) {
      interval = setInterval(() => {
        setPlaybackProgress(prev => (prev + 0.1) % 100);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeNeuralSync, spotifyToken]);

  const handleSpotifyConnect = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES}`;
    try {
      window.open(authUrl, '_blank', 'width=600,height=800');
      setError("Authorization portal opened in a new tab. Re-sync once complete.");
    } catch (e) {
      setError("Popup blocked. Redirecting current frame...");
      window.location.href = authUrl;
    }
  };

  const handleNeuralSync = (e: React.FormEvent) => {
    e.preventDefault();
    if (!neuralSyncInput.trim()) return;

    const parts = neuralSyncInput.includes(' by ') ? neuralSyncInput.split(' by ') : [neuralSyncInput, "External Vibration"];
    setActiveNeuralSync({ title: parts[0].trim(), artist: parts[1].trim() });
    setConnectedPlatforms(prev => Array.from(new Set([...prev, 'neural-sync'])));
    setIsNeuralSyncing(false);
    setIsPlaying(true);
    setPlaybackProgress(35);
    setError(null);
  };

  const isActuallySpotifyPlaying = spotifyToken && realSpotifySong && !activeNeuralSync;

  return (
    <div className="h-full bg-[#0b101b] text-white overflow-y-auto custom-scrollbar selection:bg-indigo-500/20">
      <div className="max-w-7xl mx-auto py-12 px-6 md:px-12 space-y-16 pb-40">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            {onBack && (
              <button onClick={onBack} className="p-3 hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-white border border-slate-800">
                <ArrowLeft size={24} />
              </button>
            )}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={12} /> Neural Soundscape
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter text-white">Harmonic Presence</h1>
              <p className="text-slate-500 font-medium">Sync your current sonic frequency manually or via API.</p>
            </div>
          </div>
          
          <div className="bg-[#1e293b]/40 border border-slate-800 rounded-3xl p-6 flex items-center gap-6 shadow-xl backdrop-blur-md">
             <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 relative">
                <Activity size={24} />
                {(connectedPlatforms.length > 0 || activeNeuralSync) && (
                   <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1e293b] animate-pulse" />
                )}
             </div>
             <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Resonance</p>
                <p className="text-xl font-bold text-white">{activeNeuralSync ? 'Neural Sync Active' : `${connectedPlatforms.length} Connected`}</p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Player */}
          <div className="lg:col-span-7 space-y-10">
            <section className="bg-[#1e293b]/20 border border-slate-800 rounded-[48px] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
                  <motion.div 
                    animate={isPlaying ? { x: [0, -1000] } : {}}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex h-full w-[4000px] items-center"
                  >
                    {[...Array(20)].map((_, i) => <Waves key={i} size={400} className="flex-shrink-0" />)}
                  </motion.div>
               </div>
               
               <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                  <div className="w-48 h-48 rounded-full border-4 border-indigo-500/20 flex items-center justify-center relative p-2">
                     <div className="w-full h-full rounded-full bg-indigo-500/10 flex items-center justify-center">
                        <motion.div 
                          animate={isPlaying ? { scale: [1, 1.1, 1], rotate: [0, 360] } : {}}
                          transition={isPlaying ? { 
                            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                            rotate: { duration: 15, repeat: Infinity, ease: "linear" }
                          } : {}}
                          className="text-indigo-400"
                        >
                           <Music size={64} />
                        </motion.div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <h2 className="text-3xl font-bold text-white">
                        {activeNeuralSync ? activeNeuralSync.title : (isActuallySpotifyPlaying ? realSpotifySong?.title : activeTrack.name)}
                     </h2>
                     <p className="text-slate-500 font-serif italic text-lg">
                        {activeNeuralSync ? activeNeuralSync.artist : (isActuallySpotifyPlaying ? realSpotifySong?.artist : activeTrack.desc)}
                     </p>
                  </div>

                  <div className="flex items-center gap-10">
                     <button className="text-slate-600 hover:text-white transition-colors"><SkipBack size={24} /></button>
                     <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-3xl transition-all active:scale-95"
                     >
                        {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                     </button>
                     <button className="text-slate-600 hover:text-white transition-colors"><SkipForward size={24} /></button>
                  </div>

                  <div className="w-full max-w-md space-y-2">
                     <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                        <span>{activeNeuralSync ? 'Direct Neural Sync' : 'Internal Frequency'}</span>
                        <span>{isPlaying ? 'Active Flow' : 'Standby'}</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-indigo-500 shadow-lg shadow-indigo-500/50"
                          style={{ width: `${playbackProgress}%`, transition: (isActuallySpotifyPlaying || activeNeuralSync) ? 'width 1s linear' : 'none' }}
                        />
                     </div>
                  </div>
               </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-3 text-white">
                 <Zap size={20} className="text-indigo-400" />
                 Internal Frequencies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {NEURAL_TRACKS.map(track => (
                    <button 
                      key={track.id}
                      onClick={() => { setActiveTrack(track); setActiveNeuralSync(null); }}
                      className={`p-6 rounded-[32px] border text-left transition-all group ${activeTrack.id === track.id && !activeNeuralSync ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-900 border-slate-800'}`}
                    >
                       <p className="font-bold mb-1 text-white">{track.name}</p>
                       <p className="text-[10px] text-slate-500 leading-tight">{track.desc}</p>
                    </button>
                 ))}
              </div>
            </section>
          </div>

          {/* Right Column: Connections */}
          <div className="lg:col-span-5 space-y-10">
            <section className="bg-[#0b101b] border border-slate-800 rounded-[40px] p-8 md:p-10 space-y-8 shadow-xl sticky top-8">
               <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <LinkIcon size={22} className="text-[#10b981]" />
                    <h3 className="text-2xl font-bold text-white tracking-tight">Sonic Portals</h3>
                  </div>
                  <p className="text-slate-500 text-sm">Connect external libraries to import your unique mindful frequencies.</p>
               </div>

               {error && (
                 <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-4">
                    <div className="flex items-start gap-3 text-red-400 text-xs font-bold leading-relaxed">
                       <AlertCircle size={16} className="mt-0.5" />
                       {error}
                    </div>
                    <button 
                      onClick={() => setIsNeuralSyncing(true)}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all"
                    >
                      Bypass API & Manual Sync
                    </button>
                 </motion.div>
               )}

               <div className="space-y-4">
                  {PLATFORMS.map(platform => {
                    const isConnected = connectedPlatforms.includes(platform.id) && !activeNeuralSync;
                    return (
                      <div key={platform.id} className={`flex items-center justify-between p-6 rounded-3xl bg-slate-900/40 border ${isConnected ? 'border-[#10b981]/30' : 'border-slate-800'}`}>
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-2xl ${platform.color} flex items-center justify-center shadow-lg`}>
                              <Music size={24} className={platform.text} />
                           </div>
                           <div>
                              <p className="font-bold text-white">{platform.name}</p>
                              <p className={`text-[9px] font-black uppercase tracking-widest ${isConnected ? 'text-[#10b981]' : 'text-slate-600'}`}>
                                {isConnected ? 'Portal Open' : 'Portal Closed'}
                              </p>
                           </div>
                        </div>
                        {isConnected ? (
                           <CheckCircle2 size={24} className="text-[#10b981] mr-2" />
                        ) : (
                          <button 
                            onClick={platform.id === 'spotify' ? handleSpotifyConnect : () => {}}
                            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all shadow-inner"
                          >
                             Connect
                          </button>
                        )}
                      </div>
                    );
                  })}

                  <div className="pt-4 space-y-4">
                    <div className="h-px w-full bg-slate-800/50" />
                    <button 
                      onClick={() => setIsNeuralSyncing(true)}
                      className="w-full group flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-slate-800 hover:border-indigo-500/40 rounded-[32px] transition-all bg-slate-900/10"
                    >
                      <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors group-hover:scale-110">
                         <Mic size={28} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">Neural Handshake</p>
                        <p className="text-[10px] text-slate-600 font-medium mt-1">If APIs are refused, declare your vibration manually.</p>
                      </div>
                    </button>
                  </div>
               </div>
            </section>
          </div>
        </div>
      </div>

      {/* Manual Sync Modal */}
      <AnimatePresence>
        {isNeuralSyncing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-md w-full bg-[#121212] border border-[#282828] rounded-[48px] p-12 shadow-3xl space-y-8">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3 text-indigo-400">
                    <Radio size={32} className="animate-pulse" />
                    <h3 className="text-3xl font-extrabold text-white tracking-tighter">Declare Frequency</h3>
                 </div>
                 <button onClick={() => setIsNeuralSyncing(false)} className="p-2 text-slate-600 hover:text-white"><X size={32} /></button>
              </div>
              <p className="text-slate-400 text-base leading-relaxed italic">Input your current soundscape to establish a direct neural handshake with the sanctuary.</p>
              <form onSubmit={handleNeuralSync} className="space-y-8">
                <input 
                  type="text" autoFocus placeholder="e.g., Midnight City by M83" value={neuralSyncInput}
                  onChange={(e) => setNeuralSyncInput(e.target.value)}
                  className="w-full bg-[#1e1e1e] border-2 border-[#282828] rounded-[24px] py-6 px-8 text-white text-lg placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner" 
                />
                <button type="submit" disabled={!neuralSyncInput.trim()} className="w-full py-6 rounded-full bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-4 active:scale-95">
                  <Wifi size={24} /> Establish Sync
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicView;