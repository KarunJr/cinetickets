import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createBooking } from "@/lib/controllers/booking.controller";
import type { Session } from "next-auth";
import { redis } from "@/lib/redis";
// Route to create booking by the user

export async function POST(req: Request) {
  try {
    const session: Session | null = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorzied!" }, { status: 401 });
    }
    const { showId, selectedSeats, transactionUuid, amount } = await req.json();
    if (!showId || !selectedSeats?.length || !transactionUuid || !amount) {
      return NextResponse.json(
        { success: false, message: "Missing required fields!" },
        { status: 400 }
      );
    }
    console.log("Requested value are: ", {
      showId,
      selectedSeats,
      transactionUuid,
      amount,
    });
    console.log("Selected seats are:", selectedSeats);

    // Check seats selected by user are locked by him or not?
    for (const seat of selectedSeats) {
      const key = await redis.get(`show:${showId}:seat:${seat}`);

      if (key !== session.user.id) {
        return NextResponse.json(
          { success: false, message: "Seat doesn't belongs to you" },
          { status: 401 }
        );
      }
    }
    const result = await createBooking({
      session,
      showId,
      selectedSeats,
      transactionUuid,
      amount,
    });

    if (result.success) {
      return NextResponse.json(
        { success: true, message: result.message },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.log("POST error in /api/bookings/create: ", error);
    const message = error instanceof Error ? error.message : "Internal server error!";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

/*
export async function POST(req: Request) {
  try {
    const session: Session | null = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized!" },
        { status: 401 }
      );
    }

    const { showId, selectedSeats, amount, transactionId } = await req.json();

    if (!showId || !selectedSeats.length || !amount || !transactionId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields!" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const isAvailable = await checkSeatAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return { success: false, message: "Selected seats are not available!" };
    }

    const showDetails = await Show.findById(showId).populate("movie");
    if (!showDetails) {
      return { success: false, message: "No shows found" };
    }

    const transactionUuid = `${Date.now()}-${uuidv4()}`;

    const esewaConfig = {
      amount,
      tax_amount: "0",
      total_amount: amount,
      transaction_uuid: transactionUuid,
      product_code: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE!,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };
  } catch (error) {}
}
*/
