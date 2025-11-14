import { useState } from "react";
import { toast } from "react-toastify";
import API from "../api/axiosInstance"; // custom axios instance
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseconfig"; // ✅ Firebase Auth for live token

function AddHabit() {
    const navigate = useNavigate();

    // Get user info from Firebase (fallback to localStorage)
    const localUser = JSON.parse(localStorage.getItem("user"));
    
    const [habit, setHabit] = useState({
        title: "",
        desc: "",
        category: "Morning",
        reminder: "",
        image: "",
        isPublic: false,
    });

    const handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setHabit({ ...habit, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!habit.title || !habit.desc) {
            toast.error("Please fill all required fields!");
            return;
        }

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                toast.error("Session expired. Please login again.");
                navigate("/login");
                return;
            }

            const token = await currentUser.getIdToken();

            // Prepare payload
            const payload = {
                title: habit.title,
                description: habit.desc,
                category: habit.category,
                reminderTime: habit.reminder,
                imageUrl: habit.image,
                isPublic: habit.isPublic,
                ownerId: currentUser.uid,
                ownerName: currentUser.displayName || localUser?.displayName || "Anonymous",
                ownerEmail: currentUser.email || localUser?.email,
            };

            // Send POST request to backend
            await API.post("/habits", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Habit added successfully!");
            setHabit({
                title: "",
                desc: "",
                category: "Morning",
                reminder: "",
                image: "",
                isPublic: false,
            });

            navigate("/my-habits");
        } catch (err) {
            console.error("Add Habit Error:", err);
            toast.error(err.response?.data?.message || "Failed to add habit!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex justify-center py-10 px-4 pt-24">
            <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl p-8 space-y-6 border border-indigo-900/50">

                <h2 className="text-3xl font-bold mb-6 text-white text-center">Add A New Habit</h2>
                <p className="text-gray-400 text-center">Define your new goal and start tracking immediately.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <input
                        type="text"
                        name="title"
                        value={habit.title}
                        onChange={handleChange}
                        placeholder="Habit Title"
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition placeholder-gray-400"
                        required
                    />

                    {/* Description */}
                    <textarea
                        name="desc"
                        value={habit.desc}
                        onChange={handleChange}
                        placeholder="Description"
                        rows="3"
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition placeholder-gray-400 resize-none"
                        required
                    ></textarea>

                    {/* Category & Reminder */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            name="category"
                            value={habit.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition appearance-none"
                        >
                            <option value="Morning">Morning ☀️</option>
                            <option value="Work">Work 💻</option>
                            <option value="Fitness">Fitness 💪</option>
                            <option value="Evening">Evening 🌙</option>
                            <option value="Study">Study 📚</option>
                            <option value="Health">Health ❤️</option>
                        </select>

                        <input
                            type="time"
                            name="reminder"
                            value={habit.reminder}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition placeholder-gray-400"
                        />
                    </div>

                    {/* Image URL */}
                    <input
                        type="text"
                        name="image"
                        value={habit.image}
                        onChange={handleChange}
                        placeholder="Image URL (optional)"
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition placeholder-gray-400"
                    />

                    {/* Make Public */}
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            name="isPublic"
                            checked={habit.isPublic}
                            onChange={handleChange}
                            id="isPublicCheck"
                            className="w-5 h-5 text-indigo-500 bg-gray-700 rounded border-gray-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="isPublicCheck" className="text-gray-300">
                            Share with the community
                        </label>
                    </div>

                    {/* User Info (Read-only) */}
                    <div className="pt-2">
                        <p className="text-sm font-semibold text-white mb-2 border-b border-gray-700 pb-1">User Details</p>
                    </div>

                    <input
                        type="text"
                        value={localUser?.displayName || auth.currentUser?.displayName || "N/A"}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-700 text-gray-400 rounded-lg border border-gray-600 cursor-not-allowed"
                    />
                    <input
                        type="email"
                        value={localUser?.email || auth.currentUser?.email || "N/A"}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-700 text-gray-400 rounded-lg border border-gray-600 cursor-not-allowed"
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-xl hover:bg-indigo-700 transition mt-6"
                    >
                        Define & Add Habit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddHabit;
