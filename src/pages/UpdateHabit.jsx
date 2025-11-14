// src/pages/UpdateHabit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../firebaseconfig";
import API from "../api/axiosInstance"; // Use your axios instance
import LoadingSpinner from "../components/LoadingSpinner"; // Spinner component

export default function UpdateHabit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const [habit, setHabit] = useState({
    title: "",
    desc: "",
    category: "Morning",
    reminder: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [newImage, setNewImage] = useState(null);

  // Fetch single habit
  useEffect(() => {
    const fetchHabit = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.get(`/habits/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHabit(res.data);
      } catch (error) {
        toast.error("Failed to load habit!");
      } finally {
        setLoading(false);
      }
    };

    fetchHabit();
  }, [id]);

  const handleChange = (e) => {
    const value = e.target.value;
    setHabit({ ...habit, [e.target.name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = await auth.currentUser.getIdToken();
      let payload;

      if (newImage) {
        payload = new FormData();
        payload.append("title", habit.title);
        payload.append("desc", habit.desc);
        payload.append("category", habit.category);
        payload.append("reminder", habit.reminder);
        payload.append("image", newImage);
      } else {
        payload = {
          title: habit.title,
          desc: habit.desc,
          category: habit.category,
          reminder: habit.reminder,
        };
      }

      await API.put(`/habits/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(newImage ? { "Content-Type": "multipart/form-data" } : {}),
        },
      });

      toast.success("Habit updated successfully!");
      navigate("/my-habits");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update habit!");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center py-10 px-4 pt-24">
      <div className="w-full max-w-lg bg-gray-800 rounded-xl shadow-2xl p-8 space-y-6 border border-indigo-900/50">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Update Habit</h2>

        {/* User Info */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          <input
            type="text"
            value={user?.displayName || "N/A"}
            readOnly
            className="w-full px-4 py-3 bg-gray-700 text-gray-400 rounded-lg border border-gray-600 cursor-not-allowed"
            placeholder="User Name"
          />
          <input
            type="email"
            value={user?.email || "N/A"}
            readOnly
            className="w-full px-4 py-3 bg-gray-700 text-gray-400 rounded-lg border border-gray-600 cursor-not-allowed"
            placeholder="User Email"
          />
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            name="title"
            value={habit.title}
            onChange={handleChange}
            placeholder="Habit Title"
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            required
          />

          {/* Description */}
          <textarea
            name="desc"
            value={habit.desc}
            onChange={handleChange}
            placeholder="Description"
            rows="3"
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
          />

          {/* Category & Reminder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="category"
              value={habit.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              <option value="Morning">Morning ☀️</option>
              <option value="Evening">Evening 🌙</option>
              <option value="Health">Health ❤️</option>
              <option value="Work">Work 💻</option>
              <option value="Study">Study 📚</option>
              <option value="Fitness">Fitness 💪</option>
            </select>
            <input
              type="time"
              name="reminder"
              value={habit.reminder}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Old Image */}
          {habit.image && (
            <div className="mt-4">
              <p className="text-gray-300 font-semibold mb-2">Old Image:</p>
              <img src={habit.image} alt="Old Habit" className="w-32 h-32 object-cover rounded-md" />
            </div>
          )}

          {/* Upload New Image */}
          <div>
            <label className="text-gray-300 font-semibold">Upload New Image (Optional)</label>
            <input
              type="file"
              onChange={(e) => setNewImage(e.target.files[0])}
              className="mt-1 w-full text-gray-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition mt-4"
          >
            Update Habit
          </button>
        </form>
      </div>
    </div>
  );
}
