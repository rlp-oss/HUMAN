import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
}

export const HumanLogo: React.FC<LogoProps> = ({ size = 'md', showText = true, animated = false }) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-base' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 54, text: 'text-2xl' },
    xl: { icon: 72, text: 'text-3xl' },
  };

  const current = sizeMap[size];

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative flex items-center justify-center ${animated ? 'animate-pulse' : ''}`}>
        {/* Ambient Soft Glow in Natural Warm Olive */}
        <div 
          className="absolute inset-0 rounded-full blur-md opacity-40 bg-[#5A5A40]/30"
          style={{ width: current.icon, height: current.icon }}
        />
        
        {/* SVG Fingerprint Network Logo in Natural Tones */}
        <svg 
          width={current.icon} 
          height={current.icon} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-300 hover:scale-105"
        >
          {/* Outer Network Hexagon Nodes in Olive */}
          <polygon 
            points="50,8 86,28 86,72 50,92 14,72 14,28" 
            stroke="#5A5A40" 
            strokeWidth="2.5" 
            strokeDasharray="4 4"
            className="opacity-60"
          />
          
          {/* Node Connection Points in Terracotta */}
          <circle cx="50" cy="8" r="4.5" fill="#D67D5C" />
          <circle cx="86" cy="28" r="4.5" fill="#D67D5C" />
          <circle cx="86" cy="72" r="4.5" fill="#D67D5C" />
          <circle cx="50" cy="92" r="4.5" fill="#D67D5C" />
          <circle cx="14" cy="72" r="4.5" fill="#D67D5C" />
          <circle cx="14" cy="28" r="4.5" fill="#D67D5C" />

          {/* Fingerprint Arcs in Warm Olive and Terracotta */}
          <path d="M50 30 C38 30 30 38 30 50 C30 62 38 70 50 70" stroke="#5A5A40" strokeWidth="2.8" strokeLinecap="round" opacity="0.85" />
          <path d="M50 36 C42 36 36 42 36 50 C36 58 42 64 50 64" stroke="#D67D5C" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M50 42 C45 42 42 45 42 50 C42 54 45 58 50 58" stroke="#8C857B" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M50 48 A2 2 0 1 1 50 52 A2 2 0 0 1 50 48" fill="#5A5A40" />
          <path d="M50 30 C62 30 70 38 70 50 C70 58 65 64 58 67" stroke="#5A5A40" strokeWidth="2.8" strokeLinecap="round" opacity="0.85" />
          <path d="M50 36 C58 36 64 42 64 50" stroke="#D67D5C" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-black tracking-widest text-[#2D2926]">
            <span className={`${current.text} font-bold text-[#2D2926]`}>
              H.U.M.A.N.
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-wider uppercase text-[#6A655C] -mt-0.5">
            Ethical AI • Micro-Royalties
          </span>
        </div>
      )}
    </div>
  );
};

