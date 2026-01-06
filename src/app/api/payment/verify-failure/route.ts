import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import { redis } from "@/lib/redis";
import Booking, { Status } from "@/models/booking.model";
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
    const { tuuid } = await req.json();
    console.log("User is:", session.user.id);

    await connectToDatabase();

    const booking = await Booking.findOne({
      user: session.user.id,
      status: Status.PENDING,
      transactionUuid: tuuid,
    });
    if (!booking) {
      console.log("No bookings made");
      return NextResponse.json(
        { success: false, message: "No bookings made" },
        { status: 400 }
      );
    }

    booking.status = Status.FAILED;

    await booking.deleteOne()

    for (const seat of booking.bookedSeats) {
      const key = `show:${booking.show}:seat:${seat}`;

      await redis.del(key);
    }

    return NextResponse.json(
      { success: true, message: "Booking cancelled!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("POST error in /api/payment/verify-failure: ", error);
    const message = error instanceof Error ? error.message : "Internal server error!";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
