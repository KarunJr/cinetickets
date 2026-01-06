import { Types } from "mongoose";
import { connectToDatabase } from "../db";
import Show from "@/models/show.model";
import "@/models/movie.model";
import Booking, { IBookingSchema, Status } from "@/models/booking.model";
import { Session } from "next-auth";
import { DefaultReturn } from "./admin.controller";
import { inngest } from "@/inngest/client";

export const checkSeatAvailability = async (
  showId: Types.ObjectId,
  selectedSeats: string[]
) => {
  try {
    await connectToDatabase();
    const showData = await Show.findById(showId);

    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats;

    const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat]);

    return !isAnySeatTaken;
  } catch (error) {
    console.error("Error in checkSeatAvailability():", error);
    return false;
  }
};

interface CreateBookingParams {
  session: Session;
  showId: Types.ObjectId;
  selectedSeats: string[];
  transactionUuid: string;
  amount: number;
}

interface CreateBookingReturn {
  success: boolean;
  message: string;
  // booking?: IBookingSchema;
}
export const createBooking = async ({
  session,
  showId,
  selectedSeats,
  transactionUuid,
  amount,
}: CreateBookingParams): Promise<CreateBookingReturn> => {
  try {
    await connectToDatabase();

    //Check if the seat is available for the selected show
    const isAvailable = await checkSeatAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return { success: false, message: "Selected seats are not available!" };
    }

    const showDetails = await Show.findById(showId).populate("movie");

    if (!showDetails) {
      return { success: false, message: "No movie was found" };
    }

    await Booking.create({
      user: session.user.id,
      show: showId,
      amount: amount,
      bookedSeats: selectedSeats,
      status: Status.PENDING,
      transactionUuid: transactionUuid,
    });

    await inngest.send({
      name: "booking/auto-cancel",
      data: { transactionUuid },
    });
    // selectedSeats.map((seat) => {
    //   showDetails.occupiedSeats[seat] = session.user.id
    // });

    // showDetails.markModified("occupiedSeats");

    // await showDetails.save();

    return { success: true, message: "Booked successfully!" };
    // return { success: true, message: "Seat locked!", booking };
  } catch (error: unknown) {
    console.error("Error in createBooking():", error);
    const message =
      error instanceof Error ? error.message : "Soemthing went wrong!";
    return {
      success: false,
      message,
    };
  }
};

interface GetOccupiedSeatsReturn extends CreateBookingReturn {
  occupiedSeats?: string[];
  showPrice?: number;
}

export const getOccupiedSeats = async (
  showId: string
): Promise<GetOccupiedSeatsReturn> => {
  try {
    await connectToDatabase();

    const show = await Show.findById(showId);

    if (!show?.occupiedSeats || Object.keys(show.occupiedSeats).length === 0) {
      return {
        success: false,
        message: "No seats occupied for this show",
        showPrice: show?.showPrice,
      };
    }
    const occupiedSeats = Object.keys(show?.occupiedSeats);

    return {
      success: true,
      message: "Occupied seats fetch successfully",
      occupiedSeats,
      showPrice: show.showPrice,
    };
  } catch (error: unknown) {
    console.error("Error in getOccupiedSeats():", error);
    const message =
      error instanceof Error ? error.message : "Soemthing went wrong!";
    return {
      success: false,
      message,
    };
  }
};

interface GetUserBookingsReturn extends DefaultReturn {
  bookings?: IBookingSchema[];
}
export const getUserBookings = async (
  session: Session | null
): Promise<GetUserBookingsReturn> => {
  try {
    await connectToDatabase();

    const bookings = await Booking.find({ user: session?.user.id })
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    if (bookings.length === 0) {
      return {
        success: false,
        message: "No bookings yet!",
      };
    }

    return {
      success: true,
      message: "All the booking made by user are fetched.",
      bookings,
    };
  } catch (error: unknown) {
    console.error("Error in getUserBookings(): ", error);
    const message =
      error instanceof Error ? error.message : "Soemthing went wrong!";
    return {
      success: false,
      message,
    };
  }
};

/*
// Seat Locked Function
    const now = Date.now();

    for (const seat of selectedSeats) {
      const info = showDetails.occupiedSeats[seat];
      if (info?.status === "BOOKED")
        return { success: false, message: `Seat ${seat} already booked!` };

      if (info?.status === "LOCKED" && info.expireAt!.getTime() > now)
        return { success: false, message: `Seat ${seat} temporarily locked!` };
    }

    const lockExpiry = new Date(now + 10 * 60 * 1000); // 10min
    selectedSeats.forEach((seat) => {
      showDetails.occupiedSeats[seat] = {
        user: session.user.id,
        status: SeatStatus.LOCKED,
        expireAt: lockExpiry,
      };
    });

    showDetails.markModified("occupiedSeats");
    await showDetails.save();
*/
