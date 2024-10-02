/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import useAuth from "./store/authStore";
import supabase from "./config/supabaseClient";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SignInUp from "./pages/SignInUp";

const App = () => {
	const { session, setSession } = useAuth();
	const [loading, setLoading] = useState(true);

	// All logic for loading the application
	const loadApp = async () => {
		const { data, error } = await supabase.auth.getSession();
		if (!error) setSession(data.session);

		setLoading(false);
	};

	useEffect(() => {
		loadApp();
	}, []);

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
				  element={session ? <div>Dashboard Placeholder</div> : <Navigate to="/signin" />} 
				/>
			  </Routes>
			</main>
		  </div>
		</Router>
	  );
};

export default App;
