import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Button,
	Divider,
	Grid,
	IconButton,
	Modal,
	ModalDialog,
	ModalClose,
	Stack,
	Typography,
	Card,
	CardActions,
	CircularProgress,
} from "@mui/joy";
import { EditRounded as EditRoundedIcon } from "@mui/icons-material";
import useAuth from "../store/authStore";
import { years } from "../constants/Enums";
import UserIcon from "../components/UserIcon";
import { updateUser } from "../functions/userQueries";
import UserInfoForm from "../components/UserInfoForm";
import FormRadio from "../components/FormRadio";

const Settings = () => {
	const navigate = useNavigate();
	const { session } = useAuth();
	const [loading, setLoading] = useState(false);
	const [imageModalOpen, setImageModalOpen] = useState(false);
	// const handleOpen = () => setImageModalOpen(true);
	// const handleClose = () => setImageModalOpen(false);

	// Form states
	const formDataTemplate = {
		firstname: "",
		lastname: "",
		major: "",
		year: "",
		theme_ld: "",
		icon_color: "",
	};
	const [formData, setFormData] = useState({
		firstname: session.user.data.first_name,
		lastname: session.user.data.last_name,
		major: session.user.data.major,
		year: session.user.data.year,
		theme_ld: session.user.data.theme_ld,
		icon_color: session.user.data.icon_color,
	});
	const [formErrors, setFormErrors] = useState({ ...formDataTemplate });
	const [generalError, setGeneralError] = useState("");

	const colors = [
		"red",
		"pink",
		"orange",
		"yellow",
		"lime",
		"lightGreen",
		"green",
		"teal",
		"cyan",
		"lightBlue",
		"blue",
		"indigo",
		"purple",
		"grey",
	];

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setGeneralError("");
		setFormErrors({ ...formErrors, [name]: "" });
		setFormData({ ...formData, [name]: value });
	};

	const validateUpdate = () => {
		let newFormErrors = { ...formDataTemplate };
		if (!formData.firstname.trim()) newFormErrors.firstname = "Firstname cannot be empty.";
		if (!formData.lastname.trim()) newFormErrors.lastname = "Lastname cannot be empty.";
		if (!formData.major.trim()) newFormErrors.major = "Major cannot be empty.";
		if (!formData.year.trim()) newFormErrors.year = "Year cannot be empty.";
		setFormErrors(newFormErrors);
		return Object.values(newFormErrors).every((value) => !value);
	};

	const handleUpdate = async () => {
		if (!validateUpdate()) return;
		setLoading(true);

		const updatedUser = {
			first_name: formData.firstname,
			last_name: formData.lastname,
			major: formData.major,
			year: formData.year,
			icon_color: formData.icon_color,
			theme_ld: formData.theme_ld,
		};

		try {
			const { error } = await updateUser(session.user.id, updatedUser);
			if (error) throw error;
			navigate(0);
		} catch (error) {
			console.error("Error updating user:", error);
			setGeneralError("Failed to update user information. Please try again.");
			setLoading(false);
		}
	};

	const cancelUpdate = () => {
		if (loading) return;
		resetForm();
	};

	const resetForm = () => {
		setFormData({
			firstname: session.user.data.first_name || "",
			lastname: session.user.data.last_name || "",
			major: session.user.data.major || "",
			year: session.user.data.year || "",
		});
		setGeneralError("");
		setFormErrors({ ...formDataTemplate });
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ flex: 1, width: "100%" }}>
			<Stack
				spacing={4}
				sx={{
					maxWidth: "800px",
					mx: "auto",
					px: { xs: 2, md: 6 },
					py: { xs: 2, md: 3 },
				}}
			>
				<Card>
					<Box sx={{ mb: 1, textAlign: "center" }}>
						<Typography variant="h5" sx={{ color: "text.primary" }}>
							Personal Info
						</Typography>
						<Typography variant="body2">Customize your profile information</Typography>
					</Box>
					<Divider />
					<Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ my: 2 }}>
						<Stack direction="column" spacing={1}>
							<UserIcon height={100} width={100} bgcolor={formData.icon_color} />
							<IconButton
								aria-label="upload new picture"
								size="sm"
								variant="outlined"
								color="neutral"
								sx={{
									bgcolor: "background.body",
									position: "absolute",
									zIndex: 2,
									borderRadius: "50%",
									left: 100,
									top: 170,
									boxShadow: "sm",
								}}
								onClick={() => setImageModalOpen(true)}
							>
								<EditRoundedIcon />
							</IconButton>
							<Modal open={imageModalOpen} onClose={() => setImageModalOpen(false)}>
								<ModalDialog variant="outlined">
									<ModalClose />
									<Typography level="body2">Change Color</Typography>
									<Grid container spacing={1} sx={{ my: 2 }}>
										{colors.map((color) => (
											<Grid xs={3} key={color}>
												<Box
													sx={{
														width: 30,
														height: 30,
														backgroundColor: color,
														borderRadius: "sm",
														cursor: "pointer",
														border: "1px solid #cdcdcd",
														// color === "neutral"
														// 	? "2px solid #1a1a1a"
														// 	: "2px solid transparent",
													}}
													onClick={() => setFormData({ ...formData, icon_color: color })}
												/>
											</Grid>
										))}
									</Grid>
								</ModalDialog>
							</Modal>
						</Stack>
						<Stack spacing={2} sx={{ flexGrow: 1 }}>
							<UserInfoForm
								email={session.user.email}
								formData={formData}
								formErrors={formErrors}
								handleFormChange={handleFormChange}
								years={years}
							/>

							<FormRadio
								label="Theme"
								name="theme_ld"
								value={formData.theme_ld}
								onChange={handleFormChange}
								error={formErrors.theme_ld}
								options={["system", "light", "dark"]}
							/>
						</Stack>
					</Stack>
					{generalError && (
						<Typography level="body2" color="danger" sx={{ mb: 1 }}>
							{generalError}
						</Typography>
					)}
					<CardActions sx={{ justifyContent: "center" }}>
						<Button onClick={cancelUpdate} disabled={loading} color="neutral">
							Cancel
						</Button>
						<Button disabled={loading} loading={loading} onClick={handleUpdate} variant="solid">
							Update
						</Button>
					</CardActions>
				</Card>
			</Stack>
		</Box>
	);
};

export default Settings;
