import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/database/prisma";
import { ApiError } from "@/server/utils/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const type = searchParams.get("type") || undefined; // video | short | podcast | interview

    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (type) {
      where.type = type;
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        orderBy: {
          publishedAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.video.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        videos,
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
