/* eslint-disable react-hooks/exhaustive-deps */
import SignInUp from "./pages/SignInUp";
import { useState, useEffect } from "react";
import useAuth from "./store/authStore";
import supabase from "./config/supabaseClient";

const App = () => {
	const { setSession } = useAuth();
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
		<>
			<p className="read-the-docs">Vite is running.</p>
		</>
	);
};

export default App;
