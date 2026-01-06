import { auth } from "@/auth";
import { redis } from "@/lib/redis";
import { Session } from "next-auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session: Session | null = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized!" },
        { status: 401 }
      );
    }
    
    const keys = await redis.keys("show:*:seat:*");

    for (const key of keys) {
      const lockedBy = await redis.get(key);

      if (lockedBy === session.user.id) {
        await redis.del(key);
      }
    }

    return NextResponse.json({ success: true, message: "All seats unlocked." });
  } catch (error: unknown) {
    console.error("GET error /api/bookings/seats/all-unlock:", error);
    const message = error instanceof Error ? error.message : "Internal server error!";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
