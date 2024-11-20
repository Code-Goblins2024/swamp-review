/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { extendTheme, CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import useAuth from "./store/authStore";
import supabase from "./config/supabaseClient";
import CssBaseline from "@mui/joy/CssBaseline";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SignInUp from "./pages/SignInUp";
import HousingPage from "./pages/HousingPage";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Search from "./pages/Search";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";

import { getUser } from "./functions/userQueries";
import { theme } from "./constants/Constants";
import PropTypes from "prop-types";

const ColorSchemeSetting = ({ user }) => {
	const { setMode } = useColorScheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		setMode(user?.theme_ld || "system");
	}, [user]);

	if (!mounted) {
		return null;
	}

	return <></>;
};

const customTheme = extendTheme(theme);

const App = () => {
	const { session, setSession } = useAuth();
	const [loading, setLoading] = useState(true);

	// All logic for loading the application
	const loadApp = async () => {
		const { data, error } = await supabase.auth.getSession();

		if (!error && data.session) {
			setSession(data.session ? await getPublicUserData(data.session) : null);
		}

		setLoading(false);
	};

	useEffect(() => {
		loadApp();
	}, []);

	// Auth state change listener
	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			setSession(session ? await getPublicUserData(session) : null);
		});

		return () => subscription.unsubscribe();
	}, []);

	const getPublicUserData = async (session) => {
		try {
			const userData = await getUser(session.user.id);
			session.user = { ...session.user, data: userData };
		} catch (error) {
			console.error("Error fetching user:", error);
		}

		return session;
	};

	if (loading) return null;

  return (
		<APIProvider apiKey={import.meta.env.VITE_MAPS_KEY}>
		<CssVarsProvider theme={customTheme}>
			<CssBaseline />
			<ColorSchemeSetting user={session?.user?.data} />
			<Router>
				<div className="app-container">
					<Navbar />
					<main>
						<Routes>
							<Route path="/" element={session ? <Navigate to="/dashboard" /> : <LandingPage />} />
							<Route path="/signin" element={session ? <Navigate to="/dashboard" /> : <SignInUp />} />
							<Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/signin" />} />
							<Route
								path="/admin"
								element={
									session?.user?.data?.role === "admin" ? <Admin /> : <Navigate to="/dashboard" />
								}
							/>
							<Route path="/settings" element={session ? <Settings /> : <Navigate to="/signin" />} />
							<Route path="/about" element={<About />} />
							<Route path="/search" element={<Search />} />
							<Route path="/housing/:housingId" element={<HousingPage />} />
						</Routes>
					</main>
				</div>
			</Router>
      </CssVarsProvider>
		</APIProvider>
	);
};

ColorSchemeSetting.propTypes = {
	user: PropTypes.object,
};

export default App;
