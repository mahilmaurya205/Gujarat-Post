'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import gpLogoStatic from '../../public/assets/gujarat-post-logo-static.png';
import { SOCIAL_LINKS, SocialIcon } from '@/components/ui/SocialLinks';

/* ─── Inline SVG icons ──────────────────────────────────────────────────── */
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
            <path fill="#EA4335" d="M199.9 237.8 1.4 470.17c7.22 24.57 30.16 41.81 55.8 41.81 11.16 0 20.93-2.79 29.3-8.37l244.16-139.46L199.9 237.8z"/>
            <path fill="#FBBC04" d="m433.91 205.1-104.65-60-111.61 110.22 113.01 108.83 104.64-58.6c18.14-9.77 30.7-29.3 30.7-50.23-1.4-20.93-13.95-40.46-32.09-50.22z"/>
            <path fill="#34A853" d="M199.42 273.45 329.27 145.1 87.9 8.37C79.53 2.79 68.36 0 57.2 0 30.7 0 6.98 18.14 1.4 41.86l198.02 231.59z"/>
            <path fill="#4285F4" d="M1.39 41.86C0 46.04 0 51.63 0 57.2v397.64c0 5.57 0 9.76 1.4 15.34l216.27-214.86L1.39 41.86z"/>
        </svg>
    );
}

/* ─── Links data matching actual categories on the website ──────────────── */
const gujaratLinks = [
    { label: 'World', href: '/category/world' },
    { label: 'Crime', href: '/category/crime' },
    { label: 'Entertainment', href: '/category/entertainment' },
    { label: 'Fact Check', href: '/category/fact-check' },
    { label: 'Election 2027', href: '/category/election-2027' },
    { label: 'Sports', href: '/category/sports' },
    { label: 'Weather', href: '/category/weather' },
];

const indiaLinks = [
    { label: 'Politics', href: '/category/politics' },
    { label: 'Health', href: '/category/health' },
    { label: 'Technology', href: '/category/technology' },
    { label: 'Trending', href: '/category/trending' },
    { label: 'Business', href: '/category/business' },
    { label: 'Education', href: '/category/education' },
    { label: 'Gold-Silver', href: '/category/gold-silver' },
];

const showLinks = [
    { label: 'GP Live TV', href: '/watch' },
    { label: 'Gujarat Post Specials', href: '/category/trending' },
    { label: 'Good Morning Gujarat', href: '/category/gujarat' },
    { label: 'Ground Reports', href: '/category/state' },
    { label: 'Podcast Series', href: '/videos?tab=podcast' },
    { label: 'E-Paper', href: '/epaper' },
    { label: 'Latest Videos', href: '/videos' },
    { label: 'Shorts', href: '/shorts' },
    { label: 'Photo Stories', href: '/photos' },
];

const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Advertise with Us', href: '/advertise' },
    { label: 'Careers', href: '/careers' },
    { label: 'Complaint Redressal', href: '/complaint-redressal' },
    { label: 'Share Tips with GP', href: '/contact' },
    { label: 'Gujarat Post App', href: '/app' },
    { label: 'Authors List', href: '/authors' },
];

/* ─── ColHead Component ─────────────────────────────────────────────────── */
const ColHead = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-white font-bold text-[14px] leading-tight mb-4 select-none">
        {children}
    </h3>
);

/* ─── Footer ────────────────────────────────────────────────────────────── */
export default function Footer({ isInline = false }: { isInline?: boolean }) {
    const pathname = usePathname();

    if (pathname === '/login' || pathname.startsWith('/admin')) {
        return null;
    }

    // Hide global footer on feed pages — it's rendered inline there
    const isFeedPage = pathname === '/watch' || pathname === '/shorts';
    if (isFeedPage && !isInline) return null;

    const wrap = isInline ? 'pt-4 pb-3' : 'pt-7 pb-4';

    return (
        <footer data-theme="dark" className="bg-black text-white relative border-t border-neutral-900">
            <div className={`mx-auto max-w-screen-xl max-w-header-layout px-4 ${wrap}`}>
                
                {/* ── Main columns grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-6 lg:gap-6 pb-6">
                    
                    {/* Column 1: Logo and Brand info */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="inline-block relative h-14 w-44 sm:w-48 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/10 transition-transform duration-200 hover:scale-[1.02]">
                            <Image
                                src={gpLogoStatic}
                                alt="Gujarat Post Logo"
                                fill
                                priority
                                className="object-cover"
                            />
                        </Link>
                        <div className="mt-1.5">
                            <p className="text-[18px] font-black text-white tracking-wide">
                                Real Stories. <span className="text-red-500">Real Gujarat.</span>
                            </p>
                            <p className="text-[12px] leading-relaxed text-neutral-400 max-w-xs mt-1.5">
                                ગુજરાતનું વિશ્વસનીય ન્યૂઝ નેટવર્ક. Independent reporting &amp; breaking news from every corner of Gujarat.
                            </p>
                        </div>
                    </div>

                    {/* Column 2: Gujarat */}
                    <div>
                        <Link href="/category/gujarat" className="text-white hover:text-red-500 transition-colors font-bold text-[14px] leading-tight mb-4 block select-none">
                            Gujarat
                        </Link>
                        <ul className="space-y-1.5">
                            {gujaratLinks.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-[13px] text-neutral-400 hover:text-white transition-colors duration-200 py-0.5 block">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: India */}
                    <div>
                        <Link href="/category/national" className="text-white hover:text-red-500 transition-colors font-bold text-[14px] leading-tight mb-4 block select-none">
                            India
                        </Link>
                        <ul className="space-y-1.5">
                            {indiaLinks.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-[13px] text-neutral-400 hover:text-white transition-colors duration-200 py-0.5 block">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Shows */}
                    <div>
                        <ColHead>Shows</ColHead>
                        <ul className="space-y-1.5">
                            {showLinks.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-[13px] text-neutral-400 hover:text-white transition-colors duration-200 py-0.5 block">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 5: Company */}
                    <div>
                        <ColHead>Company</ColHead>
                        <ul className="space-y-1.5">
                            {companyLinks.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-[13px] text-neutral-400 hover:text-white transition-colors duration-200 py-0.5 block">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ── Bottom row: Socials + App downloads ── */}
                <div className="border-t border-neutral-900 pt-4 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    
                    {/* Bottom Left: Social links matching reference image */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                        {SOCIAL_LINKS.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                target={item.platform === 'youtube' ? '_blank' : undefined}
                                rel={item.platform === 'youtube' ? 'noreferrer' : undefined}
                                aria-label={item.label}
                                title={item.label}
                                className={`h-8 w-8 rounded-full border border-white/10 bg-white/5 text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:text-white hover:border-transparent hover:shadow-lg ${item.hover}`}
                            >
                                <SocialIcon platform={item.platform} className="h-4 w-4" />
                            </a>
                        ))}
                    </div>

                    {/* Bottom Right: App download buttons */}
                    <div className="flex items-center gap-2.5 select-none">
                        {/* App Store button */}
                        <a
                            href="https://apps.apple.com"
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center gap-2.5 rounded-md border border-neutral-800 bg-black px-3.5 py-1 text-white hover:border-red-600 hover:shadow-[0_0_12px_rgba(179,18,27,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-95"
                        >
                            <AppleIcon className="h-4.5 w-4.5 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105" />
                            <div className="leading-none text-left">
                                <span className="block text-[8px] text-neutral-400 uppercase tracking-tight">Download on the</span>
                                <span className="block text-[11.5px] font-bold tracking-tight">App Store</span>
                            </div>
                        </a>

                        {/* Google Play button */}
                        <a
                            href="https://play.google.com"
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center gap-2.5 rounded-md border border-neutral-800 bg-black px-3.5 py-1 text-white hover:border-red-600 hover:shadow-[0_0_12px_rgba(179,18,27,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-95"
                        >
                            <PlayStoreIcon className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-105" />
                            <div className="leading-none text-left">
                                <span className="block text-[8px] text-neutral-400 uppercase tracking-tight">GET IT ON</span>
                                <span className="block text-[11.5px] font-bold tracking-tight">Google Play</span>
                            </div>
                        </a>
                    </div>
                </div>

                {/* ── Footer Copyright bar ── */}
                <div className="border-t border-neutral-900 mt-3 pt-3 text-[10px] text-neutral-500">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <p>© {new Date().getFullYear()} Gujarat Post Media. All rights reserved.</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {[['DNPA Code', '/dnpa-code'], ['CSR Policy', '/csr-policy'], ['RSS', '/rss.xml']].map(([label, href]) => (
                                <Link key={href} href={href} className="transition duration-200 hover:text-white">{label}</Link>
                            ))}
                        </div>
                        <p className="font-semibold text-neutral-600 tracking-wider">RNI/GJ-DEMO/2026</p>
                    </div>
                </div>

            </div>
        </footer>
    );
}
