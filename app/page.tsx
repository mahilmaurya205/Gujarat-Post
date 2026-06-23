import HeroSection from "@/components/sections/HeroSection";
import TrendingSection from "@/components/sections/TrendingSection";
import CategorySection from "@/components/sections/CategorySection";
import VideoSection from "@/components/sections/VideoSection";
import PhotoGallery from "@/components/sections/PhotoGallery";
import Advertisement from "@/components/ads/Advertisement";
import LiveDashboard from "@/components/sections/LiveDashboard";
import YouTubeLatest from "@/components/sections/YouTubeLatest";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <YouTubeLatest />
      <LiveDashboard />
      <div className="mx-auto max-w-screen-xl px-4 pb-1">
        <Advertisement position="header" />
      </div>
      <TrendingSection />
      <VideoSection />
      <CategorySection category="Gujarat" categoryGu="ગુજરાત" cols={4} />
      <div className="mx-auto max-w-screen-xl px-4 py-1">
        <Advertisement position="banner" />
      </div>
      <CategorySection category="Crime" categoryGu="ક્રાઇમ" cols={4} />
      <CategorySection category="Politics" categoryGu="રાજકારણ" cols={4} />
      <CategorySection category="Sports" categoryGu="રમતગમત" cols={4} />
      <div className="mx-auto max-w-screen-xl px-4 py-1">
        <Advertisement position="banner" />
      </div>
      <CategorySection category="Business" categoryGu="બિઝનેસ" cols={4} />
      <CategorySection category="World" categoryGu="વિશ્વ" cols={4} />
      <PhotoGallery />
      <div className="mx-auto max-w-screen-xl px-4 py-2">
        <Advertisement position="footer" />
      </div>
    </div>
  );
}
