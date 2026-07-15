import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AUTHORS, ARTICLES } from "@/data";
import AuthorPageClient from "./AuthorPageClient";

export async function generateStaticParams() {
  return AUTHORS.map((author) => ({ id: author.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const author = AUTHORS.find((item) => item.id === id);
  if (!author) return {};

  return {
    title: `${author.name} | Author Profile`,
    description: author.bio,
  };
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const author = AUTHORS.find((item) => item.id === id);
  if (!author) notFound();

  // Find all articles written by this author
  const authorArticles = ARTICLES.filter((art) => art.author.id === author.id);

  return (
    <AuthorPageClient author={author} articles={authorArticles} />
  );
}
