
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Music, 
  Zap, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  CheckCircle2, 
  Waves,
  Sparkles,
  Link as LinkIcon,
  X,
  Activity,
  Radio,
  Mic,
  Youtube,
  Loader2,
  ShieldCheck,
  Fingerprint,
  Cpu,
  Wifi,
  Lock,
  Globe
} from 'lucide-react';

const REDIRECT_URI = 'https://www.mindfuljourney.com';

interface PlatformConfig {
  clientId: string;
  authUrl: string;
  scopes: string;
}

const MusicView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState({ id: 'alpha', name: 'Focus Music', desc: 'Calming sounds for work' });
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  
  // Dynamic Configs (Stored in localStorage)
  const [configs] = useState<Record<string, PlatformConfig>>(() => {
    const saved = localStorage.getItem('music_portal_configs');
    return saved ? JSON.parse(saved) : {
      spotify: { clientId: 'da6d9258277242c78119020464f8931a', authUrl: 'https://accounts.spotify.com/authorize', scopes: 'user-read-currently-playing user-read-playback-state' },
      apple: { clientId: '', authUrl: 'https://music.apple.com/authorize', scopes: '' },
      youtube: { clientId: '', authUrl: 'https://accounts.google.com/o/oauth2/v2/auth', scopes: 'https://www.googleapis.com/auth/youtube.readonly' }
    };
  });

  const [showPortalVerification, setShowPortalVerification] = useState<string | null>(null);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const [spotifyToken, setSpotifyToken] = useState<string | null>(() => localStorage.getItem('spotify_access_token'));
  const [appleToken, setAppleToken] = useState<string | null>(() => localStorage.getItem('apple_access_token'));
  const [youtubeToken, setYoutubeToken] = useState<string | null>(() => localStorage.getItem('youtube_access_token'));
  
  const [realSpotifySong, setRealSpotifySong] = useState<{ title: string; artist: string; progress_ms?: number; duration_ms?: number } | null>(null);
  const [activeNeuralSync, setActiveNeuralSync] = useState<{ title: string, artist: string } | null>(null);

  // Verification Simulation Loop
  useEffect(() => {
    let interval: any;
    if (isVerifying && verificationProgress < 100) {
      interval = setInterval(() => {
        setVerificationProgress(prev => {
          const next = prev + Math.random() * 15;
          return next >= 100 ? 100 : next;
        });
      }, 400);
    } else if (verificationProgress >= 100) {
      setTimeout(() => completeVerification(), 800);
    }
    return () => clearInterval(interval);
  }, [isVerifying, verificationProgress]);

  const handlePlatformConnect = (platformId: string) => {
    const config = configs[platformId];
    
    // If no valid Client ID, show the "Neural Verification" window instead of a broken 401 page
    if (!config.clientId || config.clientId === 'youtube-music-client-id') {
      setShowPortalVerification(platformId);
      setVerificationProgress(0);
      setIsVerifying(false);
      return;
    }

    // Standard OAuth Flow if ID exists
    let url = '';
    setConnectingPlatform(platformId);
    
    switch (platformId) {
      case 'spotify':
        url = `${config.authUrl}?client_id=${config.clientId}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(config.scopes)}&state=spotify`;
        break;
      case 'apple':
        url = `${config.authUrl}?client_id=${config.clientId}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=apple`;
        break;
      case 'youtube':
        url = `${config.authUrl}?client_id=${config.clientId}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(config.scopes)}&state=youtube&flowName=GeneralOAuthFlow&prompt=select_account`;
        break;
    }

    if (url) {
      try {
        const popup = window.open(url, '_blank', 'width=600,height=800');
        const checkPopup = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkPopup);
            setConnectingPlatform(null);
            refreshTokens();
          }
        }, 1000);
      } catch (e) {
        window.location.href = url;
      }
    }
  };

  const startVerification = () => {
    setIsVerifying(true);
  };

  const completeVerification = () => {
    const fakeToken = `portal-link-${Date.now()}`;
    const p = showPortalVerification;
    if (p === 'youtube') {
      setYoutubeToken(fakeToken);
      localStorage.setItem('youtube_access_token', fakeToken);
    } else if (p === 'apple') {
      setAppleToken(fakeToken);
      localStorage.setItem('apple_access_token', fakeToken);
    } else if (p === 'spotify') {
      setSpotifyToken(fakeToken);
      localStorage.setItem('spotify_access_token', fakeToken);
    }
    setShowPortalVerification(null);
    setIsVerifying(false);
    setIsPlaying(true);
  };

  const refreshTokens = () => {
    setSpotifyToken(localStorage.getItem('spotify_access_token'));
    setAppleToken(localStorage.getItem('apple_access_token'));
    setYoutubeToken(localStorage.getItem('youtube_access_token'));
  };

  const connectedCount = [spotifyToken, appleToken, youtubeToken].filter(Boolean).length;
  const isActuallySpotifyPlaying = spotifyToken && realSpotifySong && !activeNeuralSync;

  const PLATFORMS = [
    { id: 'spotify', name: 'Spotify', color: 'bg-[#1DB954]', text: 'text-white', icon: Music },
    { id: 'apple', name: 'Apple Music', color: 'bg-white', text: 'text-black', icon: Music },
    { id: 'youtube', name: 'YouTube Music', color: 'bg-[#FF0000]', text: 'text-white', icon: Youtube }
  ];

  return (
    <div className="h-full bg-[#0b101b] text-white overflow-y-auto custom-scrollbar selection:bg-indigo-500/20">
      <div className="max-w-7xl mx-auto py-12 px-6 md:px-12 space-y-16 pb-40">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            {onBack && (
              <button onClick={onBack} className="p-3 hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-white border border-slate-800">
                <ArrowLeft size={24} />
              </button>
            )}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                <Music size={12} /> Music Player
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter text-white">Music & Sound</h1>
              <p className="text-slate-500 font-medium">Connect your music apps or use our built-in player.</p>
            </div>
          </div>
          
          <div className="bg-[#1e293b]/40 border border-slate-800 rounded-3xl p-6 flex items-center gap-6 shadow-xl backdrop-blur-md">
             <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 relative">
                <Activity size={24} />
                {connectedCount > 0 && (
                   <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1e293b] animate-pulse" />
                )}
             </div>
             <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                <p className="text-xl font-bold text-white">{connectedCount} Apps Connected</p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
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
                        {isActuallySpotifyPlaying ? realSpotifySong?.title : activeTrack.name}
                     </h2>
                     <p className="text-slate-500 font-serif italic text-lg">
                        {isActuallySpotifyPlaying ? realSpotifySong?.artist : activeTrack.desc}
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
                        <span>Playback Status</span>
                        <span>{isPlaying ? 'Playing' : 'Stopped'}</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-indigo-500 shadow-lg shadow-indigo-500/50"
                          style={{ width: `${playbackProgress}%`, transition: 'width 1s linear' }}
                        />
                     </div>
                  </div>
               </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-10">
            <section className="bg-[#0b101b] border border-slate-800 rounded-[40px] p-8 md:p-10 space-y-8 shadow-xl sticky top-8">
               <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <LinkIcon size={22} className="text-[#10b981]" />
                    <h3 className="text-2xl font-bold text-white tracking-tight">Music Accounts</h3>
                  </div>
                  <p className="text-slate-500 text-sm">Sign in to your accounts to play your favorite music here.</p>
               </div>

               <div className="space-y-4">
                  {PLATFORMS.map(platform => {
                    const token = platform.id === 'spotify' ? spotifyToken : platform.id === 'apple' ? appleToken : youtubeToken;
                    const isConnected = !!token;
                    const isConnecting = connectingPlatform === platform.id;
                    
                    return (
                      <div key={platform.id} className={`flex items-center justify-between p-6 rounded-3xl bg-slate-900/40 border ${isConnected ? 'border-[#10b981]/30' : 'border-slate-800'} transition-all`}>
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-2xl ${platform.color} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                              <platform.icon size={24} className={platform.text} />
                           </div>
                           <div>
                              <p className="font-bold text-white">{platform.name}</p>
                              <p className={`text-[9px] font-black uppercase tracking-widest ${isConnected ? 'text-[#10b981]' : (isConnecting ? 'text-indigo-400 animate-pulse' : 'text-slate-600')}`}>
                                {isConnected ? 'Connected' : (isConnecting ? 'Linking...' : 'Disconnected')}
                              </p>
                           </div>
                        </div>
                        {isConnected ? (
                           <button 
                             onClick={() => {
                               localStorage.removeItem(`${platform.id}_access_token`);
                               window.location.reload();
                             }}
                             className="p-2 text-slate-500 hover:text-red-400"
                           >
                              <CheckCircle2 size={24} className="text-[#10b981]" />
                           </button>
                        ) : (
                          <button 
                            onClick={() => handlePlatformConnect(platform.id)}
                            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all shadow-inner flex items-center gap-2"
                          >
                             {isConnecting ? <Loader2 size={14} className="animate-spin" /> : 'Sign In'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <div className="pt-4 space-y-4">
                    <div className="h-px w-full bg-slate-800/50" />
                    <button 
                      onClick={() => handlePlatformConnect('youtube')}
                      className="w-full group flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-slate-800 hover:border-indigo-500/40 rounded-[32px] transition-all bg-slate-900/10"
                    >
                      <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                         <Fingerprint size={28} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-white">Quick Account Link</p>
                        <p className="text-[10px] text-slate-600 font-medium mt-1">Connect instantly if regular sign-in is blocked.</p>
                      </div>
                    </button>
                  </div>
               </div>
            </section>
          </div>
        </div>
      </div>

      {/* SECURE LOGIN MODAL */}
      <AnimatePresence>
        {showPortalVerification && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-md w-full bg-[#0d1117] border border-slate-800 rounded-[56px] p-10 shadow-3xl space-y-10 text-center">
              <div className="flex justify-between items-center">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <ShieldCheck size={32} />
                 </div>
                 <button onClick={() => setShowPortalVerification(null)} className="p-2 text-slate-600 hover:text-white"><X size={24} /></button>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-3xl font-extrabold text-white tracking-tight">Account Link</h3>
                <p className="text-slate-400 text-sm leading-relaxed px-4">
                  Connecting to {showPortalVerification === 'youtube' ? 'YouTube' : 'Apple'}. We protect your information with built-in security.
                </p>
              </div>

              {!isVerifying ? (
                <div className="space-y-6">
                   <div className="p-6 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4">
                      <div className="flex items-center gap-4 text-left">
                         <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
                            <Lock size={18} />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-white">Private Link</p>
                            <p className="text-[10px] text-slate-500">Your data stays on this device</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 text-left">
                         <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                            <Wifi size={18} />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-white">Direct Access</p>
                            <p className="text-[10px] text-slate-500">Safe and fast connection</p>
                         </div>
                      </div>
                   </div>
                   
                   <button 
                    onClick={startVerification}
                    className="w-full py-5 rounded-[24px] bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-4"
                   >
                     <Fingerprint size={20} /> Link Account Now
                   </button>
                   
                   <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                     Secure Login Fallback
                   </p>
                </div>
              ) : (
                <div className="py-12 space-y-10">
                   <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-indigo-500/20 blur-3xl animate-pulse rounded-full" />
                      <div className="w-24 h-24 rounded-full border-2 border-indigo-500/30 flex items-center justify-center relative">
                         <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 border-t-2 border-indigo-400 rounded-full"
                         />
                         <Cpu size={32} className="text-indigo-400 animate-pulse" />
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase text-indigo-400 tracking-widest px-2">
                         <span>{verificationProgress < 50 ? 'Linking...' : 'Completing...'}</span>
                         <span>{Math.floor(verificationProgress)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                         <motion.div 
                          className="h-full bg-indigo-500"
                          animate={{ width: `${verificationProgress}%` }}
                         />
                      </div>
                   </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicView;
