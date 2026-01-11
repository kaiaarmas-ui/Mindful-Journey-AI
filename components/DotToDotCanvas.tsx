
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface DotToDotCanvasProps {
  patternType: string;
  onComplete: () => void;
}

const PATTERNS: Record<string, Point[]> = {
  'Star': [
    { x: 50, y: 10 }, { x: 61, y: 35 }, { x: 88, y: 35 }, { x: 66, y: 52 }, 
    { x: 75, y: 78 }, { x: 50, y: 62 }, { x: 25, y: 78 }, { x: 34, y: 52 }, 
    { x: 12, y: 35 }, { x: 39, y: 35 }, { x: 50, y: 10 }
  ],
  'Mountain': [
    { x: 10, y: 80 }, { x: 30, y: 40 }, { x: 40, y: 55 }, { x: 55, y: 20 }, 
    { x: 70, y: 50 }, { x: 80, y: 35 }, { x: 95, y: 80 }, { x: 10, y: 80 }
  ],
  'Tree': [
    { x: 45, y: 90 }, { x: 55, y: 90 }, { x: 55, y: 70 }, { x: 75, y: 75 }, 
    { x: 85, y: 60 }, { x: 70, y: 50 }, { x: 90, y: 40 }, { x: 75, y: 25 }, 
    { x: 60, y: 35 }, { x: 50, y: 10 }, { x: 40, y: 35 }, { x: 25, y: 25 }, 
    { x: 10, y: 40 }, { x: 30, y: 50 }, { x: 15, y: 60 }, { x: 25, y: 75 }, 
    { x: 45, y: 70 }, { x: 45, y: 90 }
  ]
};

const DotToDotCanvas: React.FC<DotToDotCanvasProps> = ({ patternType, onComplete }) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [nextIdx, setNextIdx] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rawPattern = PATTERNS[patternType] || PATTERNS['Mountain'];
    setPoints(rawPattern);
    setNextIdx(0);
    setIsFinished(false);
  }, [patternType]);

  const handlePointClick = (idx: number) => {
    if (idx === nextIdx) {
      const newIdx = nextIdx + 1;
      setNextIdx(newIdx);
      if (newIdx === points.length) {
        setIsFinished(true);
        onComplete();
      }
    }
  };

  const handleReset = () => {
    setNextIdx(0);
    setIsFinished(false);
  };

  return (
    <div className="relative w-full aspect-square max-w-2xl mx-auto bg-slate-950/40 rounded-[60px] border border-slate-800/60 overflow-hidden shadow-2xl group">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 p-12">
        {/* Connection Lines */}
        {nextIdx > 0 && (
          <polyline
            points={points.slice(0, nextIdx).map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="text-indigo-500/60 transition-all duration-500"
          />
        )}
        
        {/* The Pattern Nodes */}
        {points.map((p, i) => {
          const isConnected = i < nextIdx;
          const isNext = i === nextIdx;
          
          return (
            <g key={i} className="cursor-pointer select-none" onClick={() => handlePointClick(i)}>
              {isNext && (
                <circle cx={p.x} cy={p.y} r="4" className="fill-indigo-500/20 animate-ping" />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={isNext ? "2.5" : "1.8"}
                className={`transition-all duration-300 ${
                  isConnected 
                    ? 'fill-indigo-500 stroke-indigo-400/30' 
                    : isNext 
                      ? 'fill-white stroke-indigo-500' 
                      : 'fill-slate-800 stroke-slate-700'
                }`}
                strokeWidth="0.5"
              />
              <text
                x={p.x}
                y={p.y - 4}
                className={`text-[3px] font-black pointer-events-none transition-opacity duration-300 ${
                  isConnected ? 'opacity-0' : 'opacity-40 fill-slate-500'
                }`}
                textAnchor="middle"
              >
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* Finished Illustration Glow */}
        <AnimatePresence>
          {isFinished && (
            <motion.polyline
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              points={points.map(p => `${p.x},${p.y}`).join(' ')}
              fill="rgba(99, 102, 241, 0.05)"
              stroke="#818cf8"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
            />
          )}
        </AnimatePresence>
      </svg>

      {/* Interface Overlay */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-20">
        <button 
          onClick={handleReset}
          className="p-3 rounded-full bg-slate-900/80 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700 transition-all"
        >
          <RotateCcw size={18} />
        </button>
        {isFinished && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-6 py-2.5 rounded-full bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-indigo-500/20"
          >
            <Sparkles size={14} /> Pattern Synthesized
          </motion.div>
        )}
      </div>

      <div className="absolute top-8 left-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Sequential Focus Ritual</p>
      </div>
    </div>
  );
};

export default DotToDotCanvas;
