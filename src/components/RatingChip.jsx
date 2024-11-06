import { Chip } from "@mui/joy";
import PropTypes from "prop-types";

const RatingChip = ({ children }) => {
	return (
		<Chip
			color="primary"
			sx={{
				borderRadius: "5px",
				backgroundColor: "primary.50",
				borderColor: "primary.400",
				borderWidth: "1px",
			}}
		>
			{children}
		</Chip>
	);
};

RatingChip.propTypes = {
	children: PropTypes.node,
};

export default RatingChip;
