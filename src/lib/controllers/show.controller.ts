import { connectToDatabase } from "../db";
import Movie, { IMovie } from "@/models/movie.model";
import Show from "@/models/show.model";
import { Types } from "mongoose";
import { DefaultReturn } from "./admin.controller";

//Fetch all the Now Playing Movie
/**
 * It is a function which request now  playing movie from the TMDB
 * Used in /api/shows/now-palying
 * @returns movies(Now Playing Movie)
 */

interface GetNowPlayingMoviesReturn extends DefaultReturn {
  movies?: IMovie;
}
export const getNowPlayingMovies =
  async (): Promise<GetNowPlayingMoviesReturn> => {
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/movie/now_playing",
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }
      );
      const data = await response.json();
      const movies = data.results;
      if (movies) {
        return { success: true, message: "Now playing movies fetched", movies };
      } else {
        return { success: false, message: "Failed to fetch the movies" };
      }
    } catch (error: unknown) {
      console.log("Error in getNowPlayingMovies(): ", error);
      const message =
        error instanceof Error ? error.message : "Soemthing went wrong!";
      return {
        success: false,
        message,
      };
    }
  };

interface ShowDateTimeData {
  date: string;
  time: string[];
}

interface addShowParams {
  movieId: string;
  showsInput: ShowDateTimeData[];
  showPrice: number;
}

interface AddShowResult {
  success: boolean;
  message: string;
}

//Add shows controller
/**
 * This fn is basically used to add the NowPlaying movie in database, which admin wants to sell to the user.
 * Used in /api/shows/now-palying
 */
export const addShow = async ({
  movieId,
  showsInput,
  showPrice,
}: addShowParams): Promise<AddShowResult> => {
  try {
    await connectToDatabase();
    let movie = await Movie.findOne({ id: movieId });

    if (!movie) {
      /**
       * MovieDetailsRespone means Details of Movie
       * MovieCreditsResponse means Cast of Movie
       */
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),

        await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),
      ]);

      const [movieApiData, movieCreditsRawData] = await Promise.all([
        movieDetailsResponse.json(),
        movieCreditsResponse.json(),
      ]);
      /*
      // It is the same as above line no.69 where we declare Promise.all 
      const data = await movieDetailsResponse.json();
      const movieApiData = await data;

      const data2 = await movieCreditsResponse.json();
      const movieCreditsData = await data2.cast;*/

      const movieDetails = {
        id: movieId,
        title: movieApiData.title || "Unknown Title",
        overview: movieApiData.overview || "No overview available",
        poster_path: movieApiData.poster_path || "N/A",
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsRawData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        vote_count: movieApiData.vote_count,
        runtime: movieApiData.runtime,
      };

      const movieDoc = await Movie.create(movieDetails);

      movie = movieDoc;
    }

    interface ShowsToCreate {
      movie: Types.ObjectId;
      showDateTime: Date;
      showPrice: number;
      occupiedSeats: Record<string, string[]>;
    }
    const showsToCreate: ShowsToCreate[] = [];

    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movie._id,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    return { success: true, message: "Movie added successfully." };
  } catch (error: unknown) {
    console.log("Error in addShow(): ", error);
    const message =
      error instanceof Error ? error.message : "Soemthing went wrong!";
    return {
      success: false,
      message,
    };
  }
};

interface getAllShowsResult extends AddShowResult {
  uniqueShows?: IMovie[];
}

export const getAllShows = async (): Promise<getAllShowsResult> => {
  try {
    await connectToDatabase();
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate<{ movie: IMovie }>("movie")
      .sort({ showDateTime: 1 });

    // Filter Uniqe shows
    const uniqueShows = new Set(shows.map((show) => show.movie));

    if (uniqueShows.size === 0) {
      return {
        success: false,
        message: "No movies found!",
      };
    }
    return {
      success: true,
      message: "All movies are listed!",
      uniqueShows: Array.from(uniqueShows),
    };
  } catch (error: unknown) {
    console.error("Error in getAllShows(): ", error);
    const message =
      error instanceof Error ? error.message : "Soemthing went wrong!";
    return {
      success: false,
      message,
    };
  }
};

interface DateTimeEntry {
  showId: Types.ObjectId;
  time: Date;
}
interface GetSignleShowReturn extends AddShowResult {
  dateTime?: Record<string, DateTimeEntry[]>;
  movie?: IMovie;
}
export const getSingleShow = async (
  id: string
): Promise<GetSignleShowReturn> => {
  try {
    await connectToDatabase();

    // const movie = await Movie.findOne({ id });
    // const movie = await Movie.findOne({ _id: id });
    const movie = await Movie.findById(id);
    const shows = await Show.find({
      movie: movie?._id,
      showDateTime: { $gte: new Date() },
    });

    if (!movie) {
      return {
        success: false,
        message: "Movie not found!",
      };
    }
    if (shows.length === 0) {
      return {
        success: true,
        message: "No upcoming show for this movie!",
        dateTime: {},
        movie,
      };
    }

    const dateTime: Record<string, DateTimeEntry[]> = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];

      if (!dateTime[date]) {
        dateTime[date] = [];
      }

      dateTime[date].push({ time: show.showDateTime, showId: show._id });
    });

    //Sorting the time as AM to PM
    for (const date in dateTime) {
      dateTime[date].sort(
        (a: DateTimeEntry, b: DateTimeEntry) =>
          new Date(a.time).getTime() - new Date(b.time).getTime()
      );
    }

    return {
      success: true,
      message: "Movie detail found!",
      dateTime: dateTime,
      movie: movie,
    };
  } catch (error: unknown) {
    console.error("Error in getSingleShows(): ", error);
    const message =
      error instanceof Error ? error.message : "Soemthing went wrong!";
    return {
      success: false,
      message,
    };
  }
};
