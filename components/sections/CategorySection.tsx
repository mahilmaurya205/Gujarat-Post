'use client';
import { CATEGORY_META, getArticlesByCategory } from '@/data';
import NewsCard from '@/components/ui/NewsCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { useApp } from '@/components/AppProvider';

interface CategorySectionProps {
  category: string;
  categoryGu: string;
  cols?: number;
}

export default function CategorySection({ category, categoryGu, cols = 6 }: CategorySectionProps) {
  const { language } = useApp();
  const articles = getArticlesByCategory(category).slice(0, cols);
  const meta = Object.values(CATEGORY_META).find((item) => item.name === category);

  if (articles.length === 0) return null;

  return (
    <section className="py-0.5">
      <div className="max-w-screen-xl mx-auto px-3">
        <SectionHeader
          title={category}
          titleGu={meta?.gu || categoryGu}
          titleHi={meta?.hi}
          href={`/category/${category.toLowerCase()}`}
          language={language}
        />
        <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3 lg:grid-cols-6">
          {articles.map(article => (
            <NewsCard key={article.id} article={article} variant="default" />
          ))}
        </div>
      </div>
    </section>
  );
}
