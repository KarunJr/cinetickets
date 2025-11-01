"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { font } from "@/lib/font";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { selectedTime } from "@/app/movies/[id]/[date]/page";
import { useState } from "react";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext";
import { v4 as uuidv4 } from "uuid";
import SeatError from "./SeatError";
import Loader from "./Loader";

interface EsewaDialogProps {
  selectedSeats: string[];
  selectedTime: selectedTime | null;
  showPrice: number;
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
}

const EsewaDialog = ({
  selectedSeats,
  selectedTime,
  showPrice,
  setSelectedSeats,
}: EsewaDialogProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [errorDialog, setErrorDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAppContext();
  const amount = selectedSeats.length * showPrice;
  const transactionUuid = `${Date.now()}-${uuidv4()}`;

  const handleDialog = async () => {
    if (!user) {
      setOpen(false);
      return toast.error("Please login to proceed", {
        position: "bottom-right",
      });
    }
    if (!selectedSeats.length || !selectedTime) {
      setOpen(false);
      return toast.error("Please select time and seats.", {
        position: "bottom-right",
      });
    }

    setLoading(true);
    try {
      const response = await fetch("/api/bookings/seats/lock-seat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          showId: selectedTime.showId,
          seats: selectedSeats,
          userId: user.id,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setOpen(true);
      } else {
        setError(data.message);
        setErrorDialog(true);
        setSelectedSeats([]);
        return;
      }
    } catch (error) {
      console.error("Error in validateField():", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && selectedSeats.length > 0) {
      setLoading(true);
      try {
        const response = await fetch("/api/bookings/seats/unlock-seat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            showId: selectedTime!.showId,
            seats: selectedSeats,
            userId: user.id,
          }),
        });
        const data = await response.json();
        if (data.success) {
          setSelectedSeats([]);
          toast.success(data.message);
        } else {
          toast.warning(data.message);
        }
      } catch (error) {
        console.error("Failed to unlock seat:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // **Handle Payment Failures with Temporary Booking:**
  // 1. A booking record is created in the DB immediately upon payment attempt, even if the payment fails (Status: Failed).
  // 2. This record is marked with a 5-minute Time-To-Live (TTL) using a MongoDB index.
  // 3. MongoDB automatically deletes the 'Failed' booking record after 5 minutes.
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      return toast.error("Please login to proceed", {
        position: "bottom-right",
      });
    }
    if (!selectedTime || !selectedSeats.length) {
      return toast.error("Please select time and seats.", {
        position: "bottom-right",
      });
    }
    console.log("Show:", { showId: selectedTime.showId, selectedSeats: selectedSeats, transactionUuid: transactionUuid, amount: amount });

    if (typeof window !== "undefined") {
      sessionStorage.setItem("redirectingToEsewa", "true")
    }

    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          showId: selectedTime.showId,
          selectedSeats: selectedSeats,
          transactionUuid: transactionUuid,
          amount: amount,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message)
      }
    } catch (error) {
      console.error("Error in bookTickets():", error);
      return;
    }

    //To call the Esewa API and redirect user to payment screen
    try {
      e.preventDefault();

      const response = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          transactionUuid: transactionUuid,
          showId: selectedTime.showId,
          userId: user.id,
          seats: selectedSeats,
        }),
      });
      const data = await response.json();
      console.log("I am here");

      if (data.success && data.esewaConfig) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
        Object.entries(data.esewaConfig).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      } else {
        setSelectedSeats([]);
        return toast.message(data.message);
      }
    } catch (error) {
      console.error("Error in handlePayment():", error);
    }
  };

  return (
    <div className={`${font.className} mx-auto`}>
      <Loader loading={loading} />
      {errorDialog && (
        <SeatError message={error} onClose={() => setErrorDialog(false)} />
      )}
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <Button
          variant={"show"}
          className="bg-red-600 max-w-80 mx-auto text-white text-sm py-5 cursor-pointer hover:bg-red-700 transition-colors duration-200 ease-in group"
          onClick={handleDialog}
        >
          Proceed to Payment{" "}
          <ArrowRightIcon className="transform transition-transform duration-200 ease-in group-hover:translate-x-1" />
        </Button>
        <DialogContent className="bg-gray-200">
          <DialogHeader>
            <DialogTitle className="mx-auto mb-3">
              <p className="text-2xl font-bold ">
                Cine
                <span className="text-3xl font-mono italic text-red-500">
                  T
                </span>
                ickets
              </p>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row w-full font-semibold gap-2">
            {/* Product Summary */}
            <div
              className="flex flex-col space-y-3 flex-1 px-3
            "
            >
              <h1 className="text-xl">Payment Summary</h1>
              <div className="text-xm space-y-2">
                <p>Seats: {selectedSeats.join(", ")}</p>
                <p className="text-xl">
                  <span className="text-red-600">Total: Rs.</span>{" "}
                  {selectedSeats.length * showPrice}
                </p>

                <p className="bg-white/50 rounded-md py-3 px-3 text-sm my-4">
                  By proceeding, I express my consent to complete this
                  transaction.
                </p>
              </div>
            </div>
            <div className="border-1 border-gray-300"> </div>
            {/* Choose Method */}
            <div className="flex items-center flex-col space-y-4">
              <h1 className="text-xl">Payment Mode</h1>
              <form onSubmit={handlePayment}>
                <Button
                  className="py-9 cursor-pointer border rounded-md border-black transition-opacity duration-200 ease-in  sm:opacity-80 hover:opacity-100"
                  variant={"show"}
                  type="submit"
                >
                  <img src="/esewa.png" alt="" className="max-w-30" />
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EsewaDialog;
