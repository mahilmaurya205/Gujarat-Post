'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Flame, Eye, Play, ChevronRight, ChevronLeft, Camera, X, Bookmark, Sun, Cloud, CloudRain, Shield, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
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
import { ZODIAC_SIGNS, ZodiacSign } from '@/components/sections/AstrologySection';
import LatestUpdatesSection from '@/components/sections/LatestUpdatesSection';

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
                <span className="bg-accent text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide">
                  {language === 'gu' ? 'ટ્રેન્ડ' : 'Trending'}
                </span>
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
          <div className="flex flex-col gap-3.5">
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

            {[uniqueTopStories[4], uniqueTopStories[5], uniqueTopStories[8]]
              .filter(Boolean)
              .map((art) => (
                <Link
                  key={art.id}
                  href={`/news/${art.slug}`}
                  className="group flex flex-col pt-3.5 border-t border-border/40 hover:bg-muted/10 transition-colors"
                >
                  <h3 className="text-[13.5px] font-black leading-snug text-foreground group-hover:text-accent transition-colors line-clamp-3">
                    {getArticleTitle(art, language)}
                  </h3>
                </Link>
              ))}
          </div>

          {/* Right Sub-Column */}
          <div className="flex flex-col gap-3.5">
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

            {[uniqueTopStories[6], uniqueTopStories[7], uniqueTopStories[11]]
              .filter(Boolean)
              .map((art) => (
                <Link
                  key={art.id}
                  href={`/news/${art.slug}`}
                  className="group flex flex-col pt-3.5 border-t border-border/40 hover:bg-muted/10 transition-colors"
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
            <span>{language === 'gu' ? '૪ કલાક પહેલાં' : '4 hours ago'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-muted-foreground/70" />
              {language === 'gu' ? '૫૨K' : '52K'}
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
            <span>{language === 'gu' ? '૩ કલાક પહેલાં' : '3 hours ago'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-muted-foreground/70" />
              {language === 'gu' ? '૭૪K' : '74K'}
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
            <span>{language === 'gu' ? '૨ કલાક પહેલાં' : '2 hours ago'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-muted-foreground/70" />
              {language === 'gu' ? '૧.૫L' : '1.5L'}
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
                  <div className="ad-tag text-[12.5px] font-semibold mt-2 leading-snug">ફેશન અને ઈલેક્ટ્રોનિક્સ પર ૭૦% સુધી છૂટ — ફક્ત આજે!</div>
                </div>
                <button className="ad-cta bg-white text-slate-900 rounded-sm px-4.5 py-1.5 text-[11px] font-black transition duration-200 hover:-translate-y-0.5 hover:shadow-lg w-max mt-4">
                  હમણાં ખરીદો ↗
                </button>
              </div>
            </div>
          </div>

          {/* YouTube Latest */}
          <div className="w-full rounded-sm border border-slate-200 bg-card p-4 shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 border-b border-border pb-2">
              <span className="text-[#B3121B] font-black text-[13.5px] md:text-[14px] flex items-center gap-1.5 select-none">
                <span className="text-[12px]">▶</span>
                {language === 'gu' ? 'યુટ્યુબ પર લેટેસ્ટ' : 'Latest on YouTube'}
              </span>
            </div>
            
            <Link
              href={`https://www.youtube.com/watch?v=${LATEST_VIDEO_ID}`}
              target="_blank"
              rel="noreferrer"
              className="group block relative w-full overflow-hidden rounded-sm border border-slate-200/60 bg-slate-950 shadow-sm"
              style={{ aspectRatio: '16/9' }}
            >
              <Image
                src={`https://img.youtube.com/vi/${LATEST_VIDEO_ID}/mqdefault.jpg`}
                alt="Latest YouTube Video"
                fill
                sizes="280px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/25 transition-all">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-4.5 w-4.5 fill-current ml-0.5" />
                </span>
              </span>
            </Link>
            
            <Link
              href={`https://www.youtube.com/watch?v=${LATEST_VIDEO_ID}`}
              target="_blank"
              rel="noreferrer"
              className="text-[13px] font-black leading-snug text-foreground hover:text-[#B3121B] transition-colors"
            >
              {language === 'gu'
                ? 'ધી સાબરકાંઠા જિલ્લા સહકારી સંઘ ભ્રષ્ટાચારનો અડ્ડો — યુટ્યુબ પર જુઓ'
                : 'Sabarkantha District Cooperative Union corruption hub — Watch on YouTube'}
            </Link>
          </div>

          {/* Popular Articles */}
          <div className="w-full rounded-sm border border-slate-200 bg-card p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-[#B3121B] font-black text-[13.5px] md:text-[14px] select-none">
                {language === 'gu' ? 'લોકપ્રિય અત્યારે' : 'Popular Now'}
              </span>
              <Link
                href="/category/trending"
                className="text-[11px] font-black text-[#B3121B]/95 hover:text-[#B3121B] hover:underline"
              >
                {language === 'gu' ? 'બધું જુઓ →' : 'View all →'}
              </Link>
            </div>
            
            <div className="flex flex-col divide-y divide-slate-100">
              {uniqueTrendingArt.slice(0, 4).map((art, idx) => (
                <Link
                  key={art.id}
                  href={`/news/${art.slug}`}
                  className="group flex items-start gap-3 py-2.5 hover:bg-slate-50/70 rounded-sm transition-all px-1.5 first:pt-1 last:pb-1"
                >
                  <span className="text-[18px] font-black text-[#B3121B]/85 group-hover:text-[#B3121B] font-serif w-5 shrink-0 mt-0.5 transition-colors select-none text-center">
                    {language === 'gu' ? toGuLocal(idx + 1) : idx + 1}
                  </span>
                  <h4 className="text-[12.5px] font-black leading-snug text-slate-800 group-hover:text-[#B3121B] transition-colors flex-1 line-clamp-3">
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

      <LatestUpdatesSection />

      <CrimeSection language={language} />

      <PopularStoriesSection language={language} />

      <PoliticsSection language={language} />

      <FactCheckSection language={language} />

      <NationalSection language={language} />

      <WorldSection language={language} />

      <VideoDesk videos={videos.slice(0, 7)} language={language} />

      <LiveCenterSection language={language} />

      <EntertainTechLifeSection language={language} />


      {/* Web Stories styled like Instagram Stories */}
      <InstagramStories />

      {/* Photo Gallery Section */}
      <PhotoGallerySection language={language} />

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

    </div>
  );
}

/* --- Video Desk Section ---------------------------------------------------- */
function VideoDesk({ videos, language, showShorts = true }: { videos: typeof VIDEOS; language: Language; showShorts?: boolean }) {
  const [playId, setPlayId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  if (!videos.length) return null;

  const featuredVideo = videos[0];
  const sidebarVideos = videos.slice(1, 9);
  
  // Combine passed videos with all other videos and shorts to make a long list of reels
  const shortVideos = [
    ...videos, // 5 videos
    ...VIDEOS.filter(v => v.type === 'short'), // 4 shorts
    ...VIDEOS.filter(v => v.type === 'video').slice(5, 7) // 1 extra video
  ].slice(0, 10);

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
  }, [shortVideos]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="mt-6">
      {/* ── Red Panel ─────────────────────────────────────────────────── */}
      <div className="w-full bg-gradient-to-b from-[#B3121B] to-[#8f0d14] text-white rounded-sm px-5 md:px-8 pt-6 pb-8 border border-white/10 relative overflow-hidden shadow-lg">

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }} />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-white font-black text-[18px] md:text-[20px] select-none tracking-tight">
              {language === 'gu' ? 'ગુજરાત પોસ્ટ વિશેષ' : 'Gujarat Post Special'}
            </span>
            <span className="border border-white/40 text-white text-[11px] font-black px-2.5 py-1 rounded-sm select-none tracking-wider bg-white/5">
              {language === 'gu' ? 'તપાસ - એક્સક્લુઝિવ' : 'INVESTIGATION'}
            </span>
          </div>
          <Link
            href="/videos"
            className="text-white/95 font-extrabold text-[13px] md:text-[14px] hover:text-white hover:underline flex items-center gap-1"
          >
            {language === 'gu' ? 'બધું જુઓ →' : 'See All →'}
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

            {/* Category badge */}
            <span className="inline-flex items-center text-[10.5px] font-black bg-white text-[#B3121B] px-2.5 py-1 rounded-sm w-max mb-2.5 select-none tracking-wide uppercase">
              {language === 'gu' ? 'એક્સક્લુઝિવ તપાસ' : 'EXCLUSIVE INVESTIGATION'}
            </span>

            {/* Title */}
            <h3 className="font-extrabold text-[16px] md:text-[19px] leading-snug text-white group-hover:underline transition-all line-clamp-2">
              {getLocalized(language, { en: featuredVideo.title, gu: featuredVideo.titleGu, hi: featuredVideo.titleHi })}
            </h3>

            {/* Meta */}
            <div className="flex items-center gap-1.5 mt-2.5 text-[11.5px] text-white/70 font-semibold select-none">
              <Eye className="h-3.5 w-3.5" />
              <span>
                {language === 'gu' ? toGuLocal(formatViews(featuredVideo.views)) : formatViews(featuredVideo.views)} વ્યુઝ
              </span>
              <span>·</span>
              <span>{featuredVideo.duration}</span>
            </div>
          </div>

          {/* Right: Sidebar container */}
          <div className="flex flex-col min-w-0">
            {/* Must Watch Header */}
            <div className="bg-white text-slate-800 rounded-t-sm px-4 py-2.5 flex items-center justify-between select-none shadow-sm">
              <span className="font-black text-[#B3121B] text-[13px] uppercase tracking-wide">Must Watch</span>
              <span className="text-slate-500 font-black text-[9.5px] uppercase tracking-wider">Scroll &rarr;</span>
            </div>

            {/* Sidebar video list */}
            <div className="flex flex-col divide-y divide-white/10 lg:max-h-[382px] lg:overflow-y-auto p-3 pr-2 scrollbar-thin bg-black/15 rounded-b-sm">
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
                      <span>{language === 'gu' ? toGuLocal(formatViews(v.views)) : formatViews(v.views)}</span>
                      <span>·</span>
                      <span>{v.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Shorts Strip ───────────────────────────────────────────────── */}
        {showShorts && (
          <div className="relative z-10 mt-8 pt-6 border-t border-white/20">
            {/* Shorts header */}
            <div className="flex items-center gap-2 mb-5">
              <span className="bg-white/20 text-white font-black text-[12.5px] px-3 py-1 rounded-sm select-none tracking-wide border border-white/25">
                {language === 'gu' ? 'શોર્ટ વીડિયો' : language === 'hi' ? 'शॉर्ट वीडियो' : 'Short Videos'}
              </span>
            </div>

            {/* Horizontal scroll container */}
            <div className="relative">
              {/* Left arrow */}
              {showLeftArrow && (
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  className="absolute left-[-12px] top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center backdrop-blur transition-all shadow border border-white/30"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-4 w-4 text-white stroke-[2.5]" />
                </button>
              )}

              {/* Scrollable list */}
              <div
                ref={scrollContainerRef}
                onScroll={updateArrows}
                className="flex gap-3 overflow-x-auto pb-1 mx-4 scrollbar-hide snap-x snap-mandatory"
              >
                {shortVideos.map((v) => (
                  <div
                    key={v.id}
                    className="group relative flex-shrink-0 w-[140px] md:w-[155px] cursor-pointer snap-start"
                    onClick={() => setPlayId(v.youtubeId)}
                  >
                    {/* Vertical aspect card (9/16) */}
                    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-sm bg-black/30 border border-white/15">
                      <Image
                        src={v.thumbnail}
                        alt={v.titleGu}
                        fill
                        sizes="155px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Dark gradient bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      {/* Play button */}
                      <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 text-[#B3121B] flex items-center justify-center shadow transition-transform duration-300 group-hover:scale-110">
                        <Play className="h-3 w-3 fill-current ml-0.5" />
                      </span>

                      {/* Title at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-2.5">
                        <p className="text-white text-[11px] font-black leading-snug line-clamp-2">
                          {getLocalized(language, { en: v.title, gu: v.titleGu, hi: v.titleHi })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right arrow */}
              {showRightArrow && (
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  className="absolute right-[-12px] top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center backdrop-blur transition-all shadow border border-white/30"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-4 w-4 text-white stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>
        )}
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
  const guDigits = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];
  return String(num).split("").map(char => {
    const digit = parseInt(char, 10);
    return isNaN(digit) ? char : guDigits[digit];
  }).join("");
};

/* --- City Hyperlocal Section ("ગુજરાત" Zone) ----------------------------- */
function CityHyperlocalSection({
  language,
}: {
  language: Language;
}) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('અમદાવાદ');

  const mockSlides = [
    {
      id: 'c1',
      slug: 'rajkot-smart-city-roadworks-underway-344',
      image: '/assets/demo/6.jpg',
      titleGu: 'રાજકોટમાં મોટું કામ! સ્માર્ટ સિટી પ્રોજેક્ટ હેઠળ રસ્તાઓનું ધમધમાટ કામ શરૂ',
      title: 'Major work in Rajkot! Roadworks start in full swing under Smart City project',
      titleHi: 'राजकोट में बड़ा काम! स्मार्ट सिटी प्रोजेक्ट के तहत सड़कों का काम शुरू',
      relativeTimeGu: '૧ કલાક પહેલાં',
      relativeTime: '1 hour ago',
      relativeTimeHi: '1 घंटा पहले',
      categoryGu: 'અમદાવાદ',
      category: 'Ahmedabad',
      categoryHi: 'अहमदाबाद',
      viewsGu: '૧૨K',
      views: '12K',
      excerptGu: 'શહેરના મુખ્ય વિસ્તારોમાં રસ્તા પહોળા કરવા અને નવી ડ્રેનેજ લાઈન નાખવાનું કામ યુદ્ધના ધોરણે શરૂ કરાયું છે. મ્યુનિસિપલ કોર્પોરેશનના જણાવ્યા મુજબ આગામી ત્રણ મહિનામાં કામ પૂર્ણ કરવાનો લક્ષ્યાંક રખાયો છે, જેથી ચોમાસા પહેલા નાગરિકોને રાહત મળી શકે. સ્થાનિક ધારા સભ્યોએ પ્રોજેક્ટની જાતે મુલાકાત લઈ કામની ગુણવત્તા અંગે અધિકારીઓને સૂચનાઓ આપી હતી.',
      excerpt: 'Road widening and new drainage line installation have started on a war footing. The Municipal Corporation aims to complete the work in three months to provide relief before monsoon.',
      excerptHi: 'शहर के मुख्य क्षेत्रों में सड़कों को चौड़ा करने और नई ड्रेनेज लाइन बिछाने का काम युद्ध स्तर पर शुरू हो गया है।',
      tags: ['સિવિક', 'ટ્રાફિક', 'મેટ્રો', 'ક્રાઇમ', 'હવામાન']
    },
    {
      id: 'c2',
      slug: 'surat-diamond-trading-hall-inauguration-345',
      image: '/assets/demo/1.jpg',
      titleGu: 'સુરતમાં ડાયમંડ બુર્સમાં નવા ટ્રેડિંગ સેન્ટરનું ઉદ્ઘાટન, વેપારીઓ ખુશખુશાલ',
      title: 'Inauguration of new trading center in Surat Diamond Bourse, merchants happy',
      titleHi: 'सूरत डायमंड बुर्स में नए ट्रेडिंग सेंटर का उद्घाटन, व्यापारी खुश',
      relativeTimeGu: '૨ કલાક પહેલાં',
      relativeTime: '2 hours ago',
      relativeTimeHi: '2 घंटे पहले',
      categoryGu: 'સુરત',
      category: 'Surat',
      categoryHi: 'सूरत',
      viewsGu: '૨૫K',
      views: '25K',
      excerptGu: 'સુરત ડાયમંડ બુર્સ વૈશ્વિક સ્તરે વેપાર માટે સજ્જ થઈ ગયું છે. આ નવા સેન્ટરથી વેપારમાં સરળતા રહેશે.',
      excerpt: 'Surat Diamond Bourse is now ready for global trade. This new center will make trading easier.',
      excerptHi: 'सूरत डायमंड बुर्स वैश्विक व्यापार के लिए तैयार है। इस नए केंद्र से व्यापार आसान होगा।',
      tags: ['ડાયમંડ', 'બિઝનેસ', 'સુરત', 'વેપાર']
    },
    {
      id: 'c3',
      slug: 'ahmedabad-metro-phase-two-trial-run-346',
      image: '/assets/demo/3.jpg',
      titleGu: 'અમદાવાદમાં મેટ્રો ટ્રેનના ફેઝ-2નું સફળ ટ્રાયલ રન પૂર્ણ, ટૂંક સમયમાં શરૂ થશે સેવા',
      title: 'Phase-2 trial run of Ahmedabad Metro completed successfully, services soon',
      titleHi: 'अहमदाबाद मेट्रो फेज-2 का सफल ट्रायल रन पूरा, सेवाएं जल्द',
      relativeTimeGu: '૩૦ મિનિટ પહેલાં',
      relativeTime: '30 mins ago',
      relativeTimeHi: '30 मिनट पहले',
      categoryGu: 'અમદાવાદ',
      category: 'Ahmedabad',
      categoryHi: 'आशंका',
      viewsGu: '૩૪K',
      views: '34K',
      excerptGu: 'મેટ્રો ટ્રેનના ફેઝ-2 ટ્રાયલ રનને ગ્રીન સિગ્નલ મળી ગયું છે. ખૂબ જ ટૂંક સમયમાં મુસાફરો આ સેવાનો લાભ લઈ શકશે.',
      excerpt: 'The Phase-2 trial run of the metro train has received a green signal. Passengers will benefit soon.',
      excerptHi: 'मेट्रो ट्रेन के फेज-2 ट्रायल रन को हरी झंडी मिल गई है। यात्री जल्द लाभ उठा सकेंगे।',
      tags: ['મેટ્રો', 'વિકાસ', 'અમદાવાદ', 'ટ્રાફિક']
    }
  ];

  const mockList = [
    {
      id: 'l1',
      slug: 'bhavnagar-new-industrial-units-approved-347',
      image: '/assets/demo/5.jpg',
      titleGu: 'ભાવનગરને મળી મોટી ભેટ! નવા ઔદ્યોગિક એકમને મંજૂરી, રોજગારી વધશે',
      title: 'Bhavnagar gets big gift! New industrial unit approved, jobs to rise',
      titleHi: 'भावनगर को मिला बड़ा तोहफा! नए औद्योगिक इकाई को मंजूरी',
      relativeTimeGu: '૩ કલાક પહેલાં',
      relativeTime: '3 hours ago',
      relativeTimeHi: '3 घंटे पहले',
      categoryGu: 'ભાવનગર',
      category: 'Bhavnagar',
      categoryHi: 'भावनगर',
      viewsGu: '૪૬K',
      views: '46K'
    },
    {
      id: 'l2',
      slug: 'girnar-ropeway-tourist-rush-increases-tremendously-205',
      image: '/assets/demo/3.jpg',
      titleGu: 'ગિરનાર રોપ-વે પર ઉમટ્યા પ્રવાસીઓ! સંખ્યામાં જોરદાર વધારો, સુરક્ષા ચિંતા',
      title: 'Tourists flock to Girnar Ropeway! Tremendous increase in numbers',
      titleHi: 'गिरनार रोपवे पर उमड़े पर्यटक! संख्या में भारी बढ़ोतरी',
      relativeTimeGu: '૪ કલાક પહેલાં',
      relativeTime: '4 hours ago',
      relativeTimeHi: '4 घंटे पहले',
      categoryGu: 'જૂનાગઢ',
      category: 'Junagadh',
      categoryHi: 'जूनागढ़',
      viewsGu: '૫૨K',
      views: '52K'
    },
    {
      id: 'l3',
      slug: 'state-cabinet-meeting-major-decisions-348',
      image: '/assets/demo/4.jpg',
      titleGu: 'રાજ્ય મંત્રીમંડળની બેઠકમાં મોટા નિર્ણય, જાણો શું-શું બદલાયું',
      title: 'Major decisions in state cabinet meeting, know what changed',
      titleHi: 'राज्य मंत्रिमंडल की बैठक में बड़े फैसले, जानें क्या बदला',
      relativeTimeGu: '૫ કલાક પહેલાં',
      relativeTime: '5 hours ago',
      relativeTimeHi: '5 घंटे पहले',
      categoryGu: 'ગાંધીનગર',
      category: 'Gandhinagar',
      categoryHi: 'गांधीनगर',
      viewsGu: '૬૮K',
      views: '68K'
    },
    {
      id: 'l4',
      slug: 'anand-dairy-expansion-project-inauguration-349',
      image: '/assets/demo/1.jpg',
      titleGu: 'આણંદ ડેરી સંઘનું નવું પ્લાન્ટ વિસ્તરણ! ખેડૂતોને સીધો ફાયદો થશે',
      title: 'Anand Dairy Union new plant expansion! Farmers to benefit directly',
      titleHi: 'आनंद डेयरी संघ का नया प्लांट विस्तार! किसानों को होगा सीधा फायदा',
      relativeTimeGu: '૬ કલાક પહેલાં',
      relativeTime: '6 hours ago',
      relativeTimeHi: '6 घंटे पहले',
      categoryGu: 'આણંદ',
      category: 'Anand',
      categoryHi: 'आनंद',
      viewsGu: '૭૧K',
      views: '71K'
    }
  ];

  const currentSlide = mockSlides[slideIdx];

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
          </div>

          {/* Tab Navigation List */}
          <div className="flex items-center gap-5 border-b border-border pb-3 mb-6 overflow-x-auto scrollbar-none select-none">
            {['અમદાવાદ', 'સુરત', 'વડોદરા', 'રાજકોટ', 'ગાંધીનગર', 'અન્ય'].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[13.5px] md:text-[14.5px] font-black pb-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
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
                    <h3 className="font-extrabold text-[15.5px] md:text-[17px] leading-snug tracking-tight text-foreground group-hover/link:text-[#B3121B] transition-colors line-clamp-3">
                      {getLocalized(language, { en: currentSlide.title, gu: currentSlide.titleGu, hi: currentSlide.titleHi })}
                    </h3>
                  </Link>

                  <p className="text-muted-foreground text-[12.5px] leading-relaxed mt-2 line-clamp-3 font-medium">
                    {getLocalized(language, { en: currentSlide.excerpt, gu: currentSlide.excerptGu, hi: currentSlide.excerptHi })}
                  </p>

                  {/* Meta Details */}
                  <div className="flex items-center gap-2 mt-3.5 text-[11px] text-muted-foreground font-semibold border-b border-border/40 pb-3 mb-3.5">
                    <span>
                      {getLocalized(language, { en: currentSlide.relativeTime, gu: currentSlide.relativeTimeGu, hi: currentSlide.relativeTimeHi })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground/70" />
                      {language === 'gu' ? toGuLocal(currentSlide.viewsGu) : currentSlide.views}
                    </span>
                  </div>

                  {/* Keyword Tags bar */}
                  <div className="flex flex-wrap gap-1.5">
                    {currentSlide.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted text-muted-foreground text-[10.5px] font-bold px-2.5 py-1 rounded-sm border border-border select-none"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* List updates columns */}
            <div className="flex flex-col min-w-0 md:border-l md:border-border/60 md:pl-6 gap-4">
              {mockList.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group flex gap-3.5 items-start py-2 border-b border-border/40 last:border-b-0 pb-3 last:pb-0"
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
                    <span className="text-[#B3121B] font-extrabold text-[11px] uppercase tracking-wide mb-0.5">
                      {getLocalized(language, { en: item.category, gu: item.categoryGu, hi: item.categoryHi })}
                    </span>
                    <h4 className="text-[13px] md:text-[13.5px] font-extrabold leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-2">
                      {getLocalized(language, { en: item.title, gu: item.titleGu, hi: item.titleHi })}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10.5px] text-muted-foreground font-semibold">
                      <span>
                        {getLocalized(language, { en: item.relativeTime, gu: item.relativeTimeGu, hi: item.relativeTimeHi })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground/60" />
                        {language === 'gu' ? toGuLocal(item.viewsGu) : item.views}
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
                {language === 'gu' ? 'ફક્ત ૧૦.૫% વ્યાજે, ૫ મિનિટમાં મંજૂરી' : 'Just 10.5% interest, approval in 5 mins'}
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
            <div className="flex items-center gap-1.5 border-b border-border pb-2.5 mb-3.5">
              <span className="text-[#B3121B] font-black text-[13.5px] md:text-[14px]">
                {language === 'gu' ? '• ટ્રેન્ડિંગ વિષયો' : '• Trending Topics'}
              </span>
            </div>
            <div className="border border-border rounded-sm bg-card p-4 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {['#ચૂંટણી ૨૦૨૭', '#વરસાદ', '#સોના-ચાંદી', '#ક્રિકેટ', '#મેટ્રો', '#સેમિકન્ડક્ટર', '#ડાયમંડ ઉદ્યોગ', '#ટ્રાફિક'].map((tag) => (
                  <span
                    key={tag}
                    className="border border-border text-[11px] font-black px-3 py-1.5 rounded-full text-muted-foreground hover:border-[#B3121B] hover:text-[#B3121B] transition-colors bg-card cursor-pointer select-none"
                  >
                    {tag}
                  </span>
                ))}
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
}: {
  language: Language;
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
      relativeTimeGu: '૧ કલાક પહેલાં',
      relativeTime: '1 hour ago',
      relativeTimeHi: '1 घंटा पहले',
      categoryGu: 'અમદાવાદ',
      category: 'Ahmedabad',
      categoryHi: 'अहमदाबाद',
      viewsGu: '૬૮K',
      views: '68K'
    },
    {
      id: 'c2',
      slug: 'surat-police-seize-contraband-worth-crores-in-joint-raid-94',
      image: '/assets/demo/6.jpg',
      titleGu: 'સુરત પોલીસની સંયુક્ત રેડ! કરોડોની મુદ્દામાલ જપ્ત',
      title: 'Joint raid by Surat police! Contraband worth crores seized',
      titleHi: 'सूरत पुलिस की संयुक्त छापेमारी! करोड़ों का माल जब्त',
      relativeTimeGu: '૨ કલાક પહેલાં',
      relativeTime: '2 hours ago',
      relativeTimeHi: '2 घंटे पहले',
      categoryGu: 'સુરત',
      category: 'Surat',
      categoryHi: 'सूरत',
      viewsGu: '૭૧K',
      views: '71K'
    },
    {
      id: 'c3',
      slug: 'kidnapping-racket-busted-in-rajkot-five-arrested-95',
      image: '/assets/demo/4.jpg',
      titleGu: 'રાજકોટમાં અપહરણ ગેંગનો પર્દાફાશ! પાંચ આરોપી ઝડપાયા',
      title: 'Kidnapping gang exposed in Rajkot! Five suspects arrested',
      titleHi: 'राजकोट में अपहरण गिरोह का पर्दाफाश! पांच आरोपी गिरफ्तार',
      relativeTimeGu: '૩ કલાક પહેલાં',
      relativeTime: '3 hours ago',
      relativeTimeHi: '3 घंटे पहले',
      categoryGu: 'રાજકોટ',
      category: 'Rajkot',
      categoryHi: 'राजकोट',
      viewsGu: '૭૪K',
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
      relativeTimeGu: '૪ કલાક પહેલાં',
      relativeTime: '4 hours ago',
      relativeTimeHi: '4 घंटे पहले',
      categoryGu: 'વડોદરા',
      category: 'Vadodara',
      categoryHi: 'વડોદરા',
      viewsGu: '૭૮K',
      views: '78K'
    },
    {
      id: 'l2',
      slug: 'drug-trafficking-route-from-pakistan-via-gujarat-busted-98',
      titleGu: 'ભાવનગરમાં દારૂનો મોટો જથ્થો ઝડપાયો, ત્રણ આરોપી કબજે',
      title: 'Huge alcohol haul seized in Bhavnagar, three suspects in custody',
      titleHi: 'भावनगर में शराब का बड़ा जहीरा जब्त, तीन आरोपी गिरफ्तार',
      relativeTimeGu: '૫ કલાક પહેલાં',
      relativeTime: '5 hours ago',
      relativeTimeHi: '5 घंटे पहले',
      categoryGu: 'ભાવનગર',
      category: 'Bhavnagar',
      categoryHi: 'भावनगर',
      viewsGu: '૮૧K',
      views: '81K'
    },
    {
      id: 'l3',
      slug: 'land-fraud-case-senior-official-arrested-in-vadodara-97',
      titleGu: 'જૂનાગઢમાં ઓનલાઇન લોન એપના નામે બ્લેકમેલિંગ! ફરિયાદ નોંધાઈ',
      title: 'Blackmailing in Junagadh in the name of online loan apps! FIR registered',
      titleHi: 'जूनागढ़ में ऑनलाइन लोन ऐप के नाम पर ब्लैकमेलिंग! शिकायत दर्ज',
      relativeTimeGu: '૬ કલાક પહેલાં',
      relativeTime: '6 hours ago',
      relativeTimeHi: '6 घंटे पहले',
      categoryGu: 'જૂનાગઢ',
      category: 'Junagadh',
      categoryHi: 'जूनागढ़',
      viewsGu: '૯૦K',
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
        titleGu: 'ગુજરાત ચૂંટણી ૨૦૨૭ નજીક! જિલ્લાઓમાં તૈયારીઓ તેજ, સત્તાધારી પક્ષ સક્રિય',
        title: 'Gujarat Election 2027 near! Preparations active in districts',
        category: 'Politics'
      },
      subs: [
        {
          id: 'ps1_1',
          slug: 'cm-meeting-vibrant-gujarat-rural-development-302',
          titleGu: 'CMની મોટી બેઠક! વિકાસ પ્રોજેક્ટ માટે સમીક્ષા, ગ્રામીણ વિસ્તારો પર ભાર'
        },
        {
          id: 'ps1_2',
          slug: 'bjp-state-executive-meeting-organization-expansion-303',
          titleGu: 'ભાજપ પ્રદેશ કારોબારીની બેઠકમાં સંગઠન વિસ્તરણ પર મોટી ચર્ચા'
        },
        {
          id: 'ps1_3',
          slug: 'aap-claims-ground-level-network-expansion-gujarat-304',
          titleGu: 'AAPનો મોટો દાવો! ગ્રામ્ય ગુજરાતમાં ભૂ-સ્તરીય નેટવર્ક વિસ્તાર્યું'
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
          titleGu: 'સૈન્ય તાલીમમાં મોટી ગેરરીતિ! ૧૦૦થી વધુ પ્રમોશન રદ કરાયા'
        },
        {
          id: 'ps2_2',
          slug: 'congress-reveals-cards-election-campaign-strategy-307',
          titleGu: 'કોંગ્રેસે ખોલ્યા પત્તા! ૨૦૨૭ ચૂંટણી ઝુંબેશ વ્યૂહ જાહેર કર્યો'
        },
        {
          id: 'ps2_3',
          slug: 'assembly-monsoon-session-hung-opposition-adjournment-motion-308',
          titleGu: 'વિધાનસભા ચોમાસુ સત્રમાં હોબાળો! વિપક્ષે બેરોજગારી મુદ્દે સ્થગન પ્રસ્તાવ આપ્યો'
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
          slug: 'cm-meeting-vibrant-gujarat-rural-development-302',
          titleGu: 'કેન્દ્રીય મંત્રીની ગુજરાત મુલાકાત! નવા ઔદ્યોગિક કોરિડોરની જાહેરાત શક્ય'
        },
        {
          id: 'ps3_2',
          slug: 'voter-list-revision-campaign-starts-online-registration-appeal-311',
          titleGu: 'મતદાર યાદી સુધારણા ઝુંબેશ શરૂ! નાગરિકોને ઓનલાઈન નોંધણીની અપીલ',
          isHighlighted: true
        },
        {
          id: 'ps3_3',
          slug: 'dwarka-temple-flag-ceremony-devotees-excited-404',
          titleGu: 'યુવાનો માટે મોટી તક! પોલીસ ભરતીમાં ૧૦,૦૦૦ જગ્યાઓ ટૂંક સમયમાં ભરાશે'
        }
      ]
    }
  ];

  const mockZodiacArticles = [
    {
      id: 'za0',
      slug: 'gujarat-heavy-rain-alert-waterlogging-400',
      image: '/assets/demo/1.jpg',
      symbol: '૧',
      titleGu: 'ગુજરાત ચૂંટણી ૨૦૨૭ નજીક! જિલ્લાઓમાં તૈયારીઓ તેજ, સત્તાધારી પક્ષ સક્રિય',
      relativeTimeGu: '૩૦ મિનિટ પહેલાં',
      viewsGu: '૨.૫L'
    },
    {
      id: 'za1',
      slug: 'monsoon-2025-gujarat-rain-forecast-weather-dept-401',
      image: '/assets/demo/7.jpg',
      symbol: '૨',
      titleGu: 'મોટો વિવાદ! અમદાવાદ મ્યુનિ. કમિશનરે તંત્ર સામે વાંધો ઉઠાવ્યો',
      relativeTimeGu: '૧ કલાક પહેલાં',
      viewsGu: '૧.૮L'
    },
    {
      id: 'za2',
      slug: 'gold-silver-price-surge-latest-rates-today-402',
      image: '/assets/demo/5.jpg',
      symbol: '૩',
      titleGu: 'હાઈકોર્ટની આકરી નોટિસ! રાજ્ય સરકારને ભરતી પ્રક્રિયા અંગે જવાબ માંગ્યો',
      relativeTimeGu: '૨ કલાક પહેલાં',
      viewsGu: '૧.૫L'
    }
  ];

  const visiblePopularArticles = [
    mockZodiacArticles[popularStartIndex],
    mockZodiacArticles[(popularStartIndex + 1) % mockZodiacArticles.length],
    mockZodiacArticles[(popularStartIndex + 2) % mockZodiacArticles.length]
  ];

  const currentSlide = mockSlides[slideIdx];

  return (
    <section className="mt-2.5 border-t border-border pt-3.5">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
        
        {/* Left Column: Crime news items and sub-grids */}
        <div className="flex flex-col min-w-0">
          
          {/* Crime Header */}
          <div className="flex items-center justify-between border-b-[3px] border-slate-950 pb-2.5 mb-6">
            <span className="bg-[#B3121B] text-white px-4.5 py-1.5 font-extrabold text-[14px] md:text-[15px] rounded-sm tracking-tight leading-none uppercase">
              {language === 'gu' ? 'ક્રાઇમ' : 'Crime'}
            </span>
            <Link
              href="/category/crime"
              className="text-[#B3121B] hover:text-red-700 font-extrabold text-[13px] md:text-[14px] hover:underline"
            >
              {language === 'gu' ? 'બધા ક્રાઇમ સમાચાર →' : 'All Crime News →'}
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
                  <Link href={`/news/${currentSlide.slug}`} className="group/link">
                    <h3 className="font-extrabold text-[15.5px] md:text-[17px] leading-snug tracking-tight text-foreground hover:text-[#B3121B] transition-colors line-clamp-3">
                      {getLocalized(language, { en: currentSlide.title, gu: currentSlide.titleGu, hi: currentSlide.titleHi })}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-semibold mt-2.5">
                    <span>
                      {getLocalized(language, { en: currentSlide.relativeTime, gu: currentSlide.relativeTimeGu, hi: currentSlide.relativeTimeHi })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground/70" />
                      {language === 'gu' ? toGuLocal(currentSlide.viewsGu) : currentSlide.views}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* List side updates (Text lists only, no images, matching the screen!) */}
            <div className="flex flex-col min-w-0 md:border-l md:border-border/60 md:pl-6 gap-2">
              <div className="flex flex-col mb-1 select-none">
                <span className="text-[14px] md:text-[15px] font-black text-slate-700 dark:text-slate-300 pb-1">
                  {language === 'gu' ? 'જિલ્લા અપડેટ' : 'District Updates'}
                </span>
                <div className="border-b border-slate-900" />
              </div>

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
                      <Eye className="h-3 w-3 text-muted-foreground/60" />
                      {language === 'gu' ? toGuLocal(item.viewsGu) : item.views}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 3-Column Popular Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border/40 pt-5 mt-6">
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
                  {col.subs.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/news/${sub.slug}`}
                      className="group py-2 block"
                    >
                      <h4 className="text-[12px] md:text-[12.5px] font-bold leading-snug line-clamp-2 text-foreground group-hover:text-[#B3121B] transition-colors">
                        {sub.titleGu}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Sidebar (Silver Rate, Weather, WhatsApp, Horoscope) */}
        <div className="flex flex-col gap-6 sticky top-20 select-none">
          
          {/* Silver Rate Widget */}
          <div className="rounded-sm border border-slate-200 bg-card p-4.5 shadow-sm flex items-center justify-between select-none">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <svg viewBox="0 0 24 24" className="h-5.5 w-5.5 fill-none stroke-current stroke-2">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                  <path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[13.5px] font-black text-foreground">
                  {language === 'gu' ? 'ચાંદી (૧ કિલો)' : 'Silver (1 kg)'}
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                  {language === 'gu' ? 'પ્રતિ કિલો' : 'per kg'}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[15.5px] font-black text-foreground">
                {language === 'gu' ? '₹૯૨,૮૦૦' : '₹92,800'}
              </span>
              <span className="text-[10.5px] text-slate-500 font-bold mt-0.5">
                {language === 'gu' ? '— સ્થિર' : '— Stable'}
              </span>
            </div>
          </div>

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
                {language === 'gu' ? `ભેજ ૬૮%` : `Humidity 68%`}
              </span>
              <span className="flex items-center gap-1.5 select-none">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-none stroke-current stroke-2">
                  <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.59-6.59A2 2 0 1 1 19 12H2" />
                </svg>
                {language === 'gu' ? `પવન ૧૪ કિમી` : `Wind 14 km/h`}
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
                    <span className="text-[11px] font-extrabold text-foreground group-hover:text-[#B3121B] transition-colors select-none leading-none">
                      {language === 'gu' ? sign.nameGu : sign.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Daily Rashifal Horoscope Modal */}
      {selectedZodiac && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setSelectedZodiac(null)} />
          
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden bg-card border border-border p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-center">
            <button
              type="button"
              onClick={() => setSelectedZodiac(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted-foreground/10 transition"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto mt-4 rounded-full border border-border p-1 shadow-md w-24 h-24 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedZodiac.image}
                alt={selectedZodiac.name}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-xl font-black text-foreground">
              {language === 'gu' ? selectedZodiac.nameGu : selectedZodiac.name}
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
      )}
    </section>
  );
}

/* --- Popular Stories Slider Section -------------------------------------- */
function PopularStoriesSection({
  language,
}: {
  language: Language;
}) {
  const [startIndex, setStartIndex] = useState(0);

  const mockArticles = [
    {
      id: 'za0',
      slug: 'monsoon-rain-gujarat-forecast-401',
      image: '/assets/demo/3.jpg',
      titleGu: '૨૦૨૫: ગુજરાતમાં ક્યારે વરસાદ? હવામાન વિભાગની આગાહી',
      title: '2025: When will it rain in Gujarat? Weather Department forecast',
      relativeTimeGu: 'પહેલાં',
      relativeTime: 'ago',
      viewsGu: '૧.૮L',
      views: '1.8L'
    },
    {
      id: 'za1',
      slug: 'gold-silver-price-surge-latest-rates-today-402',
      image: '/assets/demo/6.jpg',
      titleGu: 'સોના-ચાંદીના ભાવમાં જોરદાર ઉછાળો! જાણો આજના લેટેસ્ટ રેટ',
      title: 'Gold-silver prices surge! Know latest rates today',
      relativeTimeGu: '૨ કલાક પહેલાં',
      relativeTime: '2 hours ago',
      viewsGu: '૧.૫L',
      views: '1.5L'
    },
    {
      id: 'za2',
      slug: 'gujarat-board-result-2025-declared-403',
      image: '/assets/demo/7.jpg',
      titleGu: 'ગુજરાત બોર્ડ પરિણામ ૨૦૨૫ જાહેર! ટોપર્સનું લિસ્ટ અને ટકાવારી જુઓ',
      title: 'Gujarat Board Result 2025 declared! Check toppers list and percentage',
      relativeTimeGu: '૩ કલાક પહેલાં',
      relativeTime: '3 hours ago',
      viewsGu: '૧.૨L',
      views: '1.2L'
    },
    {
      id: 'za3',
      slug: 'dwarka-temple-flag-ceremony-devotees-excited-404',
      image: '/assets/demo/5.jpg',
      titleGu: 'સરકારી ન્યૂઝલેટર: યોજનાઓની પ્રગતિ અંગે અહેવાલ પ્રસિદ્ધ કરવામાં આવ્યો',
      title: 'Government Newsletter: Progress report of schemes published',
      relativeTimeGu: '૪ કલાક પહેલાં',
      relativeTime: '4 hours ago',
      viewsGu: '૯૫K',
      views: '95K'
    }
  ];

  // Show 3 articles at a time
  const visibleArticles = [
    mockArticles[startIndex],
    mockArticles[(startIndex + 1) % mockArticles.length],
    mockArticles[(startIndex + 2) % mockArticles.length]
  ];

  const getGoldNumberGu = (idx: number) => {
    const val = (startIndex + idx + 3);
    return toGuLocal(val);
  };

  const getGoldNumber = (idx: number) => {
    return String(startIndex + idx + 3);
  };

  return (
    <section className="mt-6 border-t border-border pt-5">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
        
        {/* Left Column: Popular Stories Slider */}
        <div className="flex flex-col min-w-0">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-[3px] border-slate-950 pb-2.5 mb-6">
            <span className="bg-[#B3121B] text-white px-5 py-1.5 font-extrabold text-[14px] md:text-[15px] rounded-sm tracking-tight leading-none uppercase">
              {language === 'gu' ? 'લોકપ્રિય સ્ટોરીઝ' : 'Popular Stories'}
            </span>
            <Link
              href="/category/trending"
              className="text-[#B3121B] hover:text-red-700 font-extrabold text-[13px] md:text-[14px] hover:underline"
            >
              {language === 'gu' ? 'વધુ →' : 'More →'}
            </Link>
          </div>

          {/* Slider Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Left and Right floating chevrons */}
            <button
              type="button"
              onClick={() => setStartIndex((prev) => (prev - 1 + mockArticles.length) % mockArticles.length)}
              className="absolute left-[-16px] top-[100px] -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-600/80 text-white hover:bg-neutral-700 transition z-20 cursor-pointer shadow-md select-none border border-white/10"
            >
              <ChevronLeft className="h-4.5 w-4.5 stroke-[3]" />
            </button>
            <button
              type="button"
              onClick={() => setStartIndex((prev) => (prev + 1) % mockArticles.length)}
              className="absolute right-[-16px] top-[100px] -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-600/80 text-white hover:bg-neutral-700 transition z-20 cursor-pointer shadow-md select-none border border-white/10"
            >
              <ChevronRight className="h-4.5 w-4.5 stroke-[3]" />
            </button>

            {visibleArticles.map((art, idx) => (
              <div key={art.id} className="flex flex-col min-w-0">
                {/* Gold Number Index */}
                <div className="text-[#C5A85A] font-extrabold text-[22px] md:text-[24px] mb-1.5 select-none leading-none font-serif">
                  {language === 'gu' ? getGoldNumberGu(idx) : getGoldNumber(idx)}
                </div>

                {/* Preview Image */}
                <Link
                  href={`/news/${art.slug}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border/10 bg-muted mb-2">
                    <Image
                      src={art.image}
                      alt={art.titleGu}
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
                  {language === 'gu' ? `${art.relativeTimeGu} · ${toGuLocal(art.viewsGu)}` : `${art.relativeTime} · ${art.views}`}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column Sidebar: E-Paper and Ad */}
        <div className="flex flex-col gap-6 sticky top-20 select-none">
          
          {/* E-Paper Widget */}
          <div className="w-full rounded-sm border border-slate-200 bg-card p-4.5 shadow-sm flex items-center justify-between hover:border-red-300 transition-colors cursor-pointer select-none">
            <div className="flex items-center gap-3">
              <span className="bg-[#B3121B] text-white px-2.5 py-1 text-[11.5px] font-black rounded-sm">
                {language === 'gu' ? 'ઈ-પેપર' : 'E-Paper'}
              </span>
              <div className="flex flex-col">
                <span className="text-[12.5px] font-black text-foreground">
                  {language === 'gu' ? 'આજનું ઈ-પેપર વાંચો' : 'Read today\'s E-paper'}
                </span>
                <span className="text-[10px] text-muted-foreground font-bold mt-0.5">
                  {language === 'gu' ? '૧૪ જૂન ૨૦૨૫ · PDF' : '14 June 2025 · PDF'}
                </span>
              </div>
            </div>
            <span className="text-[#B3121B] font-extrabold text-[15px] pr-1">→</span>
          </div>

          {/* Recharge Plus Ad Widget */}
          <div className="flex flex-col min-w-0">
            <div className="bg-slate-100/95 border border-slate-200 border-b-0 text-[10px] text-slate-500 font-black py-1.5 text-center uppercase tracking-widest rounded-t-sm">
              {language === 'gu' ? 'જાહેરાત' : 'ADVERTISEMENT'}
            </div>
            <div className="w-full rounded-b-sm bg-gradient-to-br from-[#5D3FD3] to-[#4A2CA8] text-white p-6 flex flex-col items-center justify-center relative overflow-hidden border border-slate-200 text-center" style={{ minHeight: 180 }}>
              <h4 className="text-[20px] font-black tracking-tight select-none">
                {language === 'gu' ? 'રિચાર્જ પ્લસ' : 'Recharge Plus'}
              </h4>
              <p className="text-[12px] text-white/90 font-bold mt-1.5 leading-snug">
                {language === 'gu' ? 'અનલિમિટેડ ડેટા + કોલિંગ ફક્ત ₹૧૯૯/મહિને' : 'Unlimited data + calling only ₹199/month'}
              </p>
              <button
                type="button"
                className="mt-4 bg-white text-[#5D3FD3] font-black text-[12.5px] px-6 py-2.5 rounded-full shadow-sm hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer"
              >
                {language === 'gu' ? 'રિચાર્જ કરો ›' : 'Recharge Now ›'}
              </button>
            </div>
          </div>

        </div>

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
  return ['#ચૂંટણી ૨૦૨૬', '#વરસાદ', '#સોના-ચાંદી', '#ક્રિકેટ', '#મેટ્રો', '#સેમિકન્ડક્ટર', '#ડાયમંડ ઉદ્યોગ', '#ટ્રાફિક'];
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
          <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5" />{formatViews(article.views)}</span>
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
            <Eye className="h-3 w-3" />
            {formatViews(article.views)}
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
            <Eye className="h-2.5 w-2.5" />
            {formatViews(article.views)}
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
            <div className="rounded-2xl border border-border/80 bg-white/95 p-3 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-20 rounded bg-muted" />
                  <div className="h-3 w-16 rounded bg-muted" />
                </div>
                <div className="h-8 w-12 rounded bg-muted" />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="h-8 rounded-xl bg-slate-50" />
                <div className="h-8 rounded-xl bg-slate-50" />
                <div className="h-8 rounded-xl bg-slate-50" />
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
      titleGu: 'ગુજરાત ચૂંટણી ૨૦૨૭ નજીક! જિલ્લાઓમાં તૈયારીઓ તેજ, સત્તાધારી પક્ષ સક્રિય',
      excerptGu: 'આગામી વિધાનસભા ચૂંટણીને ધ્યાનમાં રાખી તમામ મુખ્ય પક્ષોએ સંગઠનાત્મક ફેરફારો શરૂ કર્યા છે.',
      relativeTimeGu: '૧ કલાક પહેલાં',
      views: 71000
    }
  },
  {
    colId: 'pol-col-2',
    featured: {
      id: 'pol-feat-2',
      slug: 'aap-ground-network-expansion-gujarat-502',
      image: '/assets/demo/1.jpg',
      categoryGu: 'AAP',
      titleGu: 'AAPનો મોટો દાવો! ગ્રામ્ય ગુજરાતમાં ભૂ-સ્તરીય નેટવર્ક વિસ્તાર્યું'
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
        titleGu: 'સૈન્ય તાલીમમાં મોટી ગેરરીતિ! ૧૦૦થી વધુ પ્રમોશન રદ કરાયા'
      },
      {
        id: 'pol-sub-2-3',
        slug: 'congress-unveils-strategy-2027-election-505',
        titleGu: 'કોંગ્રેસે ખોલ્યા પત્તા! ૨૦૨૭ ચૂંટણી ઝુંબેશ વ્યુહ જાહેર કર્યો'
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
      titleGu: 'વિધાનસભા ચોમાસુ સત્રમાં હોબાળો! વિપક્ષે બેરોજગારી મુદ્દે સ્થગન પ્રસ્તાવ આપ્યો'
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
    relativeTimeGu: '૨ કલાક પહેલાં',
    views: 74000
  },
  {
    id: 'pol-bot-2',
    slug: 'bjp-state-executive-meeting-organization-expansion-512',
    image: '/assets/demo/6.jpg',
    categoryGu: 'ભાજપ',
    titleGu: 'ભાજપ પ્રદેશ કારોબારીની બેઠકમાં સંગઠન વિસ્તરણ પર મોટી ચર્ચા',
    relativeTimeGu: '૩ કલાક પહેલાં',
    views: 78000
  },
  {
    id: 'pol-bot-3',
    slug: 'police-recruitment-10000-posts-513',
    image: '/assets/demo/2.jpg',
    categoryGu: 'ગૃહ વિભાગ',
    titleGu: 'યુવાનો માટે મોટી તક! પોલીસ ભરતીમાં ૧૦,૦૦૦ જગ્યાઓ ટૂંક સમયમાં ભરાશે',
    relativeTimeGu: '૧૨ કલાક પહેલાં',
    views: 33000
  },
  {
    id: 'pol-bot-4',
    slug: 'municipal-corporation-election-ward-delimitation-514',
    image: '/assets/demo/3.jpg',
    categoryGu: 'સ્થાનિક સ્વરાજ્ય',
    titleGu: 'મહાનગરપાલિકા ચૂંટણી નજીક! વોર્ડ સીમાંકનની પ્રક્રિયા શરૂ',
    relativeTimeGu: '૧૩ કલાક પહેલાં',
    views: 46000
  },
  {
    id: 'pol-bot-5',
    slug: 'alliance-possibility-before-next-election-515',
    image: '/assets/demo/7.jpg',
    categoryGu: 'ગઠબંધન',
    titleGu: 'આગામી ચૂંટણી પહેલાં મોટી હલચલ! નાના પક્ષો વચ્ચે ગઠબંધનની શક્યતાઓ તપાસાઈ રહી છે',
    relativeTimeGu: '૧૪ કલાક પહેલાં',
    views: 52000
  }
];

/* --- Politics Section ("રાજકારણ" Zone) ----------------------------- */
export function PoliticsSection({ language }: { language: Language }) {
  return (
    <div className="mx-auto max-w-screen-xl px-4 mt-10">
      {/* Section Header */}
      <div className="flex items-center justify-between border-t-[3.5px] border-slate-950 dark:border-slate-800 pt-5 mb-6">
        <span className="bg-[#B3121B] text-white px-5 py-2.5 text-[13.5px] md:text-[14.5px] font-black rounded-lg select-none leading-none tracking-tight">
          {language === 'gu' ? 'રાજકારણ' : language === 'hi' ? 'राजनीति' : 'Politics'}
        </span>
        <Link
          href="/category/politics"
          className="text-[#B3121B] hover:text-red-700 font-extrabold text-[13px] md:text-[14px] hover:underline"
        >
          {language === 'gu' ? 'વધુ →' : 'More →'}
        </Link>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {mockPoliticsColumns.map((col, idx) => (
          <div key={col.colId} className="flex flex-col min-w-0">
            {/* Column 1: Custom structure with excerpt description */}
            {idx === 0 ? (
              <div className="flex flex-col min-w-0">
                <Link
                  href={`/news/${col.featured.slug}`}
                  className="group flex flex-col"
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
                  <h3 className="text-[14px] md:text-[15.5px] font-extrabold leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-3">
                    {col.featured.titleGu}
                  </h3>
                  <p className="text-muted-foreground text-[12.5px] leading-relaxed mt-2.5 line-clamp-3 select-none">
                    {col.featured.excerptGu}
                  </p>
                </Link>
                <div className="flex items-center gap-1.5 mt-3 text-[11px] text-muted-foreground font-semibold">
                  <span>{col.featured.relativeTimeGu}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-muted-foreground/70" />
                    {language === 'gu' ? toGuLocal(formatViews(col.featured.views || 0)) : formatViews(col.featured.views || 0)}
                  </span>
                </div>
              </div>
            ) : (
              // Columns 2 & 3: Standard structure with list items
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
                  <h3 className="text-[14px] md:text-[15.5px] font-extrabold leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-3">
                    {col.featured.titleGu}
                  </h3>
                </Link>

                {/* Sub-articles list (Text only) with separating top border */}
                <div className="flex flex-col divide-y divide-border/40 border-t border-border/40 mt-0">
                  {col.subs?.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/news/${sub.slug}`}
                      className="group py-2.5 block"
                    >
                      <h4 className="text-[12px] md:text-[12.5px] font-extrabold leading-snug line-clamp-3 text-foreground group-hover:text-[#B3121B] transition-colors">
                        {sub.titleGu}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
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
              <span>{card.relativeTimeGu}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5 text-muted-foreground/70" />
                {language === 'gu' ? toGuLocal(formatViews(card.views)) : formatViews(card.views)}
              </span>
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
    titleGu: 'સોશિયલ મીડિયા પર ફરતો મેસેજ: "કાલથી પેટ્રોલ ₹૫૦ થશે" – જાણો હકીકત'
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
      <div className="flex items-center justify-between border-t-[3.5px] border-slate-950 dark:border-slate-800 pt-5 mb-6">
        <span className="bg-[#B3121B] text-white px-5 py-2.5 text-[13.5px] md:text-[14.5px] font-black rounded-lg select-none leading-none tracking-tight">
          {language === 'gu' ? 'ફેક્ટ ચેક' : language === 'hi' ? 'तथ्य जांच' : 'Fact Check'}
        </span>
        <Link
          href="/category/fact-check"
          className="text-[#B3121B] hover:text-red-700 font-extrabold text-[13px] md:text-[14px] hover:underline"
        >
          {language === 'gu' ? 'વધુ →' : 'More →'}
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
            <span>{language === 'gu' ? '૧ કલાક પહેલાં' : '1 hour ago'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-muted-foreground/70" />
              {language === 'gu' ? toGuLocal(formatViews(12000)) : formatViews(12000)}
            </span>
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
                  <span className={`flex items-center gap-1 text-[11px] font-black select-none leading-none uppercase ${
                    item.status === 'true'
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
      relativeTimeGu: '૧ કલાક પહેલાં',
      views: 74000
    },
    subs: [
      {
        id: 'nat-sub-1-1',
        slug: 'gdp-growth-exceeds-estimate-532',
        image: '/assets/demo/7.jpg',
        titleGu: 'ખુશખબર! GDP વૃદ્ધિ દર અંદાજ કરતાં વધુ નોંધાયો',
        relativeTimeGu: '૨ કલાક પહેલાં',
        views: 78000
      },
      {
        id: 'nat-sub-1-2',
        slug: 'two-new-vande-bharat-trains-flagged-off-533',
        image: '/assets/demo/8.jpg',
        titleGu: 'બે નવી વંદે ભારત ટ્રેનોને લીલી ઝંડી, જાણો રૂટ',
        relativeTimeGu: '૩ કલાક પહેલાં',
        views: 81000
      },
      {
        id: 'nat-sub-1-3',
        slug: 'central-government-announcement-millions-benefit-534',
        image: '/assets/demo/4.jpg',
        titleGu: 'કેન્દ્ર સરકારની મોટી જાહેરાત! નવી યોજનાથી કરોડો લોકોને લાભ',
        relativeTimeGu: '૪ કલાક પહેલાં',
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
      relativeTimeGu: '૫ કલાક પહેલાં',
      views: 110000
    },
    subs: [
      {
        id: 'nat-sub-2-1',
        slug: 'indian-army-indigenous-defense-equipment-536',
        image: '/assets/demo/6.jpg',
        titleGu: 'ભારતીય સેનાને મળી મોટી તાકાત! સ્વદેશી બનાવટનું નવું સંરક્ષણ સાધન સામેલ',
        relativeTimeGu: '૬ કલાક પહેલાં',
        views: 120000
      },
      {
        id: 'nat-sub-2-2',
        slug: 'supreme-court-historic-judgment-impact-millions-537',
        image: '/assets/demo/1.jpg',
        titleGu: 'સુપ્રીમ કોર્ટનો મોટો ચુકાદો! લાખો કેસોને સીધી અસર',
        relativeTimeGu: '૭ કલાક પહેલાં',
        views: 140000,
        isHighlighted: true
      },
      {
        id: 'nat-sub-2-3',
        slug: 'new-health-insurance-scheme-announced-538',
        image: '/assets/demo/8.jpg',
        titleGu: 'કરોડો લોકોને ફાયદો! કેન્દ્રે જાહેર કરી નવી આરોગ્ય વીમા યોજના',
        relativeTimeGu: '૮ કલાક પહેલાં',
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
      relativeTimeGu: '૬ કલાક પહેલાં',
      views: 12000
    },
    subs: [
      {
        id: 'nat-sub-3-1',
        slug: '6g-trials-start-in-india-testing-soon-540',
        image: '/assets/demo/7.jpg',
        titleGu: 'દેશમાં 6G ટ્રાયલ શરૂ! ટૂંક સમયમાં પસંદગીના શહેરોમાં ટેસ્ટિંગ',
        relativeTimeGu: '૧૦ કલાક પહેલાં',
        views: 27000
      },
      {
        id: 'nat-sub-3-2',
        slug: 'women-entrepreneurs-loan-scheme-zero-interest-541',
        image: '/assets/demo/4.jpg',
        titleGu: 'મહિલા ઉદ્યોગ સાહસિકો માટે મોટી રાહત! નવી લોન યોજનામાં 0% વ્યાજ',
        relativeTimeGu: '૧૧ કલાક પહેલાં',
        views: 33000
      },
      {
        id: 'nat-sub-3-3',
        slug: 'new-expressway-network-approved-connect-10-cities-542',
        image: '/assets/demo/8.jpg',
        titleGu: 'દેશના ૧૦ મોટા શહેરોને જોડતો નવો એક્સપ્રેસવે નેટવર્ક મંજૂર!',
        relativeTimeGu: '૧૨ કલાક પહેલાં',
        views: 46000
      }
    ]
  }
];

/* --- National Section ("દેશ" Zone) ----------------------------- */
export function NationalSection({ language }: { language: Language }) {
  return (
    <div className="mx-auto max-w-screen-xl px-4 mt-10">
      {/* Section Header */}
      <div className="flex items-center justify-between border-t-[3.5px] border-slate-950 dark:border-slate-800 pt-5 mb-6">
        <span className="bg-[#B3121B] text-white px-5 py-2.5 text-[13.5px] md:text-[14.5px] font-black rounded-lg select-none leading-none tracking-tight">
          {language === 'gu' ? 'દેશ' : language === 'hi' ? 'देश' : 'National'}
        </span>
        <Link
          href="/category/national"
          className="text-[#B3121B] hover:text-red-700 font-extrabold text-[13px] md:text-[14px] hover:underline"
        >
          {language === 'gu' ? 'વધુ →' : 'More →'}
        </Link>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {mockNationalColumns.map((col) => (
          <div key={col.colId} className="flex flex-col min-w-0">
            {/* Featured Article Card */}
            <Link
              href={`/news/${col.featured.slug}`}
              className="group flex flex-col mb-4"
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
              <h3 className="text-[14px] md:text-[15.5px] font-extrabold leading-snug text-foreground group-hover:text-[#B3121B] transition-colors line-clamp-3">
                {col.featured.titleGu}
              </h3>
            </Link>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-semibold mb-4 pb-2 border-b border-border/40">
              <span>{col.featured.relativeTimeGu}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5 text-muted-foreground/70" />
                {language === 'gu' ? toGuLocal(formatViews(col.featured.views)) : formatViews(col.featured.views)}
              </span>
            </div>

            {/* List of 3 sub items with left image and right title */}
            <div className="flex flex-col gap-3.5">
              {col.subs.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/news/${sub.slug}`}
                  className="group flex gap-3 hover:bg-muted/10 transition-colors p-1"
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
                    <h4 className={`text-[12.5px] font-extrabold leading-snug line-clamp-2 transition-colors ${
                      sub.isHighlighted
                        ? 'text-red-600'
                        : 'text-foreground group-hover:text-[#B3121B]'
                    }`}>
                      {sub.titleGu}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground font-semibold">
                      <span>{sub.relativeTimeGu}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground/60" />
                        {language === 'gu' ? toGuLocal(formatViews(sub.views)) : formatViews(sub.views)}
                      </span>
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
    relativeTimeGu: '૩ કલાક પહેલાં',
    views: 74000
  },
  {
    id: 'w-card-2',
    slug: 'usa-indian-community-huge-cultural-event-553',
    image: '/assets/demo/3.jpg',
    categoryGu: 'અમેરિકા',
    titleGu: 'અમેરિકામાં ભારતીય સમુદાયનું વિશાળ સાંસ્કૃતિક આયોજન, જુઓ ઝલક',
    relativeTimeGu: '૪ કલાક પહેલાં',
    views: 78000
  },
  {
    id: 'w-card-3',
    slug: 'asian-countries-new-economic-partnership-announced-554',
    image: '/assets/demo/2.jpg',
    categoryGu: 'એશિયા',
    titleGu: 'એશિયાઈ દેશો વચ્ચે નવી આર્થિક ભાગીદારીની મોટી જાહેરાત',
    relativeTimeGu: '૫ કલાક પહેલાં',
    views: 81000
  },
  {
    id: 'w-card-4',
    slug: 'gulf-countries-indian-workers-welfare-scheme-555',
    image: '/assets/demo/7.jpg',
    categoryGu: 'મધ્ય-પૂર્વ',
    titleGu: 'ગલ્ફ દેશોમાં ભારતીય શ્રમિકો માટે ખુશખબર! નવી કલ્યાણ યોજના જાહેર',
    relativeTimeGu: '૬ કલાક પહેલાં',
    views: 90000
  }
];

/* --- World Section ("વિશ્વ" Zone) ----------------------------- */
export function WorldSection({ language }: { language: Language }) {
  return (
    <div className="mx-auto max-w-screen-xl px-4 mt-10">
      {/* Section Header */}
      <div className="flex items-center justify-between border-t-[3.5px] border-slate-950 dark:border-slate-800 pt-5 mb-6">
        <span className="bg-[#B3121B] text-white px-5 py-2.5 text-[13.5px] md:text-[14.5px] font-black rounded-lg select-none leading-none tracking-tight">
          {language === 'gu' ? 'વિશ્વ' : language === 'hi' ? 'विश्व' : 'World'}
        </span>
        <Link
          href="/category/world"
          className="text-[#B3121B] hover:text-red-700 font-extrabold text-[13px] md:text-[14px] hover:underline"
        >
          {language === 'gu' ? 'વધુ →' : 'More →'}
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
                  <span>{card.relativeTimeGu}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-muted-foreground/70" />
                    {language === 'gu' ? toGuLocal(formatViews(card.views)) : formatViews(card.views)}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Widgets */}
        <div className="flex flex-col gap-6">
          
          {/* Green Dream Home Ad */}
          <div className="w-full rounded-sm bg-[#0E8044] text-white p-6 flex flex-col items-center justify-center relative overflow-hidden border border-border/10 shadow-md text-center">
            {/* Small Ad Label at top */}
            <span className="absolute top-2.5 left-3 text-[9px] text-white/50 font-black tracking-wider uppercase select-none">
              {language === 'gu' ? 'જાહેરાત' : 'Advertisement'}
            </span>
            <h4 className="text-[20px] font-black tracking-tight select-none mt-2">
              {language === 'gu' ? 'ડ્રીમ હોમ્સ' : 'Dream Homes'}
            </h4>
            <p className="text-[12px] text-white/95 font-bold mt-2 leading-snug">
              {language === 'gu' ? 'તમારું સપનાનું ઘર — 0% પ્રોસેસિંગ ફી સાથે' : 'Your dream home — with 0% processing fee'}
            </p>
            <button
              type="button"
              className="mt-4.5 bg-white text-[#0E8044] font-black text-[12px] px-5 py-2.5 rounded-full shadow-sm hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer"
            >
              {language === 'gu' ? 'વધુ જાણો ›' : 'Learn More ›'}
            </button>
          </div>

          {/* Foreign Currency Widget */}
          <div>
            <div className="flex items-center gap-1.5 pb-1 mb-2.5 select-none border-b border-border/80 pb-2">
              <span className="text-[#B3121B] font-extrabold text-[14px] md:text-[15px]">
                {language === 'gu' ? '• વિદેશી હૂંડિયામણ' : '• Foreign Exchange'}
              </span>
            </div>
            <div className="border border-border/80 rounded-sm bg-card divide-y divide-border/60 shadow-sm">
              {/* USD */}
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-green-500/10 text-green-600 font-extrabold text-[15px] select-none">
                    $
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-black text-foreground">US ડોલર</span>
                    <span className="text-[9.5px] text-muted-foreground font-semibold uppercase leading-none mt-0.5">USD/INR</span>
                  </div>
                </div>
                <div className="flex items-center gap-4.5">
                  <span className="text-[13.5px] font-black text-foreground">₹૮૩.૯૨</span>
                  <span className="text-green-600 text-[11px] font-black tracking-tight select-none">▲ ૦.૧૨</span>
                </div>
              </div>

              {/* EUR */}
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 font-extrabold text-[15px] select-none">
                    €
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-black text-foreground">યુરો</span>
                    <span className="text-[9.5px] text-muted-foreground font-semibold uppercase leading-none mt-0.5">EUR/INR</span>
                  </div>
                </div>
                <div className="flex items-center gap-4.5">
                  <span className="text-[13.5px] font-black text-foreground">₹૯૦.૪૫</span>
                  <span className="text-red-600 text-[11px] font-black tracking-tight select-none">▼ ૦.૨૦</span>
                </div>
              </div>

              {/* GBP */}
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 font-extrabold text-[15px] select-none">
                    £
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-black text-foreground">બ્રિટિશ પાઉન્ડ</span>
                    <span className="text-[9.5px] text-muted-foreground font-semibold uppercase leading-none mt-0.5">GBP/INR</span>
                  </div>
                </div>
                <div className="flex items-center gap-4.5">
                  <span className="text-[13.5px] font-black text-foreground">₹૧૦૬.૭૮</span>
                  <span className="text-muted-foreground text-[10.5px] font-extrabold tracking-tight select-none">— સ્થિર</span>
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
    <div className="mx-auto max-w-screen-xl px-4 mt-8">
      {/* Redesigned Card Wrapper */}
      <div className="border border-border/10 rounded-2xl bg-card shadow-md overflow-hidden bg-gradient-to-br from-card to-card/90">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/10 bg-muted/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#e02020] text-white text-[12.5px] font-black px-3 py-1 rounded-sm select-none">
                {language === 'gu' ? 'લાઈવ સેન્ટર' : 'Live Center'}
              </span>
            </div>
            <p className="text-[11.5px] text-muted-foreground font-bold mt-1.5 select-none">
              {language === 'gu'
                ? 'હવામાન · શેરબજાર · રમતગમત — ૨.૫ મિનિટ અપડેટ'
                : 'Weather · Market · Sports — 2.5 min updates'}
            </p>
          </div>
          {/* Live badge */}
          <span className="flex items-center gap-1.5 bg-red-600/10 text-red-600 border border-red-600/20 text-[11px] font-black px-3 py-1 rounded-full select-none shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#e02020] animate-pulse shrink-0" />
            {language === 'gu' ? 'લાઈવ' : 'LIVE'}
          </span>
        </div>

        {/* ── 4-Column Grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border/10">

          {/* ── Column 1: Weather ──────────────────────────────────── */}
          <div className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Sun className="h-4 w-4 text-amber-500" />
                  {language === 'gu' ? 'હવામાન' : 'Weather'}
                </span>
                <span className="text-[#e02020] text-[10.5px] font-extrabold px-1.5 py-0.5 bg-red-50 rounded-sm select-none">+ સ્ટેટ</span>
              </div>

              {/* City rows */}
              {[
                { city: 'અમદાવાદ', state: 'Gujarat', desc: 'વાદળછાઈ', temp: '32', feels: '36', humidity: '68%', wind: '19 km/h', icon: 'cloud' },
                { city: 'વડોદરા',  state: 'Gujarat', desc: 'ગરમ અને ખુલ્લું', temp: '39', feels: '31', humidity: '78%', wind: '19 km/h', icon: 'sun' },
                { city: 'મુંબઈ',  state: 'Maharashtra', desc: 'ઝરમર વરસાદ', temp: '26', feels: '31', humidity: '88%', wind: '16 km/h', icon: 'rain' },
              ].map((w) => (
                <div key={w.city} className="flex items-center justify-between py-3 border-t border-border/10 first:border-t-0 hover:bg-muted/20 px-1.5 rounded-lg transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0">
                      {w.icon === 'sun' && <Sun className="h-6 w-6 text-amber-500 animate-spin-slow" />}
                      {w.icon === 'cloud' && <Cloud className="h-6 w-6 text-slate-400" />}
                      {w.icon === 'rain' && <CloudRain className="h-6 w-6 text-blue-400" />}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-extrabold text-foreground leading-tight">{w.city}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">{w.desc}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="text-[20px] font-black text-foreground leading-none">{w.temp}°</span>
                    <div className="text-[9px] text-muted-foreground font-semibold">Feels {w.feels}°</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[9px] text-muted-foreground/60 font-semibold mt-4 border-t border-border/5 pt-2 select-none">
              સ્ત્રોત: OpenMeteo
            </p>
          </div>

          {/* ── Column 2: Stock Market ─────────────────────────────── */}
          <div className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  {language === 'gu' ? 'શેરબજાર' : 'Stock Market'}
                </span>
                <span className="text-muted-foreground text-[10.5px] font-semibold select-none">
                  {language === 'gu' ? 'ભારત ₹ INR' : 'India ₹ INR'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { name: 'Nifty 50',   exchange: 'NSE', price: '₹૨૩,૪૫૬.૨', change: '+૧૮૮.૪ (+0.93%)', up: true },
                  { name: 'BSE Sensex', exchange: 'BSE', price: '₹૮૦,૩૦૯.૧', change: '+૪૨૫.૬ (+0.55%)', up: true },
                  { name: 'Nifty Bank', exchange: 'NSE', price: '₹૪૯,૬૪૦.૮', change: '-૧૨૪.૧ (-0.23%)', up: false },
                ].map((s) => (
                  <div key={s.name} className="p-3 rounded-xl border border-border/10 bg-muted/20 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-foreground leading-tight">{s.name}</span>
                        <span className="text-[9px] text-muted-foreground font-bold uppercase mt-0.5 tracking-wider">{s.exchange}</span>
                      </div>
                      <span className="text-[13.5px] font-black text-foreground">{s.price}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {s.up ? (
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                      )}
                      <span className={`text-[11px] font-extrabold ${s.up ? 'text-emerald-600' : 'text-red-600'}`}>
                        {s.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[9px] text-muted-foreground/60 font-semibold mt-4 border-t border-border/5 pt-2 select-none">
              સ્ત્રોત: Yahoo Finance
            </p>
          </div>

          {/* ── Column 3: Cricket ─────────────────────────────────── */}
          <div className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-emerald-500 animate-bounce-slow" />
                  {language === 'gu' ? 'ક્રિકેટ' : 'Cricket'}
                </span>
                <span className="text-[#e02020] text-[10px] font-black bg-red-50 px-1.5 py-0.5 rounded-sm select-none animate-pulse">+ ચાલુ</span>
              </div>

              {/* Match 1: In Progress */}
              <div className="p-3 rounded-xl border border-border/10 bg-muted/20 mb-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12.5px] font-black text-foreground">India vs England</span>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm select-none">LIVE</span>
                </div>
                <div className="flex flex-col gap-1.5 mt-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-foreground">India</span>
                    <span className="text-[12px] font-black text-foreground">૧૬૮/૮ (૨૦)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-foreground">England</span>
                    <span className="text-[12px] font-black text-foreground">૧૮૫/૯ (૧૯.૨)</span>
                  </div>
                </div>
              </div>

              {/* Match 2: Ranji */}
              <div className="p-3 rounded-xl border border-border/10 bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] font-black text-foreground">Ranji Trophy</span>
                  <span className="text-[9px] font-bold text-muted-foreground">Day 3</span>
                </div>
                <div className="flex flex-col gap-1.5 mt-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-foreground">Gujarat</span>
                    <span className="text-[12px] font-black text-foreground">૨૮૪/૬</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-foreground">Mumbai</span>
                    <span className="text-[12px] font-black text-foreground">૩૨૨/૧૦</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-muted-foreground/60 font-semibold mt-4 border-t border-border/5 pt-2 select-none">
              સ્ત્રોત: ESPN
            </p>
          </div>

          {/* ── Column 4: Football ───────────────────────────────── */}
          <div className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-[#e02020]" />
                  {language === 'gu' ? 'ફૂટબોલ' : 'Football'}
                </span>
                <span className="text-[#e02020] text-[10px] font-black bg-red-50 px-1.5 py-0.5 rounded-sm select-none animate-pulse">+ ચાલુ</span>
              </div>

              {/* ISL - Live */}
              <div className="p-3 rounded-xl border border-border/10 bg-muted/20 mb-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12.5px] font-black text-foreground">ISL</span>
                  <span className="text-[9px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded-sm select-none animate-pulse">75'</span>
                </div>
                <div className="flex flex-col gap-1.5 mt-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-foreground">Mumbai City FC</span>
                    <span className="text-[13.5px] font-black text-foreground">૨</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-foreground">Mohun Bagan</span>
                    <span className="text-[13.5px] font-black text-foreground">૧</span>
                  </div>
                </div>
              </div>

              {/* EPL - Upcoming */}
              <div className="p-3 rounded-xl border border-border/10 bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12.5px] font-black text-foreground">EPL</span>
                  <span className="text-[9px] font-bold text-muted-foreground">22:00</span>
                </div>
                <div className="flex flex-col gap-1.5 mt-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-foreground">Man City</span>
                    <span className="text-[12.5px] font-black text-muted-foreground">—</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-foreground">Arsenal</span>
                    <span className="text-[12.5px] font-black text-muted-foreground">—</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-muted-foreground/60 font-semibold mt-4 border-t border-border/5 pt-2 select-none">
              સ્ત્રોત: ESPN
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─── Entertainment · Tech · Lifestyle 3-Column Section ─────────────────── */
export function EntertainTechLifeSection({ language }: { language: Language }) {

  type ArticleItem = { img: string; title: string; titleGu: string; age: string; views: string };

  const manoranjan: ArticleItem[] = [
    { img: '/assets/demo/6.jpg',  titleGu: 'નવી ગુજરાતી ફિલ્મે બોક્સ ઓફિસ પર રેકોર્ડ તોડ્યો! જૂઓ કમાણીના આંકડા', title: 'New Gujarati film breaks box-office record! See earnings figures',  age: '૧', views: '૮૧K' },
    { img: '/assets/demo/4.jpg',  titleGu: 'લોકપ્રિય ધારાવાહિકનો નવો સીઝન ટૂંક સમયમાં, ચાહકોમાં ઉત્સુકતા',            title: 'New season of popular serial coming soon, excitement among fans',        age: '૩', views: '૯૦K' },
    { img: '/assets/demo/1.jpg',  titleGu: 'જાણીતા ગાયકનો નવો આલ્બમ રિલીઝ! ચાહકોમાં જબરદસ્ત ઉત્સાહ',             title: 'Famous singer releases new album! Huge excitement among fans',           age: '૪', views: '૧.૧L' },
    { img: '/assets/demo/5.jpg',  titleGu: 'આ વીકેન્ડ OTT પર ધમાકો! રિલીઝ થશે આ પાંચ મોટી ફિલ્મો અને શો', title: 'Weekend OTT blast! These five big movies and shows to release',       age: '૬', views: '૧.૨L' },
  ];

  const technology: ArticleItem[] = [
    { img: '/assets/demo/3.jpg',  titleGu: 'નવો સ્માર્ટફોન ભારતમાં લોન્ચ! કિંમત જાણી ચોંકી જશો',          title: 'New smartphone launched in India! You will be shocked to know the price',         age: '૨', views: '૧.૪L' },
    { img: '/assets/demo/7.jpg',  titleGu: 'ગુજરાતની કંપનીની કમાલ! વિકસાવ્યું નવું AI ટૂલ',           title: 'Gujarat company’s miracle! Developed new AI tool',           age: '૩', views: '૧.૬L' },
    { img: '/assets/demo/5.jpg',  titleGu: 'રાજ્યમાં 5G નેટવર્કનો વ્યાપ ઝડપથી વધ્યો, જુઓ કયા શહેરો કવર', title: '5G network footprint grew rapidly in state, see which cities covered',       age: '૫', views: '૧૨K' },
    { img: '/assets/demo/8.jpg',  titleGu: 'લોકપ્રિય ગેમનું નવું અપડેટ લોન્ચ! ખેલાડીઓમાં જબરદસ્ત ઉત્સાહ',               title: 'Popular game new update launched! Tremendous excitement among players',         age: '૭', views: '૨૭K' },
  ];

  const lifestyle: ArticleItem[] = [
    { img: '/assets/demo/2.jpg',  titleGu: 'ચોમાસામાં આરોગ્ય જાળવવા આટલું જરૂર ધ્યાન રાખો',     title: 'Keep this much in mind to maintain health in monsoon',      age: '૨', views: '૩૩K' },
    { img: '/assets/demo/6.jpg', titleGu: 'ગુજરાતી થાળીની આ ખાસ વાનગીઓ જરૂર અજમાવો', title: 'Must try these special dishes of Gujarati thali',         age: '૪', views: '૪૬K' },
    { img: '/assets/demo/8.jpg', titleGu: 'ચોમાસામાં ફરવા માટે ગુજરાતના આ શ્રેષ્ઠ સ્થળો બેસ્ટ છે',      title: 'These best places in Gujarat are perfect to visit in monsoon',         age: '૫', views: '૫૨K' },
    { img: '/assets/demo/3.jpg', titleGu: 'આ ચોમાસામાં ટ્રેન્ડમાં છે આ ખાસ સ્ટાઈલ! જાણો ટિપ્સ',   title: 'This special style is trending this monsoon! Know tips',          age: '૭', views: '૬૮K' },
  ];

  const col = (
    titleGu: string,
    titleEn: string,
    href: string,
    items: ArticleItem[],
    paddingClass: string
  ) => (
    <div className={`flex flex-col min-w-0 ${paddingClass}`}>
      {/* Column heading */}
      <div className="flex items-center gap-1.5 mb-4 select-none">
        <Link href={href} className="flex items-center gap-1 group/title">
          <h3 className="text-[15px] font-black text-foreground leading-none group-hover:text-red-600 transition-colors">
            {language === 'gu' ? titleGu : titleEn}
          </h3>
          <span className="text-[13px] font-black text-red-600 select-none">
            &gt;
          </span>
        </Link>
      </div>

      {/* Article rows */}
      <div className="flex flex-col">
        {items.map((a, i) => (
          <div key={i} className="group flex gap-3 py-3 border-b border-border/80 last:border-b-0 last:pb-0">
            {/* Thumbnail */}
            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={a.img}
                alt={a.titleGu}
                fill
                sizes="72px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {/* Text */}
            <div className="flex flex-col justify-between min-w-0 flex-1 py-0.5">
              <h4 className="text-[13px] font-black text-foreground leading-snug line-clamp-2 group-hover:text-red-600 transition-colors cursor-pointer">
                {language === 'gu' ? a.titleGu : a.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-1.5 text-[10.5px] text-muted-foreground font-semibold">
                <span>{a.age} કલાક પહેલાં</span>
                <span className="text-muted-foreground/60">•</span>
                <span className="flex items-center gap-1">
                  <svg 
                    className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>{a.views}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mt-12 pt-6 border-t border-border">
      {/* ── Red pill header ─────────────────────────────────────── */}
      <div className="flex items-center gap-0 mb-0">
        <span className="bg-[#B3121B] text-white text-[12.5px] font-black px-4 py-1.5 rounded select-none leading-tight">
          {language === 'gu'
            ? 'મનોરંજન · ટેક · લાઇફસ્ટાઇલ'
            : language === 'hi'
            ? 'मनोरंजन · टेक · लाइफस्टाइल'
            : 'Entertainment · Tech · Lifestyle'}
        </span>
      </div>

      {/* Black underline bar */}
      <div className="h-[3px] w-full bg-black mb-6" />

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-y-0 md:divide-x md:divide-border">
        {col('મનોરંજન',    'Entertainment', '/category/entertainment', manoranjan, 'md:pr-6')}
        {col('ટેકનોલોજી', 'Technology',    '/category/technology',    technology, 'md:px-6')}
        {col('લાઇફસ્ટાઇલ',  'Lifestyle',     '/category/lifestyle',     lifestyle, 'md:pl-6')}
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
    titleGu: 'અમદાવાદ ક્લાવર શો ૨૦૨૫ની અદ્ભૂત ઝલક',
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
];

function PhotoGallerySection({ language }: { language: Language }) {
  return (
    <section className="py-4 bg-background">
      <div className="mx-auto max-w-screen-xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <span className="bg-[#e02020] text-white text-[13px] font-extrabold px-3 py-1 rounded-sm select-none">
            {language === 'gu' ? 'ફોટો ગેલેરી' : 'Photo Gallery'}
          </span>
          <Link
            href="/photos"
            className="text-[#e02020] text-sm font-bold hover:underline flex items-center gap-1"
          >
            {language === 'gu' ? 'બધી ગેલેરી' : 'All Gallery'} →
          </Link>
        </div>
        {/* Underline */}
        <div className="h-[2.5px] w-full bg-black mb-5" />

        {/* 3-column × 2-row grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY_DATA.map((item) => (
            <Link
              key={item.id}
              href="/photos"
              className="group relative block w-full overflow-hidden rounded-xl shadow-sm"
              style={{ aspectRatio: '16/10' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Camera badge + count – top left */}
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/55 text-white text-[11px] font-bold px-2 py-0.5 rounded-sm backdrop-blur-sm">
                <Camera className="h-3 w-3" />
                <span>{item.count} ફોટો</span>
              </div>

              {/* Title at bottom */}
              <div className="absolute bottom-0 inset-x-0 p-3">
                <p className="text-white text-[13px] font-bold leading-snug line-clamp-2 drop-shadow">
                  {language === 'gu' ? item.titleGu : item.title}
                </p>
              </div>
            </Link>
          ))}
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
        <div className="h-[2.5px] w-full bg-black mb-5" />

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
                className={`absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black text-white shadow-sm ${
                  index < 3 ? 'bg-[#e02020]' : 'bg-black/60'
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


