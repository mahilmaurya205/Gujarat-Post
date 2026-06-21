import { CATEGORY_META, getArticlesByCategory, getTrendingArticles } from "@/data";
import CategoryPageClient from "./CategoryPageClient";

export async function generateStaticParams() {
  return Object.keys(CATEGORY_META)
    .filter((slug) => !["videos", "shorts", "podcasts"].includes(slug))
    .map((slug) => ({ slug }));
}

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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = CATEGORY_META[slug as keyof typeof CATEGORY_META] || {
    name: slug.replace(/-/g, " "),
    gu: slug,
    hi: slug,
  };
  const articles = getArticlesByCategory(category.name);
  const trending = getTrendingArticles();

  return <CategoryPageClient articles={articles} category={{ name: category.name, nameGu: category.gu, nameHi: category.hi }} trending={trending} />;
}
