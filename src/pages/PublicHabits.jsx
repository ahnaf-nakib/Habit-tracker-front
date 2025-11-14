import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// Assuming API is imported from '../api/axiosInstance'
import API from '../api/axiosInstance'; 
import { Loader2 } from 'lucide-react'; 

function PublicHabits() {
    const [habits, setHabits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [error, setError] = useState(null);

    // --- 1. Fetching Logic (MongoDB API) ---
    const fetchHabits = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // ✅ CRITICAL FIX: Fetch all PUBLIC habits from MongoDB API (No token required)
            // Backend must have a public route like GET /public-habits that filters for isPublic: true
            const response = await API.get('/public-habits'); 
            
            // NOTE: No need for manual filtering here if the backend does it, 
            // but we filter one more time just in case.
            const publicHabits = response.data.filter(h => h.isPublic);

            setHabits(publicHabits); 
            
        } catch (error) {
            console.error("Error fetching public habits:", error);
            setError('Failed to load public habits. Check the API server status.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    // --- 2. Client-Side Filtering ---
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

    // --- Rendering Logic ---

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[80vh] bg-gray-900">
                <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
                <p className="text-gray-400 ml-3">Loading public habits...</p>
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
        <div className="min-h-screen bg-gray-900 text-white py-10 px-4 pt-24">
            <motion.div 
                className="max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h2 
                    variants={itemVariants} 
                    className="text-4xl font-extrabold mb-8 text-indigo-500 text-center"
                >
                    Browse Public Habits
                </motion.h2>
                
                {/* Search and Filter Inputs */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 mb-8 bg-gray-800 p-4 rounded-xl shadow-lg border border-indigo-900/50">
                    <input
                        type="text"
                        placeholder="Search by Habit Title..."
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150 placeholder-gray-400"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select
                        className="w-full md:w-auto px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150 appearance-none"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </motion.div>

                {filteredHabits.length === 0 ? (
                    <motion.p variants={itemVariants} className="text-center text-xl text-gray-400 mt-10 p-10 bg-gray-800 rounded-xl">
                        No public habits found matching your search.
                    </motion.p>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredHabits.map(h => (
                            <motion.div key={h._id} variants={itemVariants}>
                                <div className="card bg-gray-800 p-6 shadow-xl rounded-xl border border-gray-700 hover:shadow-indigo-500/30 transition duration-300">
                                    <h3 className="text-2xl font-bold mb-1 truncate text-white">{h.title}</h3>
                                    <p className="text-sm text-indigo-400 mb-3 uppercase tracking-wider">{h.category}</p>
                                    <p className="text-gray-400 mb-3">{h.description ? h.description.slice(0, 80) + '...' : 'No description.'}</p>
                                    <p className="text-xs text-gray-500 mb-4">Created by: <span className="font-semibold text-gray-300">{h.ownerName || 'Anonymous'}</span></p>
                                    
                                    <Link
                                        to={`/habit/${h._id}`}
                                        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg text-sm inline-block hover:bg-indigo-700 transition w-full text-center"
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