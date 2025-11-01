"use client";
import React from "react";
import { useState } from "react";
import ReactPlayer from "react-player";
import { dummyTrailers } from "@/assets/assets";
import { PlayIcon } from "@radix-ui/react-icons";

const TrailerSection = () => {
  const [openTrailer, setOpenTrailer] = useState(dummyTrailers[0]);
  return (
    <div className="mt-6 w-full max-w-6xl mx-auto">
      <p className="text-xm font-bold m-5">Trailers</p>

      <div className="relative w-full pb-[56.25%] rounded-md overflow-hidden">
        <ReactPlayer
          src={openTrailer.videoUrl}
          controls={true}
          height="100%"
          width="100%"
          className="absolute top-0 left-0"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-2 m-4 w-full max-w-4xl mx-auto">
        {
          dummyTrailers.map((trailer) => (
            <div key={trailer.image} className="relative flex justify-center items-center group cursor-pointer transform transition-transform duration-300 ease-in hover:-translate-y-1">
              <img src={trailer.image} alt="trialer" className="rounded-md object-cover brightness-75" />
              <PlayIcon onClick={() => setOpenTrailer(trailer)} className="absolute text-white w-9 h-9 opacity-100 lg:opacity-0 transition-opacity group-hover:opacity-100 duration-100" />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default TrailerSection;
