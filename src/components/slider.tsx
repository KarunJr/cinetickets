"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Button } from "./ui/button";
import Image from "next/image";
import { font } from "@/lib/font";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import { useState } from "react";
import ReactPlayer from "react-player"
import { X } from "lucide-react";
import Loader from "./movie-section/Loader";


export const Slider = () => {
  const { shows, image_base_url } = useAppContext();
  const [showPlayer, setShowPlayer] = useState(false)
  const [trailer, setTrailer] = useState("")
  const [loading, setLoading] = useState(false);

  const viewTrailer = async (movieId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/watch-trailer/${movieId}`)
      const data = await response.json();

      if (data.success) {
        setTrailer(data.key)
        setShowPlayer(true)
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

  return shows && (

    <>
      <Loader loading={loading} />
      <div className="w-full h-70 md:h-120 mx-auto mt-17">
        {
          showPlayer && (
            <div className="fixed bg-black/90 min-h-screen z-50 w-screen flex justify-center items-center top-0 left-0">
              <div className="border border-black/90 w-full md:w-1/2 h-80 md:h-130 relative py-6 px-4 rounded-md">
                <div className="absolute top-0 right-0 z-30 bg-white text-red p-1 rounded-full cursor-pointer" onClick={handleCross}>
                  <X className="size-5 text-red-600" />
                </div>
                <ReactPlayer
                  src={`https://www.youtube.com/watch?v=${trailer}`}
                  controls={true}
                  height="100%"
                  width="100%"
                />
              </div>

            </div>
          )
        }
        <Swiper navigation={true} modules={[Navigation]}>
          {shows.map((show, index) => (
            <SwiperSlide>
              <div key={index} className={`w-full h-70 md:h-120 relative ${font.className}`}>
                <Image
                  src={image_base_url + show.backdrop_path}
                  alt={show.title}
                  priority
                  fill
                  className="object-cover"
                />
                <div className={`${font.className}`}>
                  <h1 className="absolute top-55 left-5 md:top-80 md:left-15 text-white text-3xl md:text-5xl font-bold min-w-3xl truncate">{show.title}</h1>
                  <div className="hidden absolute md:flex gap-x-4 justify-start top-95 left-15 text-white font-bold">
                    <Button
                      className="p-6 border border-red-600 cursor-pointer hover:bg-red-600 transition-colors ease-in duration-300 rounded-2xl text-base"
                      variant={"show"}
                      onClick={() => { viewTrailer(show.id) }}
                    >
                      Watch Trailer
                    </Button>
                    <Button
                      className="p-6 border border-red-600 cursor-pointer hover:bg-red-600 transition-colors ease-in duration-300 rounded-2xl text-base"
                      variant={"show"}
                    >
                      <Link href={`/movies/${show._id}`}>Buy Tickets</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </>

  );
};
