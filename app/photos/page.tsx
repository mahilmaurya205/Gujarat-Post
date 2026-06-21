import type { Metadata } from "next";
import PhotosClient from "./PhotosClient";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Browse the latest Gujarat news photo gallery on Gujarat Post.",
};

export default function PhotosPage() {
  return <PhotosClient />;
}
