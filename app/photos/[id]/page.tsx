import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PHOTOS } from "@/data";
import PhotoDetailClient from "./PhotoDetailClient";

export async function generateStaticParams() {
  return PHOTOS.map((photo) => ({ id: photo.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const photo = PHOTOS.find((item) => item.id === id);
  if (!photo) return {};

  return {
    title: `${photo.caption} - Photo Gallery`,
    description: `View ${photo.caption} and other latest news photos on Gujarat Post.`,
    openGraph: {
      title: `${photo.caption} - Photo Gallery`,
      description: `View ${photo.caption} and other latest news photos on Gujarat Post.`,
      images: [{ url: photo.src, alt: photo.caption }],
    },
  };
}

export default async function PhotoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const photo = PHOTOS.find((item) => item.id === id);
  if (!photo) notFound();

  return <PhotoDetailClient activeId={id} />;
}
