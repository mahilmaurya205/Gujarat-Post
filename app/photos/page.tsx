import type { Metadata } from "next";
import { prisma } from "@/server/database/prisma";
import PhotosClient from "./PhotosClient";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Browse the latest Gujarat news photo gallery on Gujarat Post.",
};

export default async function PhotosPage() {
  const photos = await prisma.photo.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const serialized = photos.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return <PhotosClient initialPhotos={serialized} />;
}
