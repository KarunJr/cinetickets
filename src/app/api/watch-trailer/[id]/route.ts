import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
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
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong!" },
      { status: 400 }
    );
  }
}
