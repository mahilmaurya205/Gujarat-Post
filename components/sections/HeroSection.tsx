'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Flame, Eye, Play, ChevronRight } from 'lucide-react';
import {
  getFeaturedArticles,
  getArticleTitle,
  getArticleExcerpt,
  formatTime,
  formatDate,
  formatViews,
  getCategoryLabel,
  getArticlesByCategory,
  getTrendingArticles,
  VIDEOS,
  getLocalized,
} from '@/data';
import { getCategoryColor } from '@/lib/utils';
import { useApp } from '@/components/AppProvider';
import type { Language } from '@/types';

const CHANNEL_URL = 'https://www.youtube.com/@Gujaratpostnews';
const CHANNEL_ID = 'UCqQ8YbFSZ4j8J4iVJOHurTw';
const LATEST_VIDEO_ID = 'A_5vL-ngK4M';

/* ===========================================================================
   Main HeroSection -- tv9gujarati.com style 3-column layout
=========================================================================== */
export default function HeroSection() {
  const { language } = useApp();
  const [videoMode, setVideoMode] = useState<'latest' | 'live'>('latest');

  const featured = getFeaturedArticles();
  // Left column: "મુખ્ય સમાચાર" — 8 compact list items
  const leftItems = featured.slice(0, 7);
  // Center top: "ટૉપ સ્ટોરી" — 4×3 grid = 12 cards
  const topStories = featured.slice(8, 20);
  // Center bottom row: 4 more cards
  const centerBot = featured.slice(20, 24);
  // Category rows below
  const gujaratArt = getArticlesByCategory('Gujarat').slice(0, 8);
  const crimeArt = getArticlesByCategory('Crime').slice(0, 4);
  const nationalArt = getArticlesByCategory('Politics').slice(0, 4);
  const worldArt = getArticlesByCategory('World').slice(0, 4);
  const businessArt = getArticlesByCategory('Business').slice(0, 4);
  // Videos
  const videos = VIDEOS.filter(v => v.type === 'video').slice(0, 5);
  const extraRightArticles = featured.slice(24, 28);

  if (!featured.length) return null;

  return (
    <div className="mx-auto max-w-screen-xl px-2 py-0.5 space-y-1">

      {/* ── ROW 1: 3-column main section ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-1 lg:grid-cols-[280px_1fr_300px] items-start">

        {/* LEFT: Mukhya Samachar list */}
        <div className="hidden lg:block">
          <SectionLabel
            title="Top News"
            titleGu="મુખ્ય સમાચાર"
            language={language}
          />
          <div className="flex flex-col divide-y divide-border">
            {leftItems.map((art) => (
              <LeftListItem key={art.id} article={art} language={language} />
            ))}
          </div>
        </div>

        {/* CENTER: Top Stories 3×2 grid */}
        <div className="min-w-0">
          <div className="flex items-center justify-between mb-1">
            <SectionLabel title="Top Stories" titleGu="ટૉપ સ્ટોરી" language={language} />
            <Link href="/category/gujarat" className="flex items-center gap-0.5 text-[11px] font-bold text-accent hover:underline">
              {language === 'gu' ? 'બધા જુઓ' : 'View all'} <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {/* 4-column 2-row grid — more articles, smaller cards */}
          <div className="grid grid-cols-4 gap-0.5">
            {topStories.map((art) => (
              <StoryCard key={art.id} article={art} language={language} />
            ))}
          </div>
          {/* 4-card bottom strip */}
          {centerBot.length > 0 && (
            <div className="mt-0.5 grid grid-cols-4 gap-0.5">
              {centerBot.map((art) => (
                <TinyStripCard key={art.id} article={art} language={language} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Live TV + Weather + EPaper */}
        <div className="flex flex-col gap-0.5">
          <LiveTVWidget language={language} videoMode={videoMode} setVideoMode={setVideoMode} />
          <WeatherWidget language={language} />
          <EPaperWidget language={language} />
          <div className="grid gap-0.5">
            {extraRightArticles.map((art) => (
              <Link key={art.id} href={`/news/${art.slug}`} className="news-card group flex gap-2 rounded-md border border-border bg-card p-1.5 hover:border-accent/40 transition">
                <div className="relative h-[56px] w-[72px] shrink-0 overflow-hidden rounded">
                  <Image src={art.image} alt={art.title} fill sizes="72px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-[11px] font-black leading-snug text-foreground">{getArticleTitle(art, language)}</p>
                  <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" />{formatTime(art.publishedAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 2: Category grid (National, World, Crime, Business) ──────── */}
      <CategoryRow
        title="State News" titleGu="રાજ્ય સમાચાર"
        href="/category/gujarat"
        articles={gujaratArt} language={language}
      />
      <div className="grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-4">
        <CategoryColumn title="National" titleGu="રાષ્ટ્રીય" href="/category/politics" articles={nationalArt} language={language} showExcerpt={true} />
        <CategoryColumn title="World" titleGu="વિશ્વ" href="/category/world" articles={worldArt} language={language} />
        <CategoryColumn title="Crime" titleGu="અપરાધ" href="/category/crime" articles={crimeArt} language={language} />
        <CategoryColumn title="Business" titleGu="બિઝનેસ" href="/category/business" articles={businessArt} language={language} />
      </div>

      {/* ── ROW 3: Videos strip ───────────────────────────────────────────── */}
      <VideoStrip videos={videos} language={language} />
    </div>
  );
}

/* --- Section Label ---------------------------------------------------------- */
function SectionLabel({ title, titleGu, language }: { title: string; titleGu: string; language: Language }) {
  const display = language === 'en' ? title : titleGu;
  return (
    <div className="flex items-center gap-1.5 mb-1.5 border-b-2 border-accent pb-1">
      <Flame className="h-6 w-6 text-accent fill-current shrink-0" />
      <span className="text-[22px] md:text-[24px] font-black text-foreground">{display}</span>
    </div>
  );
}

/* --- Left List Item --------------------------------------------------------- */
function LeftListItem({ article, language }: { article: ReturnType<typeof getFeaturedArticles>[0]; language: Language }) {
  const title = getArticleTitle(article, language);
  const cat = getCategoryLabel(article, language);
  const cc = getCategoryColor(article.category);
  return (
    <Link href={`/news/${article.slug}`} className="flex gap-2 py-2 group hover:bg-muted/50 transition rounded px-1">
      <div className="relative h-[90px] w-[120px] shrink-0 overflow-hidden rounded">
        <Image src={article.image} alt={article.title} fill sizes="120px" className="object-cover group-hover:scale-105 transition duration-300" />
        {article.isBreaking && (
          <span className="absolute left-0 top-0 bg-accent text-white text-[7px] font-black px-1 py-0.5 leading-none">LIVE</span>
        )}
      </div>
      <div className="min-w-0 flex flex-col justify-between">
        <div>
          <span className="cat-badge mb-0.5" style={{ background: cc, fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>{cat}</span>
          <p className="line-clamp-3 text-[15px] font-black leading-snug text-foreground mt-0.5">{title}</p>
        </div>
        <span className="flex items-center gap-0.5 text-[11px] font-semibold text-muted-foreground">
          <Clock className="h-3 w-3" />{formatTime(article.publishedAt)}
        </span>
      </div>
    </Link>
  );
}

/* --- Story Card (center 3x2 grid) ------------------------------------------ */
function StoryCard({ article, language }: { article: ReturnType<typeof getFeaturedArticles>[0]; language: Language }) {
  const title = getArticleTitle(article, language);
  const cat = getCategoryLabel(article, language);
  const cc = getCategoryColor(article.category);
  return (
    <Link href={`/news/${article.slug}`} className="news-card group block overflow-hidden rounded-lg border border-border bg-card hover:border-accent/40 transition">
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '56%' }}>
        <Image src={article.image} alt={article.title} fill sizes="25vw" className="object-cover group-hover:scale-105 transition duration-400" />
        {article.isBreaking && (
          <span className="live-badge absolute left-1 top-1 bg-accent text-white text-[8px] font-black px-1 py-0.5 rounded">BREAKING</span>
        )}
      </div>
      <div className="p-1.5">
        <span className="cat-badge" style={{ background: cc, fontSize: '0.58rem', padding: '0.07rem 0.4rem' }}>{cat}</span>
        <h3 className="line-clamp-2 text-[11.5px] font-black leading-snug text-foreground mt-0.5">{title}</h3>
        <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground">
          <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{formatTime(article.publishedAt)}</span>
          <span className="flex items-center gap-0.5"><Eye className="h-2.5 w-2.5" />{formatViews(article.views)}</span>
        </div>
      </div>
    </Link>
  );
}

/* --- Tiny Strip Card (4-col bottom of center) ------------------------------ */
function TinyStripCard({ article, language }: { article: ReturnType<typeof getFeaturedArticles>[0]; language: Language }) {
  const title = getArticleTitle(article, language);
  const cc = getCategoryColor(article.category);
  return (
    <Link href={`/news/${article.slug}`} className="news-card group block overflow-hidden rounded-md border border-border bg-card hover:border-accent/40 transition">
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '65%' }}>
        <Image src={article.image} alt={article.title} fill sizes="25vw" className="object-cover group-hover:scale-105 transition duration-300" />
        <div className="img-overlay absolute inset-0" />
        <div className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full" style={{ background: cc }} />
        <div className="absolute inset-x-0 bottom-0 p-1.5">
          <p className="line-clamp-2 text-[10px] font-black leading-tight text-white">{title}</p>
          <span className="flex items-center gap-0.5 text-[9px] text-white/70 mt-0.5">
            <Clock className="h-2 w-2" />{formatTime(article.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* --- Category Row (4-col horizontal) --------------------------------------- */
function CategoryRow({
  title, titleGu, href, articles, language
}: { title: string; titleGu: string; href: string; articles: ReturnType<typeof getArticlesByCategory>; language: Language }) {
  const display = language === 'en' ? title : titleGu;
  return (
    <div>
      <div className="flex items-center justify-between mb-1 border-b border-border pb-0.5">
        <span className="section-heading text-[21px] md:text-[22px] font-black text-foreground">{display}</span>
        <Link href={href} className="flex items-center gap-0.5 text-[13px] md:text-[14px] font-bold text-accent hover:underline">
          {language === 'gu' ? 'બધા જુઓ' : 'View all'} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
        {articles.map((art) => {
          const t = getArticleTitle(art, language);
          const cc = getCategoryColor(art.category);
          return (
            <Link key={art.id} href={`/news/${art.slug}`} className="news-card group flex gap-2 rounded-md border border-border bg-card p-1.5 hover:border-accent/40 transition">
              <div className="relative h-[56px] w-[76px] shrink-0 overflow-hidden rounded">
                <Image src={art.image} alt={art.title} fill sizes="76px" className="object-cover group-hover:scale-105 transition" />
              </div>
              <div className="min-w-0 flex flex-col justify-between">
                <p className="line-clamp-2 text-[11px] font-black leading-snug text-foreground">{t}</p>
                <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: cc }} />
                  <span>{formatTime(art.publishedAt)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* --- Category Row Compact (2-col split layout) ------------------------------ */
/* --- Category Column (4 side-by-side vertical grids) ----------------------- */
function CategoryColumn({
  title, titleGu, href, articles, language, showExcerpt = false
}: {
  title: string;
  titleGu: string;
  href: string;
  articles: ReturnType<typeof getArticlesByCategory>;
  language: Language;
  showExcerpt?: boolean;
}) {
  const displayTitle = language === 'en' ? title : titleGu;
  const viewAllText = language === 'gu' ? 'વધુ જુઓ >' : 'View all >';

  if (!articles || articles.length === 0) return null;

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-2.5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border/80">
        <div className="flex items-center gap-1.5">
          <span className="h-4 w-[3px] bg-accent shrink-0 rounded-sm" />
          <span className="text-[15px] md:text-[16px] font-black text-foreground">{displayTitle}</span>
        </div>
        <Link href={href} className="text-[11px] font-black text-accent hover:underline">
          {viewAllText}
        </Link>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {articles.slice(0, 4).map((art, idx) => {
          const t = getArticleTitle(art, language);
          const excerpt = getArticleExcerpt(art, language);

          if (idx === 0) {
            // First item: larger
            return (
              <Link key={art.id} href={`/news/${art.slug}`} className="group flex gap-2.5 pb-2.5 border-b border-border/40">
                <div className="relative h-[74px] w-[110px] shrink-0 overflow-hidden rounded-md">
                  <Image src={art.image} alt={art.title} fill sizes="110px" className="object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <div className="min-w-0 flex flex-col justify-between flex-1">
                  <div>
                    <p className="line-clamp-2 text-[12px] font-black leading-snug text-foreground group-hover:text-accent transition duration-200">
                      {t}
                    </p>
                    {showExcerpt && excerpt && (
                      <p className="line-clamp-2 text-[10.5px] text-muted-foreground leading-normal mt-0.5 font-semibold">
                        {excerpt}
                      </p>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-[9.5px] text-accent font-bold mt-1">
                    <Clock className="h-2.5 w-2.5 text-accent fill-none stroke-[3]" />
                    {formatTime(art.publishedAt)}
                  </span>
                </div>
              </Link>
            );
          } else {
            // Sub-items: smaller
            return (
              <Link key={art.id} href={`/news/${art.slug}`} className="group flex gap-2.5 items-start pb-2 border-b border-border/40 last:border-b-0 last:pb-0 last:mb-0">
                <div className="relative h-[50px] w-[70px] shrink-0 overflow-hidden rounded-md">
                  <Image src={art.image} alt={art.title} fill sizes="70px" className="object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <div className="min-w-0 flex flex-col justify-between flex-1 min-h-[50px]">
                  <p className="line-clamp-2 text-[11px] font-black leading-snug text-foreground group-hover:text-accent transition duration-200">
                    {t}
                  </p>
                  <span className="flex items-center gap-1 text-[9.5px] text-accent font-bold mt-0.5">
                    <Clock className="h-2.5 w-2.5 text-accent fill-none stroke-[3]" />
                    {formatTime(art.publishedAt)}
                  </span>
                </div>
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
}

/* --- Video Strip ------------------------------------------------------------ */
function VideoStrip({ videos, language }: { videos: typeof VIDEOS; language: Language }) {
  const [playId, setPlayId] = useState<string | null>(null);

  const activeVideo = videos.find(v => v.id === playId);
  return (
    <div>
      {/* Modal Overlay */}
      {playId && activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4 py-6"
          onClick={() => setPlayId(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 bg-black/80 px-4 py-3 backdrop-blur-sm">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{getLocalized(language, { en: activeVideo.title, gu: activeVideo.titleGu, hi: activeVideo.titleHi })}</p>
                <p className="text-xs text-white/70">{getLocalized(language, { en: 'Gujarat Post', gu: 'ગુજરાત પોસ્ટ', hi: 'गुजरात पोस्ट' })}</p>
              </div>
              <button
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-bold text-white transition hover:bg-white/15"
                onClick={() => setPlayId(null)}
              >
                Close
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={getLocalized(language, { en: activeVideo.title, gu: activeVideo.titleGu, hi: activeVideo.titleHi })}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-1 border-b border-border pb-0.5">
        <span className="section-heading text-[17px] md:text-[18px] font-black text-foreground">
          {language === 'gu' ? 'વીડિયો' : language === 'hi' ? 'वीडियो' : 'Videos'}
        </span>
        <Link href="/videos" className="flex items-center gap-0.5 text-[12px] md:text-[13px] font-bold text-accent hover:underline">
          {language === 'gu' ? 'બધા જુઓ' : 'View all'} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
        {videos.map((v) => (
          <div key={v.id} className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="relative aspect-video overflow-hidden rounded-[24px] bg-slate-950">
              {playId === v.id ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&rel=0`}
                  title={getLocalized(language, { en: v.title, gu: v.titleGu, hi: v.titleHi })}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="group/v relative h-full w-full cursor-pointer" onClick={() => setPlayId(v.id)}>
                  <Image src={v.thumbnail} alt={v.title} fill sizes="20vw" className="object-cover transition duration-300 group-hover/v:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition group-hover/v:opacity-100">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-xl transition-transform duration-300 group-hover/v:scale-110">
                      <Play className="h-4 w-4 fill-current" />
                    </span>
                  </div>
                  <span className="absolute bottom-2 right-2 rounded-full bg-black/75 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                    {v.duration}
                  </span>
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="line-clamp-2 text-[12px] font-black leading-snug text-foreground">
                {getLocalized(language, { en: v.title, gu: v.titleGu, hi: v.titleHi })}
              </p>
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground mt-2">
                <Eye className="h-3 w-3" />{formatViews(v.views)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Live TV Widget --------------------------------------------------------- */
interface LiveTVWidgetProps { language: Language; videoMode: 'latest' | 'live'; setVideoMode: (m: 'latest' | 'live') => void; }
function LiveTVWidget({ language, videoMode, setVideoMode }: LiveTVWidgetProps) {
  const [liveStatus, setLiveStatus] = useState<'checking' | 'live' | 'offline'>('checking');
  useEffect(() => {
    fetch('/api/live/tv').then(r => r.json()).then((d: { isLive: boolean }) => {
      setLiveStatus(d.isLive ? 'live' : 'offline');
      setVideoMode(d.isLive ? 'live' : 'latest');
    }).catch(() => { setLiveStatus('offline'); setVideoMode('latest'); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isLive = liveStatus === 'live';
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between bg-accent px-3 py-1">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[12px] md:text-sm font-black text-white uppercase tracking-wide">
            {language === 'gu' ? 'લાઈવ ટીવી' : 'Live TV'}
          </span>
        </div>
        <div className="flex gap-1.5">
          <button type="button" onClick={() => setVideoMode('latest')}
            className={`rounded px-2.5 py-0.5 text-[10px] md:text-xs font-black transition cursor-pointer ${videoMode === 'latest' ? 'bg-white text-accent' : 'text-white/80 hover:text-white'}`}>
            {language === 'gu' ? 'તાજા' : 'Latest'}
          </button>
          {isLive && (
            <button type="button" onClick={() => setVideoMode('live')}
              className={`rounded px-2.5 py-0.5 text-[10px] md:text-xs font-black transition cursor-pointer ${videoMode === 'live' ? 'bg-white text-accent' : 'text-white/80 hover:text-white'}`}>
              LIVE
            </button>
          )}
        </div>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        <iframe key={videoMode} className="absolute inset-0 h-full w-full"
          src={videoMode === 'live'
            ? `https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}&autoplay=1&mute=1&rel=0`
            : `https://www.youtube.com/embed/${LATEST_VIDEO_ID}?autoplay=1&mute=1&rel=0&modestbranding=1`}
          title="Gujarat Post Live"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-1">
        <div className="flex items-center gap-1.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-[10px] md:text-xs font-black text-white">GP</span>
          <p className="text-xs md:text-sm font-black text-foreground">Gujarat Post</p>
        </div>
        <a href={CHANNEL_URL} target="_blank" rel="noreferrer"
          className="rounded bg-[#ff0000] px-3 py-1 text-[10px] md:text-xs font-black text-white hover:bg-red-600 transition">
          {language === 'gu' ? 'સબ્સ.' : 'Subscribe'}
        </a>
      </div>
    </div>
  );
}

/* --- Weather Widget --------------------------------------------------------- */
function WeatherWidget({ language }: { language: Language }) {
  const [weather, setWeather] = useState<Array<{ city: string; state: string; temperature: number; condition: string; humidity: number; windSpeed: number }> | null>(null);
  useEffect(() => {
    fetch('/api/live/weather?cities=Ahmedabad,Gandhinagar,Vadodara').then(r => r.json())
      .then((d: { weather?: Array<{ city: string; state: string; temperature: number; condition: string; humidity: number; windSpeed: number }> }) => {
        setWeather(d.weather ?? []);
      }).catch(() => { setWeather([]); });
  }, []);
  const label = language === 'gu' ? 'હવામાન' : language === 'hi' ? 'मौसम' : 'Weather';
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
        <span className="text-xs md:text-sm font-black text-foreground">{label}</span>
        {/* <span className="text-[10px] md:text-[11px] font-semibold uppercase text-accent tracking-wide">Ahmedabad · Gandhinagar · Vadodara</span> */}
      </div>
      {!weather ? (
        <div className="py-8 text-center text-sm font-semibold text-muted-foreground">Loading weather…</div>
      ) : weather.length === 0 ? (
        <div className="py-8 text-center text-sm font-semibold text-muted-foreground">Weather unavailable</div>
      ) : (
        <div className="space-y-3">
          {(Array.isArray(weather) ? weather.slice(0, 3) : []).map((item) => (
            <div key={item.city} className="rounded-2xl border border-border/80 bg-white/95 p-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-foreground">{item.city}</p>
                  <p className="text-[11px] text-muted-foreground">{item.condition}</p>
                </div>
                <span className="text-3xl font-black text-accent">{item.temperature}°C</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                <div className="rounded-xl bg-slate-50 p-2 text-center">
                  <p className="font-semibold text-foreground">Humidity</p>
                  <p>{item.humidity}%</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2 text-center">
                  <p className="font-semibold text-foreground">Wind</p>
                  <p>{item.windSpeed} km/h</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2 text-center">
                  <p className="font-semibold text-foreground">Feels like</p>
                  <p>{item.temperature}°C</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* --- E-Paper Widget --------------------------------------------------------- */
function EPaperWidget({ language }: { language: Language }) {
  const label = language === 'gu' ? 'ઈ-પેપર' : 'E-Paper';
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between border-b border-border pb-1 mb-1.5">
        <span className="text-xs md:text-sm font-black text-foreground">{label}</span>
        <span className="text-[11px] md:text-xs text-accent font-bold">
          {language === 'gu' ? 'ઓનલાઈન વાંચો' : 'Read Online'}
        </span>
      </div>
      <Link href="/epaper" className="group flex items-center gap-3 hover:opacity-80 transition">
          <div className="relative h-[90px] w-[80px] shrink-0 overflow-hidden rounded border border-border shadow-md">
          <Image
            src="https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=200&q=80"
            alt="E-Paper"
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm md:text-base font-black text-foreground leading-snug">Gujarat Post</p>
          <p className="text-xs text-muted-foreground" suppressHydrationWarning>
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <div className="pt-1">
            <span
              className="inline-flex items-center gap-1 rounded bg-accent px-3 py-1 text-[10px] md:text-xs font-black text-white transition hover:bg-accent/90 shadow-sm">
              {language === 'gu' ? 'PDF ડાઉનલોડ' : 'PDF Download'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
