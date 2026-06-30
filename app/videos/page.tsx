import type { Metadata } from "next";
import { prisma } from "@/server/database/prisma";
import VideosPageClient from "./VideosPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Videos & Multimedia",
  description: "Watch latest Gujarat news videos, shorts, podcasts and interviews on Gujarat Post.",
};

export default async function VideosPage() {
  const videos = await prisma.video.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  const serialized = videos.map((v) => ({
    ...v,
    publishedAt: v.publishedAt.toISOString(),
    createdAt: v.createdAt.toISOString(),
    updatedAt: v.updatedAt.toISOString(),
  }));

  return <VideosPageClient initialVideos={serialized} />;
}
