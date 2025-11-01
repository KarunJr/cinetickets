// Loader.jsx
import React from "react";

interface LoaderProps {
  loading: boolean;
}

const Loader = ({ loading }: LoaderProps) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-t-red-500 border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
