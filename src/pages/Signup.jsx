import React, { useState } from "react";
import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebaseconfig";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

function validatePassword(pw) {
    if (pw.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(pw)) return "Must include an Uppercase letter";
    if (!/[a-z]/.test(pw)) return "Must include a Lowercase letter";
    return null;
}

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // ✅ Handle form signup
    const handleSubmit = async (e) => {
        e.preventDefault();

        const err = validatePassword(password);
        if (err) {
            toast.error(err);
            return;
        }

        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(cred.user, { displayName: name, photoURL });

            // ✅ Save user info to localStorage (Note: For production apps, use Context/Redux)
            const userData = {
                uid: cred.user.uid,
                displayName: name,
                email: cred.user.email,
                photoURL: photoURL,
            };
            localStorage.setItem("user", JSON.stringify(userData));

            toast.success("Registered successfully 🎉");
            navigate("/");
        } catch (err) {
            toast.error(err.message);
        }
    };

    // ✅ Handle Google signup
    const handleGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Save user info
            const userData = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
            };
            localStorage.setItem("user", JSON.stringify(userData));

            toast.success("Signed in with Google");
            navigate("/");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8 space-y-6 border border-indigo-900/50">
                
                {/* Header */}
                <h2 className="text-3xl font-bold text-white text-center">Create Your Account</h2>
                <p className="text-gray-400 text-center">Start tracking your habits today.</p>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input: Name */}
                    <input
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150 placeholder-gray-400"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        required
                    />
                    {/* Input: Email */}
                    <input
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150 placeholder-gray-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        type="email"
                        required
                    />
                    {/* Input: Photo URL */}
                    <input
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150 placeholder-gray-400"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        placeholder="Profile Photo URL (Optional)"
                    />
                    {/* Input: Password */}
                    <input
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150 placeholder-gray-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password (min 6 chars, uppercase/lowercase)"
                        type="password"
                        required
                    />
                    {/* Submit Button */}
                    <button 
                        type="submit"
                        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        Register Account
                    </button>
                </form>

                {/* Separator */}
                <div className="flex items-center space-x-2 my-4">
                    <hr className="flex-grow border-gray-700" />
                    <span className="text-gray-500 text-sm">OR</span>
                    <hr className="flex-grow border-gray-700" />
                </div>
                
                {/* Google Login Button */}
                <button 
                    onClick={handleGoogle}
                    className="w-full flex items-center justify-center py-3 border border-gray-600 text-white rounded-lg shadow-sm hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                    <span className="text-xl mr-3">
                        <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><path d="M12.0003 4.75C14.0413 4.75 15.7823 5.46333 17.1433 6.78667L19.8203 4.10967C17.7663 2.14667 15.0113 1 12.0003 1C7.75734 1 3.97834 2.45333 1.05634 5.25333L3.84434 7.56833C5.10534 6.64333 6.54434 6.0075 8.08334 5.56833C9.62234 5.12917 11.2633 4.75 12.0003 4.75Z" fill="#EA4335"/><path d="M23.0803 12.0003C23.0803 11.1337 22.9773 10.2397 22.8023 9.38967H12.0003V14.2867H18.3973C17.7553 15.6567 16.8173 16.9647 15.5453 17.7497L18.3333 20.0647C20.4073 18.2327 22.1803 16.3267 22.8403 13.9187C23.0043 13.2517 23.0803 12.5647 23.0803 12.0003Z" fill="#4285F4"/><path d="M4.61331 10.9633L1.82531 8.64831C1.29831 9.87331 1.00031 11.1603 1.00031 12.5003C1.00031 13.8403 1.29831 15.1273 1.82531 16.3523L4.61331 14.0373C4.18031 13.1023 4.00031 12.0523 4.00031 11.0003C4.00031 9.94831 4.18031 8.89831 4.61331 7.96331L1.82531 5.64831C1.05731 7.21831 0.625312 8.89831 0.625312 10.7503C0.625312 12.6023 1.05731 14.2823 1.82531 15.8523L4.61331 13.5373C4.18031 12.6023 4.00031 11.5523 4.00031 10.7503H4.61331Z" fill="#FBBC04"/><path d="M12.0003 19.25C10.0273 19.25 8.16734 18.665 6.63734 17.5833L3.84934 19.8983C5.62234 21.4933 7.75734 22.5 12.0003 22.5C14.9893 22.5 17.7443 21.5793 19.7983 19.6163L17.0213 16.9393C15.6603 18.2623 14.0413 18.75 12.0003 18.75V19.25Z" fill="#34A853"/></svg>
                    </span>
                    Sign up with Google
                </button>
                
                {/* Link to Login */}
                <p className="text-center text-sm text-gray-400 pt-2">
                    Already have an account? 
                    <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium ml-1 transition duration-150">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}