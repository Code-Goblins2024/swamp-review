import { Chip } from "@mui/joy";
import PropTypes from "prop-types";

const CustomChip = ({ children }) => {
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

CustomChip.propTypes = {
	children: PropTypes.node,
};

export default CustomChip;
