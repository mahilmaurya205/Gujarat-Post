'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Bookmark,
  ChevronRight,
  Clock,
  Copy,
  Eye,
  MessageCircle,
  Printer,
  Share2,
  Volume2,
} from 'lucide-react';
import { Article } from '@/types';
import {
  formatDate,
  formatTime,
  formatViews,
  getArticleContent,
  getArticleExcerpt,
  getArticleTitle,
  getCategoryLabel,
  getLocalized,
} from '@/data';
import { getCategoryColor } from '@/lib/utils';
import { useApp } from '@/components/AppProvider';
import NewsCard from '@/components/ui/NewsCard';
import Advertisement from '@/components/ads/Advertisement';

interface Props {
  article: Article;
  related: Article[];
  trending: Article[];
  articleUrl: string;
}

export default function NewsDetailClient({ article, related, trending, articleUrl }: Props) {
  const { language } = useApp();
  const [progress, setProgress] = useState(0);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const title = getArticleTitle(article, language);
  const excerpt = getArticleExcerpt(article, language);
  const body = getArticleContent(article, language);
  const category = getCategoryLabel(article, language);
  const authorName = getLocalized(language, { en: article.author.name, gu: article.author.nameGu, hi: article.author.nameHi });
  const authorDesignation = getLocalized(language, {
    en: article.author.designation,
    gu: article.author.designationGu,
    hi: article.author.designationHi,
  });
  const authorBio = getLocalized(language, { en: article.author.bio, gu: article.author.bioGu, hi: article.author.bioHi });
  const tags = language === 'en' ? article.tags : language === 'hi' ? article.tagsHi : article.tagsGu;
  const categoryColor = getCategoryColor(article.category);

  const paragraphs = useMemo(() => body.split(/\n\n+/), [body]);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const toggleAudio = () => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(`${title}. ${excerpt}`);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-IN';
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const shareLinks = [
    { label: 'Facebook', icon: Share2, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}` },
    { label: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(`${title} ${articleUrl}`)}` },
    { label: 'X', icon: Share2, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(articleUrl)}` },
  ];

  return (
    <>
      <div className="reading-progress" style={{ width: `${progress}%` }} />
      <div className="mx-auto max-w-screen-xl px-4 py-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <article className="lg:col-span-2">
            <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-accent">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/category/${article.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-accent">{article.category}</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="line-clamp-1">{article.title}</span>
            </nav>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="cat-badge" style={{ background: categoryColor }}>{category}</span>
              {article.isBreaking && <span className="live-badge rounded bg-accent px-2 py-1 text-xs font-black text-white">BREAKING</span>}
            </div>

            <h1 className="mb-3 text-3xl font-black leading-tight text-foreground md:text-5xl">{title}</h1>
            <p className="mb-5 text-lg font-semibold leading-8 text-muted-foreground">{excerpt}</p>

            <div className="mb-5 flex flex-wrap items-center gap-4 border-y border-border py-4">
              <Image src={article.author.image} alt={article.author.name} width={44} height={44} className="rounded-full object-cover" />
              <div>
                <p className="text-sm font-black text-foreground">{authorName}</p>
                <p className="text-xs font-semibold text-muted-foreground">{authorDesignation}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                <p className="flex items-center gap-1"><Clock className="h-3 w-3" />Published: {formatDate(article.publishedAt)} {formatTime(article.publishedAt)}</p>
                <p>Updated: {formatDate(article.updatedAt)} {formatTime(article.updatedAt)}</p>
              </div>
              <div className="ml-auto flex gap-3 text-xs text-muted-foreground">
                <span>{article.readingTime} min read</span>
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatViews(article.views)}</span>
              </div>
            </div>

            <div className="no-print mb-5 flex flex-wrap gap-2">
              {shareLinks.map(({ label, icon: Icon, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-black text-foreground hover:bg-secondary">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </a>
              ))}
              <button type="button" onClick={() => setSaved((value) => !value)} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-black text-foreground">
                <Bookmark className="h-3.5 w-3.5" />
                {saved ? 'Saved' : 'Save Story'}
              </button>
              <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-black text-foreground">
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
              <button type="button" onClick={copyUrl} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-black text-foreground">
                <Copy className="h-3.5 w-3.5" />
                {copied ? 'Copied' : 'Copy URL'}
              </button>
              <button type="button" onClick={toggleAudio} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-black text-foreground">
                <Volume2 className="h-3.5 w-3.5" />
                {speaking ? 'Stop Audio' : 'Audio Story'}
              </button>
            </div>

            <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-lg">
              <Image src={article.image} alt={article.title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" loading="eager" />
            </div>

            <div className="space-y-5 text-lg leading-9 text-foreground">
              {paragraphs.map((paragraph, index) => (
                <div key={paragraph}>
                  <p>{paragraph}</p>
                  {index === 1 && (
                    <div className="no-print my-6">
                      <Advertisement position="in-article" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-border pt-5">
              <p className="mb-3 text-xs font-black uppercase tracking-wide text-muted-foreground">Tags</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-foreground">#{tag}</span>
                ))}
              </div>
            </div>

            <section className="mt-8 rounded-lg border border-border bg-card p-4">
              <div className="flex gap-3">
                <Image src={article.author.image} alt={article.author.name} width={58} height={58} className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <h2 className="font-black text-foreground">{authorName}</h2>
                  <p className="text-xs font-bold text-accent">{authorDesignation}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{authorBio}</p>
                </div>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="section-heading mb-4 text-xl font-black text-foreground">
                {getLocalized(language, { en: 'Related Stories', gu: 'સંબંધિત સમાચાર', hi: 'संबंधित खबरें' })}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((item) => <NewsCard key={item.id} article={item} variant="horizontal" />)}
              </div>
            </section>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-40 lg:self-start">
            <Advertisement position="sidebar" />
            <section className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="bg-accent px-4 py-3 text-sm font-black text-white">
                {getLocalized(language, { en: 'Trending Stories', gu: 'ટ્રેન્ડિંગ સ્ટોરીઝ', hi: 'ट्रेंडिंग स्टोरीज' })}
              </div>
              <div className="p-3">
                {trending.map((item, index) => (
                  <div key={item.id} className="flex gap-2">
                    <span className="mt-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-black text-muted-foreground">{index + 1}</span>
                    <NewsCard article={item} variant="compact" />
                  </div>
                ))}
              </div>
            </section>
            <Advertisement position="sidebar" />
          </aside>
        </div>
      </div>
    </>
  );
}
