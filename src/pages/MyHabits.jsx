import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Trash2, Edit, CheckCircle, ListChecks, X } from 'lucide-react';
import API from '../api/axiosInstance';
import { auth } from '../firebaseconfig';

const MyHabits = () => {
    const navigate = useNavigate();
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    // Fetch user habits
    const fetchHabits = async () => {
        setLoading(true);
        setError(null);
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                navigate("/login");
                return;
            }
            const token = await currentUser.getIdToken();

            const response = await API.get('/habits/mine', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHabits(response.data);
        } catch (err) {
            console.error(err);
            setError('লোড করতে ব্যর্থ। API সার্ভার নিশ্চিত করুন চলছে।');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) fetchHabits();
            else {
                setHabits([]);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // Mark habit as complete
    const handleComplete = async (id) => {
        try {
            const token = await auth.currentUser.getIdToken();
            await API.post(`/habits/complete/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchHabits();
            toast.success("Marked as complete for today!");
        } catch (err) {
            const message = err.response?.data?.message || "Failed to mark complete!";
            toast.error(message);
        }
    };

    // Delete habit
    const handleDelete = async () => {
        if (!confirmDeleteId) return;
        try {
            const token = await auth.currentUser.getIdToken();
            await API.delete(`/habits/${confirmDeleteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHabits(habits.filter(h => h._id !== confirmDeleteId));
            toast.success("Habit deleted successfully!");
        } catch (err) {
            toast.error("Failed to delete habit.");
            console.error(err);
        } finally {
            setConfirmDeleteId(null);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[80vh] bg-gray-900">
            <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
            <p className="text-gray-400 ml-3">Loading your habits...</p>
        </div>
    );

    if (error) return (
        <div className="text-center p-6 bg-red-800 border border-red-400 text-white rounded-lg max-w-xl mx-auto mt-16 shadow-2xl">
            <p className="font-bold mb-2">Error Loading Data</p>
            <p>{error}</p>
        </div>
    );

    if (habits.length === 0) return (
        <div className="text-center p-10 bg-gray-800 rounded-xl max-w-xl mx-auto mt-16 shadow-2xl border border-indigo-900/50">
            <h2 className="text-xl font-semibold text-white mb-3">No Habits Found!</h2>
            <p className="text-gray-400 mb-4">You haven't added any habits yet.</p>
            <Link to="/add-habit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition">
                Define Your First Habit
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 p-4 pt-16">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-white flex items-center">
                    <ListChecks className="w-6 h-6 mr-3 text-indigo-400" /> My Habits
                </h2>

                {/* Delete Modal */}
                {confirmDeleteId && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-red-500">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                                <X className="w-5 h-5 mr-2 text-red-500"/> Confirm Deletion
                            </h3>
                            <p className="text-gray-300 mb-6">Are you sure you want to delete this habit?</p>
                            <div className="flex justify-end space-x-4">
                                <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 text-gray-400 hover:text-white transition">Cancel</button>
                                <button onClick={handleDelete} className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition">Yes, Delete</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Habits Table */}
                <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-2xl border border-indigo-900/50">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Streak</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase hidden sm:table-cell">Created</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {habits.map(h => (
                                <tr key={h._id} className="hover:bg-gray-700 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{h.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-400">{h.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500 font-semibold">{h.currentStreak || (h.completionHistory?.length || 0)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden sm:table-cell">{new Date(h.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                                        <button className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition" onClick={() => handleComplete(h._id)} title="Mark Complete">
                                            <CheckCircle className="w-5 h-5"/>
                                        </button>
                                        <Link to={`/update-habit/${h._id}`} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition" title="Edit Habit">
                                            <Edit className="w-5 h-5"/>
                                        </Link>
                                        <button className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition" onClick={() => setConfirmDeleteId(h._id)} title="Delete Habit">
                                            <Trash2 className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyHabits;
