"use client";

import Link from "next/link";
import { font } from "@/lib/font";
import { motion, AnimatePresence } from "framer-motion";
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import UserStatus from "./user-log";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <nav
      className={`${font.className} p-4 fixed top-0 left-0 right-0 bg-white z-20 border-b-3 border-red-600`}
    >
      <div className="flex justify-between items-center">
        <Link href={"/"} className="text-2xl font-bold ">
          Cine<span className="text-3xl font-mono italic text-red-500">T</span>
          ickets
        </Link>

        <div className="flex lg:hidden items-center gap-3">
          <div className="flex lg:hidden">
            <UserStatus />
          </div>

          {isOpen ? (
            <div className="cursor-pointer lg:hidden">
              <Cross1Icon className="size-5" onClick={toggleMenu} />
            </div>
          ) : (
            <div className="cursor-pointer lg:hidden">
              <HamburgerMenuIcon className="size-5" onClick={toggleMenu} />
            </div>
          )}
        </div>

        {/* Mobile Design */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center items-center flex-col fixed top-15 left-0 overflow-y-hidden z-10 w-full gap-3 shadow-xl rounded-md pb-3 duration-500 bg-white font-semibold"
            >
              <Link
                href={"/"}
                onClick={() => {
                  setIsOpen(false);
                  scrollTo(0, 0);
                }}
                className={`${path === "/" ? "text-red-500" : "text-black"}`}
              >
                Home
              </Link>
              <Link
                href={"/movies"}
                onClick={() => {
                  setIsOpen(false);
                  scrollTo(0, 0);
                }}
                className={`${
                  path === "/movies" ? "text-red-500" : "text-black"
                }`}
              >
                Movies
              </Link>
              <Link
                href={"/favourites"}
                onClick={() => {
                  setIsOpen(false);
                  scrollTo(0, 0);
                }}
                className={`${
                  path === "/favourites" ? "text-red-500" : "text-black"
                }`}
              >
                Favourites
              </Link>
              <Link
                href={"/my-bookings"}
                onClick={() => {
                  setIsOpen(false);
                  scrollTo(0, 0);
                }}
                className={`${
                  path === "/my-bookings" ? "text-red-500" : "text-black"
                }`}
              >
                My Bookings
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Window Design */}
        <div className="lg:flex hidden justify-center gap-x-3 items-center font-semibold">
          <Link
            href={"/"}
            className={`hover:text-red-600 transition-colors ease-in duration-200 ${
              path === "/" ? "text-red-500" : "text-black"
            }`}
          >
            Home
          </Link>
          <Link
            href={"/movies"}
            className={`hover:text-red-600 transition-colors ease-in duration-200 ${
              path === "/movies" ? "text-red-500" : "text-black"
            }`}
          >
            Movies
          </Link>
          <Link
            href={"/favourites"}
            // className="hover:text-red-600 transition-colors ease-in duration-200"
            className={`hover:text-red-600 transition-colors ease-in duration-200 ${
              path === "/favourites" ? "text-red-500" : "text-black"
            }`}
          >
            Favourites
          </Link>
          <Link
            href={"/my-bookings"}
            // className="hover:text-red-600 transition-colors ease-in duration-200"
            className={`hover:text-red-600 transition-colors ease-in duration-200 ${
              path === "/my-bookings" ? "text-red-500" : "text-black"
            }`}
          >
            My Bookings
          </Link>
        </div>

        <div className="lg:flex hidden justify-end">
          <UserStatus />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
