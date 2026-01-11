import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import ChatView from './components/ChatView.tsx';
import ImageView from './components/ImageView.tsx';
import VideoView from './components/VideoView.tsx';
import LiveView from './components/LiveView.tsx';
import QuickReliefView from './components/QuickReliefView.tsx';
import RecommendationsView from './components/RecommendationsView.tsx';
import FavoritesView from './components/FavoritesView.tsx';
import InspirationView from './components/InspirationView.tsx';
import SettingsView from './components/SettingsView.tsx';
import RemindersView from './components/RemindersView.tsx';
import MyDataView from './components/MyDataView.tsx';
import JournalView from './components/JournalView.tsx';
import AboutView from './components/AboutView.tsx';
import AuthView from './components/AuthView.tsx';
import JournalLibraryView from './components/JournalLibraryView.tsx';
import LandingView from './components/LandingView.tsx';
import LegalView from './components/LegalView.tsx';
import SupportView from './components/SupportView.tsx';
import IntegrationView from './components/IntegrationView.tsx';
import TheVoidView from './components/TheVoidView.tsx';
import CollectiveSoulView from './components/CollectiveSoulView.tsx';
import MusicView from './components/MusicView.tsx';
import PoetryView from './components/PoetryView.tsx';
import StoryView from './components/StoryView.tsx';
import VisionView from './components/VisionView.tsx';
import { AppView, UserProfile, MembershipTier } from './types.ts';
import { motion, AnimatePresence } from 'framer-motion';

const XP_PER_LEVEL = 200;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView | 'landing'>(() => {
    const userSaved = localStorage.getItem('mindful_user');
    return userSaved ? 'dashboard' : 'landing';
  });
  
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mindful_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [history, setHistory] = useState<(AppView | 'landing')[]>([]);
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);
  const [selectedPrompt, setSelectedPrompt] = useState<string | undefined>(undefined);
  
  const [theme, setTheme] = useState(() => localStorage.getItem('theme_pref') || 'sage-sky');

  const handleGainXp = useCallback((amount: number) => {
    setUser(prev => {
      if (!prev) return null;
      let newTotalXp = prev.awakening.totalXp + amount;
      let newLevel = Math.floor(newTotalXp / XP_PER_LEVEL) + 1;
      let newXp = newTotalXp % XP_PER_LEVEL;
      const updatedUser = {
        ...prev,
        awakening: { ...prev.awakening, level: newLevel, xp: newXp, totalXp: newTotalXp }
      };
      localStorage.setItem('mindful_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    const nextTheme = theme === 'light' ? 'sage-sky' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme_pref', nextTheme);
  };

  const handleViewChange = (view: AppView | 'landing', mode?: string, prompt?: string, tier?: MembershipTier) => {
    if (view !== currentView) setHistory(prev => [...prev, currentView]);
    if (tier && user) {
       setUser(prev => {
         if (!prev) return null;
         const updated = { ...prev, tier };
         localStorage.setItem('mindful_user', JSON.stringify(updated));
         return updated;
       });
    }
    setCurrentView(view);
    setViewParam(mode);
    if (prompt) setSelectedPrompt(prompt);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(prevH => prevH.slice(0, -1));
      setCurrentView(prev);
    } else {
      setCurrentView(user ? 'dashboard' : 'landing');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing': return <LandingView onJoin={() => handleViewChange('auth')} onExplore={() => handleViewChange('dashboard')} onToggleTheme={handleThemeToggle} currentTheme={theme} onViewChange={handleViewChange} />;
      case 'dashboard': return <Dashboard user={user} onViewChange={handleViewChange} onToggleTheme={handleThemeToggle} currentTheme={theme} />;
      case 'chat': return <ChatView onBack={handleBack} isMember={!!user} userTier={user?.tier} initialMode={viewParam} />;
      case 'image': return <ImageView onBack={handleBack} />;
      case 'video': return <VideoView onBack={handleBack} />;
      case 'live': return <LiveView onBack={handleBack} />;
      case 'poetry': return <PoetryView onBack={handleBack} onSave={(p) => handleViewChange('journal', 'free', p)} />;
      case 'story': return <StoryView onBack={handleBack} onSave={(s) => handleViewChange('journal', 'free', s)} />;
      case 'quick-relief': return <QuickReliefView onBack={handleBack} onComplete={() => handleGainXp(15)} />;
      case 'recommendations': return <RecommendationsView onBack={handleBack} onComplete={() => handleGainXp(30)} />;
      case 'journal': return <JournalView onBack={handleBack} initialMode={viewParam} initialPrompt={selectedPrompt} onComplete={() => handleGainXp(25)} />;
      case 'journal-library': return <JournalLibraryView onBack={handleBack} onSelectTemplate={(t) => handleViewChange('journal', t.mode || 'guided', t.prompt)} />;
      case 'music': return <MusicView onBack={handleBack} />;
      case 'daily-inspiration': return <InspirationView onBack={handleBack} isMember={!!user} />;
      case 'collective-soul': return <CollectiveSoulView onBack={handleBack} userTier={user?.tier || 'seeker'} />;
      case 'the-void': return <TheVoidView onBack={handleBack} />;
      case 'my-data': return <MyDataView onBack={handleBack} />;
      case 'reminders': return <RemindersView onBack={handleBack} />;
      case 'favorites': return <FavoritesView onBack={handleBack} onViewChange={handleViewChange} />;
      case 'vision': return <VisionView onBack={handleBack} onViewChange={handleViewChange} />;
      case 'about': return <AboutView onBack={handleBack} />;
      case 'integration': return <IntegrationView onBack={handleBack} onViewChange={handleViewChange} />;
      case 'privacy': return <LegalView type="privacy" onBack={handleBack} />;
      case 'terms': return <LegalView type="terms" onBack={handleBack} />;
      case 'support': return <SupportView onBack={handleBack} />;
      case 'settings': return <SettingsView onClose={handleBack} onThemeChange={(t) => { setTheme(t); localStorage.setItem('theme_pref', t); }} currentTheme={theme} />;
      case 'auth': return <AuthView onBack={handleBack} onAuthSuccess={(u) => { setUser(u); setCurrentView('dashboard'); }} />;
      default: return <Dashboard user={user} onViewChange={handleViewChange} onToggleTheme={handleThemeToggle} currentTheme={theme} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-main text-main overflow-hidden selection:bg-indigo-500/20">
      {currentView !== 'landing' && (
        <Sidebar 
          user={user} 
          currentView={currentView as AppView} 
          onViewChange={handleViewChange} 
          onLogout={() => { localStorage.removeItem('mindful_user'); setUser(null); setCurrentView('landing'); }} 
          onToggleTheme={handleThemeToggle} 
          currentTheme={theme} 
        />
      )}
      <main className="flex-1 relative overflow-hidden bg-sub">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentView} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;