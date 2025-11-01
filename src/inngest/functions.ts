import { connectToDatabase } from "@/lib/db";
import { inngest } from "./client";
import Booking, { Status } from "@/models/booking.model";

export const autoCancelBooking = inngest.createFunction(
  { id: "auto-cancel-booking" },
  { event: "booking/auto-cancel" },

  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1 minute");
    const { transactionUuid } = event.data;

    await step.run("after-one-minute", async () => {
      await connectToDatabase();
      const booking = await Booking.findOne({ transactionUuid });

      if (booking && (booking.status === "PENDING" || booking.status === "FAILED")) {
        booking.status = Status.FAILED;
        await booking.save();

        console.log("Booking auto-cancelled!");
      }
    });
  }
);
