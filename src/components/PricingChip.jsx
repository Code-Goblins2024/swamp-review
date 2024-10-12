import { Chip } from "@mui/joy";
import PropTypes from "prop-types";

const PricingChip = ({ semester, activePricingSemester, setActivePricingSemester }) => {
	return (
		<Chip
			sx={
				activePricingSemester === semester
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
					  }
			}
			onClick={() => setActivePricingSemester(semester)}
		>
			{semester}
		</Chip>
	);
};

PricingChip.propTypes = {
	semester: PropTypes.string.isRequired,
	activePricingSemester: PropTypes.string.isRequired,
	setActivePricingSemester: PropTypes.func.isRequired,
};

export default PricingChip;
