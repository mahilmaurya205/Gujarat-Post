'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Search, ArrowUp, ArrowDown, Share2, ArrowLeft } from 'lucide-react';
import { ARTICLES, getArticleTitle, getArticleExcerpt, getArticleContent, getCategoryLabel } from '@/data';
import { useApp } from '@/components/AppProvider';

export default function NewsBriefPageClient() {
  const { language } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Filter to get standard articles with content
  const briefArticles = useMemo(() => {
    return ARTICLES.slice(0, 15); // Show top 15 articles as briefs
  }, []);

  const currentArticle = briefArticles[activeIndex];

  const handleNext = () => {
    if (activeIndex < briefArticles.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(0); // wrap around
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      setActiveIndex(briefArticles.length - 1); // wrap around
    }
  };

  const handleShare = async () => {
    if (!currentArticle) return;
    const url = `${window.location.origin}/news/${currentArticle.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: getArticleTitle(currentArticle, language),
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  if (!currentArticle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <p className="text-neutral-500 font-semibold">Loading news briefs...</p>
      </div>
    );
  }

  const title = getArticleTitle(currentArticle, language);
  const category = getCategoryLabel(currentArticle, language);
  const firstParagraph = getArticleContent(currentArticle, language).split('\n\n')[0] || '';

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans select-none overflow-hidden">
      {/* Custom Clean Header */}
      <header className="bg-white border-b border-neutral-200/80 py-3 px-6 flex items-center justify-between w-full shadow-sm shrink-0">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <div className="relative h-9 w-32 md:h-10 md:w-36">
            <Image
              src="/logo.jpg"
              alt="Gujarat Post"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <div className="relative h-6 w-[110px] md:h-7 md:w-[130px]">
            <Image
              src="/rightSide.png"
              alt="NEWS BRIEF"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </header>

      {/* Main Swiper Section */}
      <main className="flex-1 flex items-center justify-center py-6 px-4 relative">
        <div className="relative flex items-center justify-center gap-6 w-full max-w-[560px]">
          {/* Central News Card */}
          <div className="w-full max-w-[410px] bg-white border border-neutral-200/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col p-5 text-left transition-all duration-500 transform hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            {/* Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl mb-4 bg-neutral-100 border border-neutral-100 dark:border-neutral-800">
              <Image
                src={currentArticle.image}
                alt={title}
                fill
                sizes="410px"
                className="object-cover transition-all duration-700"
                priority
              />
            </div>

            {/* Meta Row */}
            <div className="text-xs flex items-center gap-2 mb-2 select-none">
              <span className="font-extrabold text-red-600 tracking-wider uppercase">
                {category}
              </span>
              <span className="text-neutral-300 font-bold">|</span>
              <span className="text-neutral-400 font-bold">
                {language === 'gu' ? '45 મિનિટ પહેલા' : language === 'hi' ? '४५ मिनट पहले' : '45 mins ago'}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-black text-neutral-900 leading-snug mb-3 text-left w-full text-[16.5px] md:text-[18px] line-clamp-3">
              {title}
            </h2>

            {/* Brief content description */}
            <p className="text-sm text-neutral-600 leading-relaxed text-justify w-full flex-1 mb-4 line-clamp-6">
              {firstParagraph}
            </p>

            {/* Disclaimer */}
            <div className="text-[10px] text-neutral-400 font-bold italic mb-4 w-full text-left select-none">
              {language === 'gu'
                ? 'ડિસ્ક્લેમર - આ ન્યૂઝ બ્રીફ AI-જનરેટેડ સમરી છે અને એડિટર દ્વારા રિવ્યૂ કરાયેલ છે.'
                : language === 'hi'
                  ? 'डिस्क्लेमर - यह न्यूज ब्रीफ एआई-जनरेटेड सारांश है और संपादक द्वारा समीक्षा किया गया है।'
                  : 'Disclaimer - Summary is AI-generated. Editor Reviewed.'}
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between w-full border-t border-neutral-100 pt-4 mt-auto select-none">
              <Link
                href={`/news/${currentArticle.slug}`}
                className="border-2 border-red-600 hover:bg-red-600 hover:border-red-600 text-red-600 hover:text-white font-black text-xs px-5 py-2.5 rounded-full transition-all duration-200 active:scale-95"
              >
                {language === 'gu' ? 'વધુ વાંચો' : language === 'hi' ? 'और पढ़ें' : 'Read More'}
              </Link>

              <button
                type="button"
                onClick={handleShare}
                className="relative bg-neutral-800 hover:bg-neutral-900 text-white rounded-full p-2.5 h-10 w-10 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
                aria-label="Share Brief"
              >
                <Share2 className="h-[18px] w-[18px] stroke-[2.5]" />
                {copied && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[11px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>
            </div>

            {/* Center chevron icon */}
            <div className="flex justify-center mt-3 text-neutral-300">
              <ChevronDown className="h-5 w-5 animate-bounce" />
            </div>
          </div>

          {/* Scroll Buttons Next to Card (Right side) */}
          <div className="flex flex-col gap-4 select-none shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              className="bg-black hover:bg-neutral-900 text-white font-bold rounded-full h-11 w-11 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all hover:scale-105 active:scale-95 border border-neutral-200/40"
              aria-label="Previous Brief"
            >
              <ArrowUp className="h-5 w-5 stroke-[3]" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="bg-black hover:bg-neutral-900 text-white font-bold rounded-full h-11 w-11 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all hover:scale-105 active:scale-95"
              aria-label="Next Brief"
            >
              <ArrowDown className="h-5 w-5 stroke-[3]" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
