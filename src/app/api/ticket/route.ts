import { auth } from "@/auth";
import Booking from "@/models/booking.model";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const user = await auth();

  if (!user || !user.user.id) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const booking = await Booking.findById(id)
      .populate({
        path: "show",
        populate: {
          path: "movie",
          select: "title"
        },
      })
      .populate("user");

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error("Error in api/ticket:", error);
    return NextResponse.json(error || "Internal Server Error", { status: 500 });
  }
}
