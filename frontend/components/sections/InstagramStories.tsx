'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/components/AppProvider';
import { getLocalized } from '@/data';

function ReelsBadgeIcon({ className = "h-4 w-4 text-white" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H9l2 4H8L6 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zM8 17V9.5l7 3.75L8 17z"/>
    </svg>
  );
}

interface StoryItem {
  id: string;
  title: string;
  titleGu: string;
  avatar: string;
  image: string;
  description: string;
  descriptionGu: string;
}

const STORY_ITEMS: StoryItem[] = [
  {
    id: 'story1',
    title: 'Future Tech',
    titleGu: 'ભવિષ્ય ટેકનોલોજી',
    avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/7.jpg',
    description: 'How AI and augmented reality are transforming modern architecture.',
    descriptionGu: 'AI અને ઓગમેન્ટેડ રિયાલિટી કેવી રીતે આધુનિક આર્કિટેક્ચરને બદલી રહ્યા છે.',
  },
  {
    id: 'story2',
    title: 'Healthy Bites',
    titleGu: 'ફૂડ ડાયરી',
    avatar: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/1.jpg',
    description: 'Nutritionist-approved quick meals to boost your energy throughout the day.',
    descriptionGu: 'આખો દિવસ તમારી એનર્જી વધારવા માટે ઝડપી પૌષ્ટિક આહાર રેસિપી.',
  },
  {
    id: 'story3',
    title: 'Ayurvedic Wellness',
    titleGu: 'આયુર્વેદિક ઉપચાર',
    avatar: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/2.jpg',
    description: 'Ancient Ayurvedic herbs for modern healthy living and daily wellness.',
    descriptionGu: 'આધુનિક તંદુરસ્ત જીવન અને દૈનિક સુખાકારી માટે પ્રાચીન આયુર્વેદિક જડીબુટ્ટીઓ.',
  },
  {
    id: 'story4',
    title: 'Celebrity Diary',
    titleGu: 'સ્ટાર ડાયરી',
    avatar: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/6.jpg',
    description: 'Inside look at the most anticipated celebrity events of the season.',
    descriptionGu: 'સિઝનના સૌથી વધુ પ્રખ્યાત સેલિબ્રિટી કાર્યક્રમોની અંદરની એક ઝલક.',
  },
  {
    id: 'story5',
    title: 'Fashion Trends',
    titleGu: 'ફેશન હબ',
    avatar: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/4.jpg',
    description: 'Discover the trending jacket styles and color palettes for this winter.',
    descriptionGu: 'આ શિયાળા માટે ટ્રેન્ડિંગ જેકેટ શૈલીઓ અને કલર કોમ્બિનેશન શોધો.',
  },
  {
    id: 'story6',
    title: 'Smile & Care',
    titleGu: 'સ્મિત કલાજી',
    avatar: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/3.jpg',
    description: 'Simple dental hygiene habits to keep your smile bright and healthy.',
    descriptionGu: 'તમારા સ્મિતને તેજસ્વી અને સ્વસ્થ રાખવા માટે ડેન્ટલ હાઇજિન ટિપ્સ.',
  },
  {
    id: 'story7',
    title: 'Fact Check',
    titleGu: 'ફેક્ટ ચેક',
    avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/8.jpg',
    description: 'Verifying trending claims and statements to reveal the truth.',
    descriptionGu: 'સત્ય જાહેર કરવા માટે ટ્રેન્ડિંગ દાવાઓ અને નિવેદનોની ચકાસણી કરવી.',
  },
  {
    id: 'story8',
    title: 'Fact Check',
    titleGu: 'ફેક્ટ ચેક',
    avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/8.jpg',
    description: 'Verifying trending claims and statements to reveal the truth.',
    descriptionGu: 'સત્ય જાહેર કરવા માટે ટ્રેન્ડિંગ દાવાઓ અને નિવેદનોની ચકાસણી કરવી.',
  },
  {
    id: 'story9',
    title: 'Fact Check',
    titleGu: 'ફેક્ટ ચેક',
    avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/8.jpg',
    description: 'Verifying trending claims and statements to reveal the truth.',
    descriptionGu: 'સત્ય જાહેર કરવા માટે ટ્રેન્ડિંગ દાવાઓ અને નિવેદનોની ચકાસણી કરવી.',
  },
  {
    id: 'story10',
    title: 'Fact Check',
    titleGu: 'ફેક્ટ ચેક',
    avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/8.jpg',
    description: 'Verifying trending claims and statements to reveal the truth.',
    descriptionGu: 'સત્ય જાહેર કરવા માટે ટ્રેન્ડિંગ દાવાઓ અને નિવેદનોની ચકાસણી કરવી.',
  },{
    id: 'story11',
    title: 'Fact Check',
    titleGu: 'ફેક્ટ ચેક',
    avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/8.jpg',
    description: 'Verifying trending claims and statements to reveal the truth.',
    descriptionGu: 'સત્ય જાહેર કરવા માટે ટ્રેન્ડિંગ દાવાઓ અને નિવેદનોની ચકાસણી કરવી.',
  },{
    id: 'story12',
    title: 'Fact Check',
    titleGu: 'ફેક્ટ ચેક',
    avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/8.jpg',
    description: 'Verifying trending claims and statements to reveal the truth.',
    descriptionGu: 'સત્ય જાહેર કરવા માટે ટ્રેન્ડિંગ દાવાઓ અને નિવેદનોની ચકાસણી કરવી.',
  }
];

const AUTO_PLAY_DURATION = 5000;

export default function InstagramStories() {
  const { language } = useApp();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const isPaused = useRef(false);

  const updateArrows = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 10);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  // Smooth Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el || isPaused.current || activeStoryIndex !== null) return;
      el.scrollLeft += 1;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
        el.scrollLeft = 0;
      }
    }, 25);
    return () => clearInterval(interval);
  }, [activeStoryIndex]);

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
  }, [updateArrows]);

  const handleNext = useCallback(() => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex < STORY_ITEMS.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setProgress(0);
    } else {
      setActiveStoryIndex(null);
    }
  }, [activeStoryIndex]);

  const handlePrev = useCallback(() => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setProgress(0);
    } else {
      setProgress(0);
    }
  }, [activeStoryIndex]);

  useEffect(() => {
    if (activeStoryIndex === null) {
      setProgress(0);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const calculatedProgress = Math.min((elapsed / AUTO_PLAY_DURATION) * 100, 100);

      setProgress(calculatedProgress);

      if (calculatedProgress < 100) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        handleNext();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [activeStoryIndex, handleNext]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const threshold = rect.width * 0.35;

    if (x < threshold) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  return (
    <section className="mx-auto max-w-screen-xl px-4 mt-4 relative overflow-hidden">
      <div className="relative">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b-[3.5px] border-slate-950 dark:border-slate-800 pb-3 mb-6">
          <span className="bg-[#B3121B] text-white px-5 py-2.5 text-[13.5px] md:text-[14.5px] font-black rounded-lg select-none leading-none tracking-tight">
            {language === 'gu' ? 'ઇન્સ્ટાગ્રામ રિલ્સ' : language === 'hi' ? 'इन्स्टाग्राम रील्स' : 'Instagram Reels'}
          </span>
          <Link
            href="/web-stories"
            className="text-[#B3121B] hover:text-red-700 font-extrabold text-[13px] md:text-[14px] hover:underline"
          >
            {language === 'gu' ? 'વધુ ઇન્સ્ટાગ્રામ રિલ્સ →' : 'More →'}
          </Link>
        </div>

        {/* Stories Horizontal Grid Scroll */}
        <div
          className="relative group/slider-wrap"
          onMouseEnter={() => { isPaused.current = true; }}
          onMouseLeave={() => { isPaused.current = false; }}
        >
          {showLeftArrow && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleScroll('left');
              }}
              className="absolute left-4 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/60 transition-all duration-200 shadow-md backdrop-blur-sm cursor-pointer border-0"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
            </button>
          )}

          {showRightArrow && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleScroll('right');
              }}
              className="absolute right-4 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/60 transition-all duration-200 shadow-md backdrop-blur-sm cursor-pointer border-0"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 stroke-[2.5]" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="scrollbar-hide flex gap-4 overflow-x-auto pb-2"
          >
            {STORY_ITEMS.map((story, index) => {
              const displayTitle = language === 'gu' ? story.titleGu : story.title;
              return (
                <div
                  key={story.id}
                  onClick={() => {
                    setActiveStoryIndex(index);
                    setProgress(0);
                  }}
                  className="flex-none w-[140px] sm:w-[165px] cursor-pointer snap-start group"
                >
                  {/* Vertical Story Card Layout matching Image 1 */}
                  <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-slate-900/90 dark:border-slate-800 bg-muted shadow-md transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                    {/* Red Reels Badge Icon at top-left */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#B3121B] text-white shadow-md">
                      <ReelsBadgeIcon className="h-3.5 w-3.5 text-white" />
                    </div>

                    {/* Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={story.image}
                      alt={story.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />

                    {/* Bottom White Container Box */}
                    <div className="absolute bottom-2 inset-x-2 bg-white dark:bg-slate-900 rounded-xl p-2.5 flex items-center justify-between shadow-lg border border-slate-100 dark:border-slate-800 z-10">
                      <div className="flex flex-col min-w-0 flex-1 pr-1">
                        <div className="flex items-center gap-1 mb-0.5">
                          <ReelsBadgeIcon className="h-3 w-3 text-[#B3121B] shrink-0" />
                        </div>
                        <p className="text-[11px] sm:text-[12px] font-black leading-tight text-slate-900 dark:text-white line-clamp-2">
                          {displayTitle}
                        </p>
                      </div>
                      <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#B3121B] text-white shrink-0 ml-1 shadow-sm group-hover:scale-105 transition-transform">
                        <span className="text-[12px] font-black leading-none">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination Indicator Dots */}
        {/* <div className="flex items-center justify-center gap-1.5 mt-5">
          <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span className="h-2 w-6 rounded-full bg-[#B3121B]"></span>
          <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
        </div> */}

        {/* Follow us on Instagram Row */}
        <div className="relative flex items-center justify-center mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-red-200 dark:border-red-950/40" />
          </div>
          <a
            href="https://www.instagram.com/gujaratpostnews"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-2.5 shadow-sm text-slate-900 dark:text-white font-black text-[13px] md:text-[14px] hover:border-[#B3121B] hover:text-[#B3121B] transition-all select-none"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-[#B3121B] stroke-[2]" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>{language === 'gu' ? 'અમને ઇન્સ્ટાગ્રામ પર ફોલો કરો' : language === 'hi' ? 'हमें इंस्टाग्राम पर फॉलो करें' : 'Follow us on Instagram'}</span>
          </a>
        </div>
      </div>

      {/* Full-Screen Web Story Slideshow Viewer Modal */}
      {activeStoryIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setActiveStoryIndex(null)} />

          <div className="relative w-full max-w-[360px] aspect-[9/16] max-h-[85vh] rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10 z-10 animate-in zoom-in-95 duration-200">
            {/* Story Image Container */}
            <div
              className="relative w-full h-full cursor-pointer"
              onClick={handleModalClick}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={STORY_ITEMS[activeStoryIndex].image}
                alt={STORY_ITEMS[activeStoryIndex].title}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ height: '100%', width: '100%', objectFit: 'cover' }}
              />

              {/* Progress Segment indicators at the top */}
              <div className="absolute top-3.5 inset-x-3.5 z-30 flex gap-1.5">
                {STORY_ITEMS.map((_, idx) => (
                  <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-75 ease-linear"
                      style={{
                        width:
                          idx < activeStoryIndex
                            ? '100%'
                            : idx === activeStoryIndex
                              ? `${progress}%`
                              : '0%'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Story User details header */}
              <div className="absolute top-7 inset-x-3.5 z-30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full border border-white/40 overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={STORY_ITEMS[activeStoryIndex].avatar}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-black drop-shadow-md">
                      {language === 'gu' ? STORY_ITEMS[activeStoryIndex].titleGu : STORY_ITEMS[activeStoryIndex].title}
                    </span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveStoryIndex(null);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Description box at the bottom */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-5 pt-10 z-20">
                <p className="text-white text-xs sm:text-sm font-bold leading-normal text-center drop-shadow">
                  {language === 'gu' ? STORY_ITEMS[activeStoryIndex].descriptionGu : STORY_ITEMS[activeStoryIndex].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
