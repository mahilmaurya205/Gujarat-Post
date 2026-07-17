'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Clock } from 'lucide-react';
import { Article } from '@/types';
import { useApp } from '@/components/AppProvider';
import {
  getLocalized,
  getArticleTitle,
  getArticleExcerpt,
  getCategoryLabel,
  formatViews,
  formatDate,
  ARTICLES,
} from '@/data';
import { getCategoryColor } from '@/lib/utils';
import NewsCard from '@/components/ui/NewsCard';

/* ── Types ────────────────────────────────────────────────── */
interface Props {
  articles: Article[];
  category: { name: string; nameGu: string; nameHi: string };
  trending: Article[];
  currentPage: number;
  totalPages: number;
  slug: string;
}

type FilterTab = 'all' | 'latest' | 'analysis' | 'video' | 'photo';

/* ── Gujarati numerals ─────────────────────────────────────── */
function toGu(n: number | string) {
  const guDigits = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];
  return String(n).replace(/\d/g, (d) => guDigits[+d]);
}

/* ── Gujarat category specific mockup data ─────────────────── */
const GUJARAT_MOCK_ARTICLES = [
  {
    id: 'g-hero',
    slug: 'anand-dairy-expansion-project-inauguration-349',
    title: 'Anand Dairy Union new plant expansion! Farmers to benefit directly',
    titleGu: 'આણંદ ડેરી સંઘનું નવું પ્લાન્ટ વિસ્તરણ! ખેડૂતોને સીધો ફાયદો થશે',
    titleHi: 'आनंद डेयरी संघ का नया प्लांट विस्तार! किसानों को होगा सीधा फायदा',
    excerpt: 'આણંદ ડેરી સંઘના નવા પ્લાન્ટ વિસ્તરણનું કામ પૂર્ણ થયું છે. આ પ્રોજેક્ટથી હજારો દૂધ ઉત્પાદક ખેડૂતોને સીધો લાભ મળશે.',
    excerptGu: 'આણંદ ડેરી સંઘના નવા પ્લાન્ટ વિસ્તરણનું કામ પૂર્ણ થયું છે. આ પ્રોજેક્ટથી હજારો દૂધ ઉત્પાદક ખેડૂતોને સીધો લાભ મળશે.',
    excerptHi: 'आनंद डेयरी संघ का नया प्लांट विस्तार! किसानों को होगा सीधा फायदा',
    content: '', contentGu: '', contentHi: '',
    image: '/assets/demo/1.jpg',
    category: 'Anand',
    categoryGu: 'આણંદ',
    categoryHi: 'आनंद',
    tags: ['આણંદ'], tagsGu: ['આણંદ'], tagsHi: ['आनंद'],
    author: { id: 'a1', name: 'Rajesh Patel', nameGu: 'રાજેશ પટેલ', nameHi: 'રાજેશ પટેલ', image: '', designation: '', designationGu: '', designationHi: '', bio: '', bioGu: '', bioHi: '' },
    publishedAt: '2026-07-15T09:00:00Z',
    updatedAt: '',
    readingTime: 2,
    isTrending: true, isBreaking: false, isFeatured: true,
    views: 71000,
    relativeTimeGu: '૬ કલાક પહેલાં',
    relativeTime: '6 hours ago',
    relativeTimeHi: '6 घंटे पहले',
    viewsGu: '૭૧K'
  },
  {
    id: 'g-top1',
    slug: 'state-cabinet-meeting-major-decisions-348',
    title: 'Major decisions in state cabinet meeting, know what changed',
    titleGu: 'રાજ્ય મંત્રીમંડળની બેઠકમાં મોટા નિર્ણય, જાણો શું-શું બદલાયું',
    titleHi: 'राज्य मंत्रिमंडल की बैठक में बड़े फैसले, जानें क्या बदला',
    excerpt: '', excerptGu: '', excerptHi: '',
    content: '', contentGu: '', contentHi: '',
    image: '/assets/demo/4.jpg',
    category: 'Gandhinagar',
    categoryGu: 'ગાંધીનગર',
    categoryHi: 'गांधीनगर',
    tags: ['ગાંધીનગર'], tagsGu: ['ગાંધીનગર'], tagsHi: ['गांधीनगर'],
    author: { id: 'a1', name: 'Rajesh Patel', nameGu: 'રાજેશ પટેલ', nameHi: 'રાજેશ પટેલ', image: '', designation: '', designationGu: '', designationHi: '', bio: '', bioGu: '', bioHi: '' },
    publishedAt: '2026-07-15T10:00:00Z',
    updatedAt: '',
    readingTime: 2,
    isTrending: true, isBreaking: false, isFeatured: true,
    views: 68000,
    relativeTimeGu: '૫ કલાક પહેલાં',
    relativeTime: '5 hours ago',
    relativeTimeHi: '5 घंटे पहले',
    viewsGu: '૬૮K'
  },
  {
    id: 'g-top2',
    slug: 'girnar-ropeway-tourist-rush-increases-tremendously-205',
    title: 'Tourists flock to Girnar Ropeway! Tremendous increase in numbers',
    titleGu: 'ગિરનાર રોપ-વે પર ઉમટ્યા પ્રવાસીઓ! સંખ્યામાં જોરદાર વધારો',
    titleHi: 'गिरनार रोपवे पर उमड़े पर्यटक! संख्या में भारी बढ़ोतरी',
    excerpt: '', excerptGu: '', excerptHi: '',
    content: '', contentGu: '', contentHi: '',
    image: '/assets/demo/3.jpg',
    category: 'Junagadh',
    categoryGu: 'જૂનાગઢ',
    categoryHi: 'जूनागढ़',
    tags: ['જૂનાગઢ'], tagsGu: ['જૂનાગઢ'], tagsHi: ['जूनागढ़'],
    author: { id: 'a1', name: 'Rajesh Patel', nameGu: 'રાજેશ પટેલ', nameHi: 'રાજેશ પટેલ', image: '', designation: '', designationGu: '', designationHi: '', bio: '', bioGu: '', bioHi: '' },
    publishedAt: '2026-07-15T11:00:00Z',
    updatedAt: '',
    readingTime: 2,
    isTrending: true, isBreaking: false, isFeatured: true,
    views: 52000,
    relativeTimeGu: '૪ કલાક પહેલાં',
    relativeTime: '4 hours ago',
    relativeTimeHi: '4 घंटे पहले',
    viewsGu: '૫૨K'
  },
  {
    id: 'g-top3',
    slug: 'bhavnagar-new-industrial-units-approved-347',
    title: 'Bhavnagar gets big gift! New industrial unit approved, hope of jobs',
    titleGu: 'ભાવનગરને મળી મોટી ભેટ! નવા ઔદ્યોગિક એકમને મંજૂરી, રોજગારીની આશા',
    titleHi: 'भावनगर को मिला बड़ा तोहफा! नए औद्योगिक इकाई को मंजूरी',
    excerpt: '', excerptGu: '', excerptHi: '',
    content: '', contentGu: '', contentHi: '',
    image: '/assets/demo/5.jpg',
    category: 'Bhavnagar',
    categoryGu: 'ભાવનગર',
    categoryHi: 'भावनगर',
    tags: ['ભાવનગર'], tagsGu: ['ભાવનગર'], tagsHi: ['भावनगर'],
    author: { id: 'a1', name: 'Rajesh Patel', nameGu: 'રાજેશ પટેલ', nameHi: 'રાજેશ પટેલ', image: '', designation: '', designationGu: '', designationHi: '', bio: '', bioGu: '', bioHi: '' },
    publishedAt: '2026-07-15T12:00:00Z',
    updatedAt: '',
    readingTime: 2,
    isTrending: true, isBreaking: false, isFeatured: true,
    views: 46000,
    relativeTimeGu: '૩ કલાક પહેલાં',
    relativeTime: '3 hours ago',
    relativeTimeHi: '3 घंटे पहले',
    viewsGu: '૪૬K'
  },
  {
    id: 'g-top4',
    slug: 'vadodara-municipal-budget-presented-202',
    title: 'Vadodara municipal budget presented! Focus on water and roads',
    titleGu: 'વડોદરા મ્યુનિ.નું નવું બજેટ રજૂ! પાણી અને રસ્તા પર સૌથી વધુ ભાર',
    titleHi: 'वडोदरा नगर पालिका का नया बजट पेश! पानी और सड़कों पर जोर',
    excerpt: '', excerptGu: '', excerptHi: '',
    content: '', contentGu: '', contentHi: '',
    image: '/assets/demo/2.jpg',
    category: 'Vadodara',
    categoryGu: 'વડોદરા',
    categoryHi: 'वडोदरा',
    tags: ['વડોદરા'], tagsGu: ['વડોદરા'], tagsHi: ['वडोदरा'],
    author: { id: 'a1', name: 'Rajesh Patel', nameGu: 'રાજેશ પટેલ', nameHi: 'રાજેશ પટેલ', image: '', designation: '', designationGu: '', designationHi: '', bio: '', bioGu: '', bioHi: '' },
    publishedAt: '2026-07-15T13:00:00Z',
    updatedAt: '',
    readingTime: 2,
    isTrending: true, isBreaking: false, isFeatured: true,
    views: 33000,
    relativeTimeGu: '૨ કલાક પહેલાં',
    relativeTime: '2 hours ago',
    relativeTimeHi: '2 घंटे पहले',
    viewsGu: '૩૩K'
  }
];

const GUJARAT_MOCK_MOST_READ = [
  {
    id: 'g-mr1',
    slug: 'rajkot-smart-city-roadwork-commenced-201',
    titleGu: 'રાજકોટમાં મોટું કામ! સ્માર્ટ સીટી પ્રોજેક્ટ હેઠળ રસ્તાઓનું ધમધમાટ કામ શરૂ',
    title: 'Rajkot smart city roadwork commenced under project',
    titleHi: 'राजकोट स्मार्ट सिटी सड़क निर्माण कार्य शुरू',
    categoryGu: 'રાજકોટ',
    category: 'Rajkot',
    categoryHi: 'राजकोट'
  },
  {
    id: 'g-mr2',
    slug: 'surat-diamond-bourse-allotment-started-203',
    titleGu: 'સુરત ડાયમંડ બુર્સમાં ખુશીની લહેર! નવા યુનિટોની ફાળવણી શરૂ',
    title: 'Surat Diamond Bourse allotment of new units started',
    titleHi: 'सूरत डायमंड बुर्स आवंटन शुरू',
    categoryGu: 'સુરત',
    category: 'Surat',
    categoryHi: 'सूरत'
  },
  {
    id: 'g-mr3',
    slug: 'vadodara-municipal-budget-presented-202',
    titleGu: 'વડોદરા મ્યુનિ.નું નવું બજેટ રજૂ! પાણી અને રસ્તા પર સૌથી વધુ ભાર',
    title: 'Vadodara municipal budget presented! Focus on water and roads',
    titleHi: 'वडोदरा नगर पालिका का नया बजट पेश! पानी और सड़कों पर जोर',
    categoryGu: 'વડોદરા',
    category: 'Vadodara',
    categoryHi: 'वडोदरा'
  },
  {
    id: 'g-mr4',
    slug: 'bhavnagar-new-industrial-units-approved-347',
    titleGu: 'ભાવનગરને મળી મોટી ભેટ! નવા ઔદ્યોગિક એકમને મંજૂરી, રોજગારીની આશા',
    title: 'Bhavnagar gets big gift! New industrial unit approved, hope of jobs',
    titleHi: 'भावनगर को मिला बड़ा तोहफा! नए औद्योगिक इकाई को मंजूरी',
    categoryGu: 'ભાવનગર',
    category: 'Bhavnagar',
    categoryHi: 'भावनगर'
  },
  {
    id: 'g-mr5',
    slug: 'girnar-ropeway-tourist-rush-increases-tremendously-205',
    titleGu: 'ગિરનાર રોપ-વે પર ઉમટ્યા પ્રવાસીઓ! સંખ્યામાં જોરદાર વધારો',
    title: 'Tourists flock to Girnar Ropeway! Tremendous increase in numbers',
    titleHi: 'गिरनार रोपवे पर उमड़े पर्यटक! संख्या में भारी बढ़ोतरी',
    categoryGu: 'જૂનાગઢ',
    category: 'Junagadh',
    categoryHi: 'जूनागढ़'
  },
  {
    id: 'g-mr6',
    slug: 'state-cabinet-meeting-major-decisions-348',
    titleGu: 'રાજ્ય મંત્રીમંડળની બેઠકમાં મોટા નિર્ણય, જાણો શું-શું બદલાયું',
    title: 'Major decisions in state cabinet meeting, know what changed',
    titleHi: 'राज्य मंत्रिमंडल की बैठक में बड़े फैसले, जानें क्या बदला',
    categoryGu: 'ગાંધીનગર',
    category: 'Gandhinagar',
    categoryHi: 'गांधीनगर'
  }
];

const GUJARAT_MOCK_TAGS = {
  gu: ['ચૂંટણી ૨૦૨૭', 'વરસાદ', 'સોના-ચાંદી', 'ક્રિકેટ', 'મેટ્રો', 'સેમિકન્ડક્ટર', 'ડાયમંડ ઉદ્યોગ', 'ટ્રાફિક'],
  hi: ['चुनाव 2027', 'बारिश', 'सोना-चांदी', 'क्रिकेट', 'मेट्रो', 'सेमीकंडक्टर', 'डायमंड उद्योग', 'ट्रैफिक'],
  en: ['Election 2027', 'Rain', 'Gold-Silver', 'Cricket', 'Metro', 'Semiconductor', 'Diamond Industry', 'Traffic']
};

/* ══════════════════════════════════════════════════════════════
   CATEGORY PAGE CLIENT
   ══════════════════════════════════════════════════════════════ */
export default function CategoryPageClient({ articles, category, slug }: Props) {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('popular');
  const [visibleCount, setVisibleCount] = useState(9);

  const isGujarat = true; // Apply the premium mockup layout to all category pages

  // Get localized category name aligned exactly with the header menu links
  const getCategoryTitleLocalized = () => {
    if (slug === 'gujarat' || slug === 'state') {
      return getLocalized(language, { en: 'Gujarat', gu: 'ગુજરાત', hi: 'गुजरात' });
    }
    if (slug === 'national') {
      return getLocalized(language, { en: 'National', gu: 'દેશ', hi: 'देश' });
    }
    if (slug === 'crime') {
      return getLocalized(language, { en: 'Crime', gu: 'ક્રાઈમ', hi: 'क्राइम' });
    }
    if (slug === 'technology') {
      return getLocalized(language, { en: 'Technology', gu: 'ટેક્નોલોજી', hi: 'टेक्नोलॉजी' });
    }
    if (slug === 'lifestyle') {
      return getLocalized(language, { en: 'Lifestyle', gu: 'લાઈફસ્ટાઈલ', hi: 'लाइफस्टाइल' });
    }
    return getLocalized(language, {
      en: category?.name || '',
      gu: category?.nameGu || '',
      hi: category?.nameHi || '',
    });
  };

  const categoryName = getCategoryTitleLocalized();

  /* Get localized location */
  const getArticleLocation = (art: Article) => {
    if (language === 'gu') {
      return (art as any).categoryGu || art.tagsGu?.[0] || getCategoryLabel(art, language);
    }
    if (language === 'hi') {
      return (art as any).categoryHi || art.tagsHi?.[0] || getCategoryLabel(art, language);
    }
    return art.category || art.tags?.[0] || getCategoryLabel(art, language);
  };

  /* Get localized relative time / fallback to date */
  const getArticleTime = (art: Article) => {
    if (language === 'gu') return (art as any).relativeTimeGu || formatDate(art.publishedAt);
    if (language === 'hi') return (art as any).relativeTimeHi || formatDate(art.publishedAt);
    return art.relativeTime || formatDate(art.publishedAt);
  };

  /* Get localized views */
  const getArticleViews = (art: Article) => {
    if (language === 'gu') return (art as any).viewsGu || toGu(formatViews(art.views));
    if (language === 'hi') return (art as any).viewsHi || formatViews(art.views);
    return (art as any).views || formatViews(art.views);
  };

  /* Most-read = top 5 from all articles by views in this category */
  const mostRead = useMemo(
    () =>
      ARTICLES.filter((a) => a.category.toLowerCase() === category.name.toLowerCase())
        .sort((a, b) => b.views - a.views)
        .slice(0, 5),
    [category.name],
  );

  /* Trending tags */
  const trendingTags = useMemo(() => {
    const all = ARTICLES.flatMap((a) => (language === 'gu' ? a.tagsGu : language === 'hi' ? a.tagsHi : a.tags));
    const freq: Record<string, number> = {};
    all.forEach((t) => { if (t) freq[t] = (freq[t] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t]) => t);
  }, [language]);

  /* Resolve displaying lists with dynamic filtering and sorting */
  const displayArticles = isGujarat ? (GUJARAT_MOCK_ARTICLES as any as Article[]) : articles;

  const filteredArticles = useMemo(() => {
    let result = [...displayArticles];

    // 1. Filter by active tab format/category simulation
    if (activeTab === 'latest') {
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (activeTab === 'analysis') {
      result = result.filter((a, idx) =>
        idx % 2 === 0 ||
        a.titleGu?.includes('વિશ્લેષણ') ||
        a.title?.toLowerCase().includes('analysis')
      );
    } else if (activeTab === 'video') {
      result = result.filter((a, idx) =>
        idx % 3 === 0 ||
        a.titleGu?.includes('વીડિયો') ||
        a.title?.toLowerCase().includes('video')
      );
    } else if (activeTab === 'photo') {
      result = result.filter((a, idx) =>
        idx % 4 === 0 ||
        a.titleGu?.includes('ફોટો') ||
        a.title?.toLowerCase().includes('photo')
      );
    }

    // 2. Sort by latest or popular views
    if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.views - a.views);
    }

    return result;
  }, [displayArticles, activeTab, sortBy]);

  const mostReadToDisplay = isGujarat ? GUJARAT_MOCK_MOST_READ : mostRead;
  const tagsToDisplay = isGujarat ? (GUJARAT_MOCK_TAGS[language] || GUJARAT_MOCK_TAGS.en) : trendingTags;

  const heroArticle = filteredArticles[0];
  const topStories = filteredArticles.slice(1, 4); // Show 3 items

  const popularArticlesRaw = isGujarat ? articles : filteredArticles.slice(4);

  const popularArticles = useMemo(() => {
    let result = [...popularArticlesRaw];

    // Filter by tab
    if (activeTab === 'analysis') {
      result = result.filter((a, idx) =>
        idx % 2 === 0 ||
        a.titleGu?.includes('વિશ્લેષણ') ||
        a.title?.toLowerCase().includes('analysis')
      );
    } else if (activeTab === 'video') {
      result = result.filter((a, idx) =>
        idx % 3 === 0 ||
        a.titleGu?.includes('વીડિયો') ||
        a.title?.toLowerCase().includes('video')
      );
    } else if (activeTab === 'photo') {
      result = result.filter((a, idx) =>
        idx % 4 === 0 ||
        a.titleGu?.includes('ફોટો') ||
        a.title?.toLowerCase().includes('photo')
      );
    }

    // Sort
    if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.views - a.views);
    }

    return result;
  }, [popularArticlesRaw, activeTab, sortBy]);

  /* Filter tabs */
  const tabs: { id: FilterTab; gu: string; hi: string; en: string }[] = [
    { id: 'all', gu: 'બધું', hi: 'सभी', en: 'All' },
    { id: 'latest', gu: 'તાજા સમાચાર', hi: 'ताज़ा समाचार', en: 'Latest' },
    { id: 'analysis', gu: 'વિશ્લેષણ', hi: 'विश्लेषण', en: 'Analysis' },
    { id: 'video', gu: 'વીડિયો', hi: 'वीडियो', en: 'Video' },
    { id: 'photo', gu: 'ફોટો', hi: 'फोटो', en: 'Photo' },
  ];

  if (!heroArticle) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-16 text-center text-muted-foreground">
        {getLocalized(language, { en: 'No stories found.', gu: 'કોઈ સમાચાર મળ્યા નહીં.', hi: 'कोई खबर नहीं मिली.' })}
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-screen-xl px-4 py-6">

        {/* ── TOP ROW: Category name (with Red Vertical Bar) + Sort buttons ──────────────── */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
          <div className="flex items-center gap-3">
            {/* Red vertical bar */}
            <span className="w-1.5 h-7 bg-accent rounded-sm inline-block" />
            <h1 className="text-2xl font-black text-foreground">{categoryName}</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('latest')}
              className={`rounded-full px-4 py-1.5 text-xs font-black transition cursor-pointer ${sortBy === 'latest'
                  ? 'bg-foreground text-background'
                  : 'border border-border text-muted-foreground hover:border-accent hover:text-accent bg-card'
                }`}
            >
              {getLocalized(language, { gu: 'તાજા', hi: 'ताजा', en: 'Latest' })}
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`rounded-full px-4 py-1.5 text-xs font-black transition cursor-pointer ${sortBy === 'popular'
                  ? 'bg-foreground text-background'
                  : 'border border-border text-muted-foreground hover:border-accent hover:text-accent bg-card'
                }`}
            >
              {getLocalized(language, { gu: 'લોકપ્રિય', hi: 'लोकप्रिय', en: 'Popular' })}
            </button>
          </div>
        </div>

        {/* ── FILTER TABS ────────────────────────────────────────── */}
        <div className="flex gap-2 flex-wrap mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-black transition cursor-pointer ${activeTab === tab.id
                  ? 'bg-accent text-white font-black'
                  : 'border border-border bg-card text-foreground hover:border-accent hover:text-accent font-semibold'
                }`}
            >
              {getLocalized(language, { en: tab.en, gu: tab.gu, hi: tab.hi })}
            </button>
          ))}
        </div>

        {/* ── MAIN CONTENT + SIDEBAR ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* ── LEFT: Hero + Top Stories ─────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr] gap-8 min-w-0">
            {/* Hero Article */}
            <Link href={`/news/${heroArticle.slug}`} className="group block">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-muted shadow-sm">
                <Image
                  src={heroArticle.image}
                  alt={getArticleTitle(heroArticle, language)}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
              <div className="mt-3">
                <span className="text-xs font-black uppercase tracking-wide text-accent">
                  {getArticleLocation(heroArticle)}
                </span>
                <h2 className="mt-1 text-xl md:text-[23px] font-black leading-snug tracking-tight text-foreground group-hover:text-accent transition-colors line-clamp-3">
                  {getArticleTitle(heroArticle, language)}
                </h2>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-muted-foreground/70" />{getArticleTime(heroArticle)}</span>
                  <span>·</span>
                  <span>{formatDate(heroArticle.publishedAt)}</span>
                </div>
              </div>
            </Link>

            {/* Top Stories column */}
            <div>
              <div className="flex items-center gap-2.5 mb-3 pb-2 border-b-2 border-accent/25">
                <span className="w-1 h-4 bg-accent inline-block shrink-0 rounded-sm" />
                <span className="text-sm font-black text-foreground">
                  {getLocalized(language, { en: 'Top Stories', gu: 'ટોપ સ્ટોરીઝ', hi: 'टॉप स्टोरीज' })}
                </span>
              </div>
              <div className="flex flex-col divide-y divide-border">
                {topStories.map((art) => (
                  <Link key={art.id} href={`/news/${art.slug}`} className="group flex items-start gap-4 py-4 first:pt-1 last:pb-1">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-black uppercase tracking-wide text-accent">
                        {getArticleLocation(art)}
                      </span>
                      <h3 className="mt-0.5 text-[13.5px] md:text-[14.5px] font-bold leading-snug tracking-tight text-foreground group-hover:text-accent transition-colors line-clamp-3">
                        {getArticleTitle(art, language)}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground font-semibold">
                        <span>{getArticleTime(art)}</span>
                        <span>·</span>
                        <span>{formatDate(art.publishedAt)}</span>
                      </div>
                    </div>
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-sm bg-muted shadow-sm">
                      <Image
                        src={art.image}
                        alt={getArticleTitle(art, language)}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="80px"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Most Read & Trending Tags ─────────────────── */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-border">
              <span className="w-2 h-2 bg-accent rotate-45 shrink-0 inline-block" />
              <span className="text-sm font-black text-foreground">
                {getLocalized(language, { en: 'Most Read', gu: 'સૌથી વધુ વંચાયેલા', hi: 'सबसे ज़्यादा पढ़े गए' })}
              </span>
            </div>
            <div className="flex flex-col divide-y divide-border">
              {mostReadToDisplay.map((art, i) => (
                <Link key={art.id} href={`/news/${art.slug}`} className="group flex items-start gap-3 py-3 first:pt-1.5 last:pb-1.5">
                  <span className="text-[28px] font-extrabold leading-none select-none w-8 shrink-0 text-center"
                    style={{
                      fontVariantNumeric: 'tabular-nums',
                      color: 'transparent',
                      WebkitTextStroke: '1.5px var(--ink-3)'
                    }}>
                    {language === 'gu' ? toGu(i + 1) : i + 1}
                  </span>
                  <p className="text-[13px] md:text-[13.5px] font-bold leading-snug text-foreground/90 group-hover:text-accent transition-colors line-clamp-3">
                    {language === 'gu' ? art.titleGu : language === 'hi' ? art.titleHi : art.title}
                  </p>
                </Link>
              ))}
            </div>

            {/* Trending Tags */}
            <div className="mt-6">
              <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-border">
                <span className="w-2 h-2 bg-accent rotate-45 shrink-0 inline-block" />
                <span className="text-sm font-black text-foreground">
                  {getLocalized(language, { en: 'Trending Topics', gu: 'ટ્રેન્ડિંગ વિષયો', hi: 'ट्रेंडिंग विषय' })}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tagsToDisplay.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold text-muted-foreground hover:border-accent hover:text-accent hover:bg-muted transition"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── POPULAR ARTICLES GRID ─────────────────────────────── */}
        <div className="mt-10">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-border">
            <span className="w-2 h-2 bg-accent rotate-45 shrink-0 inline-block" />
            <span className="text-base font-black text-foreground">
              {getLocalized(language, { en: 'Popular News', gu: 'લોકપ્રિય સમાચાર', hi: 'लोकप्रिय समाचार' })}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-8">
            {popularArticles.slice(0, visibleCount).map((article) => (
              <NewsCard key={article.id} article={article} variant="flat" />
            ))}
          </div>

          {/* Load More */}
          {visibleCount < popularArticles.length && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setVisibleCount((v) => v + 9)}
                className="rounded border border-accent px-10 py-3 text-sm font-black text-accent hover:bg-accent hover:text-white transition cursor-pointer"
              >
                {getLocalized(language, { en: 'Load More', gu: 'વધુ લોડ કરો', hi: 'और लोड करें' })}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
