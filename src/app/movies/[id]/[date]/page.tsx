"use client";

import { assets } from "@/assets/assets";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClockIcon } from "@radix-ui/react-icons";
import Loading from "@/components/loading";
import { hourFormat } from "@/lib/timeFormat";
import { font } from "@/lib/font";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext";
import EsewaDialog from "@/components/movie-section/EsewaDialog";
import Loader from "@/components/movie-section/Loader";

export interface selectedTime {
  time: string;
  showId: string;
}

interface DateTime {
  time: string;
  showId: string;
}

interface Show {
  dateTime: {
    [date: string]: DateTime[];
  };
}
const SeatLayout = () => {
  const params = useParams();
  const { id, date } = params;

  const { user } = useAppContext();
  const [selectedSeat, setSelectedSeat] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<selectedTime | null>(null);
  const [show, setShow] = useState<Show | null>(null);
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [lockedSeats, setLockedSeats] = useState<string[]>([]);
  const [showPrice, setShowPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const getShow = async () => {
    try {
      const response = await fetch(`/api/shows/${id}`, { method: "GET" });
      const data = await response.json();

      if (data.success) {
        setShow({ dateTime: data.showDateTime });
      }
    } catch (error) {
      console.error("Error in getShow():", error);
    }
  };

  const getOccupiedSeats = async () => {
    if (!selectedTime?.showId) return;
    setLoading(true)
    try {
      const response = await fetch(
        `/api/bookings/seats/${selectedTime?.showId}`
      );
      const data = await response.json();

      if (data.success) {
        setOccupiedSeats(data.occupiedSeats);
        setShowPrice(data.showPrice);
      } else {
        setShowPrice(data.showPrice);
      }
    } catch (error) {
      console.error("Error in getOccupiedSeats():", error);
    } finally {
      setLoading(false)
    }
  };

  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const handleSeatClick = async (seatId: string) => {
    if (!selectedTime) {
      toast.warning("Please select time first!");
      return;
    }

    if (!selectedSeat.includes(seatId) && selectedSeat.length >= 5) {
      return toast.warning("You can only select 5 seats!");
    }

    setSelectedSeat((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeats = (row: string, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;

          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 rounded border border-red-500 cursor-pointer ${selectedSeat.includes(seatId) && "bg-red-600 text-white"
                }
              ${occupiedSeats.includes(seatId) && "bg-gray-500 text-white"} 
              ${lockedSeats.includes(seatId) && "bg-yellow-400 text-white"}
              `}
              disabled={
                occupiedSeats.includes(seatId) || lockedSeats.includes(seatId)
              }
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  const seatInfo = (color: string, text: string) => (
    <div>
      <div
        className={`h-5 w-5 rounded-md border-red-600 ${color} mb-2 mx-auto`}
      ></div>
      <p className="text-xs mb-2">{text}</p>
    </div>
  );

  useEffect(() => {
    getShow();
  }, []);

  useEffect(() => {
    if (selectedTime) {
      setOccupiedSeats([]);
      setSelectedSeat([]);
      getOccupiedSeats();
    }
  }, [selectedTime]);



  useEffect(() => {
    const handleUnload = async () => {
      const goingToEsewa = sessionStorage.getItem("redirectingToEsewa");
      console.log("GoingToEsewa:", goingToEsewa);

      if (goingToEsewa) {
        sessionStorage.removeItem("redirectingToEsewa")
        return;
      }
      try {
        await fetch("/api/bookings/seats/all-unlock", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          keepalive: true,
        });
      } catch (error) {
        console.error("Error in handleUnload(): ", error);
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [user, selectedSeat]);

  return show ? (
    <>
      <Loader loading={loading} />
      <div
        className={`${font.className} relative max-w-7xl mx-auto p-14 mt-15 flex flex-col md:flex-row gap-16 items-center`}
      >
        {/* Available Timings */}
        <div className="border rounded-md shadow-xl border-red-500 w-60 md:sticky">
          <h1 className="text-xl font-semibold px-6 py-2">Available Timings</h1>
          <div className="space-y-3 my-3">
            {date &&
              show.dateTime[date as keyof typeof show.dateTime].map(
                (timeObj, index) => (
                  <div
                    onClick={() => {
                      if (selectedTime?.showId === timeObj.showId) {
                        setSelectedTime(null);
                        setSelectedSeat([]);
                      } else {
                        setSelectedTime({
                          time: timeObj.time,
                          showId: timeObj.showId,
                        });
                      }
                    }}
                    key={index}
                    className={`flex items-center flex-col text-xm cursor-pointer px-6 py-2 rounded-r-md w-max transition-colors duration-200 ease-in ${selectedTime?.time === timeObj.time
                      ? "bg-red-600 text-white"
                      : "hover:bg-red-400"
                      }`}
                  >
                    <p className="flex items-center gap-2">
                      <ClockIcon className="h-5 w-5" />
                      {hourFormat(timeObj.time)}
                    </p>
                  </div>
                )
              )}
          </div>
          <div className="flex gap-2 items-center justify-center">
            {seatInfo("bg-gray-500", "Sold Out")}
            {seatInfo("bg-yellow-400", "Processing")}
            {seatInfo("bg-red-600", "Selected")}
          </div>
        </div>

        {/* Seat Layout */}
        <div className="flex flex-1 items-center relative flex-col gap-2">
          <h1 className="text-2xl font-semibold">Select your seat</h1>
          <img src={assets.screenImage.src} alt="screen" className="" />
          <h1 className="text-sm font-normal text-gray-400">SCREEN SIDE</h1>

          <div className="flex flex-col mt-10 text-gray-500 text-sm items-center">
            <div
              className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-7
            "
            >
              {groupRows[0].map((row) => renderSeats(row))}
            </div>

            <div className="grid grid-cols-2 gap-8">
              {groupRows.slice(1).map((groups, index) => (
                <div key={index}>
                  {groups.map((row) => (
                    <div key={row}>{renderSeats(row)}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${font.className} flex justify-center flex-col gap-2 max-w-7xl mx-auto pb-3 sm:pb-24`}
      >
        {selectedSeat.length > 0 && (
          <div className="flex justify-center">
            <p>
              <span className="font-bold">Total Rs.</span>{" "}
              {showPrice * selectedSeat.length}
            </p>
          </div>
        )}
        <EsewaDialog
          selectedSeats={selectedSeat}
          selectedTime={selectedTime}
          showPrice={showPrice}
          setSelectedSeats={setSelectedSeat}
        />
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
