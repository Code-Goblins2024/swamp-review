import { Chip } from "@mui/joy";
import PropTypes from "prop-types";

const ClickableTagChip = ({ name, active, handleTagClick }) => {
	return (
		<Chip
			sx={
				active
					? {
							borderRadius: "5px",
							backgroundColor: "primary.50", // Custom background color
							".MuiChip-label": {
								backgroundColor: "primary.50",
								"&:hover": {
									backgroundColor: "primary.50", // Change color on hover
								},
							},
							".MuiChip-action": {
								backgroundColor: "primary.50",
								"&:hover": {
									backgroundColor: "primary.50", // Change color on hover
								},
							},
							"&:hover": {
								backgroundColor: "primary.50", // Change color on hover
							},
							borderColor: "primary.400",
							borderWidth: "1px",
							padding: "0.25rem 0.75rem",
					  }
					: {
							borderRadius: "5px",
							backgroundColor: "grey.100", // Custom background color
							".MuiChip-label": {
								backgroundColor: "grey.100",
							},
							overflow: "hidden",
							".MuiChip-action": {
								backgroundColor: "grey.100",
								borderRadius: 0,
							},
							"&:hover": {
								backgroundColor: "grey.400", // Change color on hover
							},
							borderColor: "grey.700",
							borderWidth: "1px",
							padding: "0.25rem 0.75rem",
					  }
			}
			onClick={handleTagClick}
		>
			{name}
		</Chip>
	);
};

ClickableTagChip.propTypes = {
	name: PropTypes.string,
	active: PropTypes.bool,
	onClick: PropTypes.func,
};

export default ClickableTagChip;
