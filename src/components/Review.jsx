import { Card, Stack, Typography, Box } from "@mui/joy";
import { Grid2 } from "@mui/material";
import Rating from "./Rating";
import PropTypes from "prop-types";

const Review = ({ review }) => {
	return (
		<Card>
			<Stack spacing={2} sx={{ padding: "0.5rem" }}>
				<Grid2 container spacing={2} sx={{ flexGrow: 1 }}>
					{review.ratings.map((rating, index) => (
						<Grid2 key={index} size={{ xs: 6, md: 3 }}>
							<Rating type="review" title={rating.category.name} rating={rating.value} />
						</Grid2>
					))}
				</Grid2>
				{review.content && <Typography level="body-md">{review.content}</Typography>}
				<Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
					<Box>
						<Typography level="body-sm" fontWeight="lg">
							{review.user.first_name} {review.user.last_name},{" "}
							{new Date(review.created_at)
								.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
								})
								.replaceAll(",", "")}
						</Typography>
					</Box>
					<Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
						<Typography>&bull;</Typography>
						<Typography level="body-sm" fontWeight="lg">
							{review.user.year}
							{["First", "Second", "Third", "Fourth", "Fifth"].includes(review.user.year) && "-year"}
						</Typography>
					</Stack>

					{/* TODO: Update this pull the room the student lived in from the review */}
					{/* <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
          <Typography>&bull;</Typography>
          <Typography level="body-sm" fontWeight="lg">
            Traditional Single
          </Typography>
        </Stack> */}
				</Stack>
			</Stack>
		</Card>
	);
};

Review.propTypes = {
	review: PropTypes.object,
};

export default Review;
