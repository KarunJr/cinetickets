"use client";

import { useEffect, useState } from "react";
import Title from "./title";
import { Movie } from "../movie-section/MovieGallery";
import AdminLoading from "./loading";
import { font } from "@/lib/font";
import { CheckCircledIcon, StarIcon } from "@radix-ui/react-icons";
import { kConverter } from "@/lib/timeFormat";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { DeleteIcon } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

// interface DateTimeSelection{
//   date: string,
//   time: string
// }

const AddShows = () => {
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [dateTimeSelection, setDateTimeSelection] = useState<
    Record<string, string[]>
  >({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [addingShow, setAddingShow] = useState(false);

  const { user, image_base_url } = useAppContext();
  const fetchNowPlayingMovies = async () => {
    try {
      const response = await fetch(`/api/shows/now-playing`, { method: "GET" });
      const data = await response.json();

      if (data.success) {
        setNowPlayingMovies(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error in fetchNowPlayingMovies():", error);
    }
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) {
      return toast.warning("Enter the date and time!");
    }

    const [date, time] = dateTimeInput.split("T");

    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }

      return prev;
    });
  };

  const handleRemoveTime = (date: string, time: string) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _ignored, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [date]: filteredTimes,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      setAddingShow(true);
      if (Object.keys(dateTimeSelection).length === 0 || !showPrice) {
        setAddingShow(false);
        return toast.error("Missing required fields");
      }
      if (!selectedMovie) {
        setAddingShow(false);
        return toast.error("Select the movie to add.");
      }

      const showsInput = Object.entries(dateTimeSelection).map(
        ([date, time]) => ({ date, time })
      );

      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showPrice),
      };

      if (user && user.role === "admin") {
        const response = await fetch("/api/shows/now-playing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Error in handlSubmit of Add Show:", error);
      toast.error("An error occured. Please try again.");
    }
    setSelectedMovie(null);
    setDateTimeSelection({});
    setShowPrice("");
    setAddingShow(false);
  };

  useEffect(() => {
    if (user && user.role === "admin") fetchNowPlayingMovies();
  }, [user]);

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />

      <div className={`${font.className} mt-4 p-3`}>
        <h1
          className="font-semibold text-xl mb-4"
          onClick={() => toast.success("Hello")}
        >
          Now Playing Movies
        </h1>
        <div className="flex gap-4 flex-wrap overflow-x-auto">
          {nowPlayingMovies.map((movie, index) => (
            <div
              key={index}
              className="relative min-max-w-20 md:max-w-45 cursor-pointer hover:-translate-y-1 transition-all duration-300"
              onClick={() => setSelectedMovie(movie.id)}
            >
              <div className="relative overflow-hidden rounded-md w-full">
                {/* <img
                  src={image_base_url + movie.poster_path}
                  alt="poster"
                  className="w-full object-cover brightness-90"
                /> */}

                <Image
                  src={image_base_url + movie.poster_path}
                  alt="poster"
                  className="w-full object-cover brightness-90"
                  width={500} // You can adjust the width depending on the size you need
                  height={750} // Adjust the height to match the aspect ratio
                  priority // This will make the image load faster (good for above-the-fold images)
                />
                <div className="flex gap-2 justify-between absolute bottom-0 left-0 bg-white/5 backdrop-blur-md p-2 w-full">
                  <p className="text-sm flex items-center gap-1 text-white/80">
                    <StarIcon className="text-red-400" />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className="text-white/80">
                    {kConverter(movie.vote_count)} Votes
                  </p>
                </div>
              </div>

              {selectedMovie === movie.id && (
                <div className="absolute top-2 right-2 bg-red-400 p-1 rounded-md">
                  <CheckCircledIcon className="w-6 h-6 text-white" />
                </div>
              )}

              <div className="block">
                <p className="mt-2 font-semibold">{movie.title}</p>
                <p className="font-normal text-sm mt-1">{movie.release_date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Show Price Input */}
        <div className={`${font.className} mt-8`}>
          <label htmlFor="price" className="block font-semibold text-xm mb-2">
            Show Price
          </label>
          <div className="inline-flex items-center gap-2 border border-gray-600 py-2 px-3 rounded-md">
            <p className="text-gray-400 text-sm">RS</p>
            <input
              min={0}
              type="number"
              value={showPrice}
              onChange={(e) => setShowPrice(e.target.value)}
              placeholder="Enter show price"
              className="outline-none"
            />
          </div>
        </div>

        {/* Date & Time Selection */}
        <div className={`${font.className} mt-6`}>
          <label htmlFor="date" className="block font-semibold text-xm mb-2">
            Select Date and Time
          </label>
          <div className="inline-flex flex-col md:flex-row items-end md:items-center gap-2 border border-gray-600 py-2 px-3 rounded-md">
            <input
              type="datetime-local"
              value={dateTimeInput}
              onChange={(e) => setDateTimeInput(e.target.value)}
              className="outline-none rounded-md"
            />
            <Button
              variant={"show"}
              className="bg-red-500 px-3 py-2 cursor-pointer text-white hover:bg-red-400 transition-colors duration-200 ease-in"
              onClick={handleDateTimeAdd}
            >
              Add Time
            </Button>
          </div>
        </div>

        {/* Display Selected Times */}
        {Object.keys(dateTimeSelection).length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold text-xm mb-3">Selected Date-Time</h2>
            <ul className="space-y-3">
              {Object.entries(dateTimeSelection).map(([date, times]) => (
                <li key={date}>
                  <div className="font-normal mb-3">{date}</div>
                  <div className="flex flex-wrap gap-2 mt-1 text-sm">
                    {times.map((time) => (
                      <div
                        key={time}
                        className="border border-red-500 px-2 py-1 flex items-center rounded-md"
                      >
                        <span className="">{time}</span>
                        <DeleteIcon
                          onClick={() => handleRemoveTime(date, time)}
                          width={25}
                          className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button
          className="mt-3 bg-red-500 hover:bg-red-400 text-white transition-colors duration-300 ease-in cursor-pointer"
          variant={"show"}
          onClick={handleSubmit}
          disabled={addingShow}
        >
          Add Show
        </Button>
      </div>
    </>
  ) : (
    <AdminLoading />
  );
};

export default AddShows;
