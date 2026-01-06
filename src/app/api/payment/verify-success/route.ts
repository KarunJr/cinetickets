import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import { redis } from "@/lib/redis";
import Booking, { Status } from "@/models/booking.model";
import Show from "@/models/show.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized!" },
        { status: 401 }
      );
    }

    const { transaction_uuid } = await req.json();

    if (!transaction_uuid)
      return NextResponse.json(
        { success: false, message: "No token found" },
        { status: 400 }
      );

    await connectToDatabase();

    const booking = await Booking.findOne({
      transactionUuid: transaction_uuid,
    });
    if (!booking)
      return NextResponse.json({
        success: false,
        message: "Booking not found",
      });

    const show = await Show.findById(booking.show);

    if (!show) {
      return NextResponse.json({
        success: false,
        message: "No show found",
      });
    }
    booking.bookedSeats.forEach((seat) => {
      show.occupiedSeats[seat] = booking.user.toString();
    });

    show.markModified("occupiedSeats");
    await show.save();

    booking.status = Status.COMPLETE;
    await booking.save();

    console.log("Show id:", booking.show);
    console.log("Seats:", booking.bookedSeats);
    
    for (const seat of booking.bookedSeats) {
      const key = `show:${booking.show}:seat:${seat}`;
      await redis.del(key);
    }

    return NextResponse.json(
      { success: true, message: "Payment status changed." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("POST error in /api/payment/verify-success: ", error);
    const message = error instanceof Error ? error.message : "Internal server error!";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
