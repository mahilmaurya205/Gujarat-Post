'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PHOTOS, getLocalized } from '@/data';
import SectionHeader from '@/components/ui/SectionHeader';
import { useApp } from '@/components/AppProvider';

export default function PhotoGallery() {
  const { language } = useApp();
  const [active, setActive] = useState<number | null>(null);
  const heights = [260, 180, 320, 220, 190, 280];

  const next = () => setActive((value) => (value === null ? null : (value + 1) % PHOTOS.length));
  const previous = () => setActive((value) => (value === null ? null : (value - 1 + PHOTOS.length) % PHOTOS.length));

  return (
    <section className="py-8">
      <div className="mx-auto max-w-screen-xl px-4">
        <SectionHeader title="Photo Gallery" titleGu="ફોટો ગેલેરી" titleHi="फोटो गैलरी" href="/photos" language={language} />
        <div className="masonry-grid">
          {PHOTOS.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActive(index)}
              className="masonry-item news-card group relative w-full overflow-hidden rounded-lg text-left"
              style={{ height: heights[index % heights.length] }}
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
              <div className="img-overlay absolute inset-0 opacity-0 transition group-hover:opacity-100" />
              <p className="absolute inset-x-0 bottom-0 translate-y-3 p-3 text-sm font-black text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                {getLocalized(language, { en: photo.caption, gu: photo.captionGu, hi: photo.captionHi })}
              </p>
            </button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal="true">
          <button type="button" onClick={() => setActive(null)} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white" aria-label="Close gallery">
            <X className="h-6 w-6" />
          </button>
          <button type="button" onClick={previous} className="absolute left-4 top-1/2 rounded-full bg-white/10 p-2 text-white" aria-label="Previous photo">
            <ChevronLeft className="h-8 w-8" />
          </button>
          <div className="w-full max-w-4xl">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
              <Image src={PHOTOS[active].src} alt={PHOTOS[active].alt} fill sizes="90vw" className="object-contain" />
            </div>
            <p className="mt-3 text-center text-sm font-semibold text-white/80">
              {getLocalized(language, { en: PHOTOS[active].caption, gu: PHOTOS[active].captionGu, hi: PHOTOS[active].captionHi })}
            </p>
          </div>
          <button type="button" onClick={next} className="absolute right-4 top-1/2 rounded-full bg-white/10 p-2 text-white" aria-label="Next photo">
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      )}
    </section>
  );
}
