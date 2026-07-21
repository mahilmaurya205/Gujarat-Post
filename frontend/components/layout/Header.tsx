'use client';

/* eslint-disable @next/next/no-html-link-for-pages */
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  BookOpen,
  ChevronDown,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  X,
  Home,
} from 'lucide-react';
import { useApp } from '@/components/AppProvider';
import { SocialLinks } from '@/components/ui/SocialLinks';
import Advertisement from '@/components/ads/Advertisement';
import gpLogo from '../../public/Gujarat Post Logo.gif';

const languageLabels = {
  gu: 'ગુજરાતી',
  en: 'English',
  hi: 'हिन्दी',
};

const cityTranslations: Record<string, { gu: string; hi: string; en: string }> = {
  'અમદાવાદ': { gu: 'અમદાવાદ', hi: 'अहमदाबाद', en: 'Ahmedabad' },
  'સુરત': { gu: 'સુરત', hi: 'सूरत', en: 'Surat' },
  'વડોદરા': { gu: 'વડોદરા', hi: 'वडोदरा', en: 'Vadodara' },
  'રાજકોટ': { gu: 'રાજકોટ', hi: 'राजकोट', en: 'Rajkot' },
  'ગાંધીનગર': { gu: 'ગાંધીનગર', hi: 'गांधीनगर', en: 'Gandhinagar' },
  'અન્ય': { gu: 'અન્ય', hi: 'अन्य', en: 'Other' },
};

function AppleIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.72-1.18 1.86-1.03 2.97 1.12.09 2.27-.6 2.98-1.41z" />
    </svg>
  );
}

function PlayStoreIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 466 511.98" className={className}>
      <path fill="#EA4335" d="M199.9 237.8 1.4 470.17c7.22 24.57 30.16 41.81 55.8 41.81 11.16 0 20.93-2.79 29.3-8.37l244.16-139.46L199.9 237.8z" />
      <path fill="#FBBC04" d="m433.91 205.1-104.65-60-111.61 110.22 113.01 108.83 104.64-58.6c18.14-9.77 30.7-29.3 30.7-50.23-1.4-20.93-13.95-40.46-32.09-50.22z" />
      <path fill="#34A853" d="M199.42 273.45 329.27 145.1 87.9 8.37C79.53 2.79 68.36 0 57.2 0 30.7 0 6.98 18.14 1.4 41.86l198.02 231.59z" />
      <path fill="#4285F4" d="M1.39 41.86C0 46.04 0 51.63 0 57.2v397.64c0 5.57 0 9.76 1.4 15.34l216.27-214.86L1.39 41.86z" />
    </svg>
  );
}

// The 12 flat navigation links shown in the nav bar
const NAV_LINKS = [
  { label: 'Home', labelGu: 'હોમ', labelHi: 'होम', href: '/' },
  { label: 'Videos', labelGu: 'વીડિયો', labelHi: 'वीडियो', href: '/videos' },
  { label: 'Gujarat', labelGu: 'ગુજરાત', labelHi: 'गुजरात', href: '/category/gujarat' },
  { label: 'India', labelGu: 'ભારત', labelHi: 'भारत', href: '/category/national' },
  { label: 'World', labelGu: 'વિશ્વ', labelHi: 'विश्व', href: '/category/world' },
  { label: 'Politics', labelGu: 'રાજનીતિ', labelHi: 'राजनीति', href: '/category/politics' },
  { label: 'Crime', labelGu: 'ક્રાઇમ', labelHi: 'क्राइम', href: '/category/crime' },
  { label: 'Health', labelGu: 'હેલ્થ', labelHi: 'health', href: '/category/health' },
  { label: 'Entertainment', labelGu: 'મનોરંજન', labelHi: 'मनोरंजन', href: '/category/entertainment' },
  { label: 'Technology', labelGu: 'ટેક્નોલોજી', labelHi: 'टेक्नोलॉजी', href: '/category/technology' },
  { label: 'Photos', labelGu: 'ફોટો ગેલેરી', labelHi: 'फोटो गैलरी', href: '/photos' },
  { label: 'Fact Check', labelGu: 'ફેક્ટ ચેક', labelHi: 'फैक्ट चेक', href: '/category/fact-check' },
  { label: 'Trending', labelGu: 'ટ્રેન્ડિંગ', labelHi: 'ट्रेंडिंग', href: '/category/trending' },
  { label: 'Election 2027', labelGu: 'ચૂંટણી 2027', labelHi: 'चुनाव 2027', href: '/category/election-2027' },
  { label: 'Podcast', labelGu: 'પોડકાસ્ટ', labelHi: 'पॉडकास्ट', href: '/videos?tab=podcast' },
];

// The links shown under the "More/Other" (અન્ય) dropdown
const OTHER_LINKS = [
  { label: 'Instagram', labelGu: 'ઇન્સ્ટાગ્રામ', labelHi: 'इन्स्टाग्राम', href: '/category/instagram' },
  { label: 'Webstory', labelGu: 'વેબસ્ટોરી', labelHi: 'वेब स्टोरीज', href: '/category/webstory' },
  { label: 'Weather', labelGu: 'હવામાન', labelHi: 'मौसम', href: '/category/weather' },
  { label: 'Gold - Silver', labelGu: 'ગોલ્ડ - સિલ્વર', labelHi: 'गोल्ड - सिल्वर', href: '/category/gold-silver' },
];

const formatDateLong = (lang: string) => {
  const locale = lang === 'gu' ? 'gu-IN' : lang === 'hi' ? 'hi-IN' : 'en-GB';
  return new Date().toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatDateShort = (lang: string) => {
  const locale = lang === 'gu' ? 'gu-IN' : lang === 'hi' ? 'hi-IN' : 'en-GB';
  return new Date().toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function Header() {
  const pathname = usePathname();
  if (pathname === '/login' || pathname.startsWith('/admin')) {
    return null;
  }

  const router = useRouter();
  const { theme, toggleTheme, language, setLanguage, fsLevel, incFs, decFs } = useApp();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCity, setSelectedCity] = useState('અમદાવાદ');
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [otherMenuOpen, setOtherMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLLIElement>(null);
  const [dropdownLeft, setDropdownLeft] = useState<number | null>(null);

  const updateSavedCount = () => {
    try {
      const stored = localStorage.getItem('gp-saved-articles');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedCount(parsed.length);
          return;
        }
      }
      setSavedCount(0);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    try {
      const savedCity = localStorage.getItem('gp-selected-city');
      if (savedCity) {
        setSelectedCity(savedCity);
      } else {
        localStorage.setItem('gp-selected-city', 'અમદાવાદ');
      }
    } catch (e) {
      console.warn(e);
    }
    updateSavedCount();
    window.addEventListener('gp-saved-changed', updateSavedCount);
    window.addEventListener('storage', updateSavedCount);
    return () => {
      window.removeEventListener('gp-saved-changed', updateSavedCount);
      window.removeEventListener('storage', updateSavedCount);
    };
  }, []);

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setCityModalOpen(false);
    try {
      localStorage.setItem('gp-selected-city', city);
      window.dispatchEvent(new CustomEvent('gp-city-changed', { detail: city }));
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  const [languageOpen, setLanguageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  // Determine active link: exact match for home, startsWith for others
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/') || pathname.startsWith(href + '?');
  };

  const getNavLabel = (link: (typeof NAV_LINKS)[0]) => {
    if (language === 'hi') return link.labelHi;
    if (language === 'gu') return link.labelGu;
    return link.label;
  };

  return (
    <>
      <header className="border-b border-border bg-card/95">
        {/* Top bar: date + social */}
        <div className="bg-black dark:bg-black text-white/95">
          <div className="mx-auto flex max-w-screen-xl max-w-header-layout items-center justify-between gap-3 px-4 py-1.5">
            <div className="min-w-0 flex items-center gap-3 truncate text-sm font-semibold opacity-85">
              <span className="hidden sm:inline">
                {mounted ? formatDateLong(language) : 'Sunday, 21 June 2026'}
              </span>
              <span className="sm:hidden">
                {mounted ? formatDateShort(language) : '21 Jun 2026'}
              </span>
              <span className="opacity-40">|</span>
              <button
                type="button"
                onClick={() => setCityModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-red-200 transition duration-150 cursor-pointer bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-full select-none font-sans"
              >
                <span>📍</span>
                <span>{cityTranslations[selectedCity]?.[language] || selectedCity}</span>
              </button>
            </div>
            <div className="flex items-center gap-3.5 shrink-0 max-sm:hidden">
              <div className="flex items-center gap-2">
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-[10.5px] font-black text-white hover:border-zinc-500 hover:bg-zinc-800 transition-all hover:scale-[1.03] active:scale-95 shadow-sm select-none cursor-pointer"
                >
                  <AppleIcon className="h-3.5 w-3.5 text-white" />
                  <span>App Store</span>
                </a>
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-[10.5px] font-black text-white hover:border-zinc-500 hover:bg-zinc-800 transition-all hover:scale-[1.03] active:scale-95 shadow-sm select-none cursor-pointer"
                >
                  <PlayStoreIcon className="h-3.5 w-3.5 text-white" />
                  <span>Google Play</span>
                </a>
              </div>
              <span className="opacity-20 select-none text-current">|</span>
              <SocialLinks size="sm" />
            </div>
          </div>
        </div>


        {/* Logo + Controls */}
        <div className="mx-auto flex max-w-screen-xl max-w-header-layout items-center justify-between gap-5 px-4 py-2.5">
          {/* Slogan on top, Logo below */}
          <div className="flex flex-col items-start gap-1 select-none">
            {/* Slogan */}
            <div className="flex flex-col justify-center leading-tight">
              <p className="text-[12px] md:text-[13px] font-black text-foreground tracking-wide whitespace-nowrap">
                Real Stories. <span className="text-red-600">Real Gujarat.</span>
              </p>
            </div>

            {/* Logo */}
            <a href="/" className="logo-3d group flex shrink-0 items-center">
              <span className="logo-3d-inner relative block h-14 overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black/10 transition-all duration-300 sm:h-14 lg:h-16 w-40 sm:w-48 lg:w-56">
                <Image
                  src={gpLogo}
                  alt="Gujarat Post"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 224px"
                  className="object-cover"
                />
              </span>
            </a>
          </div>

          {/* Header Ad Slot (visible on desktop) */}
          <div className="hidden lg:block max-w-[600px] xl:max-w-[850px] 2xl:max-w-[950px] flex-1 mx-4 2xl:mx-6">
            <Advertisement position="header" className="w-full" />
          </div>

          {/* Right-side compact Search + News Brief Container (desktop only) */}
          <div className="ml-auto mr-3 hidden md:flex items-center gap-6 select-none shrink-0">
            {/* NEWS BRIEF Button */}
            <Link
              href="/news-brief"
              className="group flex items-center gap-1 hover:opacity-90 transition-all select-none active:scale-[0.98]"
            >
              <Image
                src="/rightSide.png"
                alt="NEWS BRIEF"
                width={22}
                height={12}
                className="h-3 w-auto shrink-0 object-contain transition-transform duration-200 group-hover:translate-x-0.5"
              />
              <span className="font-black font-sans text-[15px] tracking-wider text-black dark:text-white uppercase leading-none select-none group-hover:text-[#B3121B] transition-colors duration-200">
                NEWS BRIEF
              </span>
            </Link>

            {/* Compact Search Trigger */}
            <div
              className="relative w-[140px] lg:w-[180px] flex items-center cursor-pointer group shrink-0"
              onClick={() => router.push('/search')}
            >
              <div className="h-[34px] w-full rounded-full border border-border bg-muted py-1.5 pl-10 pr-3.5 text-[13px] text-muted-foreground transition-all duration-200 group-hover:border-accent group-hover:bg-card select-none flex items-center">
                સમાચાર શોધો...
              </div>
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground group-hover:text-accent transition-colors">
                <Search className="h-[14px] w-[14px]" />
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Mobile Search Button (only on mobile screen widths) */}
            <div className={`md:hidden relative flex items-center transition-all duration-300 ease-in-out ${searchOpen ? 'w-44 sm:w-64' : 'w-10'}`}>
              <form onSubmit={submitSearch} className="relative w-full flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="સમાચાર શોધો..."
                  className={`h-10 w-full rounded-full border border-border bg-muted py-2 pl-10 pr-10 text-sm text-foreground outline-none transition-all duration-300 ease-in-out focus:border-accent focus:bg-card ${searchOpen ? 'opacity-100 pointer-events-auto' : 'w-10 opacity-0 pointer-events-none'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (searchOpen) {
                      if (searchQuery.trim()) {
                        const query = searchQuery.trim();
                        setSearchOpen(false);
                        router.push(`/search?q=${encodeURIComponent(query)}`);
                      } else {
                        setSearchOpen(false);
                      }
                    } else {
                      setSearchOpen(true);
                    }
                  }}
                  className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-secondary ${searchOpen ? 'text-muted-foreground hover:bg-transparent' : 'bg-muted'
                    }`}
                  aria-label={searchOpen ? 'Submit Search' : 'Search'}
                >
                  <Search className="h-4 w-4" />
                </button>
                {searchOpen && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                    aria-label="Close search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </form>
            </div>

            {/* Language switcher */}
            <div className={`relative transition-all duration-300 ${searchOpen ? 'max-sm:hidden' : ''}`}>
              <button
                type="button"
                onClick={() => setLanguageOpen((value) => !value)}
                className="inline-flex h-10 items-center gap-1 rounded-full bg-muted px-4 text-sm font-black text-foreground transition hover:bg-secondary"
                aria-label="Switch language"
                aria-expanded={languageOpen}
              >
                {languageLabels[language]}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {languageOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 min-w-32 rounded-md border border-border bg-card p-1 shadow-lg">
                  {(['gu', 'en', 'hi'] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setLanguage(item);
                        setLanguageOpen(false);
                      }}
                      className="block w-full rounded px-3 py-2 text-left text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      {languageLabels[item]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Articles button */}
            {/* <Link
            href="/saved"
            className={`inline-flex h-10 w-10 relative items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-secondary ${
              searchOpen ? 'max-sm:hidden' : ''
            }`}
            aria-label="Saved articles"
            title={language === 'gu' ? 'સાચવેલા લેખ' : 'Saved Articles'}
          >
            <span className="text-[15px]">🔖</span>
            {savedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent text-[9px] font-black text-white px-1 shadow-sm font-sans">
                {savedCount}
              </span>
            )}
          </Link> */}

            {/* Font Sizing Controls */}
            {/* <div className={`inline-flex items-center rounded-full bg-muted p-0.5 border border-border/20 font-sans ${searchOpen ? 'max-sm:hidden' : ''}`}>
            <button
              type="button"
              onClick={decFs}
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black hover:bg-secondary transition-colors cursor-pointer text-foreground/80 hover:text-foreground"
              title="Decrease font size"
              disabled={fsLevel <= 0}
            >
              A−
            </button>
            <button
              type="button"
              onClick={incFs}
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-black hover:bg-secondary transition-colors cursor-pointer text-foreground/80 hover:text-foreground"
              title="Increase font size"
              disabled={fsLevel >= 3}
            >
              A+
            </button>
          </div> */}

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-secondary ${searchOpen ? 'max-sm:hidden' : ''
                }`}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* User / Login */}
            <a
              href={isAuthenticated ? '/admin' : '/login'}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-secondary ${searchOpen ? 'max-sm:hidden' : ''
                }`}
              aria-label={isAuthenticated ? 'Go to Admin Dashboard' : 'Go to Login Page'}
              title={isAuthenticated ? 'Admin Dashboard' : 'Sign In'}
            >
              <User className="h-4 w-4" />
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground md:hidden"
              aria-label="Open menu"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* ── Desktop Nav Bar ──────────────────────────────────────────────── */}
        <nav
          className="hidden border-t border-border bg-card/98 md:block"
          aria-label="Main navigation"
        >
          <div className="mx-auto max-w-screen-xl max-w-header-layout px-4 flex items-center justify-between gap-4 relative">
            {/* Main scrollable navigation list */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <ul className="flex items-center gap-0 overflow-x-auto scrollbar-none">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <li key={link.href} className="shrink-0">
                      <a
                        href={link.href}
                        className={`relative flex h-11 items-center whitespace-nowrap px-3.5 text-sm font-semibold transition-colors duration-150 lg:px-4 ${active
                          ? 'text-accent'
                          : 'text-foreground hover:text-accent'
                          }`}
                        aria-current={active ? 'page' : undefined}
                      >
                        {link.href === '/' ? (
                          <span className="flex items-center gap-1.5">
                            <Home className="h-4 w-4 shrink-0" />
                            <span>{getNavLabel(link)}</span>
                          </span>
                        ) : (
                          getNavLabel(link)
                        )}
                        {/* Active indicator – thick red underline */}
                        {active && (
                          <span
                            className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-accent"
                            aria-hidden="true"
                          />
                        )}
                      </a>
                    </li>
                  );
                })}

                {/* Other / અન્ય Dropdown Trigger */}
                <li
                  ref={triggerRef}
                  className="relative shrink-0"
                  onMouseEnter={() => {
                    setOtherMenuOpen(true);
                    const rect = triggerRef.current?.getBoundingClientRect();
                    const navWrapper = triggerRef.current?.closest('.max-w-header-layout');
                    const navRect = navWrapper?.getBoundingClientRect();
                    if (rect && navRect) {
                      setDropdownLeft(rect.left - navRect.left);
                    }
                  }}
                  onMouseLeave={() => setOtherMenuOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setOtherMenuOpen(!otherMenuOpen)}
                    className={`relative flex h-11 items-center gap-1 whitespace-nowrap px-3.5 text-sm font-semibold transition-colors duration-150 lg:px-4 cursor-pointer ${otherMenuOpen ? 'text-accent' : 'text-foreground hover:text-accent'
                      }`}
                  >
                    <span>{language === 'gu' ? 'અન્ય' : language === 'hi' ? 'अन्य' : 'More'}</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${otherMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                </li>
              </ul>
            </div>

            {/* Non-scrollable controls pinned to the right (E-Paper CTA only) */}
            <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-border/40 h-11 relative">
              {/* E-Paper CTA */}
              <a
                href="/epaper"
                className="group relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-accent to-red-700 px-4 text-xs font-black text-white shadow-md shadow-red-900/30 ring-1 ring-red-700/40 transition-all duration-200 hover:shadow-lg hover:shadow-red-900/40 hover:scale-[1.03] active:scale-95"
              >
                {/* shimmer sweep on hover */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" aria-hidden="true" />
                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                <span className="tracking-wide">ઈ-પેપર</span>
                {/* live pulse dot */}
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              </a>
            </div>

            {otherMenuOpen && (
              <div
                className="absolute z-50 min-w-40 rounded-lg border border-border bg-card p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
                style={{
                  top: '100%',
                  left: dropdownLeft !== null ? `${dropdownLeft}px` : undefined,
                }}
                onMouseEnter={() => setOtherMenuOpen(true)}
                onMouseLeave={() => setOtherMenuOpen(false)}
              >
                {OTHER_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`block rounded-md px-3.5 py-2 text-left text-xs font-semibold transition-colors duration-150 ${active
                        ? 'bg-accent/10 text-accent'
                        : 'text-foreground hover:bg-muted hover:text-accent'
                        }`}
                    >
                      {getNavLabel(link)}
                    </a>
                  );
                })}
              </div>
            )}
          </div></nav>

        {/* ── Mobile Drawer ────────────────────────────────────────────────── */}
        {menuOpen && (
          <nav className="border-t border-border bg-card md:hidden" aria-label="Mobile navigation">
            <div className="px-4 py-3">
              {/* E-Paper CTA */}
              <a
                href="/epaper"
                onClick={() => setMenuOpen(false)}
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-black text-white shadow hover:bg-accent-hover transition"
              >
                ઈ-પેપર
              </a>

              {/* App downloads CTA */}
              <div className="mb-3.5 flex items-center justify-between gap-2 p-3 rounded-xl bg-muted/40 border border-border">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">App:</span>
                <div className="flex gap-2">
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[10px] font-black text-white hover:border-zinc-500 hover:bg-zinc-800 transition active:scale-95 shadow-sm"
                  >
                    <AppleIcon className="h-3.5 w-3.5 animate-pulse text-white" />
                    <span>App Store</span>
                  </a>
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[10px] font-black text-white transition active:scale-95 shadow-sm hover:border-zinc-500 hover:bg-zinc-800"
                  >
                    <PlayStoreIcon className="h-3.5 w-3.5 text-white" />
                    <span>Google Play</span>
                  </a>
                </div>
              </div>

              {/* Flat link grid */}
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {[...NAV_LINKS, ...OTHER_LINKS].map((link) => {
                  const active = isActive(link.href);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${active
                        ? 'border-accent/30 bg-accent/8 text-accent'
                        : 'border-border bg-muted text-foreground hover:border-accent/25 hover:text-accent'
                        }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {active && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      )}
                      <span className="truncate">{getNavLabel(link)}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* City selection modal */}
      {cityModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs transition-opacity duration-300">
          <div className="w-full max-w-sm scale-100 rounded-lg border border-border bg-card p-5 shadow-2xl transition-all duration-300">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-2.5">
              <h3 className="text-[15px] font-black text-foreground flex items-center gap-1.5 select-none">
                <span>📍</span>
                {language === 'gu' ? 'શહેર પસંદ કરો' : language === 'hi' ? 'शहर का चयन करें' : 'Select Your City'}
              </h3>
              <button
                type="button"
                onClick={() => setCityModalOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {['અમદાવાદ', 'સુરત', 'વડોદરા', 'રાજકોટ', 'ગાંધીનગર', 'અન્ય'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleSelectCity(city)}
                  className={`rounded border py-2.5 text-xs font-black transition-all cursor-pointer text-center ${selectedCity === city
                    ? 'border-accent bg-accent/5 text-accent shadow-sm font-sans'
                    : 'border-border bg-card hover:bg-muted hover:border-foreground/20 text-foreground'
                    }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
