"use client";

import PaymentStatus from "@/components/movie-section/PaymentStatus";
import { useEffect } from "react";

export interface PaymentInfoIF {
  product_code: string;
  signature: string;
  signed_field_names: string;
  status: string;
  total_amount: string;
  transaction_code: string;
  transaction_uuid: string;
}

const SuccessResult = ({ paymentInfo }: { paymentInfo: PaymentInfoIF }) => {

  useEffect(() => {
    if (!(paymentInfo && paymentInfo.transaction_code)) return;
    (async () => {
      await fetch("/api/payment/verify-success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_uuid: paymentInfo?.transaction_uuid }),
      });
    })();
  }, [paymentInfo]);
  
  return (
    <div>
      <PaymentStatus
        heading="Payment Successfull!"
        image="/success.jpg"
        message="Thank you for your purchase. Your tickets have been booked successfully."
        ticket={true}
        paymentInfo={paymentInfo}
      />
    </div>
  );
};

export default SuccessResult;
