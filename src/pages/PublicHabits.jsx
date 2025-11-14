import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axiosInstance';
import { Loader2 } from 'lucide-react';

function PublicHabits() {
    const [habits, setHabits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [error, setError] = useState(null);

    const fetchHabits = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await API.get('/public-habits');
            const publicHabits = response.data.filter(h => h.isPublic);
            // Sort newest first
            setHabits(publicHabits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error(err);
            setError("Failed to load public habits. Please check the server.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const filteredHabits = habits.filter(h =>
        h.title.toLowerCase().includes(search.toLowerCase()) &&
        (category ? h.category === category : true)
    );

    const categories = ["Morning", "Work", "Fitness", "Evening", "Study", "Health"];

    // Framer Motion Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-[80vh] bg-gray-900">
                <Loader2 className="animate-spin text-indigo-500 w-12 h-12 mb-4" />
                <p className="text-gray-400 text-lg">Loading public habits...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6 bg-red-800 border border-red-400 text-white rounded-lg max-w-xl mx-auto mt-16 shadow-2xl">
                <p className="font-bold mb-2">Error Loading Data</p>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white py-10 px-4 sm:px-6 lg:px-12 pt-24">
            <motion.div 
                className="max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h2 
                    variants={itemVariants} 
                    className="text-3xl sm:text-4xl font-extrabold mb-8 text-indigo-500 text-center"
                >
                    Browse Public Habits
                </motion.h2>

                {/* Search & Filter */}
                <motion.div 
                    variants={itemVariants} 
                    className="flex flex-col sm:flex-row gap-4 mb-8 bg-gray-800 p-4 rounded-xl shadow-lg border border-indigo-900/50"
                >
                    <input
                        type="text"
                        placeholder="Search by Habit Title..."
                        className="w-full sm:flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150 placeholder-gray-400"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select
                        className="w-full sm:w-auto px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150 appearance-none"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </motion.div>

                {/* Habits Grid */}
                {filteredHabits.length === 0 ? (
                    <motion.p 
                        variants={itemVariants} 
                        className="text-center text-lg text-gray-400 mt-10 p-6 bg-gray-800 rounded-xl"
                    >
                        No public habits found matching your search.
                    </motion.p>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredHabits.map(h => (
                            <motion.div key={h._id} variants={itemVariants}>
                                <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 hover:shadow-indigo-500/50 hover:scale-105 transform transition duration-300">
                                    <h3 className="text-xl sm:text-2xl font-bold mb-2 truncate text-white">{h.title}</h3>
                                    <p className="text-sm sm:text-base text-indigo-400 mb-2 uppercase tracking-wide">{h.category}</p>
                                    <p className="text-gray-300 mb-3">{h.description ? h.description.slice(0, 100) + '...' : 'No description.'}</p>
                                    <p className="text-xs sm:text-sm text-gray-500 mb-4">
                                        Created by: <span className="font-semibold text-gray-300">{h.ownerName || 'Anonymous'}</span>
                                    </p>
                                    <Link
                                        to={`/habit/${h._id}`}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm sm:text-base w-full text-center inline-block transition"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

export default PublicHabits;
