'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PHOTOS, getLocalized } from '@/data';
import { useApp } from '@/components/AppProvider';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ─── Category chips ─────────────────────────────────────────────────────── */
const CATS = ['TRAVEL', 'SPORTS', 'FESTIVAL', 'CITY', 'CULTURE', 'POLITICS', 'NATURE', 'LIFESTYLE', 'TECH'];

/* ─── Loading Skeleton ────────────────────────────────────────────────────── */
function GallerySkeleton() {
  return (
    <section className="py-6 bg-background select-none">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="mb-6 h-10 w-44 rounded-lg bg-muted/60 animate-pulse" />
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[270px] aspect-[3/4] rounded-2xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PhotoGallery ───────────────────────────────────────────────────────── */
export default function PhotoGallery() {
  const { language } = useApp();
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef<number>(0);
  const isManualScrolling = useRef<boolean>(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    // Merge database photos with 6 high-fidelity extra photos
    const basePhotos = PHOTOS;
    const extraPhotos = [
      {
        id: "ph13",
        src: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=80",
        alt: "Gir Forest Lion",
        caption: "Gir National Park registers rise in Asiatic lion sightings",
        captionGu: "ગીર રાષ્ટ્રીય ઉદ્યાનમાં એશિયાટિક સિંહોની સંખ્યામાં વધારો નોંધાયો",
        captionHi: "ગીર રાષ્ટ્રીય ઉદ્યાનમાં એશિયાટિક સિંહોની સંખ્યામાં વધારો નોંધાયો"
      },
      {
        id: "ph14",
        src: "https://images.unsplash.com/photo-1596422846543-c5c6ff183bfe?w=800&q=80",
        alt: "Rann of Kutch",
        caption: "White desert of Rann of Kutch prep for winter tourist peak",
        captionGu: "કચ્છનું સફેદ રણ શિયાળાના પ્રવાસીઓ માટે સજ્જ થઈ રહ્યું છે",
        captionHi: "કચ્છનું સફેદ રણ શિયાળાના પ્રવાસીઓ માટે સજ્જ થઈ રહ્યું છે"
      },
      {
        id: "ph15",
        src: "https://images.unsplash.com/photo-1627894783046-765cd470db98?w=800&q=80",
        alt: "Dwarkadhish Temple",
        caption: "Dwarka beach tourism gets massive central funding boost",
        captionGu: "દ્વારકા બીચ ટુરિઝમને કેન્દ્ર સરકાર તરફથી મોટું ફંડ મળ્યું",
        captionHi: "દ્વારકા બીચ ટુરિઝમને કેન્દ્ર સરકાર તરફથી મોટું ફંડ મળ્યું"
      },
      {
        id: "ph16",
        src: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?w=800&q=80",
        alt: "Traditional Art",
        caption: "Kutchi handicraft weavers receive national recognition rewards",
        captionGu: "કચ્છી હસ્તકલા વણકરોને રાષ્ટ્રીય સ્તરે સન્માન મળ્યું",
        captionHi: "કચ્છી હસ્તકલા વણકરોને રાષ્ટ્રીય સ્તરે સન્માન મળ્યું"
      },
      {
        id: "ph17",
        src: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&q=80",
        alt: "Surat Textiles",
        caption: "Surat textile hubs announce record export orders for 2026",
        captionGu: "સુરત ટેક્સટાઈલ હબ દ્વારા ૨૦૨૬માં રેકોર્ડ નિકાસ ઓર્ડર જાહેર",
        captionHi: "સુરત ટેક્સટાઈલ હબ દ્વારા ૨૦૨૬માં રેકોર્ડ નિકાસ ઓર્ડર જાહેર"
      },
      {
        id: "ph18",
        src: "https://images.unsplash.com/photo-1590073844006-33379778ae09?w=800&q=80",
        alt: "Sabarmati Ashram",
        caption: "Sabarmati Ashram restoration project nears completion phase",
        captionGu: "સાબરમતી આશ્રમ પુનઃનિર્માણ પ્રોજેક્ટ પૂર્ણતાના આરે છે",
        captionHi: "સાબરમતી આશ્રમ પુનઃનિર્માણ પ્રોજેક્ટ પૂર્ણતાના આરે છે"
      }
    ];
    setPhotos([...basePhotos, ...extraPhotos]);
    setLoading(false);
  }, []);

  // Continuous 60fps auto-scroll loop with float ref accumulation to eliminate integer rounding freezes
  useEffect(() => {
    if (loading || photos.length === 0) return;

    let animId: number;
    const scrollStep = () => {
      const el = scrollContainerRef.current;
      if (el) {
        if (!isManualScrolling.current) {
          scrollPosRef.current += 1.2;
          const halfWidth = el.scrollWidth / 2;
          if (halfWidth > 0 && scrollPosRef.current >= halfWidth) {
            scrollPosRef.current = 0;
          }
          el.scrollLeft = scrollPosRef.current;
        }

        setShowLeftArrow(el.scrollLeft > 10);
        setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
      }
      animId = requestAnimationFrame(scrollStep);
    };

    animId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animId);
  }, [loading, photos]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    isManualScrolling.current = true;
    const scrollAmount = direction === 'left' ? -350 : 350;
    scrollPosRef.current = Math.max(0, scrollPosRef.current + scrollAmount);
    el.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(() => {
      if (el) scrollPosRef.current = el.scrollLeft;
      isManualScrolling.current = false;
    }, 400);
  };

  const handleNativeScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (isManualScrolling.current) return;
    // Sync float ref if user manually touches/drags
    scrollPosRef.current = el.scrollLeft;
    setShowLeftArrow(el.scrollLeft > 10);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const hqSrc = (src: string) =>
    src.replace(/w=\d+/, 'w=800').replace(/q=\d+/, 'q=90');

  if (loading) return <GallerySkeleton />;

  const gallery = photos;

  return (
    <section className="py-6 bg-background select-none">
      <div className="mx-auto max-w-screen-xl px-4">
        {/* Top Header Matching User Mockup */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-neutral-900 dark:border-neutral-700 mb-6">
          <div className="bg-[#B3121B] text-white font-extrabold text-[15px] px-4 py-2 rounded-xl shadow-sm tracking-wide">
            {language === 'gu' ? 'ફોટો ગેલેરી' : language === 'hi' ? 'फोटो गैलरी' : 'Photo Gallery'}
          </div>
          <Link
            href="/photos"
            className="text-[#B3121B] font-bold text-[14px] hover:underline flex items-center gap-1"
          >
            {language === 'gu' ? 'વધુ ફોટો ગેલેરી →' : language === 'hi' ? 'और फोटो गैलरी →' : 'More Photo Gallery →'}
          </Link>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="absolute left-[-14px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shadow-xl border border-neutral-200 dark:border-neutral-800 hover:scale-105 transition-transform cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 stroke-[3]" />
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="absolute right-[-14px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shadow-xl border border-neutral-200 dark:border-neutral-800 hover:scale-105 transition-transform cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 stroke-[3]" />
            </button>
          )}

          {/* Scrollable Auto-Scroll List */}
          <div
            ref={scrollContainerRef}
            onScroll={handleNativeScroll}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          >
            {[...gallery, ...gallery].map((photo, index) => (
              <div
                key={`${photo.id}-${index}`}
                className="group relative flex-shrink-0 w-[230px] sm:w-[260px] md:w-[280px] aspect-[3/4]"
              >
                <Link
                  href={`/photos/${photo.id}`}
                  className="group relative flex h-full w-full overflow-hidden rounded-2xl shadow-md border border-border/40 hover:border-[#B3121B]/40 transition-all duration-300 bg-neutral-900"
                  onMouseEnter={() => setHoveredId(`${photo.id}-${index}`)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Shimmer Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-900 animate-pulse" />

                  {/* Image */}
                  <Image
                    src={hqSrc(photo.src)}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    quality={90}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Category Chip */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-[#B3121B] text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md select-none">
                      {CATS[index % CATS.length]}
                    </span>
                  </div>

                  {/* Caption (bottom) */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                    <p className="text-white font-extrabold leading-snug line-clamp-2 drop-shadow-md text-[14px] md:text-[15px]">
                      {getLocalized(language, {
                        en: photo.caption,
                        gu: photo.captionGu,
                        hi: photo.captionHi,
                      })}
                    </p>
                    <div
                      className="flex items-center gap-1.5 mt-2 overflow-hidden transition-all duration-300"
                      style={{
                        maxHeight: hoveredId === `${photo.id}-${index}` ? '24px' : '0px',
                        opacity: hoveredId === `${photo.id}-${index}` ? 1 : 0,
                      }}
                    >
                      <span className="text-white/80 text-[10px] font-semibold tracking-wider uppercase select-none">View Gallery</span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#B3121B] stroke-[3.5]" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}