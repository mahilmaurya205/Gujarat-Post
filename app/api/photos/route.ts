import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/database/prisma";
import { ApiError } from "@/server/utils/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const skip = (page - 1) * limit;

    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.photo.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        photos,
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
