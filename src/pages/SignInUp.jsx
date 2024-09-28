import { Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";

const SignInUp = () => {
	const handleSubmit = () => {};

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
					<Typography level="h3" fontWeight="xl">
						Sign Up
					</Typography>
					<form onSubmit={handleSubmit} style={{ width: "100%" }}>
						<Stack
							direction="column"
							spacing={2}
							sx={{
								justifyContent: "center",
								alignItems: "flex-start",
							}}
						>
							<FormControl sx={{ width: "100%" }} required>
								<FormLabel>Email</FormLabel>
								<Input type="email" name="email" />
							</FormControl>
							<FormControl sx={{ width: "100%" }} required>
								<FormLabel>Password</FormLabel>
								<Input type="password" name="password" />
							</FormControl>
							<Button color="primary" fullWidth>
								Sign In
							</Button>
						</Stack>
					</form>
					<Divider />
					<Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
						<Typography level="body-sm" fontWeight="md">
							{"Don't have an account? "}
							<Typography
								sx={{
									"&:hover": {
										cursor: "pointer",
									},
								}}
								fontWeight="lg"
								color="primary"
							>
								Sign up here.
							</Typography>
						</Typography>
					</Box>
				</Stack>
			</Box>
		</Box>
	);
};

export default SignInUp;
