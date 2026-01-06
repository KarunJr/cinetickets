import { auth } from "@/auth";
import { getUserBookings } from "@/lib/controllers/booking.controller";
import { Session } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session: Session | null = await auth();
    if (!session)
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });

    const result = await getUserBookings(session);

    if (result.success) {
      return NextResponse.json(
        { success: true, message: result.message, bookings: result.bookings },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("GET error in /api/bookings/user: ", error);
    const message = error instanceof Error ? error.message : "Internal server error!";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
