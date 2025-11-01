"use client";

import { useAppContext } from "@/context/AppContext";
import { MovieGallery } from "./MovieGallery";

export const MovieCollection = () => {
  const { shows, image_base_url } = useAppContext();

  return <MovieGallery movies={shows} image_base_url={image_base_url} />;
};
