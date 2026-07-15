import { CATEGORY_META, ARTICLES, getArticlesByCategory, categorySlugMapping } from "@/data";
import CategoryPageClient from "./CategoryPageClient";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const metaKeys = Object.keys(CATEGORY_META).filter((slug) => !["videos", "shorts", "podcasts"].includes(slug));
  const mappingKeys = Object.keys(categorySlugMapping).filter((key) => !["videos", "shorts", "podcasts"].includes(key));
  const allSlugs = Array.from(new Set([...metaKeys, ...mappingKeys]));
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolvedSlug = categorySlugMapping[slug] || slug;
  const category = CATEGORY_META[resolvedSlug as keyof typeof CATEGORY_META];
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
  const limit = parseInt(resolvedSearchParams?.limit || "40", 10);
  const skip = (page - 1) * limit;

  // 1. Fetch category from static metadata after resolving mapped slug
  const resolvedSlug = categorySlugMapping[slug] || slug;
  const category = CATEGORY_META[resolvedSlug as keyof typeof CATEGORY_META];

  if (!category) {
    notFound();
  }

  // 2. Fetch paginated articles from static data
  const allArticles = getArticlesByCategory(category.name);
  const total = allArticles.length;
  const articles = allArticles.slice(skip, skip + limit);

  // 3. Fetch trending articles from static data
  const trending = ARTICLES.filter((art) => art.isTrending).slice(0, 10);
  const totalPages = Math.ceil(total / limit);

  return (
    <CategoryPageClient
      articles={articles}
      category={{
        name: category.name,
        nameGu: category.gu,
        nameHi: category.hi,
      }}
      trending={trending}
      currentPage={page}
      totalPages={totalPages}
      slug={slug}
    />
  );
}
