"use client";
import { useEffect, useState } from "react";
import { Movie } from "./MovieGallery";
import { font } from "@/lib/font";
import { fullDateFormat, timeFormat } from "@/lib/timeFormat";
import { useAppContext } from "@/context/AppContext";
import { Button } from "../ui/button";
import { pdf } from "@react-pdf/renderer"
import TicketPDF from "./TicketPDF";
import Loader from "./Loader";
import Image from "next/image";

interface User {
  name: string;
}

interface Show {
  _id: string;
  movie: Movie;
  showDateTime: string;
  showPrice: number;
}

export interface BookingData {
  _id: string;
  user: User;
  show: Show;
  amount: number;
  bookedSeats: string[];
  status: string;
  isPaid: boolean;
}

export interface TicketInfo {
  _id: string
  user: {
    name: string
    email: string
  }
  show: {
    movie: {
      title: string
    }
    showDateTime: string
  }
  amount: number
  bookedSeats: string[]
  status: string
  transactionUuid: string
  createdAt: string
  updatedAt: string
  __v: number
}

const BookingDetails = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false)
  const { user, image_base_url } = useAppContext();


  const getMyBookings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/bookings/user", { method: "GET" });
      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error in getMyBookings:", error);
    } finally {
      setLoading(false)
    }
  };

  const downloadTicket = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/ticket?id=${bookingId}`)
      const data = await response.json();
      if (data) {
        const blob = await pdf(<TicketPDF TicketInfo={data} />).toBlob();
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = `Ticket-${bookingId}.pdf`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error in downloadTicket(): ", error)
    }
  }

  useEffect(() => {
    if (user && bookings.length === 0) {
      getMyBookings();
    }
  }, [user, bookings.length]);
  return (
    <>
      <Loader loading={loading} />
      {
        bookings.length > 0 ? (
          <div
            className={`${font.className} max-w-7xl mt-14 mx-auto p-8 md:p-14 space-y-4 min-h-screen`}
          >
            <h1 className="font-semibold text-2xl mb-6">My Bookings</h1>
            {bookings
              .filter((item) => item.status === "COMPLETE")
              .map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row justify-between border border-gray-500 px-3 py-4 rounded-md shadow-xl"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="w-[140px] h-[180px] relative shrink-0">
                      <Image
                        src={image_base_url + item.show.movie.poster_path}
                        alt="poster"
                        fill
                        className="object-cover rounded-md"
                        sizes="140px"
                      />
                    </div>



                    <div className="flex flex-col p-4 gap-2">
                      <p className="text-lg font-semibold">
                        {item.show.movie.title}
                      </p>
                      <p className="text-sm text-gray-400 font-normal">
                        {timeFormat(item.show.movie.runtime)}
                      </p>
                      <p className="text-sm text-gray-400 font-normal">
                        {fullDateFormat(item.show.showDateTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between md:items-end md:text-right p-3 md:p-4">
                    <p className="text-lg font-semibold mb-3">NPR {item.amount}</p>

                    <div className="text-sm space-y-2">
                      <p>
                        <span>Total Tickets: </span>
                        {item.bookedSeats.length}
                      </p>
                      <p>
                        <span>Seat Number: </span>
                        {item.bookedSeats.join(", ")}
                      </p>
                      <div>
                        <Button variant={"show"} className="bg-red-500 hover:bg-red-600 cursor-pointer px-3 py-5"
                          onClick={() => downloadTicket(item._id)}
                        >
                          Download Ticket
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>) : (
          <div
            className={`h-[80vh] w-full mx-auto flex justify-center items-center ${font.className}`}
          >
            <div>
              <h1 className="text-center font-semibold text-xl">
                You have not made any bookings yet! 🎬
              </h1>
            </div>
          </div>
        )
      }
    </>
  )
};

export default BookingDetails;
