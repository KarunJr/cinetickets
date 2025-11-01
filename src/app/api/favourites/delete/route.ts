import { deleteFavourites } from "@/lib/controllers/favourites.contorller";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { NextResponse } from "next/server";
export async function DELETE (req: Request) {
  try {
    const session: Session | null = await auth();
    if (!session)
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    const { movieId } = await req.json();

    const result = await deleteFavourites({ session, movieId });

    if (result.success) {
      return NextResponse.json({ message: result.message }, { status: 200 });
    }else{
      return NextResponse.json({ message: result.message }, { status: 400 });
    }
  } catch (error: any) {
    console.error("GET error in /api/favourites/delete: ", error);
    return NextResponse.json(
      { message: error.message || "Internal server error!" },
      { status: 500 }
    );
  }
}
