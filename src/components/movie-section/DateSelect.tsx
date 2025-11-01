import { dummyDateTimeData } from "@/assets/assets";
import { font } from "@/lib/font";
import { ParamValue } from "next/dist/server/request/params";
import { Button } from "../ui/button";
import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loading from "../loading";

interface showTime {
  time: string;
  showId: string;
}

export interface DateTimeData {
  [date: string]: showTime[];
}

interface DateSelectProps {
  date: DateTimeData;
  id: ParamValue;
}

const DateSelect = ({ date, id }: DateSelectProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const bookHandler = () => {
    if (!selected) {
      return toast.warning("Please select the date!");
    }
    router.push(`/movies/${id}/${selected}`);
  };
  return (
    <div
      id="dateSelect"
      className=" p-2 border-3 rounded border-emerald-300 w-ful shadow-xl mt-10"
    >
      <div
        className={`${font.className} flex gap-3 flex-col md:flex-row justify-between items-center`}
      >
        <div className="flex flex-col gap-3 px-4">
          <h1 className="font-semibold text-xm">Choose Date</h1>
          <div className="flex items-center gap-3">
            <ChevronLeftIcon className="cursor-pointer" />
            <span className="flex flex-row gap-3">
              {Object.entries(date).map(([day, time]) => (
                <button
                  className={`flex flex-col text-xm p-2 px-4 cursor-pointer rounded-md transform transition-transform duration-200 ease-linear hover:-translate-y-1 ${
                    selected === day ? "bg-red-500 text-white" : "border"
                  }`}
                  onClick={() => setSelected(selected === day ? null : day)}
                  key={day}
                >
                  <span>{new Date(day).getDate()}</span>
                  <span>
                    {new Date(day).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </span>
                </button>
              ))}
            </span>
            <ChevronRightIcon className="cursor-pointer" />
          </div>
        </div>

        <div className="px-4">
          <Button
            className="bg-red-500 cursor-pointer hover:bg-red-600 transition-colors ease-in duration-300 text-white"
            variant={"show"}
            onClick={bookHandler}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateSelect;
