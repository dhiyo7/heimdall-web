import React from 'react';

export const RetroComputer: React.FC = () => {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-auto max-w-md mx-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Monitor Outer Shell */}
      <rect x="40" y="20" width="120" height="90" rx="10" fill="white" stroke="black" strokeWidth="3" />
      {/* Monitor Inner Bezel */}
      <rect x="50" y="30" width="100" height="70" rx="5" fill="black" />
      
      {/* Screen */}
      <rect x="55" y="35" width="90" height="60" rx="2" fill="white" />
      
      {/* Eye (Heimdall) */}
      <circle cx="100" cy="65" r="15" fill="black" />
      <circle cx="100" cy="65" r="5" fill="white" />
      <path d="M 80 50 Q 100 30 120 50" stroke="black" strokeWidth="3" fill="none" />
      
      {/* Stand Neck */}
      <rect x="85" y="110" width="30" height="15" fill="white" stroke="black" strokeWidth="3" />
      
      {/* Base */}
      <path d="M 60 125 L 140 125 L 150 135 L 50 135 Z" fill="white" stroke="black" strokeWidth="3" />
      
      {/* Keyboard (Abstract) */}
      <rect x="30" y="140" width="140" height="15" rx="2" fill="white" stroke="black" strokeWidth="3" />
      
      {/* Decorative Squiggles/floaters */}
      <circle cx="30" cy="30" r="3" fill="none" stroke="black" strokeWidth="2" />
      <circle cx="170" cy="100" r="3" fill="none" stroke="black" strokeWidth="2" />
      <path d="M 165 25 L 175 35 M 175 25 L 165 35" stroke="black" strokeWidth="2" />
    </svg>
  );
};