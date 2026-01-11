
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Clock, 
  Plus, 
  ArrowLeft, 
  Calendar,
  Sparkles,
  Trash2,
  X,
  Check,
  RotateCcw
} from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  time: string;
  recurrence: 'daily' | 'weekly';
  active: boolean;
}

interface RemindersViewProps {
  onBack?: () => void;
}

const RemindersView: React.FC<RemindersViewProps> = ({ onBack }) => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('mindful_reminders');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Morning Intention', time: '08:00', recurrence: 'daily', active: true },
      { id: '2', title: 'Evening Wind-down', time: '21:00', recurrence: 'daily', active: true }
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newRecurrence, setNewRecurrence] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    localStorage.setItem('mindful_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newTitle,
      time: newTime,
      recurrence: newRecurrence,
      active: true
    };

    setReminders(prev => [...prev, reminder]);
    setIsAdding(false);
    setNewTitle('');
    setNewTime('08:00');
    setNewRecurrence('daily');
  };

  const formatDisplayTime = (time24: string) => {
    const [hours, mins] = time24.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${mins} ${ampm}`;
  };

  return (
    <div className="h-full bg-[#0f172a] text-slate-300 flex flex-col overflow-hidden selection:bg-indigo-500/30">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2.5 hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-white border border-slate-800/50"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bell size={18} className="text-indigo-400" />
            Reminders
          </h2>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all shadow-lg active:scale-95"
        >
          <Plus size={16} />
          <span>New</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <header className="space-y-4">
            <h1 className="text-3xl font-bold text-white">Your Sanctuary Schedule</h1>
            <p className="text-slate-500 font-medium">Gentle nudges to return to presence throughout your day.</p>
          </header>

          {/* Reminders List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {reminders.map((reminder) => (
                <motion.div 
                  key={reminder.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`p-6 rounded-[32px] border-2 transition-all relative group overflow-hidden ${
                    reminder.active 
                      ? 'bg-slate-900/40 border-indigo-500/30' 
                      : 'bg-slate-950/40 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                          reminder.recurrence === 'daily' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-sky-400 border-sky-500/20 bg-sky-500/5'
                        }`}>
                          {reminder.recurrence}
                        </span>
                      </div>
                      <span className={`text-3xl font-bold tabular-nums ${reminder.active ? 'text-white' : 'text-slate-600'}`}>
                        {formatDisplayTime(reminder.time)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        onClick={() => toggleReminder(reminder.id)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${reminder.active ? 'bg-indigo-600' : 'bg-slate-800'}`}
                      >
                        <motion.div 
                          animate={{ x: reminder.active ? 24 : 0 }}
                          className="w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>
                  </div>
                  
                  <p className={`font-bold text-[15px] leading-tight ${reminder.active ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {reminder.title}
                  </p>

                  <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                    <Bell size={120} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {reminders.length === 0 && (
              <div className="col-span-full py-20 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[40px] flex flex-col items-center justify-center space-y-4">
                <Bell size={48} className="text-slate-700" />
                <div className="text-center">
                  <p className="text-slate-500 font-bold">No reminders set</p>
                  <p className="text-slate-600 text-xs">Tap "New" to create your first nudge.</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#b0cc8a]/5 border border-[#b0cc8a]/20 p-8 rounded-[40px] flex items-center gap-6">
            <div className="w-14 h-14 bg-[#b0cc8a]/10 rounded-2xl flex items-center justify-center text-[#b0cc8a] flex-shrink-0">
               <Sparkles size={28} />
            </div>
            <div>
               <h4 className="text-white font-bold mb-1">Consistency is Mastery</h4>
               <p className="text-sm text-slate-400 font-medium leading-relaxed">
                 Small, repeated moments of presence yield more neurological benefits than infrequent deep sessions. Set a rhythm that respects your spirit.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[48px] p-10 shadow-3xl space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white tracking-tight">Add Reminder</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4">Focus Area</label>
                  <input 
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g., Afternoon Box Breathing"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4">Time</label>
                    <input 
                      type="time"
                      required
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4">Recurrence</label>
                    <select 
                      value={newRecurrence}
                      onChange={(e) => setNewRecurrence(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Schedule nudge
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RemindersView;
