"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Movie,
  MovieGallery,
} from "@/components/movie-section/MovieGallery";
import { font } from "@/lib/font";
import { StarFilledIcon, PlayIcon } from "@radix-ui/react-icons";
import { timeFormat } from "@/lib/timeFormat";
import { Button } from "@/components/ui/button";
import DateSelect, {
  DateTimeData,
} from "@/components/movie-section/DateSelect";
import Image from "next/image";
import Loading from "@/components/loading";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";
import { Heart, X } from "lucide-react";
import Loader from "@/components/movie-section/Loader";
import ReactPlayer from "react-player"

export interface ShowDetails {
  movie: Movie;
}

const MoviesDetails = () => {
  const [show, setShow] = useState<Movie>();
  const [showDateTime, setShowDateTime] = useState<DateTimeData>();
  const [favourite, setFavourite] = useState<boolean>(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [trailer, setTrailer] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const { id } = params;
  const { shows, user, fetchFavouriteMovies, favouriteMovies, image_base_url } =
    useAppContext();

  useEffect(() => {
    const isFav = !!favouriteMovies.find((movie) => movie._id === id);

    setFavourite(isFav);
  }, [favouriteMovies, id]);


  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const getShow = useCallback(async () => {
    try {
      const response = await fetch(`/api/shows/${id}`);
      const data = await response.json();
      console.log("Here the show is:", data.show);

      if (data.success) {
        setShow(data.show);
        setShowDateTime(data.showDateTime);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error in getShow(): ", error);
    }
  }, [id])
  // const getShow = async () => {
  //   try {
  //     const response = await fetch(`/api/shows/${id}`);
  //     const data = await response.json();
  //     console.log("Here the show is:", data.show);

  //     if (data.success) {
  //       setShow(data.show);
  //       setShowDateTime(data.showDateTime);
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error in getShow(): ", error);
  //   }
  // };

  const handleFavourite = async () => {
    try {
      if (!user) {
        return toast.error("You must logged in!");
      }

      const nextFav = !favourite;
      if (nextFav) {
        const response = await fetch(`/api/favourites/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movieId: id }),
        });
        const data = await response.json();

        if (data.success) {
          fetchFavouriteMovies();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } else {
        const response = await fetch("/api/favourites/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movieId: id }),
        });
        const data = await response.json();
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
      setFavourite(nextFav);
      fetchFavouriteMovies();
    } catch (error) {
      console.error("Error in handleFavourite():", error);
    }
  };


  const viewTrailer = async (moveiId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/watch-trailer/${moveiId}`)
      const data = await response.json();

      if (data.success) {
        setShowPlayer(true);
        setTrailer(data.key)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error in viewTrailer():", error)
    } finally {
      setLoading(false)
    }
  }
  const handleCross = () => {
    setShowPlayer(false)
    setTrailer("")
  }
  useEffect(() => {
    getShow();
  }, [getShow]);

  return show ? (
    <>
      <Loader loading={loading} />
      {
        showPlayer && (
          <div className="fixed top-0 left-0 flex justify-center items-center bg-black/90 w-screen min-h-screen z-50">
            <div className="w-full md:w-1/2 h-80 md:h-130 relative p-3 rounded-lg">
              <div className="absolute top-0 right-0 z-30 bg-white text-red p-1 rounded-full cursor-pointer" onClick={handleCross}>
                <X className="size-5 text-red-600" />
              </div>
              <ReactPlayer
                src={`https://www.youtube.com/watch?v=${trailer}`}
                controls={true}
                height="100%"
                width="100%"
                className=""
              />
            </div>
          </div>
        )
      }
      <div className={`${font.className} max-w-7xl px-3 mx-auto mt-10 py-14`}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Section */}
          <div className="p-2 mx-auto">
            {/* <img
              src={image_base_url + show.poster_path}
              alt=""
              className="h-96 max-w-70 object-cover rounded-md shadow-xl"
            /> */}

            <Image
              src={image_base_url + show.poster_path}
              alt="Movie poster"
              width={280}
              height={384}
              className="rounded-md shadow-xl object-cover"
              priority
            />
          </div>

          {/* Description Section */}
          <div className="p-2 font-semibold flex gap-3 flex-col">
            <h1 className="font-semibold text-xm">English</h1>
            <h1 className="text-3xl">{show?.title}</h1>
            <h1 className="flex gap-2 items-center text-xs font-normal">
              <StarFilledIcon />
              {show?.vote_average.toFixed(1)} User Rating
            </h1>
            <p className="font-normal">{show?.overview}</p>

            <p>
              {timeFormat(show.runtime)} •{" "}
              {show.genres.map((genre) => genre.name).join(", ")} •{" "}
              {new Date(show.release_date).getFullYear()}
            </p>

            <div className="flex flex-wrap gap-3 font-normal items-center">
              <Button
                className="bg-gray-600 transition-colors duration-300 ease-in hover:bg-gray-800 text-white  cursor-pointer py-6 px-6 text-center"
                variant={"show"}
                onClick={() => {
                  viewTrailer(show.id); console.log("This is show id", show.id);
                }}
              >
                <PlayIcon className="text-white size-7" />
                Watch Trailer
              </Button>

              <Button
                className="bg-red-500 transition-colors duration-300 ease-in hover:bg-red-600 text-white  cursor-pointer py-6 px-6 text-center"
                variant={"show"}
                onClick={() => handleScroll("dateSelect")}
              >
                Buy Tickets
              </Button>

              <Button
                className="rounded-full bg-gray-600 cursor-pointer hover:bg-slate-700"
                variant={"show"}
                onClick={handleFavourite}
              >
                <Heart
                  className={`size-7 ${favourite
                    ? "fill-red-700 text-red-700 transition-colors duration-300 ease-out"
                    : " transition-colors duration-300 ease-in text-white"
                    }`}
                />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-2 mt-10">
          <h1 className="font-bold text-xl mb-6">Your Favourite Cast</h1>
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {show?.casts.map((cast, index) => (
              <div
                key={index}
                className="flex flex-shrink-0 flex-col items-center"
              >
                {/* <img
                  src={image_base_url + cast.profile_path}
                  alt={cast.name}
                  className="rounded-full w-20 h-20 object-cover"
                /> */}

                <Image
                  src={image_base_url + cast.profile_path}
                  alt={cast.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
                <span className="text-xs font-bold mt-1">{cast.name}</span>
              </div>
            ))}
          </div>
        </div>

        <DateSelect id={id} date={showDateTime!} />

        <div className="mt-10 p-2 font-bold space-y-3">
          <p>You may also like</p>
          <div className="">
            <MovieGallery
              movies={shows.slice(0, 5).filter((movie) => movie._id !== id)}
              image_base_url={image_base_url}
            />
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default MoviesDetails;
