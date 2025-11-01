"use client";

import { useEffect, useState } from "react";
import Title from "./title";
import { dummyBookingData } from "@/assets/assets";
import { BookingData } from "../movie-section/MyBooking";
import AdminLoading from "./loading";
import { font } from "@/lib/font";
import { fullDateFormat, shortDateFormat } from "@/lib/timeFormat";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";

const ListBooking = () => {
  const { user } = useAppContext();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    // setBookings(dummyBookingData);
    // setIsLoading(false);
    try {
      const response = await fetch("/api/admin/bookings");
      const data = await response.json();
      console.log("Bookings:", data.bookings);

      if (data.success) {
        setBookings(data.bookings);
        setIsLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error in getAllBookings():", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      getAllBookings();
    }
  }, [user]);

  return !isLoading ? (
    <>
      <Title text1="List" text2="Booking" />

      <div className={`${font.className} max-w-4xl mt-6 px-4 overflow-x-auto`}>
        <table className="border-collapse rounded-t-md overflow-hidden w-full">
          <thead>
            <tr className="bg-red-400 text-gray-800 font-semibold border-b-3 border-white">
              <td className="p-2 text-center">User Name</td>
              <td className="p-2 text-center">Movie Name</td>
              <td className="p-2 text-center">Show Time</td>
              <td className="p-2 text-center">Seats</td>
              <td className="p-2 text-center">Amount</td>
              <td className="p-2 text-center">Status</td>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => (
              <tr className="border-b bg-red-300" key={index}>
                <td className="p-2 text-center">{booking.user.name}</td>
                <td className="p-2 text-center">{booking.show.movie.title}</td>
                <td className="p-2 text-center max-md:hidden">
                  {fullDateFormat(booking.show.showDateTime)}
                </td>
                <td className="p-2 text-center sm:hidden">
                  {shortDateFormat(booking.show.showDateTime)}
                </td>
                <td className="p-2 text-center">
                  {booking.bookedSeats.join(", ")}
                </td>
                <td className="p-2 text-center">{booking.amount}</td>
                <td className="p-2 text-center">{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <AdminLoading />
  );
};

export default ListBooking;
