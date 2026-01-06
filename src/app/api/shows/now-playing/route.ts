import {
  addShow,
  getNowPlayingMovies,
} from "@/lib/controllers/show.controller";
import { NextResponse } from "next/server";

// Calls the NowPlaying contorller and gives the response..
export async function GET() {
  try {
    const shows = await getNowPlayingMovies();
    if (shows.success) {
      return NextResponse.json(
        { success: true, message: shows.message, shows: shows.movies },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: shows.message },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("GET /api/shows/now-playing error:", error);
    const message = error instanceof Error ? error.message : "Internal server error!";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

//Calls the addShow contoller and gives the result message either success or fail
export async function POST(req: Request) {
  try {
    const { movieId, showsInput, showPrice } = await req.json();

    const result = await addShow({ movieId, showsInput, showPrice });

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error("POST /api/shows/now-playing error:", error);
    const message = error instanceof Error ? error.message : "Internal server error!";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
