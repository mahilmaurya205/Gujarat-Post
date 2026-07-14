'use client';

/* eslint-disable @next/next/no-html-link-for-pages */
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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

// The 12 flat navigation links shown in the nav bar
const NAV_LINKS = [
  { label: 'Home',          labelGu: 'મુખ્ય પૃષ્ઠ',        labelHi: 'होम',               href: '/' },
  { label: 'Gujarat',       labelGu: 'ગુજરાત',              labelHi: 'गुजरात',           href: '/category/gujarat' },
  { label: 'National',      labelGu: 'દેશ',                 labelHi: 'देश',               href: '/category/national' },
  { label: 'World',         labelGu: 'વિશ્વ',               labelHi: 'विश्व',            href: '/category/world' },
  { label: 'Politics',      labelGu: 'રાજકારણ',             labelHi: 'राजनीति',          href: '/category/politics' },
  { label: 'Crime',         labelGu: 'ક્રાઈમ',              labelHi: 'क्राइम',           href: '/category/crime' },
  { label: 'Trending',      labelGu: 'લોકપ્રિય સ્ટોરીઝ',   labelHi: 'ट्रेंडिंग',        href: '/category/trending' },
  { label: 'Fact Check',    labelGu: 'ફેક્ટ ચેક',          labelHi: 'फैक्ट चेक',        href: '/category/fact-check' },
  { label: 'Entertainment', labelGu: 'મનોરંજન',             labelHi: 'मनोरंजन',          href: '/category/entertainment' },
  { label: 'Technology',    labelGu: 'ટેક્નોલોજી',          labelHi: 'टेक्नोलॉजी',       href: '/category/technology' },
  { label: 'Lifestyle',     labelGu: 'લાઈફસ્ટાઈલ',         labelHi: 'लाइफस्टाइल',       href: '/category/lifestyle' },
  { label: 'YouTube',       labelGu: 'યુટ્યુબ',             labelHi: 'यूट्यूब',          href: '/videos' },
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
  const { theme, toggleTheme, language, setLanguage } = useApp();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      {/* Top bar: date + social */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-screen-xl max-w-header-layout items-center justify-between gap-3 px-4 py-1.5">
          <div className="min-w-0 truncate text-sm font-semibold opacity-85">
            <span className="hidden sm:inline">
              {mounted ? formatDateLong(language) : 'Sunday, 21 June 2026'}
            </span>
            <span className="sm:hidden">
              {mounted ? formatDateShort(language) : '21 Jun 2026'}
            </span>
            <span className="mx-2 opacity-40">|</span>
            <span>ગુજરાતનું વિશ્વસનીય ન્યૂઝ નેટવર્ક</span>
          </div>
          <SocialLinks size="sm" className="shrink-0 max-sm:hidden" />
        </div>
      </div>

      {/* Logo + Ad + Controls */}
      <div className="mx-auto flex max-w-screen-xl max-w-header-layout items-center justify-between gap-5 px-4 py-2.5">
        <a href="/" className="logo-3d group flex shrink-0 items-center">
          <span className={`logo-3d-inner relative block h-14 overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black/10 transition-all duration-300 sm:h-14 lg:h-16 ${
            searchOpen ? 'w-24 sm:w-36 lg:w-44' : 'w-40 sm:w-48 lg:w-56'
          }`}>
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

        <Advertisement position="header" className="hidden min-w-0 flex-1 lg:block [&>div]:!min-h-16" />

        <div className="flex shrink-0 items-center gap-2">
          {/* Search */}
          <div className={`relative flex items-center transition-all duration-300 ease-in-out ${searchOpen ? 'w-44 sm:w-72 md:w-80 lg:w-[28rem]' : 'w-10'}`}>
            <form onSubmit={submitSearch} className="relative w-full flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="સમાચાર શોધો..."
                className={`h-10 w-full rounded-full border border-border bg-muted py-2 pl-10 pr-10 text-sm text-foreground outline-none transition-all duration-300 ease-in-out focus:border-accent focus:bg-card ${
                  searchOpen ? 'opacity-100 pointer-events-auto' : 'w-10 opacity-0 pointer-events-none'
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
                className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-secondary ${
                  searchOpen ? 'text-muted-foreground hover:bg-transparent' : 'bg-muted'
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

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-secondary ${
              searchOpen ? 'max-sm:hidden' : ''
            }`}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* User / Login */}
          <a
            href={isAuthenticated ? '/admin' : '/login'}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-secondary ${
              searchOpen ? 'max-sm:hidden' : ''
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
        <div className="relative mx-auto max-w-screen-xl max-w-header-layout px-4">
          {/* E-Paper CTA – absolutely pinned to the right */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
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
          <ul className="flex items-center justify-center gap-0 overflow-x-auto scrollbar-none pr-24">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href} className="shrink-0">
                  <a
                    href={link.href}
                    className={`relative flex h-11 items-center whitespace-nowrap px-3.5 text-sm font-semibold transition-colors duration-150 lg:px-4 ${
                      active
                        ? 'text-accent'
                        : 'text-foreground hover:text-accent'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {getNavLabel(link)}
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


          </ul>
        </div>
      </nav>

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

            {/* Flat link grid */}
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                      active
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
  );
}
