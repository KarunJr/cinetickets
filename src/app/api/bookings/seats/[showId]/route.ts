import { getOccupiedSeats } from "@/lib/controllers/booking.controller";
import { NextResponse } from "next/server";

// Route to getOccupiedSeats of the show
export async function GET(
  req: Request,
  { params }: { params: { showId: string } }
) {
  try {
    const { showId } = await params;
    const result = await getOccupiedSeats(showId);

    if (result.success && result.occupiedSeats) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
          occupiedSeats: result.occupiedSeats,
          showPrice: result.showPrice,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          showPrice: result.showPrice,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("GET error in /api/bookings/: ", error);
    return NextResponse.json(
      { success: false, message: "Internal server error!" },
      { status: 500 }
    );
  }
}
