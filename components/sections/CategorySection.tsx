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

export default function CategorySection({ category, categoryGu, cols = 4 }: CategorySectionProps) {
  const { language } = useApp();
  const articles = getArticlesByCategory(category).slice(0, cols);
  const meta = Object.values(CATEGORY_META).find((item) => item.name === category);

  if (articles.length === 0) return null;

  return (
    <section className="py-3">
      <div className="max-w-screen-xl mx-auto px-4">
        <SectionHeader
          title={category}
          titleGu={meta?.gu || categoryGu}
          titleHi={meta?.hi}
          href={`/category/${category.toLowerCase()}`}
          language={language}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map(article => (
            <NewsCard key={article.id} article={article} variant="default" />
          ))}
        </div>
      </div>
    </section>
  );
}
