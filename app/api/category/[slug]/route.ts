import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/database/prisma";
import { normalizeArticle } from "@/server/utils/article-normalization";
import { ApiError } from "@/server/utils/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const { searchParams } = new URL(req.url);
    const slug = params.slug || searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Category slug is required" },
        { status: 400 }
      );
    }

    // 1. Fetch category
    const category = await prisma.category.findFirst({
      where: {
        slug,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // 2. Fetch paginated articles
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
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

    const normalized = articles.map(normalizeArticle);

    return NextResponse.json({
      success: true,
      data: {
        category,
        articles: normalized,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return ApiError(err);
  }
}
