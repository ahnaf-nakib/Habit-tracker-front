import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axiosInstance";
import { auth } from "../firebaseconfig";

function HabitDetails() {
  const { id } = useParams();
  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // --- Step 1: Fetch single habit from backend
  const fetchHabit = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      const res = await API.get(`/habits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHabit(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load habit!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabit();
  }, [id]);

  // --- Step 2: Handle Mark Complete
  const handleComplete = async () => {
    if (!habit) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyCompleted = habit.completionHistory?.some((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });

    if (alreadyCompleted) {
      toast.error("Already marked today!");
      return;
    }

    try {
      setUpdating(true);
      const token = await auth.currentUser.getIdToken();

      const res = await API.post(
        `/habits/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHabit(res.data); // Update local state instantly
      toast.success("Marked as complete for today!");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to mark complete!";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!habit) return <p className="text-center mt-10">Habit not found</p>;

  // --- Step 3: Calculate progress for last 30 days ---
  const today = new Date();
  const last30Days = [...Array(30)].map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  });

  const completedDates = habit.completionHistory?.map((d) => new Date(d).setHours(0, 0, 0, 0)) || [];
  const completedLast30 = completedDates.filter((d) => last30Days.includes(d)).length;
  const progress = Math.min(100, Math.round((completedLast30 / 30) * 100));

  return (
    <div className="max-w-2xl mx-auto mt-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">{habit.title}</h2>
      <p className="mb-2">{habit.desc}</p>
      <p className="mb-2 font-semibold">Category: {habit.category}</p>
      <p className="mb-2 font-semibold">Creator: {habit.ownerName || habit.ownerEmail}</p>

      {habit.image && (
        <img src={habit.image} alt={habit.title} className="w-full max-w-xs rounded-md mb-4" />
      )}

      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className="bg-green-500 h-4 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-sm text-gray-600 mb-4 block">{progress}% completed in last 30 days</span>

      <button
        onClick={handleComplete}
        disabled={updating}
        className="w-full bg-blue-600 text-white py-2 rounded-md mt-2 font-bold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {updating ? "Updating..." : "Mark Complete"}
      </button>

      <div className="mt-4">
        <span className="text-sm text-gray-500">Current Streak: {habit.currentStreak || 0} days</span>
      </div>
    </div>
  );
}

export default HabitDetails;
