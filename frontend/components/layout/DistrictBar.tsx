'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/AppProvider';

const DISTRICTS = [
  { gu: 'અમદાવાદ', hi: 'अहमदाबाद', en: 'Ahmedabad', slug: 'ahmedabad' },
  { gu: 'ગાંધીનગર', hi: 'गांधीनगर', en: 'Gandhinagar', slug: 'gandhinagar' },
  { gu: 'વડોદરા', hi: 'वडोदरा', en: 'Vadodara', slug: 'vadodara' },
  { gu: 'સુરત', hi: 'सूरत', en: 'Surat', slug: 'surat' },
  { gu: 'અમરેલી', hi: 'अमरेली', en: 'Amreli', slug: 'amreli' },
  { gu: 'આણંદ', hi: 'आणंद', en: 'Anand', slug: 'anand' },
  { gu: 'ભાવનગર', hi: 'भावनगर', en: 'Bhavnagar', slug: 'bhavnagar' },
  { gu: 'જામનગર', hi: 'जामनगर', en: 'Jamnagar', slug: 'jamnagar' },
  { gu: 'જૂનાગઢ', hi: 'जूनागढ़', en: 'Junagadh', slug: 'junagadh' },
  { gu: 'રાજકોટ', hi: 'राजकोट', en: 'Rajkot', slug: 'rajkot' },
  { gu: 'ભરૂચ', hi: 'भरूच', en: 'Bharuch', slug: 'bharuch' },
  { gu: 'અરવલ્લી', hi: 'अरावली', en: 'Aravalli', slug: 'aravalli' },
  { gu: 'બનાસકાંઠા', hi: 'बनासकांठा', en: 'Banaskantha', slug: 'banaskantha' },
  { gu: 'બોટાદ', hi: 'बोटाद', en: 'Botad', slug: 'botad' },
  { gu: 'છોટા ઉદેપુર', hi: 'छोटा उदयपुर', en: 'Chhota Udepur', slug: 'chhota-udepur' },
  { gu: 'દાહોદ', hi: 'दाहोद', en: 'Dahod', slug: 'dahod' },
  { gu: 'ડાંગ', hi: 'डांग', en: 'Dang', slug: 'dang' }
];

const MORE_DISTRICTS = [
  { gu: 'દેવભૂમિ દ્વારકા', hi: 'देवभूमि द्वारका', en: 'Devbhumi Dwarka', slug: 'devbhumi-dwarka' },
  { gu: 'ગીર સોમનાથ', hi: 'गीर सोमनाथ', en: 'Gir Somnath', slug: 'gir-somnath' },
  { gu: 'કચ્છ', hi: 'कच्छ', en: 'Kutch', slug: 'kutch' },
  { gu: 'ખેડા', hi: 'खेड़ा', en: 'Kheda', slug: 'kheda' },
  { gu: 'મહીસાગર', hi: 'महीसागर', en: 'Mahisagar', slug: 'mahisagar' },
  { gu: 'મહેસાણા', hi: 'महेसाणा', en: 'Mehsana', slug: 'mehsana' },
  { gu: 'મોરબી', hi: 'मोरबी', en: 'Morbi', slug: 'morbi' },
  { gu: 'નર્મદા', hi: 'नर्मदा', en: 'Narmada', slug: 'narmada' },
  { gu: 'નવસારી', hi: 'नवसारी', en: 'Navsari', slug: 'navsari' },
  { gu: 'પંચમહાલ', hi: 'पंचमहाल', en: 'Panchmahal', slug: 'panchmahal' },
  { gu: 'પાટણ', hi: 'पाटण', en: 'Patan', slug: 'patan' },
  { gu: 'પોરબંદર', hi: 'पोरबंदर', en: 'Porbandar', slug: 'porbandar' },
  { gu: 'સાબરકાંઠા', hi: 'साबरकांठा', en: 'Sabarkantha', slug: 'sabarkantha' },
  { gu: 'સુરેન્દ્રનગર', hi: 'सुरेंद्रनगर', en: 'Surendranagar', slug: 'surendranagar' },
  { gu: 'તાપી', hi: 'तापी', en: 'Tapi', slug: 'tapi' },
  { gu: 'વલસાડ', hi: 'वलसाड', en: 'Valsad', slug: 'valsad' },
  { gu: 'દમણ અને દીવ', hi: 'दमण और दीव', en: 'Daman and Diu', slug: 'daman-and-diu' },
  { gu: 'વાવ-થરાદ', hi: 'वाव-थराद', en: 'Vav-Tharad', slug: 'vav-tharad' }
];

export default function DistrictBar() {
  const { language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full border-b border-border/40 bg-card/75 backdrop-blur-sm sticky top-[108px] z-40 select-none py-1.5 md:py-2">
      <div className="mx-auto flex max-w-screen-xl max-w-header-layout items-center gap-3.5 px-4">
        {/* Gujarat Map Logo and vertical separator */}
        <div className="flex items-center gap-3 shrink-0 pr-3 border-r border-border/50">
          <img 
            src="/assets/GujaratLogo.png"
            alt="Gujarat Logo"
            style={{ height: '38px', width: 'auto', display: 'block' }}
            className="object-contain transform transition-transform duration-300 hover:scale-110 cursor-pointer select-none"
          />
        </div>

        {/* Scrollable list of Districts */}
        <div className="flex-1 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-6 py-0.5 pr-4">
            {DISTRICTS.map((dist) => {
              const label = language === 'hi' ? dist.hi : language === 'gu' ? dist.gu : dist.en;
              return (
                <Link
                  key={dist.slug}
                  href={`/category/${dist.slug}`}
                  className="text-[14.5px] md:text-[15.5px] font-semibold text-foreground hover:text-[#B3121B] transition-colors duration-150 whitespace-nowrap"
                >
                  {label}
                </Link>
              );
            })}

            {/* More / અન્ય Dropdown Trigger (Placed inside the scroll list right after Dang) */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`text-[14.5px] md:text-[15.5px] font-semibold transition-colors duration-150 whitespace-nowrap flex items-center gap-0.5 cursor-pointer select-none bg-transparent border-none outline-none ${
                isOpen ? 'text-[#B3121B]' : 'text-muted-foreground hover:text-[#B3121B]'
              }`}
            >
              <span>{language === 'gu' ? 'વધુ' : language === 'hi' ? 'और अधिक' : 'More'}</span>
              <span className={`text-[10px] opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                {isOpen ? '▲' : '▼'}
              </span>
            </button>
          </div>
        </div>

        {/* Dropdown Menu (Outside scrollable container to prevent overflow clipping, absolute positioned to the right side of the bar) */}
        {isOpen && (
          <div className="absolute right-4 mt-3 top-full z-50 w-[290px] md:w-[340px] rounded-2xl border border-border/80 bg-card p-5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {MORE_DISTRICTS.map((dist) => {
                const label = language === 'hi' ? dist.hi : language === 'gu' ? dist.gu : dist.en;
                return (
                  <Link
                    key={dist.slug}
                    href={`/category/${dist.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="text-[14px] md:text-[14.5px] font-semibold text-foreground hover:text-[#B3121B] transition-colors duration-150 whitespace-nowrap"
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
