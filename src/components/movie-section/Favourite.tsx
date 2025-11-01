"use client";

import { useAppContext } from "@/context/AppContext";
import { MovieGallery } from "./MovieGallery";
import { font } from "@/lib/font";

const Favourites = () => {
  const { favouriteMovies, image_base_url } = useAppContext();
  return favouriteMovies.length > 0 ? (
    <MovieGallery movies={favouriteMovies} image_base_url={image_base_url} />
  ) : (
    <div
      className={`h-[50vh] w-full mx-auto flex justify-center items-center ${font.className}`}
    >
      <div>
        <h1 className="text-center font-semibold text-xl">
          No favourites found — start adding movies you love!
        </h1>
      </div>
    </div>
  );
};

export default Favourites;
