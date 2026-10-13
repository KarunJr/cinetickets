import { connectRedis, redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectRedis();
    const result = await redis.ping();
    return NextResponse.json(
      {
        success: true,
        redis: "connected",
        result
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Redis unavailable",
      },
      { status: 503 },
    );
  }
}
