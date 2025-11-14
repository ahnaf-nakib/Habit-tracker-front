import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddHabit from "./pages/AddHabit";
import MyHabits from "./pages/MyHabits";
import HabitDetails from "./pages/HabitDetails";
import PublicHabits from "./pages/PublicHabits";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateHabit from "./pages/UpdateHabit";

// Firebase
import { auth } from "./firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          displayName: user.displayName || "User",
          email: user.email,
          photoURL: user.photoURL || "",
        };
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/public-habits" element={<PublicHabits />} />

        <Route
          path="/habit/:id"
          element={
            <PrivateRoute>
              <HabitDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/add-habit"
          element={
            <PrivateRoute>
              <AddHabit />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-habits"
          element={
            <PrivateRoute>
              <MyHabits />
            </PrivateRoute>
          }
        />

        {/* ⭐ Update Habit Route Added Here */}
        <Route
          path="/update-habit/:id"
          element={
            <PrivateRoute>
              <UpdateHabit />
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <ToastContainer position="top-right" />
    </Router>
  );
}

export default App;
