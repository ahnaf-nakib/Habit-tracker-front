// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

// **********************************
// 💡 Hero Banner Data
// **********************************
const SLIDES = [
    { title: "Start Small, Win Big", subtitle: "Tiny habits lead to massive results.", color: "bg-teal-500" },
    { title: "Consistency is Key", subtitle: "Master the repetition, not the perfection.", color: "bg-indigo-500" },
    { title: "Track Your Progress", subtitle: "If you can measure it, you can improve it.", color: "bg-fuchsia-500" },
];

// **********************************
// 💡 Simple Carousel Component
// **********************************
const Carousel = ({ slides }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const slide = slides[current];

    return (
        <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`py-24 px-4 text-center text-white ${slide.color} transition-colors duration-500 rounded-b-3xl`}
        >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{slide.title}</h1>
            <p className="text-xl mb-6">{slide.subtitle}</p>
            <Link
                to="/add-habit"
                className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
            >
                Start Tracking Now
            </Link>
        </motion.div>
    );
};

function Home() {
    const [featured, setFeatured] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPublic = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/public-habits`);
                setFeatured(res.data.slice(0, 6)); // First 6 newest
            } catch (error) {
                console.error("Error loading public habits:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPublic();
    }, []);

    const viewPortAnimation = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        viewport: { once: true, amount: 0.2 },
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen">

            {/* Hero Banner */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Carousel slides={SLIDES} />
            </motion.div>

            {/* Featured Public Habits */}
            <motion.div {...viewPortAnimation} className="max-w-6xl mx-auto pt-16 grid md:grid-cols-3 gap-6 px-4">
                <h2 className="md:col-span-3 text-3xl font-bold mb-6 text-center text-indigo-500">
                    🔥 Featured Public Habits
                </h2>

                {isLoading ? (
                    <LoadingSpinner />
                ) : featured.length === 0 ? (
                    <p className="md:col-span-3 text-center text-lg text-gray-300">No public habits found.</p>
                ) : (
                    featured.map(h => (
                        <div
                            key={h._id}
                            className="bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-xl border border-indigo-900/50 transition duration-300"
                        >
                            <h3 className="text-xl font-semibold mb-1 truncate text-indigo-400">{h.title}</h3>
                            <p className="text-gray-300 mb-2 text-sm">{h.desc ? h.desc.slice(0, 70) + "..." : "No description."}</p>
                            <p className="text-xs text-gray-500 mb-2">
                                Created by: <span className="font-medium text-indigo-400">{h.ownerName || "Unknown"}</span>
                            </p>
                            <Link
                                to={`/habit/${h._id}`}
                                className="inline-block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-indigo-500 transition"
                            >
                                View Details
                            </Link>
                        </div>
                    ))
                )}
            </motion.div>

            <hr className="my-16 border-gray-700" />

            {/* Why Build Habits */}
            <motion.div {...viewPortAnimation} className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center text-indigo-400">✨ Why Build Habits?</h2>
                <div className="grid md:grid-cols-4 gap-6">
                    {["Better Focus", "Reduced Stress", "Growth Mindset", "Healthy Lifestyle"].map((title, i) => (
                        <motion.div
                            key={i}
                            {...viewPortAnimation}
                            transition={{ delay: 0.1 * i }}
                            className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition text-center border border-indigo-500/30"
                        >
                            <p className="text-3xl mb-2 text-indigo-400">✨</p>
                            <p className="font-bold text-xl mb-1">{title}</p>
                            <p className="text-gray-400 text-sm">Small habits create big results.</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <div className="h-20"></div>
        </div>
    );
}

export default Home;
