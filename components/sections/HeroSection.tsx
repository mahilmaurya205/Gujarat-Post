'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { getFeaturedArticles } from '@/data';
import NewsCard from '@/components/ui/NewsCard';
import { useApp } from '@/components/AppProvider';

const CHANNEL_URL = 'https://www.youtube.com/@Gujaratpostnews';
const CHANNEL_ID = 'UCqQ8YbFSZ4j8J4iVJOHurTw';
const LATEST_VIDEO_ID = 'A_5vL-ngK4M';

export default function HeroSection() {
  const { language } = useApp();
  const [videoMode, setVideoMode] = useState<'latest' | 'live'>('latest');
  const featured = getFeaturedArticles();
  const lead = featured[0];
  const supporting = featured.slice(1, 5);
  const moreStories = featured.slice(5, 10);

  if (!lead) return null;

  return (
    <section className="hero-band border-t-4 border-accent py-3 md:py-4">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="mb-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-white shadow-lg shadow-red-500/20">
              <Flame className="h-5 w-5 fill-current" />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Gujarat Post</p>
              <h1 className="text-2xl font-black leading-tight text-foreground md:text-3xl">
                {language === 'gu' ? 'મુખ્ય સમાચાર' : language === 'hi' ? 'मुख्य समाचार' : 'Top Stories'}
              </h1>
            </div>
          </div>
          <Link href="/category/gujarat" className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-black text-foreground shadow-sm transition hover:border-accent hover:text-accent">
            {language === 'gu' ? 'બધા સમાચાર' : language === 'hi' ? 'सभी समाचार' : 'All stories'} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <NewsCard article={lead} variant="hero" />
          </div>

          <div className="grid grid-cols-2 items-start gap-3.5 lg:col-span-5">
            {supporting.map((article) => (
              <NewsCard key={article.id} article={article} variant="small" />
            ))}
          </div>
        </div>

        {moreStories.length > 0 && (
          <div className="mt-3 border-t border-border pt-3">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Left Column: More Top Stories */}
              <div className="lg:col-span-8">
                <div className="mb-3.5 flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase tracking-wide text-foreground">
                    {language === 'gu' ? 'વધુ મુખ્ય સમાચાર' : language === 'hi' ? 'अन्य मुख्य समाचार' : 'More Top Stories'}
                  </h2>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {language === 'gu' ? `સમાચાર ૬–${5 + moreStories.length}` : language === 'hi' ? `समाचार 6–${5 + moreStories.length}` : `Stories 6–${5 + moreStories.length}`}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
                  {moreStories.slice(0, 3).map((article) => (
                    <NewsCard key={article.id} article={article} variant="small" />
                  ))}
                </div>
                {moreStories.length > 3 && (
                  <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {moreStories.slice(3, 5).map((article) => (
                      <NewsCard key={article.id} article={article} variant="horizontal" />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Live TV Sidebar Widget */}
              <LiveTVWidget language={language} videoMode={videoMode} setVideoMode={setVideoMode} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Live TV Widget ───────────────────────────────────────────────────────────

interface LiveTVWidgetProps {
  language: string;
  videoMode: 'latest' | 'live';
  setVideoMode: (mode: 'latest' | 'live') => void;
}

function LiveTVWidget({ language, videoMode, setVideoMode }: LiveTVWidgetProps) {
  const [liveStatus, setLiveStatus] = useState<'checking' | 'live' | 'offline'>('checking');

  useEffect(() => {
    fetch('/api/live/tv')
      .then((r) => r.json())
      .then((data: { isLive: boolean }) => {
        const live = data.isLive;
        setLiveStatus(live ? 'live' : 'offline');
        // Auto-select live tab if stream is active, otherwise stay on latest
        if (live) setVideoMode('live');
        else setVideoMode('latest');
      })
      .catch(() => {
        setLiveStatus('offline');
        setVideoMode('latest');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLive = liveStatus === 'live';

  return (
    <div className="lg:col-span-4">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Dot pulses only when live */}
          <span
            className={`h-2 w-2 rounded-full ${
              isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
            }`}
          />
          <h2 className="text-sm font-black uppercase tracking-wide text-foreground">
            {language === 'gu' ? 'લાઇવ પ્રસારણ' : language === 'hi' ? 'लाइव प्रसारण' : 'Watch Live'}
          </h2>
        </div>
        {/* Status badge – shows once we know the status */}
        {liveStatus !== 'checking' && (
          <span
            className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ${
              isLive ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {isLive
              ? language === 'gu' ? 'લાઇવ' : language === 'hi' ? 'लाइव' : 'LIVE'
              : language === 'gu' ? 'ઓફલાઇન' : language === 'hi' ? 'ऑफलाइन' : 'OFFLINE'}
          </span>
        )}
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm p-3">
        {/* Tab strip */}
        <div className="mb-2.5 flex justify-between items-center bg-muted/50 p-1 rounded-lg border border-border/60">
          <div className="flex gap-1">
            {/* ─ Latest tab: always visible ─ */}
            <button
              type="button"
              onClick={() => setVideoMode('latest')}
              className={`rounded-full px-3 py-1 text-[10px] font-black transition ${
                videoMode === 'latest'
                  ? 'bg-card text-foreground shadow-sm ring-1 ring-black/5'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {language === 'gu' ? 'તાજેતરના' : language === 'hi' ? 'नवीनतम' : 'Latest'}
            </button>

            {/* ─ Live tab: only when stream is active ─ */}
            {isLive && (
              <button
                type="button"
                onClick={() => setVideoMode('live')}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black transition ${
                  videoMode === 'live'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                {language === 'gu' ? 'લાઇવ' : language === 'hi' ? 'लाइव' : 'Live'}
              </button>
            )}
          </div>
          <span className="text-[9px] font-bold text-muted-foreground mr-1">
            {language === 'gu' ? 'યૂટ્યૂબ પ્રસારણ' : language === 'hi' ? 'यूट्यूब प्रसारण' : 'YouTube Broadcast'}
          </span>
        </div>

        {/* Embed */}
        <div className="relative aspect-video overflow-hidden rounded-lg bg-black border border-border/40 shadow-inner">
          <iframe
            key={videoMode}
            className="absolute inset-0 h-full w-full"
            src={
              videoMode === 'live'
                ? `https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}&autoplay=1&mute=1&rel=0`
                : `https://www.youtube.com/embed/${LATEST_VIDEO_ID}?autoplay=1&mute=1&rel=0&modestbranding=1`
            }
            title="Gujarat Post Live Widget"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        {/* Channel row */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-[11px] font-black text-white shadow-sm">
              GP
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-black text-foreground">Gujarat Post</p>
              <p className="truncate text-[9px] font-semibold text-muted-foreground">
                {language === 'gu' ? 'સત્તાવાર ચેનલ' : language === 'hi' ? 'आधिकारिक चैनल' : 'Official Channel'}
              </p>
            </div>
          </div>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-full bg-[#ff0000] px-4 py-1.5 text-[10px] font-black text-white hover:bg-red-600 transition shadow"
          >
            {language === 'gu' ? 'સબસ્ક્રાઇબ કરો' : language === 'hi' ? 'सब्सक्राइब करें' : 'Subscribe'}
          </a>
        </div>
      </div>
    </div>
  );
}
