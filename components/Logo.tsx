
import React from 'react';

interface LogoProps {
  size?: number;
  mdSize?: number;
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 32, mdSize, showText = false, className = "" }) => {
  const currentSize = (mdSize && typeof window !== 'undefined' && window.innerWidth >= 768) ? mdSize : size;

  return (
    <div className={`flex items-center gap-2.5 md:gap-3 ${className}`}>
      <div 
        className="relative flex items-center justify-center flex-shrink-0"
        style={{ width: currentSize, height: currentSize }}
      >
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-indigo-500/30 blur-xl rounded-full animate-pulse" />
        
        {/* Main Logo SVG */}
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 w-full h-full drop-shadow-2xl"
        >
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <filter id="inner-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Enso Ring */}
          <path 
            d="M85 50C85 69.33 69.33 85 50 85C30.67 85 15 69.33 15 50C15 30.67 30.67 15 50 15C58.4 15 66.1 17.9 72.2 22.8" 
            stroke="url(#logo-gradient)" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeDasharray="200"
            className="opacity-40"
          />

          {/* Neural Lotus */}
          <path 
            d="M50 25L70 75H30L50 25Z" 
            fill="url(#logo-gradient)" 
            className="opacity-20"
          />
          
          <path 
            d="M50 30C50 30 75 55 75 70C75 85 50 85 50 85C50 85 25 85 25 70C25 55 50 30 50 30Z" 
            fill="url(#logo-gradient)"
          />

          {/* Core Spark */}
          <circle cx="50" cy="65" r="4" fill="white" className="animate-pulse">
            <animate 
              attributeName="r" 
              values="3.5;4.5;3.5" 
              dur="3s" 
              repeatCount="indefinite" 
            />
          </circle>
          
          <path 
            d="M50 85V45" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            className="opacity-30"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col -space-y-0.5 md:-space-y-1">
          <h1 className="text-[16px] md:text-[20px] font-bold text-white tracking-tighter leading-none">Mindful</h1>
          <p className="text-[9px] md:text-[12px] text-slate-500 font-bold uppercase tracking-[0.15em] mt-0.5">JOURNEY</p>
        </div>
      )}
    </div>
  );
};

export default Logo;
