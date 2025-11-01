"use client";

import React, { useEffect, useState } from "react";
import {
  ChartLineIcon,
  CircleDollarSign,
  PlayCircleIcon,
  UserIcon,
} from "lucide-react";
import { dummyDashboardData } from "@/assets/assets";
import { Movie } from "../movie-section/MovieGallery";
import Title from "./title";
import { font } from "@/lib/font";
import AdminLoading from "./loading";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { fullDateFormat } from "@/lib/timeFormat";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";

interface ActiveShows {
  _id: string;
  movie: Movie;
  showDateTime: string;
  showPrice: number;
  occupiedSeats: Record<string, string | undefined>;
}

interface DashboardData {
  totalBookings: number;
  totalRevenue: number;
  activeShows: ActiveShows[];
  totalUser: number;
}

interface DashboardCards {
  title: string;
  value: number | string;
  icon: React.ElementType;
}

const Dashboard = () => {
  const { user, image_base_url } = useAppContext();

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  const dashboardCards: DashboardCards[] = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings || "0",
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: "Rs " + dashboardData.totalRevenue || "0",
      icon: CircleDollarSign,
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows.length || "0",
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser || "0",
      icon: UserIcon,
    },
  ];

  const fetchDashboardData = async () => {
    // setDashboardData(dummyDashboardData);
    // setIsLoading(false);

    try {
      const response = await fetch("/api/admin");
      const data = await response.json();

      if (data.success) {
        setDashboardData(data.dashbaordData);
        setIsLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error("Error fetching dashboard data:", error.message);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchDashboardData();
    }
  }, [user]);

  return !isLoading ? (
    <>
      <Title text1="Admin" text2="Dashboard" />

      <div
        className={`${font.className} flex flex-col md:flex-row mt-4 gap-4 px-4 py-4`}
      >
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 border-2 border-gray-600 py-3 px-5 rounded-md"
          >
            <h1 className="font-semibold">{card.title}</h1>
            <div className="flex justify-between items-center">
              <p>{card.value}</p>
              <card.icon className="w-7 h-7" />
            </div>
          </div>
        ))}
      </div>

      <div className={`${font.className}  mt-4 gap-4 px-4 py-4`}>
        <h1 className="font-semibold text-xl mb-5">Active Shows</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {dashboardData.activeShows.map((shows, index) => (
            <div
              className="border rounded-xl space-y-2 cursor-pointer"
              key={index}
            >
              <img
                src={image_base_url + shows.movie.poster_path}
                alt="poster"
                className="h-80 md:h-92 w-full object-cover rounded-t-xl"
              />
              <p className="text-xl font-semibold px-3">{shows.movie.title}</p>
              <div className="flex  justify-between px-3 ">
                <p>Rs {shows.showPrice}</p>
                <p className="flex items-center gap-3">
                  <StarFilledIcon className="text-red-500" />
                  {shows.movie.vote_average.toFixed(1)}
                </p>
              </div>

              <p className="px-3 mb-3 text-sm">
                {fullDateFormat(shows.showDateTime)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  ) : (
    <AdminLoading />
  );
};

export default Dashboard;
