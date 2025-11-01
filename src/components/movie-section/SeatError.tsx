import { font } from "@/lib/font";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ErrorPng from "../../../public/error.jpg";
import Image from "next/image";
interface SeatErrorProps {
  message: string;
  onClose: () => void;
  open?: boolean;
}
const SeatError = ({ message, onClose, open = true }: SeatErrorProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`${font.className}`}>
        <DialogHeader>
          <DialogTitle className="sr-only">Sorry!</DialogTitle>
        </DialogHeader>
        <div>
          <Image
            src={ErrorPng}
            alt="Error"
            height={200}
            width={200}
            className="mx-auto"
          />
        </div>
        <div className={`${font.className} my-3 space-y-3`}>
          <h1 className="font-semibold text-xm text-center">
            Sorry! Something is not right.
          </h1>
          <p className="font-normal text-gray-400 text-xs text-center">
            {message}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SeatError;
