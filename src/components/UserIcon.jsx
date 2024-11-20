import useAuth from "../store/authStore";
import PropTypes from "prop-types";
import { Avatar } from "@mui/joy";

const UserIcon = ({ height, width, bgcolor = null }) => {
	const { session, publicUser } = useAuth();

	const getIconColor = () => {
		if (bgcolor !== null) {
			return bgcolor;
		}
		return publicUser?.icon_color || "neutral";
	};

	return (
		<Avatar
			sx={{
				bgcolor: getIconColor(),
				width: width,
				height: height,
				fontSize: `${Math.min(width, height) * 0.5}px`,
				fontWeight: "bold",
				variant: "soft",
			}}
		>
			{publicUser?.first_name[0]}
			{publicUser?.last_name[0]}
		</Avatar>
	);
};

UserIcon.propTypes = {
	height: PropTypes.number,
	width: PropTypes.number,
	bgcolor: PropTypes.string,
};

export default UserIcon;
