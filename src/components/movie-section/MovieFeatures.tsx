"use client";

import { useAppContext } from "@/context/AppContext";
import { MovieGallery } from "./MovieGallery";

const FeatureShows = () => {
  const { shows, image_base_url } = useAppContext();

  return (
    <MovieGallery movies={shows.slice(0, 4)} image_base_url={image_base_url} />
  );
};

export default FeatureShows;
