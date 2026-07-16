'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Clock } from 'lucide-react';
import { ARTICLES, getArticleTitle, getCategoryLabel, formatViews, getLocalized } from '@/data';
import { useApp } from '@/components/AppProvider';
import type { Article, Language } from '@/types';

// Helper to convert standard digits to Gujarati digits
const toGuDigits = (num: number | string): string => {
  return String(num);
};

export default function LatestUpdatesSection({ view = 'all' }: { view?: 'timeline' | 'sidebar' | 'all' }) {
  const { language } = useApp();
  const [latestNews, setLatestNews] = useState<Article[]>([]);
  const [mostRead, setMostRead] = useState<Article[]>([]);

  // Gold and Silver rates (replicated from the screenshot layout)
  const goldPrice = 73450;
  const goldChange = 450;
  const silverPrice = 82800;

  useEffect(() => {
    // Setup exact mock items for Latest News to match the screenshot
    const mockLatest = [
      {
        id: 'ml1',
        slug: 'surat-diamond-bourse-units-allocation-starts-101',
        image: '/assets/demo/6.jpg',
        titleGu: 'સુરત ડાયમંડ બુર્સમાં ખુશીની લહેર! નવા યુનિટોની ફાળવણી શરૂ',
        title: 'Wave of joy in Surat Diamond Bourse! Allocation of new units starts',
        titleHi: 'सूरत डायमंड बुर्स में खुशी की लहर! नए इकाइयों का आवंटन शुरू',
        relativeTimeGu: '૨ કલાક પહેલાં',
        relativeTime: '2 hours ago',
        relativeTimeHi: '2 घंटे पहले',
        categoryGu: 'સુરત',
        category: 'Surat',
        categoryHi: 'सूरत',
        views: 45000,
        publishedAt: '2026-07-13T15:00:00Z'
      },
      {
        id: 'ml2',
        slug: 'vadodara-municipality-budget-presented-102',
        image: '/assets/demo/4.jpg',
        titleGu: 'વડોદરા મ્યુનિ.નું નવું બજેટ રજૂ! પાણી અને રસ્તા પર સૌથી વધુ ભાર',
        title: 'Vadodara Muni new budget presented! Highest emphasis on water and roads',
        titleHi: 'वडोदरा नगर निगम का नया बजट पेश! पानी और सड़कों पर सबसे ज्यादा जोर',
        relativeTimeGu: '૨ કલાક પહેલાં',
        relativeTime: '2 hours ago',
        relativeTimeHi: '2 घंटे पहले',
        categoryGu: 'વડોદરા',
        category: 'Vadodara',
        categoryHi: 'वडोदरा',
        views: 89000,
        publishedAt: '2026-07-13T15:00:00Z'
      },
      {
        id: 'ml3',
        slug: 'parliament-monsoon-session-starts-today-103',
        image: '/assets/demo/5.jpg',
        titleGu: 'સંસદનું ચોમાસુ સત્ર આજથી! અનેક મોટા ખરડા પર થશે ધમાસાણ',
        title: 'Monsoon session of Parliament starts today! Storm expected over many major bills',
        titleHi: 'संसद का मानसून सत्र आज से! कई बड़े विधेयकों पर होगा घमासान',
        relativeTimeGu: '૧ કલાક પહેલાં',
        relativeTime: '1 hour ago',
        relativeTimeHi: '1 घंटा पहले',
        categoryGu: 'સંસદ',
        category: 'Parliament',
        categoryHi: 'संसद',
        views: 24000,
        publishedAt: '2026-07-13T16:00:00Z'
      },
      {
        id: 'ml4',
        slug: 'good-news-gdp-growth-rate-recorded-higher-than-estimate-104',
        image: '/assets/demo/3.jpg',
        titleGu: 'ખુશખબર! GDP વૃદ્ધિ દર અંદાજ કરતાં વધુ નોંધાયો',
        title: 'Good news! GDP growth rate recorded higher than estimate',
        titleHi: 'खुशखबरी! जीडीपी विकास दर अनुमान से अधिक दर्ज की गई',
        relativeTimeGu: '૨ કલાક પહેલાં',
        relativeTime: '2 hours ago',
        relativeTimeHi: '2 घंटे पहले',
        categoryGu: 'અર્થતંત્ર',
        category: 'Economy',
        categoryHi: 'अर्थव्यवस्था',
        views: 12000,
        publishedAt: '2026-07-13T15:00:00Z'
      },
      {
        id: 'ml5',
        slug: 'ahmedabad-metro-phase-2-countdown-starts-105',
        image: '/assets/demo/1.jpg',
        titleGu: 'અમદાવાદ મેટ્રો ફેઝ-2નું કાઉન્ટડાઉન શરૂ! સંપૂર્ણ રૂટ મેપ, ભાડા અને તારીખ જાણો',
        title: 'Ahmedabad Metro Phase 2 countdown starts! Know full route map, fares and dates',
        titleHi: 'अहमदाबाद मेट्रो फेज-2 का काउंटडाउन शुरू! पूरा रूट मैप, किराया और तारीख जानें',
        relativeTimeGu: '૩૦ મિનિટ પહેલાં',
        relativeTime: '30 mins ago',
        relativeTimeHi: '30 मिनट पहले',
        categoryGu: 'લોકપ્રિય',
        category: 'Trending',
        categoryHi: 'लोकप्रिय',
        views: 52000,
        publishedAt: '2026-07-13T16:30:00Z'
      },
      {
        id: 'ml6',
        slug: 'monsoon-2025-when-will-rain-strike-gujarat-met-department-forecast-106',
        image: '/assets/demo/2.jpg',
        titleGu: 'ચોમાસુ ૨૦૨૫: ગુજરાતમાં ક્યારે ત્રાટકશે વરસાદ? હવામાન વિભાગની મોટી આગાહી',
        title: 'Monsoon 2025: When will rain strike Gujarat? Big forecast from met department',
        titleHi: 'मानसून 2025: गुजरात में कब बरसेगा पानी? मौसम विभाग की बड़ी भविष्यवाणी',
        relativeTimeGu: '૧ કલાક પહેલાં',
        relativeTime: '1 hour ago',
        relativeTimeHi: '1 घंटा पहले',
        categoryGu: 'લોકપ્રિય',
        category: 'Trending',
        categoryHi: 'लोकप्रिय',
        views: 31000,
        publishedAt: '2026-07-13T16:00:00Z'
      },
      {
        id: 'ml7',
        slug: 'cyber-cell-busts-fake-investment-app-network-in-ahmedabad-93',
        image: '/assets/demo/3.jpg',
        titleGu: 'અમદાવાદમાં કરોડોનું કૌભાંડ! ફેક ઇન્વેસ્ટમેન્ટ એપ નેટવર્કનો પર્દાફાશ, અનેક ધરપકડ',
        title: 'Crores scam in Ahmedabad! Fake investment app network busted, many arrested',
        titleHi: 'अहमदाबाद में करोड़ों का घोटाला! फेक निवेश ऐप नेटवर्क का भंडाफोड़, कई गिरफ्तार',
        relativeTimeGu: '૧ કલાક પહેલાં',
        relativeTime: '1 hour ago',
        relativeTimeHi: '1 घंटा पहले',
        categoryGu: 'અમદાવાદ',
        category: 'Ahmedabad',
        categoryHi: 'अहमदाबाद',
        views: 89000,
        publishedAt: '2026-07-13T16:00:00Z'
      },
      {
        id: 'ml8',
        slug: 'surat-police-seize-contraband-worth-crores-in-joint-raid-94',
        image: '/assets/demo/4.jpg',
        titleGu: 'સુરત પોલીસની સંયુક્ત રેડ! કરોડોની મુદ્દામાલ જપ્ત',
        title: 'Joint raid by Surat police! Contraband worth crores seized',
        titleHi: 'सूरत पुलिस की संयुक्त छापेमारी! करोड़ों का माल जब्त',
        relativeTimeGu: '૨ કલાક પહેલાં',
        relativeTime: '2 hours ago',
        relativeTimeHi: '2 घंटे पहले',
        categoryGu: 'સુરત',
        category: 'Surat',
        categoryHi: 'सूरत',
        views: 71000,
        publishedAt: '2026-07-13T15:00:00Z'
      },
      {
        id: 'ml9',
        slug: 'take-care-of-health-in-monsoon-keep-these-things-in-mind-109',
        image: '/assets/demo/5.jpg',
        titleGu: 'ચોમાસામાં આરોગ્ય જાળવવા આટલું જરૂર ધ્યાન રાખો',
        title: 'Keep this in mind to maintain health during monsoon',
        titleHi: 'मानसून में स्वास्थ्य बनाए रखने के लिए इन बातों का जरूर ध्यान रखें',
        relativeTimeGu: '૨ કલાક પહેલાં',
        relativeTime: '2 hours ago',
        relativeTimeHi: '2 घंटे पहले',
        categoryGu: 'આરોગ્ય',
        category: 'Health',
        categoryHi: 'स्वास्थ्य',
        views: 18000,
        publishedAt: '2026-07-13T15:00:00Z'
      },
      {
        id: 'ml10',
        slug: 'try-these-special-dishes-of-gujarati-thali-110',
        image: '/assets/demo/6.jpg',
        titleGu: 'ગુજરાતી થાળીની આ ખાસ વાનગીઓ જરૂર અજમાવો',
        title: 'Must try these special dishes of Gujarati Thali',
        titleHi: 'गुजराती थाली के इन खास व्यंजनों को जरूर आजमाएं',
        relativeTimeGu: '૪ કલાક પહેલાં',
        relativeTime: '4 hours ago',
        relativeTimeHi: '4 घंटे पहले',
        categoryGu: 'ફૂડ',
        category: 'Food',
        categoryHi: 'फूड',
        views: 12000,
        publishedAt: '2026-07-13T13:00:00Z'
      },
      {
        id: 'ml11',
        slug: 'ahmedabad-cyber-crime-prevention-drive-111',
        image: '/assets/demo/1.jpg',
        titleGu: 'સાયબર ક્રાઇમ સામે મોટી ડ્રાઇવ: અમદાવાદ પોલીસે નાગરિકો માટે એડવાઈઝરી જાહેર કરી',
        title: 'Major drive against cyber crime: Ahmedabad police issues advisory for citizens',
        titleHi: 'साइबर अपराध के खिलाफ बड़ा अभियान: अहमदाबाद पुलिस ने नागरिकों के लिए एडवाइजरी जारी की',
        relativeTimeGu: '૫ કલાક પહેલાં',
        relativeTime: '5 hours ago',
        relativeTimeHi: '5 घंटे पहले',
        categoryGu: 'અમદાવાદ',
        category: 'Ahmedabad',
        categoryHi: 'अहमदाबाद',
        views: 33000,
        publishedAt: '2026-07-13T12:00:00Z'
      },
      {
        id: 'ml12',
        slug: 'rajkot-airport-new-terminal-operations-112',
        image: '/assets/demo/2.jpg',
        titleGu: 'રાજકોટ એરપોર્ટ પર નવા ટર્મિનલનું ટ્રાયલ રન સફળ, ટૂંક સમયમાં શરૂ થશે ફ્લાઇટ્સ',
        title: 'Trial run of new terminal at Rajkot airport successful, flights to start soon',
        titleHi: 'राजकोट हवाई अड्डे पर नए टर्मिनल का ट्रायल रन सफल, जल्द ही शुरू होंगी उड़ानें',
        relativeTimeGu: '૬ કલાક પહેલાં',
        relativeTime: '6 hours ago',
        relativeTimeHi: '6 घंटे पहले',
        categoryGu: 'રાજકોટ',
        category: 'Rajkot',
        categoryHi: 'राजकोट',
        views: 27000,
        publishedAt: '2026-07-13T11:00:00Z'
      },
      {
        id: 'ml13',
        slug: 'semi-conductor-plant-sanand-investment-113',
        image: '/assets/demo/3.jpg',
        titleGu: 'ગુજરાતમાં સેમિકન્ડક્ટર પ્લાન્ટ માટે જમીન ફાળવણી મંજૂર, હજારો નોકરીઓ સર્જાશે',
        title: 'Land allocation approved for semiconductor plant in Gujarat, thousands of jobs to be created',
        titleHi: 'गुजरात में सेमीकंडक्टर plant के लिए भूमि आवंटन को मंजूरी, हजारों नौकरियां पैदा होंगी',
        relativeTimeGu: '૭ કલાક પહેલાં',
        relativeTime: '7 hours ago',
        relativeTimeHi: '7 घंटे पहले',
        categoryGu: 'ઉદ્યોગ',
        category: 'Industry',
        categoryHi: 'उद्योग',
        views: 68000,
        publishedAt: '2026-07-13T10:00:00Z'
      },
      {
        id: 'ml14',
        slug: 'monsoon-illnesses-prevention-health-department-114',
        image: '/assets/demo/4.jpg',
        titleGu: 'વાહકજન્ય રોગો અટકાવવા આરોગ્ય વિભાગ સક્રિય: ઘરે-ઘરે સર્વેક્ષણ શરૂ',
        title: 'Health department active to prevent vector-borne diseases: door-to-door survey starts',
        titleHi: 'मच्छर जनित बीमारियों को रोकने के लिए स्वास्थ्य विभाग सक्रिय: डोर-टू-डोर सर्वेक्षण शुरू',
        relativeTimeGu: '૮ કલાક પહેલાં',
        relativeTime: '8 hours ago',
        relativeTimeHi: '8 घंटे पहले',
        categoryGu: 'આરોગ્ય',
        category: 'Health',
        categoryHi: 'स्वास्थ्य',
        views: 19000,
        publishedAt: '2026-07-13T09:00:00Z'
      }
    ] as unknown as Article[];

    // Setup exact mock items for Most Read Sidebar
    const mockMostRead = [
      {
        id: 'mr1',
        slug: 'smart-city-project-roadworks-starts-rajkot-201',
        titleGu: 'રાજકોટમાં મોટું કામ! સ્માર્ટ સિટી પ્રોજેક્ટ હેઠળ રસ્તાઓનું ધમધમાટ કામ શરૂ',
        title: 'Big work in Rajkot! Roadworks start in full swing under Smart City project',
        titleHi: 'राजकोट में बड़ा काम! स्मार्ट सिटी परियोजना के तहत सड़कों का काम जोरों पर शुरू',
        image: '/assets/demo/1.jpg',
        category: 'Rajkot',
        views: 95000,
        publishedAt: '2026-07-13T10:00:00Z'
      },
      {
        id: 'mr2',
        slug: 'surat-diamond-bourse-units-allocation-starts-101',
        titleGu: 'સુરત ડાયમંડ બુર્સમાં ખુશીની લહેરા નવા યુનિટોની ફાળવણી શરૂ',
        title: 'Joy in Surat Diamond Bourse: allocation of new units starts',
        titleHi: 'सूरत डायमंड बुर्स में खुशी: नए इकाइयों का आवंटन शुरू',
        image: '/assets/demo/6.jpg',
        category: 'Surat',
        views: 94000,
        publishedAt: '2026-07-13T10:00:00Z'
      },
      {
        id: 'mr3',
        slug: 'vadodara-municipality-budget-presented-102',
        titleGu: 'વડોદરા મ્યુનિ.નું નવું બજેટ રજૂ! પાણી અને રસ્તા પર સૌથી વધુ ભાર',
        title: 'Vadodara Muni new budget presented! Highest emphasis on water and roads',
        titleHi: 'वडोदरा नगर निगम का नया बजट पेश! पानी और सड़कों पर सबसे ज्यादा जोर',
        image: '/assets/demo/4.jpg',
        category: 'Vadodara',
        views: 93000,
        publishedAt: '2026-07-13T10:00:00Z'
      },
      {
        id: 'mr4',
        slug: 'bhavnagar-gets-big-gift-new-industrial-units-approved-204',
        titleGu: 'ભાવનગરને મળી મોટી ભેટ! નવા ઔદ્યોગિક એકમને મંજૂરી, રોજગારીની આશા',
        title: 'Big gift for Bhavnagar! Approval for new industrial unit raises job hopes',
        titleHi: 'भावनगर को मिला बड़ा तोहफा! नई औद्योगिक इकाई को मंजूरी, रोजगार की उम्मीद',
        image: '/assets/demo/5.jpg',
        category: 'Bhavnagar',
        views: 92000,
        publishedAt: '2026-07-13T10:00:00Z'
      },
      {
        id: 'mr5',
        slug: 'girnar-ropeway-tourist-rush-increases-tremendously-205',
        titleGu: 'ગિરનાર રોપ-વે પર ઉમટ્યા પ્રવાસીઓ! સંખ્યામાં જોરદાર વધારો',
        title: 'Tourists flock to Girnar Ropeway! Tremendous increase in numbers',
        titleHi: 'गिरनार रोपवे पर उमड़े पर्यटक! संख्या में भारी बढ़ोतरी',
        image: '/assets/demo/2.jpg',
        category: 'Junagadh',
        views: 91000,
        publishedAt: '2026-07-13T10:00:00Z'
      },
      {
        id: 'mr6',
        slug: 'state-cabinet-meeting-major-decisions-206',
        titleGu: 'રાજ્ય મંત્રીમંડળની બેઠકમાં મોટા નિર્ણય, જાણો શું-શું બદલાયું',
        title: 'Major decisions in State Cabinet meeting, know what changed',
        titleHi: 'राज्य कैबिनेट की बैठक में बड़े फैसले, जानें क्या-क्या बदला',
        image: '/assets/demo/3.jpg',
        category: 'State',
        views: 90000,
        publishedAt: '2026-07-13T10:00:00Z'
      }
    ] as unknown as Article[];

    setLatestNews(mockLatest);
    setMostRead(mockMostRead);
  }, []);

  if (!latestNews.length) return null;

  // Localized string selectors
  const labelLatest = getLocalized(language, {
    en: "Latest News",
    gu: "તાજા સમાચાર",
    hi: "ताजा समाचार"
  });

  const labelContinuous = getLocalized(language, {
    en: "• Continuous Updates",
    gu: "• સતત અપડેટ",
    hi: "• सतत अपडेट"
  });

  const labelMostRead = getLocalized(language, {
    en: "Most Read",
    gu: "સૌથી વધુ વંચાયેલા",
    hi: "सबसे ज्यादा पढ़े गए"
  });

  const labelGoldSilverRates = getLocalized('en', {
    en: "Gold-Silver Rates",
    gu: "સોના-ચાંદીના ભાવ",
    hi: "सोने-चांदी के भाव"
  });

  const labelGold = getLocalized('en', {
    en: "Gold (10 Grams)",
    gu: "સોનું (10 ગ્રામ)",
    hi: "सोना (10 ग्राम)"
  });

  const labelKarat = getLocalized('en', {
    en: "24 Karat",
    gu: "24 કેરેટ",
    hi: "24 कैरेट"
  });

  const labelSilver = getLocalized('en', {
    en: "Silver (1 Kg)",
    gu: "ચાંદી (1 કિલો)",
    hi: "चांदी (1 किलो)"
  });

  const labelPerKg = getLocalized('en', {
    en: "Per Kg",
    gu: "પ્રતિ કિલો",
    hi: "प्रति किलो"
  });

  const labelStable = getLocalized('en', {
    en: "Stable",
    gu: "સ્થિર",
    hi: "स्थिर"
  });

  // Localize prices helper
  const formatPrice = (price: number) => {
    const formatted = price.toLocaleString('en-IN');
    return language === 'gu' ? toGuDigits(formatted) : formatted;
  };

  const formatChange = (change: number) => {
    return language === 'gu' ? toGuDigits(change) : change;
  };

  const timelineContent = (
    <div className="flex flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b-[3px] border-slate-950 dark:border-slate-800 pb-2.5 mb-6">
        <span className="bg-[#B3121B] text-white px-4 py-1.5 font-extrabold text-[14px] md:text-[15px] rounded-sm tracking-tight leading-none">
          {labelLatest}
        </span>
        <span className="text-[#B3121B] font-extrabold text-[12px] md:text-[13px] animate-pulse">
          {labelContinuous}
        </span>
      </div>

      {/* 2-Column Grid with vertical timeline lines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
        
        {/* Column 1 */}
        <div className="relative pl-5 flex flex-col">
          
          {latestNews.slice(0, 5).map((art, idx) => {
            const isHighlighted = idx === 1; // Vadodara budget is index 1
            const relativeTimeStr = language === 'gu' 
              ? art.relativeTimeGu 
              : language === 'hi' 
              ? art.relativeTimeHi 
              : art.relativeTime;
            const locationTag = getCategoryLabel(art, language);
            
            // Bullet styling pattern: alternating red and white nodes
            const isRedBullet = idx % 2 === 0;

            return (
              <Link
                key={art.id}
                href={`/news/${art.slug}`}
                className="group relative flex items-start justify-between gap-3 py-3 border-b border-border/30 last:border-b-0 hover:bg-muted/10 transition-colors duration-150 rounded-sm"
              >
                {/* Segment of vertical timeline line */}
                {idx === 0 && (
                  <div className="absolute left-[-14px] top-[18px] bottom-0 w-[1.5px] bg-[#d6c7b5]/85" />
                )}
                {idx > 0 && idx < 4 && (
                  <div className="absolute left-[-14px] top-0 bottom-0 w-[1.5px] bg-[#d6c7b5]/85" />
                )}
                {idx === 4 && (
                  <div className="absolute left-[-14px] top-0 h-[18px] w-[1.5px] bg-[#d6c7b5]/85" />
                )}

                {/* Timeline circle node */}
                <div 
                  className={`absolute left-[-19.5px] top-[18px] z-10 w-[12px] h-[12px] rounded-full transition-transform duration-200 group-hover:scale-110 ${
                    isRedBullet 
                      ? 'bg-[#B3121B]' 
                      : 'bg-white border-2 border-[#d6c7b5]'
                  }`}
                />

                <div className="flex-1 min-w-0">
                  {/* Timestamp & Location row */}
                  <div className="flex items-center gap-1.5 mb-1 select-none">
                    <span className="text-[#B3121B] font-extrabold text-[11.5px] md:text-[12px] whitespace-nowrap">
                      {relativeTimeStr}
                    </span>
                    <span className="text-muted-foreground font-bold text-[11px] md:text-[11.5px] truncate">
                      {locationTag}
                    </span>
                  </div>
                  {/* Headline */}
                  <h3 className={`text-[14.5px] md:text-[15.5px] font-extrabold leading-snug line-clamp-2 transition-colors duration-150 ${
                    isHighlighted 
                      ? 'text-[#B3121B]' 
                      : 'text-foreground group-hover:text-[#B3121B]'
                  }`}>
                    {getArticleTitle(art, language)}
                  </h3>
                </div>
                {/* Thumbnail Image */}
                <div className="relative h-[58px] w-[86px] shrink-0 overflow-hidden rounded-sm border border-border/10 bg-muted">
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    sizes="86px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Column 2 */}
        <div className="relative pl-5 flex flex-col">
          
          {latestNews.slice(5, 10).map((art, idx) => {
            const isHighlighted = false;
            const relativeTimeStr = language === 'gu' 
              ? art.relativeTimeGu 
              : language === 'hi' 
              ? art.relativeTimeHi 
              : art.relativeTime;
            const locationTag = getCategoryLabel(art, language);
            
            // Bullet styling pattern: alternating red and white nodes
            const isRedBullet = idx % 2 === 0;

            return (
              <Link
                key={art.id}
                href={`/news/${art.slug}`}
                className="group relative flex items-start justify-between gap-3 py-3 border-b border-border/30 last:border-b-0 hover:bg-muted/10 transition-colors duration-150 rounded-sm"
              >
                {/* Segment of vertical timeline line */}
                {idx === 0 && (
                  <div className="absolute left-[-14px] top-[18px] bottom-0 w-[1.5px] bg-[#d6c7b5]/85" />
                )}
                {idx > 0 && idx < 4 && (
                  <div className="absolute left-[-14px] top-0 bottom-0 w-[1.5px] bg-[#d6c7b5]/85" />
                )}
                {idx === 4 && (
                  <div className="absolute left-[-14px] top-0 h-[18px] w-[1.5px] bg-[#d6c7b5]/85" />
                )}

                {/* Timeline circle node */}
                <div 
                  className={`absolute left-[-19.5px] top-[18px] z-10 w-[12px] h-[12px] rounded-full transition-transform duration-200 group-hover:scale-110 ${
                    isRedBullet 
                      ? 'bg-[#B3121B]' 
                      : 'bg-white border-2 border-[#d6c7b5]'
                  }`}
                />

                <div className="flex-1 min-w-0">
                  {/* Timestamp & Location row */}
                  <div className="flex items-center gap-1.5 mb-1 select-none">
                    <span className="text-[#B3121B] font-extrabold text-[11.5px] md:text-[12px] whitespace-nowrap">
                      {relativeTimeStr}
                    </span>
                    <span className="text-muted-foreground font-bold text-[11px] md:text-[11.5px] truncate">
                      {locationTag}
                    </span>
                  </div>
                  {/* Headline */}
                  <h3 className={`text-[14.5px] md:text-[15.5px] font-extrabold leading-snug line-clamp-2 transition-colors duration-150 ${
                    isHighlighted 
                      ? 'text-[#B3121B]' 
                      : 'text-foreground group-hover:text-[#B3121B]'
                  }`}>
                    {getArticleTitle(art, language)}
                  </h3>
                </div>
                {/* Thumbnail Image */}
                <div className="relative h-[58px] w-[86px] shrink-0 overflow-hidden rounded-sm border border-border/10 bg-muted">
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    sizes="86px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col gap-6">
      {/* Most Read (સૌથી વધુ વંચાયેલા) */}
      <div>
        <div className="flex items-center gap-1.5 border-b-[3px] border-slate-950 dark:border-slate-800 pb-2.5 mb-3.5">
          <span className="text-[#B3121B] text-[15px] font-extrabold">♦</span>
          <h3 className="text-[15px] font-black text-foreground">
            {labelMostRead}
          </h3>
        </div>
        
        <div className="flex flex-col divide-y divide-border/40">
          {mostRead.map((art, idx) => (
            <Link
              key={art.id}
              href={`/news/${art.slug}`}
              className="group flex items-start gap-3.5 py-3 hover:bg-muted/20 transition-colors duration-150 px-1 rounded-sm border-b border-border/40 pb-3 last:border-b-0 last:pb-0 pt-3 first:pt-0"
            >
              {/* Number tag matching tv9 style */}
              <span className="text-[24px] font-serif font-black text-slate-300 dark:text-slate-700 group-hover:text-[#B3121B] transition-colors duration-150 leading-none w-6 text-center select-none">
                {language === 'gu' ? toGuDigits(idx + 1) : idx + 1}
              </span>
              
              {/* Headline */}
              <h4 className="text-[14.5px] md:text-[15px] leading-snug text-foreground group-hover:text-[#B3121B] transition-colors duration-150 line-clamp-3 flex-1 mt-0.5" style={{ fontFamily: "'Hind Vadodara', 'Noto Sans Gujarati', sans-serif", fontWeight: 700 }}>
                {getArticleTitle(art, language)}
              </h4>
            </Link>
          ))}
        </div>
      </div>

      {/* Gold & Silver Rates (સોના-ચાંદીના ભાવ) */}
      <div>
        <div className="flex items-center gap-1.5 border-b border-border/80 pb-2 mb-3.5">
          <span className="text-[#B3121B] text-[15px] font-extrabold">♦</span>
          <h3 className="text-[15px] font-black text-foreground">
            {labelGoldSilverRates}
          </h3>
        </div>

        <div className="border border-border/80 rounded-sm bg-card p-3.5 space-y-3.5 shadow-sm">
          {/* Gold Rate Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-extrabold select-none shadow-sm">
                🏅
              </div>
              <div>
                <h4 className="text-[14px] text-foreground leading-tight" style={{ fontFamily: "'Hind Vadodara', 'Noto Sans Gujarati', sans-serif", fontWeight: 700 }}>
                  {labelGold}
                </h4>
                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                  {labelKarat}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[16px] text-foreground leading-none" style={{ fontFamily: "'Hind Vadodara', 'Noto Sans Gujarati', sans-serif", fontWeight: 800 }}>
                ₹{formatPrice(goldPrice)}
              </p>
              <p className="text-[11px] font-bold text-emerald-600 flex items-center justify-end gap-0.5 mt-1 select-none">
                ▲ ₹{formatChange(goldChange)}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/40" />

          {/* Silver Rate Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 font-extrabold select-none shadow-sm">
                🥈
              </div>
              <div>
                <h4 className="text-[14px] text-foreground leading-tight" style={{ fontFamily: "'Hind Vadodara', 'Noto Sans Gujarati', sans-serif", fontWeight: 700 }}>
                  {labelSilver}
                </h4>
                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                  {labelPerKg}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[16px] text-foreground leading-none" style={{ fontFamily: "'Hind Vadodara', 'Noto Sans Gujarati', sans-serif", fontWeight: 800 }}>
                ₹{formatPrice(silverPrice)}
              </p>
              <p className="text-[11px] font-bold text-muted-foreground flex items-center justify-end gap-0.5 mt-1 select-none">
                — {labelStable}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (view === 'timeline') {
    return timelineContent;
  }

  if (view === 'sidebar') {
    return sidebarContent;
  }

  return (
    <section className="mt-8">
      {/* Divider and section outer wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_336px] gap-8 items-start border-t border-border/60 pt-6">
        {timelineContent}
        {sidebarContent}
      </div>
    </section>
  );
}
