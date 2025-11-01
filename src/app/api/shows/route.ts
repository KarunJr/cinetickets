import { getAllShows } from "@/lib/controllers/show.controller";
import { NextResponse } from "next/server";

// To Get all the Movies from Database:
export async function GET() {
  try {
    const result = await getAllShows();

    if (result.success && result.uniqueShows) {
      return NextResponse.json(
        { shows: result.uniqueShows, message: result.message, success: true },
        { status: 200 }
      );
    } else{
      return NextResponse.json({ message: result.message, success: false }, {status: 400});
    }
  } catch (error: any) {
    console.error("GET /api/shows error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
