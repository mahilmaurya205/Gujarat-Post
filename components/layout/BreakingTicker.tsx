'use client';

import Link from 'next/link';
import { Pause, Play } from 'lucide-react';
import { useState } from 'react';
import { BREAKING_TICKER } from '@/data';

export default function BreakingTicker() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="flex h-10 items-center overflow-hidden bg-accent text-white">
      <div className="z-10 flex h-full shrink-0 items-center bg-black/25 px-3 text-xs font-black uppercase tracking-wide">
        BREAKING
      </div>
      <div
        className="relative flex h-full flex-1 items-center overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="ticker-animation text-sm font-bold" style={{ animationPlayState: paused ? 'paused' : 'running' }}>
          {[...BREAKING_TICKER, ...BREAKING_TICKER].map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center">
              <Link href="/" className="px-2 hover:underline">
                {item}
              </Link>
              <span className="mx-4 h-1.5 w-1.5 rounded-full bg-white/50" />
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        className="flex h-full w-10 shrink-0 items-center justify-center bg-black/20"
        aria-label={paused ? 'Play ticker' : 'Pause ticker'}
      >
        {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
