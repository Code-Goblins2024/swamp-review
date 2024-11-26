import { Chip, Typography } from "@mui/joy";
import PropTypes from "prop-types";

const CustomChip = ({ name, active, onClick }) => {
	return (
		<Chip
			onClick={onClick}
      variant="soft"
      color={active ? "primary" : "neutral"}
      sx={{
        borderRadius: "5px",
        padding: "0.25rem 0.75rem",
      }}
		>
			<Typography level="body-sm" fontWeight="lg">
				{name}
			</Typography>
		</Chip>
	);
};

CustomChip.propTypes = {
	name: PropTypes.string,
	active: PropTypes.bool,
	onClick: PropTypes.func,
};

export default CustomChip;
