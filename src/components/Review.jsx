import { Card, Stack, Typography, Box, Button, CircularProgress } from "@mui/joy";
import { Grid2 } from "@mui/material";
import { useTheme } from "@mui/joy/styles";
import FlagIcon from "@mui/icons-material/Flag";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import Rating from "./Rating";
import PropTypes from "prop-types";
import useAuth from "../store/authStore";
import CustomChip from "./CustomChip";

const Review = ({ review, ownedByCurrentUser, handleClickFlag, flagLoading }) => {
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
				<Stack direction="row" sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
					<Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
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
									{review.user.year}
									{["First", "Second", "Third", "Fourth", "Fifth"].includes(review.user.year) &&
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
					{session?.user?.id && (
						<Button
							color="neutral"
							variant="soft"
							sx={{ position: "relative" }}
							onClick={() => handleClickFlag(review.review_id)}
						>
							{flagLoading === review.review_id && (
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
									opacity: flagLoading === review.review_id ? 0 : 1,
								}}
							>
								{review.flags.filter((flag) => flag.user_id === session.user.id).length > 0 ? (
									<FlagIcon sx={{ color: "red.main", fontSize: "26px" }} />
								) : (
									<OutlinedFlagIcon sx={{ fontSize: "26px" }} />
								)}
								<Typography level="body-sm">{review.flags.length}</Typography>
							</Box>
						</Button>
					)}
				</Stack>
			</Stack>
		</Card>
	);
};

Review.propTypes = {
	review: PropTypes.object,
	ownedByCurrentUser: PropTypes.bool,
	handleClickFlag: PropTypes.func,
	flagLoading: PropTypes.number,
};

export default Review;
