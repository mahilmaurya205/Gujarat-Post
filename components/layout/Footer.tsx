'use client';

import Link from 'next/link';
import {
    ArrowRight,
    Mail,
    MapPin,
    Radio,
    ChevronRight,
    Users,
    BookOpen
} from 'lucide-react';
import { NAV_ITEMS } from '@/data';
import { SocialLinks } from '@/components/ui/SocialLinks';

function AppleIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.72-1.18 1.86-1.03 2.97 1.12.09 2.27-.6 2.98-1.41z" />
        </svg>
    );
}

function PlayStoreIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M3 5.27v13.46c0 .87.87 1.41 1.63.97l11.66-6.73c.75-.43.75-1.51 0-1.94L4.63 4.3C3.87 3.86 3 4.4 3 5.27z" />
            <path d="M17.47 11.23L4.76 3.89c-.38-.22-.84-.13-1.12.22l11.13 11.13 2.7-2.7c.39-.4.39-1.02 0-1.31z" />
        </svg>
    );
}

function YouTubeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837z" />
      <polygon points="9.545 15.568 15.818 12 9.545 8.432 9.545 15.568" className="fill-card group-hover:fill-rose-500 transition-colors duration-300" />
    </svg>
  );
}

const companyLinks = [
    ['About Us', '/about'],
    ['Contact Us', '/contact'],
    ['Advertise with us', '/advertise'],
    ['Careers', '/careers'],
    ['Complaint redressal', '/complaint-redressal'],
];

const informationLinks = [
    ['Privacy policy', '/privacy-policy'],
    ['Terms & conditions', '/terms'],
    ['Cookie policy', '/cookie-policy'],
    ['Disclaimer', '/disclaimer'],
    ['Sitemap', '/sitemap.xml'],
];

const mediaLinks = [
    { label: 'Watch Never Ends', href: '/watch', isLive: true },
    { label: 'Latest Videos', href: '/videos' },
    { label: 'Shorts', href: '/shorts' },
    { label: 'Photo Stories', href: '/photos' },
    { label: 'E-Paper', href: '/epaper', isNew: true },
];

const FooterLink = ({
    href,
    children,
    isLive,
    isNew
}: {
    href: string;
    children: React.ReactNode;
    isLive?: boolean;
    isNew?: boolean;
}) => (
    <Link
        href={href}
        className="group flex items-center justify-between text-sm font-medium text-white/55 transition-all duration-300 hover:text-red-400"
    >
        <div className="flex items-center gap-1.5 overflow-hidden">
            <ChevronRight className="h-3.5 w-3.5 text-red-500 opacity-0 -ml-3.5 transition-all duration-300 group-hover:opacity-100 group-hover:ml-0" />
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">{children}</span>
        </div>
        {isLive && (
            <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-[9px] font-black text-red-400 ring-1 ring-inset ring-red-500/20 animate-pulse">
                LIVE
            </span>
        )}
        {isNew && (
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[9px] font-black text-blue-400 ring-1 ring-inset ring-blue-500/20">
                NEW
            </span>
        )}
    </Link>
);

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-gradient-to-b from-[#060b13] via-[#09111f] to-[#040810] text-white">
            {/* Top border red glow line */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/45 to-transparent" />

            {/* Decorative Blur Orbs */}
            <div className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-red-600/10 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[30rem] w-[30rem] rounded-full bg-red-600/5 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-52 left-1/4 h-96 w-96 rounded-full bg-blue-600/8 blur-3xl" />

            {/* Top Newsletter Card */}
            <div className="mx-auto max-w-screen-xl px-4 pt-10">
                <div className="relative overflow-hidden rounded-3xl border border-white/[0.05] bg-[#0c1322]/55 backdrop-blur-xl p-8 lg:p-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_8px_32px_0_rgba(0,0,0,0.5)] group/news">
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent group-hover/news:via-red-500/60 transition-all duration-500" />
                    <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-red-500/10 blur-3xl group-hover/news:bg-red-500/20 transition-all duration-500" />
                    <div className="absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl group-hover/news:bg-blue-500/20 transition-all duration-500" />
                    
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-xl">
                            <div className="mb-2.5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-red-400">
                                <Mail className="h-4 w-4 text-red-500 animate-bounce" /> The Daily Brief
                            </div>
                            <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-white">News that matters, delivered every morning.</h2>
                            <p className="mt-2 text-sm text-white/55">ગુજરાત અને વિશ્વના મહત્વના સમાચાર સીધા તમારા ઇનબોક્સમાં.</p>
                        </div>
                        <form className="flex w-full max-w-xl flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
                            <label className="sr-only" htmlFor="footer-email">Email address</label>
                            <input
                                id="footer-email"
                                type="email"
                                required
                                placeholder="Enter your email address"
                                className="h-12 min-w-0 flex-1 rounded-xl border border-white/12 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-red-500 focus:bg-white/[0.06] focus:ring-2 focus:ring-red-500/20"
                            />
                            <button
                                type="submit"
                                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-6 text-sm font-black text-white shadow-lg shadow-red-950/30 transition-all duration-300 hover:from-red-500 hover:to-rose-400 hover:-translate-y-0.5 hover:shadow-red-500/20"
                            >
                                Subscribe <ArrowRight className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Grid Sections */}
            <div className="relative mx-auto grid max-w-screen-xl gap-5 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.9fr_1.1fr_0.8fr_0.8fr] lg:py-16">

                {/* Column 1: Brand & App Download */}
                <section className="group relative sm:col-span-2 lg:col-span-1 rounded-2xl border border-white/[0.04] bg-[#0c1322]/45 backdrop-blur-xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_4px_20px_rgba(0,0,0,0.3)] hover:border-red-500/20 hover:bg-[#11192e]/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/0 to-transparent group-hover:via-red-500/50 transition-all duration-500" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all duration-500" />
                    
                    <Link href="/" className="inline-flex items-center gap-3 group/logo">
                        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-lg font-black shadow-[0_0_30px_rgba(239,68,68,0.25)] ring-1 ring-red-500/30 transition-transform duration-300 group-hover/logo:scale-105 group-hover/logo:rotate-3">GP</span>
                        <span>
                            <span className="block text-2xl font-black tracking-tight text-white group-hover/logo:text-red-400 transition-colors duration-300">Gujarat Post</span>
                            <span className="block text-xs font-semibold text-white/45">ગુજરાતનું વિશ્વસનીય ન્યૂઝ નેટવર્ક</span>
                        </span>
                    </Link>
                    <p className="mt-5 text-sm leading-6 text-white/58">
                        Independent reporting, breaking news and sharp explainers from every corner of Gujarat—in Gujarati, Hindi and English.
                    </p>
                    <div className="mt-5 space-y-2 text-sm text-white/48">
                        <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-red-500" /> Ahmedabad, Gujarat, India</p>
                        <p className="flex items-center gap-2"><Radio className="h-4 w-4 text-red-500 animate-pulse" /> Newsroom active 24 × 7</p>
                    </div>

                    <SocialLinks size="lg" className="mt-6" />

                    {/* App Store / Google Play buttons */}
                    <div className="mt-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.16em] text-white/60 mb-3">Download our App</h3>
                        <div className="flex flex-wrap gap-2.5">
                            <a
                                href="https://apps.apple.com"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-1.5 hover:bg-red-500/[0.03] hover:border-red-500/40 transition-all duration-300 shadow-sm hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(239,68,68,0.1)]"
                            >
                                <AppleIcon className="h-5 w-5 text-white" />
                                <div className="text-left leading-none">
                                    <span className="block text-[8px] font-medium text-white/45 uppercase tracking-wide">Download on</span>
                                    <span className="block text-xs font-bold text-white mt-0.5">App Store</span>
                                </div>
                            </a>
                            <a
                                href="https://play.google.com"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-1.5 hover:bg-red-500/[0.03] hover:border-red-500/40 transition-all duration-300 shadow-sm hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(239,68,68,0.1)]"
                            >
                                <PlayStoreIcon className="h-5 w-5 text-white" />
                                <div className="text-left leading-none">
                                    <span className="block text-[8px] font-medium text-white/45 uppercase tracking-wide">Get it on</span>
                                    <span className="block text-xs font-bold text-white mt-0.5">Google Play</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Column 2: Explore */}
                <section className="group relative rounded-2xl border border-white/[0.04] bg-[#0c1322]/45 backdrop-blur-xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_4px_20px_rgba(0,0,0,0.3)] hover:border-red-500/20 hover:bg-[#11192e]/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/0 to-transparent group-hover:via-red-500/50 transition-all duration-500" />
                    <h2 className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> Explore
                    </h2>
                    <ul className="space-y-3">
                        {NAV_ITEMS.slice(1, 9).map((item) => (
                            <li key={item.href}>
                                <FooterLink href={item.href}>{item.label}</FooterLink>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Column 3: Watch & Read */}
                <section className="group relative rounded-2xl border border-white/[0.04] bg-[#0c1322]/45 backdrop-blur-xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_4px_20px_rgba(0,0,0,0.3)] hover:border-red-500/20 hover:bg-[#11192e]/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/0 to-transparent group-hover:via-red-500/50 transition-all duration-500" />
                    <h2 className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> Watch & Read
                    </h2>
                    <ul className="space-y-3">
                        {mediaLinks.map((item) => (
                            <li key={item.href}>
                                <FooterLink href={item.href} isLive={item.isLive} isNew={item.isNew}>
                                    {item.label}
                                </FooterLink>
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/epaper"
                        className="mt-6 inline-flex items-center gap-2.5 rounded-xl border border-red-500/25 bg-red-500/[0.03] px-4 py-2.5 text-xs font-bold text-red-400 transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/10 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(239,68,68,0.15)]"
                    >
                        <BookOpen className="h-4 w-4 text-red-500 animate-pulse" /> Read today&apos;s edition
                    </Link>
                </section>

                {/* Column 4: Company */}
                <section className="group relative rounded-2xl border border-white/[0.04] bg-[#0c1322]/45 backdrop-blur-xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_4px_20px_rgba(0,0,0,0.3)] hover:border-red-500/20 hover:bg-[#11192e]/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/0 to-transparent group-hover:via-red-500/50 transition-all duration-500" />
                    <h2 className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> Company
                    </h2>
                    <ul className="space-y-3">
                        {companyLinks.map(([label, href]) => (
                            <li key={href}>
                                <FooterLink href={href}>{label}</FooterLink>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Column 5: Information */}
                <section className="group relative rounded-2xl border border-white/[0.04] bg-[#0c1322]/45 backdrop-blur-xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_4px_20px_rgba(0,0,0,0.3)] hover:border-red-500/20 hover:bg-[#11192e]/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/0 to-transparent group-hover:via-red-500/50 transition-all duration-500" />
                    <h2 className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> Information
                    </h2>
                    <ul className="space-y-3">
                        {informationLinks.map(([label, href]) => (
                            <li key={href}>
                                <FooterLink href={href}>{label}</FooterLink>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Reader/Subscriber Statistics Row */}
                <div className="sm:col-span-2 lg:col-span-5 border-t border-white/[0.08] pt-10 mt-4">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {/* Stat 1 */}
                        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c1322]/40 backdrop-blur-xl p-5 text-center transition-all duration-500 hover:border-red-500/30 hover:bg-[#11192e]/60 hover:-translate-y-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_8px_32px_0_rgba(0,0,0,0.4)]">
                            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/0 to-transparent group-hover:via-red-500/60 transition-all duration-500" />
                            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/15 group-hover:scale-125 transition-all duration-500" />
                            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all duration-300 group-hover:bg-red-500 group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                                <Users className="h-5 w-5" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white block mt-2 group-hover:text-red-400 transition-colors duration-300">5.2M+</span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-white/40 block mt-1">Monthly Active Readers</span>
                        </div>

                        {/* Stat 2 */}
                        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c1322]/40 backdrop-blur-xl p-5 text-center transition-all duration-500 hover:border-rose-500/30 hover:bg-[#11192e]/60 hover:-translate-y-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_8px_32px_0_rgba(0,0,0,0.4)]">
                            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-rose-500/0 to-transparent group-hover:via-rose-500/60 transition-all duration-500" />
                            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/15 group-hover:scale-125 transition-all duration-500" />
                            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)] transition-all duration-300 group-hover:bg-rose-500 group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                                <YouTubeIcon className="h-5 w-5" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white block mt-2 group-hover:text-rose-400 transition-colors duration-300">1.5M+</span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-white/40 block mt-1">YouTube Subscribers</span>
                        </div>

                        {/* Stat 3 */}
                        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c1322]/40 backdrop-blur-xl p-5 text-center transition-all duration-500 hover:border-red-500/30 hover:bg-[#11192e]/60 hover:-translate-y-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_8px_32px_0_rgba(0,0,0,0.4)]">
                            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/0 to-transparent group-hover:via-red-500/60 transition-all duration-500" />
                            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-red-400/5 rounded-full blur-2xl group-hover:bg-red-400/15 group-hover:scale-125 transition-all duration-500" />
                            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all duration-300 group-hover:bg-red-500 group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                                <Mail className="h-5 w-5" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white block mt-2 group-hover:text-red-400 transition-colors duration-300">250K+</span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-white/40 block mt-1">Newsletter Subscribers</span>
                        </div>

                        {/* Stat 4 */}
                        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c1322]/40 backdrop-blur-xl p-5 text-center transition-all duration-500 hover:border-red-500/30 hover:bg-[#11192e]/60 hover:-translate-y-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_8px_32px_0_rgba(0,0,0,0.4)]">
                            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/0 to-transparent group-hover:via-red-500/60 transition-all duration-500" />
                            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/15 group-hover:scale-125 transition-all duration-500" />
                            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all duration-300 group-hover:bg-red-500 group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                                <Radio className="h-5 w-5 animate-pulse" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white block mt-2 group-hover:text-red-400 transition-colors duration-300">24 × 7</span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-white/40 block mt-1">Live News Updates</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Copyright Bottom Bar */}
            <div className="relative border-t border-white/[0.08] bg-black/30 backdrop-blur-sm">
                <div className="mx-auto flex max-w-screen-xl flex-col gap-4 px-4 py-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
                    <p>© {new Date().getFullYear()} Gujarat Post Media. All rights reserved.</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                        <Link href="/dnpa-code" className="transition duration-200 hover:text-red-400">DNPA Code</Link>
                        <Link href="/csr-policy" className="transition duration-200 hover:text-red-400">CSR Policy</Link>
                        <Link href="/sitemap.xml" className="transition duration-200 hover:text-red-400">Sitemap</Link>
                        <Link href="/rss.xml" className="transition duration-200 hover:text-red-400">RSS</Link>
                    </div>
                    <p className="font-semibold text-white/35 tracking-wider">RNI/GJ-DEMO/2026</p>
                </div>
            </div>
        </footer>
    );
}
