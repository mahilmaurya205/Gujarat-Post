import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/server/database/prisma";
import { normalizeArticle } from "@/server/utils/article-normalization";
import PhotoDetailClient from "./PhotoDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const photo = await prisma.photo.findFirst({
    where: { id, deletedAt: null }
  });
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
  
  // 1. Fetch photo details
  const photo = await prisma.photo.findFirst({
    where: { id, deletedAt: null }
  });
  if (!photo) notFound();

  // 2. Fetch all photos for carousel navigation list
  const allPhotosRaw = await prisma.photo.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" }
  });

  const allPhotos = allPhotosRaw.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  // 3. Fetch trending articles
  const trendingRaw = await prisma.article.findMany({
    where: {
      isTrending: true,
      status: "PUBLISHED",
      isPublished: true,
      deletedAt: null,
    },
    orderBy: {
      views: "desc",
    },
    take: 6,
    include: {
      category: true,
      author: true,
      tags: true,
    },
  });

  const trending = trendingRaw.map(normalizeArticle);

  return (
    <PhotoDetailClient
      activeId={id}
      photo={JSON.parse(JSON.stringify(photo))}
      allPhotos={allPhotos}
      trending={trending}
    />
  );
}
