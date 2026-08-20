import React from 'react';

interface AuraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export const AuraLogo: React.FC<AuraLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'light',
}) => {
  // Dimensions
  const dimensions = {
    sm: { iconWidth: 30, iconHeight: 30, fontSizeMain: 'text-xs sm:text-sm', fontSizeSub: 'text-[7.5px]', hyphenWidth: 'w-2', gap: 'gap-0.5' },
    md: { iconWidth: 40, iconHeight: 40, fontSizeMain: 'text-sm sm:text-base font-extrabold', fontSizeSub: 'text-[8.5px]', hyphenWidth: 'w-2.5', gap: 'gap-0.5' },
    lg: { iconWidth: 54, iconHeight: 54, fontSizeMain: 'text-xl font-black', fontSizeSub: 'text-[10px]', hyphenWidth: 'w-3.5', gap: 'gap-1' },
    xl: { iconWidth: 76, iconHeight: 76, fontSizeMain: 'text-3xl font-black', fontSizeSub: 'text-xs', hyphenWidth: 'w-4', gap: 'gap-1.5' },
  }[size];

  const mainTextColor = variant === 'dark' ? 'text-white' : 'text-slate-900';
  const subTextColor = variant === 'dark' ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 shrink-0 select-none ${className}`}>
      {/* Aura Tech Brain Neural SVG Mark */}
      <svg
        width={dimensions.iconWidth}
        height={dimensions.iconHeight}
        viewBox="0 0 200 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs transition-transform hover:scale-105"
      >
        <defs>
          {/* Facet Gradients */}
          <linearGradient id="g-blue1" x1="10" y1="50" x2="60" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06B6D4" />
            <stop offset="1" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="g-blue2" x1="40" y1="10" x2="90" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" />
            <stop offset="1" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="g-purple1" x1="60" y1="10" x2="110" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#D946EF" />
          </linearGradient>
          <linearGradient id="g-magenta" x1="80" y1="30" x2="120" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EC4899" />
            <stop offset="1" stopColor="#F97316" />
          </linearGradient>
          <linearGradient id="g-orange" x1="90" y1="10" x2="130" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F97316" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* LEFT BRAIN: Low-Poly Faceted Triangles */}
        {/* Front-left cyan/blue lobe */}
        <polygon points="45,35 15,65 50,75" fill="url(#g-blue1)" opacity="0.95" />
        <polygon points="15,65 5,100 40,110" fill="#0284C7" />
        <polygon points="15,65 40,110 50,75" fill="#0369A1" />
        <polygon points="45,35 50,75 75,50" fill="url(#g-blue2)" />
        <polygon points="50,75 40,110 70,120" fill="#1D4ED8" />
        <polygon points="50,75 70,120 85,85" fill="#2563EB" />
        <polygon points="40,110 55,145 70,120" fill="#1E40AF" />
        <polygon points="70,120 55,145 90,140" fill="#3B82F6" />
        <polygon points="70,120 90,140 100,110" fill="#4F46E5" />

        {/* Mid-top purple & magenta facets */}
        <polygon points="45,35 75,50 70,15" fill="#38BDF8" />
        <polygon points="70,15 75,50 100,25" fill="url(#g-purple1)" />
        <polygon points="75,50 85,85 110,60" fill="#7C3AED" />
        <polygon points="75,50 110,60 100,25" fill="#A855F7" />
        <polygon points="100,25 110,60 125,35" fill="url(#g-magenta)" />

        {/* Right-most poly transition zone */}
        <polygon points="110,60 85,85 100,110" fill="#C026D3" />
        <polygon points="110,60 100,110 120,95" fill="#E11D48" />
        <polygon points="110,60 120,95 125,35" fill="url(#g-orange)" />
        <polygon points="125,35 120,95 135,70" fill="#F97316" opacity="0.9" />

        {/* RIGHT BRAIN: Interconnected Neural Network Nodes & Lines */}
        {/* Network connection lines */}
        <g stroke="#F97316" strokeWidth="1.8" opacity="0.85">
          <line x1="120" y1="95" x2="140" y2="120" />
          <line x1="120" y1="95" x2="145" y2="80" />
          <line x1="135" y1="70" x2="145" y2="80" />
          <line x1="125" y1="35" x2="145" y2="40" />
          <line x1="135" y1="70" x2="155" y2="55" />
          <line x1="145" y1="40" x2="155" y2="55" />
        </g>

        <g stroke="#EC4899" strokeWidth="1.8" opacity="0.85">
          <line x1="100" y1="110" x2="125" y2="135" />
          <line x1="120" y1="95" x2="125" y2="135" />
          <line x1="140" y1="120" x2="155" y2="100" />
          <line x1="145" y1="80" x2="155" y2="100" />
          <line x1="155" y1="55" x2="165" y2="75" />
          <line x1="155" y1="100" x2="165" y2="75" />
        </g>

        <g stroke="#8B5CF6" strokeWidth="1.8" opacity="0.85">
          <line x1="125" y1="135" x2="145" y2="150" />
          <line x1="140" y1="120" x2="145" y2="150" />
          <line x1="155" y1="100" x2="170" y2="115" />
          <line x1="165" y1="75" x2="180" y2="85" />
          <line x1="165" y1="75" x2="175" y2="50" />
        </g>

        <g stroke="#06B6D4" strokeWidth="1.8" opacity="0.85">
          <line x1="145" y1="150" x2="160" y2="160" />
          <line x1="170" y1="115" x2="180" y2="130" />
          <line x1="180" y1="85" x2="190" y2="95" />
        </g>

        {/* Neural Dots / Nodes */}
        <circle cx="125" cy="35" r="3.5" fill="#F97316" />
        <circle cx="135" cy="70" r="3.5" fill="#F97316" />
        <circle cx="145" cy="40" r="4" fill="#F59E0B" />
        <circle cx="155" cy="55" r="3" fill="#EC4899" />
        <circle cx="145" cy="80" r="4" fill="#EC4899" />
        <circle cx="140" cy="120" r="3.5" fill="#E11D48" />
        <circle cx="125" cy="135" r="3.5" fill="#8B5CF6" />
        <circle cx="155" cy="100" r="4" fill="#A855F7" />
        <circle cx="165" cy="75" r="3.5" fill="#EC4899" />
        <circle cx="175" cy="50" r="3" fill="#F43F5E" />
        <circle cx="145" cy="150" r="3.5" fill="#3B82F6" />
        <circle cx="170" cy="115" r="3.5" fill="#8B5CF6" />
        <circle cx="180" cy="85" r="3" fill="#D946EF" />
        <circle cx="160" cy="160" r="3" fill="#06B6D4" />
        <circle cx="180" cy="130" r="2.5" fill="#0ea5e9" />
        <circle cx="190" cy="95" r="2.5" fill="#38bdf8" />
      </svg>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col justify-center items-center text-center select-none">
          {/* Row 1: AURA TECH (kept as is) */}
          <div className="flex items-center justify-center w-full leading-none">
            <span className={`font-black tracking-tight ${dimensions.fontSizeMain} ${mainTextColor}`}>
              AURA <span className="text-cyan-600 dark:text-cyan-400">TECH</span>
            </span>
          </div>

          {/* Row 2: RECRUITMENT (centered under AURA TECH) */}
          <div className="flex items-center justify-center w-full mt-0.5 leading-none">
            <span className={`font-bold tracking-widest uppercase ${dimensions.fontSizeSub} ${subTextColor}`}>
              RECRUITMENT
            </span>
          </div>

          {/* Row 3: FLOW AI (centered underneath RECRUITMENT with coloured hyphens on the sides) */}
          <div className="flex items-center justify-center gap-1.5 mt-0.5 leading-none">
            <span className={`h-[1.5px] ${dimensions.hyphenWidth} bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full shrink-0`} />
            <span className={`font-bold tracking-widest uppercase ${dimensions.fontSizeSub} ${subTextColor}`}>
              FLOW AI
            </span>
            <span className={`h-[1.5px] ${dimensions.hyphenWidth} bg-gradient-to-r from-purple-500 to-amber-500 rounded-full shrink-0`} />
          </div>
        </div>
      )}
    </div>
  );
};
