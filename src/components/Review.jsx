/**
 * Standard component for displaying user reviews - takes in review object and follows standard table structure from Supabase to display
 * Accepts "ownedByCurrentUser" prop for custom styling when the current user wrote the review
 * Accepts "handleClickFlag" and "flagLoading" props for reporting/loading while reporting reviews
 */
import { Card, Stack, Typography, Box, Button, CircularProgress } from "@mui/joy";
import { Grid2 } from "@mui/material";
import { useTheme } from "@mui/joy/styles";
import FlagIcon from "@mui/icons-material/Flag";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import DeleteIcon from "@mui/icons-material/Delete";
import Rating from "./Rating";
import PropTypes from "prop-types";
import useAuth from "../store/authStore";
import CustomChip from "./CustomChip";
import UserIcon from "./UserIcon";

const Review = ({ review, ownedByCurrentUser, handleDeleteReview, deleteLoading, handleClickFlag, flagLoading }) => {
	const theme = useTheme();
	const { session } = useAuth();

	return (
		<Card sx={{ border: ownedByCurrentUser ? `1px solid ${theme.palette.primary[300]}` : "" }}>
			<Stack spacing={2} sx={{ padding: "0.5rem" }}>
				<Grid2 container spacing={2} sx={{ flexGrow: 1 }}>
					{review.ratings.map((rating, index) => (
						<Grid2 key={index} size={{ xs: 6, md: 3 }}>
							<Rating type="review" title={rating.category.name} rating={rating.value} />
						</Grid2>
					))}
				</Grid2>
				{review.content && <Typography level="body-md">{review.content}</Typography>}
				{review.tags.length > 0 && (
					<Box sx={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
						{review.tags.map((tag) => (
							<CustomChip key={tag.id} active={true} name={tag.name} />
						))}
					</Box>
				)}
				{/* <Stack direction="row" sx={{ justifyContent: "space-between" }}> */}
				<Grid2 container spacing={1}>
					<Grid2 size={{ xs: 12, sm: 10 }}>
						<Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
							<UserIcon user={review.user} hoverable={true} />
							<Box>
								<Typography level="body-sm" fontWeight="lg">
									{ownedByCurrentUser ? (
										<Typography color="primary" fontWeight="xl">
											Me
										</Typography>
									) : (
										<>
											{review.user.first_name} {review.user.last_name}
										</>
									)}
									{", "}
									{new Date(review.created_at)
										.toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})
										.replaceAll(",", "")}
								</Typography>
							</Box>
							{review?.user?.year && (
								<Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
									<Typography>&bull;</Typography>
									<Typography level="body-sm" fontWeight="lg">
										{review.year_lived}
										{["First", "Second", "Third", "Fourth", "Fifth"].includes(review.year_lived) &&
											"-year"}
									</Typography>
								</Stack>
							)}

							{review?.roomType && (
								<Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
									<Typography>&bull;</Typography>
									<Typography level="body-sm" fontWeight="lg">
										{review.roomType.name}
									</Typography>
								</Stack>
							)}
						</Stack>
					</Grid2>
					{session?.user?.id && (
						<Grid2 size={{ xs: 12, sm: 2 }} sx={{ display: "flex", justifyContent: "end" }}>
							<Button
								color="neutral"
								variant="soft"
								size="sm"
								sx={{ position: "relative" }}
								onClick={
									ownedByCurrentUser
										? () => handleDeleteReview(review.review_id)
										: () => handleClickFlag(review.review_id)
								}
							>
								{(flagLoading === review.review_id || deleteLoading === review.review_id) && (
									<CircularProgress
										sx={{
											position: "absolute",
											top: "50%",
											left: "50%",
											transform: "translate(-50%, -50%)",
										}}
									/>
								)}
								<Box
									sx={{
										display: "flex",
										gap: "0.5rem",
										opacity:
											flagLoading === review.review_id || deleteLoading === review.review_id
												? 0
												: 1,
									}}
								>
									{!ownedByCurrentUser && (
										<>
											{review.flags.filter((flag) => flag.user_id === session.user.id).length >
												0 ? (
												<FlagIcon sx={{ color: "red.main", fontSize: "24px" }} />
											) : (
												<OutlinedFlagIcon sx={{ fontSize: "24px" }} />
											)}
											<Typography level="body-sm">{review.flags.length}</Typography>
										</>
									)}
									{ownedByCurrentUser && <DeleteIcon sx={{ fontSize: "24px" }} />}
								</Box>
							</Button>
						</Grid2>
					)}
				</Grid2>
				{/* </Stack> */}
			</Stack>
		</Card>
	);
};

Review.propTypes = {
	review: PropTypes.object,
	ownedByCurrentUser: PropTypes.bool,
	handleDeleteReview: PropTypes.func,
	deleteLoading: PropTypes.bool,
	handleClickFlag: PropTypes.func,
	flagLoading: PropTypes.number,
};

export default Review;
