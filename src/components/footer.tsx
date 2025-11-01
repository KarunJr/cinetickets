import { font } from "@/lib/font";
import Link from "next/link";
import LinkedIn from "../../public/linkedin.svg"
import Image from "next/image";
const Footer = () => {
  return (
    <div
      className={`${font.className} mt-4 max-w-7xl mx-auto w-full px-4 sm:border-t-4 border-red-600`}
    >
      <div className="flex justify-between flex-col lg:flex-row gap-3 my-4">
        <div className="space-y-3">
          <h1 className="text-xl font-semibold">For Booking</h1>
          <div className="flex gap-3">
            <img src="/phone.svg" alt="phone" className="h-5 w-5" />
            <p className="text-xm font-normal"> +977-9840418283</p>
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-xl font-semibold">Quick Links</h1>
          <div className="flex flex-col font-normal">
            <Link
              href={"/"}
              className="hover:text-red-600 transition-colors ease-in duration-200"
            >
              About Us
            </Link>
            <Link
              href={"/"}
              className="hover:text-red-600 transition-colors ease-in duration-200"
            >
              Contact Us
            </Link>
            <Link
              href={"/"}
              className="hover:text-red-600 transition-colors ease-in duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href={"/"}
              className="hover:text-red-600 transition-colors ease-in duration-200"
            >
              Terms & Condition
            </Link>
            <Link
              href={"/"}
              className="hover:text-red-600 transition-colors ease-in duration-200"
            >
              Feedback
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-xl font-semibold">Payment Partner</h1>
          <div className="flex gap-4 items-center">
            <img src="/esewa.png" alt="esewa" className="w-26 h-10" />
            <img src="/khalti.png" alt="khalti" className="w-26 h-10" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-xl font-semibold">Connect with us</h1>
          <div className="flex gap-3">
            <Link
              href={"https://www.facebook.com/karun.ghimire.71"}
              target="_blank"
            >
              <Image src="/facebook.svg" height={100} width={100} alt="facebook" className="w-8 h-8" />
            </Link>
            <Link
              href={"https://www.instagram.com/_karunghimire_/"}
              target="_blank"
            >
              <Image src="/instagram.svg" height={100} width={100} alt="instagram" className="w-8 h-8" />
            </Link>
            <Link
              href={"https://www.linkedin.com/in/karun-ghimire/"}
              target="_blank"
            >
              <Image src="linkedin.svg" height={100} width={100} alt="linkedin" className="w-8 h-8" />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex justify-between pb-3 flex-col sm:flex-row gap-3">
        <p>
          Copyright &copy; 2019 - {new Date().getFullYear()} CineTickets-All
          Right Reserved.
        </p>
        <p>
          Software Partner{" "}
          <span className="cursor-pointer text-blue-400">
            KarunTech Solutions
          </span>
        </p>
      </div>
    </div>
  );
};

export default Footer;
