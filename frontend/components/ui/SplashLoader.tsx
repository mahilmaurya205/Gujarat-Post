'use client';

import { useEffect, useState } from 'react';

export default function SplashLoader() {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('gp_splash_seen');
    if (!seen) {
      setVisible(true);
      sessionStorage.setItem('gp_splash_seen', '1');

      const fadeTimer = setTimeout(() => setHiding(true), 2600);
      const removeTimer = setTimeout(() => setVisible(false), 3350);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black select-none transition-opacity duration-700 ${hiding ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      aria-hidden="true"
    >
      {/* Background radial red glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="splash-bg-glow" />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-5 z-10">

        {/* Sound wave rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="splash-ring splash-ring-1" />
          <span className="splash-ring splash-ring-2" />
          <span className="splash-ring splash-ring-3" />
        </div>

        {/* 3D Mic */}
        <div className="splash-mic-wrap">
          <svg viewBox="0 0 80 120" className="splash-mic-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mgBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e63946" />
                <stop offset="50%" stopColor="#c1121f" />
                <stop offset="100%" stopColor="#780000" />
              </linearGradient>
              <linearGradient id="mgShine" x1="0%" y1="0%" x2="60%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.38)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <linearGradient id="mgStand" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#555" />
                <stop offset="50%" stopColor="#aaa" />
                <stop offset="100%" stopColor="#444" />
              </linearGradient>
              <filter id="mgShadow">
                <feDropShadow dx="0" dy="6" stdDeviation="9" floodColor="#B3121B" floodOpacity="0.55" />
              </filter>
            </defs>

            {/* Body */}
            <rect x="22" y="8" width="36" height="58" rx="18" fill="url(#mgBody)" filter="url(#mgShadow)" />
            {/* Shine */}
            <rect x="22" y="8" width="36" height="58" rx="18" fill="url(#mgShine)" />
            {/* Grille lines */}
            {[26, 32, 38, 44, 50, 56].map((y) => (
              <line key={y} x1="28" y1={y} x2="52" y2={y} stroke="rgba(0,0,0,0.22)" strokeWidth="1.2" />
            ))}

            {/* Neck */}
            <rect x="37" y="66" width="6" height="20" rx="3" fill="url(#mgStand)" />
            {/* Arm */}
            <rect x="18" y="83" width="44" height="7" rx="3.5" fill="url(#mgStand)" />
            {/* Feet */}
            <ellipse cx="26" cy="99" rx="10" ry="4.5" fill="#333" />
            <ellipse cx="54" cy="99" rx="10" ry="4.5" fill="#333" />
          </svg>
        </div>

        {/* Brand text */}
        <div className="flex flex-col items-center gap-1 mt-1">
          <p className="text-white font-black text-[24px] tracking-[0.2em] uppercase leading-none" style={{ fontFamily: 'sans-serif' }}>
            GUJARAT POST
          </p>
          <p className="text-red-500 font-semibold text-[11px] tracking-[0.3em] uppercase">
            Real Stories. Real Gujarat.
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="splash-dot"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .splash-bg-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 46%, rgba(179,18,27,0.25) 0%, transparent 65%);
          animation: spl-glow 1.9s ease-in-out infinite alternate;
        }
        @keyframes spl-glow {
          from { opacity: 0.5; transform: scale(1); }
          to   { opacity: 1;   transform: scale(1.2); }
        }

        .splash-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(200, 20, 30, 0.55);
          animation: spl-ring 2.2s ease-out infinite;
        }
        .splash-ring-1 { width: 130px; height: 130px; animation-delay: 0s; }
        .splash-ring-2 { width: 200px; height: 200px; animation-delay: 0.45s; }
        .splash-ring-3 { width: 280px; height: 280px; animation-delay: 0.9s; }
        @keyframes spl-ring {
          0%   { transform: scale(0.55); opacity: 0.9; }
          100% { transform: scale(1.45); opacity: 0; }
        }

        .splash-mic-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: spl-mic 3s ease-in-out infinite;
          filter: drop-shadow(0 14px 30px rgba(179,18,27,0.55));
        }
        .splash-mic-svg {
          width: 108px;
          height: 162px;
        }
        @keyframes spl-mic {
          0%   { transform: perspective(500px) rotateY(-14deg) translateY(0px); }
          50%  { transform: perspective(500px) rotateY(14deg)  translateY(-10px); }
          100% { transform: perspective(500px) rotateY(-14deg) translateY(0px); }
        }

        .splash-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #B3121B;
          animation: spl-dot 0.85s ease-in-out infinite alternate;
        }
        @keyframes spl-dot {
          from { opacity: 0.25; transform: scale(0.65); }
          to   { opacity: 1;    transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
