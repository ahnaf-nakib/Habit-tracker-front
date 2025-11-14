// src/components/HabitCard.jsx
import { Link } from "react-router-dom";

function HabitCard({ habit }) {
  return (
    <div className="bg-gray-800 text-white shadow-lg rounded-xl p-5 hover:scale-105 transition-transform duration-300 border border-indigo-900/50">
      <h3 className="text-2xl font-bold mb-2 text-indigo-400">{habit.title}</h3>
      <p className="text-gray-300 mb-3">{habit.desc}</p>
      <p className="text-sm text-gray-400 mb-4">By: {habit.creator || "Anonymous"}</p>
      <Link
        to={`/habit/${habit.id}`}
        className="inline-block bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-semibold py-2 px-4 rounded-lg"
      >
        View Details
      </Link>
    </div>
  );
}

export default HabitCard;
