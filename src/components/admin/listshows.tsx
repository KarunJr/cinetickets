"use client";

import { useEffect, useState } from "react";
import { Movie } from "../movie-section/MovieGallery";
import Title from "./title";
import { dummyShowsData } from "@/assets/assets";
import { font } from "@/lib/font";
import { fullDateFormat, shortDateFormat } from "@/lib/timeFormat";
import AdminLoading from "./loading";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";

interface Shows {
  movie: Movie;
  showDateTime: string;
  showPrice: number;
  occupiedSeats: Record<string, string | undefined>;
}

const ListShows = () => {
  const { user } = useAppContext();

  const [shows, setShows] = useState<Shows[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getShow = async () => {
    try {
      const response = await fetch("/api/admin/shows");
      const data = await response.json();

      if (data.success) {
        setShows(data.shows);
        setIsLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error in ListShows: ", error);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      getShow();
    }
  }, [user]);

  return !isLoading ? (
    <div>
      <Title text1="List" text2="Shows" />

      <div className={`${font.className} max-w-4xl mt-6 px-4 overflow-x-auto`}>
        <table className="w-full border-collapse rounded-t-md overflow-hidden">
          <thead>
            <tr className="bg-red-400 text-gray-800 border-b-3 border-white">
              <th className="p-2">Movie Name</th>
              <th className="p-2">Show Time</th>
              <th className="p-2">Total Bookings</th>
              <th className="p-2">Earnings</th>
            </tr>
          </thead>

          <tbody>
            {shows.map((show, index) => (
              <tr
                key={index}
                className="bg-red-300 even:border-red-300"
              >
                <td className="p-2 text-center border-b-2">{show.movie.title}</td>
                <td className="p-2 text-center border-b-2 max-md:hidden">
                  {fullDateFormat(show.showDateTime)}
                </td>
                <td className="p-2 text-center border-b-2 sm:hidden">
                  {shortDateFormat(show.showDateTime)}
                </td>
                <td className="p-2 text-center border-b-2">
                  {Object.keys(show.occupiedSeats).length}
                </td>
                <td className="p-2 text-center border-b-2">
                  Rs {Object.keys(show.occupiedSeats).length * show.showPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <AdminLoading />
  );
};

export default ListShows;
