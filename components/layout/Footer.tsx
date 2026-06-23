'use client';

import Link from 'next/link';
import { ArrowRight, Mail, MapPin, Radio, Smartphone } from 'lucide-react';
import { NAV_ITEMS } from '@/data';
import { SocialLinks } from '@/components/ui/SocialLinks';

function AppleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.72-1.18 1.86-1.03 2.97 1.12.09 2.27-.6 2.98-1.41z"/>
    </svg>
  );
}

function PlayStoreIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M3 5.27v13.46c0 .87.87 1.41 1.63.97l11.66-6.73c.75-.43.75-1.51 0-1.94L4.63 4.3C3.87 3.86 3 4.4 3 5.27z"/>
      <path d="M17.47 11.23L4.76 3.89c-.38-.22-.84-.13-1.12.22l11.13 11.13 2.7-2.7c.39-.4.39-1.02 0-1.31z"/>
    </svg>
  );
}

const companyLinks = [
  ['About Us', '/about'],
  ['Contact Us', '/contact'],
  ['Complaint redressal', '/complaint-redressal'],
  ['Advertise with us', '/advertise'],
  ['Careers', '/careers'],
];

const policyLinks = [
  ['Privacy policy', '/privacy-policy'],
  ['Terms & conditions', '/terms'],
  ['Cookie policy', '/cookie-policy'],
  ['Disclaimer', '/disclaimer'],
  ['DNPA code', '/dnpa-code'],
  ['CSR policy', '/csr-policy'],
];

const mediaLinks = [
  ['Watch Never Ends', '/watch'],
  ['Latest Videos', '/videos'],
  ['Shorts', '/shorts'],
  ['Photo Stories', '/photos'],
  ['E-paper', '/epaper'],
];

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="group inline-flex items-center gap-2 text-sm font-medium text-white/62 transition hover:translate-x-0.5 hover:text-white">
    <span className="h-1 w-1 rounded-full bg-white/25 transition group-hover:bg-red-400" />
    {children}
  </Link>
);

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#09111f] text-white">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-52 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative border-b border-white/10 bg-white/[0.035]">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-6 px-4 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-red-400">
              <Mail className="h-4 w-4" /> The Daily Brief
            </div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">News that matters, delivered every morning.</h2>
            <p className="mt-2 text-sm text-white/55">ગુજરાત અને વિશ્વના મહત્વના સમાચાર સીધા તમારા ઇનબોક્સમાં.</p>
          </div>
          <form className="flex w-full max-w-xl flex-col gap-2 sm:flex-row" action="#">
            <label className="sr-only" htmlFor="footer-email">Email address</label>
            <input id="footer-email" type="email" required placeholder="you@example.com" className="h-12 min-w-0 flex-1 rounded-xl border border-white/12 bg-white/[0.07] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-red-400 focus:bg-white/10" />
            <button type="submit" className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-sm font-black text-white shadow-lg shadow-red-950/30 transition hover:-translate-y-0.5 hover:bg-red-600">
              Subscribe <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-screen-xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.8fr] lg:py-16">
        <section className="sm:col-span-2 lg:col-span-1 lg:pr-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-lg font-black shadow-lg shadow-red-950/40">GP</span>
            <span>
              <span className="block text-2xl font-black tracking-tight">Gujarat Post</span>
              <span className="block text-xs font-semibold text-white/45">ગુજરાતનું વિશ્વસનીય ન્યૂઝ નેટવર્ક</span>
            </span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-6 text-white/58">
            Independent reporting, breaking news and sharp explainers from every corner of Gujarat—in Gujarati, Hindi and English.
          </p>
          <div className="mt-5 space-y-2 text-sm text-white/48">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-red-400" /> Ahmedabad, Gujarat, India</p>
            <p className="flex items-center gap-2"><Radio className="h-4 w-4 text-red-400" /> Newsroom active 24 × 7</p>
          </div>
          <SocialLinks size="lg" className="mt-6" />

          {/* App Download buttons styled beautifully */}
          <div className="mt-8">
            <h3 className="text-xs font-black uppercase tracking-[0.16em] text-white mb-3">Download our App</h3>
            <div className="flex flex-wrap gap-2.5">
              <a href="https://apps.apple.com" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 hover:bg-white/[0.08] transition shadow-sm hover:border-white/20">
                <AppleIcon className="h-5 w-5 text-white" />
                <div className="text-left leading-none">
                  <span className="block text-[8px] font-medium text-white/45 uppercase tracking-wide">Download on</span>
                  <span className="block text-xs font-bold text-white mt-0.5">App Store</span>
                </div>
              </a>
              <a href="https://play.google.com" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 hover:bg-white/[0.08] transition shadow-sm hover:border-white/20">
                <PlayStoreIcon className="h-5 w-5 text-white" />
                <div className="text-left leading-none">
                  <span className="block text-[8px] font-medium text-white/45 uppercase tracking-wide">Get it on</span>
                  <span className="block text-xs font-bold text-white mt-0.5">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-xs font-black uppercase tracking-[0.16em] text-white">Explore</h2>
          <ul className="space-y-3">
            {NAV_ITEMS.slice(1, 8).map((item) => <li key={item.href}><FooterLink href={item.href}>{item.label}</FooterLink></li>)}
          </ul>
        </section>

        <section>
          <h2 className="mb-5 text-xs font-black uppercase tracking-[0.16em] text-white">Watch & Read</h2>
          <ul className="space-y-3">
            {mediaLinks.map(([label, href]) => <li key={href}><FooterLink href={href}>{label}</FooterLink></li>)}
          </ul>
          <Link href="/epaper" className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.06] px-3 py-2 text-xs font-bold text-white/75 transition hover:border-white/25 hover:bg-white/10 hover:text-white">
            <Smartphone className="h-4 w-4 text-red-400" /> Read today&apos;s edition
          </Link>
        </section>

        <section>
          <h2 className="mb-5 text-xs font-black uppercase tracking-[0.16em] text-white">Company</h2>
          <ul className="space-y-3">
            {companyLinks.map(([label, href]) => <li key={href}><FooterLink href={href}>{label}</FooterLink></li>)}
          </ul>
          <h2 className="mb-4 mt-8 text-xs font-black uppercase tracking-[0.16em] text-white">Information</h2>
          <ul className="space-y-3">
            {policyLinks.slice(0, 4).map(([label, href]) => <li key={href}><FooterLink href={href}>{label}</FooterLink></li>)}
          </ul>
        </section>

        {/* Reader/Subscriber statistics row spanning 4 columns */}
        <div className="sm:col-span-2 lg:col-span-4 border-t border-white/10 pt-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center hover:border-white/10 transition shadow-inner">
              <span className="text-2xl font-black tracking-tight text-accent block">5.2M+</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40 block mt-1">Monthly Active Readers</span>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center hover:border-white/10 transition shadow-inner">
              <span className="text-2xl font-black tracking-tight text-accent block">1.5M+</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40 block mt-1">YouTube Subscribers</span>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center hover:border-white/10 transition shadow-inner">
              <span className="text-2xl font-black tracking-tight text-accent block">250K+</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40 block mt-1">Newsletter Subscribers</span>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center hover:border-white/10 transition shadow-inner">
              <span className="text-2xl font-black tracking-tight text-accent block">24 × 7</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40 block mt-1">Live News Updates</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-4 px-4 py-5 text-xs text-white/42 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Gujarat Post Media. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {policyLinks.slice(4).map(([label, href]) => <Link key={href} href={href} className="transition hover:text-white">{label}</Link>)}
            <Link href="/sitemap.xml" className="transition hover:text-white">Sitemap</Link>
            <Link href="/rss.xml" className="transition hover:text-white">RSS</Link>
          </div>
          <p className="font-semibold text-white/32">RNI/GJ-DEMO/2026</p>
        </div>
      </div>
    </footer>
  );
}
