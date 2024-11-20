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
	const { session, setSession, publicUser, setPublicUser } = useAuth();
	const [loading, setLoading] = useState(true);

	// All logic for loading the application
	const loadApp = async () => {
		const { data, error } = await supabase.auth.getSession();

		if (!error && data.session) {
			const publicUserData = await getUser(data.session.user.id);
			setSession(data.session);
			setPublicUser(publicUserData);
		}
		setLoading(false);
	};

	useEffect(() => {
		loadApp();
	}, []);

	if (loading) return null;

	return (
		<APIProvider apiKey={import.meta.env.VITE_MAPS_KEY}>
			<CssVarsProvider theme={customTheme}>
				<CssBaseline />
				<ColorSchemeSetting user={publicUser} />
				<Router>
					<div className="app-container">
						<Navbar />
						<main>
							<Routes>
								<Route
									path="/"
									element={session && publicUser ? <Navigate to="/dashboard" /> : <LandingPage />}
								/>
								<Route
									path="/signin"
									element={session && publicUser ? <Navigate to="/dashboard" /> : <SignInUp />}
								/>
								<Route
									path="/dashboard"
									element={session && publicUser ? <Dashboard /> : <Navigate to="/signin" />}
								/>
								<Route
									path="/admin"
									element={publicUser?.role === "admin" ? <Admin /> : <Navigate to="/dashboard" />}
								/>
								<Route
									path="/settings"
									element={session && publicUser ? <Settings /> : <Navigate to="/signin" />}
								/>
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
