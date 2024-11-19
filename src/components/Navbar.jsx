import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../store/authStore";
import { Sheet, IconButton, Box, Typography, Dropdown, Menu, MenuButton, MenuItem, Button, Stack } from "@mui/joy";
import { Menu as MenuIcon, Person as PersonIcon } from "@mui/icons-material";
import supabase from "../config/supabaseClient";
import { getUserRole } from "../functions/userQueries";
import UserIcon from "./UserIcon";

const Navbar = () => {
	const navigate = useNavigate();
	const { session, setSession } = useAuth();
	const [menuOpen, setMenuOpen] = useState(false);
	const [userRole, setUserRole] = useState(null);

	useEffect(() => {
		if (session) {
			fetchUserRole();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (!error) {
			setSession(null);
			navigate("/");
		}
	};

	const fetchUserRole = async () => {
		try {
			const data = await getUserRole(session.user.id);
			setUserRole(data[0]);
		} catch (error) {
			console.error("Error fetching favorites:", error);
			setUserRole([]);
		}
	};

	const navItems = [
		{ label: "Home", path: "/" },
		{ label: "Search", path: "/search" },
		{ label: "About", path: "/about" },
	];

	return (
		<>
			<Sheet
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "flex-start",
					py: 1.5,
					gap: 5,
					px: { xs: 2, sm: 4 },
					borderBottom: "1px solid",
					borderColor: "divider",
				}}
			>
				<Stack
					direction="row"
					sx={{
						display: "flex",
						marginRight: "auto",
						marginLeft: 2,
					}}
				>
					<Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1.5,
								cursor: "pointer",
								marginRight: 2,
							}}
						>
							<img src="/swamp_review_logo.png" style={{ height: "2.5rem" }} alt="Swamp Review Logo" />
							<Typography level="h4" component="h1" sx={{ display: { xs: "none", md: "inline-block" } }}>
								SwampReview
							</Typography>
						</Box>
					</Link>
					{/* ONLY DISPLAY THESE NAV ITEMS ON NON-MOBILE */}
					{/* <Box> */}
					{navItems.map((item) => (
						<Button
							key={item.path}
							sx={{ display: { xs: "none", sm: "flex" } }}
							variant="plain"
							onClick={() => navigate(item.path)}
						>
							{item.label}
						</Button>
					))}
					{/* </Box> */}
				</Stack>

				<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
					{/* USER BUTTON - DISPLAYS ON ALL SCREENS */}
					{session ? (
						<Dropdown>
							<MenuButton
								variant="plain"
								sx={{
									display: "flex",
									gap: 1.5,
									alignItems: "center",
									"&:hover": {
										backgroundColor: "transparent",
										color: "primary.main",
									},
								}}
							>
								{session ? <UserIcon /> : <PersonIcon />}
								<Typography level="body-sm">{session?.user?.email?.split("@")[0] || "User"}</Typography>
							</MenuButton>
							<Menu placement="bottom-end">
								{userRole && userRole.role === "admin" && (
									<MenuItem onClick={() => navigate("/admin")}>Admin</MenuItem>
								)}
								<MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
								<MenuItem onClick={handleLogout}>Logout</MenuItem>
							</Menu>
						</Dropdown>
					) : (
						<Button variant="solid" color="primary" onClick={() => navigate("/signin")}>
							Sign In
						</Button>
					)}

					{/* HAMBURGER ICON - ONLY DISPLAYS ON MOBILE/TABLET */}
					<IconButton
						variant="outlined"
						color="neutral"
						onClick={() => setMenuOpen(!menuOpen)}
						sx={{ display: { xs: "flex", sm: "none" } }}
					>
						<MenuIcon />
					</IconButton>
				</Box>
			</Sheet>

			{/* EXPANDABLE NAV ITEM MENU FOR MOBILE SCREENS */}
			{menuOpen && (
				<Box
					sx={{
						bgcolor: "background.surface",
						p: 2,
						display: { xs: "block", sm: "none" },
					}}
				>
					{/* <IconButton onClick={() => setMenuOpen(false)} sx={{ position: "absolute", right: 2, top: 2 }}>
						Close
					</IconButton> */}
					<Stack spacing={2}>
						{navItems.map((item) => (
							<Button
								key={item.path}
								variant="outlined"
								fullWidth
								onClick={() => {
									navigate(item.path);
									setMenuOpen(false);
								}}
							>
								{item.label}
							</Button>
						))}
					</Stack>
				</Box>
			)}
		</>
	);
};

export default Navbar;
