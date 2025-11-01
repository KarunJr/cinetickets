import { auth } from "@/auth";
import { redis } from "@/lib/redis";
import { Session } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session: Session | null = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized!" },
        { status: 401 }
      );
    }

    const { showId, seats, userId } = await req.json();

    let unlockedSeats = [];
    for (const seat of seats) {
      const key = `show:${showId}:seat:${seat}`;
      const lockedBy = await redis.get(key);
      if (lockedBy === userId) {
        await redis.del(key);
        unlockedSeats.push(seat);
      }
    }

    if (unlockedSeats.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No seats were locked by you!",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: `Seat unlocked: ${unlockedSeats.join(", ")}` });
  } catch (error: any) {
    console.error("GET error /api/bookings/seats/unlock-seat:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong!" },
      { status: 500 }
    );
  }
}
