import { auth } from "@/auth";
import { getAllFavourites } from "@/lib/controllers/favourites.contorller";
import { Session } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session: Session | null = await auth();
    if (!session)
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });

    const result = await getAllFavourites(session);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
          favourites: result.favourites,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: true, message: result.message },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("GET error in /api/favourites/: ", error);
    const message = error instanceof Error ? error.message : "Internal server error!";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
