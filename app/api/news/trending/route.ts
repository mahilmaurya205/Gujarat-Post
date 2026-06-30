import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/database/prisma";
import { normalizeArticle } from "@/server/utils/article-normalization";
import { ApiError } from "@/server/utils/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const articles = await prisma.article.findMany({
      where: {
        isTrending: true,
        status: "PUBLISHED",
        isPublished: true,
        deletedAt: null,
      },
      orderBy: {
        views: "desc",
      },
      take: limit,
      include: {
        category: true,
        author: true,
        tags: true,
      },
    });

    const normalized = articles.map(normalizeArticle);

    return NextResponse.json({
      success: true,
      data: {
        articles: normalized,
      },
    });
  } catch (err) {
    return ApiError(err);
  }
}
