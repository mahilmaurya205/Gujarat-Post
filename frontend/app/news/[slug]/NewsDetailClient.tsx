'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import { useApp } from '@/components/AppProvider';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Advertisement from '@/components/ads/Advertisement';

interface Props {
  article: Article;
  related: Article[];
  trending: Article[];
  articleUrl: string;
}

function toGu(n: number | string) {
  const guDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return String(n).replace(/\d/g, (d) => guDigits[+d]);
}

export default function NewsDetailClient({ article, related, trending, articleUrl }: Props) {
  const { language } = useApp();
  const [progress, setProgress] = useState(0);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [adSlide, setAdSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAdSlide((prev) => (prev === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slideImages = useMemo(() => {
    return [
      article.image,
      '/assets/demo/3.jpg',
      '/assets/demo/5.jpg',
    ];
  }, [article.image]);

  const handleNextImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev + 1) % slideImages.length);
  }, [slideImages.length]);

  const handlePrevImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  }, [slideImages.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNextImage();
    }, 4000);
    return () => clearInterval(timer);
  }, [handleNextImage]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const handleSavedChange = () => {
      try {
        const stored = localStorage.getItem('gp-saved-articles');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setSavedIds(parsed);
          }
        }
      } catch (e) { }
    };

    try {
      const stored = localStorage.getItem('gp-saved-articles');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedIds(parsed);
          if (parsed.includes(article.id)) {
            setSaved(true);
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    window.addEventListener('gp-saved-changed', handleSavedChange);
    return () => window.removeEventListener('gp-saved-changed', handleSavedChange);
  }, [article.id]);

  const handleToggleSave = () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    try {
      const stored = localStorage.getItem('gp-saved-articles');
      let parsed = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(parsed)) parsed = [];
      if (nextSaved) {
        if (!parsed.includes(article.id)) {
          parsed.push(article.id);
        }
      } else {
        parsed = parsed.filter((id: string) => id !== article.id);
      }
      localStorage.setItem('gp-saved-articles', JSON.stringify(parsed));
      window.dispatchEvent(new Event('gp-saved-changed'));
    } catch (e) {
      console.warn('Failed to save article:', e);
    }
  };

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
  const isTrafficArticle = article.slug.includes('traffic-rules') || article.slug.includes('penalty-and-locations');

  const paragraphs = useMemo(() => body.split(/\n\n+/), [body]);

  const gistPoints = useMemo(() => {
    const p1 = title;
    const p2 = excerpt;
    const firstParagraph = paragraphs[0] || '';
    const cleanP1 = p1.replace(/<[^>]*>/g, '').trim();
    const cleanP2 = p2.replace(/<[^>]*>/g, '').trim();
    const cleanP3 = firstParagraph.replace(/<[^>]*>/g, '').trim();

    return [
      cleanP1.length > 95 ? cleanP1.substring(0, 95) + '...' : cleanP1,
      cleanP2.length > 125 ? cleanP2.substring(0, 125) + '...' : cleanP2,
      cleanP3.length > 115 ? cleanP3.substring(0, 115) + '...' : cleanP3,
    ].filter(Boolean);
  }, [title, excerpt, paragraphs]);

  const trendingTopics = useMemo(() => {
    if (language === 'gu') {
      return ['ચૂંટણી 2027', 'વરસાદ', 'સોના-ચાંદી', 'ક્રિકેટ', 'મેટ્રો', 'સેમિકન્ડક્ટર', 'ડાયમંડ ઉદ્યોગ', 'ટ્રાફિક'];
    } else if (language === 'hi') {
      return ['चुनाव २०२७', 'बारिश', 'सोना-चांदी', 'क्रिकेट', 'मेट्रो', 'सेमीकंडक्टर', 'हीरा उद्योग', 'यातायात'];
    } else {
      return ['Election 2027', 'Rain', 'Gold-Silver', 'Cricket', 'Metro', 'Semiconductor', 'Diamond Industry', 'Traffic'];
    }
  }, [language]);

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
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
      icon: (className: string) => <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
      style: 'bg-[#1877f2]/8 text-[#1877f2] border border-[#1877f2]/10 hover:bg-[#1877f2]/15'
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${articleUrl}`)}`,
      icon: (className: string) => <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>,
      style: 'bg-[#25d366]/8 text-[#25d366] border border-[#25d366]/10 hover:bg-[#25d366]/15'
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(articleUrl)}`,
      icon: (className: string) => <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
      style: 'bg-black/[0.03] dark:bg-white/[0.03] text-foreground border border-foreground/10 hover:bg-black/[0.06] dark:hover:bg-white/[0.06]'
    },
    {
      label: 'Telegram',
      href: `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(title)}`,
      icon: (className: string) => <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.37-.49 1.03-.75 4.04-1.76 6.74-2.92 8.09-3.48 3.85-1.6 4.64-1.88 5.17-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.13-.03.2z" /></svg>,
      style: 'bg-[#229ed9]/8 text-[#229ed9] border border-[#229ed9]/10 hover:bg-[#229ed9]/15'
    },
    {
      label: 'Google News',
      href: `https://news.google.com/search?q=Gujarat+Post`,
      icon: (className: string) => <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 10h-4v-2h4v2zm0-4h-4V6h4v2zm-5 8H5v-2h8v2zm5 0h-4v-2h4v2zM12 6H5v6h7V6z" /></svg>,
      style: 'bg-[#4285f4]/8 text-[#4285f4] border border-[#4285f4]/10 hover:bg-[#4285f4]/15'
    },
  ];

  // Helper to generate between 10 and 20 unique tags for a stream article
  const getStreamTags = (streamArticle: any) => {
    let ownTags: string[] = [];
    if (language === 'gu') {
      ownTags = streamArticle.tagsGu || streamArticle.tags || [];
    } else if (language === 'hi') {
      ownTags = streamArticle.tagsHi || streamArticle.tags || [];
    } else {
      ownTags = streamArticle.tags || [];
    }

    ownTags = ownTags.filter((t: string) => t && t.trim() !== '');

    const otherTagsSet = new Set<string>();
    const allArticles = [article, ...related, ...trending];
    allArticles.forEach(art => {
      const tags = (language === 'gu' ? art.tagsGu : language === 'hi' ? art.tagsHi : art.tags) || [];
      tags.forEach((t: string) => {
        if (t && t.trim() !== '') {
          otherTagsSet.add(t.trim());
        }
      });
    });

    const fallbackTags = language === 'gu'
      ? ['સમાચાર', 'ગુજરાત', 'લાઇવ', 'અમદાવાદ', 'બ્રેકિંગ ન્યૂઝ', 'ક્રિકેટ', 'સ્પોર્ટ્સ', 'બોલિવૂડ', 'એન્ટરટેઇનમેન્ટ', 'રાજકારણ', 'બિઝનેસ', 'ટેકનોલોજી', 'વેધર', 'રાજકોટ', 'સુરત', 'વડોદરા', 'લાઇફસ્ટાઇલ', 'રાષ્ટ્રીય', 'આંતરરાષ્ટ્રીય', 'વિશેષ', 'મનોરંજન', 'રમતગમત']
      : language === 'hi'
        ? ['समाचार', 'गुजरात', 'लाइव', 'अहमदाबाद', 'ब्रेकिंग न्यूज', 'क्रिकेट', 'स्पोर्ट्स', 'बॉलीवुड', 'मनोरंजन', 'राजनीति', 'बिजनेस', 'टेक्नोलॉजी', 'मौसम', 'राजकोट', 'सूरत', 'वडोदरा', 'लाइफस्टाइल', 'राष्ट्रीय', 'अंतरराष्ट्रीय', 'विशेष', 'खेल']
        : ['News', 'Gujarat', 'Live', 'Ahmedabad', 'Breaking News', 'Cricket', 'Sports', 'Bollywood', 'Entertainment', 'Politics', 'Business', 'Technology', 'Weather', 'Rajkot', 'Surat', 'Vadodara', 'Lifestyle', 'National', 'International', 'Special', 'Entertainment', 'Sports'];

    fallbackTags.forEach(t => otherTagsSet.add(t));

    const finalTagsSet = new Set<string>(ownTags);
    const otherTagsArray = Array.from(otherTagsSet);
    for (const tag of otherTagsArray) {
      if (finalTagsSet.size >= 15) break; // target 15 tags
      finalTagsSet.add(tag);
    }

    const finalTags = Array.from(finalTagsSet).slice(0, 20);

    // Ensure we meet the absolute minimum of 10 tags
    while (finalTags.length < 10) {
      const nextFallback = fallbackTags.find(f => !finalTags.includes(f));
      if (nextFallback) {
        finalTags.push(nextFallback);
      } else {
        break;
      }
    }

    return finalTags.slice(0, 20);
  };

  return (
    <>
      <div className="reading-progress" style={{ width: `${progress}%` }} />
      <div className="wrap py-6">
        <div className="article-grid">
          <article>
            <nav className="breadcrumb select-none flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-neutral-500 font-medium">
              <Link href="/" className="hover:text-[var(--red)] transition-colors">
                {language === 'gu' ? 'હોમ' : language === 'hi' ? 'होम' : 'Home'}
              </Link>
              <span>/</span>
              <Link href={`/category/${article.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-[var(--red)] transition-colors">
                {category}
              </Link>
              <span>/</span>
              <span>
                {language === 'gu' ? 'અમદાવાદ' : language === 'hi' ? 'अहमदाबाद' : 'Ahmedabad'}
              </span>
              <span className="mx-0.5">:</span>
              <span className="text-red-700 dark:text-red-400 font-bold">
                {title}
              </span>
            </nav>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <div className="art-kick">
                <span className="bar"></span>
                <span>{category} · {language === 'gu' ? 'અમદાવાદ' : language === 'hi' ? 'अहमदाबाद' : 'Ahmedabad'}</span>
              </div>
              {article.isBreaking && <span className="live-badge rounded bg-accent px-2 py-1 text-xs font-black text-white ml-2">BREAKING</span>}
            </div>

            <h1 className="article-title">{title}</h1>
            <p className="article-sub">{excerpt}</p>

            <div className="byline select-none">
              <div className="flex items-center gap-[11px]">
                <Link href={`/author/${article.author.id}`} className="shrink-0 w-[38px] h-[38px] rounded-full bg-[var(--red)] text-white flex items-center justify-center font-bold text-sm hover:opacity-90 transition-opacity">
                  {authorName.substring(0, 2)}
                </Link>
                <div>
                  <div className="text-[13.5px]">
                    <span className="text-[var(--ink-2)]">{language === 'gu' ? 'લેખક:' : language === 'hi' ? 'लेखक:' : 'Author:'} </span>
                    <Link href={`/author/${article.author.id}`} className="font-bold text-[var(--red)] hover:underline">
                      {authorName}
                    </Link>
                  </div>
                  <div className="text-[12px] text-[var(--ink-3)] mt-[2px]">
                    {language === 'gu' ? (
                      <span>પ્રકાશિત: {formatDate(article.publishedAt)}, {formatTime(article.publishedAt)} · <span className="text-[var(--red)] font-bold">અપડેટ: 25 મિનિટ પહેલાં</span></span>
                    ) : language === 'hi' ? (
                      <span>प्रकाशित: {formatDate(article.publishedAt)}, {formatTime(article.publishedAt)} · <span className="text-[var(--red)] font-bold">अपडेट: २५ मिनट पहले</span></span>
                    ) : (
                      <span>Published: {formatDate(article.publishedAt)}, {formatTime(article.publishedAt)} · <span className="text-[var(--red)] font-bold">Updated: 25m ago</span></span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[12.5px] text-[var(--ink-2)]">
                ⏱ {language === 'gu' ? `વાંચન સમય: ${article.readingTime} મિનિટ` : language === 'hi' ? `पठन समय: ${article.readingTime} मिनट` : `Read time: ${article.readingTime} mins`}
              </span>
            </div>

            {/* Gist: એક નજરમાં */}
            <div className="gist">
              <div className="gt">
                <span className="d"></span>
                <span>{language === 'gu' ? 'એક નજરમાં' : language === 'hi' ? 'एक नजर में' : 'At a Glance'}</span>
              </div>
              <ul>
                {gistPoints.map((point, index) => (
                  <li key={index}>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <figure className="article-fig">
              <div className="imgwrap relative aspect-[16/9] overflow-hidden bg-black rounded-lg shadow-sm">
                {/* 1 / 3 Indicator Badge */}
                <div className="absolute top-3.5 left-3.5 z-10 bg-black/75 backdrop-blur-sm text-white font-black text-xs px-2.5 py-1 rounded select-none shadow">
                  {language === 'gu'
                    ? `${toGu(activeImageIndex + 1)} / ${toGu(slideImages.length)}`
                    : language === 'hi'
                      ? `${activeImageIndex + 1} / ${slideImages.length}`
                      : `${activeImageIndex + 1} / ${slideImages.length}`}
                </div>

                {slideImages.map((src, index) => (
                  <div
                    key={src + index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === activeImageIndex ? 'opacity-100 z-1' : 'opacity-0 z-0'
                      }`}
                  >
                    <Image
                      src={src}
                      alt={`${article.title} slide ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                ))}
              </div>
              <figcaption>
                <span>
                  {isTrafficArticle && language === 'gu'
                    ? 'અમદાવાદના SG હાઈવે પર નવી ટ્રાફિક સિગ્નલ પ્રણાલી.'
                    : isTrafficArticle && language === 'hi'
                      ? 'अहमदाबाद के एसजी हाईवे पर नई ट्रैफिक संकेत प्रणाली।'
                      : isTrafficArticle
                        ? 'New traffic signal system on SG Highway in Ahmedabad.'
                        : title}
                </span>
                <span style={{ whiteSpace: 'nowrap' }}>
                  {language === 'gu' ? 'તસવીર: ગુજરાત પોસ્ટ' : language === 'hi' ? 'तस्वीर: गुजरात पोस्ट' : 'Photo: Gujarat Post'}
                </span>
              </figcaption>
            </figure>

            <div className="share-row-custom select-none flex flex-wrap gap-2.5 items-center mb-6">
              <span className="lbl font-extrabold text-neutral-800 dark:text-neutral-200 mr-2 text-[14.5px] tracking-wide">{language === 'gu' ? 'શેર કરો:' : language === 'hi' ? 'शेयर करें:' : 'Share:'}</span>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${title} ${articleUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                title={language === 'gu' ? 'વોટ્સએપ' : language === 'hi' ? 'व्हाट्सएप' : 'WhatsApp'}
                className="group flex items-center justify-center w-11 h-11 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-[#25D366]/10 hover:border-[#25D366]/30 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
              >
                <svg viewBox="0 0 24 24" className="w-[19px] h-[19px] shrink-0 transition-transform duration-300 group-hover:rotate-12">
                  <path fill="#25D366" d="M12.01 0a12 12 0 0 0-10.4 18l-1.6 5.8 6-1.6a12 12 0 1 0 6-22.2z" />
                  <path fill="#FFF" d="M16.9 14.1c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.5 0-.2-.1-.4-.2-.6-.2-.4-.7-1.7-1-2.3-.3-.6-.6-.5-.8-.5H8c-.2 0-.6.1-.9.4C6.8 7.3 6 8.1 6 9.8c0 1.7 1.2 3.4 1.4 3.6.2.2 2.4 3.7 5.9 5.2.8.3 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.1-.3-.2-.5-.3z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                target="_blank"
                rel="noreferrer"
                title={language === 'gu' ? 'ફેસબુક' : language === 'hi' ? 'फेसबुक' : 'Facebook'}
                className="group flex items-center justify-center w-11 h-11 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
              >
                <svg viewBox="0 0 24 24" className="w-[19px] h-[19px] shrink-0 transition-transform duration-300 group-hover:rotate-12">
                  <path fill="#1877F2" d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078v-3.47h3.047V9.35c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12z" />
                </svg>
              </a>

              {/* X (Twitter) */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(articleUrl)}`}
                target="_blank"
                rel="noreferrer"
                title={language === 'gu' ? 'પોસ્ટ' : language === 'hi' ? 'पोस्ट' : 'Post'}
                className="group flex items-center justify-center w-11 h-11 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0 text-neutral-800 dark:text-neutral-200 transition-transform duration-300 group-hover:rotate-12">
                  <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Dailyhunt */}
              <a
                href="https://profile.dailyhunt.in/gujaratpost"
                target="_blank"
                rel="noreferrer"
                title={language === 'gu' ? 'ડેઇલીહન્ટ' : language === 'hi' ? 'ડેલીહંત' : 'Dailyhunt'}
                className="group flex items-center justify-center w-11 h-11 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
              >
                <svg viewBox="0 0 48 48" className="w-[20px] h-[20px] shrink-0 transition-transform duration-300 group-hover:rotate-12">
                  <path fill="#093492" d="M20.99 12.49 C21.62 14.48 21.86 21.86 21.86 21.86 C21.86 21.86 14.15 21.83 12.51 21.18 C8.59 19.61 5.5 17.07 5.5 13.08 C5.5 9.13 8.64 5.64 12.94 5.64 C17.17 5.64 19.77 8.69 20.99 12.49 Z" />
                  <path fill="#FBBC05" d="M35.51 20.99 C33.52 21.62 26.14 21.86 26.14 21.86 C26.14 21.86 26.17 14.15 26.82 12.51 C28.39 8.59 30.93 5.5 34.92 5.5 C38.87 5.5 42.36 8.64 42.36 12.94 C42.36 17.17 39.31 19.77 35.51 20.99 Z" />
                  <path fill="#ED1C24" d="M27.01 35.51 C26.38 33.52 26.14 26.14 26.14 26.14 C26.14 26.14 33.85 26.17 35.49 26.82 C39.41 28.39 42.5 30.93 42.5 34.92 C42.5 38.87 39.36 42.36 35.06 42.36 C30.83 42.36 28.23 39.31 27.01 35.51 Z" />
                  <path fill="#47B609" d="M12.49 27.01 C14.48 26.38 21.86 26.14 21.86 26.14 C21.86 26.14 21.83 33.85 21.18 35.49 C19.61 39.41 17.07 42.5 13.08 42.5 C9.13 42.5 5.64 39.36 5.64 35.06 C5.64 30.83 8.69 28.23 12.49 27.01 Z" />
                </svg>
              </a>

              {/* Google News */}
              <a
                href="https://news.google.com/search?q=Gujarat+Post"
                target="_blank"
                rel="noreferrer"
                title={language === 'gu' ? 'ગૂગલ ન્યૂઝ' : language === 'hi' ? 'गूगल न्यूज़' : 'Google News'}
                className="group flex items-center justify-center w-11 h-11 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-[#4285F4]/10 hover:border-[#4285F4]/30 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0 transition-transform duration-300 group-hover:rotate-12">
                  <rect x="2" y="2" width="8" height="20" rx="1.5" fill="#4285F4" />
                  <rect x="12" y="3" width="10" height="3.5" rx="1" fill="#EA4335" />
                  <rect x="12" y="9" width="10" height="3.5" rx="1" fill="#FBBC05" />
                  <rect x="12" y="15" width="10" height="6" rx="1" fill="#34A853" />
                </svg>
              </a>

              {/* Print */}
              <button
                type="button"
                onClick={() => window.print()}
                title={language === 'gu' ? 'પ્રિન્ટ' : language === 'hi' ? 'प्रिंट' : 'Print'}
                className="group flex items-center justify-center w-11 h-11 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-none stroke-current stroke-2 shrink-0 transition-transform duration-300 group-hover:rotate-12" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
              </button>

              {/* Copy Link */}
              <button
                type="button"
                onClick={copyUrl}
                title={copied ? (language === 'gu' ? 'કૉપિ થઈ' : 'Copied') : (language === 'gu' ? 'લિંક કૉપિ કરો' : 'Copy Link')}
                className="group flex items-center justify-center w-11 h-11 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-[#B3121B]/10 hover:text-[#B3121B] hover:border-[#B3121B]/30 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-none stroke-current stroke-2 shrink-0 transition-transform duration-300 group-hover:rotate-12" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              </button>

              {/* Save */}
              <button
                type="button"
                onClick={handleToggleSave}
                title={saved ? (language === 'gu' ? 'સાચવેલું' : 'Saved') : (language === 'gu' ? 'સાચવો' : 'Save')}
                className="group flex items-center justify-center w-11 h-11 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-[#B3121B]/10 hover:text-[#B3121B] hover:border-[#B3121B]/30 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
              >
                <svg viewBox="0 0 24 24" className={`w-[18px] h-[18px] shrink-0 ${saved ? 'fill-current' : 'fill-none'} stroke-current stroke-2 transition-transform duration-300 group-hover:rotate-12`} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
              </button>

              {/* Audio */}
              <button
                type="button"
                onClick={toggleAudio}
                title={speaking ? (language === 'gu' ? 'બંધ કરો' : 'Stop') : (language === 'gu' ? 'ઓડિયો' : 'Audio')}
                className="group flex items-center justify-center w-11 h-11 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-[#B3121B]/10 hover:text-[#B3121B] hover:border-[#B3121B]/30 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-none stroke-current stroke-2 shrink-0 transition-transform duration-300 group-hover:rotate-12" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
              </button>
            </div>

            <div className="article-body">
              {(() => {
                if (isTrafficArticle) {
                  return (
                    <>
                      {paragraphs[0] && <p>{paragraphs[0]}</p>}
                      {paragraphs[1] && <p>{paragraphs[1]}</p>}

                      <blockquote>
                        <p>
                          {language === 'gu'
                            ? '"પ્રથમ 15 દિવસ અમે નાગરિકોને જાગૃત કરીશું, ત્યારબાદ નિયમોનો કડક અમલ થશે."'
                            : language === 'hi'
                              ? '"पहले १५ दिन हम नागरिकों को जागरूक करेंगे, उसके बाद नियमों का कड़ा पालन होगा।"'
                              : '"For the first 15 days we will raise awareness among citizens, after which the rules will be strictly enforced."'}
                        </p>
                        <cite>
                          {language === 'gu'
                            ? '— પોલીસ કમિશનર, અમદાવાદ'
                            : language === 'hi'
                              ? '— पुलिस आयुक्त, अहमदाबाद'
                              : '— Police Commissioner, Ahmedabad'}
                        </cite>
                      </blockquote>

                      <figure className="article-fig">
                        <div className="imgwrap relative aspect-[16/9]">
                          <Image src="/assets/demo/5.jpg" alt="Traffic Rule E-Challan" fill className="object-cover" />
                        </div>
                        <figcaption>
                          <span>
                            {language === 'gu'
                              ? 'નવી સિસ્ટમ હેઠળ ઈ-ચલણ કઈ રીતે જનરેટ થાય છે તે દર્શાવતું દૃશ્ય.'
                              : language === 'hi'
                                ? 'नई प्रणाली के तहत ई-चालान कैसे उत्पन्न होता है, यह दर्शाता एक दृश्य।'
                                : 'A view showing how e-challans are generated under the new system.'}
                          </span>
                          <span style={{ whiteSpace: 'nowrap' }}>
                            {language === 'gu' ? 'તસવીર: ગુજરાત પોસ્ટ' : language === 'hi' ? 'तस्वीर: गुजरात पोस्ट' : 'Photo: Gujarat Post'}
                          </span>
                        </figcaption>
                      </figure>

                      {paragraphs.slice(2).map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </>
                  );
                } else if (paragraphs.length >= 3) {
                  return (
                    <>
                      <p>{paragraphs[0]}</p>
                      <p>{paragraphs[1]}</p>



                      <blockquote>
                        <p>"{title}"</p>
                        <cite>— {authorName}, {authorDesignation}</cite>
                      </blockquote>

                      <figure className="article-fig">
                        <div className="imgwrap relative aspect-[16/9]">
                          <Image src="/assets/demo/3.jpg" alt="Featured Coverage" fill className="object-cover" />
                        </div>
                        <figcaption>
                          <span>{excerpt}</span>
                          <span style={{ whiteSpace: 'nowrap' }}>
                            {language === 'gu' ? 'તસવીર: ગુજરાત પોસ્ટ' : language === 'hi' ? 'तस्वीर: गुजरात पोस्ट' : 'Photo: Gujarat Post'}
                          </span>
                        </figcaption>
                      </figure>

                      {paragraphs.slice(2).map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </>
                  );
                } else {
                  return (
                    <>
                      {paragraphs.map((p, idx) => (
                        <div key={idx}>
                          <p>{p}</p>

                        </div>
                      ))}
                    </>
                  );
                }
              })()}
            </div>



          </article>

          <aside className="side select-none" style={{ alignSelf: 'stretch' }}>
            <div className="side-sticky" style={{ top: '24px' }}>
              {/* Most Read widget */}
              <div className="mostread">
                <div className="wtitle">
                  <span className="d"></span>
                  <span>{language === 'gu' ? 'સૌથી વધુ વંચાયેલા' : language === 'hi' ? 'सबसे ज्यादा पढ़े गए' : 'Most Read'}</span>
                </div>
                <div className="space-y-0 mt-3">
                  {trending.slice(0, 5).map((item, index) => {
                    const rankNum = String(index + 1);

                    return (
                      <Link key={item.id} href={`/news/${item.slug}`} className="s-rank hover:opacity-85 transition-opacity">
                        <span className="n">{rankNum}</span>
                        <h3>{getArticleTitle(item, language)}</h3>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Advertisement */}
              <Advertisement position="sidebar" />

              {/* Recommended stories */}
              <div>
                <div className="wtitle">
                  <span className="d"></span>
                  <span>{language === 'gu' ? 'તમારા માટે ભલામણ' : language === 'hi' ? 'आपके लिए अनुशंसित' : 'Recommended Stories'}</span>
                </div>
                <div className="space-y-0 mt-3">
                  {related.slice(0, 5).map((item) => {
                    const itemTitle = getArticleTitle(item, language);
                    const itemCategory = getCategoryLabel(item, language);
                    return (
                      <Link key={item.id} href={`/news/${item.slug}`} className="s-compact hover:opacity-85 transition-opacity">
                        <div>
                          <span className="kick">{itemCategory}</span>
                          <h3>{itemTitle}</h3>
                          <div className="meta">
                            <span>{formatDate(item.publishedAt)}</span>
                          </div>
                        </div>
                        <div className="imgwrap">
                          <Image src={item.image} alt={item.title} fill sizes="92px" className="object-cover" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* WhatsApp Promo Card */}
              <div className="wa-card">
                <div className="h">
                  <span className="wi">💬</span>
                  <span>WhatsApp ચેનલ</span>
                </div>
                <p>
                  {language === 'gu'
                    ? 'તમારા શહેરના સમાચાર સૌથી પહેલા સીધા તમારા ફોન પર મેળવો.'
                    : language === 'hi'
                      ? 'अपने शहर की खबरें सबसे पहले सीधे अपने फोन पर प्राप्त करें।'
                      : 'Get breaking news first directly on your phone.'}
                </p>
                <button type="button">
                  {language === 'gu' ? 'ચેનલ ફોલો કરો' : language === 'hi' ? 'चैनल फॉलो करें' : 'Follow Channel'}
                </button>
              </div>

              {/* Trending Topics Tags */}
              {/* <div className="mt-6">
                <div className="flex items-center gap-2 border-b-2 border-[#B3121B] pb-2.5 mb-3.5">
                  <span className="bg-[#B3121B] text-white font-black text-[12px] px-2.5 py-0.5 rounded-sm select-none tracking-wide uppercase">
                    Trending Topics
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.slice(0, 8).map((tag, index) => (
                    <Link
                      key={index}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="group inline-flex items-center gap-0.5 border-2 border-[#B3121B]/30 text-[12px] font-black px-3 py-1.5 rounded-full text-foreground hover:border-[#B3121B] hover:bg-[#B3121B] hover:text-white transition-all bg-card cursor-pointer select-none shadow-sm hover:shadow-md"
                    >
                      <span className="text-[#B3121B] font-black group-hover:text-white transition-colors">#</span>{tag}
                    </Link>
                  ))}
                </div>
              </div> */}
            </div>
          </aside>
        </div>

        <section className="art-related select-none w-full">
          <div className="deskhead">
            <h2>{getLocalized(language, { en: 'Related Stories', gu: 'સંબંધિત સમાચાર', hi: 'संबंधित खबरें' })}</h2>
            <span className="spacer"></span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-1.5 md:gap-x-2 gap-y-6">
            {related.slice(0, 6).map((item) => {
              const itemTitle = getArticleTitle(item, language);
              const itemCategory = getCategoryLabel(item, language);
              const isSaved = savedIds.includes(item.id);
              return (
                <div key={item.id} className="zoomhost relative group flex flex-col">
                  <Link href={`/news/${item.slug}`} className="s-standard flex flex-col group">
                    <div className="imgwrap relative aspect-[3/2] overflow-hidden rounded-md mb-2">
                      <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-300 group-hover:scale-105" />
                      {isSaved && (
                        <span className="absolute top-2 right-2 z-10 bg-white/90 dark:bg-black/90 p-1.5 rounded-full text-xs shadow-md">
                          🔖
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="kick mb-1 mt-0.5">{itemCategory}</span>
                      <h3 className="line-clamp-3 leading-snug text-foreground hover:text-accent transition-colors">
                        {itemTitle}
                      </h3>
                      <div className="meta select-none">
                        <span>{formatDate(item.publishedAt)}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', padding: '42px 0 4px' }}>
            <button type="button" className="art-more-btn">
              {language === 'gu' ? 'વધુ લેખ જુઓ ↓' : language === 'hi' ? 'अधिक समाचार देखें ↓' : 'View More Stories ↓'}
            </button>
          </div>
        </section>

        <div className="article-grid mt-8 border-t border-neutral-200 dark:border-neutral-800 !pt-8">
          <article className="article-stream-container select-none w-full">
            <div className="space-y-8">
              {(() => {
                const streamList = [...related, ...trending]
                  .filter((item, index, self) => self.findIndex(t => t.id === item.id) === index && item.id !== article.id)
                  .slice(0, 5);

                return streamList.map((streamArticle) => {
                  const streamTitle = getArticleTitle(streamArticle, language);
                  const streamExcerpt = getArticleExcerpt(streamArticle, language);
                  const streamCategory = getCategoryLabel(streamArticle, language);
                  const streamParagraphs = getArticleContent(streamArticle, language).split('\n\n');
                  const streamCity = language === 'gu' ? 'અમદાવાદ' : language === 'hi' ? 'अहमदाबाद' : 'Ahmedabad';

                  const readAlsoArticles = [...related, ...trending]
                    .filter(a => a.id !== streamArticle.id && a.id !== article.id)
                    .slice(0, 4);

                  return (
                    <div key={streamArticle.id} className="article-stream-item border-b border-neutral-200 dark:border-neutral-800 pb-8 last:border-b-0 text-left flex flex-col items-start w-full">
                      <nav className="breadcrumb select-none flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-neutral-500 font-medium mb-3 w-full text-left justify-start">
                        <Link href="/" className="hover:text-[var(--red)] transition-colors">
                          {language === 'gu' ? 'હોમ' : language === 'hi' ? 'होम' : 'Home'}
                        </Link>
                        <span>/</span>
                        <Link href={`/category/${streamArticle.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-[var(--red)] transition-colors">
                          {streamCategory}
                        </Link>
                        <span>/</span>
                        <span>{streamCity}</span>
                        <span className="mx-0.5">:</span>
                        <span className="text-red-700 dark:text-red-400 font-bold">
                          {streamTitle}
                        </span>
                      </nav>

                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-foreground tracking-tight mb-4 text-left w-full">
                        {streamTitle}
                      </h2>

                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black rounded-lg shadow-sm mb-6 mt-4">
                        <Image
                          src={streamArticle.image}
                          alt={streamTitle}
                          fill
                          sizes="(max-width: 1024px) 100vw, 760px"
                          className="object-cover"
                        />
                      </div>

                      <div className="text-[16px] leading-relaxed text-foreground space-y-4 mb-6 text-left w-full">
                        {streamParagraphs.map((p, pIdx) => (
                          <p key={pIdx}>{p}</p>
                        ))}
                      </div>

                      {readAlsoArticles.length > 0 && (
                        <div className="w-full my-6 bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl p-5 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="w-1 h-4 bg-red-600 rounded-full"></span>
                            <h4 className="font-extrabold text-[14px] uppercase tracking-wider text-red-600 dark:text-red-400">
                              {language === 'gu' ? 'આ પણ વાંચો' : language === 'hi' ? 'यह भी पढ़ें' : 'Read Also'}
                            </h4>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {readAlsoArticles.map((raArt) => {
                              const raTitle = getArticleTitle(raArt, language);
                              return (
                                <Link
                                  key={raArt.id}
                                  href={`/news/${raArt.slug}`}
                                  className="group flex gap-4 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800/40 bg-white dark:bg-neutral-900/60 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:border-red-500/20 hover:shadow-sm transition-all duration-300 items-center text-left"
                                >
                                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-sm animate-pulse-once">
                                    <Image
                                      src={raArt.image}
                                      alt={raTitle}
                                      fill
                                      sizes="96px"
                                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="line-clamp-2 text-[13.5px] font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200 leading-snug">
                                      {raTitle}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-5 select-none">
                        <span className="font-extrabold text-neutral-900 dark:text-white mr-2 text-[14.5px] tracking-wide uppercase border-b-2 border-[#B3121B] pb-0.5">
                          {language === 'gu' ? 'ટોપિક્સ:' : language === 'hi' ? 'विषय:' : 'Topics:'}
                        </span>
                        {getStreamTags(streamArticle).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="cursor-pointer bg-white dark:bg-neutral-900 hover:bg-[#B3121B] dark:hover:bg-[#B3121B] text-neutral-800 dark:text-neutral-200 hover:text-white dark:hover:text-white rounded-full px-4 py-1.5 text-xs font-bold border border-red-600/30 dark:border-red-500/20 hover:border-[#B3121B] dark:hover:border-[#B3121B] shadow-sm transition-all duration-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </article>

          <aside className="select-none" style={{ width: '100%', maxWidth: '336px' }}>
            <div style={{ position: 'sticky', top: '24px', height: 'fit-content' }}>
              <div>
                <div className="wtitle">
                  <span className="d"></span>
                  <span>{language === 'gu' ? 'તમારા માટે ભલામણ' : language === 'hi' ? 'आपके लिए अनुशंसित' : 'Recommended Stories'}</span>
                </div>
                <div className="space-y-0 mt-3">
                  {related.slice(0, 4).map((item) => {
                    const itemTitle = getArticleTitle(item, language);
                    const itemCategory = getCategoryLabel(item, language);
                    return (
                      <Link key={item.id} href={`/news/${item.slug}`} className="s-compact hover:opacity-85 transition-opacity">
                        <div>
                          <span className="kick">{itemCategory}</span>
                          <h3>{itemTitle}</h3>
                          <div className="meta">
                            <span>{formatDate(item.publishedAt)}</span>
                          </div>
                        </div>
                        <div className="imgwrap">
                          <Image src={item.image} alt={item.title} fill sizes="92px" className="object-cover" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Sponsored Native Ads Section (Taboola/Outbrain Style Grid) */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 mt-12 w-full select-none">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[11px] font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-widest">Sponsored Links</span>
            <span className="text-[10px] text-neutral-450 dark:text-neutral-500 hover:underline cursor-pointer">Ad Choices ⓘ</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Ad Card 1 */}
            <div className="flex flex-col text-left group cursor-pointer">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40">
                <Image
                  src="/assets/demo/2.jpg"
                  alt="Roi Native Creative Test"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="font-bold text-[14px] md:text-[15px] text-neutral-900 dark:text-neutral-100 mt-2.5 leading-snug group-hover:underline line-clamp-2">
                Roi Native Creative Test
              </h3>
              <span className="text-[11px] text-neutral-450 dark:text-neutral-500 mt-1">
                Taboola | Sponsored
              </span>
            </div>

            {/* Ad Card 2 */}
            <div className="flex flex-col text-left group cursor-pointer">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40">
                <Image
                  src="/assets/demo/3.jpg"
                  alt="Demo Creative Library"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="font-bold text-[14px] md:text-[15px] text-neutral-900 dark:text-neutral-100 mt-2.5 leading-snug group-hover:underline line-clamp-2">
                Demo Creative Library - Sample Advertisement for Businesses
              </h3>
              <span className="text-[11px] text-neutral-450 dark:text-neutral-500 mt-1">
                test | Sponsored
              </span>
            </div>

            {/* Ad Card 3 */}
            <div className="flex flex-col text-left group cursor-pointer">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40">
                <Image
                  src="/assets/demo/4.jpg"
                  alt="Cher's Son Is Probably..."
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="font-bold text-[14px] md:text-[15px] text-neutral-900 dark:text-neutral-100 mt-2.5 leading-snug group-hover:underline line-clamp-2">
                Cher's Son Is Probably The Most Handsome Man To Ever Live
              </h3>
              <span className="text-[11px] text-neutral-450 dark:text-neutral-500 mt-1">
                Novelodge | Sponsored
              </span>
            </div>

            {/* Ad Card 4 */}
            <div className="flex flex-col text-left group cursor-pointer">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40">
                <Image
                  src="/assets/demo/5.jpg"
                  alt="description"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="font-bold text-[14px] md:text-[15px] text-neutral-900 dark:text-neutral-100 mt-2.5 leading-snug group-hover:underline line-clamp-2">
                description
              </h3>
              <span className="text-[11px] text-neutral-450 dark:text-neutral-500 mt-1">
                sharon-js-tags-test | Sponsored
              </span>
            </div>

            {/* Ad Card 5 */}
            <div className="flex flex-col text-left group cursor-pointer">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40">
                <Image
                  src="/assets/demo/6.jpg"
                  alt="Cats That Headbutt..."
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="font-bold text-[14px] md:text-[15px] text-neutral-900 dark:text-neutral-100 mt-2.5 leading-snug group-hover:underline line-clamp-2">
                Cats That Headbutt Their Owners Are Actually Trying to Tell Them Something
              </h3>
              <span className="text-[11px] text-neutral-450 dark:text-neutral-500 mt-1">
                Novelodge | Sponsored
              </span>
            </div>

            {/* Ad Card 6 */}
            <div className="flex flex-col text-left group cursor-pointer">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40">
                <Image
                  src="/assets/demo/7.jpg"
                  alt="Lakeside living"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="font-bold text-[14px] md:text-[15px] text-neutral-900 dark:text-neutral-100 mt-2.5 leading-snug group-hover:underline line-clamp-2">
                {language === 'gu'
                  ? 'અમદાવાદમાં લેકસાઇડ લિવિંગ | તમારો પ્લોટ બુક કરો'
                  : language === 'hi'
                    ? 'अहमदाबाद में लेकसाइड लिविंग | अपना प्लॉट बुक करें'
                    : 'Lakeside living in Ahmedabad | Book your plot today'}
              </h3>
              <span className="text-[11px] text-neutral-450 dark:text-neutral-500 mt-1">
                {language === 'gu' ? 'અમદાવાદ રીઅલ એસ્ટેટ | પ્રાયોજિત' : language === 'hi' ? 'अहमदाबाद रियल एस्टेट | प्रायोजित' : 'Ahmedabad Real Estate | Sponsored'}
              </span>
            </div>

            <div className="flex flex-col text-left group cursor-pointer">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40">
                <Image
                  src="/assets/demo/7.jpg"
                  alt="Lakeside living"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="font-bold text-[14px] md:text-[15px] text-neutral-900 dark:text-neutral-100 mt-2.5 leading-snug group-hover:underline line-clamp-2">
                {language === 'gu'
                  ? 'અમદાવાદમાં લેકસાઇડ લિવિંગ | તમારો પ્લોટ બુક કરો'
                  : language === 'hi'
                    ? 'अहमदाबाद में लेकसाइड लिविंग | अपना प्लॉट बुक करें'
                    : 'Lakeside living in Ahmedabad | Book your plot today'}
              </h3>
              <span className="text-[11px] text-neutral-450 dark:text-neutral-500 mt-1">
                {language === 'gu' ? 'અમદાવાદ રીઅલ એસ્ટેટ | પ્રાયોજિત' : language === 'hi' ? 'अहमदाबाद रियल एस्टेट | प्रायोजित' : 'Ahmedabad Real Estate | Sponsored'}
              </span>
            </div>

            <div className="flex flex-col text-left group cursor-pointer">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40">
                <Image
                  src="/assets/demo/7.jpg"
                  alt="Lakeside living"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="font-bold text-[14px] md:text-[15px] text-neutral-900 dark:text-neutral-100 mt-2.5 leading-snug group-hover:underline line-clamp-2">
                {language === 'gu'
                  ? 'અમદાવાદમાં લેકસાઇડ લિવિંગ | તમારો પ્લોટ બુક કરો'
                  : language === 'hi'
                    ? 'अहमदाबाद में लेकसाइड लिविंग | अपना प्लॉट बुक करें'
                    : 'Lakeside living in Ahmedabad | Book your plot today'}
              </h3>
              <span className="text-[11px] text-neutral-450 dark:text-neutral-500 mt-1">
                {language === 'gu' ? 'અમદાવાદ રીઅલ એસ્ટેટ | પ્રાયોજિત' : language === 'hi' ? 'अहमदाबाद रियल एस्टेट | प्रायोजित' : 'Ahmedabad Real Estate | Sponsored'}
              </span>
            </div>

            <div className="flex flex-col text-left group cursor-pointer">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40">
                <Image
                  src="/assets/demo/7.jpg"
                  alt="Lakeside living"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="font-bold text-[14px] md:text-[15px] text-neutral-900 dark:text-neutral-100 mt-2.5 leading-snug group-hover:underline line-clamp-2">
                {language === 'gu'
                  ? 'અમદાવાદમાં લેકસાઇડ લિવિંગ | તમારો પ્લોટ બુક કરો'
                  : language === 'hi'
                    ? 'अहमदाबाद में लेकसाइड लिविंग | अपना प्लॉट बुक करें'
                    : 'Lakeside living in Ahmedabad | Book your plot today'}
              </h3>
              <span className="text-[11px] text-neutral-450 dark:text-neutral-500 mt-1">
                {language === 'gu' ? 'અમદાવાદ રીઅલ એસ્ટેટ | પ્રાયોજિત' : language === 'hi' ? 'अहमदाबाद रियल एस्टेट | प्रायोजित' : 'Ahmedabad Real Estate | Sponsored'}
              </span>
            </div>

            <div className="flex flex-col text-left group cursor-pointer">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40">
                <Image
                  src="/assets/demo/7.jpg"
                  alt="Lakeside living"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="font-bold text-[14px] md:text-[15px] text-neutral-900 dark:text-neutral-100 mt-2.5 leading-snug group-hover:underline line-clamp-2">
                {language === 'gu'
                  ? 'અમદાવાદમાં લેકસાઇડ લિવિંગ | તમારો પ્લોટ બુક કરો'
                  : language === 'hi'
                    ? 'अहमदाबाद में लेकसाइड लिविंग | अपना प्लॉट बुक करें'
                    : 'Lakeside living in Ahmedabad | Book your plot today'}
              </h3>
              <span className="text-[11px] text-neutral-450 dark:text-neutral-500 mt-1">
                {language === 'gu' ? 'અમદાવાદ રીઅલ એસ્ટેટ | પ્રાયોજિત' : language === 'hi' ? 'अहमदाबाद रियल एस्टेट | प्रायोजित' : 'Ahmedabad Real Estate | Sponsored'}
              </span>
            </div>

            <div className="flex flex-col text-left group cursor-pointer">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40">
                <Image
                  src="/assets/demo/7.jpg"
                  alt="Lakeside living"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="font-bold text-[14px] md:text-[15px] text-neutral-900 dark:text-neutral-100 mt-2.5 leading-snug group-hover:underline line-clamp-2">
                {language === 'gu'
                  ? 'અમદાવાદમાં લેકસાઇડ લિવિંગ | તમારો પ્લોટ બુક કરો'
                  : language === 'hi'
                    ? 'अहमदाबाद में लेकसाइड लिविंग | अपना प्लॉट बुक करें'
                    : 'Lakeside living in Ahmedabad | Book your plot today'}
              </h3>
              <span className="text-[11px] text-neutral-450 dark:text-neutral-500 mt-1">
                {language === 'gu' ? 'અમદાવાદ રીઅલ એસ્ટેટ | પ્રાયોજિત' : language === 'hi' ? 'अहमदाबाद रियल एस्टेट | प्रायोजित' : 'Ahmedabad Real Estate | Sponsored'}
              </span>
            </div>

            <div className="flex flex-col text-left group cursor-pointer">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40">
                <Image
                  src="/assets/demo/7.jpg"
                  alt="Lakeside living"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="font-bold text-[14px] md:text-[15px] text-neutral-900 dark:text-neutral-100 mt-2.5 leading-snug group-hover:underline line-clamp-2">
                {language === 'gu'
                  ? 'અમદાવાદમાં લેકસાઇડ લિવિંગ | તમારો પ્લોટ બુક કરો'
                  : language === 'hi'
                    ? 'अहमदाबाद में लेकसाइड लिविंग | अपना प्लॉट बुक करें'
                    : 'Lakeside living in Ahmedabad | Book your plot today'}
              </h3>
              <span className="text-[11px] text-neutral-450 dark:text-neutral-500 mt-1">
                {language === 'gu' ? 'અમદાવાદ રીઅલ એસ્ટેટ | પ્રાયોજિત' : language === 'hi' ? 'अहमदाबाद रियल एस्टेट | प्रायोजित' : 'Ahmedabad Real Estate | Sponsored'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: '50px' }} />
    </>
  );
}
