import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  try {
    const { searchParams } = new URL(req.url);

    const showId = searchParams.get("showId");

    if (!showId) {
      return NextResponse.json(
        { success: false, message: "showId is required" },
        { status: 400 }
      );
    }

    const keys = await redis.keys(`show:${showId}:seat:*`);
    console.log("Keys are:", keys);
    const lockedSeats = keys.map((key) => key.split(":")[3]);

    return NextResponse.json({ success: true, lockedSeats });
  } catch (error: any) {
    console.error("GET error /api/bookings/seats/get-lock-seat:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong!" },
      { status: 500 }
    );
  }
}
