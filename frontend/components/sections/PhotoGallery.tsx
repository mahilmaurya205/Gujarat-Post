'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PHOTOS, getLocalized } from '@/data';
import SectionHeader from '@/components/ui/SectionHeader';
import { useApp } from '@/components/AppProvider';
import { Language } from '@/types';


/* ─── Types ─────────────────────────────────────────────────────────────── */
type CardSize = 'hero' | 'medium' | 'wide' | 'tall';

/*
  Layout (matches the target diagram):
  ┌───────────────┬───────────────┐
  │               │       1       │
  │     HERO      ├───────────────┤
  │    (2×2)      │       2       │
  ├───────────────┼───────────────┼───────────────┐
  │       3       │       4       │       5       │
  ├───────────────┼───────────────┼───────────────┤
  │       6       │       7       │       8       │
  └───────────────┴───────────────┴───────────────┘
*/
const CARD_SPANS: { colSpan: string; rowSpan: string; size: CardSize }[] = [
  { colSpan: 'col-span-2', rowSpan: 'row-span-2', size: 'hero' },   // 0: Big hero
  { colSpan: 'col-span-1', rowSpan: 'row-span-1', size: 'medium' }, // 1
  { colSpan: 'col-span-1', rowSpan: 'row-span-1', size: 'medium' }, // 2
  { colSpan: 'col-span-1', rowSpan: 'row-span-1', size: 'medium' }, // 3
  { colSpan: 'col-span-1', rowSpan: 'row-span-1', size: 'medium' }, // 4
  { colSpan: 'col-span-1', rowSpan: 'row-span-1', size: 'medium' }, // 5
  { colSpan: 'col-span-1', rowSpan: 'row-span-1', size: 'medium' }, // 6
  { colSpan: 'col-span-1', rowSpan: 'row-span-1', size: 'medium' }, // 7
  { colSpan: 'col-span-1', rowSpan: 'row-span-1', size: 'medium' }, // 8
];

/* ─── Category chips ─────────────────────────────────────────────────────── */
const CATS = ['Gujarat', 'Culture', 'Politics', 'Sports', 'City', 'Nature', 'Travel', 'Lifestyle', 'Tech'];

/* ─── GalleryCard ─────────────────────────────────────────────────────────── */
function GalleryCard({
  photo,
  index,
  language,
  hqSrc,
  colSpan,
  rowSpan,
  size,
}: {
  photo: any;
  index: number;
  language: Language;
  hqSrc: (src: string) => string;
  colSpan: string;
  rowSpan: string;
  size: CardSize;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const caption = getLocalized(language, {
    en: photo.caption,
    gu: photo.captionGu,
    hi: photo.captionHi,
  });

  const isHero = size === 'hero';
  const isWide = size === 'wide';

  return (
    <div
      ref={ref}
      className={`${colSpan} ${rowSpan}`}
      style={{
        transitionDelay: `${index * 70}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
        transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <Link
        href={`/photos/${photo.id}`}
        className="group relative flex h-full w-full overflow-hidden rounded-2xl shadow-lg"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Shimmer Placeholder ── */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 animate-pulse" />

        {/* ── Image ── */}
        {!imgError ? (
          <Image
            src={hqSrc(photo.src)}
            alt={photo.alt}
            fill
            sizes={isHero ? '(max-width: 768px) 100vw, 66vw' : isWide ? '100vw' : '(max-width: 768px) 100vw, 33vw'}
            quality={92}
            onError={() => setImgError(true)}
            style={{
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1)',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#B3121B]/20 to-slate-900 gap-3">
            <svg className="h-12 w-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-white/25 text-xs font-semibold tracking-wider uppercase">Photo</span>
          </div>
        )}

        {/* ── Gradient Overlays ── */}
        {/* Top fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent opacity-60" />
        {/* Bottom strong gradient for caption */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"
          style={{
            opacity: hovered ? 1 : 0.85,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* ── Category chip (top-left) ── */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-[#B3121B] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow-lg">
            {CATS[index % CATS.length]}
          </span>
        </div>


        {/* ── Caption area (bottom) ── */}
        <div
          className="absolute inset-x-0 bottom-0 z-10 p-4"
          style={{
            transform: hovered ? 'translateY(0)' : 'translateY(4px)',
            transition: 'transform 0.4s ease',
          }}
        >
          {/* Caption text */}
          <p
            className={`text-white font-bold leading-snug line-clamp-2 drop-shadow-lg
              ${isHero ? 'text-[16px] md:text-[18px]' : isWide ? 'text-[15px] md:text-[16px]' : 'text-[13px] md:text-[14px]'}
            `}
          >
            {caption}
          </p>

          {/* View Photo row — reveals on hover */}
          <div
            className="flex items-center gap-2 mt-2 overflow-hidden"
            style={{
              maxHeight: hovered ? '32px' : '0px',
              opacity: hovered ? 1 : 0,
              transition: 'max-height 0.35s ease, opacity 0.35s ease',
            }}
          >
            <div className="h-[1.5px] w-8 bg-[#B3121B] rounded-full" />
            <span className="text-white/80 text-[11px] font-semibold tracking-wider uppercase">View Photo</span>
            <svg className="h-3.5 w-3.5 text-[#B3121B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* ── Red border glow on hover ── */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: hovered ? 'inset 0 0 0 2px #B3121B' : 'inset 0 0 0 0px #B3121B',
            transition: 'box-shadow 0.35s ease',
          }}
        />
      </Link>
    </div>
  );
}

/* ─── Loading Skeleton ────────────────────────────────────────────────────── */
function GallerySkeleton() {
  return (
    <section className="py-6 bg-background">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="mb-6 h-7 w-44 rounded-lg bg-muted/60 animate-pulse" />
        <div className="grid grid-cols-3 auto-rows-[200px] gap-4">
          <div className="col-span-2 row-span-2 rounded-2xl bg-muted/50 animate-pulse" />
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-muted/40 animate-pulse" />
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

  useEffect(() => {
    setPhotos(PHOTOS.slice(0, 9));
    setLoading(false);
  }, []);

  const hqSrc = (src: string) =>
    src.replace(/w=\d+/, 'w=1400').replace(/q=\d+/, 'q=92');

  if (loading) return <GallerySkeleton />;

  const gallery = photos.length > 0 ? photos : PHOTOS.slice(0, 9);

  return (
    <section className="py-6 bg-background">
      <div className="mx-auto max-w-screen-xl px-4">
        <SectionHeader
          title="Photo Gallery"
          titleGu="ફોટો ગેલેરી"
          titleHi="फोटो गैलरी"
          href="/photos"
          language={language}
        />

        {/* Bento Magazine Grid — 3 columns, auto rows of 200px */}
        <div className="grid grid-cols-3 auto-rows-[200px] gap-4">
          {gallery.map((photo, index) => {
            const span = CARD_SPANS[index] ?? { colSpan: 'col-span-1', rowSpan: 'row-span-1', size: 'medium' as CardSize };
            return (
              <GalleryCard
                key={photo.id}
                photo={photo}
                index={index}
                language={language}
                hqSrc={hqSrc}
                colSpan={span.colSpan}
                rowSpan={span.rowSpan}
                size={span.size}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}