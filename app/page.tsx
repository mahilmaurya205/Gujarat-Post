import HeroSection from "@/components/sections/HeroSection";
import TrendingSection from "@/components/sections/TrendingSection";
import CategorySection from "@/components/sections/CategorySection";
import LiveTVSection from "@/components/sections/LiveTVSection";
import VideoSection from "@/components/sections/VideoSection";
import PhotoGallery from "@/components/sections/PhotoGallery";
import Advertisement from "@/components/ads/Advertisement";
import LiveDashboard from "@/components/sections/LiveDashboard";

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      <LiveDashboard />

      <div className="mx-auto max-w-screen-xl px-4 pb-4">
        <Advertisement position="header" />
      </div>

      <TrendingSection />
      <CategorySection category="Gujarat" categoryGu="ગુજરાત" cols={4} />

      <div className="mx-auto max-w-screen-xl px-4 py-2">
        <Advertisement position="banner" />
      </div>

      <CategorySection category="Crime" categoryGu="ક્રાઇમ" cols={4} />
      <CategorySection category="Politics" categoryGu="રાજકારણ" cols={4} />
      <LiveTVSection />
      <CategorySection category="Sports" categoryGu="રમતગમત" cols={4} />

      <div className="mx-auto max-w-screen-xl px-4 py-2">
        <Advertisement position="banner" />
      </div>

      <CategorySection category="Business" categoryGu="બિઝનેસ" cols={4} />
      <VideoSection />
      <PhotoGallery />

      <div className="mx-auto max-w-screen-xl px-4 py-6">
        <Advertisement position="footer" />
      </div>
    </div>
  );
}
