'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import DistrictBar from './DistrictBar';
import BreakingTicker from './BreakingTicker';
import Footer from './Footer';

interface Props {
  children: React.ReactNode;
}

export default function MainLayoutWrapper({ children }: Props) {
  const pathname = usePathname();
  const isNewsBrief = pathname === '/news-brief';

  if (isNewsBrief) {
    return <main className="min-h-screen bg-[#F8F9FA]">{children}</main>;
  }

  return (
    <>
      <Header />
      <DistrictBar />
      <BreakingTicker />
      <main>{children}</main>
      <Footer />
    </>
  );
}
