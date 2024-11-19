import { useState, useEffect } from "react";
import useAuth from "../store/authStore";
import { getUser } from "../functions/userQueries";
import { Avatar } from "@mui/joy";
import PropTypes from "prop-types";

const UserIcon = ({ height, width, bgcolor = null }) => {
	const { session } = useAuth();
	const [user, setUser] = useState([]);

	useEffect(() => {
		if (session) {
			fetchUser();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	const fetchUser = async () => {
		try {
			const data = await getUser(session.user.id);
			setUser(data[0]);
		} catch (error) {
			console.error("Error fetching user:", error);
			setUser([]);
		}
	};

	const firstInitial = user?.first_name ? user.first_name[0] : "";
	const lastInitial = user?.last_name ? user.last_name[0] : "";

	const getIconColor = () => {
		if (bgcolor !== null) {
			return bgcolor;
		}
		if (user && user.icon_color) {
			return user.icon_color;
		}
		return "neutral";
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
			{firstInitial}
			{lastInitial}
		</Avatar>
	);
};

UserIcon.propTypes = {
	height: PropTypes.number,
	width: PropTypes.number,
	bgcolor: PropTypes.string,
};

export default UserIcon;
