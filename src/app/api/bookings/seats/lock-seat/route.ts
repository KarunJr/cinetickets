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

    /**
     * Lock selected seats for a show in Redis.
     *
     * For each seat:
     * 1. Try to lock it in Redis with NX (only set if not exists) and EX (expire in 5 min).
     * 2. If a seat fails to lock (someone else already locked it):
     *    - Unlock all seats that were successfully locked before this failure
     *      to avoid leaving half-locked seats.
     *    - Stop further processing and return an error to the user.
     *
     * This ensures:
     * - Each seat is locked individually (prevents double booking).
     * - No half-locked state is left if some seats are already locked.
     * - Safe, consistent, and clean seat-locking logic for concurrent users.
     */
    for (const seat of seats) {
      const key = `show:${showId}:seat:${seat}`;
      const locked = await redis.set(key, userId, {
        NX: true,
        EX: 300,
      });

      if (!locked) {
        for (const s of seats) {
          if (s === seat) break;

          await redis.del(`show:${showId}:seat:${s}`);
        }

        return NextResponse.json(
          {
            success: false,
            message:
              "Sorry! The seats you were booking may not be available. Try booking different seats. (#50)",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: true, message: "Seat Locked!" },
      { status: 200 }
    );
    /*
    console.log("Locked: ", locked);
    if (locked === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Seat is being processed!",
        },
        { status: 400 }
      );
    }*/

    // const key = `show:${showId}:seat:${seatId}`;

    // const locked = await redis.set(key, userId, {
    //   NX: true,
    //   EX: 300,
    // });
  } catch (error: unknown) {
    console.error("POST error /api/bookings/seats/lock-seat:", error);
    const message = error instanceof Error ? error.message : "Internal server error!";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
