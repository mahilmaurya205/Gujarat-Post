'use client';

import { useEffect, useState } from 'react';

export default function SplashLoader() {
  const [visible, setVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Only show splash once per browser session
    const hasSeenSplash = sessionStorage.getItem('gp-has-seen-splash');
    if (hasSeenSplash === 'true') {
      setShouldRender(false);
      return;
    }

    const fadeTimer = setTimeout(() => {
      setVisible(false);
    }, 3000); // Wait exactly 3 seconds, then trigger fade out

    const destroyTimer = setTimeout(() => {
      setShouldRender(false);
      sessionStorage.setItem('gp-has-seen-splash', 'true');
    }, 3400); // Fully unmount after 3.4s (400ms transition time)

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(destroyTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050B14] transition-opacity duration-500 ease-in-out select-none ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <style>{`
        .perspective-container {
          perspective: 1000px;
          perspective-origin: center;
        }
        @keyframes float-3d {
          0%, 100% {
            transform: translateY(0px) rotateY(-14deg) rotateX(6deg) rotateZ(-1deg);
          }
          50% {
            transform: translateY(-15px) rotateY(14deg) rotateX(-6deg) rotateZ(1deg);
          }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.9; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes march {
          to { stroke-dashoffset: -36; }
        }
        @keyframes rotate-3d {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-float-3d {
          animation: float-3d 3.5s ease-in-out infinite;
          transform-style: preserve-3d;
        }
        .animate-pulse-slow {
          animation: glow 2s ease-in-out infinite;
        }
        .animate-ripple-1 {
          animation: ripple 2.2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
          transform-origin: 100px 98px;
        }
        .animate-ripple-2 {
          animation: ripple 2.2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
          animation-delay: 1.1s;
          transform-origin: 100px 98px;
        }
        .animate-sweep {
          animation: sweep 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-march-forward {
          animation: march 3s linear infinite;
        }
        .animate-march-backward {
          animation: march 3s linear infinite reverse;
        }
        .animate-rotate-orbit {
          animation: rotate-3d 14s linear infinite;
          transform-origin: 100px 98px;
        }
      `}</style>

      {/* 3D Perspective Animation Container */}
      <div className="perspective-container relative mb-6 flex items-center justify-center h-44 w-44">
        {/* Background Glow (remains 2D flat behind) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="h-44 w-44" viewBox="0 0 200 200" fill="none">
            <defs>
              <radialGradient id="glow-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#e62117" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#e62117" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="98" r="65" fill="url(#glow-grad)" className="animate-pulse-slow" />
            <circle cx="100" cy="98" r="70" stroke="#e62117" strokeWidth="2" strokeDasharray="4 8" className="animate-ripple-1" />
            <circle cx="100" cy="98" r="85" stroke="#e62117" strokeWidth="1.5" strokeDasharray="6 12" className="animate-ripple-2" />
          </svg>
        </div>

        {/* Orbiting rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-rotate-orbit">
          <svg className="h-44 w-44" viewBox="0 0 200 200" fill="none">
            <ellipse
              cx="100"
              cy="98"
              rx="88"
              ry="26"
              stroke="#e62117"
              strokeWidth="2.5"
              strokeDasharray="12 24"
              fill="none"
              className="animate-march-forward"
              style={{ filter: 'drop-shadow(0 0 6px #e62117)' }}
            />
            <ellipse
              cx="100"
              cy="98"
              rx="78"
              ry="20"
              stroke="#ffffff"
              strokeWidth="1"
              strokeDasharray="6 18"
              fill="none"
              className="animate-march-backward"
              style={{ filter: 'drop-shadow(0 0 2px #ffffff)', opacity: 0.65 }}
            />
          </svg>
        </div>

        {/* Floating Branded 3D News Mic with Perspective Rotation */}
        <div className="animate-float-3d">
          <svg
            className="h-36 w-36"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Spherical gradient for head */}
              <radialGradient id="grill-grad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#d1d5db" />
                <stop offset="85%" stopColor="#4b5563" />
                <stop offset="100%" stopColor="#1f2937" />
              </radialGradient>

              {/* Cylindrical metal gradient */}
              <linearGradient id="metal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f3f4f6" />
                <stop offset="20%" stopColor="#e5e7eb" />
                <stop offset="50%" stopColor="#9ca3af" />
                <stop offset="80%" stopColor="#4b5563" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>

              {/* Cylindrical handle gradient */}
              <linearGradient id="handle-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="25%" stopColor="#475569" />
                <stop offset="50%" stopColor="#334155" />
                <stop offset="85%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              {/* Left face cube gradient */}
              <linearGradient id="body-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9c0e15" />
                <stop offset="35%" stopColor="#e62117" />
                <stop offset="70%" stopColor="#9c0e15" />
                <stop offset="100%" stopColor="#70090e" />
              </linearGradient>

              {/* Right face cube gradient */}
              <linearGradient id="silver-flag-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#f3f4f6" />
                <stop offset="100%" stopColor="#9ca3af" />
              </linearGradient>

              <filter id="shadow-mic" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="10" stdDeviation="6" floodColor="#000000" floodOpacity="0.7" />
              </filter>
            </defs>

            {/* Stand / Handle (rendered with shadow) */}
            <g filter="url(#shadow-mic)">
              {/* Collar Connector */}
              <rect x="94" y="69" width="12" height="12" fill="url(#metal-grad)" rx="1" />
              <line x1="94" y1="75" x2="106" y2="75" stroke="#111827" strokeWidth="1" />

              {/* Mic Handle */}
              <path d="M 91,124 L 95,178 L 105,178 L 109,124 Z" fill="url(#handle-grad)" />
              {/* Handle details / grip rings */}
              <rect x="93" y="145" width="14" height="2" fill="#0f172a" />
              <rect x="94" y="165" width="12" height="3" fill="#0f172a" />
              <rect x="95" y="178" width="10" height="7" fill="url(#metal-grad)" rx="1" />

              {/* Branded 3D News Mic Flag Cube */}
              {/* Left Face (Red Gradient - "GUJARAT") */}
              <polygon points="62,80 100,89 100,126 62,115" fill="url(#body-grad)" stroke="#600509" strokeWidth="0.5" />
              
              {/* Right Face (White/Silver Gradient - "POST") */}
              <polygon points="100,89 138,80 138,115 100,126" fill="url(#silver-flag-grad)" stroke="#6b7280" strokeWidth="0.5" />
              
              {/* Top Face (Dark Maroon Perspective Top) */}
              <polygon points="62,80 100,74 138,80 100,89" fill="#400305" />

              {/* 3D Bevel Highlight Lines */}
              <line x1="100" y1="89" x2="100" y2="126" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.4" />
              <polyline points="62,80 100,89 138,80" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.25" fill="none" />

              {/* Perspective Texts */}
              {/* "GUJARAT" on Left Face */}
              <text
                x="81"
                y="105.5"
                fill="#ffffff"
                fontWeight="900"
                fontSize="8"
                letterSpacing="0.05em"
                textAnchor="middle"
                style={{ fontFamily: "'Hind Vadodara', sans-serif" }}
                transform="skewY(13.2) scale(0.92, 1)"
              >
                GUJARAT
              </text>

              {/* "POST" on Right Face */}
              <text
                x="119"
                y="105.5"
                fill="#050B14"
                fontWeight="900"
                fontSize="10"
                letterSpacing="0.05em"
                textAnchor="middle"
                style={{ fontFamily: "'Hind Vadodara', sans-serif" }}
                transform="skewY(-13.2) scale(0.92, 1)"
              >
                POST
              </text>

              {/* Mic Head (Grill Sphere) */}
              {/* Dark base shadow */}
              <circle cx="100" cy="45" r="24" fill="#1e293b" />
              {/* Metallic spherical gradient head */}
              <circle cx="100" cy="45" r="24" fill="url(#grill-grad)" stroke="url(#metal-grad)" strokeWidth="2.5" />
              {/* Grill mesh texture details */}
              <path
                d="M 78,45 Q 100,56 122,45 M 80,36 Q 100,47 120,36 M 80,54 Q 100,65 120,54 M 100,21 V 69 M 87,24 Q 94,45 100,69 M 113,24 Q 106,45 100,69"
                stroke="#374151"
                strokeWidth="1.2"
                strokeOpacity="0.45"
                fill="none"
              />
              {/* Chrome horizontal collar ring */}
              <rect x="75.5" y="42" width="49" height="5" rx="1.2" fill="url(#metal-grad)" stroke="#374151" strokeWidth="0.5" />
              <rect x="75.5" y="44" width="49" height="1.2" fill="#ffffff" fillOpacity="0.5" />
              
              {/* Sphere Highlight shine overlay */}
              <circle cx="91" cy="35" r="9" fill="#ffffff" fillOpacity="0.25" style={{ filter: 'blur(2.5px)' }} />
            </g>
          </svg>
        </div>
      </div>

      {/* Brand Header */}
      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase leading-none" style={{ fontFamily: "'Hind Vadodara', sans-serif" }}>
        Gujarat <span className="text-[#e62117]">Post</span>
      </h1>

      {/* Brand Slogan */}
      <p className="mt-2 text-xs sm:text-sm font-extrabold text-[#a3a3a3] uppercase tracking-widest leading-none select-none">
        Real Stories. <span className="text-[#e62117]">Real Gujarat.</span>
      </p>

      {/* Modern Sweep Loader Bar */}
      <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-24 bg-gradient-to-r from-transparent via-[#e62117] to-transparent animate-sweep" />
      </div>
    </div>
  );
}
