import { Star, StarOutline } from "@mui/icons-material";
import { Box, Stack } from "@mui/joy";
import PropTypes from "prop-types";

const ClickableRating = ({ value, category, onChange }) => {
	const starStyle = { fontSize: { xs: "1.5em", md: "1.7rem", lg: "1.9rem" }, color: "#FFDF00" };

	return (
		<Stack direction="row">
			{Array.from({ length: 5 }, (_, i) => i + 1).map((index) => (
				<Box
					direction="row"
					key={index}
					sx={{ padding: 0, "&:hover": { cursor: "pointer" } }}
					onClick={() => onChange(category, index)}
				>
					{value >= index ? <Star sx={starStyle} /> : <StarOutline sx={starStyle} />}
				</Box>
			))}
		</Stack>
	);
};

ClickableRating.propTypes = {
	value: PropTypes.number,
	category: PropTypes.string,
	onChange: PropTypes.func,
};

export default ClickableRating;
