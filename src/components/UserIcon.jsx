import useAuth from "../store/authStore";
import PropTypes from "prop-types";
import { Avatar } from "@mui/joy";

const UserIcon = ({ height, width, bgcolor = null }) => {
	const { session } = useAuth();

	const getIconColor = () => {
		if (bgcolor !== null) {
			return bgcolor;
		}
		return session.user.data?.icon_color || "neutral";
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
			{session.user.data.first_name[0]}
			{session.user.data.last_name[0]}
		</Avatar>
	);
};

UserIcon.propTypes = {
	height: PropTypes.number,
	width: PropTypes.number,
	bgcolor: PropTypes.string,
};

export default UserIcon;
