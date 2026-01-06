import { getAllShows } from "@/lib/controllers/admin.controller";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getAllShows();
    if (result.success) {
      return NextResponse.json(
        { success: true, message: result.message, shows: result.shows },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error("GET error in /api/admin/shows:", error);
    const message = error instanceof Error ? error.message : "Internal server error!";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
