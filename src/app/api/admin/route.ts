import { getDashboardData } from "@/lib/controllers/admin.controller";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getDashboardData();

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
          dashbaordData: result.dashboardData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
      console.error("GET /api/admin error:", error);
      const message = error instanceof Error ? error.message : "Internal server error!";
      return NextResponse.json(
        { success: false, message },
        { status: 500 }
      );
    }
}
