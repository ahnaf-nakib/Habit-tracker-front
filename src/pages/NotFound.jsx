// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-8xl font-extrabold mb-4 animate-bounce text-red-500">404</h1>
      <p className="text-2xl mb-6">Uh-oh! You got lost in the void 🌌</p>
      <p className="text-gray-400 mb-6 text-center max-w-md">
        Looks like this page went on vacation. Maybe it’s sipping coffee ☕ somewhere else!
      </p>
      <Link
        to="/"
        className="bg-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-700 transition transform hover:scale-105"
      >
        Take Me Home 🏠
      </Link>
    </div>
  );
}
