import type { Metadata } from "next";
import VideosPageClient from "./VideosPageClient";

export const metadata: Metadata = {
  title: "Videos & Multimedia",
  description: "Watch latest Gujarat news videos, shorts, podcasts and interviews on Gujarat Post.",
};

export default function VideosPage() {
  return <VideosPageClient />;
}
