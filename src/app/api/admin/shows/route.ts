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
  } catch (error: any) {
    console.error("GET error in /api/admin/shows:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error!" },
      { status: 500 }
    );
  }
}
