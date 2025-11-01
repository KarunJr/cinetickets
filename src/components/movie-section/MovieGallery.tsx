"use client";

import { Button } from "../ui/button";
import { StarFilledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { timeFormat } from "@/lib/timeFormat";

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  name: string;
  profile_path: string;
}

export interface Movie {
  _id: string;
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  genres: Genre[];
  casts: Cast[];
  release_date: string;
  original_language: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
}

export interface MovieGalleryProps {
  movies: Movie[];
  image_base_url?: string;
}

export const MovieGallery = ({ movies, image_base_url }: MovieGalleryProps) => {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-3">
      {movies.map((movie) => (
        <div
          key={movie._id}
          className="bg-gray-900 rounded-lg shadow-xl p-4 space-y-3 w-full transform transition-transform duration-500 ease-out hover:-translate-y-1"
        >
          <div className="relative">
            <Image
              src={image_base_url + movie.backdrop_path}
              alt="banner"
              width={200}
              height={200}
              className="h-80 w-full object-cover rounded-md cursor-pointer"
              onClick={() => {
                router.push(`/movies/${movie._id}`);
                scrollTo(0, 0);
              }}
            />
          </div>
          <p className="truncate text-xm text-white">{movie.title}</p>
          <p className="text-xs text-gray-300">
            {new Date(movie.release_date).getFullYear()} •{" "}
            {movie.genres
              .slice(0, 2)
              .map((genre: any) => genre.name)
              .join(" | ")}{" "}
            • {timeFormat(movie.runtime)}
          </p>

          <div className="flex gap-3 justify-between items-center">
            <Button className="px-3 py-5 cursor-pointer bg-red-500 hover:bg-red-400 transition-colors duration-300 text-sm">
              <Link href={`/movies/${movie._id}`}>Buy Tickets</Link>
            </Button>

            <p className="flex gap-2 items-center text-white">
              <StarFilledIcon />
              {movie.vote_average.toFixed(1)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
