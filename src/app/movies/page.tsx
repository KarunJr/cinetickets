import { dummyShowsData } from "@/assets/assets";
import { MovieCollection } from "@/components/movie-section/MoviesCollection";
import { font } from "@/lib/font";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Now Showing - CineTickets",
  description: "Browse all current movies and book your tickets online easily.",
};

const Movies = () => {
  return dummyShowsData.length > 0 ? (
    <div className={`h-full ${font.className} py-14`}>
      <div className="max-w-7xl px-3 mx-auto mt-10">
        <h1 className="font-bold text-2xl mb-6">Now Showing</h1>
        <MovieCollection/>
      </div>
    </div>
  ) : (
    <div
      className={`h-[80vh] w-full mx-auto flex justify-center items-center ${font.className}`}
    >
      <div>
        <h1 className="text-center font-semibold text-xl">
          No movies to show!
        </h1>
      </div>
    </div>
  );
};

export default Movies;
