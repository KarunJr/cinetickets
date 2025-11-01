import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="rounded-full h-15 w-15 border-3 border-t-red-600 animate-spin"></div>
    </div>
  );
};

export default Loading;
