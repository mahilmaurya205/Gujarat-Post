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
  const guDigits = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];
  return String(n).replace(/\d/g, (d) => guDigits[+d]);
}

export default function NewsDetailClient({ article, related, trending, articleUrl }: Props) {
  const { language } = useApp();
  const [progress, setProgress] = useState(0);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
      return ['ચૂંટણી ૨૦૨૭', 'વરસાદ', 'સોના-ચાંદી', 'ક્રિકેટ', 'મેટ્રો', 'સેમિકન્ડક્ટર', 'ડાયમંડ ઉદ્યોગ', 'ટ્રાફિક'];
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

  return (
    <>
      <div className="reading-progress" style={{ width: `${progress}%` }} />
      <div className="wrap py-6">
        <div className="article-grid">
          <article>
            <nav className="breadcrumb select-none">
              <Link href="/">
                {language === 'gu' ? 'હોમ' : language === 'hi' ? 'होम' : 'Home'}
              </Link>
              <span>›</span>
              <Link href={`/category/${article.category.toLowerCase().replace(/\s+/g, '-')}`}>{article.category}</Link>
              <span>›</span>
              <span>{article.title}</span>
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
                      <span>પ્રકાશિત: {formatDate(article.publishedAt)}, {formatTime(article.publishedAt)} · <span className="text-[var(--red)] font-bold">અપડેટ: ૨૫ મિનિટ પહેલાં</span></span>
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
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      index === activeImageIndex ? 'opacity-100 z-1' : 'opacity-0 z-0'
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
                      ? 'अहमदाबाद के एसजी हाईवे पर नई ट्रैफिक सिग्नल प्रणाली।'
                      : isTrafficArticle
                        ? 'New traffic signal system on SG Highway in Ahmedabad.'
                        : title}
                </span>
                <span style={{ whiteSpace: 'nowrap' }}>
                  {language === 'gu' ? 'તસવીર: ગુજરાત પોસ્ટ' : language === 'hi' ? 'तस्वीर: गुजरात पोस्ट' : 'Photo: Gujarat Post'}
                </span>
              </figcaption>
            </figure>

            <div className="share-row select-none">
              <span className="lbl">{language === 'gu' ? 'શેર કરો:' : language === 'hi' ? 'शेयर करें:' : 'Share:'}</span>
              <a href={shareLinks.find(s => s.label === 'WhatsApp')?.href} target="_blank" rel="noreferrer" className="share-wa">
                <span>વોટ્સએપ</span>
              </a>
              <a href={shareLinks.find(s => s.label === 'Facebook')?.href} target="_blank" rel="noreferrer" className="share-fb">
                <span>ફેસબુક</span>
              </a>
              <a href={shareLinks.find(s => s.label === 'X')?.href} target="_blank" rel="noreferrer" className="share-x">
                <span>પોસ્ટ</span>
              </a>
              <button type="button" onClick={copyUrl} className="share-cp">
                <span>🔗 {copied ? (language === 'gu' ? 'કૉપિ થઈ' : 'Copied') : (language === 'gu' ? 'લિંક કૉપિ કરો' : 'Copy Link')}</span>
              </button>
              <button type="button" onClick={handleToggleSave} className="share-cp">
                <span>🔖 {saved ? (language === 'gu' ? 'સાચવેલું' : 'Saved') : (language === 'gu' ? 'સાચવો' : 'Save')}</span>
              </button>
              <button type="button" onClick={toggleAudio} className="share-cp">
                <span>🔊 {speaking ? (language === 'gu' ? 'બંધ કરો' : 'Stop') : (language === 'gu' ? 'ઓડિયો' : 'Audio')}</span>
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
                            ? '"પ્રથમ ૧૫ દિવસ અમે નાગરિકોને જાગૃત કરીશું, ત્યારબાદ નિયમોનો કડક અમલ થશે."'
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

          <aside className="side select-none">
            <div className="side-sticky">
              {/* Most Read widget */}
              <div className="mostread">
                <div className="wtitle">
                  <span className="d"></span>
                  <span>{language === 'gu' ? 'સૌથી વધુ વંચાયેલા' : language === 'hi' ? 'सबसे ज्यादा पढ़े गए' : 'Most Read'}</span>
                </div>
                <div className="space-y-0 mt-3">
                  {trending.slice(0, 4).map((item, index) => {
                    const rankNum = language === 'gu'
                      ? ['૧', '૨', '૩', '૪', '૫'][index]
                      : language === 'hi'
                        ? ['१', '२', '३', '४', '५'][index]
                        : String(index + 1);

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
                  {related.slice(0, 6).map((item) => {
                    const itemTitle = getArticleTitle(item, language);
                    const itemCategory = getCategoryLabel(item, language);
                    return (
                      <Link key={item.id} href={`/news/${item.slug}`} className="s-compact hover:opacity-85 transition-opacity">
                        <div>
                          <span className="kick">{itemCategory}</span>
                          <h3>{itemTitle}</h3>
                          <div className="meta">
                            <span>{formatDate(item.publishedAt)}</span>
                            <span>·</span>
                            <span>👁 {formatViews(item.views)}</span>
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
              <div>
                <div className="wtitle">
                  <span className="d"></span>
                  <span>{language === 'gu' ? 'ટ્રેન્ડિંગ વિષયો' : language === 'hi' ? 'ट्रेंडिंग विषय' : 'Trending Topics'}</span>
                </div>
                <div className="sidetags">
                  {trendingTopics.slice(0, 8).map((tag, index) => (
                    <span key={index}>#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="art-related select-none">
          <div className="deskhead">
            <h2>{getLocalized(language, { en: 'Related Stories', gu: 'સંબંધિત સમાચાર', hi: 'संबंधित खबरें' })}</h2>
            <span className="spacer"></span>
          </div>
          <div className="grid-3">
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
                        <span>·</span>
                        <span className="flex items-center gap-0.5">👁 {formatViews(item.views)}</span>
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
      </div>
      <div style={{ height: '50px' }} />
    </>
  );
}
