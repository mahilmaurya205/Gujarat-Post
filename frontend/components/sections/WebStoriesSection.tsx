'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/components/AppProvider';

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
    id: 'webstory1',
    title: 'Future Tech',
    titleGu: 'ભવિષ્ય ટેકનોલોજી',
    avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/7.jpg',
    description: 'How AI and augmented reality are transforming modern architecture.',
    descriptionGu: 'AI અને ઓગમેન્ટેડ રિયાલિટી કેવી રીતે આધુનિક આર્કિટેક્ચરને બદલી રહ્યા છે.',
  },
  {
    id: 'webstory2',
    title: 'Healthy Bites',
    titleGu: 'ફૂડ ડાયરી',
    avatar: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/1.jpg',
    description: 'Nutritionist-approved quick meals to boost your energy throughout the day.',
    descriptionGu: 'આખો દિવસ તમારી એનર્જી વધારવા માટે ઝડપી પૌષ્ટિક આહાર રેસિપી.',
  },
  {
    id: 'webstory3',
    title: 'Ayurvedic Wellness',
    titleGu: 'આયુર્વેદિક ઉપચાર',
    avatar: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/2.jpg',
    description: 'Ancient Ayurvedic herbs for modern healthy living and daily wellness.',
    descriptionGu: 'આધુનિક તંદુરસ્ત જીવન અને દૈનિક સુખાકારી માટે પ્રાચીન આયુર્વેદિક જડીબુટ્ટીઓ.',
  },
  {
    id: 'webstory4',
    title: 'Celebrity Diary',
    titleGu: 'સ્ટાર ડાયરી',
    avatar: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/6.jpg',
    description: 'Inside look at the most anticipated celebrity events of the season.',
    descriptionGu: 'સિઝનના સૌથી વધુ પ્રખ્યાત સેલિબ્રિટી કાર્યક્રમોની અંદરની એક ઝલક.',
  },
  {
    id: 'webstory5',
    title: 'Fashion Trends',
    titleGu: 'ફેશન હબ',
    avatar: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/4.jpg',
    description: 'Discover the trending jacket styles and color palettes for this winter.',
    descriptionGu: 'આ શિયાળા માટે ટ્રેન્ડિંગ જેકેટ શૈલીઓ અને કલર કોમ્બિનેશન શોધો.',
  },
  {
    id: 'webstory6',
    title: 'Smile & Care',
    titleGu: 'સ્મિત કલાજી',
    avatar: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/3.jpg',
    description: 'Simple dental hygiene habits to keep your smile bright and healthy.',
    descriptionGu: 'તમારા સ્મિતને તેજસ્વી અને સ્વસ્થ રાખવા માટે ડેન્ટલ હાઇજિન ટિપ્સ.',
  },
  {
    id: 'webstory7',
    title: 'Fact Check',
    titleGu: 'ફેક્ટ ચેક',
    avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=150&fit=crop&q=80',
    image: '/assets/demo/8.jpg',
    description: 'Verifying trending claims and statements to reveal the truth.',
    descriptionGu: 'સત્ય જાહેર કરવા માટે ટ્રેન્ડિંગ દાવાઓ અને નિવેદનોની ચકાસણી કરવી.',
  }
];

const AUTO_PLAY_DURATION = 5000;

export default function WebStoriesSection() {
  const { language } = useApp();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const updateArrows = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 10);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

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
    <section className="mx-auto max-w-screen-xl px-4 mt-10 relative overflow-hidden select-none">
      <div className="relative">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b-[3.5px] border-slate-950 dark:border-slate-800 pb-3 mb-6">
          <span className="bg-[#B3121B] text-white px-5 py-2.5 text-[13.5px] md:text-[14.5px] font-black rounded-lg select-none leading-none tracking-tight">
            {language === 'gu' ? 'વેબસ્ટોરી' : language === 'hi' ? 'वेब स्टोरीज' : 'Web Stories'}
          </span>
          <Link
            href="/category/webstory"
            className="text-[#B3121B] hover:text-red-700 font-extrabold text-[13px] md:text-[14px] hover:underline"
          >
            {language === 'gu' ? 'વધુ વેબસ્ટોરી →' : 'More →'}
          </Link>
        </div>

        {/* Stories Horizontal Grid Scroll */}
        <div className="relative group/slider-wrap">
          {showLeftArrow && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleScroll('left');
              }}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/70 backdrop-blur-md shadow-lg text-[#B3121B] hover:bg-[#B3121B] hover:border-[#B3121B] transition-all cursor-pointer select-none group/btn"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 stroke-[3.5px] text-[#B3121B] group-hover/btn:text-white transition-colors" />
            </button>
          )}

          {showRightArrow && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleScroll('right');
              }}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/70 backdrop-blur-md shadow-lg text-[#B3121B] hover:bg-[#B3121B] hover:border-[#B3121B] transition-all cursor-pointer select-none group/btn"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 stroke-[3.5px] text-[#B3121B] group-hover/btn:text-white transition-colors" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="scrollbar-none flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
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
                  className="flex-none w-[130px] sm:w-[155px] cursor-pointer snap-start group"
                >
                  {/* Vertical Story Card Layout */}
                  <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-border/10 bg-muted shadow-sm transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-md">
                    {/* Badge at top-left */}
                    <span className="absolute top-3 left-3 bg-[#c36f30]/90 text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wide z-10 select-none">
                      {language === 'gu' ? 'વેબ સ્ટોરી' : 'Web Story'}
                    </span>

                    {/* Image */}
                    <Image
                      src={story.image}
                      alt={displayTitle}
                      fill
                      sizes="(max-width: 640px) 130px, 155px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                    {/* Bottom Title Container */}
                    <div className="absolute bottom-0 inset-x-0 p-3 flex flex-col gap-1.5">
                      {/* Avatar & Title Group */}
                      <div className="flex items-center gap-2">
                        <div className="h-[22px] w-[22px] rounded-full border border-white/60 overflow-hidden shrink-0">
                          <img
                            src={story.avatar}
                            alt="avatar"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] text-white/95 font-black truncate drop-shadow">
                          Gujarat Post
                        </span>
                      </div>
                      <h4 className="text-[11px] sm:text-[11.5px] font-black leading-tight text-white line-clamp-2 drop-shadow-md">
                        {displayTitle}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Story View Modal */}
      {activeStoryIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-[420px] aspect-[9/16] bg-slate-900 rounded-lg overflow-hidden shadow-2xl mx-4">
            
            {/* Background Layer with opacity blur */}
            <div className="absolute inset-0">
              <Image
                src={STORY_ITEMS[activeStoryIndex].image}
                alt="Story background"
                fill
                className="object-cover opacity-75"
              />
            </div>

            {/* Click/Interact Overlay */}
            <div className="absolute inset-0 z-10 cursor-pointer" onClick={handleModalClick} />

            {/* Top Bar with Progress indicators */}
            <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/80 to-transparent z-20 flex flex-col gap-3">
              <div className="flex gap-1">
                {STORY_ITEMS.map((_, idx) => {
                  let widthPercent = 0;
                  if (idx < activeStoryIndex) widthPercent = 100;
                  else if (idx === activeStoryIndex) widthPercent = progress;

                  return (
                    <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-75 ease-linear"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Author & Header Close bar */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full border border-white/60 overflow-hidden">
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
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition z-20"
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
