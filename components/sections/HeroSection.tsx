'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Flame, Eye, Play, ChevronRight, ChevronLeft } from 'lucide-react';
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
import type { Article, Language } from '@/types';

const CHANNEL_URL = 'https://www.youtube.com/@Gujaratpostnews';
const CHANNEL_ID = 'UCqQ8YbFSZ4j8J4iVJOHurTw';
const LATEST_VIDEO_ID = 'A_5vL-ngK4M';

const HOME_IMAGE_FALLBACKS = [
  'https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?w=800&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80',
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80',
  'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80',
  'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80',
  'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
  'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=800&q=80',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
  'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=800&q=80',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
  'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80',
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
  'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
  'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
];

function makeHomeImagesUnique<T extends Article>(sections: T[][]): T[][] {
  const used = new Set<string>();
  let fallbackIndex = 0;

  return sections.map((section) =>
    section.map((article) => {
      let image = article.image;

      if (used.has(image)) {
        for (let tries = 0; tries < HOME_IMAGE_FALLBACKS.length; tries++) {
          const candidateIndex = (fallbackIndex + tries) % HOME_IMAGE_FALLBACKS.length;
          const candidate = HOME_IMAGE_FALLBACKS[candidateIndex];

          if (!used.has(candidate)) {
            image = candidate;
            fallbackIndex = (candidateIndex + 1) % HOME_IMAGE_FALLBACKS.length;
            break;
          }
        }
      }

      used.add(image);
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

  const featured = getFeaturedArticles();
// Left column: "મુખ્ય સમાચાર" — 8 compact list items
  const leftItems = featured.slice(0, 3);
  // Center top: "ટૉપ સ્ટોરી" — 4×3 grid = 12 cards
  const topStories = featured.slice(8, 16);
  // Center bottom row: 4 more cards
  const centerBot = featured.slice(20, 24);
  // Category rows below
  const gujaratArt = getArticlesByCategory('Gujarat').slice(0, 16);
  const crimeArt = getArticlesByCategory('Crime').slice(0, 4);
  const nationalArt = getArticlesByCategory('Politics').slice(0, 4);
  const worldArt = getArticlesByCategory('World').slice(0, 4);
  const businessArt = getArticlesByCategory('Business').slice(0, 4);
  const sportsArt = getArticlesByCategory('Sports').slice(0, 5);
  // Videos
  const videos = VIDEOS.filter(v => v.type === 'video').slice(0, 5);
  const extraRightArticles = featured.slice(24, 28);
  const trendingArt = getTrendingArticles().slice(0, 10);
  const [
    uniqueLeftItems,
    uniqueTopStories,
    ,
    uniqueGujaratArt,
    uniqueCrimeArt,
    uniqueNationalArt,
    uniqueWorldArt,
    uniqueBusinessArt,
    uniqueSportsArt,
    uniqueExtraRightArticles,
    uniqueTrendingArt,
  ] = makeHomeImagesUnique([
    leftItems,
    topStories,
    centerBot,
    gujaratArt,
    crimeArt,
    nationalArt,
    worldArt,
    businessArt,
    sportsArt,
    extraRightArticles,
    trendingArt,
  ]);

  if (!featured.length) return null;

  return (
    <div className="mx-auto max-w-screen-xl px-2 py-0.5 space-y-1">

      {/* ── ROW 1: 3-column main section ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-1 lg:grid-cols-[minmax(0,1fr)_280px] items-start">
        <div className="min-w-0">
          <div className="grid grid-cols-1 gap-1 lg:grid-cols-[260px_minmax(0,1fr)] items-stretch">

            {/* LEFT: Mukhya Samachar list */}
            <div className="hidden lg:block">
              <SectionLabel
                title="Top News"
                titleGu="મુખ્ય સમાચાર"
                language={language}
              />
              <div className="flex flex-col divide-y divide-border">
                {uniqueLeftItems.map((art) => (
                  <LeftListItem key={art.id} article={art} language={language} />
                ))}
              </div>
            </div>

            {/* CENTER: Top Stories */}
            <div className="min-w-0">
              {/* Top Stories header */}
              <div>
                  <div className="flex items-center justify-between mb-1.5">
                  <SectionLabel title="Top Stories" titleGu="ટૉપ સ્ટોરી" language={language} />
                  <Link href="/category/gujarat" className="flex items-center gap-0.5 text-[11px] font-bold text-accent hover:underline">
                    {language === 'gu' ? 'બધા જુઓ' : 'View all'} <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Row 1 — 4 equal cards */}
                <div className="grid grid-cols-4 gap-1.5">
                  {uniqueTopStories.slice(0, 4).map((art) => (
                    <StoryCard key={art.id} article={art} language={language} />
                  ))}
                </div>

                {/* Row 2 — 4 equal cards */}
                <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                  {uniqueTopStories.slice(4, 8).map((art) => (
                    <StoryCard key={art.id} article={art} language={language} />
                  ))}
                </div>

                {/* <div className="grid grid-cols-4 gap-2 mt-2">
                  {topStories.slice(8, 12).map((art) => (
                    <StoryCard key={art.id} article={art} language={language} />
                  ))}
                </div> */}
              </div>
            </div>

          </div>

          <div className="min-w-0 mt-2">
            <TrendingBar articles={uniqueTrendingArt} language={language} />
          </div>

          <div className="min-w-0">
            {/* ── Rajya Samachar (fills remaining white space) */}
            <CategoryRow
              title="State News" titleGu="રાજ્ય સમાચાર"
              href="/category/gujarat"
              articles={uniqueGujaratArt} language={language}
            />
          </div>

          {/* RIGHT: Live TV + Weather + EPaper */}
        </div>

        <div className="flex flex-col gap-0.5">
          <LiveTVWidget language={language} videoMode={videoMode} setVideoMode={setVideoMode} />
          <WeatherWidget language={language} />
          <EPaperWidget language={language} />
          <div className="grid gap-0.5">
            {uniqueExtraRightArticles.map((art) => (
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

      {/* ── ROW 2: 4-column category columns (National, World, Crime, Business) */}
      <div className="grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-4">
        <CategoryColumn title="National" titleGu="રાષ્ટ્રીય" href="/category/politics" articles={uniqueNationalArt} language={language} showExcerpt={true} />
        <CategoryColumn title="World" titleGu="વિશ્વ" href="/category/world" articles={uniqueWorldArt} language={language} />
        <CategoryColumn title="Crime" titleGu="અપરાધ" href="/category/crime" articles={uniqueCrimeArt} language={language} />
        <CategoryColumn title="Business" titleGu="બિઝનેસ" href="/category/business" articles={uniqueBusinessArt} language={language} />
      </div>

      <SportsShowcase articles={uniqueSportsArt} language={language} />

      {/* ── ROW 3: Videos strip ───────────────────────────────────────────── */}
      <VideoStrip videos={videos} language={language} />
    </div>
  );
}

/* --- Trending Bar ----------------------------------------------------------- */
function TrendingBar({ articles, language }: { articles: ReturnType<typeof getTrendingArticles>; language: Language }) {
  const label = language === 'gu' ? 'ટ્રેન્ડિંગ સમાચાર' : 'Trending News';
  const [start, setStart] = useState(0);
  const visible = 5;
  const canPrev = start > 0;
  const canNext = start + visible < articles.length;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-100 bg-gradient-to-r from-red-50 via-white to-slate-50 px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <Flame className="h-[18px] w-[18px] text-accent fill-current" />
          <span className="text-[15px] font-black leading-tight text-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStart((s) => Math.max(0, s - 1))}
            disabled={!canPrev}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-accent hover:text-white hover:border-accent transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setStart((s) => Math.min(articles.length - visible, s + 1))}
            disabled={!canNext}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-accent hover:text-white hover:border-accent transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="grid grid-cols-5 divide-x divide-border">
        {articles.slice(start, start + visible).map((art, idx) => (
          <Link
            key={art.id}
            href={`/news/${art.slug}`}
            className="group flex items-center gap-3 px-3 py-3 hover:bg-muted/60 transition"
          >
            {/* Number */}
            <span className="text-[28px] font-black leading-none text-accent shrink-0 w-6 text-center">
              {start + idx + 1}
            </span>
            {/* Thumbnail */}
            <div className="relative h-[52px] w-[72px] shrink-0 overflow-hidden rounded-lg">
              <Image
                src={art.image}
                alt={art.title}
                fill
                sizes="72px"
                className="object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            {/* Title */}
            <p className="line-clamp-2 text-[12px] font-black leading-snug text-foreground group-hover:text-accent transition-colors">
              {getArticleTitle(art, language)}
            </p>
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

/* --- Left List Item --------------------------------------------------------- */
function LeftListItem({ article, language }: { article: ReturnType<typeof getFeaturedArticles>[0]; language: Language }) {
  const title = getArticleTitle(article, language);
  const cat = getCategoryLabel(article, language);
  const cc = getCategoryColor(article.category);
  return (
    <Link href={`/news/${article.slug}`} className="flex min-h-[96px] gap-2 py-2 group hover:bg-muted/50 transition rounded px-1">
  <div className="relative h-[68px] w-[96px] shrink-0 overflow-hidden rounded">
    <Image src={article.image} alt={article.title} fill sizes="96px" className="object-cover group-hover:scale-105 transition duration-300" />
  </div>
  <div className="min-w-0 flex flex-col justify-between">
    <div>
      <span className="cat-badge mb-0.5" style={{ background: cc, fontSize: '0.62rem', padding: '0.08rem 0.42rem' }}>{cat}</span>
      <p className="line-clamp-3 text-[12.5px] font-black leading-snug text-foreground mt-0.5">{title}</p>
    </div>
    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground">
      <Clock className="h-2.5 w-2.5" />{formatTime(article.publishedAt)}
    </span>
  </div>
</Link>
  );
}

/* --- Story Card (exact match — image 2 design) ------------------------------ */
function StoryCard({ article, language }: { article: ReturnType<typeof getFeaturedArticles>[0]; language: Language }) {
  const title = getArticleTitle(article, language);
  const cat = getCategoryLabel(article, language);
  const cc = getCategoryColor(article.category);
  return (
    <Link
      href={`/news/${article.slug}`}
      className="news-card group flex flex-col overflow-hidden rounded-lg border border-border bg-card hover:shadow-md hover:border-accent/30 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative w-full shrink-0 overflow-hidden" style={{ paddingBottom: '38%' }}>
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-400"
        />
        {/* Category badge — top left on image */}
        <span
          className="absolute left-1 top-1 z-10 rounded text-white text-[8px] font-black px-1.5 py-[2px] leading-none"
          style={{ background: cc }}
        >
          {cat}
        </span>
      </div>
      {/* Card body */}
      <div className="flex flex-col p-1">
        <h3 className="line-clamp-2 text-[11px] font-black leading-snug text-foreground group-hover:text-accent transition-colors duration-200">
          {title}
        </h3>
        <div className="mt-0.5 flex items-center justify-between text-[9px] font-semibold text-muted-foreground pt-0.5">
          <span className="flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            {formatTime(article.publishedAt)}
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

/* --- Category Row (4-col horizontal) --------------------------------------- */
function CategoryRow({
  title, titleGu, href, articles, language
}: { title: string; titleGu: string; href: string; articles: ReturnType<typeof getArticlesByCategory>; language: Language }) {
  const display = language === 'en' ? title : titleGu;
  return (
    <div>
      <div className="flex items-center justify-between mb-1 border-b border-border pb-1">
        <span className="section-heading text-[18px] md:text-[20px] font-black leading-tight text-foreground">{display}</span>
        <Link href={href} className="flex items-center gap-0.5 text-[13px] md:text-[14px] font-bold text-accent hover:underline">
          {language === 'gu' ? 'બધા જુઓ' : 'View all'} <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {articles.map((art) => {
          const t = getArticleTitle(art, language);
          const cc = getCategoryColor(art.category);
          return (
            <Link key={art.id} href={`/news/${art.slug}`} className="news-card group flex min-h-[78px] gap-2 rounded-md border border-border bg-card p-1.5 shadow-sm hover:border-accent/40 hover:shadow-md transition">
              <div className="relative h-[66px] w-[88px] shrink-0 overflow-hidden rounded">
                <Image src={art.image} alt={art.title} fill sizes="76px" className="object-cover group-hover:scale-105 transition" />
              </div>
              <div className="min-w-0 flex flex-col justify-between">
                <p className="line-clamp-2 text-[11.5px] font-black leading-snug text-foreground group-hover:text-accent transition-colors">{t}</p>
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
    fetch('/api/live/sports', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data: { cricket?: SportsCricketScore | null; football?: SportsFootballScore[] }) => {
        setCricket(data.cricket ?? null);
        setFootball(data.football ?? []);
      })
      .catch(() => {
        setCricket(null);
        setFootball([]);
      });
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
    fetch('/api/live/weather?cities=Ahmedabad,Vadodara').then(r => r.json())
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
