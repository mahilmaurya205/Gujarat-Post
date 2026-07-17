'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, getArticleTitle, ARTICLES } from '@/data';
import { useApp } from '@/components/AppProvider';
import type { Article } from '@/types';

export default function TrendingSection() {
  const { language } = useApp();
  const [trending, setTrending] = useState<Article[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    setTrending(ARTICLES.filter((a) => a.isTrending).slice(0, 10));
  }, []);

  const updateArrows = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 5);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows);
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [trending]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth || 200;
    const scrollAmount = (cardWidth + 16) * (direction === 'left' ? -2 : 2); // Scroll by 2 cards at a time
    el.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!trending.length) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 mt-10 animate-pulse">
        {/* Section Header Skeleton */}
        <div className="flex items-center justify-between border-b-[3.5px] border-slate-950 dark:border-slate-800 pb-3 mb-6">
          <div className="h-9 w-32 rounded-lg bg-muted/60" />
          <div className="h-5 w-24 rounded bg-muted/60" />
        </div>
        {/* Grid Skeleton */}
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-[calc((100%-64px)/5)] shrink-0 rounded-lg border border-border bg-card overflow-hidden">
              <div className="aspect-[4/3] w-full bg-muted/40" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 mt-10 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-[3.5px] border-slate-950 dark:border-slate-800 pb-3 mb-6">
        <span className="bg-[#B3121B] text-white px-5 py-2.5 text-[13.5px] md:text-[14.5px] font-black rounded-lg select-none leading-none tracking-tight">
          {language === 'gu' ? 'ટ્રેન્ડિંગ ન્યૂઝ' : language === 'hi' ? 'ट्रेंडिंग न्यूज' : 'Trending News'}
        </span>
        <Link
          href="/category/trending"
          className="text-[#B3121B] hover:text-red-700 font-extrabold text-[13px] md:text-[14px] hover:underline"
        >
          {language === 'gu' ? 'વધુ ટ્રેન્ડિંગ સમાચાર →' : 'More →'}
        </Link>
      </div>

      {/* Carousel Container */}
      <div className="relative group/carousel">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/70 backdrop-blur-md shadow-lg text-[#B3121B] hover:bg-[#B3121B] hover:border-[#B3121B] transition-all cursor-pointer select-none group/btn"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 stroke-[3.5px] text-[#B3121B] group-hover/btn:text-white transition-colors" />
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-1"
        >
          {trending.slice(0, 10).map((article, index) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-md border border-slate-200 bg-card hover:border-[#B3121B]/40 hover:shadow-sm transition-all snap-start w-[calc((100%-16px)/2)] sm:w-[calc((100%-32px)/3)] md:w-[calc((100%-48px)/4)] lg:w-[calc((100%-64px)/5)] shrink-0"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <Image
                  src={article.image || 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400&q=80'}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400&q=80';
                  }}
                />
                {/* Rank Badge on top of image */}
                <div
                  className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white shadow-md z-10 select-none"
                  style={{ backgroundColor: index < 3 ? '#B3121B' : 'rgba(15, 23, 42, 0.75)' }}
                >
                  {index + 1}
                </div>
              </div>

              {/* Info Text below image */}
              <div className="p-2 flex flex-col justify-between flex-1 min-w-0">
                <h3 className="line-clamp-3 text-[11px] md:text-[11.5px] font-extrabold leading-snug text-foreground group-hover:text-[#B3121B] transition-colors">
                  {getArticleTitle(article, language)}
                </h3>
                <div className="mt-2.5 pt-1.5 border-t border-border/40 flex items-center gap-1 text-[9px] font-bold text-muted-foreground/80">
                  <Clock className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                  <span className="truncate">{formatDate(article.publishedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/70 backdrop-blur-md shadow-lg text-[#B3121B] hover:bg-[#B3121B] hover:border-[#B3121B] transition-all cursor-pointer select-none group/btn"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 stroke-[3.5px] text-[#B3121B] group-hover/btn:text-white transition-colors" />
          </button>
        )}
      </div>
    </div>
  );
}
