'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Flame, Eye, Play, ChevronRight, ChevronLeft, Camera, X, Bookmark, Sun, Cloud, CloudRain, Shield, Trophy, TrendingUp, TrendingDown, Wind, ChevronDown, ArrowUpRight, Thermometer, Droplet, MoreVertical, Fuel, Megaphone, Radio } from 'lucide-react';
import {
  getArticleTitle,
  getArticleExcerpt,
  formatTime,
  formatDate,
  formatViews,
  getCategoryLabel,
  VIDEOS,
  getLocalized,
  ARTICLES,
  getArticlesByCategory,
  PHOTOS,
} from '@/data';
import { getCategoryColor } from '@/lib/utils';
import { useApp } from '@/components/AppProvider';
import type { Article, Language } from '@/types';
import InstagramStories from '@/components/sections/InstagramStories';
import WebStoriesSection from '@/components/sections/WebStoriesSection';
import { ZODIAC_SIGNS, ZodiacSign } from '@/components/sections/AstrologySection';
import LatestUpdatesSection from '@/components/sections/LatestUpdatesSection';
import TrendingSection from '@/components/sections/TrendingSection';

const CHANNEL_URL = 'https://www.youtube.com/@Gujaratpostnews';
const CHANNEL_ID = 'UCqQ8YbFSZ4j8J4iVJOHurTw';
const LATEST_VIDEO_ID = 'A_5vL-ngK4M';

const HOME_IMAGE_FALLBACKS = [
  '/assets/demo/3.jpg',
  '/assets/demo/4.jpg',
  '/assets/demo/1.jpg',
  '/assets/demo/2.jpg',
  '/assets/demo/5.jpg',
  '/assets/demo/6.jpg',
  '/assets/demo/7.jpg',
  '/assets/demo/8.jpg',
];

function makeHomeImagesUnique<T extends Article>(sections: T[][]): T[][] {
  const usedImages = new Set<string>();
  const processedArticleIds = new Set<string>();
  let fallbackIndex = 0;

  return sections.map((section) =>
    section.map((article) => {
      if (processedArticleIds.has(article.id)) {
        return article;
      }
      processedArticleIds.add(article.id);

      let image = article.image;

      if (usedImages.has(image)) {
        for (let tries = 0; tries < HOME_IMAGE_FALLBACKS.length; tries++) {
          const candidateIndex = (fallbackIndex + tries) % HOME_IMAGE_FALLBACKS.length;
          const candidate = HOME_IMAGE_FALLBACKS[candidateIndex];

          if (!usedImages.has(candidate)) {
            image = candidate;
            fallbackIndex = (candidateIndex + 1) % HOME_IMAGE_FALLBACKS.length;
            break;
          }
        }
      }

      usedImages.add(image);
      return image === article.image ? article : { ...article, image };
    })
  );
}

/* ===========================================================================
   Main HeroSection -- tv9gujarati.com style 3-column layout
=========================================================================== */
export default function HeroSection() {
  const { language } = useApp();
  const [videoMode, setVideoMode] = useState<'latest' | 'live'>('latest');

  const [savedIds, setSavedIds] = useState<string[]>([]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gp-saved-articles');
      if (stored) setSavedIds(JSON.parse(stored));
    } catch (e) {
      console.warn(e);
    }
  }, []);
  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = savedIds.includes(id) ? savedIds.filter(x => x !== id) : [...savedIds, id];
    setSavedIds(next);
    try {
      localStorage.setItem('gp-saved-articles', JSON.stringify(next));
    } catch (err) {
      console.warn(err);
    }
  };

  // DB-backed article state
  const [topNews, setTopNews] = useState<Article[]>([]);
  const [topStories, setTopStories] = useState<Article[]>([]);
  const [trendingArtDB, setTrendingArtDB] = useState<Article[]>([]);
  const [gujaratArtDB, setGujaratArtDB] = useState<Article[]>([]);
  const [crimeArtDB, setCrimeArtDB] = useState<Article[]>([]);
  const [nationalArtDB, setNationalArtDB] = useState<Article[]>([]);
  const [worldArtDB, setWorldArtDB] = useState<Article[]>([]);
  const [businessArtDB, setBusinessArtDB] = useState<Article[]>([]);
  const [sportsArtDB, setSportsArtDB] = useState<Article[]>([]);

  useEffect(() => {
    setTopNews(ARTICLES.slice(0, 6));
    setTopStories(ARTICLES.filter((a) => a.isFeatured).slice(0, 16));
    setTrendingArtDB(ARTICLES.filter((a) => a.isTrending).slice(0, 10));
    setGujaratArtDB(getArticlesByCategory('state').slice(0, 16));
    setCrimeArtDB(getArticlesByCategory('crime').slice(0, 4));
    setNationalArtDB(getArticlesByCategory('national').slice(0, 4));
    setWorldArtDB(getArticlesByCategory('world').slice(0, 4));
    setBusinessArtDB(getArticlesByCategory('business').slice(0, 4));
    setSportsArtDB(getArticlesByCategory('sports').slice(0, 7));
  }, []);

  // Derived slices
  const leftItems = topNews.slice(0, 5);
  const topStoriesSlice = topStories.slice(0, 16);
  const stateRowArticles = [
    ...gujaratArtDB,
    ...topStories,
    ...trendingArtDB,
    ...topNews,
  ].filter((article, index, list) => list.findIndex((item) => item.id === article.id) === index).slice(0, 16);

  // Videos — still from static data
  const videos = VIDEOS.filter(v => v.type === 'video' || v.type === 'podcast' || v.type === 'interview').slice(0, 10);

  const [
    uniqueLeftItems,
    uniqueTopStories,
    uniqueGujaratArt,
    uniqueCrimeArt,
    uniqueNationalArt,
    uniqueWorldArt,
    uniqueBusinessArt,
    uniqueSportsArt,
    uniqueTrendingArt,
  ] = makeHomeImagesUnique([
    leftItems,
    topStoriesSlice,
    stateRowArticles,
    crimeArtDB,
    nationalArtDB,
    worldArtDB,
    businessArtDB,
    sportsArtDB,
    trendingArtDB,
  ]);

  const leadStoryId = uniqueTopStories[0]?.id;
  const leadSideArticles = [
    ...uniqueLeftItems,
    ...uniqueTopStories.slice(9),
    ...uniqueGujaratArt,
  ].filter((article, index, list) => (
    article.id !== leadStoryId &&
    list.findIndex((item) => item.id === article.id) === index
  )).slice(0, 8);

  if (!topStories.length) return <HeroSectionSkeleton language={language} />;
  return (
    <div className="mx-auto max-w-screen-xl px-2 py-0.5 space-y-1">

      {/* ── ROW 1: Content + Sidebar Grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

        {/* Left Content Side */}
        <div className="flex flex-col gap-6">

          {/* Top Row: Hero Story & Middle Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

            {/* Hero Story Column */}
            <div className="flex flex-col gap-3">
              {uniqueTopStories[0] && (
                <Link href={`/news/${uniqueTopStories[0].slug}`} className="group flex flex-col w-full">
                  {/* Hero image */}
                  <div className="relative w-full overflow-hidden rounded-sm shadow-sm" style={{ aspectRatio: '3/2' }}>
                    <Image
                      src={uniqueTopStories[0].image}
                      alt={uniqueTopStories[0].title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 36vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      priority
                      loading="eager"
                    />
                  </div>
                  {/* Category tags */}
                  <div className="flex items-center gap-1.5 mt-2.5">
                    {uniqueTopStories[0].isLive ? (
                      <span className="bg-accent text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide flex items-center gap-1 animate-pulse">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                        LIVE
                      </span>
                    ) : (
                      <span className="bg-accent text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide">
                        {language === 'gu' ? 'ટ્રેન્ડ' : 'Trending'}
                      </span>
                    )}
                    <span className="text-muted-foreground text-[11px] font-semibold">
                      {getCategoryLabel(uniqueTopStories[0], language)}
                    </span>
                  </div>
                  {/* Headline */}
                  <h1 className="text-foreground font-extrabold text-[22px] md:text-[24px] leading-[1.22] tracking-tight mt-1.5 group-hover:text-accent transition-colors line-clamp-4">
                    {getArticleTitle(uniqueTopStories[0], language)}
                  </h1>
                  {/* Excerpt */}
                  <p className="text-muted-foreground text-[13px] leading-relaxed mt-1.5 line-clamp-2 font-medium">
                    {getArticleExcerpt(uniqueTopStories[0], language)}
                  </p>
                  {/* Meta */}
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground font-semibold border-t border-border/50 pt-2">
                    {uniqueTopStories[0].author && (
                      <span className="font-black text-foreground">
                        {getLocalized(language, {
                          en: uniqueTopStories[0].author.name,
                          gu: uniqueTopStories[0].author.nameGu,
                          hi: uniqueTopStories[0].author.nameHi,
                        })}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(uniqueTopStories[0].publishedAt)}
                    </span>
                  </div>
                </Link>
              )}

            </div>

            {/* ═══ MIDDLE COLUMN — 2-Column Newspaper Grid ════════════════ */}
            <div className="grid grid-cols-2 gap-x-4 border-l border-r border-border/40 px-4 min-w-0">
              {/* Left Sub-Column */}
              <div className="flex flex-col gap-2">
                {uniqueTopStories[1] && (
                  <Link href={`/news/${uniqueTopStories[1].slug}`} className="group flex flex-col gap-2">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border/10 bg-muted">
                      <Image
                        src={uniqueTopStories[1].image}
                        alt={uniqueTopStories[1].title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 15vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    {uniqueTopStories[1].isLive && (
                      <div className="flex items-center gap-1">
                        <span className="bg-accent text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                          LIVE
                        </span>
                      </div>
                    )}
                    <h3 className="text-[13.5px] font-black leading-snug text-foreground group-hover:text-accent transition-colors line-clamp-3">
                      {getArticleTitle(uniqueTopStories[1], language)}
                    </h3>
                  </Link>
                )}

                {[uniqueTopStories[4], uniqueTopStories[5], uniqueTopStories[8], uniqueTopStories[9]]
                  .filter(Boolean)
                  .map((art, idx) => (
                    <Link
                      key={art.id}
                      href={`/news/${art.slug}`}
                      className="group flex flex-col py-2 border-t border-border/40 hover:bg-muted/10 transition-colors rounded-md"
                    >
                      <h3 className="text-[13.5px] font-black leading-snug text-foreground group-hover:text-accent transition-colors line-clamp-3">
                        {getArticleTitle(art, language)}
                      </h3>
                    </Link>
                  ))}
              </div>

              {/* Right Sub-Column */}
              <div className="flex flex-col gap-2">
                {uniqueTopStories[2] && (
                  <Link href={`/news/${uniqueTopStories[2].slug}`} className="group flex flex-col gap-2">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border/10 bg-muted">
                      <Image
                        src={uniqueTopStories[2].image}
                        alt={uniqueTopStories[2].title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 15vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    {uniqueTopStories[2].isLive && (
                      <div className="flex items-center gap-1">
                        <span className="bg-accent text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                          LIVE
                        </span>
                      </div>
                    )}
                    <h3 className="text-[13.5px] font-black leading-snug text-foreground group-hover:text-accent transition-colors line-clamp-3">
                      {getArticleTitle(uniqueTopStories[2], language)}
                    </h3>
                    {uniqueTopStories[2].isLive && (
                      <span className="text-[11px] text-accent font-black hover:underline mt-0.5">
                        • લાઈવ સ્કોર
                      </span>
                    )}
                  </Link>
                )}

                {[uniqueTopStories[6], uniqueTopStories[7], uniqueTopStories[11], uniqueTopStories[12]]
                  .filter(Boolean)
                  .map((art, idx) => (
                    <Link
                      key={art.id}
                      href={`/news/${art.slug}`}
                      className="group flex flex-col py-2 border-t border-border/40 hover:bg-muted/10 transition-colors rounded-md"
                    >
                      <h3 className="text-[13.5px] font-black leading-snug text-foreground group-hover:text-accent transition-colors line-clamp-3">
                        {getArticleTitle(art, language)}
                      </h3>
                    </Link>
                  ))}
              </div>
            </div>
          </div> {/* Close Top Row grid */}

          {/* Bottom Row: Three horizontal articles (spanning full width of Content Column) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border/80 pt-4">

            {/* Article 1 */}
            <Link
              href="/news/girnar-ropeway-tourist-rush-increases-tremendously-205"
              className="group flex flex-col min-w-0"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border/10 bg-muted mb-2.5">
                <Image
                  src="/assets/demo/3.jpg"
                  alt="Girnar Ropeway"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-[#B3121B] font-extrabold text-[12px] md:text-[13px] mb-1 select-none uppercase tracking-wide">
                {language === 'gu' ? 'રાજ્ય સમાચાર' : 'State News'}
              </span>
              <h3 className="text-[13.5px] font-black leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-3">
                {language === 'gu'
                  ? 'ગિરનાર રોપ-વે પર ઉમટ્યા પ્રવાસીઓ! સંખ્યામાં જોરદાર વધારો, નાગરિક સંગઠનો દ્વારા સુરક્ષા અંગે ચિંતા વ્યક્ત કરી તાત્કાલિક પગલાંની માંગ'
                  : 'Tourists flock to Girnar Ropeway! Tremendous increase in numbers, safety measures demanded'}
              </h3>
              <div className="flex items-center gap-1.5 mt-2.5 text-[10.5px] text-muted-foreground font-semibold">
                <span>{language === 'gu' ? '4 કલાક પહેલાં' : '4 hours ago'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <span>10:30 AM</span>
                </span>
              </div>
            </Link>

            {/* Article 2 */}
            <Link
              href="/news/europe-new-trade-treaty-india-benefit-206"
              className="group flex flex-col min-w-0"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border/10 bg-muted mb-2.5">
                <Image
                  src="/assets/demo/5.jpg"
                  alt="Europe Trade Treaty"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-[#B3121B] font-extrabold text-[12px] md:text-[13px] mb-1 select-none uppercase tracking-wide">
                {language === 'gu' ? 'વિશ્વ' : 'World'}
              </span>
              <h3 className="text-[13.5px] font-black leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-3">
                {language === 'gu'
                  ? 'યુરોપમાં નવી વ્યાપાર સંધિ પર હસ્તાક્ષર, ભારતને પણ ફાયદો, સ્થાનિક પ્રશાસન દ્વારા હાઈ એલર્ટ અને ઈમરજન્સી હેલ્પલાઈન જાહેર'
                  : 'New trade agreement signed in Europe, India to benefit too, high alert issued'}
              </h3>
              <div className="flex items-center gap-1.5 mt-2.5 text-[10.5px] text-muted-foreground font-semibold">
                <span>{language === 'gu' ? '3 કલાક પહેલાં' : '3 hours ago'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <span>11:30 AM</span>
                </span>
              </div>
            </Link>

            {/* Article 3 */}
            <Link
              href="/news/gold-silver-price-surge-latest-rates-today-402"
              className="group flex flex-col min-w-0"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border/10 bg-muted mb-2.5">
                <Image
                  src="/assets/demo/6.jpg"
                  alt="Gold Rates"
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-[#B3121B] font-extrabold text-[12px] md:text-[13px] mb-1 select-none uppercase tracking-wide">
                {language === 'gu' ? 'બિઝનેસ' : 'Business'}
              </span>
              <h3 className="text-[13.5px] font-black leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-3">
                {language === 'gu'
                  ? 'સોના-ચાંદીના ભાવમાં જોરદાર ઉછાળો! જાણો આજના લેટેસ્ટ રેટ, નવી નાણાકીય નીતિના ફેરફારોથી ટેક સ્ટાર્ટઅપ્સમાં રોકાણ વધવાની અપેક્ષા'
                  : 'Gold-silver prices surge! Know rates today, tech startups investments expected to rise'}
              </h3>
              <div className="flex items-center gap-1.5 mt-2.5 text-[10.5px] text-muted-foreground font-semibold">
                <span>{language === 'gu' ? '2 કલાક પહેલાં' : '2 hours ago'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <span>12:30 PM</span>
                </span>
              </div>
            </Link>

          </div>

        </div> {/* Close Left Content Side */}

        {/* ═══ RIGHT SIDEBAR — Ad + YouTube Latest + Popular ═══════════════ */}
        <div className="flex flex-col gap-4">
          {/* Advertisement banner */}
          <div className="ad-slot">
            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 text-center">
              {language === 'gu' ? 'જાહેરાત' : 'Advertisement'}
            </p>
            <div className="ad-inner">
              <div className="ad-creative rounded-sm p-4 text-white flex flex-col justify-between" style={{ background: 'linear-gradient(135deg,#FF6B35,#C81D25)', minHeight: 180 }}>
                <div>
                  <div className="ad-brand font-black text-lg uppercase tracking-wide">મેગા સેલ ડેઝ</div>
                  <div className="ad-tag text-[12.5px] font-semibold mt-2 leading-snug">ફેશન અને ઈલેક્ટ્રોનિક્સ પર 70% સુધી છૂટ — ફક્ત આજે!</div>
                </div>
                <button className="ad-cta bg-white text-slate-900 rounded-sm px-4.5 py-1.5 text-[11px] font-black transition duration-200 hover:-translate-y-0.5 hover:shadow-lg w-max mt-4">
                  હમણાં ખરીદો ↗
                </button>
              </div>
            </div>
          </div>

          {/* YouTube Video Section */}
          <div className="w-full rounded-md border border-slate-200 bg-card p-4 shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-[#B3121B] font-black text-[13.5px] md:text-[14px] flex items-center gap-1.5 select-none">
                <Play className="h-3.5 w-3.5 fill-current" />
                {getLocalized(language, {
                  en: 'YouTube Videos',
                  gu: 'યુટ્યુબ વીડિયો',
                  hi: 'यूट्यूब वीडियो'
                })}
              </span>
              <span className="bg-accent text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                {getLocalized(language, {
                  en: 'VIDEO',
                  gu: 'વીડિયો',
                  hi: 'वीडियो',
                })}
              </span>
            </div>

            <div
              className="relative w-full overflow-hidden rounded-sm border border-slate-200/60 bg-black shadow-inner"
              style={{ aspectRatio: '16/9' }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${LATEST_VIDEO_ID}?autoplay=0&mute=1&rel=0&modestbranding=1&controls=1`}
                title="Gujarat Post Video"
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground pt-1 border-t border-border/40 mt-1">
              <span>
                {getLocalized(language, {
                  en: 'Gujarat Post Latest Video',
                  gu: 'ગુજરાત પોસ્ટ તાજેતરનો વીડિયો',
                  hi: 'गुजरात पोस्ट नवीनतम वीडियो',
                })}
              </span>
              <a
                href={`https://www.youtube.com/watch?v=${LATEST_VIDEO_ID}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#B3121B] hover:underline flex items-center gap-1 font-black"
              >
                {language === 'gu' ? 'યુટ્યુબ પર જુઓ ↗' : 'Watch on YouTube ↗'}
              </a>
            </div>
          </div>

          {/* Popular Articles */}
          <div className="w-full rounded-sm border border-border bg-card p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-[#B3121B] font-black text-[13.5px] md:text-[14px] select-none">
                {language === 'gu' ? 'લોકપ્રિય Stories' : 'Popular Stories'}
              </span>
              <Link
                href="/category/trending"
                className="text-[11px] font-black text-[#B3121B]/95 hover:text-[#B3121B] hover:underline"
              >
                {language === 'gu' ? 'વધુ જુઓ →' : 'View all →'}
              </Link>
            </div>

            <div className="flex flex-col divide-y divide-border">
              {uniqueTrendingArt.slice(0, 4).map((art, idx) => (
                <Link
                  key={art.id}
                  href={`/news/${art.slug}`}
                  className="group flex items-start gap-3 py-3.5 hover:bg-muted/10 rounded-md transition-all px-2.5 first:pt-1 last:pb-1"
                >
                  <span className="text-[18px] font-black text-[#B3121B]/85 group-hover:text-[#B3121B] font-serif w-5 shrink-0 mt-0.5 transition-colors select-none text-center">
                    {idx + 1}
                  </span>
                  <h4 className="text-[12.5px] font-black leading-snug text-foreground group-hover:text-[#B3121B] transition-colors flex-1 line-clamp-3">
                    {getArticleTitle(art, language)}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>



      <VideoDesk videos={videos.slice(0, 7)} language={language} showShorts={false} />

      <CityHyperlocalSection language={language} />

      <NationalSection language={language} />

      <TrendingSection />

      {/* Remaining bottom content layout (Latest Updates & Popular Stories) */}
      <section className="mt-8 border-t border-border/60 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_336px] gap-8 items-start">
          <div className="flex flex-col gap-10 min-w-0">
            <LatestUpdatesSection view="timeline" />
            <PopularStoriesSection language={language} view="content" />
          </div>
          <div className="flex flex-col gap-6 sticky top-20 select-none">
            <LatestUpdatesSection view="sidebar" />
            <PopularStoriesSection language={language} view="sidebar" />
          </div>
        </div>
      </section>

      <InstagramStories />

      <WorldSection language={language} />

      <PoliticsSection language={language} />

      <WebStoriesSection />

      {/* Main 2-Column Section: Crime (Left) + Sidebar (Right) */}
      <section className="mx-auto max-w-screen-xl px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_336px] gap-8 items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-10 min-w-0">
            <CrimeSection language={language} view="content" />
          </div>

          {/* Right Column / Sidebar */}
          <div className="flex flex-col gap-6 sticky top-20 select-none">
            {/* Gold & Silver Rates Widget */}
            <div>
              <div className="flex items-end gap-1.5 h-[46px] border-b-[3.5px] border-slate-950 dark:border-slate-800 pb-2.5 mb-6">
                <span className="text-[#B3121B] text-[15px] font-extrabold leading-none pb-0.5">♦</span>
                <h3 className="text-[15px] font-black text-foreground leading-none pb-0.5">
                  {language === 'gu' ? 'સોના-ચાંદીના ભાવ' : 'Gold & Silver Rates'}
                </h3>
              </div>

              <div className="border border-border/80 rounded-sm bg-card p-3.5 space-y-3.5 shadow-sm">
                {/* Gold Rate Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-extrabold select-none shadow-sm">
                      🏅
                    </div>
                    <div>
                      <h4 className="text-[14px] text-foreground leading-tight" style={{ fontFamily: "'Hind Vadodara', 'Noto Sans Gujarati', sans-serif", fontWeight: 700 }}>
                        {language === 'gu' ? 'Gold (10 Grams)' : 'Gold (10 Grams)'}
                      </h4>
                      <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                        {language === 'gu' ? '24 Karat' : '24 Karat'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] text-foreground leading-none" style={{ fontFamily: "'Hind Vadodara', 'Noto Sans Gujarati', sans-serif", fontWeight: 800 }}>
                      ₹73,450
                    </p>
                    <p className="text-[11px] font-bold text-emerald-600 flex items-center justify-end gap-0.5 mt-1 select-none">
                      ▲ ₹450
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border/40" />

                {/* Silver Rate Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 font-extrabold select-none shadow-sm">
                      🥈
                    </div>
                    <div>
                      <h4 className="text-[14px] text-foreground leading-tight" style={{ fontFamily: "'Hind Vadodara', 'Noto Sans Gujarati', sans-serif", fontWeight: 700 }}>
                        {language === 'gu' ? 'Silver (1 Kg)' : 'Silver (1 Kg)'}
                      </h4>
                      <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                        {language === 'gu' ? 'Per Kg' : 'Per Kg'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] text-foreground leading-none" style={{ fontFamily: "'Hind Vadodara', 'Noto Sans Gujarati', sans-serif", fontWeight: 800 }}>
                      ₹82,800
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground flex items-center justify-end gap-0.5 mt-1 select-none">
                      — {language === 'gu' ? 'Stable' : 'Stable'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather, WhatsApp, and Astrology */}
            <CrimeSection language={language} view="sidebar" />
          </div>
        </div>
      </section>

      <EntertainTechLifeSection language={language} />

      <FactCheckSection language={language} />

      <PhotoGallerySection language={language} />



      <VideoDesk videos={videos.slice(0, 7)} language={language} onlyShorts={true} />

      <WeatherDashboardSection language={language} />

      <LiveCenterSection language={language} />


      {/* Banner Ad Section */}
      <div className="mx-auto max-w-screen-xl px-2 py-2 mt-4 select-none">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 md:p-6 bg-white border border-dashed border-[#c3c8cf] rounded-md shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
            <span className="text-[#e02020] text-xs font-black uppercase tracking-wider whitespace-nowrap">
              GROW WITH GUJARAT POST
            </span>
            <span className="text-[#1a1a1a] text-sm sm:text-base font-extrabold">
              {language === 'gu' ? 'તમારી બ્રાન્ડ ગુજરાત સુધી પહોંચાડો.' : 'Put your brand in front of Gujarat.'}
            </span>
          </div>
          <Link
            href="/advertise"
            className="flex items-center gap-1 bg-[#1a1a1a] hover:bg-[#333] text-white text-xs font-black px-4 py-2.5 rounded-sm transition-all"
          >
            {language === 'gu' ? 'જાહેરાત આપો' : 'Advertise now'} ↗
          </Link>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="mx-auto max-w-screen-xl px-2 py-2 mb-6 select-none">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 md:p-8 bg-[#140e0c] text-white rounded-xl shadow-md border border-white/5">
          <div className="flex flex-col gap-2 max-w-xl text-center lg:text-left">
            <h3 className="text-lg sm:text-xl md:text-2xl font-black leading-tight">
              {language === 'gu'
                ? 'દરરોજ સવારે ગુજરાતના મુખ્ય સમાચાર — તમારા ઈનબોક્સમાં'
                : 'Every morning main news of Gujarat — in your inbox'}
            </h3>
            <p className="text-xs sm:text-sm text-[#a3a3a3] font-bold">
              {language === 'gu'
                ? 'ન્યૂઝલેટર સબસ્ક્રાઇબ કરો અને દિવસની શરૂઆત માહિતી સાથે કરો.'
                : 'Subscribe to our newsletter and start your day informed.'}
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full lg:w-auto min-w-0 sm:min-w-[400px]"
          >
            <input
              type="email"
              placeholder={language === 'gu' ? 'તમારો ઈમેલ દાખલ કરો' : 'Enter your email'}
              className="flex-1 px-4 py-3 bg-[#241c19] border border-[#3c302a] text-white text-sm rounded-sm focus:outline-none focus:border-[#e02020] placeholder-[#6d5e56]"
              required
            />
            <button
              type="submit"
              className="bg-[#e02020] hover:bg-[#c01818] text-white text-sm font-black px-6 py-3 rounded-sm transition-all whitespace-nowrap"
            >
              {language === 'gu' ? 'સબસ્ક્રાઇબ' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* YouTube Video Section Before Footer */}
      <div className="mx-auto max-w-screen-xl px-2 my-6">
        <VideoDesk videos={videos} language={language} />
      </div>
    </div>
  );
}

/* --- Video Desk Section ---------------------------------------------------- */
function VideoDesk({ videos, language, showShorts = true, onlyShorts = false }: { videos: typeof VIDEOS; language: Language; showShorts?: boolean; onlyShorts?: boolean }) {
  const [playId, setPlayId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const sidebarPaused = useRef(false);
  const isShortsPaused = useRef(false);

  // Auto-scroll the right sidebar using setInterval (checks ref each tick)
  useEffect(() => {
    const interval = setInterval(() => {
      const el = sidebarRef.current;
      if (!el || sidebarPaused.current) return;
      el.scrollTop += 1;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
        el.scrollTop = 0;
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll the horizontal Shorts container smoothly (60fps continuous loop)
  useEffect(() => {
    if (!onlyShorts) return;
    let animId: number;
    const scrollStep = () => {
      const el = scrollContainerRef.current;
      if (el && !isShortsPaused.current && !playId) {
        el.scrollLeft += 0.8;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(scrollStep);
    };
    animId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animId);
  }, [onlyShorts, playId]);

  if (!videos.length) return null;

  const featuredVideo = videos[0];
  const sidebarVideos = videos.slice(1, 9);

  const updateArrows = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 10);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (onlyShorts) {
    const customShorts = [
      {
        id: 's1',
        categoryGu: 'હવામાન',
        categoryEn: 'Weather',
        titleGu: '60 સેકન્ડમાં વરસાદ એલર્ટ',
        viewsGu: '12K',
        duration: '0:60',
        isBannerCard: true,
        youtubeId: 'sA6BrUmBXiA'
      },
      {
        id: 's2',
        categoryGu: 'ગુજરાત',
        categoryEn: 'Gujarat',
        titleGu: 'ગુજરાત ટાઇટન્સની ટ્રેનિંગ મોમેન્ટ',
        viewsGu: '8.4K',
        duration: '0:45',
        image: '/assets/demo/3.jpg',
        youtubeId: 'rQHoqCTiQvI'
      },
      {
        id: 's3',
        categoryGu: 'બિઝનેસ',
        categoryEn: 'Business',
        titleGu: 'શેર બજારમાં ઐતિહાસિક ઉછાળો',
        viewsGu: '6.7K',
        duration: '0:40',
        image: '/assets/demo/5.jpg',
        youtubeId: 'WF2Kuec5HV0'
      },
      {
        id: 's4',
        categoryGu: 'લાઈફસ્ટાઈલ',
        categoryEn: 'Lifestyle',
        titleGu: 'ચોમાસામાં આરોગ્ય ટિપ્સ',
        viewsGu: '14.2K',
        duration: '0:40',
        image: '/assets/demo/6.jpg',
        youtubeId: 'LDDtOMwdJ_0'
      },
      {
        id: 's5',
        categoryGu: 'ફિટનેસ',
        categoryEn: 'Fitness',
        titleGu: 'યોગા અને માનસિક શાંતિ',
        viewsGu: '9.3K',
        duration: '0:35',
        image: '/assets/demo/7.jpg',
        youtubeId: '-iXZuFoHqiw'
      },
      {
        id: 's6',
        categoryGu: 'ટેકનોલોજી',
        categoryEn: 'Technology',
        titleGu: 'નવા AI ટૂલ્સની શક્તિશાળી સુવિધાઓ',
        viewsGu: '7.1K',
        duration: '0:30',
        image: '/assets/demo/8.jpg',
        youtubeId: 'uJalvs-jgFc'
      },
      {
        id: 's7',
        categoryGu: 'સમાચાર',
        categoryEn: 'News',
        titleGu: 'નવરાત્રી સેટની એક્લુદ ક્લિપ',
        viewsGu: '11K',
        duration: '0:59',
        image: '/assets/demo/1.jpg',
        youtubeId: 'A_5vL-ngK4M'
      },
      {
        id: 's8',
        categoryGu: 'રાજકારણ',
        categoryEn: 'Politics',
        titleGu: 'વિધાનસભા ચોમાસુ સત્રના તાજા દ્રશ્યો',
        viewsGu: '15.8K',
        duration: '0:50',
        image: '/assets/demo/4.jpg',
        youtubeId: 'sA6BrUmBXiA'
      },
      {
        id: 's9',
        categoryGu: 'સ્પોર્ટ્સ',
        categoryEn: 'Sports',
        titleGu: 'ક્રિકેટ મેચની રોમાંચક પળો',
        viewsGu: '18.4K',
        duration: '0:42',
        image: '/assets/demo/2.jpg',
        youtubeId: 'rQHoqCTiQvI'
      },
      {
        id: 's10',
        categoryGu: 'મનોરંજન',
        categoryEn: 'Entertainment',
        titleGu: 'નવી ગુજરાતી ફિલ્મનું ટ્રેલર',
        viewsGu: '22.1K',
        duration: '0:48',
        image: '/assets/demo/6.jpg',
        youtubeId: 'WF2Kuec5HV0'
      },
      {
        id: 's11',
        categoryGu: 'શિક્ષણ',
        categoryEn: 'Education',
        titleGu: 'વિદ્યાર્થીઓ માટે સ્કોલરશિપ અપડેટ',
        viewsGu: '10.5K',
        duration: '0:38',
        image: '/assets/demo/3.jpg',
        youtubeId: 'LDDtOMwdJ_0'
      },
      {
        id: 's12',
        categoryGu: 'વાયરલ',
        categoryEn: 'Viral',
        titleGu: 'સોશિયલ મીડિયા પર વાયરલ થયેલો વીડિયો',
        viewsGu: '25.6K',
        duration: '0:33',
        image: '/assets/demo/7.jpg',
        youtubeId: '-iXZuFoHqiw'
      }
    ];

    return (
      <section className="mt-6">
        {/* Red Panel containing only Shorts */}
        <div className="w-full bg-[#B3121B] text-white rounded-sm px-5 md:px-8 py-6 border border-white/10 relative overflow-hidden shadow-lg">

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between mb-5 select-none">
            <span className="bg-white/20 text-white font-black text-[12.5px] px-3.5 py-1.5 rounded-sm tracking-wide border border-white/25">
              {language === 'gu' ? 'શોર્ટ  વીડિયો' : language === 'hi' ? 'शॉर्ट  वीडियो' : 'Short Videos'}
            </span>
            <Link
              href="/shorts"
              className="text-white/95 font-extrabold text-[13px] md:text-[14px] hover:text-white hover:underline flex items-center gap-1"
            >
              {language === 'gu' ? 'બધા શોર્ટ્સ →' : 'All Shorts →'}
            </Link>
          </div>

          {/* Shorts Strip */}
          <div className="relative z-10">
            <div className="relative">
              {/* Left arrow */}
              {showLeftArrow && (
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  className="absolute left-[-14px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-[#B3121B] flex items-center justify-center shadow-xl border border-slate-200 hover:scale-105 transition-transform"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-6 w-6 stroke-[3]" />
                </button>
              )}

              {/* Scrollable list */}
              <div
                ref={scrollContainerRef}
                onScroll={updateArrows}
                onMouseEnter={() => { isShortsPaused.current = true; }}
                onMouseLeave={() => { isShortsPaused.current = false; }}
                className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
              >
                {[...customShorts, ...customShorts].map((card, index) => (
                  <div
                    key={`${card.id}-${index}`}
                    className="group relative flex-shrink-0 w-[145px] sm:w-[165px] md:w-[175px] cursor-pointer"
                    onClick={() => setPlayId(card.youtubeId)}
                  >
                    {/* Vertical Card 9/16 matching Image 1 */}
                    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/15 shadow-md flex flex-col justify-between p-3 select-none">
                      {card.isBannerCard ? (
                        <div className="absolute inset-0 bg-gradient-to-b from-[#800A11] via-[#5C060B] to-[#3B0306] flex flex-col justify-between p-3.5">
                          {/* Top row */}
                          <div className="flex items-center justify-between z-10">
                            <span className="bg-[#B3121B] text-white px-2.5 py-0.5 text-[10.5px] font-black rounded-full shadow-sm">
                              {language === 'gu' ? card.categoryGu : card.categoryEn}
                            </span>
                            <MoreVertical className="h-4 w-4 text-white/80" />
                          </div>

                          {/* Middle Alert Banner Text */}
                          <div className="my-auto text-left leading-tight py-2 z-10">
                            <h3 className="text-3xl font-black text-white drop-shadow">60</h3>
                            <h3 className="text-lg font-black text-white drop-shadow">સેકન્ડમાં</h3>
                            <h3 className="text-lg font-black text-[#B3121B] bg-white px-1.5 py-0.5 inline-block rounded-sm mt-0.5 shadow">વરસાદ</h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <h3 className="text-lg font-black text-white drop-shadow">એલર્ટ</h3>
                              <span className="w-6 h-6 rounded-full bg-[#B3121B] text-white flex items-center justify-center shadow">
                                <Play className="h-3 w-3 fill-current ml-0.5" />
                              </span>
                            </div>
                          </div>

                          {/* Bottom metadata */}
                          <div className="z-10">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/90">
                              <Eye className="h-3 w-3" />
                              <span>{card.viewsGu} વ્યુ</span>
                              <span>|</span>
                              <Clock className="h-3 w-3" />
                              <span>{card.duration}</span>
                            </div>
                            <div className="h-1 w-4 bg-[#B3121B] rounded-full mt-1.5" />
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Image */}
                          <Image
                            src={card.image || '/assets/demo/3.jpg'}
                            alt={card.titleGu}
                            fill
                            sizes="175px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                          {/* Top row */}
                          <div className="relative z-10 flex items-center justify-between">
                            <span className="bg-[#B3121B] text-white px-2.5 py-0.5 text-[10.5px] font-black rounded-full shadow-sm">
                              {language === 'gu' ? card.categoryGu : card.categoryEn}
                            </span>
                            <MoreVertical className="h-4 w-4 text-white/80" />
                          </div>

                          {/* Center Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center z-10">
                            <span className="w-11 h-11 rounded-full bg-[#B3121B] text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 border border-white/20">
                              <Play className="h-5 w-5 fill-current ml-0.5" />
                            </span>
                          </div>

                          {/* Bottom title & metadata */}
                          <div className="relative z-10 mt-auto">
                            <p className="text-white text-[12px] font-black leading-snug line-clamp-2 drop-shadow">
                              {card.titleGu}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-white/90 mt-1.5 drop-shadow">
                              <Eye className="h-3 w-3 text-white/80" />
                              <span>{card.viewsGu} વ્યુ</span>
                              <span>|</span>
                              <Clock className="h-3 w-3 text-white/80" />
                              <span>{card.duration}</span>
                            </div>
                            <div className="h-1 w-4 bg-[#B3121B] rounded-full mt-1.5" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right arrow */}
              {showRightArrow && (
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  className="absolute right-[-14px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-[#B3121B] flex items-center justify-center shadow-xl border border-slate-200 hover:scale-105 transition-transform"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-6 w-6 stroke-[3]" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Video Player Modal */}
        {playId && (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4 py-6"
            onClick={() => setPlayId(null)}
          >
            <div
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute right-4 top-4 z-20">
                <button
                  type="button"
                  onClick={() => setPlayId(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${playId}?autoplay=1&rel=0`}
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="mt-6">
      {/* ── Red Panel containing Videos ── */}
      <div className="w-full bg-[#B3121B] text-white rounded-sm px-5 md:px-8 pt-6 pb-8 border border-white/10 relative overflow-hidden shadow-lg">

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-white font-black text-[18px] md:text-[20px] select-none tracking-tight">
              {language === 'gu' ? 'વીડિયો' : 'Videos'}
            </span>
          </div>
          <Link
            href="/videos"
            className="text-white/95 font-extrabold text-[13px] md:text-[14px] hover:text-white hover:underline flex items-center gap-1"
          >
            {language === 'gu' ? 'વધુ જુઓ →' : 'See All →'}
          </Link>
        </div>

        {/* 2-Column Layout: Featured left, List right */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-6 items-start">

          {/* Left: Featured Video */}
          <div
            className="group flex flex-col cursor-pointer"
            onClick={() => setPlayId(featuredVideo.youtubeId)}
          >
            {/* Large thumbnail */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-black/30 mb-3.5 shadow-inner border border-white/10">
              <Image
                src={featuredVideo.thumbnail}
                alt={featuredVideo.titleGu}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              {/* Large play button */}
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[54px] h-[54px] rounded-full bg-white/95 text-[#B3121B] flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                <Play className="h-6 w-6 fill-current ml-0.5" />
              </span>
              {/* Duration badge */}
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-black px-2 py-0.5 rounded-sm">
                {featuredVideo.duration}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-extrabold text-[16px] md:text-[19px] leading-snug text-white group-hover:underline transition-all line-clamp-2">
              {getLocalized(language, { en: featuredVideo.title, gu: featuredVideo.titleGu, hi: featuredVideo.titleHi })}
            </h3>

            {/* Meta */}
            <div className="flex items-center gap-1.5 mt-2.5 text-[11.5px] text-white/70 font-semibold select-none">
              <Eye className="h-3.5 w-3.5" />
              <span>
                {formatViews(featuredVideo.views)} {language === 'gu' ? 'વ્યુઝ' : 'views'}
              </span>
              <span>·</span>
              <span>{featuredVideo.duration}</span>
            </div>
          </div>

          {/* Right: Sidebar container */}
          <div className="flex flex-col min-w-0">
            {/* Sidebar video list */}
            <div
              ref={sidebarRef}
              onMouseEnter={() => { sidebarPaused.current = true; }}
              onMouseLeave={() => { sidebarPaused.current = false; }}
              className="flex flex-col divide-y divide-white/10 max-h-[382px] overflow-y-auto p-3 pr-2 scrollbar-hide bg-black/15 rounded-sm"
            >
              {sidebarVideos.map((v) => (
                <div
                  key={v.id}
                  className="group flex gap-3 py-3.5 cursor-pointer first:pt-0"
                  onClick={() => setPlayId(v.youtubeId)}
                >
                  {/* Thumbnail */}
                  <div className="relative h-[68px] w-[108px] shrink-0 overflow-hidden rounded-sm bg-black/30 border border-white/10">
                    <Image
                      src={v.thumbnail}
                      alt={v.titleGu}
                      fill
                      sizes="108px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Mini play */}
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 text-[#B3121B] flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">
                      <Play className="h-3 w-3 fill-current ml-0.5" />
                    </span>
                    {/* Duration */}
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                      {v.duration}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <h4 className="text-[13px] font-extrabold leading-snug text-white group-hover:underline transition-all line-clamp-2">
                      {getLocalized(language, { en: v.title, gu: v.titleGu, hi: v.titleHi })}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-white/65 font-semibold">
                      <span>{formatViews(v.views)}</span>
                      <span>·</span>
                      <span>{v.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {playId && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4 py-6"
          onClick={() => setPlayId(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute right-4 top-4 z-20">
              <button
                type="button"
                onClick={() => setPlayId(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${playId}?autoplay=1&rel=0`}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const getZodiacSymbol = (id: string): string => {
  switch (id) {
    case 'aries': return '♈';
    case 'taurus': return '♉';
    case 'gemini': return '♊';
    case 'cancer': return '♋';
    case 'leo': return '♌';
    case 'virgo': return '♍';
    case 'libra': return '♎';
    case 'scorpio': return '♏';
    case 'sagittarius': return '♐';
    case 'capricorn': return '♑';
    case 'aquarius': return '♒';
    case 'pisces': return '♓';
    default: return '♈';
  }
};

const toGuLocal = (num: number | string): string => {
  const guDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return String(num).split("").map(char => {
    const digit = parseInt(char, 10);
    return isNaN(digit) ? char : guDigits[digit];
  }).join("");
};

const getMockTime = (id: string): string => {
  switch (id) {
    case 'c1': return '10:30 AM';
    case 'c2': return '11:30 AM';
    case 'c3': return '12:30 PM';
    case 'l1': return '10:45 AM';
    case 'l2': return '11:15 AM';
    case 'l3': return '12:15 PM';
    case 'l4': return '01:05 PM';
    default: return '02:00 PM';
  }
};

/* --- City Hyperlocal Section ("ગુજરાત" Zone) ----------------------------- */
function CityHyperlocalSection({
  language,
}: {
  language: Language;
}) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('અમદાવાદ');

  // Handle tab change — reset slide index
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSlideIdx(0);
  };

  type SlideItem = {
    id: string; slug: string; image: string;
    titleGu: string; title: string; titleHi: string;
    relativeTimeGu: string; relativeTime: string; relativeTimeHi: string;
    categoryGu: string; category: string; categoryHi: string;
    viewsGu: string; views: string;
    excerptGu: string; excerpt: string; excerptHi: string;
    tags: string[];
  };
  type ListItem = {
    id: string; slug: string; image: string;
    titleGu: string; title: string; titleHi: string;
    relativeTimeGu: string; relativeTime: string; relativeTimeHi: string;
    categoryGu: string; category: string; categoryHi: string;
    viewsGu: string; views: string;
  };

  const cityData: Record<string, { slides: SlideItem[]; list: ListItem[] }> = {
    'અમદાવાદ': {
      slides: [
        {
          id: 'ahm-c1', slug: 'ahmedabad-metro-phase-two-trial-run-346', image: '/assets/demo/3.jpg',
          titleGu: 'અમદાવાદમાં મેટ્રો ટ્રેનના ફેઝ-2નું સફળ ટ્રાયલ રન પૂર્ણ, ટૂંક સમયમાં શરૂ થશે સેવા',
          title: 'Phase-2 trial run of Ahmedabad Metro completed successfully, services soon',
          titleHi: 'अहमदाबाद मेट्रो फेज-2 का सफल ट्रायल रन पूरा, सेवाएं जल्द',
          relativeTimeGu: '30 મિનિટ પહેલાં', relativeTime: '30 mins ago', relativeTimeHi: '30 मिनट पहले',
          categoryGu: 'અમદાવાદ', category: 'Ahmedabad', categoryHi: 'अहमदाबाद',
          viewsGu: '34K', views: '34K',
          excerptGu: 'મેટ્રો ટ્રેનના ફેઝ-2 ટ્રાયલ રનને ગ્રીન સિગ્નલ મળી ગયું છે. ખૂબ જ ટૂંક સમયમાં મુસાફરો આ સેવાનો લાભ લઈ શકશે.',
          excerpt: 'The Phase-2 trial run of the metro train has received a green signal. Passengers will benefit soon.',
          excerptHi: 'मेट्रो ट्रेन के फेज-2 ट्रायल रन को हरी झंडी मिल गई है। यात्री जल्द लाभ उठा सकेंगे।',
          tags: ['મેટ્રો', 'વિકાસ', 'અમદાવાદ', 'ટ્રાફિક']
        },
        {
          id: 'ahm-c2', slug: 'ahmedabad-riverfront-beautification-350', image: '/assets/demo/6.jpg',
          titleGu: 'સાબરમતી રિવરફ્રન્ટ પર નવા બ્યુટીફિકેશન પ્રોજેક્ટનો શુભારંભ',
          title: 'New beautification project launched on Sabarmati Riverfront',
          titleHi: 'साबरमती रिवरफ्रंट पर नए ब्यूटीफिकेशन प्रोजेक्ट की शुरुआत',
          relativeTimeGu: '1 કલાક પહેલાં', relativeTime: '1 hour ago', relativeTimeHi: '1 घंटा पहले',
          categoryGu: 'અમદાવાદ', category: 'Ahmedabad', categoryHi: 'अहमदाबाद',
          viewsGu: '28K', views: '28K',
          excerptGu: 'રિવરફ્રન્ટ પર ગાર્ડન, વોકિંગ ટ્રેક અને ફૂડ ઝોનનું ભવ્ય આયોજન. AMC કમિશનરે જણાવ્યું કે આ પ્રોજેક્ટ 6 મહિનામાં પૂર્ણ થશે.',
          excerpt: 'Grand plans for garden, walking track and food zone on the riverfront. AMC Commissioner said the project will complete in 6 months.',
          excerptHi: 'रिवरफ्रंट पर गार्डन, वॉकिंग ट्रैक और फूड ज़ोन की भव्य योजना।',
          tags: ['સિવિક', 'વિકાસ', 'પર્યટન', 'AMC']
        },
        {
          id: 'ahm-c3', slug: 'ahmedabad-new-traffic-rules-351', image: '/assets/demo/1.jpg',
          titleGu: 'અમદાવાદમાં આજથી નવા ટ્રાફિક નિયમ લાગુ! ભારે દંડની જોગવાઈ',
          title: 'New traffic rules effective from today in Ahmedabad! Heavy penalty provisions',
          titleHi: 'अहमदाबाद में आज से नए ट्रैफिक नियम लागू! भारी जुर्माने का प्रावधान',
          relativeTimeGu: '2 કલાક પહેલાં', relativeTime: '2 hours ago', relativeTimeHi: '2 घंटे पहले',
          categoryGu: 'અમદાવાદ', category: 'Ahmedabad', categoryHi: 'अहमदाबाद',
          viewsGu: '41K', views: '41K',
          excerptGu: 'ટ્રાફિક પોલીસે નવા નિયમોની જાહેરાત કરી. હેલ્મેટ વિના, સીટ બેલ્ટ વિના અને ઝડપી ડ્રાઇવિંગ પર ભારે દંડ.',
          excerpt: 'Traffic police announced new rules. Heavy fines for riding without helmet, seatbelt, and overspeeding.',
          excerptHi: 'ट्रैफिक पुलिस ने नए नियमों की घोषणा की। हेलमेट, सीटबेल्ट और ओवरस्पीडिंग पर भारी जुर्माना।',
          tags: ['ટ્રાફિક', 'પોલીસ', 'દંડ', 'નિયમ']
        }
      ],
      list: [
        {
          id: 'ahm-l1', slug: 'ahmedabad-cyber-crime-helpline-352', image: '/assets/demo/5.jpg',
          titleGu: 'સાયબર ક્રાઇમ સામે મોટી ડ્રાઇવ: અમદાવાદ પોલીસે એડવાઈઝરી જાહેર કરી',
          title: 'Major drive against cyber crime: Ahmedabad police issues advisory',
          titleHi: 'साइबर अपराध के खिलाफ बड़ा अभियान: अहमदाबाद पुलिस ने एडवाइजरी जारी की',
          relativeTimeGu: '3 કલાક પહેલાં', relativeTime: '3 hours ago', relativeTimeHi: '3 घंटे पहले',
          categoryGu: 'અમદાવાદ', category: 'Ahmedabad', categoryHi: 'अहमदाबाद',
          viewsGu: '46K', views: '46K'
        },
        {
          id: 'ahm-l2', slug: 'ahmedabad-water-supply-improvement-353', image: '/assets/demo/4.jpg',
          titleGu: 'અમદાવાદમાં પાણી વિતરણ વ્યવસ્થામાં મોટો સુધારો, નવી પાઈપલાઈન નંખાશે',
          title: 'Major improvement in water distribution system in Ahmedabad, new pipeline to be laid',
          titleHi: 'अहमदाबाद में पानी वितरण व्यवस्था में बड़ा सुधार, नई पाइपलाइन बिछेगी',
          relativeTimeGu: '4 કલાક પહેલાં', relativeTime: '4 hours ago', relativeTimeHi: '4 घंटे पहले',
          categoryGu: 'અમદાવાદ', category: 'Ahmedabad', categoryHi: 'अहमदाबाद',
          viewsGu: '32K', views: '32K'
        },
        {
          id: 'ahm-l3', slug: 'ahmedabad-heritage-walk-record-354', image: '/assets/demo/2.jpg',
          titleGu: 'અમદાવાદ હેરિટેજ વોકમાં રેકોર્ડ ભાગીદારી, પ્રવાસીઓનો જબરદસ્ત ઉત્સાહ',
          title: 'Record participation in Ahmedabad Heritage Walk, tremendous enthusiasm among tourists',
          titleHi: 'अहमदाबाद हेरिटेज वॉक में रिकॉर्ड भागीदारी, पर्यटकों में जबरदस्त उत्साह',
          relativeTimeGu: '5 કલાક પહેલાં', relativeTime: '5 hours ago', relativeTimeHi: '5 घंटे पहले',
          categoryGu: 'અમદાવાદ', category: 'Ahmedabad', categoryHi: 'अहमदाबाद',
          viewsGu: '25K', views: '25K'
        },
        {
          id: 'ahm-l4', slug: 'ahmedabad-smart-city-cctv-355', image: '/assets/demo/8.jpg',
          titleGu: 'સ્માર્ટ સિટી હેઠળ 500 નવા CCTV કેમેરા લાગશે, સુરક્ષા વધશે',
          title: '500 new CCTV cameras under Smart City, security to increase',
          titleHi: 'स्मार्ट सिटी के तहत 500 नए CCTV कैमरे लगेंगे, सुरक्षा बढ़ेगी',
          relativeTimeGu: '6 કલાક પહેલાં', relativeTime: '6 hours ago', relativeTimeHi: '6 घंटे पहले',
          categoryGu: 'અમદાવાદ', category: 'Ahmedabad', categoryHi: 'अहमदाबाद',
          viewsGu: '19K', views: '19K'
        },
        {
          id: 'ahm-l5', slug: 'ahmedabad-metro-routes-expanded-356', image: '/assets/demo/3.jpg',
          titleGu: 'અમદાવાદમાં ટ્રાફિક સમસ્યા નિવારવા નવા ફ્લાયઓવર પ્રોજેક્ટની જાહેરાત',
          title: 'New flyover projects announced to resolve traffic issues in Ahmedabad',
          titleHi: 'अहमदाबाद में ट्रैफिक समस्या से निपटने के लिए नए फ्लाईओवर प्रोजेक्ट्स की घोषणा',
          relativeTimeGu: '8 કલાક પહેલાં', relativeTime: '8 hours ago', relativeTimeHi: '8 घंटे पहले',
          categoryGu: 'ટ્રાફિક', category: 'Traffic', categoryHi: 'ट्रैफिक',
          viewsGu: '15K', views: '15K'
        }
      ]
    },
    'સુરત': {
      slides: [
        {
          id: 'sur-c1', slug: 'surat-diamond-trading-hall-inauguration-345', image: '/assets/demo/1.jpg',
          titleGu: 'સુરતમાં ડાયમંડ બુર્સમાં નવા ટ્રેડિંગ સેન્ટરનું ઉદ્ઘાટન, વેપારીઓ ખુશખુશાલ',
          title: 'Inauguration of new trading center in Surat Diamond Bourse, merchants happy',
          titleHi: 'सूरत डायमंड बुर्स में नए ट्रेडिंग सेंटर का उद्घाटन, व्यापारी खुश',
          relativeTimeGu: '1 કલાક પહેલાં', relativeTime: '1 hour ago', relativeTimeHi: '1 घंटा पहले',
          categoryGu: 'સુરત', category: 'Surat', categoryHi: 'सूरत',
          viewsGu: '56K', views: '56K',
          excerptGu: 'સુરત ડાયમંડ બુર્સ વૈશ્વિક સ્તરે વેપાર માટે સજ્જ થઈ ગયું છે. આ નવા સેન્ટરથી વેપારમાં સરળતા રહેશે.',
          excerpt: 'Surat Diamond Bourse is now ready for global trade. This new center will make trading easier.',
          excerptHi: 'सूरत डायमंड बुर्स वैश्विक व्यापार के लिए तैयार है। इस नए केंद्र से व्यापार आसान होगा।',
          tags: ['ડાયમંડ', 'બિઝનેસ', 'સુરત', 'વેપાર']
        },
        {
          id: 'sur-c2', slug: 'surat-textile-market-boom-360', image: '/assets/demo/7.jpg',
          titleGu: 'સુરત ટેક્સટાઇલ માર્કેટમાં જોરદાર તેજી, વેપારીઓમાં ખુશીની લહેર',
          title: 'Strong boom in Surat textile market, wave of joy among traders',
          titleHi: 'सूरत कपड़ा बाजार में जोरदार तेजी, व्यापारियों में खुशी की लहर',
          relativeTimeGu: '2 કલાક પહેલાં', relativeTime: '2 hours ago', relativeTimeHi: '2 घंटे पहले',
          categoryGu: 'સુરત', category: 'Surat', categoryHi: 'सूरत',
          viewsGu: '43K', views: '43K',
          excerptGu: 'ચોમાસા પહેલાં ટેક્સટાઇલ માર્કેટમાં ભારે ડિમાન્ડ. નવા ઓર્ડરોથી વેપારીઓ ખુશ. નિકાસમાં પણ વધારો.',
          excerpt: 'Heavy demand in textile market before monsoon. Traders happy with new orders. Exports also increase.',
          excerptHi: 'मानसून से पहले कपड़ा बाजार में भारी मांग। नए ऑर्डरों से व्यापारी खुश।',
          tags: ['ટેક્સટાઇલ', 'બિઝનેસ', 'નિકાસ', 'સુરત']
        },
        {
          id: 'sur-c3', slug: 'surat-flood-preparedness-361', image: '/assets/demo/4.jpg',
          titleGu: 'સુરત મહાનગરપાલિકાએ ચોમાસા માટે તૈયારીઓ વધારી, ડ્રેનેજ સિસ્ટમ અપગ્રેડ',
          title: 'Surat Municipal Corporation increases monsoon preparedness, drainage system upgraded',
          titleHi: 'सूरत नगर निगम ने मानसून की तैयारियां बढ़ाई, ड्रेनेज सिस्टम अपग्रेड',
          relativeTimeGu: '3 કલાક પહેલાં', relativeTime: '3 hours ago', relativeTimeHi: '3 घंटे पहले',
          categoryGu: 'સુરત', category: 'Surat', categoryHi: 'सूरत',
          viewsGu: '31K', views: '31K',
          excerptGu: 'ચોમાસા પહેલાં SMC દ્વારા ડ્રેનેજ સફાઈ અને પમ્પિંગ સ્ટેશનોનું સમારકામ. પૂરની સ્થિતિ ટાળવા તૈયારીઓ.',
          excerpt: 'SMC undertakes drainage cleaning and pumping station repairs before monsoon. Preparations to avoid flood situations.',
          excerptHi: 'मानसून से पहले SMC ने ड्रेनेज सफाई और पंपिंग स्टेशनों की मरम्मत की।',
          tags: ['ચોમાસું', 'સિવિક', 'ડ્રેનેજ', 'SMC']
        }
      ],
      list: [
        {
          id: 'sur-l1', slug: 'surat-brts-expansion-362', image: '/assets/demo/2.jpg',
          titleGu: 'સુરત BRTS રૂટમાં વિસ્તરણ, નવા 3 રૂટ ઉમેરાશે',
          title: 'Surat BRTS route expansion, 3 new routes to be added',
          titleHi: 'सूरत BRTS रूट विस्तार, 3 नए रूट जोड़े जाएंगे',
          relativeTimeGu: '3 કલાક પહેલાં', relativeTime: '3 hours ago', relativeTimeHi: '3 घंटे पहले',
          categoryGu: 'સુરત', category: 'Surat', categoryHi: 'सूरत',
          viewsGu: '28K', views: '28K'
        },
        {
          id: 'sur-l2', slug: 'surat-it-hub-growth-363', image: '/assets/demo/5.jpg',
          titleGu: 'સુરતનું IT હબ ઝડપથી વિકસી રહ્યું છે, નવી કંપનીઓ આવી રહી છે',
          title: 'Surat IT hub growing rapidly, new companies arriving',
          titleHi: 'सूरत का IT हब तेजी से बढ़ रहा है, नई कंपनियां आ रही हैं',
          relativeTimeGu: '4 કલાક પહેલાં', relativeTime: '4 hours ago', relativeTimeHi: '4 घंटे पहले',
          categoryGu: 'સુરત', category: 'Surat', categoryHi: 'सूरत',
          viewsGu: '35K', views: '35K'
        },
        {
          id: 'sur-l3', slug: 'surat-river-cleaning-364', image: '/assets/demo/8.jpg',
          titleGu: 'તાપી નદી સફાઈ અભિયાનમાં હજારો જોડાયા, ઐતિહાસિક ભાગીદારી',
          title: 'Thousands join Tapi river cleaning drive, historic participation',
          titleHi: 'तापी नदी सफाई अभियान में हजारों शामिल, ऐतिहासिक भागीदारी',
          relativeTimeGu: '5 કલાક પહેલાં', relativeTime: '5 hours ago', relativeTimeHi: '5 घंटे पहले',
          categoryGu: 'સુરત', category: 'Surat', categoryHi: 'सूरत',
          viewsGu: '42K', views: '42K'
        },
        {
          id: 'sur-l4', slug: 'surat-education-hub-365', image: '/assets/demo/3.jpg',
          titleGu: 'સુરતમાં નવી મેડિકલ કોલેજ મંજૂર, વિદ્યાર્થીઓમાં ઉત્સાહ',
          title: 'New medical college approved in Surat, enthusiasm among students',
          titleHi: 'सूरत में नया मेडिकल कॉलेज मंजूर, छात्रों में उत्साह',
          relativeTimeGu: '7 કલાક પહેલાં', relativeTime: '7 hours ago', relativeTimeHi: '7 घंटे पहले',
          categoryGu: 'સુરત', category: 'Surat', categoryHi: 'सूरत',
          viewsGu: '21K', views: '21K'
        },
        {
          id: 'sur-l5', slug: 'surat-cleanliness-drive-366', image: '/assets/demo/2.jpg',
          titleGu: 'સુરત મહાનગરપાલિકા દ્વારા સ્વચ્છતા અભિયાન અંતર્ગત કડક કાર્યવાહી',
          title: 'Strict action by Surat Municipality under cleanliness drive',
          titleHi: 'सूरत नगर निगम द्वारा स्वच्छता अभियान के तहत सख्त कार्रवाई',
          relativeTimeGu: '9 કલાક પહેલાં', relativeTime: '9 hours ago', relativeTimeHi: '9 घंटे पहले',
          categoryGu: 'સિવિક', category: 'Civic', categoryHi: 'सिविक',
          viewsGu: '22K', views: '22K'
        }
      ]
    },
    'વડોદરા': {
      slides: [
        {
          id: 'vad-c1', slug: 'vadodara-municipality-budget-presented-370', image: '/assets/demo/4.jpg',
          titleGu: 'વડોદરા મ્યુનિ.નું નવું બજેટ રજૂ! પાણી અને રસ્તા પર સૌથી વધુ ભાર',
          title: 'Vadodara Municipal new budget presented! Highest emphasis on water and roads',
          titleHi: 'वडोदरा नगर निगम का नया बजट पेश! पानी और सड़कों पर सबसे ज्यादा जोर',
          relativeTimeGu: '1 કલાક પહેલાં', relativeTime: '1 hour ago', relativeTimeHi: '1 घंटा पहले',
          categoryGu: 'વડોદરા', category: 'Vadodara', categoryHi: 'वडोदरा',
          viewsGu: '61K', views: '61K',
          excerptGu: 'VMC દ્વારા ₹5,000 કરોડનું બજેટ રજૂ. પીવાના પાણી, રસ્તા અને ડ્રેનેજ પર સૌથી વધુ ફાળવણી.',
          excerpt: 'VMC presents Rs 5,000 crore budget. Maximum allocation for drinking water, roads and drainage.',
          excerptHi: 'VMC ने ₹5,000 करोड़ का बजट पेश किया। पीने के पानी, सड़कों और ड्रेनेज पर सबसे ज्यादा आवंटन।',
          tags: ['બજેટ', 'VMC', 'વિકાસ', 'પાણી']
        },
        {
          id: 'vad-c2', slug: 'vadodara-msu-research-breakthrough-371', image: '/assets/demo/2.jpg',
          titleGu: 'MSU ના વૈજ્ઞાનિકોની મોટી શોધ! કેન્સર સારવારમાં નવી આશા',
          title: 'Major discovery by MSU scientists! New hope in cancer treatment',
          titleHi: 'MSU वैज्ञानिकों की बड़ी खोज! कैंसर इलाज में नई उम्मीद',
          relativeTimeGu: '2 કલાક પહેલાં', relativeTime: '2 hours ago', relativeTimeHi: '2 घंटे पहले',
          categoryGu: 'વડોદરા', category: 'Vadodara', categoryHi: 'वडोदरा',
          viewsGu: '48K', views: '48K',
          excerptGu: 'MSU ના બાયોકેમિસ્ટ્રી વિભાગે એક નવી પદ્ધતિ વિકસાવી જે કેન્સરના સમયસર નિદાનમાં મદદ કરશે.',
          excerpt: 'MSU Biochemistry department developed a new method to help in early diagnosis of cancer.',
          excerptHi: 'MSU बायोकेमिस्ट्री विभाग ने एक नई विधि विकसित की जो कैंसर के समय पर निदान में मदद करेगी।',
          tags: ['MSU', 'સંશોધન', 'આરોગ્ય', 'વિજ્ઞાન']
        }
      ],
      list: [
        {
          id: 'vad-l1', slug: 'vadodara-flyover-inauguration-372', image: '/assets/demo/6.jpg',
          titleGu: 'વડોદરામાં નવા ફ્લાયઓવરનું ઉદ્ઘાટન, ટ્રાફિક સમસ્યા હળવી થશે',
          title: 'New flyover inaugurated in Vadodara, traffic problems to ease',
          titleHi: 'वडोदरा में नए फ्लाईओवर का उद्घाटन, ट्रैफिक समस्या कम होगी',
          relativeTimeGu: '3 કલાક પહેલાં', relativeTime: '3 hours ago', relativeTimeHi: '3 घंटे पहले',
          categoryGu: 'વડોદરા', category: 'Vadodara', categoryHi: 'वडोदरा',
          viewsGu: '39K', views: '39K'
        },
        {
          id: 'vad-l2', slug: 'vadodara-navratri-preparation-373', image: '/assets/demo/1.jpg',
          titleGu: 'વડોદરામાં નવરાત્રિની ભવ્ય તૈયારી શરૂ, આયોજકોમાં ઉત્સાહ',
          title: 'Grand Navratri preparations begin in Vadodara, enthusiasm among organizers',
          titleHi: 'वडोदरा में नवरात्रि की भव्य तैयारी शुरू, आयोजकों में उत्साह',
          relativeTimeGu: '5 કલાક પહેલાં', relativeTime: '5 hours ago', relativeTimeHi: '5 घंटे पहले',
          categoryGu: 'વડોદરા', category: 'Vadodara', categoryHi: 'वडोदरा',
          viewsGu: '55K', views: '55K'
        },
        {
          id: 'vad-l3', slug: 'vadodara-school-digital-initiative-374', image: '/assets/demo/7.jpg',
          titleGu: 'વડોદરાની શાળાઓમાં ડિજિટલ ક્રાંતિ, 100 શાળાઓમાં સ્માર્ટ ક્લાસ',
          title: 'Digital revolution in Vadodara schools, smart classes in 100 schools',
          titleHi: 'वडोदरा के स्कूलों में डिजिटल क्रांति, 100 स्कूलों में स्मार्ट क्लास',
          relativeTimeGu: '6 કલાક પહેલાં', relativeTime: '6 hours ago', relativeTimeHi: '6 घंटे पहले',
          categoryGu: 'વડોદરા', category: 'Vadodara', categoryHi: 'वडोदरा',
          viewsGu: '27K', views: '27K'
        },
        {
          id: 'vad-l4', slug: 'vadodara-lakshmi-vilas-palace-restoration-375', image: '/assets/demo/3.jpg',
          titleGu: 'લક્ષ્મી વિલાસ પેલેસનું રિસ્ટોરેશન પૂર્ણ, પ્રવાસીઓ માટે ખુલ્લું',
          title: 'Laxmi Vilas Palace restoration complete, open for tourists',
          titleHi: 'लक्ष्मी विलास पैलेस का रिस्टोरेशन पूरा, पर्यटकों के लिए खुला',
          relativeTimeGu: '8 કલાક પહેલાં', relativeTime: '8 hours ago', relativeTimeHi: '8 घंटे पहले',
          categoryGu: 'વડોદરા', category: 'Vadodara', categoryHi: 'वडोदरा',
          viewsGu: '44K', views: '44K'
        },
        {
          id: 'vad-l5', slug: 'vadodara-sports-complex-376', image: '/assets/demo/6.jpg',
          titleGu: 'વડોદરા સ્પોર્ટ્સ કોમ્પ્લેક્સનું કામ અંતિમ તબક્કામાં, ખેલાડીઓ ખુશ',
          title: 'Vadodara sports complex work in final stage, players happy',
          titleHi: 'वडोदरा स्पोर्ट्स कॉम्प्लेक्स का काम अंतिम चरण में, खिलाड़ी खुश',
          relativeTimeGu: '10 કલાક પહેલાં', relativeTime: '10 hours ago', relativeTimeHi: '10 घंटे पहले',
          categoryGu: 'રમતગમત', category: 'Sports', categoryHi: 'खेल',
          viewsGu: '18K', views: '18K'
        }
      ]
    },
    'રાજકોટ': {
      slides: [
        {
          id: 'raj-c1', slug: 'rajkot-smart-city-roadworks-underway-344', image: '/assets/demo/6.jpg',
          titleGu: 'રાજકોટમાં મોટું કામ! સ્માર્ટ સિટી પ્રોજેક્ટ હેઠળ રસ્તાઓનું ધમધમાટ કામ શરૂ',
          title: 'Major work in Rajkot! Roadworks start in full swing under Smart City project',
          titleHi: 'राजकोट में बड़ा काम! स्मार्ट सिटी प्रोजेक्ट के तहत सड़कों का काम शुरू',
          relativeTimeGu: '1 કલાક પહેલાં', relativeTime: '1 hour ago', relativeTimeHi: '1 घंटा पहले',
          categoryGu: 'રાજકોટ', category: 'Rajkot', categoryHi: 'राजकोट',
          viewsGu: '12K', views: '12K',
          excerptGu: 'શહેરના મુખ્ય વિસ્તારોમાં રસ્તા પહોળા કરવા અને નવી ડ્રેનેજ લાઈન નાખવાનું કામ યુદ્ધના ધોરણે શરૂ કરાયું છે.',
          excerpt: 'Road widening and new drainage line installation have started on a war footing in the main areas of the city.',
          excerptHi: 'शहर के मुख्य क्षेत्रों में सड़कों को चौड़ा करने और ड्रेनेज लाइन बिछाने का काम शुरू।',
          tags: ['સ્માર્ટ સિટી', 'રસ્તા', 'વિકાસ', 'રાજકોટ']
        },
        {
          id: 'raj-c2', slug: 'rajkot-airport-new-terminal-380', image: '/assets/demo/2.jpg',
          titleGu: 'રાજકોટ એરપોર્ટ પર નવા ટર્મિનલનું ટ્રાયલ રન સફળ, ટૂંક સમયમાં ફ્લાઇટ્સ શરૂ',
          title: 'Trial run of new terminal at Rajkot airport successful, flights to start soon',
          titleHi: 'राजकोट हवाई अड्डे पर नए टर्मिनल का ट्रायल रन सफल, उड़ानें जल्द शुरू',
          relativeTimeGu: '2 કલાક પહેલાં', relativeTime: '2 hours ago', relativeTimeHi: '2 घंटे पहले',
          categoryGu: 'રાજકોટ', category: 'Rajkot', categoryHi: 'राजकोट',
          viewsGu: '51K', views: '51K',
          excerptGu: 'રાજકોટ ગ્રીનફિલ્ડ એરપોર્ટ પર નવા ટર્મિનલનું ટ્રાયલ રન સફળતાપૂર્વક પૂર્ણ. દિલ્હી-મુંબઈ ફ્લાઇટ ટૂંક સમયમાં.',
          excerpt: 'Trial run of new terminal at Rajkot Greenfield Airport successfully completed. Delhi-Mumbai flights soon.',
          excerptHi: 'राजकोट ग्रीनफील्ड एयरपोर्ट के नए टर्मिनल का ट्रायल रन सफल। दिल्ली-मुंबई फ्लाइट जल्द।',
          tags: ['એરપોર્ટ', 'ટર્મિનલ', 'ફ્લાઇટ', 'રાજકોટ']
        }
      ],
      list: [
        {
          id: 'raj-l1', slug: 'rajkot-race-course-renovation-381', image: '/assets/demo/5.jpg',
          titleGu: 'રેસ કોર્સ રિંગ રોડનું નવીનીકરણ પૂર્ણ, સાંજે હજારો ફરવા આવે છે',
          title: 'Race Course Ring Road renovation complete, thousands visit in evening',
          titleHi: 'रेस कोर्स रिंग रोड का नवीनीकरण पूरा, शाम को हजारों आते हैं',
          relativeTimeGu: '3 કલાક પહેલાં', relativeTime: '3 hours ago', relativeTimeHi: '3 घंटे पहले',
          categoryGu: 'રાજકોટ', category: 'Rajkot', categoryHi: 'राजकोट',
          viewsGu: '38K', views: '38K'
        },
        {
          id: 'raj-l2', slug: 'rajkot-cricket-stadium-events-382', image: '/assets/demo/8.jpg',
          titleGu: 'રાજકોટ ક્રિકેટ સ્ટેડિયમમાં આંતરરાષ્ટ્રીય મેચની જાહેરાત, ચાહકોમાં ઉત્સાહ',
          title: 'International match announced at Rajkot Cricket Stadium, excitement among fans',
          titleHi: 'राजकोट क्रिकेट स्टेडियम में अंतरराष्ट्रीय मैच की घोषणा, प्रशंसकों में उत्साह',
          relativeTimeGu: '4 કલાક પહેલાં', relativeTime: '4 hours ago', relativeTimeHi: '4 घंटे पहले',
          categoryGu: 'રાજકોટ', category: 'Rajkot', categoryHi: 'राजकोट',
          viewsGu: '62K', views: '62K'
        },
        {
          id: 'raj-l3', slug: 'rajkot-industrial-zone-expansion-383', image: '/assets/demo/4.jpg',
          titleGu: 'રાજકોટ ઔદ્યોગિક ઝોનમાં વિસ્તરણ, 200+ નવા એકમો આવશે',
          title: 'Rajkot industrial zone expansion, 200+ new units to come',
          titleHi: 'राजकोट औद्योगिक ज़ोन में विस्तार, 200+ नई इकाइयां आएंगी',
          relativeTimeGu: '5 કલાક પહેલાં', relativeTime: '5 hours ago', relativeTimeHi: '5 घंटे पहले',
          categoryGu: 'રાજકોટ', category: 'Rajkot', categoryHi: 'राजकोट',
          viewsGu: '45K', views: '45K'
        },
        {
          id: 'raj-l4', slug: 'rajkot-new-hospital-384', image: '/assets/demo/1.jpg',
          titleGu: 'રાજકોટમાં 500 બેડની નવી સરકારી હૉસ્પિટલ મંજૂર',
          title: 'New 500-bed government hospital approved in Rajkot',
          titleHi: 'राजकोट में 500 बेड का नया सरकारी अस्पताल मंजूर',
          relativeTimeGu: '7 કલાક પહેલાં', relativeTime: '7 hours ago', relativeTimeHi: '7 घंटे पहले',
          categoryGu: 'રાજકોટ', category: 'Rajkot', categoryHi: 'राजकोट',
          viewsGu: '33K', views: '33K'
        },
        {
          id: 'raj-l5', slug: 'rajkot-water-supply-project-385', image: '/assets/demo/3.jpg',
          titleGu: 'રાજકોટના સરહદી વિસ્તારો માટે નવી નર્મદા પાઈપલાઈન યોજના મંજૂર',
          title: 'New Narmada pipeline project approved for Rajkot border areas',
          titleHi: 'राजकोट के सीमावर्ती क्षेत्रों के लिए नई नर्मदा पाइपलाइन योजना मंजूर',
          relativeTimeGu: '11 કલાક પહેલાં', relativeTime: '11 hours ago', relativeTimeHi: '11 घंटे पहले',
          categoryGu: 'વિકાસ', category: 'Development', categoryHi: 'विकास',
          viewsGu: '25K', views: '25K'
        }
      ]
    },
    'ગાંધીનગર': {
      slides: [
        {
          id: 'gn-c1', slug: 'gandhinagar-gift-city-fintech-390', image: '/assets/demo/5.jpg',
          titleGu: 'GIFT સિટીમાં ફિનટેક કંપનીઓનું મોટું રોકાણ, 10,000 નોકરીઓ સર્જાશે',
          title: 'Major investment by fintech companies in GIFT City, 10,000 jobs to be created',
          titleHi: 'GIFT सिटी में फिनटेक कंपनियों का बड़ा निवेश, 10,000 नौकरियां पैदा होंगी',
          relativeTimeGu: '1 કલાક પહેલાં', relativeTime: '1 hour ago', relativeTimeHi: '1 घंटा पहले',
          categoryGu: 'ગાંધીનગર', category: 'Gandhinagar', categoryHi: 'गांधीनगर',
          viewsGu: '78K', views: '78K',
          excerptGu: 'GIFT સિટીમાં 15 નવી ફિનટેક અને ઇન્શ્યોરન્સ કંપનીઓ આવી. ગુજરાત સરકારે વિશેષ પેકેજ જાહેર કર્યું.',
          excerpt: '15 new fintech and insurance companies came to GIFT City. Gujarat government announces special package.',
          excerptHi: 'GIFT सिटी में 15 नई फिनटेक और बीमा कंपनियां आईं। गुजरात सरकार ने विशेष पैकेज की घोषणा की।',
          tags: ['GIFT સિટી', 'ફિનટેક', 'રોકાણ', 'નોકરી']
        },
        {
          id: 'gn-c2', slug: 'gandhinagar-assembly-session-391', image: '/assets/demo/3.jpg',
          titleGu: 'ગાંધીનગર વિધાનસભામાં ચોમાસુ સત્ર શરૂ, અનેક મહત્વના વિધેયકો રજૂ',
          title: 'Monsoon session begins in Gandhinagar Assembly, several important bills presented',
          titleHi: 'गांधीनगर विधानसभा में मानसून सत्र शुरू, कई महत्वपूर्ण विधेयक पेश',
          relativeTimeGu: '2 કલાક પહેલાં', relativeTime: '2 hours ago', relativeTimeHi: '2 घंटे पहले',
          categoryGu: 'ગાંધીનગર', category: 'Gandhinagar', categoryHi: 'गांधीनगर',
          viewsGu: '55K', views: '55K',
          excerptGu: 'ચોમાસુ સત્રમાં ખેડૂત કલ્યાણ, શિક્ષણ અને આરોગ્ય સંબંધિત વિધેયકો રજૂ. વિપક્ષ દ્વારા મહત્વના પ્રશ્નો ઉઠાવાયા.',
          excerpt: 'Bills related to farmer welfare, education and health presented in monsoon session. Opposition raised important questions.',
          excerptHi: 'मानसून सत्र में किसान कल्याण, शिक्षा और स्वास्थ्य से जुड़े विधेयक पेश। विपक्ष ने महत्वपूर्ण सवाल उठाए।',
          tags: ['વિધાનસભા', 'ચોમાસુ સત્ર', 'રાજકારણ', 'બિલ']
        }
      ],
      list: [
        {
          id: 'gn-l1', slug: 'gandhinagar-new-it-policy-392', image: '/assets/demo/7.jpg',
          titleGu: 'ગુજરાત સરકારે નવી IT પોલિસી જાહેર કરી, સ્ટાર્ટઅપ્સને પ્રોત્સાહન',
          title: 'Gujarat government announces new IT policy, incentives for startups',
          titleHi: 'गुजरात सरकार ने नई IT पॉलिसी जारी की, स्टार्टअप्स को प्रोत्साहन',
          relativeTimeGu: '3 કલાક પહેલાં', relativeTime: '3 hours ago', relativeTimeHi: '3 घंटे पहले',
          categoryGu: 'ગાંધીનગર', category: 'Gandhinagar', categoryHi: 'गांधीनगर',
          viewsGu: '61K', views: '61K'
        },
        {
          id: 'gn-l2', slug: 'gandhinagar-infotech-campus-393', image: '/assets/demo/8.jpg',
          titleGu: 'ઇન્ફોસિટી પર નવું ટેક કેમ્પસ તૈયાર, 5,000 ઇજનેરોને રોજગાર મળશે',
          title: 'New tech campus ready at Infocity, 5,000 engineers to get jobs',
          titleHi: 'इन्फोसिटी पर नया टेक कैंपस तैयार, 5,000 इंजीनियरों को रोजगार',
          relativeTimeGu: '5 કલાક પહેલાં', relativeTime: '5 hours ago', relativeTimeHi: '5 घंटे पहले',
          categoryGu: 'ગાંધીનગર', category: 'Gandhinagar', categoryHi: 'गांधीनगर',
          viewsGu: '49K', views: '49K'
        },
        {
          id: 'gn-l3', slug: 'gandhinagar-cm-review-meeting-394', image: '/assets/demo/4.jpg',
          titleGu: 'CM દ્વારા વિકાસ કામોની સમીક્ષા, 10 પ્રોજેક્ટ ઝડપી કરવા સૂચના',
          title: 'CM reviews development works, instructs to fast-track 10 projects',
          titleHi: 'CM ने विकास कार्यों की समीक्षा की, 10 परियोजनाओं को तेज करने के निर्देश',
          relativeTimeGu: '6 કલાક પહેલાં', relativeTime: '6 hours ago', relativeTimeHi: '6 घंटे पहले',
          categoryGu: 'ગાંધીનગર', category: 'Gandhinagar', categoryHi: 'गांधीनगर',
          viewsGu: '72K', views: '72K'
        },
        {
          id: 'gn-l4', slug: 'gandhinagar-sector-green-initiative-395', image: '/assets/demo/6.jpg',
          titleGu: 'ગાંધીનગરના સેક્ટરોમાં ગ્રીન ઇનિશિએટિવ શરૂ, 10,000 વૃક્ષો વવાશે',
          title: 'Green initiative starts in Gandhinagar sectors, 10,000 trees to be planted',
          titleHi: 'गांधीनगर के सेक्टरों में ग्रीन पहल शुरू, 10,000 पेड़ लगाए जाएंगे',
          relativeTimeGu: '8 કલાક પહેલાં', relativeTime: '8 hours ago', relativeTimeHi: '8 घंटे पहले',
          categoryGu: 'ગાંધીનગર', category: 'Gandhinagar', categoryHi: 'गांधीनगर',
          viewsGu: '37K', views: '37K'
        },
        {
          id: 'gn-l5', slug: 'gandhinagar-solar-roof-395', image: '/assets/demo/1.jpg',
          titleGu: 'ગાંધીનગરમાં સરકારી ઇમારતો પર સોલાર રૂફટોપ સિસ્ટમ સ્થાપિત કરાશે',
          title: 'Solar rooftop systems to be installed on government buildings in Gandhinagar',
          titleHi: 'गांधीनगर में सरकारी इमारतों पर सोलर रूफटॉप सिस्टम लगाए जाएंगे',
          relativeTimeGu: '12 કલાક પહેલાં', relativeTime: '12 hours ago', relativeTimeHi: '12 घंटे पहले',
          categoryGu: 'સૌર ઉર્જા', category: 'Solar', categoryHi: 'सौर ऊर्जा',
          viewsGu: '34K', views: '34K'
        }
      ]
    },
    'અન્ય': {
      slides: [
        {
          id: 'oth-c1', slug: 'bhavnagar-new-industrial-units-approved-347', image: '/assets/demo/5.jpg',
          titleGu: 'ભાવનગરને મળી મોટી ભેટ! નવા ઔદ્યોગિક એકમને મંજૂરી, રોજગારી વધશે',
          title: 'Bhavnagar gets big gift! New industrial unit approved, jobs to rise',
          titleHi: 'भावनगर को मिला बड़ा तोहफा! नए औद्योगिक इकाई को मंजूरी',
          relativeTimeGu: '1 કલાક પહેલાં', relativeTime: '1 hour ago', relativeTimeHi: '1 घंटा पहले',
          categoryGu: 'ભાવનગર', category: 'Bhavnagar', categoryHi: 'भावनगर',
          viewsGu: '46K', views: '46K',
          excerptGu: 'ભાવનગરમાં નવા ઔદ્યોગિક એકમની સ્થાપના માટે રાજ્ય સરકારે મંજૂરી આપી. આ એકમથી 3,000+ નવી નોકરીઓ સર્જાશે.',
          excerpt: 'State government approves new industrial unit in Bhavnagar. 3,000+ new jobs to be created.',
          excerptHi: 'भावनगर में नई औद्योगिक इकाई के लिए राज्य सरकार ने मंजूरी दी। 3,000+ नई नौकरियां।',
          tags: ['ઉદ્યોગ', 'રોજગાર', 'ભાવનગર', 'વિકાસ']
        },
        {
          id: 'oth-c2', slug: 'girnar-ropeway-tourist-rush-increases-tremendously-205', image: '/assets/demo/3.jpg',
          titleGu: 'ગિરનાર રોપ-વે પર ઉમટ્યા પ્રવાસીઓ! સંખ્યામાં જોરદાર વધારો, સુરક્ષા ચિંતા',
          title: 'Tourists flock to Girnar Ropeway! Tremendous increase in numbers',
          titleHi: 'गिरनार रोपवे पर उमड़े पर्यटक! संख्या में भारी बढ़ोतरी',
          relativeTimeGu: '2 કલાક પહેલાં', relativeTime: '2 hours ago', relativeTimeHi: '2 घंटे पहले',
          categoryGu: 'જૂનાગઢ', category: 'Junagadh', categoryHi: 'जूनागढ़',
          viewsGu: '52K', views: '52K',
          excerptGu: 'ગિરનાર રોપ-વે પર પ્રવાસીઓની સંખ્યામાં રેકોર્ડબ્રેક વધારો. સુરક્ષા વ્યવસ્થા વધારવા માંગ.',
          excerpt: 'Record-breaking increase in tourists at Girnar Ropeway. Demand to enhance safety arrangements.',
          excerptHi: 'गिरनार रोपवे पर पर्यटकों की संख्या में रिकॉर्डतोड़ बढ़ोतरी।',
          tags: ['પ્રવાસન', 'જૂનાગઢ', 'ગિરનાર', 'સુરક્ષા']
        },
        {
          id: 'oth-c3', slug: 'anand-dairy-expansion-project-inauguration-349', image: '/assets/demo/1.jpg',
          titleGu: 'આણંદ ડેરી સંઘનું નવું પ્લાન્ટ વિસ્તરણ! ખેડૂતોને સીધો ફાયદો થશે',
          title: 'Anand Dairy Union new plant expansion! Farmers to benefit directly',
          titleHi: 'आनंद डेयरी संघ का नया प्लांट विस्तार! किसानों को होगा सीधा फायदा',
          relativeTimeGu: '3 કલાક પહેલાં', relativeTime: '3 hours ago', relativeTimeHi: '3 घंटे पहले',
          categoryGu: 'આણંદ', category: 'Anand', categoryHi: 'आनंद',
          viewsGu: '71K', views: '71K',
          excerptGu: 'આણંદ ડેરી સંઘ દ્વારા ₹200 કરોડના ખર્ચે નવું પ્લાન્ટ. દૂધ ઉત્પાદન ક્ષમતા બમણી થશે.',
          excerpt: 'New plant by Anand Dairy Union at Rs 200 crore cost. Milk production capacity to double.',
          excerptHi: 'आनंद डेयरी संघ ने ₹200 करोड़ की लागत से नया प्लांट। दूध उत्पादन क्षमता दोगुनी होगी।',
          tags: ['ડેરી', 'ખેડૂત', 'આણંદ', 'વિકાસ']
        }
      ],
      list: [
        {
          id: 'oth-l1', slug: 'jamnagar-refinery-expansion-396', image: '/assets/demo/7.jpg',
          titleGu: 'જામનગર રિફાઈનરીમાં વિસ્તરણ, 5,000 નવી નોકરીઓ સર્જાશે',
          title: 'Jamnagar refinery expansion, 5,000 new jobs to be created',
          titleHi: 'जामनगर रिफाइनरी में विस्तार, 5,000 नई नौकरियां पैदा होंगी',
          relativeTimeGu: '4 કલાક પહેલાં', relativeTime: '4 hours ago', relativeTimeHi: '4 घंटे पहले',
          categoryGu: 'જામનગર', category: 'Jamnagar', categoryHi: 'जामनगर',
          viewsGu: '58K', views: '58K'
        },
        {
          id: 'oth-l2', slug: 'kutch-rann-utsav-preparation-397', image: '/assets/demo/2.jpg',
          titleGu: 'કચ્છમાં રણોત્સવની તૈયારી શરૂ, આ વર્ષે નવા આકર્ષણો ઉમેરાશે',
          title: 'Rann Utsav preparations begin in Kutch, new attractions to be added this year',
          titleHi: 'कच्छ में रण उत्सव की तैयारी शुरू, इस साल नए आकर्षण जोड़े जाएंगे',
          relativeTimeGu: '5 કલાક પહેલાં', relativeTime: '5 hours ago', relativeTimeHi: '5 घंटे पहले',
          categoryGu: 'કચ્છ', category: 'Kutch', categoryHi: 'कच्छ',
          viewsGu: '65K', views: '65K'
        },
        {
          id: 'oth-l3', slug: 'mehsana-milk-production-record-398', image: '/assets/demo/4.jpg',
          titleGu: 'મહેસાણા જિલ્લામાં દૂધ ઉત્પાદનમાં રેકોર્ડ, ખેડૂતોની આવક વધી',
          title: 'Record milk production in Mehsana district, farmers income increased',
          titleHi: 'मेहसाणा जिले में दूध उत्पादन में रिकॉर्ड, किसानों की आय बढ़ी',
          relativeTimeGu: '6 કલાક પહેલાં', relativeTime: '6 hours ago', relativeTimeHi: '6 घंटे पहले',
          categoryGu: 'મહેસાણા', category: 'Mehsana', categoryHi: 'मेहसाणा',
          viewsGu: '43K', views: '43K'
        },
        {
          id: 'oth-l4', slug: 'morbi-ceramic-export-boom-399', image: '/assets/demo/8.jpg',
          titleGu: 'મોરબી સિરામિક ઉદ્યોગમાં જોરદાર તેજી, નિકાસમાં 30% વધારો',
          title: 'Strong boom in Morbi ceramic industry, 30% increase in exports',
          titleHi: 'मोरबी सिरेमिक उद्योग में जोरदार तेजी, निर्यात में 30% बढ़ोतरी',
          relativeTimeGu: '8 કલાક પહેલાં', relativeTime: '8 hours ago', relativeTimeHi: '8 घंटे पहले',
          categoryGu: 'મોરબી', category: 'Morbi', categoryHi: 'मोरबी',
          viewsGu: '51K', views: '51K'
        },
        {
          id: 'oth-l5', slug: 'morbi-industry-green-energy-388', image: '/assets/demo/5.jpg',
          titleGu: 'મોરબી સિરામિક ઉદ્યોગમાં હવે ગ્રીન એનર્જીનો ઉપયોગ વધારવા નિર્ણય',
          title: 'Morbi ceramic industry decides to increase use of green energy',
          titleHi: 'मोरबी सिरेमिक उद्योग में अब ग्रीन बनर्जी का उपयोग बढ़ाने का फैसला',
          relativeTimeGu: '9 કલાક પહેલાં', relativeTime: '9 hours ago', relativeTimeHi: '9 घंटे पहले',
          categoryGu: 'મોરબી', category: 'Morbi', categoryHi: 'मोरबी',
          viewsGu: '37K', views: '37K'
        }
      ]
    }
  };

  const activeCityData = cityData[activeTab] || cityData['અમદાવાદ'];
  const mockSlides = activeCityData.slides;
  const mockList = activeCityData.list;
  const currentSlide = mockSlides[slideIdx % mockSlides.length];

  return (
    <section className="mt-6 border-t border-border pt-5">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

        {/* Left Column: Tab list + Carousel & Side list */}
        <div className="flex flex-col min-w-0">

          {/* Section Header with Underline */}
          <div className="relative border-b-2 border-slate-900 pb-2 mb-4 flex items-center justify-between">
            <span className="bg-[#B3121B] text-white px-5 py-1.5 text-[14px] md:text-[15px] font-black rounded-sm select-none uppercase tracking-wide">
              {language === 'gu' ? 'ગુજરાત' : language === 'hi' ? 'गुजरात' : 'Gujarat'}
            </span>
            <Link
              href="/category/gujarat"
              className="text-[13px] md:text-[14px] font-black pb-1.5 text-[#B3121B] hover:text-[#B3121B]/80 transition-colors whitespace-nowrap cursor-pointer ml-auto flex items-center gap-1 select-none"
            >
              {language === 'gu' ? 'વધુ જુઓ →' : language === 'hi' ? 'और देखें →' : 'View All →'}
            </Link>
          </div>

          {/* Tab Navigation List */}
          <div className="flex items-center gap-5 border-b border-border pb-3 mb-6 overflow-x-auto scrollbar-none select-none">
            {['અમદાવાદ', 'સુરત', 'વડોદરા', 'રાજકોટ', 'ગાંધીનગર', 'અન્ય'].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`text-[13.5px] md:text-[14.5px] font-black pb-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${isActive
                    ? 'border-[#B3121B] text-[#B3121B]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                  {tab}
                </button>
              );
            })}

          </div>

          {/* Main 2-Column Content Section */}
          <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-8 items-start">

            {/* Carousel Slide */}
            {currentSlide && (
              <div className="group relative flex flex-col min-w-0">
                {/* Image container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border/10 bg-muted">
                  <Image
                    src={currentSlide.image}
                    alt={currentSlide.titleGu}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  {/* Left / Right Arrows */}
                  <button
                    onClick={() => setSlideIdx((prev) => (prev - 1 + mockSlides.length) % mockSlides.length)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 text-[18px] font-bold select-none cursor-pointer"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setSlideIdx((prev) => (prev + 1) % mockSlides.length)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 text-[18px] font-bold select-none cursor-pointer"
                  >
                    ›
                  </button>
                  {/* Counter Index */}
                  <span className="absolute top-2.5 left-2.5 bg-black/70 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-sm z-10 select-none">
                    {language === 'gu'
                      ? `${toGuLocal(slideIdx + 1)} / ${toGuLocal(mockSlides.length)}`
                      : `${slideIdx + 1} / ${mockSlides.length}`}
                  </span>
                </div>

                {/* Info Text below image */}
                <div className="mt-3.5 flex flex-col">
                  <span className="text-[#B3121B] font-black text-[12.5px] uppercase tracking-wide mb-1 select-none">
                    {getLocalized(language, { en: currentSlide.category, gu: currentSlide.categoryGu, hi: currentSlide.categoryHi })}
                  </span>

                  <Link href={`/news/${currentSlide.slug}`} className="group/link">
                    <div className="h-[48px] md:h-[50px] overflow-hidden">
                      <h3 className="font-extrabold text-[15.5px] md:text-[17px] leading-snug tracking-tight text-foreground group-hover/link:text-[#B3121B] transition-colors line-clamp-2">
                        {getLocalized(language, { en: currentSlide.title, gu: currentSlide.titleGu, hi: currentSlide.titleHi })}
                      </h3>
                    </div>
                  </Link>

                  <div className="h-[38px] overflow-hidden mt-2">
                    <p className="text-muted-foreground text-[12.5px] leading-relaxed line-clamp-2 font-medium">
                      {getLocalized(language, { en: currentSlide.excerpt, gu: currentSlide.excerptGu, hi: currentSlide.excerptHi })}
                    </p>
                  </div>

                  {/* Meta Details with Inline Tags */}
                  <div className="h-[38px] flex items-center gap-2.5 mt-3.5 text-[11px] text-muted-foreground font-semibold border-b border-border/40 pb-3 mb-3.5 overflow-hidden">
                    <span>
                      {getLocalized(language, { en: currentSlide.relativeTime, gu: currentSlide.relativeTimeGu, hi: currentSlide.relativeTimeHi })}
                    </span>
                    <span>•</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentSlide.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-muted text-muted-foreground text-[10.5px] font-bold px-2 py-0.5 rounded-sm border border-border select-none animate-fade-in"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* List updates columns */}
            <div className="flex flex-col min-w-0 md:border-l md:border-border/60 md:pl-6 gap-2.5">
              {mockList.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group flex gap-3.5 items-start py-1.5 border-b border-border/40 last:border-b-0 pb-2 last:pb-0"
                >
                  {/* Small thumbnail on the left */}
                  <div className="relative h-[68px] w-[108px] shrink-0 overflow-hidden rounded-sm bg-muted border border-border/10">
                    <Image
                      src={item.image}
                      alt={item.titleGu}
                      fill
                      sizes="108px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Details on the right */}
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <span className="text-[#B3121B] font-extrabold text-[11px] uppercase tracking-wide mb-0.5 select-none leading-none">
                      {getLocalized(language, { en: item.category, gu: item.categoryGu, hi: item.categoryHi })}
                    </span>
                    <div className="h-[36px] overflow-hidden">
                      <h4 className="text-[13px] md:text-[13.5px] font-extrabold leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-2">
                        {getLocalized(language, { en: item.title, gu: item.titleGu, hi: item.titleHi })}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10.5px] text-muted-foreground font-semibold select-none leading-none">
                      <span>
                        {getLocalized(language, { en: item.relativeTime, gu: item.relativeTimeGu, hi: item.relativeTimeHi })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground/60" />
                        <span>{getMockTime(item.id)}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>

        </div>

        {/* Right Column: Sidebar Ads and widgets */}
        <div className="flex flex-col gap-6 sticky top-20 select-none">

          {/* Ad widget banner */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest text-center">
              {language === 'gu' ? 'જાહેરાત' : 'ADVERTISEMENT'}
            </span>
            <div className="w-full rounded-sm bg-gradient-to-br from-[#0f3d70] to-[#001f3f] text-white p-6 flex flex-col items-center justify-center border border-border/10 shadow-sm text-center relative overflow-hidden" style={{ minHeight: 180 }}>
              <h4 className="text-[20px] font-black tracking-tight select-none">
                {language === 'gu' ? 'ઇઝી પર્સનલ લોન' : 'Easy Personal Loan'}
              </h4>
              <p className="text-[12px] text-white/90 font-bold mt-1.5 leading-snug">
                {language === 'gu' ? 'ફક્ત 10.5% વ્યાજે, 5 મિનિટમાં મંજૂરી' : 'Just 10.5% interest, approval in 5 mins'}
              </p>
              <button
                type="button"
                className="mt-4 bg-white text-[#0f3d70] font-black text-[12px] px-5 py-2.5 rounded-full shadow-sm hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer border border-[#0f3d70]"
              >
                {language === 'gu' ? 'અરજી કરો ↗' : 'Apply Now ↗'}
              </button>
            </div>
          </div>

          {/* WhatsApp Channel widget */}
          <div className="w-full rounded-sm border border-slate-200 bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2.5 font-black text-[14.5px] text-foreground">
              {/* WhatsApp green icon */}
              <span className="flex h-7.5 w-7.5 items-center justify-center rounded-sm bg-[#16794A] text-white text-[15px] font-bold select-none">
                💬
              </span>
              <span>{language === 'gu' ? 'WhatsApp ચેનલ' : 'WhatsApp Channel'}</span>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed my-3 font-semibold">
              {language === 'gu' ? 'તમારા શહેરના સમાચાર સૌથી પહેલા સીધા તમારા ફોન પર મેળવો' : 'Get your city news first directly on your phone.'}
            </p>
            <button className="w-full bg-[#16794A] hover:bg-[#12613b] text-white font-extrabold text-[12.5px] py-2.5 rounded-sm active:scale-[0.99] transition-all cursor-pointer">
              {language === 'gu' ? 'ચેનલ ફોલો કરો' : 'Follow Channel'}
            </button>
          </div>

          {/* Trending Topics widget */}
          <div>
            <div className="flex items-center gap-1.5 border-b border-border pb-1.5 mb-2">
              <span className="text-[#B3121B] font-black text-[13.5px] md:text-[14px]">
                {language === 'gu' ? '• Trending વિષયો' : '• Trending Topics'}
              </span>
            </div>
            <div className="border border-border rounded-sm bg-card p-2.5 shadow-sm">
              <div className="flex flex-wrap gap-1.5">
                {['#ચૂંટણી 2027', '#વરસાદ', '#સોના-ચાંદી', '#ક્રિકેટ', '#મેટ્રો', '#સેમિકન્ડક્ટર', '#ડાયમંડ ઉદ્યોગ', '#ટ્રાફિક'].map((tag) => {
                  const cleanTag = tag.startsWith('#') ? tag.slice(1) : tag;
                  return (
                    <span
                      key={tag}
                      className="border border-neutral-300 dark:border-neutral-700 text-[11px] font-black px-2.5 py-2 rounded-full text-foreground hover:border-[#B3121B] hover:bg-[#B3121B]/5 hover:text-[#B3121B] transition-all bg-card shadow-sm cursor-pointer select-none"
                    >
                      <span className="text-[#B3121B] font-extrabold mr-0.5">#</span>
                      {cleanTag}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

/* --- Crime & Regional Updates Section ------------------------------------ */
function CrimeSection({
  language,
  view = 'all',
}: {
  language: Language;
  view?: 'content' | 'sidebar' | 'all';
}) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [popularStartIndex, setPopularStartIndex] = useState(0);
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacSign | null>(null);

  const mockSlides = [
    {
      id: 'c1',
      slug: 'cyber-cell-busts-fake-investment-app-network-in-ahmedabad-93',
      image: '/assets/demo/3.jpg',
      titleGu: 'અમદાવાદમાં કરોડોનું કૌભાંડ! ફેક ઇન્વેસ્ટમેન્ટ એપ નેટવર્કનો પર્દાફાશ, અનેક ધરપકડ',
      title: 'Crores scam in Ahmedabad! Fake investment app network busted, many arrested',
      titleHi: 'अहमदाबाद में करोड़ों का घोटाला! फेक निवेश ऐप नेटवर्क का भंडाफोड़, कई गिरफ्तार',
      relativeTimeGu: '1 કલાક પહેલાં',
      relativeTime: '1 hour ago',
      relativeTimeHi: '1 घंटा पहले',
      categoryGu: 'અમદાવાદ',
      category: 'Ahmedabad',
      categoryHi: 'अहमदाबाद',
      viewsGu: '68K',
      views: '68K'
    },
    {
      id: 'c2',
      slug: 'surat-police-seize-contraband-worth-crores-in-joint-raid-94',
      image: '/assets/demo/6.jpg',
      titleGu: 'સુરત પોલીસની સંયુક્ત રેડ! કરોડોની મુદ્દામાલ જપ્ત',
      title: 'Joint raid by Surat police! Contraband worth crores seized',
      titleHi: 'सूरत पुलिस की संयुक्त छापेमारी! करोड़ों का माल जब्त',
      relativeTimeGu: '2 કલાક પહેલાં',
      relativeTime: '2 hours ago',
      relativeTimeHi: '2 घंटे पहले',
      categoryGu: 'સુરત',
      category: 'Surat',
      categoryHi: 'सूरत',
      viewsGu: '71K',
      views: '71K'
    },
    {
      id: 'c3',
      slug: 'kidnapping-racket-busted-in-rajkot-five-arrested-95',
      image: '/assets/demo/4.jpg',
      titleGu: 'રાજકોટમાં અપહરણ ગેંગનો પર્દાફાશ! પાંચ આરોપી ઝડપાયા',
      title: 'Kidnapping gang exposed in Rajkot! Five suspects arrested',
      titleHi: 'राजकोट में अपहरण गिरोह का पर्दाफाश! पांच आरोपी गिरफ्तार',
      relativeTimeGu: '3 કલાક પહેલાં',
      relativeTime: '3 hours ago',
      relativeTimeHi: '3 घंटे पहले',
      categoryGu: 'રાજકોટ',
      category: 'Rajkot',
      categoryHi: 'राजकोट',
      viewsGu: '74K',
      views: '74K'
    }
  ];

  const mockList = [
    {
      id: 'l1',
      slug: 'atm-skimming-gang-caught-after-months-of-investigation-96',
      titleGu: 'વડોદરામાં ATM સ્કીમિંગ ગેંગ ઝડપાઈ! મહિનાઓની તપાસ બાદ ભાંડો ફૂટ્યો',
      title: 'ATM skimming gang caught in Vadodara! Secret busted after months of investigation',
      titleHi: 'वडोदरा में एटीएम स्किमिंग गैंग पकड़ी गई! महीनों की जांच के बाद हुआ खुलासा',
      relativeTimeGu: '4 કલાક પહેલાં',
      relativeTime: '4 hours ago',
      relativeTimeHi: '4 घंटे पहले',
      categoryGu: 'વડોદરા',
      category: 'Vadodara',
      categoryHi: 'વડોદરા',
      viewsGu: '78K',
      views: '78K'
    },
    {
      id: 'l2',
      slug: 'drug-trafficking-route-from-pakistan-via-gujarat-busted-98',
      titleGu: 'ભાવનગરમાં દારૂનો મોટો જથ્થો ઝડપાયો, ત્રણ આરોપી કબજે',
      title: 'Huge alcohol haul seized in Bhavnagar, three suspects in custody',
      titleHi: 'भावनगर में शराब का बड़ा जहीरा जब्त, तीन आरोपी गिरफ्तार',
      relativeTimeGu: '5 કલાક પહેલાં',
      relativeTime: '5 hours ago',
      relativeTimeHi: '5 घंटे पहले',
      categoryGu: 'ભાવનગર',
      category: 'Bhavnagar',
      categoryHi: 'भावनगर',
      viewsGu: '81K',
      views: '81K'
    },
    {
      id: 'l3',
      slug: 'land-fraud-case-senior-official-arrested-in-vadodara-97',
      titleGu: 'જૂનાગઢમાં ઓનલાઇન લોન એપના નામે બ્લેકમેલિંગ! ફરિયાદ નોંધાઈ',
      title: 'Blackmailing in Junagadh in the name of online loan apps! FIR registered',
      titleHi: 'जूनागढ़ में ऑनलाइन लोन ऐप के नाम पर ब्लैकमेलिंग! शिकायत दर्ज',
      relativeTimeGu: '6 કલાક પહેલાં',
      relativeTime: '6 hours ago',
      relativeTimeHi: '6 घंटे पहले',
      categoryGu: 'જૂનાગઢ',
      category: 'Junagadh',
      categoryHi: 'जूनागढ़',
      viewsGu: '90K',
      views: '90K'
    }
  ];

  const mockPopularColumns = [
    {
      colId: 1,
      featured: {
        id: 'pf1',
        slug: 'gujarat-election-2027-preparations-active-301',
        image: '/assets/demo/1.jpg',
        titleGu: 'ગુજરાત ચૂંટણી 2027 નજીક! જિલ્લાઓમાં તૈયારીઓ તેજ, સત્તાધારી પક્ષ સક્રિય',
        title: 'Gujarat Election 2027 near! Preparations active in districts',
        category: 'Politics'
      },
      subs: [
        {
          id: 'ps1_1',
          slug: 'cm-meeting-vibrant-gujarat-rural-development-302',
          image: '/assets/demo/3.jpg',
          titleGu: 'CMની મોટી બેઠક! વિકાસ પ્રોજેક્ટ માટે સમીક્ષા, ગ્રામીણ વિસ્તારો પર ભાર',
          relativeTimeGu: '2 કલાક પહેલાં',
          viewsGu: '33K'
        },
        {
          id: 'ps1_2',
          slug: 'bjp-state-executive-meeting-organization-expansion-303',
          image: '/assets/demo/2.jpg',
          titleGu: 'ભાજપ પ્રદેશ કારોબારીની બેઠકમાં સંગઠન વિસ્તરણ પર મોટી ચર્ચા',
          relativeTimeGu: '3 કલાક પહેલાં',
          viewsGu: '45K'
        },
        {
          id: 'ps1_3',
          slug: 'aap-claims-ground-level-network-expansion-gujarat-304',
          image: '/assets/demo/4.jpg',
          titleGu: 'AAPનો મોટો દાવો! ગ્રામ્ય ગુજરાતમાં ભૂ-સ્તરીય નેટવર્ક વિસ્તાર્યું',
          relativeTimeGu: '4 કલાક પહેલાં',
          viewsGu: '38K'
        }
      ]
    },
    {
      colId: 2,
      featured: {
        id: 'pf2',
        slug: 'major-controversy-ahmedabad-muni-commissioner-objection-305',
        image: '/assets/demo/7.jpg',
        titleGu: 'મોટો વિવાદ! અમદાવાદ મ્યુનિ. કમિશનરે તંત્ર સામે વાંધો ઉઠાવ્યો',
        title: 'Major controversy! Ahmedabad Muni Commissioner raises objection against system',
        category: 'Civic'
      },
      subs: [
        {
          id: 'ps2_1',
          slug: 'military-training-irregularities-promotions-cancelled-306',
          image: '/assets/demo/5.jpg',
          titleGu: 'સૈન્ય તાલીમમાં મોટી ગેરરીતિ! 100થી વધુ પ્રમોશન રદ કરાયા',
          relativeTimeGu: '4 કલાક પહેલાં',
          viewsGu: '28K'
        },
        {
          id: 'ps2_2',
          slug: 'congress-reveals-cards-election-campaign-strategy-307',
          image: '/assets/demo/6.jpg',
          titleGu: 'કોંગ્રેસે ખોલ્યા પત્તા! 2027 ચૂંટણી ઝુંબેશ વ્યૂહ જાહેર કર્યો',
          relativeTimeGu: '5 કલાક પહેલાં',
          viewsGu: '50K'
        },
        {
          id: 'ps2_3',
          slug: 'assembly-monsoon-session-hung-opposition-adjournment-motion-308',
          image: '/assets/demo/1.jpg',
          titleGu: 'વિધાનસભા ચોમાસુ સત્રમાં હોબાળો! વિપક્ષે બેરોજગારી મુદ્દે સ્થગન પ્રસ્તાવ આપ્યો',
          relativeTimeGu: '6 કલાક પહેલાં',
          viewsGu: '42K'
        }
      ]
    },
    {
      colId: 3,
      featured: {
        id: 'pf3',
        slug: 'high-court-strict-notice-state-government-recruitment-process-309',
        image: '/assets/demo/4.jpg',
        titleGu: 'હાઈકોર્ટની આકરી નોટિસ! રાજ્ય સરકારને ભરતી પ્રક્રિયા અંગે જવાબ માંગ્યો',
        title: 'Strict notice from High Court! State Government asked for response on recruitment process',
        category: 'Legal'
      },
      subs: [
        {
          id: 'ps3_1',
          slug: 'union-minister-visit-gujarat-industrial-corridor-302',
          image: '/assets/demo/8.jpg',
          titleGu: 'કેન્દ્રીય મંત્રીની ગુજરાત મુલાકાત! નવા ઔદ્યોગિક કોરિડોરની જાહેરાત શક્ય',
          relativeTimeGu: '1 કલાક પહેલાં',
          viewsGu: '62K'
        },
        {
          id: 'ps3_2',
          slug: 'voter-list-revision-campaign-starts-online-registration-appeal-311',
          image: '/assets/demo/1.jpg',
          titleGu: 'મતદાર યાદી સુધારણા ઝુંબેશ શરૂ! નાગરિકોને ઓનલાઈન નોંધણીની અપીલ',
          relativeTimeGu: '2 કલાક પહેલાં',
          viewsGu: '41K'
        },
        {
          id: 'ps3_3',
          slug: 'police-recruitment-10000-vacancies-filled-soon-315',
          image: '/assets/demo/7.jpg',
          titleGu: 'યુવાનો માટે મોટી તક! પોલીસ ભરતીમાં 10,000 જગ્યાઓ ટૂંક સમયમાં ભરાશે',
          relativeTimeGu: '3 કલાક પહેલાં',
          viewsGu: '55K'
        }
      ]
    }
  ];

  const mockZodiacArticles = [
    {
      id: 'za0',
      slug: 'gujarat-heavy-rain-alert-waterlogging-400',
      image: '/assets/demo/1.jpg',
      symbol: '1',
      titleGu: 'ગુજરાત ચૂંટણી 2027 નજીક! જિલ્લાઓમાં તૈયારીઓ તેજ, સત્તાધારી પક્ષ સક્રિય',
      relativeTimeGu: '30 મિનિટ પહેલાં',
      viewsGu: '2.5L'
    },
    {
      id: 'za1',
      slug: 'monsoon-2025-gujarat-rain-forecast-weather-dept-401',
      image: '/assets/demo/7.jpg',
      symbol: '2',
      titleGu: 'મોટો વિવાદ! અમદાવાદ મ્યુનિ. કમિશનરે તંત્ર સામે વાંધો ઉઠાવ્યો',
      relativeTimeGu: '1 કલાક પહેલાં',
      viewsGu: '1.8L'
    },
    {
      id: 'za2',
      slug: 'gold-silver-price-surge-latest-rates-today-402',
      image: '/assets/demo/5.jpg',
      symbol: '3',
      titleGu: 'હાઈકોર્ટની આકરી નોટિસ! રાજ્ય સરકારને ભરતી પ્રક્રિયા અંગે જવાબ માંગ્યો',
      relativeTimeGu: '2 કલાક પહેલાં',
      viewsGu: '1.5L'
    }
  ];

  const visiblePopularArticles = [
    mockZodiacArticles[popularStartIndex],
    mockZodiacArticles[(popularStartIndex + 1) % mockZodiacArticles.length],
    mockZodiacArticles[(popularStartIndex + 2) % mockZodiacArticles.length]
  ];

  const currentSlide = mockSlides[slideIdx];

  const leftContent = (
    <div className="flex flex-col min-w-0">

      {/* Crime Header */}
      <div className="flex items-end justify-between h-[46px] border-b-[3.5px] border-slate-950 dark:border-slate-800 pb-2.5 mb-6">
        <span className="bg-[#B3121B] text-white px-5 py-2 text-[13.5px] md:text-[14.5px] font-black rounded-lg select-none leading-none tracking-tight">
          {language === 'gu' ? 'કાઇમ' : 'Crime'}
        </span>
        <Link
          href="/category/crime"
          className="text-[#B3121B] hover:text-red-700 font-extrabold text-[13px] md:text-[14px] hover:underline pb-0.5"
        >
          {language === 'gu' ? 'વધુ કાઇમ સમાચાર →' : 'All Crime News →'}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-8 items-start">
        {/* Slide Carousel */}
        {currentSlide && (
          <div className="group relative flex flex-col min-w-0">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border/10 bg-muted">
              <Image
                src={currentSlide.image}
                alt={currentSlide.titleGu}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <button
                type="button"
                onClick={() => setSlideIdx((prev) => (prev - 1 + mockSlides.length) % mockSlides.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/60 hover:bg-[#B3121B] hover:border-[#B3121B] text-white transition-all duration-200 shadow-md backdrop-blur-md z-10 cursor-pointer select-none"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5 stroke-[3px] text-white" />
              </button>
              <button
                type="button"
                onClick={() => setSlideIdx((prev) => (prev + 1) % mockSlides.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/60 hover:bg-[#B3121B] hover:border-[#B3121B] text-white transition-all duration-200 shadow-md backdrop-blur-md z-10 cursor-pointer select-none"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5 stroke-[3px] text-white" />
              </button>
              <span className="absolute top-2.5 left-2.5 bg-black/70 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-sm z-10 select-none">
                {language === 'gu'
                  ? `${toGuLocal(slideIdx + 1)} / ${toGuLocal(mockSlides.length)}`
                  : `${slideIdx + 1} / ${mockSlides.length}`}
              </span>
            </div>

            <div className="mt-3.5 flex flex-col">
              <span className="text-[#B3121B] font-extrabold text-[12px] md:text-[13px] mb-1 select-none uppercase tracking-wide">
                {getLocalized(language, { en: currentSlide.category, gu: currentSlide.categoryGu, hi: currentSlide.categoryHi })}
              </span>
              <Link href={`/news/${currentSlide.slug}`} className="group/link min-h-[76px] flex flex-col justify-start">
                <h3 className="font-extrabold text-[15.5px] md:text-[17px] leading-snug tracking-tight text-foreground hover:text-[#B3121B] transition-colors line-clamp-3">
                  {getLocalized(language, { en: currentSlide.title, gu: currentSlide.titleGu, hi: currentSlide.titleHi })}
                </h3>
              </Link>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-semibold mt-2 select-none">
                <span>
                  {getLocalized(language, { en: currentSlide.relativeTime, gu: currentSlide.relativeTimeGu, hi: currentSlide.relativeTimeHi })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <span>{getMockTime(currentSlide.id)}</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* List side updates (Text lists only, no images, matching the screen!) */}
        <div className="flex flex-col min-w-0 md:border-l md:border-border/60 md:pl-6 gap-2">

          {mockList.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="group flex flex-col py-3.5 border-b border-border/40 last:border-b-0"
            >
              <span className="text-red-600 font-extrabold text-[11px] uppercase tracking-wide mb-1">
                {getLocalized(language, { en: item.category, gu: item.categoryGu, hi: item.categoryHi })}
              </span>
              <h4 className="text-[14px] md:text-[14.5px] font-black leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-2">
                {getLocalized(language, { en: item.title, gu: item.titleGu, hi: item.titleHi })}
              </h4>
              <div className="flex items-center gap-1.5 mt-2.5 text-[10.5px] text-muted-foreground font-semibold">
                <span>
                  {getLocalized(language, { en: item.relativeTime, gu: item.relativeTimeGu, hi: item.relativeTimeHi })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground/60" />
                  <span>{getMockTime(item.id)}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3-Column Popular Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border/40 pt-5 mt-3">
        {mockPopularColumns.map((col) => (
          <div key={col.colId} className="flex flex-col min-w-0">
            <Link
              href={`/news/${col.featured.slug}`}
              className="group flex flex-col mb-2.5"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border/10 bg-muted mb-2.5">
                <Image
                  src={col.featured.image}
                  alt={col.featured.titleGu}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-[13px] md:text-[13.5px] font-black leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-2">
                {language === 'gu' ? col.featured.titleGu : col.featured.title}
              </h3>
            </Link>

            <div className="flex flex-col divide-y divide-border/40 border-t border-border/40 mt-1">
              {col.subs.slice(0, 3).map((sub) => (
                <Link
                  key={sub.id}
                  href={`/news/${sub.slug}`}
                  className="group py-3 flex items-center gap-3"
                >
                  {/* Thumbnail photo on left */}
                  <div className="relative h-16 w-20 shrink-0 rounded-lg overflow-hidden border border-border/20 bg-muted">
                    <Image
                      src={sub.image || '/assets/demo/5.jpg'}
                      alt={sub.titleGu}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Title & Metadata on right */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <h4 className="text-[12.5px] md:text-[13px] font-black leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-2">
                      {sub.titleGu}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10.5px] text-muted-foreground font-semibold select-none">
                      <span>{sub.relativeTimeGu || '2 કલાક પહેલાં'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col gap-6 select-none">

      {/* Weather Widget */}
      <div className="rounded-sm bg-[#1A1A1A] text-white p-5 border border-border/10 shadow-md">
        <div className="flex items-center gap-1.5 mb-4 select-none">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[12px] md:text-[13px] font-black uppercase tracking-wider text-white/90">
            {language === 'gu' ? 'હવામાન - અમદાવાદ' : 'Weather - Ahmedabad'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-4xl font-extrabold tracking-tight select-none">
              {language === 'gu' ? toGuLocal('32') : '32'}°
            </span>
            <p className="text-[12px] text-white/70 font-bold mt-1.5 select-none">
              {language === 'gu' ? 'આંશિક વાદળછાયું' : 'Partly cloudy'}
            </p>
          </div>

          <div className="relative h-12 w-12 text-yellow-400 select-none">
            <svg viewBox="0 0 24 24" className="h-full w-full fill-current">
              <path d="M19 12a7 7 0 1 0-7 7 7 7 0 0 0 7-7zm-7 5a5 5 0 1 1 5-5 5 5 0 0 1-5 5z" />
              <path d="M12 2a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0V3a1 1 0 0 0-1-1zm0 16a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1zm10-7h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2zM4 11H3a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2zm15.07-5.07a1 1 0 0 0-1.42 0l-.7.7a1 1 0 0 0 1.42 1.42l.7-.7a1 1 0 0 0 0-1.42zm-12.73 12.7a1 1 0 0 0-1.42 0l-.7.7a1 1 0 0 0 1.42 1.42l.7-.7a1 1 0 0 0 0-1.42zm12.73 0a1 1 0 0 0 0-1.42l-.7-.7a1 1 0 0 0-1.42 1.42l.7.7a1 1 0 0 0 1.42 0zm-12.73-12.7a1 1 0 0 0 0-1.42l-.7-.7a1 1 0 0 0-1.42 1.42l.7.7a1 1 0 0 0 1.42 0z" />
            </svg>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-6 text-[12px] font-bold text-white/80">
          <span className="flex items-center gap-1.5 select-none">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-none stroke-current stroke-2">
              <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z" />
            </svg>
            {language === 'gu' ? `ભેજ 68%` : `Humidity 68%`}
          </span>
          <span className="flex items-center gap-1.5 select-none">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-none stroke-current stroke-2">
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.59-6.59A2 2 0 1 1 19 12H2" />
            </svg>
            {language === 'gu' ? `પવન 14 કિમી` : `Wind 14 km/h`}
          </span>
        </div>
      </div>

      {/* WhatsApp Channel widget */}
      <div className="w-full rounded-sm border border-[#16794A] bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2.5 font-black text-[14.5px] text-foreground">
          <span className="flex h-7.5 w-7.5 items-center justify-center rounded-sm bg-[#16794A] text-white text-[15px] font-bold select-none">
            💬
          </span>
          <span>{language === 'gu' ? 'WhatsApp ચેનલ' : 'WhatsApp Channel'}</span>
        </div>
        <p className="text-[12px] text-muted-foreground leading-relaxed my-3 font-semibold">
          {language === 'gu' ? 'બ્રેકિંગ ન્યૂઝ સૌથી પહેલા સીધા તમારા ફોન પર મેળવો.' : 'Get breaking news first directly on your phone.'}
        </p>
        <button className="w-full bg-[#16794A] hover:bg-[#12613b] text-white font-extrabold text-[12.5px] py-2.5 rounded-sm active:scale-[0.99] transition-all cursor-pointer">
          {language === 'gu' ? 'ચેનલ ફોલો કરો' : 'Follow Channel'}
        </button>
      </div>

      {/* Today's Horoscope Widget */}
      <div>
        <div className="flex items-center gap-1.5 border-b border-border pb-2.5 mb-3.5">
          <span className="text-[#B3121B] font-black text-[13.5px] md:text-[14px]">
            {language === 'gu' ? '• આજનું રાશિફળ' : '• Today\'s Horoscope'}
          </span>
        </div>
        <div className="border border-border rounded-sm bg-card p-4 shadow-sm">
          <div className="grid grid-cols-4 gap-x-2 gap-y-3.5">
            {ZODIAC_SIGNS.map((sign) => (
              <div
                key={sign.id}
                onClick={() => setSelectedZodiac(sign)}
                className="flex flex-col items-center justify-center p-2.5 rounded-sm border border-border bg-card hover:border-[#B3121B] hover:bg-muted/10 transition duration-200 cursor-pointer select-none group text-center"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#5038A6] text-white text-[13px] font-extrabold shadow-sm mb-1.5 transition duration-200 group-hover:scale-105 select-none leading-none">
                  {getZodiacSymbol(sign.id)}
                </div>
                <span className="text-[11px] font-extrabold text-foreground group-hover:text-[#B3121B] transition-colors select-none leading-normal">
                  {language === 'gu' ? `${sign.nameGu} (${sign.name})` : sign.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );

  const zodiacModal = selectedZodiac && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setSelectedZodiac(null)} />

      <div className="relative w-full max-w-md rounded-3xl overflow-hidden bg-card border border-border/10 p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-center">
        <button
          type="button"
          onClick={() => setSelectedZodiac(null)}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted-foreground/10 transition"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mx-auto mt-4 rounded-full border border-border/10 p-1 shadow-md w-24 h-24 overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedZodiac.image}
            alt={selectedZodiac.name}
            className="rounded-full w-full h-full object-cover"
          />
        </div>
        <h3 className="mt-4 text-xl font-black text-foreground">
          {language === 'gu' ? `${selectedZodiac.nameGu} (${selectedZodiac.name})` : selectedZodiac.name}
        </h3>
        <p className="text-xs font-semibold text-accent uppercase tracking-wider mt-1">
          {getLocalized(language, { en: 'Daily Horoscope', gu: 'આજનું રાશિફળ', hi: 'आज का राशिफल' })}
        </p>
        <div className="mt-5 border-t border-border/80 pt-4 text-left">
          <p className="text-sm font-black text-foreground leading-relaxed">
            {language === 'gu' ? selectedZodiac.predictionGu : selectedZodiac.prediction}
          </p>
        </div>
      </div>
    </div>
  );

  if (view === 'content') {
    return leftContent;
  }

  if (view === 'sidebar') {
    return (
      <>
        {sidebarContent}
        {zodiacModal}
      </>
    );
  }

  return (
    <section className="mt-2.5 border-t border-border pt-3.5">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
        {leftContent}
        {sidebarContent}
      </div>
      {zodiacModal}
    </section>
  );
}

/* --- Popular Stories Slider Section -------------------------------------- */
function PopularStoriesSection({
  language,
  view = 'all',
}: {
  language: Language;
  view?: 'content' | 'sidebar' | 'all';
}) {
  const ITEMS_PER_SLIDE = 3;
  const [groupIndex, setGroupIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const mockArticles = [
    {
      id: 'za0',
      slug: 'monsoon-rain-gujarat-forecast-401',
      image: '/assets/demo/3.jpg',
      titleGu: '2025: ગુજરાતમાં ક્યારે વરસાદ? હવામાન વિભાગની આગાહી',
      title: '2025: When will it rain in Gujarat? Weather Department forecast',
      relativeTimeGu: 'પહેલાં',
      relativeTime: 'ago',
      viewsGu: '1.8L',
      views: '1.8L'
    },
    {
      id: 'za1',
      slug: 'gold-silver-price-surge-latest-rates-today-402',
      image: '/assets/demo/6.jpg',
      titleGu: 'સોના-ચાંદીના ભાવમાં જોરદાર ઉછાળો! જાણો આજના લેટેસ્ટ રેટ',
      title: 'Gold-silver prices surge! Know latest rates today',
      relativeTimeGu: '2 કલાક પહેલાં',
      relativeTime: '2 hours ago',
      viewsGu: '1.5L',
      views: '1.5L'
    },
    {
      id: 'za2',
      slug: 'gujarat-board-result-2025-declared-403',
      image: '/assets/demo/7.jpg',
      titleGu: 'ગુજરાત બોર્ડ પરિણામ 2025 જાહેર! ટોપર્સનું લિસ્ટ અને ટકાવારી જુઓ',
      title: 'Gujarat Board Result 2025 declared! Check toppers list and percentage',
      relativeTimeGu: '3 કલાક પહેલાં',
      relativeTime: '3 hours ago',
      viewsGu: '1.2L',
      views: '1.2L'
    },
    {
      id: 'za3',
      slug: 'dwarka-temple-flag-ceremony-devotees-excited-404',
      image: '/assets/demo/5.jpg',
      titleGu: 'સરકારી ન્યૂઝલેટર: યોજનાઓની પ્રગતિ અંગે અહેવાલ પ્રસિદ્ધ કરવામાં આવ્યો',
      title: 'Government Newsletter: Progress report of schemes published',
      relativeTimeGu: '4 કલાક પહેલાં',
      relativeTime: '4 hours ago',
      viewsGu: '95K',
      views: '95K'
    },
    {
      id: 'za4',
      slug: 'ahmedabad-metro-phase2-update-405',
      image: '/assets/demo/1.jpg',
      titleGu: 'અમદાવાદ મેટ્રો ફેઝ-2: કામ ઝડપથી આગળ, ક્યારે ઉઘડશે?',
      title: 'Ahmedabad Metro Phase-2: Work fast, when will it open?',
      relativeTimeGu: '5 કલાક પહેલાં',
      relativeTime: '5 hours ago',
      viewsGu: '85K',
      views: '85K'
    },
    {
      id: 'za5',
      slug: 'surat-diamond-industry-boom-406',
      image: '/assets/demo/2.jpg',
      titleGu: 'સુરત ડાયમંડ ઉદ્યોગ: નિકાસમાં નવો વિક્રમ, 20,000 નોકરી',
      title: 'Surat Diamond Industry: New export record, 20,000 jobs',
      relativeTimeGu: '6 કલાક પહેલાં',
      relativeTime: '6 hours ago',
      viewsGu: '72K',
      views: '72K'
    },
    {
      id: 'za6',
      slug: 'gujarat-cricket-ranji-trophy-407',
      image: '/assets/demo/4.jpg',
      titleGu: 'ગુજરાત ક્રિકેટ: રણજી ટ્રોફીમાં ઐતિહાસિક જીત, ચાહકો ઉત્સાહિત',
      title: 'Gujarat Cricket: Historic win in Ranji Trophy, fans excited',
      relativeTimeGu: '7 કલાક પહેલાં',
      relativeTime: '7 hours ago',
      viewsGu: '68K',
      views: '68K'
    },
    {
      id: 'za7',
      slug: 'solar-power-gujarat-village-408',
      image: '/assets/demo/8.jpg',
      titleGu: 'ગ્રામ્ય ગુજરાત: સૌર ઊર્જાથી 500 ગામ રોશન, ખેડૂતો ખુશ',
      title: 'Rural Gujarat: 500 villages lit by solar energy, farmers happy',
      relativeTimeGu: '8 કલાક પહેલાં',
      relativeTime: '8 hours ago',
      viewsGu: '60K',
      views: '60K'
    },
    {
      id: 'za8',
      slug: 'gandhinagar-startup-summit-409',
      image: '/assets/demo/5.jpg',
      titleGu: 'ગાંધીનગર સ્ટાર્ટઅપ સમિટ: 500 ઉદ્યોગ સાહસિક, ₹100 Cr રોકાણ',
      title: 'Gandhinagar Startup Summit: 500 entrepreneurs, ₹100 Cr investment',
      relativeTimeGu: '9 કલાક પહેલાં',
      relativeTime: '9 hours ago',
      viewsGu: '55K',
      views: '55K'
    },
    {
      id: 'za9',
      slug: 'gujarat-tourism-record-2025-410',
      image: '/assets/demo/6.jpg',
      titleGu: 'ગુજરાત પ્રવાસન: 2025માં 3 કરોડ પ્રવાસી, નવો રેકોર્ડ',
      title: 'Gujarat Tourism: 3 crore tourists in 2025, new record',
      relativeTimeGu: '10 કલાક પહેલાં',
      relativeTime: '10 hours ago',
      viewsGu: '48K',
      views: '48K'
    },
    {
      id: 'za10',
      slug: 'rajkot-smart-city-development-411',
      image: '/assets/demo/3.jpg',
      titleGu: 'રાજકોટ સ્માર્ટ સિટી: નવા પ્રોજેક્ટ સાથે શહેર બનશે અત્યાધુનિક',
      title: 'Rajkot Smart City: City to become ultra-modern with new projects',
      relativeTimeGu: '11 કલાક પહેલાં',
      relativeTime: '11 hours ago',
      viewsGu: '42K',
      views: '42K'
    },
    {
      id: 'za11',
      slug: 'gujarat-education-new-policy-2025-412',
      image: '/assets/demo/4.jpg',
      titleGu: 'ગુજરાત શિક્ષણ નીતિ 2025: વિદ્યાર્થીઓ માટે નવી સુવિધાઓ જાહેર',
      title: 'Gujarat Education Policy 2025: New facilities announced for students',
      relativeTimeGu: '12 કલાક પહેલાં',
      relativeTime: '12 hours ago',
      viewsGu: '38K',
      views: '38K'
    }
  ];

  // Total groups: ceil(12 / 3) = 4  (groups: 0→[1-3], 1→[4-6], 2→[7-9], 3→[10-12])
  const totalGroups = Math.ceil(mockArticles.length / ITEMS_PER_SLIDE);
  const startIndex = groupIndex * ITEMS_PER_SLIDE;
  const visibleArticles = mockArticles.slice(startIndex, startIndex + ITEMS_PER_SLIDE);

  // Auto-scroll: advance one group every 2s, loops back to group 0
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setGroupIndex((prev) => (prev + 1) % totalGroups);
    }, 2000);
    return () => clearInterval(timer);
  }, [paused, totalGroups]);

  const getGoldNumberGu = (idx: number) => {
    const val = startIndex + idx + 1; // 1-based
    return toGuLocal(val);
  };

  const getGoldNumber = (idx: number) => {
    return String(startIndex + idx + 1); // 1-based
  };

  const leftContent = (
    <div className="flex flex-col min-w-0">

      {/* Header */}
      <div className="flex items-center justify-between border-b-[3px] border-slate-950 pb-2.5 mb-6">
        <span className="bg-[#B3121B] text-white px-5 py-1.5 font-extrabold text-[14px] md:text-[15px] rounded-sm tracking-tight leading-none uppercase">
          {language === 'gu' ? 'લોકપ્રિય  સ્ટોરીઝ' : 'Popular  Stories'}
        </span>
        <Link
          href="/category/trending"
          className="text-[#B3121B] hover:text-red-700 font-extrabold text-[13px] md:text-[14px] hover:underline"
        >
          {language === 'gu' ? 'વધુ સમાચાર →' : 'More News →'}
        </Link>
      </div>

      {/* Slider Row */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleArticles.map((art, idx) => (
            <div key={art.id} className="flex flex-col min-w-0">
              <Link href={`/news/${art.slug}`} className="group flex flex-col gap-2.5">
                {/* Image wrapper */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border/10 bg-muted">
                  {/* Overlay index badge matching tv9 style */}
                  <span className="absolute top-2 left-2 z-10 bg-black/75 text-white text-[12px] font-black h-6 w-6 flex items-center justify-center rounded-sm select-none">
                    {language === 'gu' ? getGoldNumberGu(idx) : getGoldNumber(idx)}
                  </span>

                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <h3 className="text-[13.5px] font-black leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-2">
                  {language === 'gu' ? art.titleGu : art.title}
                </h3>
              </Link>

              {/* Metadata */}
              <div className="text-[11px] text-muted-foreground font-bold mt-1 select-none">
                {language === 'gu' ? art.relativeTimeGu : art.relativeTime}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel controls - visual indicators */}
        <div className="flex justify-center items-center gap-1.5 mt-5 mb-1 select-none">
          {Array.from({ length: totalGroups }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setGroupIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${groupIndex === idx ? 'w-5 bg-[#B3121B]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              aria-label={`Go to slide group ${idx + 1}`}
            />
          ))}
        </div>
      </div>

    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col gap-6 select-none">

      {/* E-Paper Widget */}
      <div className="w-full rounded-sm border border-slate-200 bg-card p-6 shadow-sm flex items-center justify-between hover:border-red-300 transition-colors cursor-pointer select-none">
        <div className="flex items-center gap-3">
          <span className="bg-[#B3121B] text-white px-2.5 py-1 text-[11.5px] font-black rounded-sm">
            {language === 'gu' ? 'ઈ-પેપર' : 'E-Paper'}
          </span>
          <div className="flex flex-col">
            <span className="text-[12.5px] font-black text-foreground">
              {language === 'gu' ? 'આજનું ઈ-પેપર વાંચો' : 'Read today\'s E-paper'}
            </span>
            <span className="text-[10px] text-muted-foreground font-bold mt-0.5">
              {language === 'gu' ? '14 જૂન 2025 · PDF' : '14 June 2025 · PDF'}
            </span>
          </div>
        </div>
        <span className="text-[#B3121B] font-extrabold text-[15px] pr-1">→</span>
      </div>

      {/* Recharge Plus Ad Widget */}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="bg-slate-100/95 border border-slate-200 border-b-0 text-[10px] text-slate-500 font-black py-1.5 text-center uppercase tracking-widest rounded-t-sm">
          {language === 'gu' ? 'જાહેરાત' : 'ADVERTISEMENT'}
        </div>
        <div className="w-full rounded-b-sm bg-gradient-to-br from-[#5D3FD3] to-[#4A2CA8] text-white p-8 py-10 flex flex-col items-center justify-center relative overflow-hidden border border-slate-200 text-center flex-1 shadow-sm" style={{ minHeight: 265 }}>
          <h4 className="text-[22px] font-black tracking-tight select-none">
            {language === 'gu' ? 'રિચાર્જ પ્લસ' : 'Recharge Plus'}
          </h4>
          <p className="text-[13px] text-white/90 font-bold mt-2.5 leading-snug max-w-[220px]">
            {language === 'gu' ? 'અનલિમિટેડ ડેટા + કોલિંગ ફક્ત ₹199/મહિને' : 'Unlimited data + calling only ₹199/month'}
          </p>
          <button
            type="button"
            className="mt-6 bg-white text-[#5D3FD3] font-black text-[13px] px-7 py-3 rounded-full shadow-md hover:bg-white/95 active:scale-[0.98] transition-all cursor-pointer"
          >
            {language === 'gu' ? 'રિચાર્જ કરો ›' : 'Recharge Now ›'}
          </button>
        </div>
      </div>

    </div>
  );

  if (view === 'content') {
    return leftContent;
  }

  if (view === 'sidebar') {
    return sidebarContent;
  }

  return (
    <section className="mt-6 border-t border-border pt-5">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
        {leftContent}
        {sidebarContent}
      </div>
    </section>
  );
}

// Localized helper lists
function getLocalizedCityTabs(lang: string) {
  if (lang === 'hi') return ['अहमदाबाद', 'सूरत', 'वडोदरा', 'राजकोट', 'गांधीनगर', 'अन्य'];
  if (lang === 'en') return ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Other'];
  return ['અમદાવાદ', 'સુરત', 'વડોદરા', 'રાજકોટ', 'ગાંધીનગર', 'અન્ય'];
}

function getLocalizedBeats(lang: string) {
  if (lang === 'hi') return ['सिविक', 'ट्रैफिक', 'मेट्रो', 'क्राइम', 'मौसम'];
  if (lang === 'en') return ['Civic', 'Traffic', 'Metro', 'Crime', 'Weather'];
  return ['સિવિક', 'ટ્રાફિક', 'મેટ્રો', 'ક્રાઇમ', 'હવામાન'];
}

function getLocalizedTrendingTags(lang: string) {
  if (lang === 'hi') return ['#चुनाव 2026', '#बारिश', '#सोना-चांदी', '#क्रिकेट', '#मेट्रो', '#सेमीकंडक्टर', '#डायमंड उद्योग', '#ट्रैफिक'];
  if (lang === 'en') return ['#Election 2026', '#Rain', '#Gold-Silver', '#Cricket', '#Metro', '#Semiconductor', '#Diamond Industry', '#Traffic'];
  return ['#ચૂંટણી 2026', '#વરસાદ', '#સોના-ચાંદી', '#ક્રિકેટ', '#મેટ્રો', '#સેમિકન્ડક્ટર', '#ડાયમંડ ઉદ્યોગ', '#ટ્રાફિક'];
}

/* --- Trending Sidebar Widget ------------------------------------------------ */
function TrendingSidebarWidget({ articles, language }: { articles: Article[]; language: Language }) {
  if (!articles.length) return null;

  return (
    <div className="border border-border/85 bg-card rounded-xl p-4 shadow-sm mt-3">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2 border-b border-border pb-2">
        <Flame className="h-5 w-5 text-accent animate-pulse fill-current shrink-0" />
        <h3 className="text-[16px] font-black text-foreground">
          {getLocalized(language, { en: 'Trending News', gu: 'ટ્રેન્ડિંગ સમાચાર', hi: 'ट्रेंडिंग समाचार' })}
        </h3>
      </div>

      {/* Vertical List */}
      <div className="flex flex-col gap-3.5">
        {articles.slice(0, 10).map((art, idx) => (
          <Link
            key={art.id}
            href={`/news/${art.slug}`}
            className="group flex items-start gap-3 transition-colors pb-3 border-b border-border/40 last:border-0 last:pb-0"
          >
            {/* Number Rank */}
            <span className="text-[20px] font-black text-accent/80 group-hover:text-accent w-6 shrink-0 mt-0.5 text-center">
              {idx + 1}
            </span>
            {/* Small Thumbnail */}
            <div className="relative h-[38px] w-[56px] shrink-0 overflow-hidden rounded-md border border-border/10 bg-muted">
              <Image
                src={art.image}
                alt={art.title}
                fill
                sizes="56px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {/* Title */}
            <div className="min-w-0 flex-1">
              <h4 className="line-clamp-3 text-[13.5px] leading-snug font-medium text-foreground group-hover:text-accent transition-colors duration-150">
                {getArticleTitle(art, language)}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* --- Section Label ---------------------------------------------------------- */
function SectionLabel({ title, titleGu, language }: { title: string; titleGu: string; language: Language }) {
  const display = language === 'en' ? title : titleGu;
  return (
    <div className="flex items-center gap-1.5 mb-1 border-b-2 border-accent pb-0.5">
      <Flame className="h-5 w-5 text-accent fill-current shrink-0" />
      <span className="text-[19px] md:text-[21px] font-black leading-tight text-foreground">{display}</span>
    </div>
  );
}

/* --- Article Hover Preview Removed ----------------------------------------- */

/* --- Left List Item --------------------------------------------------------- */
function LeftListItem({ article, language }: { article: Article; language: Language }) {
  const title = getArticleTitle(article, language);
  const cat = getCategoryLabel(article, language);
  const cc = getCategoryColor(article.category);
  return (
    <Link href={`/news/${article.slug}`} className="group flex min-h-[58px] gap-2 rounded px-1 py-1.5 transition hover:bg-muted/50">
      <div className="relative h-[50px] w-[68px] shrink-0 overflow-hidden rounded-md">
        <Image src={article.image} alt={article.title} fill sizes="68px" className="object-cover transition duration-300 group-hover:scale-105" />
      </div>
      <div className="min-w-0 flex flex-1 flex-col justify-between">
        <div>
          <span className="rounded px-1.5 py-[2px] text-[8px] font-black leading-none text-white" style={{ background: cc }}>{cat}</span>
          <p className="mt-0.5 line-clamp-2 text-[13.5px] font-black leading-[1.2] text-foreground transition-colors group-hover:text-accent">{title}</p>
        </div>
        <div className="flex items-center justify-between gap-2 text-[10px] font-semibold text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{formatTime(article.publishedAt)}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

/* --- Story Row (horizontal list view matching user design) ----------------- */
function StoryRow({ article, language }: { article: Article; language: Language }) {
  const title = getArticleTitle(article, language);
  const cc = getCategoryColor(article.category || '');

  // Decide overlay icons for visual interest matching user screenshot
  const categoryLower = article.category?.toLowerCase() || '';
  const showPlay = ['entertainment', 'world', 'politics', 'sports'].includes(categoryLower);
  const showCamera = ['technology', 'business', 'lifestyle', 'crime'].includes(categoryLower);

  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex items-center justify-between gap-4 py-3 hover:bg-muted/40 transition-colors duration-200 first:pt-1 last:pb-1"
    >
      {/* Title (left side) */}
      <h3 className="flex-1 text-[14px] md:text-[15.5px] font-black leading-snug text-foreground transition-colors duration-200 group-hover:text-accent line-clamp-3 pr-2">
        {title}
      </h3>

      {/* Image Thumbnail (right side) */}
      <div className="relative h-[66px] w-[100px] shrink-0 overflow-hidden rounded-lg border border-border/10 shadow-sm">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="100px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay icon at bottom-left of image */}
        {showPlay && (
          <div className="absolute left-1 bottom-1 bg-red-600 text-white rounded p-1 flex items-center justify-center shadow-lg">
            <Play className="h-3 w-3 fill-current text-white" />
          </div>
        )}
        {showCamera && (
          <div className="absolute left-1 bottom-1 bg-red-600 text-white rounded p-1 flex items-center justify-center shadow-lg">
            <Camera className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
    </Link>
  );
}

/* --- Category Row (4-col horizontal) --------------------------------------- */
function CategoryRow({
  title, titleGu, href, articles, language
}: { title: string; titleGu: string; href: string; articles: Article[]; language: Language }) {
  const display = language === 'en' ? title : titleGu;
  return (
    <div>
      <div className="flex items-center justify-between mb-1 border-b border-border pb-1">
        <span className="section-heading text-[18px] md:text-[20px] font-black leading-tight text-foreground">{display}</span>
        <Link href={href} className="flex items-center gap-0.5 text-[13px] md:text-[14px] font-bold text-accent hover:underline">
          {language === 'gu' ? 'બધા જુઓ' : 'View all'} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
        {articles.slice(0, 16).map((art: Article) => {
          const t = getArticleTitle(art, language);
          const cc = getCategoryColor(art.category);
          return (
            <Link key={art.id} href={`/news/${art.slug}`} className="news-card group flex h-[98px] gap-2 overflow-hidden rounded-md border border-border bg-card p-1.5 shadow-sm transition hover:border-accent/40 hover:shadow-md">
              <div className="relative h-full w-[82px] shrink-0 overflow-hidden rounded">
                <Image src={art.image} alt={art.title} fill sizes="82px" className="object-cover transition group-hover:scale-105" />
              </div>
              <div className="min-w-0 flex flex-1 flex-col justify-between py-1">
                <p className="line-clamp-3 text-[13px] md:text-[13.5px] font-black leading-[1.2] text-foreground transition-colors group-hover:text-accent">{t}</p>
                <div className="flex items-center gap-1 text-[10.5px] leading-none text-muted-foreground border-t border-border/30 pt-0.5">
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
  articles: Article[];
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
        {articles.slice(0, 4).map((art: Article, idx: number) => {
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

interface SportsCricketScore {
  title: string;
  status: string;
  teams: Array<{ name: string; score: string }>;
}

interface SportsFootballScore {
  id: string;
  league: string;
  status: string;
  home: string;
  away: string;
  homeScore: string;
  awayScore: string;
}

function SportsShowcase({ articles, language }: { articles: Article[]; language: Language }) {
  if (!articles.length) return null;

  const mainArticle = articles[0];
  const listArticles = articles.slice(1, 6);
  const sideArticle = articles[6] ?? articles[4] ?? articles[1] ?? articles[0];

  return (
    <section className="rounded-sm border border-border bg-card px-4 py-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-6 w-[3px] rounded-full bg-accent" />
          <h2 className="text-[18px] font-black leading-none text-foreground">
            રમતગમત
            <span className="ml-2 align-middle text-[11px] font-black text-muted-foreground">Sports</span>
          </h2>
        </div>
        <Link href="/category/sports" className="text-[11px] font-black text-accent hover:underline">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.25fr_1.05fr_0.85fr_1.05fr]">
        <SportsFeatureCard article={mainArticle} language={language} label="IPL 2025" large />
        <div className="flex flex-col rounded-md border border-border bg-background">
          {listArticles.map((article) => (
            <SportsListItem key={article.id} article={article} language={language} />
          ))}
        </div>
        <SportsFeatureCard article={sideArticle} language={language} label="ટેનિસ" />
        <SportsScorePanel language={language} />
      </div>
    </section>
  );
}

function SportsFeatureCard({
  article,
  language,
  label,
  large = false,
}: {
  article: Article;
  language: Language;
  label: string;
  large?: boolean;
}) {
  const title = getArticleTitle(article, language);
  const excerpt = getArticleExcerpt(article, language);
  const cc = getCategoryColor(article.category);

  return (
    <Link href={`/news/${article.slug}`} className="group relative block min-h-[210px] overflow-hidden rounded-md bg-slate-950">
      <Image
        src={article.image}
        alt={article.title}
        fill
        sizes={large ? '(max-width: 1024px) 100vw, 34vw' : '(max-width: 1024px) 100vw, 22vw'}
        className="object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5" />
      <span
        className="absolute left-3 top-3 rounded px-2.5 py-1 text-[10px] font-black text-white"
        style={{ background: label === 'IPL 2025' ? '#dc2626' : cc }}
      >
        {label}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <h3 className={`${large ? 'text-[19px]' : 'text-[15px]'} line-clamp-2 font-black leading-snug`}>
          {title}
        </h3>
        {large && <p className="mt-2 line-clamp-2 text-[13px] font-semibold leading-relaxed text-white/85">{excerpt}</p>}
        <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-white/85">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(article.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function SportsListItem({ article, language }: { article: Article; language: Language }) {
  const title = getArticleTitle(article, language);
  const cat = getCategoryLabel(article, language);

  return (
    <Link href={`/news/${article.slug}`} className="group flex flex-1 gap-3 border-b border-border p-2.5 last:border-b-0 hover:bg-muted/60">
      <div className="relative h-[70px] w-[96px] shrink-0 overflow-hidden rounded">
        <Image src={article.image} alt={article.title} fill sizes="96px" className="object-cover transition duration-300 group-hover:scale-105" />
      </div>
      <div className="min-w-0 flex flex-1 flex-col justify-between">
        <div>
          <p className="text-[11px] font-black leading-none text-accent">{cat}</p>
          <p className="mt-1 line-clamp-2 text-[12.5px] font-black leading-snug text-foreground group-hover:text-accent">
            {title}
          </p>
        </div>
        <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            {formatTime(article.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function SportsScorePanel({ language }: { language: Language }) {
  const [cricket, setCricket] = useState<SportsCricketScore | null>(null);
  const [football, setFootball] = useState<SportsFootballScore[]>([]);

  useEffect(() => {
    setCricket(null);
    setFootball([]);
  }, []);

  const cricketRows = cricket?.teams.length
    ? cricket.teams.slice(0, 2)
    : [
      { name: 'GT', score: '196/4' },
      { name: 'MI', score: '160/8' },
    ];
  const footballRow = football[0];

  return (
    <aside className="rounded-md border border-dashed border-accent/55 bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-black text-accent">
          {language === 'en' ? 'Live Score' : 'લાઇવ સ્કોર'}
        </h3>
        <Link href="/live" className="text-[10px] font-black text-accent underline">
          View All
        </Link>
      </div>

      <div className="space-y-2">
        <ScoreBox
          title={cricket?.title ?? 'IPL 2025'}
          rows={cricketRows.map((team) => ({ name: team.name, score: team.score }))}
          status={cricket?.status ?? 'GT won by 36 runs'}
          statusColor="text-emerald-600"
        />
        <ScoreBox
          title={footballRow?.league ?? 'Ranji Trophy'}
          rows={[
            { name: footballRow?.home ?? 'Gujarat', score: footballRow?.homeScore ?? '275/6' },
            { name: footballRow?.away ?? 'Mumbai', score: footballRow?.awayScore ?? '312/10' },
          ]}
          status={footballRow?.status ?? 'Day 2 - Stumps'}
          statusColor="text-accent"
        />
        <ScoreBox
          title="Pro Kabaddi"
          rows={[
            { name: 'GUJ', score: '32' },
            { name: 'BEN', score: '28' },
          ]}
          status="GUJ won"
          statusColor="text-emerald-600"
        />
      </div>
    </aside>
  );
}

function ScoreBox({
  title,
  rows,
  status,
  statusColor,
}: {
  title: string;
  rows: Array<{ name: string; score: string }>;
  status: string;
  statusColor: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background px-3 py-2 shadow-sm">
      <p className="mb-2 text-[10px] font-black text-sky-600">{title}</p>
      <div className="space-y-1">
        {rows.map((row) => (
          <div key={`${title}-${row.name}`} className="flex items-center justify-between gap-3 text-[12px] font-black text-foreground">
            <span className="min-w-0 truncate">{row.name}</span>
            <span className="shrink-0">{row.score}</span>
          </div>
        ))}
      </div>
      <p className={`mt-2 text-right text-[10px] font-black ${statusColor}`}>{status}</p>
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
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <span className="bg-[#e02020] text-white text-[13px] font-extrabold px-3 py-1 rounded-sm select-none">
          {language === 'gu' ? 'વીડિયો' : language === 'hi' ? 'वीडियो' : 'Videos'}
        </span>
        <Link
          href="/videos"
          className="text-[#e02020] text-sm font-bold hover:underline flex items-center gap-1"
        >
          {language === 'gu' ? 'બધા જુઓ' : 'View All'} →
        </Link>
      </div>
      {/* Underline */}
      <div className="h-[2.5px] w-full bg-black mb-5" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {videos.map((v) => (
          <div key={v.id} className="overflow-hidden rounded-xl border border-border/10 bg-card shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
            <div className="relative aspect-video overflow-hidden bg-slate-950">
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
              <p className="line-clamp-2 text-[12.5px] font-bold leading-snug text-foreground">
                {getLocalized(language, { en: v.title, gu: v.titleGu, hi: v.titleHi })}
              </p>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground mt-2 font-semibold">
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
    setLiveStatus('offline');
    setVideoMode('latest');
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
    const FALLBACK_WEATHER = [
      { city: 'Ahmedabad', state: 'Gujarat', temperature: 32, condition: 'Partly cloudy', humidity: 65, windSpeed: 12 },
      { city: 'Vadodara', state: 'Gujarat', temperature: 31, condition: 'Sunny', humidity: 62, windSpeed: 10 }
    ];
    setWeather(FALLBACK_WEATHER);
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
          {(Array.isArray(weather) ? weather.slice(0, 2) : []).map((item) => (
            <div key={item.city} className="rounded-2xl border border-border/80 bg-card p-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-foreground">{item.city}</p>
                  <p className="text-[11px] text-muted-foreground">{item.condition}</p>
                </div>
                <span className="text-3xl font-black text-accent">{item.temperature}°C</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                <div className="rounded-xl bg-muted p-2 text-center">
                  <p className="font-semibold text-foreground">Humidity</p>
                  <p>{item.humidity}%</p>
                </div>
                <div className="rounded-xl bg-muted p-2 text-center">
                  <p className="font-semibold text-foreground">Wind</p>
                  <p>{item.windSpeed} km/h</p>
                </div>
                <div className="rounded-xl bg-muted p-2 text-center">
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

/* --- Hero Section Skeleton Loader ------------------------------------------- */
function HeroSectionSkeleton({ language }: { language: Language }) {
  const isGu = language === 'gu';
  const labelTopNews = isGu ? 'મુખ્ય સમાચાર' : 'Top News';
  const labelTopStories = isGu ? 'ટૉપ સ્ટોરી' : 'Top Stories';
  const labelTrending = isGu ? 'ટ્રેન્ડિંગ સમાચાર' : 'Trending News';
  const labelStateNews = isGu ? 'રાજ્ય સમાચાર' : 'State News';
  const labelLiveTV = isGu ? 'લાઈવ ટીવી' : 'Live TV';
  const labelWeather = isGu ? 'હવામાન' : 'Weather';
  const labelEPaper = isGu ? 'ઈ-પેપર' : 'E-Paper';

  return (
    <div className="mx-auto max-w-screen-xl px-2 py-0.5 space-y-2 animate-pulse">
      {/* ROW 1: 3-column main section */}
      <div className="grid grid-cols-1 gap-1 lg:grid-cols-[minmax(0,1fr)_280px] items-start">
        <div className="min-w-0">
          {/* ── REDESIGNED HERO NEWS SECTION SKELETON ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start animate-pulse">

            {/* LEFT COLUMN (Featured News + 3 Horizontal Cards Skeleton) */}
            <div className="w-full flex flex-col gap-6">
              <div className="w-full">
                <div className="relative aspect-[16/9] w-full rounded-lg bg-muted" />
                <div className="h-3.5 w-16 bg-muted rounded mt-3" />
                <div className="h-8 w-full bg-muted rounded mt-2" />
                <div className="h-8 w-3/4 bg-muted rounded mt-2" />
              </div>
              <div className="flex flex-col gap-5 border-t border-border/80 pt-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-1 space-y-1.5 py-1">
                      <div className="h-3 w-16 bg-muted rounded" />
                      <div className="h-4.5 w-full bg-muted rounded" />
                      <div className="h-4.5 w-5/6 bg-muted rounded" />
                    </div>
                    <div className="relative w-[88px] h-[58px] rounded-lg bg-muted shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE (2-Column Grid of 6 Small Cards Skeleton) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col w-full">
                  <div className="relative aspect-[2/1] w-full rounded-lg bg-muted" />
                  <div className="h-3 w-16 bg-muted rounded mt-2" />
                  <div className="h-4.5 w-full bg-muted rounded mt-2" />
                  <div className="h-4.5 w-5/6 bg-muted rounded mt-1.5" />
                </div>
              ))}
            </div>

          </div>

          {/* Trending Bar skeleton */}
          <div className="min-w-0 mt-2">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-border bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <Flame className="h-[18px] w-[18px] text-accent/20 fill-current" />
                  <span className="text-[15px] font-black leading-tight text-muted-foreground/35">{labelTrending}</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-6 w-6 rounded-full bg-muted" />
                  <div className="h-6 w-6 rounded-full bg-muted" />
                </div>
              </div>
              <div className="flex divide-x divide-border px-1 py-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 px-3.5 py-1 shrink-0 w-[240px] md:w-[280px]">
                    <div className="h-8 w-4 rounded bg-muted" />
                    <div className="h-[40px] w-[56px] shrink-0 rounded-lg bg-muted" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-full rounded bg-muted" />
                      <div className="h-3 w-3/4 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rajya Samachar / State News skeleton */}
          <div className="min-w-0 mt-2">
            <div className="flex items-center justify-between mb-1 border-b border-border pb-1">
              <span className="text-[18px] md:text-[20px] font-black leading-tight text-muted-foreground/35">{labelStateNews}</span>
              <div className="h-4 w-16 rounded bg-muted" />
            </div>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex h-[98px] gap-2 rounded border border-border bg-card p-1.5 shadow-sm">
                  <div className="h-full w-[82px] shrink-0 rounded bg-muted" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-3 w-5/6 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT WIDGETS skeleton */}
        <div className="flex flex-col gap-1.5 w-full lg:w-[280px]">
          {/* Live TV Widget Skeleton */}
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between bg-accent/20 px-3 py-1.5">
              <span className="text-xs md:text-sm font-black text-muted-foreground/30 uppercase tracking-wide">{labelLiveTV}</span>
              <div className="h-4 w-12 rounded bg-muted" />
            </div>
            <div className="relative aspect-[4/3] bg-muted" />
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <div className="h-6 w-24 rounded bg-muted" />
              <div className="h-6 w-16 rounded bg-muted" />
            </div>
          </div>

          {/* Weather Widget Skeleton */}
          <div className="rounded-lg border border-border bg-card p-3 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-1">
              <span className="text-xs md:text-sm font-black text-muted-foreground/30">{labelWeather}</span>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card p-3 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-20 rounded bg-muted" />
                  <div className="h-3 w-16 rounded bg-muted" />
                </div>
                <div className="h-8 w-12 rounded bg-muted" />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="h-8 rounded-xl bg-muted" />
                <div className="h-8 rounded-xl bg-muted" />
                <div className="h-8 rounded-xl bg-muted" />
              </div>
            </div>
          </div>

          {/* EPaper Widget Skeleton */}
          <div className="rounded-lg border border-border bg-card p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-1 mb-1">
              <span className="text-xs md:text-sm font-black text-muted-foreground/30">{labelEPaper}</span>
              <div className="h-3 w-16 rounded bg-muted" />
            </div>
            <div className="flex gap-3">
              <div className="h-[90px] w-[80px] shrink-0 rounded bg-muted" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-20 rounded bg-muted" />
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="h-6 w-24 rounded bg-muted mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mockPoliticsColumns = [
  {
    colId: 'pol-col-1',
    featured: {
      id: 'pol-feat-1',
      slug: 'gujarat-election-2027-preparations-active-501',
      image: '/assets/demo/4.jpg',
      categoryGu: 'ચૂંટણી',
      titleGu: 'ગુજરાત ચૂંટણી 2027 નજીક! જિલ્લાઓમાં તૈયારીઓ તેજ, સત્તાધારી પક્ષ સક્રિય',
      relativeTimeGu: '1 કલાક પહેલાં',
      views: 71000
    },
    subs: [
      {
        id: 'pol-sub-1-1',
        slug: 'delhi-politics-seat-sharing-talks-500',
        titleGu: 'સીટ શેરીંગ ફોર્મ્યુલા નક્કી: ગઠબંધન પક્ષો વચ્ચે બેઠકોની વહેંચણી ફાઈનલ'
      },
      {
        id: 'pol-sub-1-2',
        slug: 'state-assembly-speaker-rules-501',
        titleGu: 'વિધાનસભા સ્પીકરની ચેતવણી: તમામ સભ્યોને ગૃહની ગરિમા જાળવવા આદેશ'
      },
      {
        id: 'pol-sub-1-3',
        slug: 'government-policy-infrastructure-development-502',
        titleGu: 'નવા ઇન્ફ્રાસ્ટ્રક્ચર પ્રોજેક્ટ્સને મંજૂરી: રાજ્ય સરકારનો મોટો નિર્ણય'
      }
    ]
  },
  {
    colId: 'pol-col-2',
    featured: {
      id: 'pol-feat-2',
      slug: 'aap-ground-network-expansion-gujarat-502',
      image: '/assets/demo/1.jpg',
      categoryGu: 'AAP',
      titleGu: 'AAPનો મોટો દાવો! ગ્રામ્ય ગુજરાતમાં ભૂ-સ્તરીય નેટવર્ક વિસ્તાર્યું',
      relativeTimeGu: '2 કલાક પહેલાં'
    },
    subs: [
      {
        id: 'pol-sub-2-1',
        slug: 'ahmedabad-municipal-commissioner-dispute-503',
        titleGu: 'મોટો વિવાદ! અમદાવાદ મ્યુનિ. કમિશનરે તંત્ર સામે વાંધો ઉઠાવ્યો'
      },
      {
        id: 'pol-sub-2-2',
        slug: 'military-training-irregularities-promotions-cancelled-504',
        titleGu: 'સૈન્ય તાલીમમાં મોટી ગેરરીતિ! 100થી વધુ પ્રમોશન રદ કરાયા'
      },
      {
        id: 'pol-sub-2-3',
        slug: 'congress-unveils-strategy-2027-election-505',
        titleGu: 'કોંગ્રેસે ખોલ્યા પત્તા! 2027 ચૂંટણી ઝુંબેશ વ્યુહ જાહેર કર્યો'
      }
    ]
  },
  {
    colId: 'pol-col-3',
    featured: {
      id: 'pol-feat-3',
      slug: 'assembly-monsoon-session-commotion-unemployment-506',
      image: '/assets/demo/3.jpg',
      categoryGu: 'વિધાનસભા',
      titleGu: 'વિધાનસભા ચોમાસુ સત્રમાં હોબાળો! વિપક્ષે બેરોજગારી મુદ્દે સ્થગન પ્રસ્તાવ આપ્યો',
      relativeTimeGu: '3 કલાક પહેલાં'
    },
    subs: [
      {
        id: 'pol-sub-3-1',
        slug: 'high-court-notice-state-govt-recruitment-507',
        titleGu: 'હાઈકોર્ટની આકરી નોટિસ! રાજ્ય સરકારને ભરતી પ્રક્રિયા અંગે જવાબ માંગ્યો'
      },
      {
        id: 'pol-sub-3-2',
        slug: 'union-minister-gujarat-visit-industrial-corridor-announcement-508',
        titleGu: 'કેન્દ્રીય મંત્રીની ગુજરાત મુલાકાત! નવા ઔદ્યોગિક કોરિડોરની જાહેરાત શક્ય'
      },
      {
        id: 'pol-sub-3-3',
        slug: 'voter-list-revision-campaign-starts-online-registration-appeal-509',
        titleGu: 'મતદાર યાદી સુધારણા ઝુંબેશ શરૂ! નાગરિકોને ઓનલાઈન નોંધણીની અપીલ'
      }
    ]
  }
];

const mockPoliticsBottomCards = [
  {
    id: 'pol-bot-1',
    slug: 'cm-meeting-vibrant-gujarat-rural-development-511',
    image: '/assets/demo/5.jpg',
    categoryGu: 'મુખ્યમંત્રી',
    titleGu: 'CMની મોટી બેઠક! વિકાસ પ્રોજેક્ટ માટે સમીક્ષા, ગ્રામીણ વિસ્તારો પર ભાર',
    relativeTimeGu: '2 કલાક પહેલાં',
    views: 74000
  },
  {
    id: 'pol-bot-2',
    slug: 'bjp-state-executive-meeting-organization-expansion-512',
    image: '/assets/demo/6.jpg',
    categoryGu: 'ભાજપ',
    titleGu: 'ભાજપ પ્રદેશ કારોબારીની બેઠકમાં સંગઠન વિસ્તરણ પર મોટી ચર્ચા',
    relativeTimeGu: '3 કલાક પહેલાં',
    views: 78000
  },
  {
    id: 'pol-bot-3',
    slug: 'police-recruitment-10000-posts-513',
    image: '/assets/demo/2.jpg',
    categoryGu: 'ગૃહ વિભાગ',
    titleGu: 'યુવાનો માટે મોટી તક! પોલીસ ભરતીમાં 10,000 જગ્યાઓ ટૂંક સમયમાં ભરાશે',
    relativeTimeGu: '12 કલાક પહેલાં',
    views: 33000
  },
  {
    id: 'pol-bot-4',
    slug: 'municipal-corporation-election-ward-delimitation-514',
    image: '/assets/demo/3.jpg',
    categoryGu: 'સ્થાનિક સ્વરાજ્ય',
    titleGu: 'મહાનગરપાલિકા ચૂંટણી નજીક! વોર્ડ સીમાંકનની પ્રક્રિયા શરૂ',
    relativeTimeGu: '13 કલાક પહેલાં',
    views: 46000
  },
  {
    id: 'pol-bot-5',
    slug: 'alliance-possibility-before-next-election-515',
    image: '/assets/demo/7.jpg',
    categoryGu: 'ગઠબંધન',
    titleGu: 'આગામી ચૂંટણી પહેલાં મોટી હલચલ! નાના પક્ષો વચ્ચે ગઠબંધનની શક્યતાઓ તપાસાઈ રહી છે',
    relativeTimeGu: '14 કલાક પહેલાં',
    views: 52000
  }
];

/* --- Politics Section ("રાજકારણ" Zone) ----------------------------- */
export function PoliticsSection({ language }: { language: Language }) {
  return (
    <div className="mx-auto max-w-screen-xl px-4 mt-8">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-[3.5px] border-slate-950 dark:border-slate-800 pb-3 mb-6">
        <span className="bg-[#B3121B] text-white px-5 py-2.5 text-[13.5px] md:text-[14.5px] font-black rounded-lg select-none leading-none tracking-tight">
          {language === 'gu' ? 'રાજકારણ' : language === 'hi' ? 'राजनीति' : 'Politics'}
        </span>
        <Link
          href="/category/politics"
          className="text-[#B3121B] hover:text-red-700 font-extrabold text-[13px] md:text-[14px] hover:underline"
        >
          {language === 'gu' ? 'વધુ જુઓ →' : 'More →'}
        </Link>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {mockPoliticsColumns.map((col) => (
          <div key={col.colId} className="flex flex-col min-w-0">
            <div className="flex flex-col min-w-0">
              <Link
                href={`/news/${col.featured.slug}`}
                className="group flex flex-col mb-2.5"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border/10 bg-muted mb-2.5">
                  <Image
                    src={col.featured.image || ''}
                    alt={col.featured.titleGu}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="text-[#B3121B] font-extrabold text-[12px] md:text-[13px] mb-1.5 select-none uppercase">
                  {col.featured.categoryGu}
                </span>
                <h3 className="text-[14px] md:text-[15.5px] font-extrabold leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-2 min-h-[40px] md:min-h-[46px]">
                  {col.featured.titleGu}
                </h3>
              </Link>

              {/* Clock Meta Row */}
              <div className="flex items-center gap-1.5 mb-4 pb-2 border-b border-border/40 text-[10.5px] text-muted-foreground font-semibold">
                <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span>{col.featured.relativeTimeGu || '1 કલાક પહેલાં'}</span>
              </div>

              {/* Sub-articles list (Text only) */}
              <div className="flex flex-col divide-y divide-border/40">
                {col.subs?.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/news/${sub.slug}`}
                    className="group py-3.5 px-2.5 hover:bg-muted/10 transition-colors rounded-md block"
                  >
                    <h4 className="text-[12px] md:text-[12.5px] font-extrabold leading-snug line-clamp-1 text-foreground group-hover:text-[#B3121B] transition-colors">
                      {sub.titleGu}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5-Card Politics Bottom Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 border-t border-border/40 pt-6 mt-8">
        {mockPoliticsBottomCards.map((card) => (
          <div key={card.id} className="flex flex-col min-w-0">
            <Link
              href={`/news/${card.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border/10 bg-muted mb-2.5">
                <Image
                  src={card.image}
                  alt={card.titleGu}
                  fill
                  sizes="(max-width: 768px) 100vw, 20vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-[#B3121B] font-extrabold text-[11px] mb-1.5 select-none uppercase leading-none">
                {card.categoryGu}
              </span>
              <h4 className="text-[12.5px] md:text-[13px] font-extrabold leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-3">
                {card.titleGu}
              </h4>
            </Link>
            <div className="flex items-center gap-1.5 mt-2.5 text-[10.5px] text-muted-foreground font-semibold">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>{card.relativeTimeGu}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const mockFactCheckList = [
  {
    id: 'fc-1',
    slug: 'viral-video-not-from-gujarat-floods-521',
    image: '/assets/demo/2.jpg',
    status: 'misleading', // ભ્રામક
    statusLabelGu: 'ભ્રામક',
    titleGu: 'સાવધાન! વાયરલ વીડિયો ગુજરાતના પૂરનો નથી, જૂનો અને અલગ રાજ્યનો છે'
  },
  {
    id: 'fc-2',
    slug: 'gujarat-farmer-support-scheme-amount-increased-522',
    image: '/assets/demo/1.jpg',
    status: 'true', // સાચું
    statusLabelGu: 'સાચું',
    titleGu: 'હા, રાજ્યમાં ખેડૂત સહાય યોજનાની રકમમાં ખરેખર વધારો કરાયો છે!'
  },
  {
    id: 'fc-3',
    slug: 'social-media-petrol-price-fake-523',
    image: '/assets/demo/8.jpg',
    status: 'fake', // ખોટો દાવો
    statusLabelGu: 'ખોટો દાવો',
    titleGu: 'સોશિયલ મીડિયા પર ફરતો મેસેજ: "કાલથી પેટ્રોલ ₹50 થશે" – જાણો હકીકત'
  },
  {
    id: 'fc-4',
    slug: 'schools-closed-next-week-rumor-busted-524',
    image: '/assets/demo/3.jpg',
    status: 'misleading', // ભ્રામક
    statusLabelGu: 'ભ્રામક',
    titleGu: 'શું ખરેખર રાજ્યમાં તમામ શાળાઓ આગામી સપ્તાહથી બંધ રહેશે? જાણો સાચી વિગત'
  },
  {
    id: 'fc-5',
    slug: 'senior-citizens-bus-fare-discount-true-525',
    image: '/assets/demo/6.jpg',
    status: 'true', // સાચું
    statusLabelGu: 'સાચું',
    titleGu: 'હા, રાજ્ય સરકારે વરિષ્ઠ નાગરિકો માટે બસ ભાડામાં ખરેખર છૂટ જાહેર કરી છે'
  },
  {
    id: 'fc-6',
    slug: 'whatsapp-new-bank-rules-message-fake-526',
    image: '/assets/demo/7.jpg',
    status: 'fake', // ખોટો દાવો
    statusLabelGu: 'ખોટો દાવો',
    titleGu: 'વોટ્સએપ પર ફરતો "નવો બેંક નિયમ" મેસેજ ખોટો, RBIએ કર્યો ઈનકાર'
  },
  {
    id: 'fc-7',
    slug: 'ahmedabad-bridge-collapse-image-from-other-country-527',
    image: '/assets/demo/4.jpg',
    status: 'misleading', // ભ્રામક
    statusLabelGu: 'ભ્રામક',
    titleGu: 'એ તસવીર અમદાવાદ પુલ તૂટવાની નથી, ત્રણ વર્ષ જૂની અને બીજા દેશની છે'
  },
  {
    id: 'fc-8',
    slug: 'online-registration-new-job-recruitment-starts-528',
    image: '/assets/demo/5.jpg',
    status: 'true', // સાચું
    statusLabelGu: 'સાચું',
    titleGu: 'હા, રાજ્યમાં નવી રોજગાર ભરતી માટે ઓનલાઈન અરજી ખરેખર શરૂ થઈ ગઈ છે'
  }
];

/* --- Fact Check Section ("ફેક્ટ ચેક" Zone) ----------------------------- */
export function FactCheckSection({ language }: { language: Language }) {
  return (
    <div className="mx-auto max-w-screen-xl px-4 mt-10">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-[3.5px] border-slate-950 dark:border-slate-800 pb-3 mb-6">
        <span className="bg-[#B3121B] text-white px-5 py-2.5 text-[13.5px] md:text-[14.5px] font-black rounded-lg select-none leading-none tracking-tight">
          {language === 'gu' ? 'ફેક્ટ  ચેક' : language === 'hi' ? 'तथ्य  जांच' : 'Fact  Check'}
        </span>
        <Link
          href="/category/fact-check"
          className="text-[#B3121B] hover:text-red-700 font-extrabold text-[13px] md:text-[14px] hover:underline"
        >
          {language === 'gu' ? 'વધુ જુઓ →' : 'More →'}
        </Link>
      </div>

      {/* Grid: 3 columns layout (1 column for featured, 2 columns for list grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Left Column: Big Featured Fact Check Card (Spans 1 column on desktop) */}
        <div className="lg:col-span-1 flex flex-col min-w-0">
          <Link
            href="/news/fake-news-alert-free-laptop-scheme-circular-busted-520"
            className="group flex flex-col"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm border border-border/10 bg-muted mb-3.5">
              <Image
                src="/assets/demo/5.jpg"
                alt="Fact Check Featured"
                fill
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="flex items-center gap-1 text-red-600 font-extrabold text-[12px] md:text-[13px] mb-1.5 select-none uppercase tracking-wide">
              <span className="text-[10px]">●</span>
              {language === 'gu' ? 'ખોટો દાવો' : 'FAKE CLAIM'}
            </span>
            <h3 className="text-[15px] md:text-[16px] font-extrabold leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-3">
              {language === 'gu'
                ? 'શું સરકારે ખરેખર બધા વિદ્યાર્થીઓને મફત લેપટોપ આપવાની જાહેરાત કરી? જાણો સત્ય'
                : 'Did government really announce free laptops for all students? Know truth'}
            </h3>
            <p className="text-muted-foreground text-[12.5px] leading-relaxed mt-2.5 line-clamp-3 select-none">
              {language === 'gu'
                ? 'ગુજરાત પોસ્ટની તપાસમાં જાણવા મળ્યું કે વાયરલ પરિપત્ર બનાવટી છે – શિક્ષણ વિભાગે આવી કોઈ જાહેરાત કરી નથી.'
                : 'Gujarat Post investigation revealed that the viral circular is fake – the education department has made no such announcement.'}
            </p>
          </Link>
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-muted-foreground font-semibold">
            <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span>{language === 'gu' ? '1 કલાક પહેલાં' : '1 hour ago'}</span>
          </div>
        </div>

        {/* Right Column: Grid of 8 Fact Check items (Spans 2 columns on desktop) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 lg:pt-0">
          {mockFactCheckList.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="group flex gap-4 hover:bg-muted/10 transition-colors p-1"
            >
              {/* Image Left */}
              <div className="relative h-[68px] w-[100px] shrink-0 overflow-hidden rounded-sm border border-border/10 bg-muted">
                <Image
                  src={item.image}
                  alt={item.titleGu}
                  fill
                  sizes="100px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Content Right */}
              <div className="flex flex-col justify-center min-w-0 flex-1">
                {/* Status Dot + Category Label */}
                <div className="flex mb-1">
                  <span className={`flex items-center gap-1 text-[11px] font-black select-none leading-none uppercase ${item.status === 'true'
                    ? 'text-green-600'
                    : item.status === 'fake'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                    }`}>
                    <span className="text-[10px]">●</span>
                    {language === 'gu' ? item.statusLabelGu : item.status.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-[12.5px] md:text-[13px] font-extrabold leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-2">
                  {item.titleGu}
                </h4>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

const mockNationalColumns = [
  {
    colId: 'nat-col-1',
    featured: {
      id: 'nat-feat-1',
      slug: 'parliament-monsoon-session-starts-today-531',
      image: '/assets/demo/2.jpg',
      titleGu: 'સંસદનું ચોમાસુ સત્ર આજથી! અનેક મોટા ખરડા પર થશે ઘમાસાણ',
      relativeTimeGu: '1 કલાક પહેલાં',
      views: 74000
    },
    subs: [
      {
        id: 'nat-sub-1-1',
        slug: 'gdp-growth-exceeds-estimate-532',
        image: '/assets/demo/7.jpg',
        titleGu: 'ખુશખબર! GDP વૃદ્ધિ દર અંદાજ કરતાં વધુ નોંધાયો',
        relativeTimeGu: '2 કલાક પહેલાં',
        views: 78000
      },
      {
        id: 'nat-sub-1-2',
        slug: 'two-new-vande-bharat-trains-flagged-off-533',
        image: '/assets/demo/8.jpg',
        titleGu: 'બે નવી વંદે ભારત ટ્રેનોને લીલી ઝંડી, જાણો રૂટ',
        relativeTimeGu: '3 કલાક પહેલાં',
        views: 81000
      },
      {
        id: 'nat-sub-1-3',
        slug: 'central-government-announcement-millions-benefit-534',
        image: '/assets/demo/4.jpg',
        titleGu: 'કેન્દ્ર સરકારની મોટી જાહેરાત! નવી યોજનાથી કરોડો લોકોને લાભ',
        relativeTimeGu: '4 કલાક પહેલાં',
        views: 60000
      }
    ]
  },
  {
    colId: 'nat-col-2',
    featured: {
      id: 'nat-feat-2',
      slug: 'new-education-policy-second-phase-implementation-535',
      image: '/assets/demo/5.jpg',
      titleGu: 'નવી રાષ્ટ્રીય શિક્ષણ નીતિનો બીજો તબક્કો આગામી સત્રથી લાગુ, જાણો શું બદલાશે',
      relativeTimeGu: '5 કલાક પહેલાં',
      views: 110000
    },
    subs: [
      {
        id: 'nat-sub-2-1',
        slug: 'indian-army-indigenous-defense-equipment-536',
        image: '/assets/demo/6.jpg',
        titleGu: 'ભારતીય સેનાને મળી મોટી તાકાત! સ્વદેશી બનાવટનું નવું સંરક્ષણ સાધન સામેલ',
        relativeTimeGu: '6 કલાક પહેલાં',
        views: 120000
      },
      {
        id: 'nat-sub-2-2',
        slug: 'supreme-court-historic-judgment-impact-millions-537',
        image: '/assets/demo/1.jpg',
        titleGu: 'સુપ્રીમ કોર્ટનો મોટો ચુકાદો! લાખો કેસોને સીધી અસર',
        relativeTimeGu: '7 કલાક પહેલાં',
        views: 140000,
        isHighlighted: true
      },
      {
        id: 'nat-sub-2-3',
        slug: 'new-health-insurance-scheme-announced-538',
        image: '/assets/demo/8.jpg',
        titleGu: 'કરોડો લોકોને ફાયદો! કેન્દ્રે જાહેર કરી નવી આરોગ્ય વીમા યોજના',
        relativeTimeGu: '8 કલાક પહેલાં',
        views: 160000
      }
    ]
  },
  {
    colId: 'nat-col-3',
    featured: {
      id: 'nat-feat-3',
      slug: 'farmers-good-news-new-msp-declared-539',
      image: '/assets/demo/5.jpg',
      titleGu: 'ખેડૂતો માટે ખુશખબર! નવી MSP જાહેર, કઠોળના ભાવમાં વધારો',
      relativeTimeGu: '6 કલાક પહેલાં',
      views: 12000
    },
    subs: [
      {
        id: 'nat-sub-3-1',
        slug: '6g-trials-start-in-india-testing-soon-540',
        image: '/assets/demo/7.jpg',
        titleGu: 'દેશમાં 6G ટ્રાયલ શરૂ! ટૂંક સમયમાં પસંદગીના શહેરોમાં ટેસ્ટિંગ',
        relativeTimeGu: '10 કલાક પહેલાં',
        views: 27000
      },
      {
        id: 'nat-sub-3-2',
        slug: 'women-entrepreneurs-loan-scheme-zero-interest-541',
        image: '/assets/demo/4.jpg',
        titleGu: 'મહિલા ઉદ્યોગ સાહસિકો માટે મોટી રાહત! નવી લોન યોજનામાં 0% વ્યાજ',
        relativeTimeGu: '11 કલાક પહેલાં',
        views: 33000
      },
      {
        id: 'nat-sub-3-3',
        slug: 'new-expressway-network-approved-connect-10-cities-542',
        image: '/assets/demo/8.jpg',
        titleGu: 'દેશના 10 મોટા શહેરોને જોડતો નવો એક્સપ્રેસવે નેટવર્ક મંજૂર!',
        relativeTimeGu: '12 કલાક પહેલાં',
        views: 46000
      }
    ]
  }
];

/* --- National Section ("દેશ" Zone) ----------------------------- */
export function NationalSection({ language }: { language: Language }) {
  return (
    <div className="mx-auto max-w-screen-xl px-4 mt-1">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-[3.5px] border-slate-950 dark:border-slate-800 pb-2 mb-3.5">
        <span className="bg-[#B3121B] text-white px-5 py-2.5 text-[13.5px] md:text-[14.5px] font-black rounded-lg select-none leading-none tracking-tight">
          {language === 'gu' ? 'દેશ' : language === 'hi' ? 'देश' : 'National'}
        </span>
        <Link
          href="/category/national"
          className="text-[#B3121B] hover:text-red-700 font-extrabold text-[13px] md:text-[14px] hover:underline"
        >
          {language === 'gu' ? 'વધુ જુઓ →' : 'More →'}
        </Link>
      </div>

      {/* Top Row: 3 Featured Article Cards (Equal Height Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-4">
        {mockNationalColumns.map((col) => (
          <div key={col.colId} className="flex flex-col justify-between min-w-0 border-b border-border/40 pb-3">
            {/* Featured Article Card */}
            <Link
              href={`/news/${col.featured.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border/10 bg-muted mb-2.5">
                <Image
                  src={col.featured.image}
                  alt={col.featured.titleGu}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-[14px] md:text-[15.5px] font-extrabold leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-2">
                {col.featured.titleGu}
              </h3>
            </Link>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-semibold mt-2.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>{col.featured.relativeTimeGu}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Rows: 3 Sub-article Grid Rows (Synchronized Horizontal Alignment) */}
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((subIndex) => (
          <div key={subIndex} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {mockNationalColumns.map((col) => {
              const sub = col.subs[subIndex];
              if (!sub) return <div key={col.colId} />;
              return (
                <Link
                  key={sub.id}
                  href={`/news/${sub.slug}`}
                  className="group flex gap-3 hover:bg-muted/10 transition-colors p-1 min-w-0"
                >
                  <div className="relative h-[56px] w-[86px] shrink-0 overflow-hidden rounded-sm border border-border/10 bg-muted">
                    <Image
                      src={sub.image}
                      alt={sub.titleGu}
                      fill
                      sizes="86px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <h4 className={`text-[12.5px] font-extrabold leading-snug line-clamp-2 transition-colors ${sub.isHighlighted
                      ? 'text-red-600'
                      : 'text-foreground group-hover:text-[#B3121B]'
                      }`}>
                      {sub.titleGu}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground font-semibold">
                      <Clock className="h-3 w-3 text-muted-foreground/60" />
                      <span>{sub.relativeTimeGu}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

const mockWorldFeatured = {
  id: 'w-feat',
  slug: 'india-major-victory-un-broad-support-proposal-551',
  image: '/assets/demo/8.jpg',
  categoryGu: 'સંયુક્ત રાષ્ટ્ર',
  titleGu: 'ભારતની મોટી જીત! સંયુક્ત રાષ્ટ્રમાં પ્રસ્તાવને વ્યાપક સમર્થન',
  excerptGu: 'મોટાભાગના સભ્ય દેશોએ ભારતના પ્રસ્તાવને ટેકો આપતા આંતરરાષ્ટ્રીય મંચ પર દેશની સ્થિતિ વધુ મજબૂત બની.',
  watermarkGu: 'ગુજરાત પોસ્ટ'
};

const mockWorldCards = [
  {
    id: 'w-card-1',
    slug: 'europe-new-trade-treaty-signed-india-benefits-552',
    image: '/assets/demo/1.jpg',
    categoryGu: 'યુરોપ',
    titleGu: 'યુરોપમાં નવી વ્યાપાર સંધિ પર હસ્તાક્ષર, ભારતને પણ ફાયદો',
    relativeTimeGu: '3 કલાક પહેલાં',
    views: 74000
  },
  {
    id: 'w-card-2',
    slug: 'usa-indian-community-huge-cultural-event-553',
    image: '/assets/demo/3.jpg',
    categoryGu: 'અમેરિકા',
    titleGu: 'અમેરિકામાં ભારતીય સમુદાયનું વિશાળ સાંસ્કૃતિક આયોજન, જુઓ ઝલક',
    relativeTimeGu: '4 કલાક પહેલાં',
    views: 78000
  },
  {
    id: 'w-card-3',
    slug: 'asian-countries-new-economic-partnership-announced-554',
    image: '/assets/demo/2.jpg',
    categoryGu: 'એશિયા',
    titleGu: 'એશિયાઈ દેશો વચ્ચે નવી આર્થિક ભાગીદારીની મોટી જાહેરાત',
    relativeTimeGu: '5 કલાક પહેલાં',
    views: 81000
  },
  {
    id: 'w-card-4',
    slug: 'gulf-countries-indian-workers-welfare-scheme-555',
    image: '/assets/demo/7.jpg',
    categoryGu: 'મધ્ય-પૂર્વ',
    titleGu: 'ગલ્ફ દેશોમાં ભારતીય શ્રમિકો માટે ખુશખબર! નવી કલ્યાણ યોજના જાહેર',
    relativeTimeGu: '6 કલાક પહેલાં',
    views: 90000
  }
];

/* --- World Section ("વિશ્વ" Zone) ----------------------------- */
export function WorldSection({ language }: { language: Language }) {
  return (
    <div className="mx-auto max-w-screen-xl px-4 mt-8">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-[3.5px] border-slate-950 dark:border-slate-800 pb-3 mb-6">
        <span className="bg-[#B3121B] text-white px-5 py-2.5 text-[13.5px] md:text-[14.5px] font-black rounded-lg select-none leading-none tracking-tight">
          {language === 'gu' ? 'વિશ્વ' : language === 'hi' ? 'विश्व' : 'World'}
        </span>
        <Link
          href="/category/world"
          className="text-[#B3121B] hover:text-red-700 font-extrabold text-[13px] md:text-[14px] hover:underline"
        >
          {language === 'gu' ? 'વધુ જુઓ →' : 'More News →'}
        </Link>
      </div>

      {/* Grid: Left column (main news) vs Right column (sidebar/widgets) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_336px] gap-8 items-start">

        {/* Left Column: Big horizontal featured card + 4-column horizontal card list */}
        <div className="flex flex-col min-w-0">

          {/* Big Horizontal Featured Card */}
          <Link
            href={`/news/${mockWorldFeatured.slug}`}
            className="group grid grid-cols-1 md:grid-cols-2 gap-6 bg-card border border-border/80 rounded-sm p-5 md:p-6 mb-8 hover:shadow-sm transition-shadow duration-200"
          >
            {/* Content Left */}
            <div className="flex flex-col justify-center min-w-0 order-2 md:order-1">
              <span className="text-red-600 font-extrabold text-[12px] md:text-[13px] mb-2 select-none uppercase tracking-wide">
                {mockWorldFeatured.categoryGu}
              </span>
              <h3 className="text-[17px] md:text-[19px] font-black leading-snug text-foreground group-hover:text-[#B3121B] transition-colors">
                {mockWorldFeatured.titleGu}
              </h3>
              <p className="text-muted-foreground text-[13px] leading-relaxed mt-3.5 line-clamp-4 select-none">
                {mockWorldFeatured.excerptGu}
              </p>
            </div>

            {/* Image Right with Watermark */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-muted order-1 md:order-2">
              <Image
                src={mockWorldFeatured.image}
                alt={mockWorldFeatured.titleGu}
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[9.5px] font-black px-2 py-0.5 rounded-sm select-none tracking-tight">
                {mockWorldFeatured.watermarkGu}
              </span>
            </div>
          </Link>

          {/* Grid of 4 Vertical Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockWorldCards.map((card) => (
              <div key={card.id} className="flex flex-col min-w-0">
                <Link
                  href={`/news/${card.slug}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border/10 bg-muted mb-2.5">
                    <Image
                      src={card.image}
                      alt={card.titleGu}
                      fill
                      sizes="(max-width: 768px) 100vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-[#B3121B] font-extrabold text-[12px] md:text-[13px] mb-1.5 select-none uppercase leading-none">
                    {card.categoryGu}
                  </span>
                  <h4 className="text-[13px] md:text-[13.5px] font-extrabold leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-3">
                    {card.titleGu}
                  </h4>
                </Link>
                <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-muted-foreground font-semibold">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <span>{card.relativeTimeGu}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Widgets */}
        <div className="flex flex-col gap-6">

          {/* Green Dream Home Ad */}
          <div className="w-full rounded-sm bg-[#0E8044] text-white p-6 py-6 flex flex-col items-center justify-center relative overflow-hidden border border-border/10 shadow-md text-center" style={{ minHeight: 180 }}>
            {/* Small Ad Label at top */}
            <span className="absolute top-2.5 left-3.5 text-[9.5px] text-white/50 font-black tracking-wider uppercase select-none">
              {language === 'gu' ? 'જાહેરાત' : 'Advertisement'}
            </span>
            <h4 className="text-[22px] font-black tracking-tight select-none mt-2">
              {language === 'gu' ? 'ડ્રીમ હોમ્સ' : 'Dream Homes'}
            </h4>
            <p className="text-[13px] text-white/95 font-bold mt-1.5 leading-snug max-w-[240px]">
              {language === 'gu' ? 'તમારું સપનાનું ઘર — 0% પ્રોસેસિંગ ફી સાથે' : 'Your dream home — with 0% processing fee'}
            </p>
            <button
              type="button"
              className="mt-4 bg-white text-[#0E8044] font-black text-[12.5px] px-7 py-2.5 rounded-full shadow-sm hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer"
            >
              {language === 'gu' ? 'વધુ જાણો ›' : 'Learn More ›'}
            </button>
          </div>

          {/* Foreign Currency Widget */}
          <div>
            <div className="flex items-center gap-1.5 pb-1 mb-2 select-none border-b border-border/80">
              <span className="text-[#B3121B] font-extrabold text-[14px] md:text-[15px]">
                {language === 'gu' ? '• વિદેશી ચલણ' : '• Foreign Exchange'}
              </span>
            </div>
            <div className="border border-border/80 rounded-sm bg-card divide-y divide-border/60 shadow-sm">
              {/* USD */}
              <div className="flex items-center justify-between p-2.5 px-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/10 text-green-600 font-extrabold text-[14px] select-none">
                    $
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black text-foreground">US Doller</span>
                    <span className="text-[9px] text-muted-foreground font-semibold uppercase leading-none mt-0.5">USD/INR</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-black text-foreground">₹83.92</span>
                  <span className="text-green-600 text-[10.5px] font-black tracking-tight select-none">▲ 0.12</span>
                </div>
              </div>

              {/* EUR */}
              <div className="flex items-center justify-between p-2.5 px-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 font-extrabold text-[14px] select-none">
                    €
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black text-foreground">Euro</span>
                    <span className="text-[9px] text-muted-foreground font-semibold uppercase leading-none mt-0.5">EUR/INR</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-black text-foreground">₹90.45</span>
                  <span className="text-red-600 text-[10.5px] font-black tracking-tight select-none">▼ 0.20</span>
                </div>
              </div>

              {/* AED */}
              <div className="flex items-center justify-between p-2.5 px-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-extrabold text-[11px] select-none">
                    د.إ
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black text-foreground">UAE Dirham</span>
                    <span className="text-[9px] text-muted-foreground font-semibold uppercase leading-none mt-0.5">
                      AED/INR
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-black text-foreground">₹22.85</span>
                  <span className="text-red-600 text-[10.5px] font-black tracking-tight select-none">
                    ▼ 0.05
                  </span>
                </div>
              </div>

              {/* AUD */}
              <div className="flex items-center justify-between p-2.5 px-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-600 font-extrabold text-[12px] select-none">
                    A$
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black text-foreground">Australian Dollar</span>
                    <span className="text-[9px] text-muted-foreground font-semibold uppercase leading-none mt-0.5">
                      AUD/INR
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-black text-foreground">₹55.48</span>
                  <span className="text-green-600 text-[10.5px] font-black tracking-tight select-none">
                    ▲ 0.03
                  </span>
                </div>
              </div>

              {/* GBP */}
              <div className="flex items-center justify-between p-2.5 px-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 font-extrabold text-[14px] select-none">
                    £
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black text-foreground">Brities Pound </span>
                    <span className="text-[9px] text-muted-foreground font-semibold uppercase leading-none mt-0.5">GBP/INR</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-black text-foreground">₹106.78</span>
                  <span className="text-muted-foreground text-[10px] font-extrabold tracking-tight select-none">— Stabal</span>
                </div>
              </div>

              {/* CAD */}
              <div className="flex items-center justify-between p-2.5 px-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10 text-red-600 font-extrabold text-[12px] select-none">
                    C$
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black text-foreground">Canadian Dollar</span>
                    <span className="text-[9px] text-muted-foreground font-semibold uppercase leading-none mt-0.5">
                      CAD/INR
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-black text-foreground">₹61.20</span>
                  <span className="text-green-600 text-[10.5px] font-black tracking-tight select-none">
                    ▲ 0.08
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

/* --- Live Center Section ─────────────────────────────────────────────────── */
export function LiveCenterSection({ language }: { language: Language }) {
  return (
    <div className="mx-auto max-w-screen-xl px-4 mt-8 relative">
      {/* Blurred Red Ambient Glow Orbs in Background */}
      <div className="absolute -top-6 left-10 w-96 h-96 bg-[#B3121B]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-6 right-10 w-[420px] h-[420px] bg-red-600/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 bg-red-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Container Box with Glassmorphic Backdrop Blur */}
      <div className="relative border border-red-100/80 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl overflow-hidden p-6 text-foreground select-none">

        {/* ── Header Row ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-border/10">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-[#B3121B] text-white text-[13px] font-black px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              {language === 'gu' ? '((•)) લાઈવ સેન્ટર' : '((•)) Live Center'}
            </span>
            <span className="text-[12.5px] text-muted-foreground font-extrabold">
              {language === 'gu'
                ? 'ઈંધણ ભાવ • શેરબજાર • રમતગમત — 2.5 મિનિટ અપડેટ'
                : 'Fuel Price · Stock Market · Sports — 2.5 min updates'}
            </span>
          </div>

          {/* Top Right Live Tag */}
          <span className="bg-red-50 text-[#B3121B] text-[11.5px] font-black px-3.5 py-1 rounded-full border border-red-100 flex items-center gap-1.5 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#B3121B] animate-pulse" />
            {language === 'gu' ? 'લાઈવ' : 'LIVE'}
          </span>
        </div>

        {/* ── 4-Column Grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-5">

          {/* ── Column 1: Fuel Prices (ઈંધણ ભાવ) ──────────────────── */}
          <div className="flex flex-col justify-between p-4 rounded-xl border border-red-100/70 bg-gradient-to-b from-red-50/20 to-slate-50/40 backdrop-blur-xs hover:border-red-200 transition-colors shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-black text-foreground flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-[#B3121B]" />
                  {language === 'gu' ? 'ઈંધણ ભાવ' : 'Fuel Prices'}
                </span>
                <span className="text-[#B3121B] text-[11px] font-extrabold flex items-center gap-0.5">
                  {language === 'gu' ? 'અમદાવાદ 📍' : 'Ahmedabad 📍'}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {/* Petrol */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-border/10 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-red-100 text-[#B3121B] font-black flex items-center justify-center text-[13px]">
                      P
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[12.5px] font-black text-foreground">પેટ્રોલ (Petrol)</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">પ્રતિ લીટર</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[15px] font-black text-foreground">₹96.42</span>
                    <span className="text-[9.5px] text-muted-foreground block font-semibold">/ લીટર</span>
                  </div>
                </div>

                {/* Diesel */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-border/10 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-[13px]">
                      D
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[12.5px] font-black text-foreground">ડીઝલ (Diesel)</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">પ્રતિ લીટર</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[15px] font-black text-foreground">₹92.17</span>
                    <span className="text-[9.5px] text-muted-foreground block font-semibold">/ લીટર</span>
                  </div>
                </div>

                {/* CNG */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-border/10 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-black flex items-center justify-center text-[13px]">
                      C
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[12.5px] font-black text-foreground">CNG (CNG)</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">પ્રતિ કિગ્રા</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[15px] font-black text-foreground">₹76.00</span>
                    <span className="text-[9.5px] text-muted-foreground block font-semibold">/ કિલો</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button & Source */}
            <div className="mt-4">
              {/* <Link
                href="/fuel-prices"
                className="w-full border border-red-200 text-[#B3121B] font-black text-[12px] rounded-lg py-2 flex items-center justify-center gap-1 hover:bg-red-50 transition-colors"
              >
                {language === 'gu' ? 'વધુ ઈંધણ ભાવ જુઓ' : 'View More Fuel Prices'}
              </Link> */}
              <p className="text-[9.5px] text-muted-foreground/70 font-semibold mt-2 text-left select-none">
                સ્રોત: IOC / HPCL
              </p>
            </div>
          </div>

          {/* ── Column 2: Stock Market (શેરબજાર) ────────────────── */}
          <div className="flex flex-col justify-between p-4 rounded-xl border border-red-100/70 bg-gradient-to-b from-red-50/20 to-slate-50/40 backdrop-blur-xs hover:border-red-200 transition-colors shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-black text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#B3121B]" />
                  {language === 'gu' ? 'શેરબજાર' : 'Stock Market'}
                </span>
                <span className="text-muted-foreground text-[11px] font-bold select-none">
                  {language === 'gu' ? 'ભારત ₹ INR' : 'India ₹ INR'}
                </span>
              </div>

              <div className="space-y-3">
                {/* Nifty 50 */}
                <div className="p-2.5 rounded-lg bg-white border border-border/10 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[12.5px] font-black text-foreground">Nifty 50</span>
                      <span className="text-[9.5px] text-muted-foreground font-bold uppercase">NSE</span>
                    </div>
                    <span className="text-[14px] font-black text-foreground">₹23,456.2</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 text-[11px] font-extrabold text-emerald-600">
                    <span>↗ +188.4 (+0.93%)</span>
                  </div>
                </div>

                {/* Sensex */}
                <div className="p-2.5 rounded-lg bg-white border border-border/10 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[12.5px] font-black text-foreground">BSE Sensex</span>
                      <span className="text-[9.5px] text-muted-foreground font-bold uppercase">BSE</span>
                    </div>
                    <span className="text-[14px] font-black text-foreground">₹80,309.1</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 text-[11px] font-extrabold text-emerald-600">
                    <span>↗ +425.6 (+0.55%)</span>
                  </div>
                </div>

                {/* Nifty Bank */}
                <div className="p-2.5 rounded-lg bg-white border border-border/10 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[12.5px] font-black text-foreground">Nifty Bank</span>
                      <span className="text-[9.5px] text-muted-foreground font-bold uppercase">NSE</span>
                    </div>
                    <span className="text-[14px] font-black text-foreground">₹49,640.8</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 text-[11px] font-extrabold text-red-600">
                    <span>↘ -124.1 (-0.23%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button & Source */}
            <div className="mt-4">
              {/* <Link
                href="/market"
                className="w-full border border-red-200 text-[#B3121B] font-black text-[12px] rounded-lg py-2 flex items-center justify-center gap-1 hover:bg-red-50 transition-colors"
              >
                {language === 'gu' ? 'વધુ શેરબજાર જુઓ' : 'View More Market'}
              </Link> */}
              <p className="text-[9.5px] text-muted-foreground/70 font-semibold mt-2 text-left select-none">
                સ્રોત: Yahoo Finance
              </p>
            </div>
          </div>

          {/* ── Column 3: Cricket (ક્રિકેટ) ────────────────────────── */}
          <div className="flex flex-col justify-between p-4 rounded-xl border border-red-100/70 bg-gradient-to-b from-red-50/20 to-slate-50/40 backdrop-blur-xs hover:border-red-200 transition-colors shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-black text-foreground flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-[#B3121B]" />
                  {language === 'gu' ? 'ક્રિકેટ' : 'Cricket'}
                </span>
                <Link href="/sports" className="text-[#B3121B] text-[11.5px] font-black hover:underline">
                  + વધુ
                </Link>
              </div>

              <div className="space-y-3">
                {/* Match 1 */}
                <div className="p-2.5 rounded-lg bg-white border border-border/10 shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-black text-foreground">India vs England</span>
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">LIVE</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1 text-[11.5px]">
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>India</span>
                      <span className="font-black">168/8 (20)</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>England</span>
                      <span className="font-black">185/9 (19.2)</span>
                    </div>
                  </div>
                </div>

                {/* Match 2 */}
                <div className="p-2.5 rounded-lg bg-white border border-border/10 shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-black text-foreground">Ranji Trophy</span>
                    <span className="text-[9px] font-bold text-muted-foreground">Day 3</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1 text-[11.5px]">
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>Gujarat</span>
                      <span className="font-black">284/6</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>Mumbai</span>
                      <span className="font-black">322/10</span>
                    </div>
                  </div>
                </div>

                {/* Match 3 */}
                <div className="p-2.5 rounded-lg bg-white border border-border/10 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-black text-foreground">IPL</span>
                    <span className="text-[9px] font-bold text-muted-foreground">22:00</span>
                  </div>
                  <div className="flex items-center justify-between text-[11.5px] font-bold text-foreground">
                    <span>Man City</span>
                    <span className="text-muted-foreground">—</span>
                  </div>
                  <div className="flex items-center justify-between text-[11.5px] font-bold text-foreground">
                    <span>Arsenal</span>
                    <span className="text-muted-foreground">—</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button & Source */}
            <div className="mt-4">
              {/* <Link
                href="/sports"
                className="w-full border border-red-200 text-[#B3121B] font-black text-[12px] rounded-lg py-2 flex items-center justify-center gap-1 hover:bg-red-50 transition-colors"
              >
                {language === 'gu' ? 'વધુ ક્રિકેટ જુઓ' : 'View More Cricket'}
              </Link> */}
              <p className="text-[9.5px] text-muted-foreground/70 font-semibold mt-2 text-left select-none">
                સ્રોત: ESPN
              </p>
            </div>
          </div>

          {/* ── Column 4: Football (ફૂટબોલ) ───────────────────────── */}
          <div className="flex flex-col justify-between p-4 rounded-xl border border-red-100/70 bg-gradient-to-b from-red-50/20 to-slate-50/40 backdrop-blur-xs hover:border-red-200 transition-colors shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-black text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#B3121B]" />
                  {language === 'gu' ? 'ફૂટબોલ' : 'Football'}
                </span>
                <Link href="/sports" className="text-[#B3121B] text-[11.5px] font-black hover:underline">
                  + વધુ
                </Link>
              </div>

              <div className="space-y-3">
                {/* Match 1 */}
                <div className="p-2.5 rounded-lg bg-white border border-border/10 shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-black text-foreground">ISL</span>
                    <span className="text-[9px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded-sm">75'</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1 text-[11.5px]">
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>Mumbai City FC</span>
                      <span className="font-black text-[13px]">2</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>Mohun Bagan</span>
                      <span className="font-black text-[13px]">1</span>
                    </div>
                  </div>
                </div>

                {/* Match 2 */}
                <div className="p-2.5 rounded-lg bg-white border border-border/10 shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-black text-foreground">EPL</span>
                    <span className="text-[9px] font-bold text-muted-foreground">22:00</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1 text-[11.5px]">
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>Man City</span>
                      <span className="text-muted-foreground">—</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>Arsenal</span>
                      <span className="text-muted-foreground">—</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button & Source */}
            <div className="mt-4">
              {/* <Link
                href="/sports"
                className="w-full border border-red-200 text-[#B3121B] font-black text-[12px] rounded-lg py-2 flex items-center justify-center gap-1 hover:bg-red-50 transition-colors"
              >
                {language === 'gu' ? 'વધુ ફૂટબોલ જુઓ' : 'View More Football'}
              </Link> */}
              <p className="text-[9.5px] text-muted-foreground/70 font-semibold mt-2 text-left select-none">
                સ્રોત: ESPN
              </p>
            </div>
          </div>

        </div>

        {/* ── Bottom Live Highlights Ticker Bar ───────────────────── */}
        <div className="mt-6 pt-4 border-t border-border/10 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-[#B3121B] text-white text-[12px] font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs">
              <Megaphone className="h-4 w-4" />
              {language === 'gu' ? 'લાઈવ હાઈલાઈટ્સ' : 'Live Highlights'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[12px] font-extrabold text-slate-700 overflow-x-auto scrollbar-hide py-1">
            <span>Nifty 50 ₹23,456.2 <span className="text-emerald-600 font-black">▲ 188.4</span></span>
            <span className="text-slate-300">|</span>
            <span>Sensex ₹80,309.1 <span className="text-emerald-600 font-black">▲ 425.6</span></span>
            <span className="text-slate-300">|</span>
            <span>Nifty Bank ₹49,640.8 <span className="text-red-600 font-black">▼ 124.1</span></span>
            <span className="text-slate-300">•</span>
            <span>Petrol ₹96.42 /L</span>
            <span className="text-slate-300">•</span>
            <span>USD ₹83.92 <span className="text-red-600 font-black">▼ 0.12</span></span>
          </div>

          <Link
            href="/live-updates"
            className="shrink-0 border border-red-200 text-[#B3121B] font-black text-[12px] rounded-lg px-3.5 py-1.5 flex items-center gap-1 hover:bg-red-50 transition-colors"
          >
            {language === 'gu' ? 'વધુ અપડેટસ જુઓ' : 'View More Updates'}
          </Link>
        </div>

      </div>
    </div>
  );
}

/* --- Weather Dashboard Section --------------------------------------------- */
function WeatherDashboardSection({ language }: { language: Language }) {
  const [activeTab, setActiveTab] = useState<'weather' | 'aqi'>('weather');
  const [selectedCity, setSelectedCity] = useState('Ahmedabad');

  const isGu = language === 'gu';

  // Weather data maps
  const weatherData: Record<string, { temp: string; desc: string; descGu: string; icon: string; humidity: string; wind: string }> = {
    Ahmedabad: { temp: '29', desc: 'Mist', descGu: 'ધુમ્મસ', icon: 'cloud', humidity: '68%', wind: '19 km/h' },
    Vadodara: { temp: '31.7', desc: 'Partly Cloudy', descGu: 'વાદળછાઈ', icon: 'cloud', humidity: '52%', wind: '12 km/h' },
    Surat: { temp: '29.8', desc: 'Heavy Rain', descGu: 'ભારે વરસાદ', icon: 'rain', humidity: '68%', wind: '15 km/h' },
    Rajkot: { temp: '31.9', desc: 'Sunny', descGu: 'તડકો', icon: 'sun', humidity: '52%', wind: '10 km/h' }
  };

  const aqiData: Record<string, { value: number; label: string; labelGu: string }> = {
    Ahmedabad: { value: 72, label: 'Satisfactory', labelGu: 'સંતોષકારક' },
    Vadodara: { value: 65, label: 'Satisfactory', labelGu: 'સંતોષકારક' },
    Surat: { value: 85, label: 'Moderate', labelGu: 'સાધારણ' },
    Rajkot: { value: 58, label: 'Good', labelGu: 'સારું' }
  };

  const mainWeather = weatherData[selectedCity] || weatherData.Ahmedabad;
  const otherCities = ['Ahmedabad', 'Vadodara', 'Surat', 'Rajkot'].filter(c => c !== selectedCity);

  return (
    <section className="mx-auto max-w-screen-xl px-4 py-4 mt-8 select-none">
      {/* Tab headers - Black, Red & White */}
      <div className="flex items-end">
        <div className="bg-slate-950 p-1 rounded-t-xl inline-flex gap-1 border-t border-x border-slate-800">
          <button
            onClick={() => setActiveTab('weather')}
            className={`flex items-center gap-2 px-5 py-2 text-xs md:text-sm font-black transition-all rounded-lg tracking-wider select-none ${activeTab === 'weather'
              ? 'bg-white text-slate-950 shadow-sm border border-slate-200'
              : 'text-white/80 hover:text-white bg-transparent'
              }`}
          >
            <Sun className={`h-4 w-4 ${activeTab === 'weather' ? 'text-[#B3121B]' : 'text-white/60'}`} />
            {isGu ? 'હવામાન' : 'WEATHER'}
          </button>
          <button
            onClick={() => setActiveTab('aqi')}
            className={`flex items-center gap-2 px-5 py-2 text-xs md:text-sm font-black transition-all rounded-lg tracking-wider select-none ${activeTab === 'aqi'
              ? 'bg-white text-slate-950 shadow-sm border border-slate-200'
              : 'text-white/80 hover:text-white bg-transparent'
              }`}
          >
            <Wind className={`h-4 w-4 ${activeTab === 'aqi' ? 'text-[#B3121B]' : 'text-white/60'}`} />
            {isGu ? 'હવા ગુણવત્તા (AQI)' : 'AQI'}
          </button>
        </div>
      </div>

      {/* Main Box - Clean Light Grey Container */}
      <div className="bg-[#f3f4f6] dark:bg-slate-900/90 p-6 rounded-b-2xl rounded-r-2xl border border-slate-200 dark:border-slate-800 shadow-md relative">
        {activeTab === 'weather' ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
            {/* Left Area - Selected City weather info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b lg:border-b-0 lg:border-r border-slate-300 dark:border-slate-800 pb-6 lg:pb-0 lg:pr-10">
              <div className="flex flex-col">
                <h3 className="text-lg md:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
                  {selectedCity} {isGu ? 'હવામાનની સ્થિતિ' : 'Weather Status'}
                </h3>
                <p className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 mt-1 select-none">
                  {isGu ? 'વર્તમાન તાપમાનનું સ્તર' : 'Current temperature level'}
                </p>
                <div className="flex items-center gap-5 mt-4">
                  <div className="relative">
                    {mainWeather.icon === 'cloud' && <Cloud className="h-16 w-16 text-slate-950 dark:text-white fill-slate-950/10" />}
                    {mainWeather.icon === 'rain' && <CloudRain className="h-16 w-16 text-slate-950 dark:text-white fill-slate-950/10" />}
                    {mainWeather.icon === 'sun' && <Sun className="h-16 w-16 text-[#B3121B] fill-[#B3121B]/10" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white select-none">
                      {mainWeather.temp}°C
                    </span>
                    <span className="mt-1.5 self-start bg-[#B3121B] text-white text-[11px] font-black px-3.5 py-1 rounded-full uppercase leading-none select-none shadow-sm">
                      {isGu ? mainWeather.descGu : mainWeather.desc}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Area - Other Cities */}
            <div className="flex flex-col gap-4">
              {/* City selector dropdown on top right */}
              <div className="self-end flex items-center gap-2">
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="appearance-none bg-white text-slate-950 dark:bg-slate-950 dark:text-white text-xs font-black px-4 py-2 pr-8 rounded-full border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B3121B] cursor-pointer shadow-sm"
                  >
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Surat">Surat</option>
                    <option value="Rajkot">Rajkot</option>
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* City cards with Clean Black, Red, White styling */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {otherCities.map((city) => {
                  const item = weatherData[city];
                  return (
                    <div
                      key={city}
                      className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 min-w-[190px] relative hover:shadow-md hover:border-[#B3121B]/40 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-black text-slate-950 dark:text-white">{city}</span>
                        <button
                          onClick={() => setSelectedCity(city)}
                          className="h-5.5 w-5.5 bg-slate-950 text-white rounded-full flex items-center justify-center hover:bg-[#B3121B] transition-colors"
                        >
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-3 mt-1">
                        {item.icon === 'cloud' && <Cloud className="h-8 w-8 text-slate-950 dark:text-white shrink-0" />}
                        {item.icon === 'rain' && <CloudRain className="h-8 w-8 text-slate-950 dark:text-white shrink-0" />}
                        {item.icon === 'sun' && <Sun className="h-8 w-8 text-[#B3121B] shrink-0" />}

                        <div className="text-right flex flex-col items-end gap-1">
                          <span className="text-[12px] font-extrabold text-slate-900 dark:text-slate-200 flex items-center gap-1 select-none">
                            <Thermometer className="h-3.5 w-3.5 text-[#B3121B]" />
                            {item.temp}°C
                          </span>
                          <span className="text-[12px] font-extrabold text-slate-900 dark:text-slate-200 flex items-center gap-1 select-none">
                            <Droplet className="h-3.5 w-3.5 text-[#B3121B]" />
                            {item.humidity}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom update timestamp */}
              <div className="text-[10px] text-slate-500 font-semibold text-right select-none mt-2">
                Last Update: 2026-07-16 18:31 (local time)
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
            {/* Left Area - Selected City AQI info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b lg:border-b-0 lg:border-r border-slate-300 dark:border-slate-800 pb-6 lg:pb-0 lg:pr-10">
              <div className="flex flex-col">
                <h3 className="text-lg md:text-xl font-black text-slate-950 dark:text-white">
                  {selectedCity} {isGu ? 'હવાની ગુણવત્તા સૂચકાંક (AQI)' : 'Air Quality Index'}
                </h3>
                <p className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
                  {isGu ? 'વર્તમાન વાયુ પ્રદૂષણ સ્તર' : 'Current air pollution levels'}
                </p>
                <div className="flex items-center gap-5 mt-4">
                  <div className="h-14 w-14 rounded-xl bg-[#B3121B] text-white flex items-center justify-center text-xl font-black shadow-md select-none">
                    {aqiData[selectedCity]?.value}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[16px] font-black text-slate-950 dark:text-white">
                      {isGu ? aqiData[selectedCity]?.labelGu : aqiData[selectedCity]?.label}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                      PM2.5: 22 µg/m³ · PM10: 45 µg/m³
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Area - Other Cities AQI */}
            <div className="flex flex-col gap-4">
              {/* City selector dropdown on top right */}
              <div className="self-end flex items-center gap-2">
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="appearance-none bg-white text-slate-950 dark:bg-slate-950 dark:text-white text-xs font-black px-4 py-2 pr-8 rounded-full border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B3121B] cursor-pointer shadow-sm"
                  >
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Surat">Surat</option>
                    <option value="Rajkot">Rajkot</option>
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {otherCities.map((city) => {
                  const item = aqiData[city];
                  return (
                    <div
                      key={city}
                      className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 min-w-[190px] hover:shadow-md hover:border-[#B3121B]/40 transition-all duration-300"
                    >
                      <span className="text-[13px] font-black text-slate-950 dark:text-white">{city}</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[12px] font-black text-white px-2.5 py-1 rounded bg-[#B3121B] shadow-sm select-none">
                          {item.value} AQI
                        </span>
                        <span className="text-[11px] font-bold text-slate-900 dark:text-slate-200">
                          {isGu ? item.labelGu : item.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold text-right select-none mt-2">
                Last Update: 2026-07-16 18:31 (local time)
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Entertainment · Tech · Lifestyle 3-Column Section ─────────────────── */
export function EntertainTechLifeSection({ language }: { language: Language }) {

  type ArticleItem = { img: string; title: string; titleGu: string; age: string };

  const health: ArticleItem[] = [
    { img: '/assets/demo/2.jpg', titleGu: 'પોસ્ટમોર્ટમમાં ખતરાના ચરણના આધુનિક સ્ટોરનો શુભારંભ', title: 'Modern store launched at Post Mortem danger step', age: '2' },
    { img: '/assets/demo/6.jpg', titleGu: 'મેઘરાજા સક્રિય : અનેક સ્થળોવરસાદ, હવામાન વિભાગની આગાહી', title: 'Rain active: Rainfall in many places, weather department forecast', age: '4' },
    { img: '/assets/demo/8.jpg', titleGu: 'ડુંગળીના ભાવમાં નોંધપાત્ર વધારો, ખરીદદારોએ ચિંતા વધારી', title: 'Onion prices rise significantly, buyers worry', age: '5' },
    { img: '/assets/demo/3.jpg', titleGu: 'વધુશે ઉકળો માટે સરકારની નવી સહાય યોજના અને મોટો નિર્ણય', title: 'New government aid scheme and big decision for startups', age: '7' },
    { img: '/assets/demo/1.jpg', titleGu: 'આ મહિને OTP પર મળશે રિફંડ, જાણો RBIના નવા નિયમો', title: 'Get refund on OTP this month, know new RBI rules', age: '8' },
  ];

  const manoranjan: ArticleItem[] = [
    { img: '/assets/demo/6.jpg', titleGu: 'નવી ગુજરાતી ફિલ્મ \'લીસ્ચ\' ઓફિસ પર રેકોર્ડ તોડશે જૂનો કલાત્મક આંકડો', title: 'New Gujarati film to break box office records', age: '1' },
    { img: '/assets/demo/4.jpg', titleGu: 'લોકપ્રિય ગાયકપ્રિન્ટનો નવો સિંગલ કૂક આગામી, ચાહકોમાં ઉત્સાહ', title: 'Popular singer new single release soon, excitement among fans', age: '2' },
    { img: '/assets/demo/1.jpg', titleGu: 'જાણીતા ગાયકનો નવો આલ્બમ રિલીઝ! ચાહકોમાં જબરદસ્ત ઉત્સાહ', title: 'Famous singer releases new album! Huge excitement among fans', age: '4' },
    { img: '/assets/demo/5.jpg', titleGu: 'આ વીકેન્ડ OTT પર ધમાકો: રિલીઝ થશે આ પાંચ મોસ્ટ ફિલ્મો અને શો', title: 'Weekend OTT blast: These five top movies and shows to release', age: '6' },
    { img: '/assets/demo/7.jpg', titleGu: 'બોક્સ ઓફિસ પર \'સ્ટાર ફિલ્મ\'ની ધમાકેદાર કમાણી, તોડ્યા રેકોર્ડ', title: 'Star movie hits box office with record earnings', age: '7' },
  ];

  const technology: ArticleItem[] = [
    { img: '/assets/demo/3.jpg', titleGu: 'નવી સ્માર્ટસિટી સાર્ગરની યોજના, શહેરો બનશે વધુ સ્માર્ટ', title: 'New smart city plan, cities to become smarter', age: '2' },
    { img: '/assets/demo/7.jpg', titleGu: 'ગુજરાતમાં ટેકનોલોજી આધારિત વિકાસના નવા પ્રોજેક્ટને મંજુરી', title: 'Approval for tech-based development projects in Gujarat', age: '3' },
    { img: '/assets/demo/5.jpg', titleGu: 'ભારતમાં 5G ટેકનોલોજીનો વ્યાપ ઝડપથી વધી રહ્યો છે', title: '5G technology footprint growing rapidly in India', age: '5' },
    { img: '/assets/demo/8.jpg', titleGu: 'ટેકનોલોજીની ખાતામાં બદલાવ, ખેડૂતની આવકમાં વધારો', title: 'Technology change in agriculture boosts farmer income', age: '7' },
    { img: '/assets/demo/2.jpg', titleGu: 'AI ટૂલ્સ હવે રોજિંદા જીવનમાં જરૂરી, જાણો લાભ અને ઉપયોગ', title: 'AI tools essential in daily life, know benefits & usage', age: '8' },
  ];

  const col = (
    titleGu: string,
    titleEn: string,
    href: string,
    items: ArticleItem[],
    btnTextGu: string,
    btnTextEn: string,
    icon: React.ReactNode
  ) => (
    <div className="bg-card border border-border/80 rounded-xl p-5 shadow-sm flex flex-col justify-between min-w-0">
      <div>
        {/* Column heading matching Image 1 */}
        <div className="flex flex-col mb-4 select-none">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 flex items-center justify-center shrink-0">
              {icon}
            </div>
            <Link href={href} className="flex items-center gap-1 group/title">
              <h3 className="text-[16px] md:text-[17px] font-black text-foreground leading-none group-hover:text-[#B3121B] transition-colors">
                {language === 'gu' ? titleGu : titleEn}
              </h3>
            </Link>
          </div>
          <div className="h-0.5 w-8 bg-[#B3121B] mt-2 rounded-full" />
        </div>

        {/* Article rows */}
        <div className="flex flex-col divide-y divide-border/40">
          {items.map((a, i) => (
            <Link
              key={i}
              href={href}
              className="group flex gap-3 py-3 hover:bg-muted/10 transition-colors"
            >
              {/* Thumbnail */}
              <div className="relative h-[68px] w-[84px] shrink-0 overflow-hidden rounded-lg bg-muted border border-border/20">
                <Image
                  src={a.img}
                  alt={a.titleGu}
                  fill
                  sizes="84px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {/* Text */}
              <div className="flex flex-col justify-between min-w-0 flex-1 py-0.5">
                <h4 className="text-[12.5px] md:text-[13px] font-black text-foreground leading-snug line-clamp-2 group-hover:text-[#B3121B] transition-colors">
                  {language === 'gu' ? a.titleGu : a.title}
                </h4>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground font-semibold select-none">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <span>{a.age} કલાક પહેલાં</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Button matching Image 1 */}
      <Link
        href={href}
        className="mt-4 w-full border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/20 text-[#B3121B] font-extrabold text-[12.5px] md:text-[13px] py-2.5 rounded-lg text-center hover:bg-[#B3121B] hover:text-white transition-all block select-none"
      >
        {language === 'gu' ? btnTextGu : btnTextEn}
      </Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-screen-xl px-4 mt-8">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-[3.5px] border-slate-950 dark:border-slate-800 pb-3 mb-6">
        <span className="bg-[#B3121B] text-white px-5 py-2.5 text-[13.5px] md:text-[14.5px] font-black rounded-lg select-none leading-none tracking-tight">
          {language === 'gu'
            ? 'હેલ્થ   •   મનોરંજન   •   ટેક્નોલોજી'
            : language === 'hi'
              ? 'हेल्थ   •   मनोरंजन   •   टेक्नोलॉजी'
              : 'Health   •   Entertainment   •   Technology'}
        </span>
      </div>

      {/* 3-Column Grid with Cards matching Image 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {col(
          'હેલ્થ',
          'Health',
          '/category/health',
          health,
          'વધુ હેલ્થ સમાચાર જુઓ',
          'More Health News',
          <svg className="h-4 w-4 text-[#B3121B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M12 9v6m-3-3h6" />
          </svg>
        )}
        {col(
          'મનોરંજન',
          'Entertainment',
          '/category/entertainment',
          manoranjan,
          'વધુ મનોરંજન સમાચાર જુઓ',
          'More Entertainment News',
          <svg className="h-4 w-4 text-[#B3121B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 3v18M17 3v18M3 7.5h18M3 12h18M3 16.5h18" />
          </svg>
        )}
        {col(
          'ટેકનોલોજી',
          'Technology',
          '/category/technology',
          technology,
          'વધુ ટેકનોલોજી સમાચાર જુઓ',
          'More Technology News',
          <svg className="h-4 w-4 text-[#B3121B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect width="16" height="16" x="4" y="4" rx="2" />
            <rect width="6" height="6" x="9" y="9" rx="1" />
            <path d="M15 2v2M9 2v2M15 20v2M9 20v2M20 15h2M20 9h2M2 15h2M2 9h2" />
          </svg>
        )}
      </div>
    </div>
  );
}

/* --- Photo Gallery Section ------------------------------------------------- */
const GALLERY_DATA = [
  {
    id: 'gal1',
    src: '/assets/demo/6.jpg',
    titleGu: 'નવરાત્રિની રંગીન તૈયારીઓ! તસવીરોમાં જુઓ ધમાલ',
    title: 'Navratri colourful preparations! See the fun in photos',
    count: 12,
  },
  {
    id: 'gal2',
    src: '/assets/demo/3.jpg',
    titleGu: 'ગિરનાર લીલી પરિક્રમા: ભક્તિનો મહાસાગર ઉમટ્યો',
    title: 'Girnar Lili Parikrama: A sea of devotion gathered',
    count: 68,
  },
  {
    id: 'gal3',
    src: '/assets/demo/2.jpg',
    titleGu: 'અમદાવાદ ક્લાવર શો 2025ની અદ્ભૂત ઝલક',
    title: 'A wonderful glimpse of Ahmedabad Clover Show 2025',
    count: 34,
  },
  {
    id: 'gal4',
    src: '/assets/demo/1.jpg',
    titleGu: 'સ્ટેચ્યૂ ઓફ્ યુનિટીનું રાત્રિ સૌંદર્ય: જુઓ તસવીરો',
    title: 'Statue of Unity night beauty: See the photos',
    count: 15,
  },
  {
    id: 'gal5',
    src: '/assets/demo/7.jpg',
    titleGu: 'કચ્છના રણોત્સવની અદ્ભૂત તસવીરો, જેવા જ ેવી ખરી',
    title: 'Amazing photos of Kutch Rann Utsav, truly remarkable',
    count: 29,
  },
  {
    id: 'gal6',
    src: '/assets/demo/4.jpg',
    titleGu: 'દ્વારકા મંદિરની ધ્વજ વિધિ, ભક્તોમાં ભારે ઉત્સાહ',
    title: 'Flag ceremony at Dwarka temple, devotees full of enthusiasm',
    count: 10,
  },
  {
    id: 'gal7',
    src: '/assets/demo/3.jpg',
    titleGu: 'સાપુતારા હિલ સ્ટેશન: ચોમાસાની મનોહર કળા ખીલી ઉઠી',
    title: 'Saputara Hill Station: Beautiful monsoon scenes bloom',
    count: 18,
  },
  {
    id: 'gal8',
    src: '/assets/demo/5.jpg',
    titleGu: 'ઐતિહાસિક રાણકી વાવની અદભુત કોતરણી અને શિલ્પકળા',
    title: 'Historic Rani ki Vav: Wonderful carvings and sculptures',
    count: 24,
  },
  {
    id: 'gal9',
    src: '/assets/demo/8.jpg',
    titleGu: 'સોમનાથ મંદિરનું ભવ્ય શણગાર: તસવીરોમાં શ્રદ્ધાનો મેળો',
    title: 'Grand Somnath Temple decorations: Glimpse of divine faith',
    count: 30,
  },
];

function PhotoGallerySection({ language }: { language: Language }) {
  const CATS_GU = ['ગુજરાત', 'સંસ્કૃતિ', 'ધર્મ', 'પ્રવાસ', 'ખેલ', 'ઉત્સવ', 'શહેર', 'પ્રકૃતિ', 'ઐતિહાસ'];
  const CATS_EN = ['Gujarat', 'Culture', 'Religion', 'Travel', 'Sports', 'Festival', 'City', 'Nature', 'Heritage'];

  const SPANS = [
    // Hero Card
    { col: 'md:col-span-2', row: 'row-span-2', hero: true, wide: false }, // 0

    // Right side of Hero
    { col: 'md:col-span-1', row: 'row-span-1', hero: false, wide: false }, // 1
    { col: 'md:col-span-1', row: 'row-span-1', hero: false, wide: false }, // 2

    // Second Row
    { col: 'md:col-span-1', row: 'row-span-1', hero: false, wide: false }, // 3
    { col: 'md:col-span-1', row: 'row-span-1', hero: false, wide: false }, // 4
    { col: 'md:col-span-1', row: 'row-span-1', hero: false, wide: false }, // 5

    // Third Row
    { col: 'md:col-span-1', row: 'row-span-1', hero: false, wide: false }, // 6
    { col: 'md:col-span-1', row: 'row-span-1', hero: false, wide: false }, // 7
    { col: 'md:col-span-1', row: 'row-span-1', hero: false, wide: false }, // 8
  ];

  return (
    <section className="py-6 bg-background">
      <div className="mx-auto max-w-screen-xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b-[3.5px] border-slate-950 dark:border-slate-800 pb-3 mb-6">
          <span className="bg-[#B3121B] text-white px-5 py-2.5 text-[13.5px] md:text-[14.5px] font-black rounded-lg select-none leading-none tracking-tight">
            {language === 'gu' ? 'ફોટો   ગેલેરી' : language === 'hi' ? 'फोटो   गैलरी' : 'Photo   Gallery'}
          </span>
          <Link
            href="/photos"
            className="text-[#B3121B] hover:text-red-700 font-extrabold text-[13px] md:text-[14px] hover:underline"
          >
            {language === 'gu' ? 'બધી ફોટો ગેલેરી →' : 'All Photo Gallery →'}
          </Link>
        </div>

        {/* Bento Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[200px] gap-4">
          {GALLERY_DATA.map((item, index) => {
            const span = SPANS[index] ?? { col: 'md:col-span-1', row: 'row-span-1', hero: false, wide: false };
            const cat = language === 'gu' ? CATS_GU[index % CATS_GU.length] : CATS_EN[index % CATS_EN.length];
            const title = language === 'gu' ? item.titleGu : item.title;

            return (
              <Link
                key={item.id}
                href="/photos"
                className={`group relative flex overflow-hidden rounded-2xl shadow-lg
                  ${span.col} ${span.row}
                  ${span.hero ? 'min-h-[300px] md:min-h-0' : span.wide ? 'min-h-[180px] md:min-h-0' : 'min-h-[200px] md:min-h-0'}
                `}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {/* Image */}
                <Image
                  src={item.src}
                  alt={title}
                  fill
                  sizes={span.hero ? '(max-width: 768px) 100vw, 66vw' : span.wide ? '100vw' : '(max-width: 768px) 100vw, 33vw'}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                />

                {/* Top gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

                {/* Bottom strong gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-100" style={{ opacity: 0.85 }} />

                {/* Category chip */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-[#B3121B] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow-lg">
                    {cat}
                  </span>
                </div>



                {/* Caption */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-4 translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                  <p className={`text-white font-bold leading-snug line-clamp-2 drop-shadow-lg
                    ${span.hero ? 'text-[16px] md:text-[19px]' : span.wide ? 'text-[14px] md:text-[16px]' : 'text-[13px] md:text-[14px]'}
                  `}>
                    {title}
                  </p>

                  {/* View Photos — on hover */}
                  <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="h-[1.5px] w-7 bg-[#B3121B] rounded-full" />
                    <span className="text-white/75 text-[11px] font-semibold tracking-wider uppercase">
                      {language === 'gu' ? 'ફોટો જુઓ' : 'View Photos'}
                    </span>
                    <svg className="h-3 w-3 text-[#B3121B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Red border glow on hover */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: 'inset 0 0 0 2px #B3121B' }} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* --- Trending News Section ------------------------------------------------- */
function TrendingNewsSection({ articles, language }: { articles: Article[]; language: Language }) {
  if (!articles || !articles.length) return null;

  return (
    <section className="py-4 bg-background">
      <div className="mx-auto max-w-screen-xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <span className="bg-[#e02020] text-white text-[13px] font-extrabold px-3 py-1 rounded-sm select-none">
            {language === 'gu' ? 'ટ્રેન્ડિંગ ન્યૂઝ' : 'Trending News'}
          </span>
        </div>
        {/* Underline */}
        <div className="h-[2.5px] w-full bg-foreground/80 mb-5" />

        {/* Grid layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {articles.slice(0, 5).map((article, index) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group relative block w-full overflow-hidden rounded-xl border border-border/10 bg-muted shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
              style={{ aspectRatio: '4/3' }}
            >
              <Image
                src={article.image || 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400&q=80'}
                alt={getArticleTitle(article, language)}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

              {/* Trending Rank Number Circle */}
              <div
                className={`absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black text-white shadow-sm ${index < 3 ? 'bg-[#e02020]' : 'bg-black/60'
                  }`}
              >
                {index + 1}
              </div>

              {/* Title at bottom */}
              <div className="absolute bottom-0 inset-x-0 p-3">
                <p className="text-white text-[12.5px] font-extrabold leading-snug line-clamp-2 drop-shadow">
                  {getArticleTitle(article, language)}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-white/85">
                  <Clock className="h-2.5 w-2.5" />
                  <span>
                    {language === 'gu'
                      ? (article.relativeTimeGu || formatDate(article.publishedAt))
                      : language === 'hi'
                        ? (article.relativeTimeHi || formatDate(article.publishedAt))
                        : (article.relativeTime || formatDate(article.publishedAt))}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


