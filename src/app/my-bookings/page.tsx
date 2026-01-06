import { Metadata } from "next";
import BookingDetails from "@/components/movie-section/MyBooking";

export const metadata: Metadata = {
  title: "My Bookings - CineTickets",
  description: "View and manage all your movie ticket bookings in one place.",
};

const BookingsPage = () => {
  return (
    <div>
      <BookingDetails />
    </div>
  );
};

export default BookingsPage;
