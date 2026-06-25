'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, TrendingUp } from 'lucide-react';
import { formatDate, getArticleTitle, getTrendingArticles } from '@/data';
import SectionHeader from '@/components/ui/SectionHeader';
import { useApp } from '@/components/AppProvider';

export default function TrendingSection() {
  const { language } = useApp();
  const trending = getTrendingArticles();

  return (
    <section className="bg-muted py-0.5">
      <div className="max-w-screen-xl mx-auto px-3">
        <div className="mb-0.5 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent" />
          <SectionHeader title="Trending News" titleGu="ટ્રેન્ડિંગ ન્યૂઝ" titleHi="ट्रेंडिंग न्यूज" language={language} />
        </div>

        <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
          {trending.slice(0, 10).map((article, index) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="news-card group relative overflow-hidden rounded-lg border border-border bg-card"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 10vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="img-overlay absolute inset-0" />
                <div
                  className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black text-white shadow"
                  style={{ background: index < 3 ? 'var(--accent)' : 'rgba(0,0,0,0.65)' }}
                >
                  {index + 1}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-1.5">
                  <h3 className="line-clamp-2 text-[11px] font-black leading-tight text-white drop-shadow">
                    {getArticleTitle(article, language)}
                  </h3>
                  <div className="mt-0.5 flex items-center gap-0.5 text-[9px] font-semibold text-white/75">
                    <Clock className="h-2 w-2" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
