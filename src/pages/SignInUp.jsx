import { Typography, Box, Stack, Button, Divider, FormLabel } from "@mui/joy";
import { useState } from "react";
import { years } from "../constants/Enums";
import { createPublicUser } from "../functions/userQueries";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FormItem from "../components/FormItem";
import FormSelect from "../components/FormSelect";
import supabase from "../config/supabaseClient";

const SignInUp = () => {
	const uflEmailPattern = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)*ufl\.edu/;
	const formDataTemplate = {
		email: "",
		password: "",
		confirmPassword: "",
		firstname: "",
		lastname: "",
		major: "",
		year: "",
	};
	const location = useLocation();
	const navigate = useNavigate();
	const [formState, setFormState] = useState("SIGNIN");
	const [formData, setFormData] = useState({ ...formDataTemplate });
	const [formErrors, setFormErrors] = useState({ ...formDataTemplate });
	const [loading, setLoading] = useState(false);
	const [generalError, setGeneralError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (loading) return;

		if (formState === "SIGNIN") {
			if (!(await handleSignIn())) return;
		} else if (formState === "SIGNUP") {
			await handleSignUp();
			return; // Avoid the reset at the end of the function
		} else if (formState === "SIGNUP_CONFIRM") {
			if (!(await handleConfirmSignUp())) return;
		}

		// TODO: Add logic for redirect after successful sign in/up
		const housingRedirect = new URLSearchParams(location.search).get("housingRedirect");
		if (housingRedirect) {
			navigate(`/housing/${housingRedirect}?showReviewForm=true`);
		}

		resetForm();
	};

	const handleSignUp = async () => {
		if (!validateSignUp()) return;
		setLoading(true);

		// TODO: Encapsulate this in a query function
		const { data, error } = await supabase.from("users").select("id").eq("email", formData.email).limit(1);

		if (error) {
			setGeneralError("Error: Unknown error while trying to sign up. Please try again later.");
			return;
		}

		if (data.length > 0) {
			setFormErrors({ ...formErrors, email: "Email already exists." });
			setLoading(false);
			return;
		}

		setFormState("SIGNUP_CONFIRM"); // Move the user onto the next page
		setLoading(false);
	};

	const handleConfirmSignUp = async () => {
		if (!validateConfirmSignUp()) return;
		setLoading(true);
		let { data, error } = await supabase.auth.signUp({
			email: formData.email,
			password: formData.password,
		});
		if (error) setGeneralError(error.message);

		const newUser = {
			id: data.user.id,
			email: formData.email,
			first_name: formData.firstname,
			last_name: formData.lastname,
			major: formData.major,
			year: formData.year,
		};
		await createPublicUser(newUser);

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
		setFormErrors(newFormErrors);
		return Object.values(newFormErrors).every((value) => value === "");
	};

	const validateConfirmSignUp = () => {
		let newFormErrors = { ...formDataTemplate };
		if (formData.firstname.length === 0)
			newFormErrors = { ...newFormErrors, firstname: "Firstname cannot be empty." };
		if (formData.lastname.length === 0) newFormErrors = { ...newFormErrors, lastname: "Lastname cannot be empty." };
		if (formData.major.length === 0) newFormErrors = { ...newFormErrors, major: "Major cannot be empty." };
		if (!formData.year) newFormErrors = { ...newFormErrors, year: "Year cannot be empty." };
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
		setFormState(formState === "SIGNIN" ? "SIGNUP" : "SIGNIN");
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

	const cancelConfirmSignup = () => {
		if (loading) return;
		resetForm();
		setFormState("SIGNUP");
	};

	return (
		<Box
			sx={{
				position: "absolute",
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
					{/* Return Button */}
					{formState === "SIGNUP_CONFIRM" && (
						<Box
							sx={{
								display: "flex",
								justifyContent: "start",
								alignItems: "center",
								gap: "0.1rem",
								"&:hover": {
									cursor: "pointer",
									"& .MuiTypography-root": {
										textDecoration: "underline",
									},
								},
							}}
							onClick={cancelConfirmSignup}
						>
							<ArrowBackIcon fontSize="small" color="primary" />
							<Typography color="primary" level="body-sm" fontWeight="lg">
								Return
							</Typography>
						</Box>
					)}

					{/* Header/Header Message Stack */}
					<Stack direction="column" spacing={0.5}>
						{/* Header */}
						<Typography level="h3" fontWeight="xl">
							{formState === "SIGNIN" ? "Sign In" : "Sign Up"}
						</Typography>

						<Typography level="body-sm" fontWeight="md">
							{/* {formState === "SIGNIN" &&
								"Welcome back to SwampReview, please enter your email and password to sign in."} */}
							{formState === "SIGNUP" &&
								"Welcome to SwampReview! Please enter your email to get started."}
							{formState === "SIGNUP_CONFIRM" &&
								"We'll need some additional details to confirm your sign up."}
						</Typography>
					</Stack>

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
							{(formState === "SIGNIN" || formState === "SIGNUP") && (
								<FormItem
									label="Email"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleFormChange}
									error={formErrors.email}
								/>
							)}

							{formState === "SIGNUP_CONFIRM" && (
								<>
									<Box sx={{ width: "100%" }}>
										<FormLabel>Email</FormLabel>
										<Typography level="body-sm" fontWeight="xl">
											{formData.email}
										</Typography>
									</Box>

									<FormItem
										label="Firstname"
										name="firstname"
										type="text"
										value={formData.firstname}
										onChange={handleFormChange}
										error={formErrors.firstname}
									/>

									<FormItem
										label="Lastname"
										name="lastname"
										type="text"
										value={formData.lastname}
										onChange={handleFormChange}
										error={formErrors.lastname}
									/>

									<FormItem
										label="Major"
										name="major"
										type="text"
										value={formData.major}
										onChange={handleFormChange}
										error={formErrors.major}
									/>

									<FormSelect
										label="Year"
										name="year"
										value={formData.year}
										onChange={handleFormChange}
										error={formErrors.year}
										options={years}
									/>
								</>
							)}

							{/* Password Form Group */}
							{(formState === "SIGNIN" || formState === "SIGNUP_CONFIRM") && (
								<FormItem
									label="Password"
									name="password"
									type="password"
									value={formData.password}
									onChange={handleFormChange}
									error={formErrors.password}
								/>
							)}

							{/* Confirm Password Group */}
							{formState === "SIGNUP_CONFIRM" && (
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
							{formState === "SIGNIN" && <>{loading ? "Signing In..." : "Sign In"}</>}
							{formState === "SIGNUP" && <>{loading ? "Loading..." : "Get Started"}</>}
							{formState === "SIGNUP_CONFIRM" && <>{loading ? "Signing Up..." : "Confirm Sign Up"}</>}
						</Button>
					</form>

					{(formState === "SIGNIN" || formState === "SIGNUP") && <Divider />}

					{/* Sign up here/Sign in here message */}
					{(formState === "SIGNIN" || formState === "SIGNUP") && (
						<Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
							<Typography level="body-sm" fontWeight="md">
								{formState === "SIGNIN" && "Don't have an account? "}
								{formState === "SIGNUP" && "Already have an account? "}
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
									{formState === "SIGNIN" && "Sign up here"}
									{formState === "SIGNUP" && "Sign in here"}
								</Typography>
							</Typography>
						</Box>
					)}
				</Stack>
			</Box>
		</Box>
	);
};

export default SignInUp;
