import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const movieId = await params;
    const response = await fetch(
      `
https://api.themoviedb.org/3/movie/${movieId.id}/videos`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const trailers = await response.json();

    const onlyFilter = trailers.results.filter(
      (item: { type: string; site: string; key: string }) =>
        item.type === "Trailer" && item.site === "YouTube"
    );
    if (onlyFilter.length > 0) {
      return NextResponse.json(
        { success: true, key: onlyFilter[0].key, message: "Enjoy this." },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Can't find the trailer. Sorry" },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("Error in /api/watch-trailer/[id]:", error);
    const message = error instanceof Error ? error.message : "Internal server error!";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
