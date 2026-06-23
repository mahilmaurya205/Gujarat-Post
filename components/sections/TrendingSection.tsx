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
    <section className="bg-muted py-3">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          <SectionHeader title="Trending News" titleGu="ટ્રેન્ડિંગ ન્યૂઝ" titleHi="ट्रेंडिंग न्यूज" language={language} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {trending.slice(0, 10).map((article, index) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="news-card group relative overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="img-overlay absolute inset-0" />
                <div
                  className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-white shadow-lg"
                  style={{ background: index < 3 ? 'var(--accent)' : 'rgba(0,0,0,0.65)' }}
                >
                  {index + 1}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <h3 className="line-clamp-2 text-sm font-black leading-tight text-white drop-shadow">
                    {getArticleTitle(article, language)}
                  </h3>
                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-white/75">
                    <Clock className="h-3 w-3" />
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
