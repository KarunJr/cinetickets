import Booking, { IBookingSchema } from "@/models/booking.model";
import Show, { IShow } from "@/models/show.model";
import "@/models/movie.model";
import User from "@/models/user.model";
import { connectToDatabase } from "../db";

export interface DefaultReturn {
  success: boolean;
  message: string;
}

//API to get Admin Dashboard Data
interface DashboardData {
  totalBookings: number;
  totalRevenue: number;
  activeShows: IShow[];
  totalUser: number;
}

interface GetDashboardDataReturn extends DefaultReturn {
  dashboardData?: DashboardData;
}
export const getDashboardData = async (): Promise<GetDashboardDataReturn> => {
  try {
    await connectToDatabase();

    const bookings = await Booking.find({ status: "COMPLETE" });
    const activeShows = await Show.find({
      showDateTime: { $gte: new Date() },
    })
      .populate("movie")
      .sort({ showDateTime: 1 });

    const totalUser = await User.countDocuments();

    const dashboardData: DashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows,
      totalUser,
    };

    return { success: true, message: "Data received", dashboardData };
  } catch (error: any) {
    console.log("Error in getDashboardData():", error);
    return {
      success: false,
      message: error.message || "Something went wrong!",
    };
  }
};

// API to get all shows
interface GetAllShowsReturn extends DefaultReturn {
  shows?: IShow[];
}
export const getAllShows = async (): Promise<GetAllShowsReturn> => {
  try {
    await connectToDatabase();
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    return {
      success: true,
      message: "All movie fetched",
      // shows: shows
      shows,
    };
  } catch (error: any) {
    console.error("Error in admin getAllShows(): ", error);
    return {
      success: false,
      message: error.message || "Something went wrong!",
    };
  }
};

//API to get all bookings:
interface GetAllBookings extends DefaultReturn {
  bookings?: IBookingSchema[];
}
export const getAllBookings = async (): Promise<GetAllBookings> => {
  try {
    await connectToDatabase();
    const bookings = await Booking.find({})
      .populate("user")
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
      message: "All booking are fetched",
      bookings: bookings,
    };
  } catch (error: any) {
    console.error("Error in admin getAllBookings(): ", error);
    return {
      success: false,
      message: error.message || "Something went wrong!",
    };
  }
};
