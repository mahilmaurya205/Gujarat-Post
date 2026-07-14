'use client';
import { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      setVisible(window.scrollY > 150);
    };
    // Check immediately in case user reloads while scrolled
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!mounted) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="ઉપર જાઓ"
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 99999,
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: '#e11d2e',
        color: '#ffffff',
        border: '2px solid rgba(255,255,255,0.25)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(225,29,46,0.55), 0 2px 8px rgba(0,0,0,0.3)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.8)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        outline: 'none',
      }}
    >
      {/* Chevron Up arrow */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
