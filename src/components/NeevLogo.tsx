import React from 'react';

interface NeevLogoProps {
  className?: string;
  variant?: 'light' | 'dark'; // 'light' means light text for dark backgrounds, 'dark' means dark text for light backgrounds
  showTagline?: boolean;
}

export function NeevLogo({
  className = '',
  variant = 'light',
  showTagline = true,
}: NeevLogoProps) {
  const isLightText = variant === 'light';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Clean, elegant building-inspired architectural emblem */}
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#102A43] to-[#1E3A5F] border border-[#2698E8]/40 flex items-center justify-center p-2 shadow-sm shrink-0 overflow-hidden group">
        {/* Subtle geometric foundation & building skyline lines */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Left Tower */}
          <rect
            x="4"
            y="13"
            width="6"
            height="15"
            rx="1"
            className="fill-[#2698E8]"
          />
          {/* Center Tall Tower with spire/crest */}
          <rect
            x="13"
            y="6"
            width="6"
            height="22"
            rx="1"
            className="fill-[#DFF1FF]"
          />
          {/* Right Tower */}
          <rect
            x="22"
            y="10"
            width="6"
            height="18"
            rx="1"
            className="fill-[#2698E8]/80"
          />
          {/* Ground Foundation Bar (Neev) */}
          <rect
            x="2"
            y="28"
            width="28"
            height="2.5"
            rx="1"
            className="fill-[#2698E8]"
          />
          {/* Roof Angular Silhouette (Architectural Gable / Ascending Apex) */}
          <path
            d="M 13 6 L 16 2 L 19 6 Z"
            className="fill-[#2698E8]"
          />
          {/* Tower Window Lines */}
          <line x1="15" y1="9" x2="17" y2="9" stroke="#102A43" strokeWidth="1" strokeLinecap="round" />
          <line x1="15" y1="13" x2="17" y2="13" stroke="#102A43" strokeWidth="1" strokeLinecap="round" />
          <line x1="15" y1="17" x2="17" y2="17" stroke="#102A43" strokeWidth="1" strokeLinecap="round" />
          <line x1="15" y1="21" x2="17" y2="21" stroke="#102A43" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`text-lg sm:text-xl font-extrabold tracking-tight whitespace-nowrap ${
              isLightText ? 'text-white' : 'text-[#102A43]'
            }`}
          >
            NEEV REALTY GROUP
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[10px] sm:text-[11px] font-medium tracking-wider whitespace-nowrap mt-0.5 ${
              isLightText ? 'text-[#DFF1FF]/90' : 'text-[#627D98]'
            }`}
          >
            Find Your Space. Build Your Future.
          </span>
        )}
      </div>
    </div>
  );
}
