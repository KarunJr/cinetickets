import { addFavourites } from "@/lib/controllers/favourites.contorller";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const session: Session | null = await auth();
    if (!session)
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    const { movieId } = await req.json();
    const result = await addFavourites({ session, movieId });

    if (result.success) {
      return NextResponse.json(
        { success: true, message: result.message },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("POST error in /api/favourites/add: ", error);
    const message = error instanceof Error ? error.message : "Internal server error!";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
