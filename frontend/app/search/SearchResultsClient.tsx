'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SearchX } from 'lucide-react';
import { searchArticles, ARTICLES } from '@/data';
import NewsCard from '@/components/ui/NewsCard';
import { useApp } from '@/components/AppProvider';

// Default articles to show when no query entered (latest articles)
const defaultArticles = ARTICLES.slice(0, 12);

// Language strings
const strings = {
  gu: {
    label: 'ગુજરાત પોસ્ટ સર્ચ',
    heading: 'ન્યૂઝરૂમ સર્ચ કરો',
    placeholder: 'સમાચાર, શહેર, વર્ગ અથવા વિષય શોધો...',
    searchBtn: 'શોધો',
    defaultSection: 'તાજા સમાચાર',
    resultsFor: (q: string) => `"${q}" માટે પરિણામ`,
    articlesCount: (n: number) => `${n} સમાચાર`,
    foundCount: (n: number) => `${n} સમાચાર મળ્યા`,
    noFound: 'કોઈ સમાચાર મળ્યા નહીં',
    tryFewer: 'ઓછા શબ્દો વાપરો અથવા શહેર, વર્ગ કે વ્યક્તિ દ્વારા શોધો.',
  },
  hi: {
    label: 'गुजरात पोस्ट सर्च',
    heading: 'न्यूज़रूम खोजें',
    placeholder: 'समाचार, शहर, श्रेणी या विषय खोजें...',
    searchBtn: 'खोजें',
    defaultSection: 'ताज़ा समाचार',
    resultsFor: (q: string) => `"${q}" के लिए परिणाम`,
    articlesCount: (n: number) => `${n} लेख`,
    foundCount: (n: number) => `${n} लेख मिले`,
    noFound: 'कोई समाचार नहीं मिला',
    tryFewer: 'कम शब्द आज़माएं या शहर, श्रेणी या व्यक्ति द्वारा खोजें।',
  },
  en: {
    label: 'Gujarat Post Search',
    heading: 'Search the newsroom',
    placeholder: 'Search news, city, category or topic...',
    searchBtn: 'Search',
    defaultSection: 'Latest News',
    resultsFor: (q: string) => `Results for "${q}"`,
    articlesCount: (n: number) => `${n} articles`,
    foundCount: (n: number) => `${n} ${n === 1 ? 'article' : 'articles'} found`,
    noFound: 'No stories found',
    tryFewer: 'Try fewer words or search by city, category or person.',
  },
};

export default function SearchResultsClient({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const { language } = useApp();
  const t = strings[language] ?? strings.en;
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(() => initialQuery ? searchArticles(initialQuery) : defaultArticles, [initialQuery]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    if (value) router.push(`/search?q=${encodeURIComponent(value)}`);
    else router.push('/search');
  };

  return (
    <main className="min-h-[60vh] bg-background py-8 md:py-12">
      <div className="mx-auto max-w-screen-xl px-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-accent">{t.label}</p>
        <h1 className="mt-2 text-3xl font-black text-foreground md:text-5xl">{t.heading}</h1>
        <form onSubmit={submit} className="relative mt-6 max-w-3xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.placeholder}
            className="h-14 w-full rounded-xl border border-border bg-card pl-12 pr-28 text-base font-semibold text-foreground shadow-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
          />
          <button type="submit" className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-lg bg-accent px-5 text-sm font-black text-white hover:bg-red-700">
            {t.searchBtn}
          </button>
        </form>

        <div className="mb-5 mt-10 border-b border-border pb-4">
          <p className="text-sm font-black text-foreground">
            {initialQuery ? t.resultsFor(initialQuery) : t.defaultSection}
          </p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {initialQuery ? t.foundCount(results.length) : t.articlesCount(results.length)}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((article) => <NewsCard key={article.id} article={article} />)}
          </div>
        ) : initialQuery ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <SearchX className="h-10 w-10 text-muted-foreground/50" />
            <h2 className="mt-4 text-xl font-black text-foreground">{t.noFound}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.tryFewer}</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
