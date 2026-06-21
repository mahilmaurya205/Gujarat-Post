'use client';

import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { getFeaturedArticles } from '@/data';
import NewsCard from '@/components/ui/NewsCard';

export default function HeroSection() {
  const featured = getFeaturedArticles();
  const lead = featured[0];
  const supporting = featured.slice(1, 5);
  const moreStories = featured.slice(5, 10);

  if (!lead) return null;

  return (
    <section className="hero-band border-t-4 border-accent py-6 md:py-8">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-white shadow-lg shadow-red-500/20">
              <Flame className="h-5 w-5 fill-current" />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Gujarat Post</p>
              <h1 className="text-2xl font-black leading-tight text-foreground md:text-3xl">Top Stories</h1>
            </div>
          </div>
          <Link href="/category/gujarat" className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-black text-foreground shadow-sm transition hover:border-accent hover:text-accent">
            All stories <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <NewsCard article={lead} variant="hero" />
          </div>

          <div className="grid grid-cols-2 items-start gap-4 lg:col-span-5">
            {supporting.map((article) => (
              <NewsCard key={article.id} article={article} variant="small" />
            ))}
          </div>
        </div>

        {moreStories.length > 0 && (
          <div className="mt-6 border-t border-border pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wide text-foreground">More Top Stories</h2>
              <span className="text-[10px] font-bold text-muted-foreground">Stories 6–{5 + moreStories.length}</span>
            </div>
            <div className="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible">
              {moreStories.map((article) => (
                <div key={article.id} className="w-[16.5rem] shrink-0 snap-start lg:w-auto">
                  <NewsCard article={article} variant="small" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
