import { Link } from "react-router-dom";

function HabitCard({ habit }) {
  return (
    <div className="card bg-white shadow-md rounded-lg p-4 hover:scale-105 transition-transform">
      <h3 className="text-xl font-bold mb-2">{habit.title}</h3>
      <p className="text-gray-600 mb-2">{habit.desc}</p>
      <p className="text-sm text-gray-400 mb-4">By: {habit.creator}</p>
      <Link to={`/habit/${habit.id}`} className="btn btn-primary btn-sm">View Details</Link>
    </div>
  );
}

export default HabitCard;
