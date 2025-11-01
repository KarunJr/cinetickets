import { dummyShowsData } from "@/assets/assets";
import Favourites from "@/components/movie-section/Favourite";
import Navbar from "@/components/navbar";
import { font } from "@/lib/font";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Favourites - CineTickets",
  description:
    "Save and view all your favourite movies in one place. Easily manage and book tickets for your top picks.",
};

const FavouritesPage = () => {
  return(
    <div className={`h-full ${font.className} py-14`}>
      <Navbar />
      <div className="max-w-7xl px-3 mx-auto mt-10">
        <h1 className="font-bold text-2xl mb-6">Favourites</h1>
        {/* <MovieGallery movies={dummyShowsData} /> */}
        <Favourites/>
      </div>
    </div>
  )
};

export default FavouritesPage;
