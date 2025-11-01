"use client";

import { TicketInfo } from "@/components/movie-section/MyBooking";
import getUser from "@/hooks/getUser";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface AppContextIF {
  user: any;
  shows: any[];
  favouriteMovies: any[];
  image_base_url: string;
  fetchFavouriteMovies: () => void;
}

// Provide a default value matching the interface
const defaultContext: AppContextIF = {
  user: null,
  shows: [],
  favouriteMovies: [],
  image_base_url: "",
  fetchFavouriteMovies: () => { },
};
export const AppContext = createContext<AppContextIF>(defaultContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [shows, setShows] = useState([]);
  const [favouriteMovies, setFavouriteMovies] = useState([]);

  const image_base_url = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL!;

  const user = getUser();
  const fetchShows = async () => {
    try {
      const response = await fetch(`/api/shows`);
      const data = await response.json();

      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error in fetchShows(): ", error);
    }
  };

  const fetchFavouriteMovies = async () => {
    try {
      const response = await fetch("/api/favourites");
      const data = await response.json();

      if (data.success && data.favourites) {
        setFavouriteMovies(data.favourites.movies);
      }

    } catch (error) {
      console.error("Error in fetchFavourtieMovies(): ", error);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (user) {
      fetchFavouriteMovies();
    }
  }, [user]);

  const value: AppContextIF = {
    user,
    shows,
    favouriteMovies,
    image_base_url,
    fetchFavouriteMovies,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
