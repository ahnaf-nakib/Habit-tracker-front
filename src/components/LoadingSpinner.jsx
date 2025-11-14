// src/components/LoadingSpinner.jsx
import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Loader2 className="animate-spin text-indigo-500 w-12 h-12 mb-4" />
      <span className="text-white text-lg animate-pulse">Loading...</span>
    </div>
  );
}
