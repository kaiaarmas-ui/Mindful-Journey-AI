import React, { useState } from 'react';
import { AppView, UserProfile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { 
  Moon, 
  Settings,
  Zap,
  Book,
  Sun,
  Info,
  LogOut,
  Crown,
  Menu,
  X,
  Home,
  Brain,
  Feather,
  Palette,
  LayoutGrid,
  ZapOff,
  Database,
  Library
} from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView, mode?: string) => void;
  user: UserProfile | null;
  onLogout: () => void;
  onToggleTheme?: () => void;
  currentTheme?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, user, onLogout, onToggleTheme, currentTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ id, label, icon: Icon, active }: any) => (
    <button
      onClick={() => {
        onViewChange(id);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-indigo-600/10 text-main border border-indigo-500/20' 
          : 'text-sub hover:bg-main/50 hover:text-main'
      }`}
    >
      <Icon size={20} className={active ? 'text-indigo-500' : ''} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 h-full bg-sub border-r border-main flex-col p-4 z-40">
        <div className="px-2 mb-10 mt-2 cursor-pointer" onClick={() => onViewChange('dashboard')}>
          <Logo showText={true} />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          <NavItem id="dashboard" label="Home" icon={Home} active={currentView === 'dashboard'} />
          <NavItem id="chat" label="AI Chat" icon={Brain} active={currentView === 'chat'} />
          <NavItem id="image" label="AI Art" icon={Palette} active={currentView === 'image'} />
          <NavItem id="journal" label="Journal" icon={Feather} active={currentView === 'journal'} />
          <NavItem id="journal-library" label="Library" icon={Library} active={currentView === 'journal-library'} />
          <NavItem id="quick-relief" label="Relax" icon={Zap} active={currentView === 'quick-relief'} />
          <NavItem id="the-void" label="The Void" icon={ZapOff} active={currentView === 'the-void'} />
          
          <div className="my-4 border-t border-main pt-4">
            <NavItem id="my-data" label="My Data" icon={Database} active={currentView === 'my-data'} />
            <NavItem id="settings" label="Settings" icon={Settings} active={currentView === 'settings'} />
            <NavItem id="about" label="About" icon={Info} active={currentView === 'about'} />
            <button 
              onClick={onToggleTheme}
              className="w-full flex items-center gap-4 px-4 py-3 text-sub hover:text-main transition-all"
            >
              {currentTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span className="text-sm font-medium">Switch Mode</span>
            </button>
          </div>
        </nav>

        {user && (
          <div className="mt-auto p-4 bg-main rounded-2xl border border-main">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Crown size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{user.name}</p>
                <p className="text-[10px] text-sub uppercase">Member</p>
              </div>
            </div>
            <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-2 text-red-500 text-xs font-bold hover:bg-red-500/10 rounded-lg transition-all">
              <LogOut size={14} /> Log Out
            </button>
          </div>
        )}
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-sub/90 backdrop-blur-xl border-t border-main px-6 py-3 flex justify-between items-center z-[100]">
        <MobileIcon id="dashboard" icon={Home} active={currentView === 'dashboard'} onClick={onViewChange} />
        <MobileIcon id="chat" icon={Brain} active={currentView === 'chat'} onClick={onViewChange} />
        <MobileIcon id="image" icon={Palette} active={currentView === 'image'} onClick={onViewChange} />
        <MobileIcon id="journal" icon={Feather} active={currentView === 'journal'} onClick={onViewChange} />
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-sub">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            className="fixed inset-0 bg-sub z-[110] p-8 flex flex-col overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <Logo showText={true} />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-sub">
                <X size={28} />
              </button>
            </div>
            <nav className="space-y-4">
              <NavItem id="dashboard" label="Home" icon={Home} active={currentView === 'dashboard'} />
              <NavItem id="journal-library" label="Library" icon={Library} active={currentView === 'journal-library'} />
              <NavItem id="the-void" label="The Void" icon={ZapOff} active={currentView === 'the-void'} />
              <NavItem id="my-data" label="My Data" icon={Database} active={currentView === 'my-data'} />
              <NavItem id="settings" label="Settings" icon={Settings} active={currentView === 'settings'} />
              <NavItem id="about" label="About" icon={Info} active={currentView === 'about'} />
              <button 
                onClick={onToggleTheme}
                className="w-full flex items-center gap-4 px-4 py-4 bg-main rounded-2xl text-sub border border-main"
              >
                {currentTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                <span className="font-bold">Switch Theme</span>
              </button>
            </nav>
            {user && (
              <button onClick={onLogout} className="mt-auto w-full py-4 text-red-500 font-bold border border-red-500/20 rounded-2xl">
                Log Out
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const MobileIcon = ({ id, icon: Icon, active, onClick }: any) => (
  <button onClick={() => onClick(id)} className={`p-2 transition-all ${active ? 'text-indigo-500 scale-110' : 'text-sub'}`}>
    <Icon size={24} />
  </button>
);

export default Sidebar;