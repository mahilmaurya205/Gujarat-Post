import Link from 'next/link';
import { ArrowRight, Mail, MapPin, Radio, Smartphone } from 'lucide-react';
import { NAV_ITEMS } from '@/data';
import { SocialLinks } from '@/components/ui/SocialLinks';

const companyLinks = [
  ['About Gujarat Post', '/about'],
  ['Contact newsroom', '/contact'],
  ['Complaint redressal', '/complaint-redressal'],
  ['Advertise with us', '/advertise'],
  ['Careers', '/careers'],
];

const policyLinks = [
  ['Privacy policy', '/privacy-policy'],
  ['Terms & conditions', '/terms'],
  ['Cookie policy', '/cookie-policy'],
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
            {policyLinks.slice(0, 3).map(([label, href]) => <li key={href}><FooterLink href={href}>{label}</FooterLink></li>)}
          </ul>
        </section>
      </div>

      <div className="relative border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-4 px-4 py-5 text-xs text-white/42 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Gujarat Post Media. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {policyLinks.slice(3).map(([label, href]) => <Link key={href} href={href} className="transition hover:text-white">{label}</Link>)}
            <Link href="/sitemap.xml" className="transition hover:text-white">Sitemap</Link>
            <Link href="/rss.xml" className="transition hover:text-white">RSS</Link>
          </div>
          <p className="font-semibold text-white/32">RNI/GJ-DEMO/2026</p>
        </div>
      </div>
    </footer>
  );
}
