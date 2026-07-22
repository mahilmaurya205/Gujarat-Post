'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/AppProvider';

const DISTRICTS = [
  { gu: 'અમદાવાદ', hi: 'अहमदाबाद', en: 'Ahmedabad', slug: 'ahmedabad' },
  { gu: 'ગાંધીનગર', hi: 'गांधीनगर', en: 'Gandhinagar', slug: 'gandhinagar' },
  { gu: 'સુરત', hi: 'सूरत', en: 'Surat', slug: 'surat' },
  { gu: 'વડોદરા', hi: 'वडोदरा', en: 'Vadodara', slug: 'vadodara' },
  { gu: 'રાજકોટ', hi: 'राजकोट', en: 'Rajkot', slug: 'rajkot' },
  { gu: 'અન્ય શહેરો', hi: 'अन्य शहर', en: 'Other Cities', slug: 'otherCities' }
];

const MORE_DISTRICTS = [
  { gu: 'અમરેલી', hi: 'अमरेली', en: 'Amreli', slug: 'amreli' },
  { gu: 'આણંદ', hi: 'आणंद', en: 'Anand', slug: 'anand' },
  { gu: 'ભાવનગર', hi: 'भावनगर', en: 'Bhavnagar', slug: 'bhavnagar' },
  { gu: 'જામનગર', hi: 'जामनगर', en: 'Jamnagar', slug: 'jamnagar' },
  { gu: 'જૂનાગઢ', hi: 'जूनागढ़', en: 'Junagadh', slug: 'junagadh' },
  { gu: 'ભરૂચ', hi: 'भरूच', en: 'Bharuch', slug: 'bharuch' },
  { gu: 'અરવલ્લી', hi: 'अरावली', en: 'Aravalli', slug: 'aravalli' },
  { gu: 'બનાસકાંઠા', hi: 'बनासकांठा', en: 'Banaskantha', slug: 'banaskantha' },
  { gu: 'બોટાદ', hi: 'बोटाद', en: 'Botad', slug: 'botad' },
  { gu: 'છોટા ઉદેપુર', hi: 'छोटा उदयपुर', en: 'Chhota Udepur', slug: 'chhota-udepur' },
  { gu: 'દાહોદ', hi: 'दाहोद', en: 'Dahod', slug: 'dahod' },
  { gu: 'ડાંગ', hi: 'डांग', en: 'Dang', slug: 'dang' },
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
    <div className="w-full border-t border-border/40 bg-card/95 backdrop-blur-md select-none py-1.5 md:py-2">
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
            {/* <span
              className="text-[14.5px] md:text-[15.5px] font-semibold text-foreground whitespace-nowrap flex items-center gap-0.5 select-none"
            >
              <span>{language === 'gu' ? 'અન્ય શહેરો' : language === 'hi' ? 'अन्य शहर' : 'Other Cities'}</span>
            </span> */}
          </div>
        </div>

        {/* Dropdown Menu - Disabled */}
      </div>
    </div>
  );
}
