import { getSingleShow } from "@/lib/controllers/show.controller";
import { NextResponse } from "next/server";

// To Get single Movies from Database:
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const result = await getSingleShow(id);

    if (result.success && result.movie && result.dateTime) {
      return NextResponse.json(
        {
          success: true,
          show: result.movie,
          showDateTime: result.dateTime,
          message: result.message,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("GET /api/shows/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
