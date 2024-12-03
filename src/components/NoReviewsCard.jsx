/**
 * Placeholder card for when a housing page has no reviews
 */
import PropTypes from "prop-types";
import { Card, Typography, Button } from "@mui/joy";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const NoReviewsCard = ({ housingName, handleClickReviewButton }) => {
	return (
		<Card
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				padding: "2rem",
				flexDirection: { xs: "column", sm: "row" },
			}}
		>
			<Typography sx={{ textAlign: { xs: "center", sm: "start" } }} level="body-md">
				Be the first to write a review for {housingName}!
			</Typography>

			{/* TODO: Link this button to open the review form */}
			<Button
				color="primary"
				size="md"
				onClick={handleClickReviewButton}
				sx={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: "0.2rem",
				}}
			>
				<Typography color="white" level="body-sm">
					Review
				</Typography>
				<ArrowForwardIcon color="white" fontSize="small" />
			</Button>
		</Card>
	);
};

NoReviewsCard.propTypes = {
	housingName: PropTypes.string,
	handleClickReviewButton: PropTypes.func,
};

export default NoReviewsCard;
