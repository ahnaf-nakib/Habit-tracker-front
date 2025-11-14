import { Link } from "react-router-dom";
// For icons, we'll assume Font Awesome is available or use simple emojis/SVGs
// We'll use simple text links for social media here.

function Footer() {
    // Helper function for the current year
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 border-t border-indigo-600/30 pt-12 pb-8 shadow-2xl mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Main Grid Layout for Footer Sections */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-gray-700 pb-10">
                    
                    {/* 1. Logo and Website Name */}
                    <div className="col-span-2 md:col-span-1 space-y-3">
                        {/* Brighter Indigo for better pop on black background */}
                        <Link to="/" className="text-2xl font-extrabold text-indigo-500 hover:text-indigo-400 transition-colors duration-200">
                            HabitTracker
                        </Link>
                        <p className="text-sm text-gray-400">
                            Building better futures, one habit at a time.
                        </p>
                    </div>

                    {/* 2. Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Quick Links</h3>
                        <nav className="space-y-2 flex flex-col">
                            <Link to="/my-habits" className="text-sm hover:text-indigo-400 transition-colors">My Habits</Link>
                            <Link to="/public-habits" className="text-sm hover:text-indigo-400 transition-colors">Browse Public</Link>
                            <Link to="/add-habit" className="text-sm hover:text-indigo-400 transition-colors">Add New</Link>
                            <Link to="/login" className="text-sm hover:text-indigo-400 transition-colors">Sign In</Link>
                        </nav>
                    </div>

                    {/* 3. Legal & Terms */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Legal</h3>
                        <nav className="space-y-2 flex flex-col">
                            {/* NOTE: These pages should exist in your Routes */}
                            <Link to="/terms" className="text-sm hover:text-indigo-400 transition-colors">Terms of Service</Link>
                            <Link to="/privacy" className="text-sm hover:text-indigo-400 transition-colors">Privacy Policy</Link>
                            <Link to="/disclaimer" className="text-sm hover:text-indigo-400 transition-colors">Disclaimer</Link>
                        </nav>
                    </div>

                    {/* 4. Contact Details */}
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Contact</h3>
                        <address className="space-y-2 text-sm not-italic">
                            <p>Email: <a href="mailto:support@habittr*****.com" className="hover:text-indigo-400 transition-colors">support@habittracker.com</a></p>
                            <p>Phone: +880 1XXXXXXXXX</p>
                            <p>Address: Dhaka, Bangladesh</p>
                        </address>
                    </div>

                    {/* 5. Social Media Links */}
                    <div className="space-y-4 col-span-2 md:col-span-1">
                        <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Follow Us</h3>
                        <div className="flex space-x-4 text-2xl">
                            {/* Using simple, high-contrast character icons */}
                            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors" aria-label="Facebook">ⓕ</a> 
                            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors" aria-label="Twitter">X </a> 
                            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors" aria-label="Instagram">📸</a> 
                            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors" aria-label="LinkedIn">🔗</a> 
                        </div>
                    </div>

                </div>

                {/* Bottom Copyright Section */}
                <div className="mt-8 pt-4 text-center">
                    <p className="text-sm text-gray-500">
                        &copy; {currentYear} HabitTracker. All rights reserved. Built with ❤️ for consistency.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;