import { PaymentInfoIF } from "../payment/SuccessResult";
import { Button } from "../ui/button";
import Link from "next/link";
import { font } from "@/lib/font";
import Image from "next/image";



interface PaymentStatusProps {
  heading: string;
  paymentInfo?: PaymentInfoIF;
  message: string;
  image: string;
  ticket: boolean;
}

const PaymentStatus = ({
  heading,
  paymentInfo,
  message,
  image,
  ticket,
}: PaymentStatusProps) => {
  return (
    <div
      className={`${font.className} min-h-screen flex items-center justify-center px-4 sm:px-0`}
    >
      <div className="border p-4 shadow-xl bg-white rounded-md space-y-3">
        <h1 className="font-bold my-4 text-center">{heading}</h1>
        {/* <img src={image} alt="" className="max-w-30 mx-auto" /> */}
        <div className="w-[120px] h-[120px] mx-auto relative">
          <Image
            src={image}
            alt={heading}
            fill
            className="object-contain"
            sizes="120px"
          />
        </div>
        <p className="text-sm text-center">{message}</p>

        {paymentInfo && (
          <div className="text-xs sm:text-base">
            <p>
              <strong>Transaction ID:</strong> {paymentInfo.transaction_code}
            </p>
            <p>
              <strong>Amount Paid:</strong> NPR {paymentInfo.total_amount}
            </p>
            <p>
              <strong>Booking Reference:</strong> {paymentInfo.transaction_uuid}
            </p>
          </div>
        )}

        {
          ticket ? (
            <div className="flex justify-center items-center flex-col space-y-3 my-4">
              <p>Download the ticket?</p>
              <Button
                variant={"show"}
                className="bg-green-600 hover:bg-green-700 transition-colors duration-200 ease-in"
              >
                <Link href={"/my-bookings"}>My Bookings</Link>
              </Button>
            </div>
          ) : (
            <div className="flex justify-center items-center flex-col space-y-3 my-4">
              <p>Please return to the homepage and try again.</p>
              <Button
                variant={"show"}
                className="bg-red-600 hover:bg-red-700 transition-colors duration-200 ease-in"
              >
                <Link href={"/"}>Home</Link>
              </Button>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default PaymentStatus;
