// src/components/LoadingSpinner.jsx
import React from "react";
import { Loader2 } from "lucide-react"; // আপনি ইতিমধ্যেই lucide-react install করেছেন

export default function LoadingSpinner() {
  return (
    <div className="min-h-[60vh] flex justify-center items-center bg-gray-900">
      <Loader2 className="animate-spin text-indigo-500 w-10 h-10 mr-3" />
      <span className="text-white text-lg">Loading...</span>
    </div>
  );
}
