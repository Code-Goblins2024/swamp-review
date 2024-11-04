import { Box, Typography, Stack, Card, Textarea, Button, CircularProgress } from "@mui/joy";
import { Modal } from "@mui/material";
import { useTheme } from "@mui/joy/styles";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { addReview } from "../functions/reviewQueries";
import { getHousing } from "../functions/housingQueries";
import useAuth from "../store/authStore";
import FormSelect from "./FormSelect";
import PropTypes from "prop-types";
import ClickableRating from "./ClickableRating";

const ReviewModal = ({ reviewModalOpen, setReviewModalOpen, housingData, setHousingData, categories, loading }) => {
	const theme = useTheme();
	const location = useLocation();
	const navigate = useNavigate();
	const { session } = useAuth();
	const [roomType, setRoomType] = useState("");
	const [roomTypeError, setRoomTypeError] = useState("");
	const [ratings, setRatings] = useState({});
	const [ratingsErrors, setRatingsErrors] = useState({});
	const [content, setContent] = useState("");
	const [generalError, setGeneralError] = useState("");
	const [contentLimitNotification, setContentLimitNotification] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const contentCharLimit = 2000;

	useEffect(() => {
		// Check if there's a param specifying to open the review modal
		const queryParams = new URLSearchParams(location.search);
		if (queryParams.get("showReviewModal") === "true") {
			setReviewModalOpen(true);

			// Clear the param after receiving it
			queryParams.delete("showReviewModal");
			const newUrl = `${location.pathname}?${queryParams.toString()}`;
			navigate(newUrl, { replace: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	useEffect(() => {
		// Create objects to store ratings/ratings errors
		if (categories) {
			let newRatings = {};
			let newRatingsErrors = {};
			categories.forEach((category) => {
				newRatings = {
					...newRatings,
					[category.name]: 0.0,
				};
				newRatingsErrors = {
					...newRatingsErrors,
					[category.name]: "",
				};
			});
			setRatings(newRatings);
			setRatingsErrors(newRatingsErrors);
		}
	}, [categories]);

	const handleCloseModal = () => {
		if (submitting || loading) return;

		setReviewModalOpen(false);
		resetForm();
	};

	const resetForm = () => {
		setRoomType("");
		setRoomTypeError("");
		setContent("");
		setGeneralError("");

		let clearedRatings = { ...ratings };
		let clearedRatingsErrors = { ...ratings };
		Object.keys(clearedRatings).forEach((key) => {
			clearedRatings[key] = 0;
			clearedRatingsErrors[key] = "";
		});
		setRatings(clearedRatings);
		setRatingsErrors(clearedRatingsErrors);
	};

	const handleRoomTypeChange = (e) => {
		if (submitting || loading || !session) return;

		setRoomTypeError("");
		setRoomType(e.target.value);
	};

	const handleContentChange = (e) => {
		if (submitting || loading || !session) return;

		if (e.target.value.length > contentCharLimit) {
			setContentLimitNotification(true);
			setTimeout(() => {
				setContentLimitNotification(false);
			}, 1500);
			return;
		}

		setContent(e.target.value);
	};

	const handleRatingClick = (category, value) => {
		if (submitting || loading || !session) return;

		setRatingsErrors({ ...ratingsErrors, [category]: "" });
		setRatings({
			...ratings,
			[category]: value,
		});
	};

	const handleSubmit = async () => {
		if (submitting || loading || !session) return;
		setSubmitting(true);

		let errors = false;

		if (!roomType) {
			errors = true;
			setRoomTypeError("Please choose a room type");
		}

		let newRatingsErrors = { ...ratingsErrors };
		categories.forEach((category) => {
			if (ratings[category.name] === 0) {
				newRatingsErrors = {
					...newRatingsErrors,
					[category.name]: "Please click a star to choose a rating from 1-5",
				};
				errors = true;
			}
		});
		setRatingsErrors(newRatingsErrors);

		if (errors) {
			setSubmitting(false);
			return;
		}

		// Reformat the ratings for submission
		const formattedRatings = [];
		categories.forEach((category) => {
			formattedRatings.push({
				id: category.id,
				rating_value: ratings[category.name],
			});
		});

		try {
			// TODO: Add tags later
			await addReview(content, housingData.id, session.user.id, [], formattedRatings);
		} catch {
			setGeneralError("Sorry, we unexpectedly couldn't submit your review. Please try again later.");
			setSubmitting(false);
			return;
		}

		try {
			const newHousingData = await getHousing(housingData.id);
			setHousingData(newHousingData);
		} catch {
			navigate(0);
		}

		setSubmitting(false);
		setReviewModalOpen(false);
		resetForm();
	};

	return (
		<Modal open={reviewModalOpen} onClick={handleCloseModal}>
			<Box
				sx={{
					width: "100%",
					height: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Box
					onClick={(e) => e.stopPropagation()}
					sx={{
						backgroundColor: "white",
						width: { xs: "90%", sm: "80%", md: "60%", lg: "50%" },
						padding: "1.5rem",
						borderRadius: "8px",
						border: `2px solid ${theme.palette.neutral[300]}`,
						position: "relative",
					}}
				>
					<Stack
						direction="row"
						sx={{ justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}
					>
						<Typography level="h3">
							Write a review for <span style={{ fontWeight: 800 }}>{housingData.name}</span>
						</Typography>
						{/* <Box
							sx={{ padding: 0, "&:hover": { cursor: "pointer" } }}
							onClick={() => setReviewModalOpen(false)}
						>
							<CloseIcon fontSize="large" />
						</Box> */}
					</Stack>
					{(loading || !housingData.roomTypes) && (
						<Box
							sx={{
								height: "100%",
								width: "100%",
								padding: "3rem",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<CircularProgress />
						</Box>
					)}
					{categories && ratings && housingData.roomTypes && !loading && (
						<>
							<Stack spacing={2} sx={!session ? { filter: "blur(4px)", opacity: 0.2 } : {}}>
								<Box>
									<Typography level="body-md" fontWeight="xl">
										Room Type
									</Typography>
									<Typography level="body-sm" sx={{ marginBottom: "0.25rem" }}>
										Select the room type that you live/lived in:
									</Typography>
									<Box sx={{ width: "40%" }}>
										<FormSelect
											name={"roomType"}
											value={roomType}
											error={roomTypeError}
											onChange={handleRoomTypeChange}
											options={housingData.roomTypes}
										/>
									</Box>
								</Box>
								{categories.map((category) => (
									<Box key={category.name}>
										<Typography level="body-md" fontWeight="xl">
											{category.name}
										</Typography>
										<Typography level="body-sm">
											{`Rate ${housingData.name}'${
												housingData.name.slice(-1) !== "s" ? "s" : ""
											} ${category.name.toLowerCase()} from 1-5:`}
										</Typography>
										<ClickableRating
											value={ratings[category.name]}
											category={category.name}
											onChange={handleRatingClick}
										/>
										{ratingsErrors[category.name] && (
											<Typography
												sx={{ marginTop: "2px", fontWeight: 400 }}
												level="body-xs"
												color="danger"
											>
												Error: {ratingsErrors[category.name]}
											</Typography>
										)}
									</Box>
								))}
								<Box>
									<Typography level="body-md" fontWeight="xl">
										Additional Details
									</Typography>
									<Typography level="body-sm" sx={{ marginBottom: "0.5rem" }}>
										Please share any of your positive or negative experiences at {housingData.name}{" "}
										that would be informative for other students:
									</Typography>
									<Textarea
										minRows={5}
										maxRows={5}
										size="sm"
										placeholder={`Maximum ${contentCharLimit} characters`}
										value={content}
										onChange={handleContentChange}
										color={contentLimitNotification ? "danger" : "neutral"}
									/>
									<Box sx={{ width: "100%", textAlign: "end" }}>
										<Typography level="body-sm">Characters: {content.length}</Typography>
									</Box>
								</Box>
								{generalError && (
									<Typography sx={{ fontWeight: 400 }} level="body-sm" color="danger">
										Error: {generalError}
									</Typography>
								)}
								<Box
									sx={{
										width: "100%",
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<Button color="neutral" variant="outlined" onClick={handleCloseModal}>
										Cancel
									</Button>
									<Button
										color="primary"
										sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
										onClick={handleSubmit}
									>
										<span style={{ opacity: submitting ? 0 : 1 }}>Submit</span>
										{submitting && (
											<CircularProgress sx={{ position: "absolute" }} color="neutral" />
										)}
									</Button>
								</Box>
							</Stack>
							{!session && (
								<Box
									sx={{
										zIndex: 10,
										position: "absolute",
										width: "100%",
										height: "100%",
										left: 0,
										top: 0,
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										padding: "4rem",
									}}
								>
									<Stack
										spacing={2}
										sx={{
											backgroundColor: "white",
											padding: "1rem 1.5rem",
											borderRadius: "8px",
											border: `1px solid ${theme.palette.neutral[300]}`,
											textAlign: "center",
										}}
									>
										<Typography level="body-md" fontWeight="md">
											Interested in writing a review for{" "}
											<span style={{ fontWeight: 700 }}>{housingData.name}</span>?<br />
											Sign up now!
										</Typography>
										<Stack direction="row" spacing={1}>
											<Button
												sx={{
													flex: 1,
													padding: 0,
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
												}}
												color="neutral"
												variant="outlined"
												onClick={handleCloseModal}
											>
												Close
											</Button>
											<Button sx={{ flex: 1, padding: 0 }} color="primary">
												<Link
													style={{
														width: "100%",
														height: "100%",
														display: "flex",
														justifyContent: "center",
														alignItems: "center",
													}}
													to={`/signin?housingRedirect=${housingData.id}`}
												>
													Sign In/Up
												</Link>
											</Button>
										</Stack>
									</Stack>
								</Box>
							)}
						</>
					)}
					{(!categories || !housingData.roomTypes) && !loading && (
						<Box sx={{ height: "100%", width: "100%", padding: "3rem" }}>
							<Card>
								<Typography>
									{
										"We're having some technical difficulties right now. Please reload the page or try again later."
									}
								</Typography>
							</Card>
						</Box>
					)}
				</Box>
			</Box>
		</Modal>
	);
};

ReviewModal.propTypes = {
	reviewModalOpen: PropTypes.bool,
	setReviewModalOpen: PropTypes.func,
	housingData: PropTypes.object,
	setHousingData: PropTypes.func,
	categories: PropTypes.array,
	loading: PropTypes.bool,
};

export default ReviewModal;
