import HeroSection from "@/components/sections/HeroSection";
import TrendingSection from "@/components/sections/TrendingSection";
import Advertisement from "@/components/ads/Advertisement";
import LiveDashboard from "@/components/sections/LiveDashboard";

import CategorySection from "@/components/sections/CategorySection";
import PhotoGallery from "@/components/sections/PhotoGallery";

export default function HomePage() {
  return (
    <div>
      {/* Main 3-column portal layout containing all active sections */}
      <HeroSection />
    </div>
  );
}
