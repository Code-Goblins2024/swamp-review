/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "./store/authStore";
import supabase from "./config/supabaseClient";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SignInUp from "./pages/SignInUp";
import HousingPage from "./pages/HousingPage";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Search from "./pages/Search";
import Admin from "./pages/Admin";
import { getUserRole } from "./functions/userQueries";

const App = () => {
    const { session, setSession } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState("");

    // All logic for loading the application
    const loadApp = async () => {
        const { data, error } = await supabase.auth.getSession();
        if (!error) setSession(data.session);

        setLoading(false);
    };

    const loadRole = async (session) => {
        const role = await getUserRole(session.user.id);
        setUserRole(role[0].role);
    }

    useEffect(() => {
        loadApp();
    }, []);

    useEffect(() => {
        loadRole(session);
    }, [session]);

    // Auth state change listener
    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) return null;

    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <main>
                    <Routes>
                        <Route
                            path="/"
                            element={session ? <Navigate to="/dashboard" /> : <LandingPage />}
                        />
                        <Route
                            path="/signin"
                            element={session ? <Navigate to="/dashboard" /> : <SignInUp />}
                        />
                        <Route
                            path="/dashboard"
                            element={session ? <Dashboard /> : <Navigate to="/signin" />}
                        />
                        <Route
                            path="/admin"
                            element={userRole === "admin" ? <Admin /> : <Navigate to="/dashboard" />}
                        />
                        <Route path="/about" element={<About />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/housing/:housingId" element={<HousingPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
