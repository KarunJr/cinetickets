import { redirect } from "next/navigation";
import { PaymentInfoIF } from "@/components/payment/SuccessResult";
import { connectToDatabase } from "@/lib/db";
import Booking, { Status } from "@/models/booking.model";
import Show from "@/models/show.model";
import { redis } from "@/lib/redis";
import PaymentStatus from "@/components/movie-section/PaymentStatus";
import { auth } from "@/auth";


export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ data?: string }> }) {
  const params = await searchParams
  const user = await auth();
  let paymentInfo: PaymentInfoIF

  if (!params.data) redirect("/")

  try {
    paymentInfo = await JSON.parse(atob(params.data));
  } catch (err) {
    console.error("Invalid Esewa data:", err);
    redirect("/"); // redirect if user tampered with URL
  }

  if (paymentInfo && paymentInfo.transaction_uuid) {

    await connectToDatabase();

    const booking = await Booking.findOne({
      transactionUuid: paymentInfo.transaction_uuid,
      user: user?.user.id,
      status: Status.PENDING
    })

    if (!booking) {
      return redirect("/")
    }

    const show = await Show.findById(booking?.show)
    if (!show) {
      return redirect("/")
    }

    // Check the user pays the amount within the sessison:
    for (const seat of booking.bookedSeats) {
      const lockedBy = await redis.get(`show:${booking.show}:seat:${seat}`)
      console.log("Locked By:", lockedBy);

      if (!lockedBy) {
        booking.status = Status.LATE_PAYMENT
        await show.save();
        return redirect(`/failure?reason=session_expired&tuuid=${paymentInfo.transaction_uuid}`)
      }

      if (lockedBy !== user?.user.id) {
        booking.status = Status.LATE_PAYMENT
        await show.save();
        return redirect(`/failure?reason=session_taken&tuuid=${paymentInfo.transaction_uuid}`)
      }
    }

    booking.bookedSeats.forEach((seat) => {
      show.occupiedSeats[seat] = booking.user.toString();
    })

    show.markModified("occupiedSeats")

    await show.save();

    booking.status = Status.COMPLETE

    await booking.save();

    for (const seat of booking.bookedSeats) {
      const lockedBy = `show:${booking.show}:seat:${seat}`;
      if (lockedBy === user?.user.id) {
        await redis.del(`show:${booking.show}:seat:${seat}`);
      }
    }
  }


  return (
    <PaymentStatus
      paymentInfo={paymentInfo}
      heading="Payment Successfull!"
      image="/success.jpg"
      message="Thank you for your purchase. Your tickets have been booked successfully."
      ticket={true} />
  )
}