import { getAllBookings } from "@/lib/controllers/admin.controller";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getAllBookings();
    if (result.success) {
      return NextResponse.json(
        { success: true, message: result.message, bookings: result.bookings },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }
  } catch (error: any) {
    console.error("GET error in /api/admin/bookings:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error!" },
      { status: 500 }
    );
  }
}
