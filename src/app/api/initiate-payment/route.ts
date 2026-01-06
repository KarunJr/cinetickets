"use server";
import { generateEsewaSignature } from "@/lib/generate-signature";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const { amount, transactionUuid, showId, userId, seats } = await req.json();

    if (!amount || !transactionUuid || !showId || !userId || !seats) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    for (const seat of seats) {
      const key = await redis.get(`show:${showId}:seat:${seat}`);

      if (key !== userId) {
        return NextResponse.json({
          success: false,
          message:
            "Sorry! Some of your selected seats are no longer available. Please select new seats to continue. (#50)",
        });
      }
    }
    const esewaConfig = {
      amount,
      tax_amount: "0",
      total_amount: amount,
      transaction_uuid: transactionUuid,
      product_code: process.env.ESEWA_MERCHANT_CODE!,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/failure?reason=payment_failed&tuuid=${transactionUuid}`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;

    const secretKey = process.env.ESEWA_SECRET_KEY!;
    const signature = await generateEsewaSignature(signatureString, secretKey);
    const response = NextResponse.json(
      {
        success: true,
        esewaConfig: { ...esewaConfig, signature },
      },
      { status: 200 }
    );

    return response;
  } catch (error: unknown) {
    console.error("POST error in /api/initiate-payment:", error);
    const message = error instanceof Error ? error.message : "Internal server error!";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
