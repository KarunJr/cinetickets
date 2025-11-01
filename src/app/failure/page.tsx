import { auth } from "@/auth";
import PaymentStatus from "@/components/movie-section/PaymentStatus";
import { connectToDatabase } from "@/lib/db";
import { redis } from "@/lib/redis";
import Booking, { Status } from "@/models/booking.model";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export default async function FailurePage({ searchParams }: { searchParams: Promise<{ reason?: string, tuuid: string }> }) {
  const param = await searchParams;
  const reason = param.reason
  console.log("Reason is:", reason);

  const user: Session | null = await auth();
  if (!param.tuuid) {
    redirect("/")
  }
  await connectToDatabase();

  const booking = await Booking.findOne({
    transactionUuid: param.tuuid,
    status: Status.PENDING,
    user: user?.user.id
  })

  if (!booking) redirect("/");

  if (reason === "session_expired" || "session_taken") {
    booking.status = Status.LATE_PAYMENT
    await booking.save();
  } else {
    booking.status = Status.FAILED
    await booking.deleteOne()
  }

  for (const seat of booking.bookedSeats) {
    const lockedBy = `show:${booking.show}:seat:${seat}`;

    if (lockedBy === user?.user.id) {
      await redis.del(`show:${booking.show}:seat:${seat}`);
    }
  }

  return (
    <div>
      {
        reason === "session_expired" || "session_taken" ? (
          <PaymentStatus
            heading="Session Expired"
            message="It seems your payment was made after the session expired. We’ll verify and refund if applicable. Thank you for your patience."
            image="/failure.jpg"
            ticket={false}
          />
        ) : (
          <PaymentStatus
            heading="Payment Unsuccessful"
            message="Oops! Your payment could not be processed. Please try again or contact support if the issue persists."
            image="/failure.jpg"
            ticket={false}
          />
        )
      }
      {/* <PaymentStatus
        heading="Payment Unsuccessful"
        message="Oops! Your payment could not be processed. Please try again or contact support if the issue persists."
        image="/failure.jpg"
        ticket={false}
      /> */}

    </div>
  )
}