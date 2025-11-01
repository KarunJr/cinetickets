import Link from "next/link";
import TrailerSection from "@/components/movie-section/TrailerSection";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Slider } from "@/components/slider";
import { Button } from "@/components/ui/button";
import { font } from "@/lib/font";
import FeatureShows from "@/components/movie-section/MovieFeatures";

export default function Home() {
  return (
    <div className="w-full">
      <Slider />
      <div
        className={`mt-3 max-w-7xl w-full mx-auto px-5 py-4 ${font.className}`}
      >
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-2xl mb-6">Now Showing</h1>
          <Button asChild variant={"link"} className="group font-semibold">
            <Link href={"/movies"}>
              View All{" "}
              <ArrowRightIcon className="transform transition-transform group-hover:translate-x-1 duration-200 ease-in" />
            </Link>
          </Button>
        </div>
        <div>
          <FeatureShows />
        </div>
        <TrailerSection />
      </div>
    </div>
  );
}
