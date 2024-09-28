import { Typography, Box, Stack, Button, Divider } from "@mui/joy";
import { useState } from "react";
import FormItem from "./FormItem";

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

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!signInActive) {
			if (!validateSignUp()) return;
		}
	};

	const validateSignUp = () => {
		let newFormErrors = { ...formDataTemplate };
		if (!uflEmailPattern.test(formData.email))
			newFormErrors = { ...newFormErrors, email: "Email must be a valid UFL email." };

		if (!formData.password) newFormErrors = { ...newFormErrors, password: "Password cannot be empty" };

		if (formData.password !== formData.confirmPassword)
			newFormErrors = { ...newFormErrors, confirmPassword: "Passwords must match." };

		setFormErrors(newFormErrors);
		return Object.values(newFormErrors).every((value) => value === "");
	};

	const switchActiveForm = () => {
		resetForm();
		setSignInActive(!signInActive);
	};

	const resetForm = () => {
		setFormData({ ...formDataTemplate });
		setFormErrors({ ...formDataTemplate });
	};

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormErrors({ ...formErrors, [name]: "" });
		setFormData({
			...formData,
			[name]: value,
		});
	};

	return (
		<Box
			sx={{
				width: "100vw",
				height: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{/* Sign In/Up Form Container */}
			<Box
				sx={{
					width: { xs: "95%", md: "50%", lg: "40%", xl: "25%" },
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

						{/* Sign In/Sign Up Button */}
						<Button sx={{ marginTop: "1.5rem" }} color="primary" type="submit" fullWidth>
							{signInActive ? "Sign In" : "Sign Up"}
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
