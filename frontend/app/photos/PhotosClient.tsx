'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Camera } from 'lucide-react';
import { PHOTOS, getLocalized } from '@/data';
import { useApp } from '@/components/AppProvider';

interface PhotosClientProps {
  initialPhotos: any[];
}

export default function PhotosClient({ initialPhotos }: PhotosClientProps) {
  const { language } = useApp();
  const gallery = initialPhotos.length > 0 ? initialPhotos : PHOTOS;

  const getGridClasses = (index: number) => {
    const mod = index % 9;
    switch (mod) {
      case 0:
        return 'md:col-span-2 md:h-[240px]';
      case 4:
        return 'md:col-span-2 md:h-[240px]';
      case 8:
        return 'md:col-span-2 md:h-[240px]';
      default:
        return 'md:col-span-1 md:h-[240px]';
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      <header className="mb-8 border-b border-border/60 pb-5">
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          {getLocalized(language, { en: 'Photo Gallery', gu: 'ફોટો ગેલેરી', hi: 'फोटो गैलरी' })}
        </h1>
        <p className="text-sm font-semibold text-muted-foreground mt-1.5">
          {getLocalized(language, { 
            en: 'Latest Gujarat news moments in pictures.', 
            gu: 'ગુજરાતના તાજા સમાચારના દૃશ્યો.', 
            hi: 'गुजरात की ताजा खबरों की तस्वीरें.' 
          })}
        </p>
      </header>

      {/* Modern Bento Asymmetrical Grid matching Homepage style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {gallery.map((photo, index) => {
          const mockCount = ((index * 7 + 12) % 35) + 8;
          return (
            <Link 
              key={`${photo.id}-${index}`} 
              href={`/photos/${photo.id}`} 
              className={`group relative block w-full overflow-hidden rounded-2xl shadow-md border border-border/10 bg-card aspect-[16/10.5] md:aspect-auto transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#B3121B]/12 hover:border-[#B3121B]/35 ${getGridClasses(index)}`}
            >
              <Image 
                src={photo.src} 
                alt={photo.alt || 'Gallery Photo'} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" 
                className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.08] group-hover:rotate-1" 
              />
              {/* Soft dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/5" />



              {/* Title overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 pt-8 bg-gradient-to-t from-black/95 via-black/50 to-transparent">
                <h2 className="text-white text-[14px] md:text-[15px] font-black leading-snug line-clamp-2 drop-shadow select-none transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
                  {getLocalized(language, { en: photo.caption, gu: photo.captionGu, hi: photo.captionHi })}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
