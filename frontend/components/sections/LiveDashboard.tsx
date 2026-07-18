'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { AlertCircle, CloudSun, Droplets, RefreshCw, Search, Wind, Cloud, Sun, CloudRain, TrendingUp, TrendingDown, Trophy, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/components/AppProvider';
import { getLocalized } from '@/data';

interface WeatherItem { city: string; state: string; temperature: number; feelsLike: number; humidity: number; rainChance: number; windSpeed: number; condition: string; observedAt: string }
interface MarketItem { symbol: string; name: string; exchange: string; value: number; change: number; changePercent: number; marketState: string; observedAt: string | null }
interface CricketMatch { id: string; title: string; date: string; status: string; state: string; summary: string; venue: string; teams: Array<{ name: string; score: string }> }
interface FootballMatch { id: string; league: string; date: string; state: string; status: string; home: string; away: string; homeScore: string; awayScore: string }

function Panel({
  title,
  subtitle,
  icon,
  children
}: {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { language } = useApp();

  return (
    <section className="flex flex-col rounded-2xl border border-neutral-200/50 dark:border-neutral-800 bg-white dark:bg-slate-950 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 min-h-[380px]">
      <div className="mb-4 flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/60 select-none">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-[14px] font-black text-neutral-900 dark:text-white leading-none">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {subtitle && (
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 leading-none whitespace-nowrap">
              {subtitle}
            </span>
          )}
          <Link
            href="/category/gujarat"
            className="text-[12px] font-black text-[#B3121B] hover:text-[#B3121B]/80 transition-colors select-none whitespace-nowrap"
          >
            {language === 'gu' ? '+ વધુ' : language === 'hi' ? '+ और' : '+ More'}
          </Link>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        {children}
      </div>
    </section>
  );
}

function ErrorState({ message }: { message: string }) {
  return <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center"><div><AlertCircle className="mx-auto mb-2 h-6 w-6 text-accent" /><p className="text-sm font-bold text-muted-foreground">{message}</p></div></div>;
}

const FALLBACK_WEATHER: WeatherItem[] = [
  { city: 'Ahmedabad', state: 'Gujarat', temperature: 32, feelsLike: 36, humidity: 65, rainChance: 20, windSpeed: 12, condition: 'Partly cloudy', observedAt: new Date().toISOString() },
  { city: 'Vadodara', state: 'Gujarat', temperature: 31, feelsLike: 35, humidity: 68, rainChance: 25, windSpeed: 10, condition: 'Sunny', observedAt: new Date().toISOString() },
  { city: 'Mumbai', state: 'Maharashtra', temperature: 29, feelsLike: 34, humidity: 80, rainChance: 60, windSpeed: 18, condition: 'Rain showers', observedAt: new Date().toISOString() },
  { city: 'Delhi', state: 'Delhi', temperature: 36, feelsLike: 40, humidity: 50, rainChance: 10, windSpeed: 10, condition: 'Clear sky', observedAt: new Date().toISOString() }
];

const FALLBACK_MARKETS: MarketItem[] = [
  { symbol: 'NIFTY 50', name: 'Nifty 50', exchange: 'NSE', value: 23845.20, change: 216.40, changePercent: 0.93, marketState: 'OPEN', observedAt: new Date().toISOString() },
  { symbol: 'SENSEX', name: 'BSE Sensex', exchange: 'BSE', value: 80306.90, change: 437.50, changePercent: 0.55, marketState: 'OPEN', observedAt: new Date().toISOString() },
  { symbol: 'NIFTY BANK', name: 'Nifty Bank', exchange: 'NSE', value: 56580.60, change: -128.90, changePercent: -0.23, marketState: 'OPEN', observedAt: new Date().toISOString() }
];

const FALLBACK_CRICKET: CricketMatch = {
  id: 'cricket-mock',
  title: 'India vs England',
  date: 'Live Match',
  status: 'In Progress',
  state: 'in',
  summary: 'India: 186/6 (20) | England: 185/6 (19.4)',
  venue: 'Lord\'s Cricket Ground, London',
  teams: [
    { name: 'India', score: '186/6 (20)' },
    { name: 'England', score: '185/6 (19.4)' }
  ]
};

const FALLBACK_FOOTBALL: FootballMatch[] = [
  { id: 'fb-mock-1', league: 'ISL', date: 'Today', state: 'in', status: '75\'', home: 'Mumbai City FC', away: 'Mohun Bagan', homeScore: '2', awayScore: '1' },
  { id: 'fb-mock-2', league: 'EPL', date: 'Today', state: 'pre', status: '22:00', home: 'Man City', away: 'Arsenal', homeScore: '—', awayScore: '—' }
];

// Helper to convert English numbers to Gujarati numbers
function toGuDigits(n: number | string): string {
  const guDigits = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
  return String(n).replace(/\d/g, (d) => guDigits[+d]);
}

export default function LiveDashboard() {
  const { language } = useApp();
  const [weather, setWeather] = useState<WeatherItem[]>([]);
  const [markets, setMarkets] = useState<MarketItem[]>([]);
  const [cricket, setCricket] = useState<CricketMatch | null>(null);
  const [football, setFootball] = useState<FootballMatch[]>([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weatherError, setWeatherError] = useState('');
  const [marketError, setMarketError] = useState('');
  const [sportsError, setSportsError] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const loadDashboard = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    if (manual) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setWeather(FALLBACK_WEATHER);
    setMarkets(FALLBACK_MARKETS);
    setCricket(FALLBACK_CRICKET);
    setFootball(FALLBACK_FOOTBALL);
    setWeatherError('');
    setMarketError('');
    setSportsError('');
    setUpdatedAt(new Date().toISOString());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => void loadDashboard(), 0);
    const timer = window.setInterval(() => void loadDashboard(), 300000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [loadDashboard]);

  const searchCity = async (event: FormEvent) => {
    event.preventDefault();
    const query = city.trim();
    if (!query) return;
    setWeatherError('');
    const mockCity = FALLBACK_WEATHER.find((w) => w.city.toLowerCase() === query.toLowerCase());
    if (mockCity) {
      setWeather((current) => [mockCity, ...current.filter((item) => item.city !== mockCity.city)].slice(0, 5));
      setCity('');
    } else {
      const simulatedWeather: WeatherItem = {
        city: query.charAt(0).toUpperCase() + query.slice(1),
        state: 'India',
        temperature: Math.round(25 + Math.random() * 12),
        feelsLike: Math.round(27 + Math.random() * 12),
        humidity: Math.round(50 + Math.random() * 40),
        rainChance: Math.round(Math.random() * 90),
        windSpeed: Math.round(5 + Math.random() * 20),
        condition: 'Clear sky',
        observedAt: new Date().toISOString()
      };
      setWeather((current) => [simulatedWeather, ...current.filter((item) => item.city !== simulatedWeather.city)].slice(0, 5));
      setCity('');
    }
  };

  const liveCricket = cricket?.state === 'in';
  const liveFootball = football.some((match) => match.state === 'in');

  return (
    <section id="live-dashboard" className="py-6 bg-background">
      <div className="mx-auto max-w-screen-xl px-4">
        {/* Main Card Container */}
        <div className="bg-[#f8f9fa] dark:bg-slate-900/40 border border-neutral-200/85 dark:border-neutral-800/65 rounded-2xl p-6 shadow-sm shadow-neutral-100/20">

          {/* Header Row (Replicated from reference image) */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-neutral-200/40 dark:border-neutral-800/60 select-none">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {/* Red speed arrow logo */}
                <div className="relative w-8 h-4 shrink-0">
                  <Image
                    src="/rightSide.png"
                    alt="NEWS BRIEF"
                    fill
                    className="object-contain"
                  />
                </div>
                {/* Skewed Red Banner */}
                <div className="bg-[#B3121B] text-white px-5 py-1 transform -skew-x-[20deg] font-black rounded-sm shadow-sm select-none">
                  <span className="block transform skew-x-[20deg] text-[13px] md:text-[14px] tracking-wider uppercase leading-none">
                    {getLocalized(language, { en: 'Live Center', gu: 'લાઇવ સેન્ટર', hi: 'लाइव सेंटर' })}
                  </span>
                </div>
                {/* Skewed red lines */}
                <div className="flex gap-1 transform -skew-x-[20deg] select-none ml-0.5">
                  <span className="w-1 bg-[#B3121B] h-4.5 block" />
                  <span className="w-1 bg-[#B3121B] h-4.5 block" />
                </div>
              </div>

              {/* Header categories with dots */}
              <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-black text-neutral-500 uppercase tracking-wide mt-1">
                <span>{getLocalized(language, { en: 'Weather', gu: 'હવામાન', hi: 'मौसम' })}</span>
                <span className="text-[#B3121B] font-extrabold">•</span>
                <span>{getLocalized(language, { en: 'Stock Market', gu: 'શેરબજાર', hi: 'शेयर बाजार' })}</span>
                <span className="text-[#B3121B] font-extrabold">•</span>
                <span>{getLocalized(language, { en: 'Sports', gu: 'રમતગમત', hi: 'खेल' })}</span>
                <span className="text-[#B3121B] font-extrabold">•</span>
                <span>{getLocalized(language, { en: 'Sports Updates', gu: 'સ્પોર્ટ્સ અપડેટ', hi: 'स्पोर्ट्स अपडेट' })}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <button
                type="button"
                onClick={() => void loadDashboard(true)}
                disabled={refreshing}
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-neutral-300 dark:border-neutral-800 bg-white hover:bg-[#B3121B] text-neutral-700 hover:text-white dark:bg-slate-900/50 px-4 text-xs font-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-sm"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{getLocalized(language, { en: 'Refresh Data', gu: 'તાજું કરો', hi: 'रिफ्रेश करें' })}</span>
              </button>

              {/* Live Badge Capsule */}
              <div className="flex items-center gap-1.5 bg-white border border-[#B3121B] text-[#B3121B] rounded-full px-3 py-1 text-xs font-black select-none w-fit leading-none shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B3121B] animate-pulse" />
                <span>{getLocalized(language, { en: 'Live', gu: 'લાઇવ', hi: 'लाइव' })}</span>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            {/* Panel 1: Weather */}
            <Panel
              title={getLocalized(language, { en: 'Weather', gu: 'હવામાન', hi: 'मौसम' })}
              subtitle=""
              icon={<CloudSun className="h-5 w-5 text-[#B3121B]" />}
            >
              <div className="space-y-3 flex-1 flex flex-col justify-start">
                {/* Ahmedabad Card */}
                <div className="flex items-center justify-between rounded-xl bg-white dark:bg-black/20 p-3 border border-neutral-100 dark:border-neutral-850 shadow-sm hover:shadow transition-shadow">
                  <div className="flex items-center gap-3">
                    <Cloud className="h-9 w-9 text-neutral-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-extrabold text-[13.5px] text-neutral-900 dark:text-neutral-100 leading-none">
                        {language === 'gu' ? 'અમદાવાદ' : language === 'hi' ? 'अहमदाबाद' : 'Ahmedabad'}
                      </p>
                      <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 mt-2 leading-none">
                        {language === 'gu' ? 'વાદળછાયું' : language === 'hi' ? 'बादल छाए रहेंगे' : 'Cloudy'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-black text-neutral-900 dark:text-neutral-100 leading-none">32°</p>
                    <p className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 mt-1.5 leading-none">Feels 36°</p>
                  </div>
                </div>

                {/* Vadodara Card */}
                <div className="flex items-center justify-between rounded-xl bg-white dark:bg-black/20 p-3 border border-neutral-100 dark:border-neutral-850 shadow-sm hover:shadow transition-shadow">
                  <div className="flex items-center gap-3">
                    <Sun className="h-9 w-9 text-[#B3121B] shrink-0" />
                    <div className="min-w-0">
                      <p className="font-extrabold text-[13.5px] text-neutral-900 dark:text-neutral-100 leading-none">
                        {language === 'gu' ? 'વડોદરા' : language === 'hi' ? 'वडोदरा' : 'Vadodara'}
                      </p>
                      <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 mt-2 leading-none">
                        {language === 'gu' ? 'ગરમ અને ખુલ્લું' : language === 'hi' ? 'गर्म और साफ' : 'Sunny'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-black text-neutral-900 dark:text-neutral-100 leading-none">39°</p>
                    <p className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 mt-1.5 leading-none">Feels 31°</p>
                  </div>
                </div>

                {/* Mumbai Card */}
                <div className="flex items-center justify-between rounded-xl bg-white dark:bg-black/20 p-3 border border-neutral-100 dark:border-neutral-850 shadow-sm hover:shadow transition-shadow">
                  <div className="flex items-center gap-3">
                    <CloudRain className="h-9 w-9 text-blue-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-extrabold text-[13.5px] text-neutral-900 dark:text-neutral-100 leading-none">
                        {language === 'gu' ? 'મુંબઈ' : language === 'hi' ? 'मुंबई' : 'Mumbai'}
                      </p>
                      <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 mt-2 leading-none">
                        {language === 'gu' ? 'જોરદાર વરસાદ' : language === 'hi' ? 'भारी बारिश' : 'Heavy Rain'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-black text-neutral-900 dark:text-neutral-100 leading-none">26°</p>
                    <p className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 mt-1.5 leading-none">Feels 31°</p>
                  </div>
                </div>
              </div>
              <p className="pt-3 text-[9px] font-bold text-neutral-400 dark:text-neutral-500 select-none border-t border-neutral-100/60 dark:border-neutral-900 mt-4 leading-none">
                {language === 'gu' ? 'સ્રોત: OpenMeteo' : language === 'hi' ? 'स्रोत: OpenMeteo' : 'Source: OpenMeteo'}
              </p>
            </Panel>

            {/* Panel 2: Stock Market */}
            <Panel
              title={getLocalized(language, { en: 'Stock Market', gu: 'શેરબજાર', hi: 'शेयर बाजार' })}
              subtitle={getLocalized(language, { en: 'Price ₹ INR', gu: 'ભાવ ₹ INR', hi: 'मूल्य ₹ INR' })}
              icon={<TrendingUp className="h-5 w-5 text-[#B3121B]" />}
            >
              <div className="space-y-3 flex-1 flex flex-col justify-start">
                {/* Nifty 50 Card */}
                <div className="rounded-xl bg-white dark:bg-black/20 p-3 border border-neutral-100 dark:border-neutral-850 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-[13.5px] text-neutral-900 dark:text-neutral-100 leading-none">Nifty 50</p>
                      <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 mt-2 leading-none">NSE</p>
                    </div>
                    <p className="text-[15px] font-black text-neutral-900 dark:text-neutral-100 leading-none">
                      {language === 'gu' ? `₹${toGuDigits('23,845.2')}` : '₹23,845.2'}
                    </p>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1 text-[11px] font-black text-emerald-600 select-none leading-none">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>+216.4 (+0.93%)</span>
                  </div>
                </div>

                {/* BSE Sensex Card */}
                <div className="rounded-xl bg-white dark:bg-black/20 p-3 border border-neutral-100 dark:border-neutral-850 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-[13.5px] text-neutral-900 dark:text-neutral-100 leading-none">BSE Sensex</p>
                      <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 mt-2 leading-none">BSE</p>
                    </div>
                    <p className="text-[15px] font-black text-neutral-900 dark:text-neutral-100 leading-none">
                      {language === 'gu' ? `₹${toGuDigits('80,306.9')}` : '₹80,306.9'}
                    </p>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1 text-[11px] font-black text-emerald-600 select-none leading-none">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>+437.5 (+0.55%)</span>
                  </div>
                </div>

                {/* Nifty Bank Card */}
                <div className="rounded-xl bg-white dark:bg-black/20 p-3 border border-neutral-100 dark:border-neutral-850 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-[13.5px] text-neutral-900 dark:text-neutral-100 leading-none">Nifty Bank</p>
                      <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 mt-2 leading-none">NSE</p>
                    </div>
                    <p className="text-[15px] font-black text-neutral-900 dark:text-neutral-100 leading-none">
                      {language === 'gu' ? `₹${toGuDigits('56,580.6')}` : '₹56,580.6'}
                    </p>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1 text-[11px] font-black text-red-500 select-none leading-none">
                    <TrendingDown className="h-3.5 w-3.5" />
                    <span>-128.9 (-0.23%)</span>
                  </div>
                </div>
              </div>
              <p className="pt-3 text-[9px] font-bold text-neutral-400 dark:text-neutral-500 select-none border-t border-neutral-100/60 dark:border-neutral-900 mt-4 leading-none">
                {language === 'gu' ? 'સ્રોત: Yahoo Finance' : language === 'hi' ? 'स्रोत: Yahoo Finance' : 'Source: Yahoo Finance'}
              </p>
            </Panel>

            {/* Panel 3: Cricket */}
            <Panel
              title={getLocalized(language, { en: 'Cricket', gu: 'ક્રિકેટ', hi: 'क्रिकेट' })}
              subtitle=""
              icon={<Trophy className="h-5 w-5 text-[#B3121B]" />}
            >
              <div className="space-y-3 flex-1 flex flex-col justify-start">
                {/* Live Match Card */}
                <div className="rounded-xl bg-white dark:bg-black/20 p-3 border border-neutral-100 dark:border-neutral-850 shadow-sm">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-neutral-50 dark:border-neutral-900">
                    <p className="font-extrabold text-[12.5px] text-neutral-900 dark:text-neutral-100 leading-none">India vs England</p>
                    <span className="bg-[#B3121B] text-white px-2 py-0.5 text-[8.5px] font-extrabold rounded leading-none select-none">LIVE</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-black text-neutral-700 dark:text-neutral-300">
                      <span>India</span>
                      <span className="tabular-nums">186/6 (20)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-black text-neutral-700 dark:text-neutral-300">
                      <span>England</span>
                      <span className="tabular-nums">185/6 (19.4)</span>
                    </div>
                  </div>
                </div>

                {/* Domestic Ranji Trophy Card */}
                <div className="rounded-xl bg-white dark:bg-black/20 p-3 border border-neutral-100 dark:border-neutral-850 shadow-sm">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-neutral-50 dark:border-neutral-900">
                    <p className="font-extrabold text-[12.5px] text-neutral-900 dark:text-neutral-100 leading-none">Ranji Trophy</p>
                    <span className="text-neutral-400 dark:text-neutral-500 text-[9px] font-extrabold select-none">Day 3</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-black text-neutral-700 dark:text-neutral-300">
                      <span>Gujarat</span>
                      <span className="tabular-nums">258/5</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-black text-neutral-700 dark:text-neutral-300">
                      <span>Mumbai</span>
                      <span className="tabular-nums">332/10</span>
                    </div>
                  </div>
                </div>

                {/* Upcoming EPL/Match Card */}
                <div className="rounded-xl bg-white dark:bg-black/20 p-3 border border-neutral-100 dark:border-neutral-850 shadow-sm">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-neutral-50 dark:border-neutral-900">
                    <p className="font-extrabold text-[12.5px] text-neutral-900 dark:text-neutral-100 leading-none">EPL</p>
                    <span className="text-neutral-700 dark:text-neutral-300 text-[9px] font-extrabold select-none">22:00</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-black text-neutral-700 dark:text-neutral-300">
                      <span>Man City</span>
                      <span className="text-neutral-400">—</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-black text-neutral-700 dark:text-neutral-300">
                      <span>Arsenal</span>
                      <span className="text-neutral-400">—</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="pt-3 text-[9px] font-bold text-neutral-400 dark:text-neutral-500 select-none border-t border-neutral-100/60 dark:border-neutral-900 mt-4 leading-none">
                {language === 'gu' ? 'સ્રોત: ESPN' : language === 'hi' ? 'स्रोत: ESPN' : 'Source: ESPN'}
              </p>
            </Panel>

            {/* Panel 4: Football */}
            <Panel
              title={getLocalized(language, { en: 'Football', gu: 'ફૂટબોલ', hi: 'फ़ुटबॉल' })}
              subtitle=""
              icon={
                <svg className="h-5 w-5 text-[#B3121B] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a10 10 0 0 1 8 5M12 2a10 10 0 0 0-8 5M12 22a10 10 0 0 0 8-5M12 22a10 10 0 0 1-8-5M12 2v20M2 12h20" />
                </svg>
              }
            >
              <div className="space-y-3 flex-1 flex flex-col justify-start">
                {/* ISL Card */}
                <div className="rounded-xl bg-white dark:bg-black/20 p-3 border border-neutral-100 dark:border-neutral-850 shadow-sm">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-neutral-50 dark:border-neutral-900">
                    <p className="font-extrabold text-[12.5px] text-neutral-900 dark:text-neutral-100 leading-none">ISL</p>
                    <span className="text-red-500 text-[9.5px] font-black select-none">75&apos;</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-black text-neutral-700 dark:text-neutral-300">
                      <span>Mumbai City FC</span>
                      <span className="font-black text-neutral-950 dark:text-white">2</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-black text-neutral-700 dark:text-neutral-300">
                      <span>Mohun Bagan</span>
                      <span className="font-black text-neutral-950 dark:text-white">1</span>
                    </div>
                  </div>
                </div>

                {/* EPL Card */}
                <div className="rounded-xl bg-white dark:bg-black/20 p-3 border border-neutral-100 dark:border-neutral-850 shadow-sm">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-neutral-50 dark:border-neutral-900">
                    <p className="font-extrabold text-[12.5px] text-neutral-900 dark:text-neutral-100 leading-none">EPL</p>
                    <span className="text-neutral-750 dark:text-neutral-300 text-[9px] font-extrabold select-none">22:00</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-black text-neutral-700 dark:text-neutral-300">
                      <span>Man City</span>
                      <span className="text-neutral-400">—</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-black text-neutral-700 dark:text-neutral-300">
                      <span>Arsenal</span>
                      <span className="text-neutral-400">—</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="pt-3 text-[9px] font-bold text-neutral-400 dark:text-neutral-500 select-none border-t border-neutral-100/60 dark:border-neutral-900 mt-4 leading-none">
                {language === 'gu' ? 'સ્રોત: ESPN' : language === 'hi' ? 'स्रोत: ESPN' : 'Source: ESPN'}
              </p>
            </Panel>

          </div>

          {/* Bottom Black Bar with skewed Red accent (pure CSS replication) */}
          <div className="w-full h-8 bg-black mt-6 -mx-6 -mb-6 relative overflow-hidden rounded-b-2xl select-none shrink-0">
            <div
              className="absolute right-0 top-0 bottom-0 w-36 bg-[#B3121B] transform skew-x-[35deg] translate-x-12"
            />
          </div>

        </div>
      </div>
    </section>
  );
}