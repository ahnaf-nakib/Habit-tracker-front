// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseconfig";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => setUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-indigo-500 hover:text-indigo-400 transition-colors duration-200"
          >
            HabitTracker
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-6 text-base">
            <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
            <Link to="/public-habits" className="hover:text-indigo-400 transition-colors">Browse Public</Link>
            {user && (
              <>
                <Link to="/add-habit" className="hover:text-indigo-400 transition-colors">Add Habit</Link>
                <Link to="/my-habits" className="hover:text-indigo-400 transition-colors">My Habits</Link>
              </>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 font-semibold text-sm text-indigo-300 hover:text-indigo-400 transition-colors">
                  <span className="truncate max-w-[120px]">{user.displayName || user.email}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-3 w-48 bg-gray-800 rounded-lg shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-50">
                  <span className="block px-4 py-2 text-sm text-gray-400 border-b border-gray-700 truncate">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex space-x-3">
                <Link
                  to="/login"
                  className="px-3 py-1 border border-indigo-500 text-indigo-300 rounded-lg hover:bg-indigo-500 hover:text-white transition-all duration-300 text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all duration-300 text-sm"
                >
                  Signup
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              className="sm:hidden p-2 rounded-md hover:bg-gray-700 transition"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-4 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-md text-white hover:bg-indigo-600 transition">Home</Link>
            <Link to="/public-habits" className="block px-3 py-2 rounded-md text-white hover:bg-indigo-600 transition">Browse Public</Link>
            {user && (
              <>
                <Link to="/add-habit" className="block px-3 py-2 rounded-md text-white hover:bg-indigo-600 transition">Add Habit</Link>
                <Link to="/my-habits" className="block px-3 py-2 rounded-md text-white hover:bg-indigo-600 transition">My Habits</Link>
              </>
            )}
            {!user && (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-indigo-300 hover:bg-indigo-600 hover:text-white transition">Login</Link>
                <Link to="/signup" className="block px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition">Signup</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
