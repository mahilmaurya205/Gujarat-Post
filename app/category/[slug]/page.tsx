import { CATEGORY_META } from "@/data";
import CategoryPageClient from "./CategoryPageClient";
import { prisma } from "@/server/database/prisma";
import { normalizeArticle } from "@/server/utils/article-normalization";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = CATEGORY_META[slug as keyof typeof CATEGORY_META];
  const name = category?.name || slug;

  return {
    title: `${name} News`,
    description: `Latest ${name} news, photos and videos from Gujarat Post.`,
    alternates: {
      canonical: `/category/${slug}`,
    },
    openGraph: {
      title: `${name} News | Gujarat Post`,
      description: `Latest ${name} news from Gujarat Post.`,
      url: `/category/${slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string; limit?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page || "1", 10);
  const limit = parseInt(resolvedSearchParams?.limit || "12", 10);
  const skip = (page - 1) * limit;

  // 1. Fetch category from DB
  const category = await prisma.category.findFirst({
    where: {
      slug,
      isActive: true,
      deletedAt: null,
    },
  });

  if (!category) {
    notFound();
  }

  // 2. Fetch paginated articles from DB
  const [articlesRaw, total] = await Promise.all([
    prisma.article.findMany({
      where: {
        categoryId: category.id,
        status: "PUBLISHED",
        isPublished: true,
        deletedAt: null,
      },
      orderBy: {
        publishedAt: "desc",
      },
      skip,
      take: limit,
      include: {
        category: true,
        author: true,
        tags: true,
      },
    }),
    prisma.article.count({
      where: {
        categoryId: category.id,
        status: "PUBLISHED",
        isPublished: true,
        deletedAt: null,
      },
    }),
  ]);

  const articles = articlesRaw.map(normalizeArticle);

  // 3. Fetch trending articles from DB
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
    take: 10,
    include: {
      category: true,
      author: true,
      tags: true,
    },
  });

  const trending = trendingRaw.map(normalizeArticle);
  const totalPages = Math.ceil(total / limit);

  return (
    <CategoryPageClient
      articles={articles}
      category={{
        name: category.name,
        nameGu: category.nameGu,
        nameHi: category.nameHi,
      }}
      trending={trending}
      currentPage={page}
      totalPages={totalPages}
      slug={slug}
    />
  );
}
