import { Typography, Box, Stack, Button, Divider } from "@mui/joy";
import { useState } from "react";
import FormItem from "./FormItem";
import supabase from "../config/supabaseClient";

const SignInUp = () => {
	const uflEmailPattern = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)*ufl\.edu/;
	const formDataTemplate = {
		email: "",
		password: "",
		confirmPassword: "",
	};

	const [signInActive, setSignInActive] = useState(true);
	const [formData, setFormData] = useState({ ...formDataTemplate });
	const [formErrors, setFormErrors] = useState({ ...formDataTemplate });
	const [loading, setLoading] = useState(false);
	const [generalError, setGeneralError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (loading) return;

		if (signInActive) {
			if (!(await handleSignIn())) return;
		} else {
			if (!(await handleSignUp())) return;
		}

		// TODO: Add logic for redirect after successful sign in/up
		resetForm();
	};

	const handleSignUp = async () => {
		if (!validateSignUp()) return;
		setLoading(true);
		const { error } = await supabase.auth.signUp({
			email: formData.email,
			password: formData.password,
		});
		if (error) setGeneralError(error.message);
		setLoading(false);
		return error === null;
	};

	const handleSignIn = async () => {
		if (!validateSignIn()) return;
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email: formData.email,
			password: formData.password,
		});
		if (error) setGeneralError(error.message);
		setLoading(false);
		return error === null;
	};

	const validateSignUp = () => {
		let newFormErrors = { ...formDataTemplate };
		if (!uflEmailPattern.test(formData.email))
			newFormErrors = { ...newFormErrors, email: "Email must be a valid UFL email." };
		if (formData.password.length < 6)
			newFormErrors = { ...newFormErrors, password: "Password must be at least 6 characters." };
		if (formData.password !== formData.confirmPassword)
			newFormErrors = { ...newFormErrors, confirmPassword: "Passwords must match." };
		setFormErrors(newFormErrors);
		return Object.values(newFormErrors).every((value) => value === "");
	};

	const validateSignIn = () => {
		let newFormErrors = { ...formDataTemplate };
		if (formData.email.length === 0) newFormErrors = { ...newFormErrors, email: "Email cannot be empty." };
		if (formData.password.length === 0) newFormErrors = { ...newFormErrors, password: "Password cannot be empty." };
		setFormErrors(newFormErrors);
		return Object.values(newFormErrors).every((value) => value === "");
	};

	const switchActiveForm = () => {
		if (loading) return;
		resetForm();
		setSignInActive(!signInActive);
	};

	const resetForm = () => {
		setFormData({ ...formDataTemplate });
		setGeneralError("");
		setFormErrors({ ...formDataTemplate });
	};

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setGeneralError("");
		setFormErrors({ ...formErrors, [name]: "" });
		setFormData({
			...formData,
			[name]: value,
		});
	};

	return (
		<Box
			sx={{
				position: 'absolute',
				top: 64,
				bottom: 0,
				left: 0,
				right: 0,
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{/* Sign In/Up Form Container */}
			<Box
				sx={{
					width: {
						xs: "95%",
						sm: "400px",
					},
					maxWidth: "95%",
					border: "0.5px solid #cdcdcd",
					padding: "2rem",
					borderRadius: "0.5rem",
				}}
			>
				<Stack
					direction="column"
					spacing={2}
					sx={{
						justifyContent: "center",
						alignItems: "flex-start",
					}}
				>
					{/* Header */}
					<Typography level="h3" fontWeight="xl">
						{signInActive ? "Sign In" : "Sign Up"}
					</Typography>

					{/* Sign In/Up Form */}
					<form onSubmit={handleSubmit} noValidate style={{ width: "100%" }}>
						<Stack
							direction="column"
							spacing={1.5}
							sx={{
								justifyContent: "center",
								alignItems: "flex-start",
								marginBottom: "0.5rem",
							}}
						>
							{/* Email Form Group */}
							<FormItem
								label="Email"
								name="email"
								type="email"
								value={formData.email}
								onChange={handleFormChange}
								error={formErrors.email}
							/>

							{/* Password Form Group */}
							<FormItem
								label="Password"
								name="password"
								type="password"
								value={formData.password}
								onChange={handleFormChange}
								error={formErrors.password}
							/>

							{/* Confirm Password Group */}
							{!signInActive && (
								<FormItem
									label="Confirm Password"
									name="confirmPassword"
									type="password"
									value={formData.confirmPassword}
									onChange={handleFormChange}
									error={formErrors.confirmPassword}
								/>
							)}
						</Stack>

						{generalError && (
							<Typography sx={{ fontWeight: 400 }} level="body-xs" color="danger">
								Error: {generalError}
							</Typography>
						)}

						{/* Sign In/Sign Up Button */}
						<Button
							sx={{ marginTop: generalError ? "0.5rem" : "1rem" }}
							color="primary"
							type="submit"
							fullWidth
						>
							{loading && <>{signInActive ? "Signing In..." : "Signing Up..."}</>}
							{!loading && <>{signInActive ? "Sign In" : "Sign Up"}</>}
						</Button>
					</form>

					<Divider />

					{/* Sign up here/Sign in here message */}
					<Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
						<Typography level="body-sm" fontWeight="md">
							{signInActive ? "Don't have an account? " : "Already have an account? "}
							<Typography
								sx={{
									"&:hover": {
										cursor: "pointer",
									},
								}}
								fontWeight="lg"
								color="primary"
								onClick={switchActiveForm}
							>
								{signInActive ? "Sign up here" : "Sign in here"}
							</Typography>
						</Typography>
					</Box>
				</Stack>
			</Box>
		</Box>
	);
};

export default SignInUp;
