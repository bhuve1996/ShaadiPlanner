import React from 'react';

interface WeddingLogoProps {
  className?: string;
  size?: number;
}

export function WeddingLogo({ className = "w-9 h-9", size = 36 }: WeddingLogoProps) {
  return (
    <svg 
      viewBox="0 0 64 64" 
      width={size} 
      height={size} 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="logoRose" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDA4AF" />
          <stop offset="50%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Frame base */}
      <rect width="64" height="64" rx="16" fill="url(#logoBg)" />
      <rect width="62" height="62" x="1" y="1" rx="15" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />

      {/* Interlocking Rings and Solitaire Motif */}
      <g filter="url(#logoGlow)" transform="translate(0, 1)">
        {/* Left ring - Bhuvi Gold */}
        <circle cx="27" cy="34" r="13" stroke="url(#logoGold)" strokeWidth="3.2" strokeLinecap="round" />
        {/* Right ring - Harshu Rose */}
        <circle cx="37" cy="34" r="13" stroke="url(#logoRose)" strokeWidth="3.2" strokeLinecap="round" />
        {/* Intertwined overlap */}
        <path d="M 27 21 A 13 13 0 0 1 37 21" stroke="url(#logoRose)" strokeWidth="3.2" strokeLinecap="round" />
        
        {/* Solitaire Diamond at union */}
        <g transform="translate(32, 17.5)">
          <path d="M 0 -6.5 L 4 0 L 0 6.5 L -4 0 Z" fill="#FFFFFF" />
          <polygon points="-4,0 4,0 2.8,-3.8 -2.8,-3.8" fill="#F1F5F9" opacity="0.9" />
          <polygon points="-2.8,-3.8 2.8,-3.8 0,-6.5" fill="#E2E8F0" />
          <circle cx="0" cy="0" r="1.3" fill="#38BDF8" />
        </g>
      </g>
    </svg>
  );
}
