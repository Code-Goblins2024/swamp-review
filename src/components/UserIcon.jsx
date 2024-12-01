import useAuth from "../store/authStore";
import PropTypes from "prop-types";
import { Avatar, Tooltip, Typography } from "@mui/joy";
import UserCard from "./UserCard";
import tinycolor from "tinycolor2";
import {
  useTheme,
  getContrastRatio,
  decomposeColor,
} from "@mui/material/styles";

const UserIcon = ({
  height,
  width,
  user,
  bgcolor = null,
  hoverable = false,
}) => {
  const { session, publicUser } = useAuth();
  const theme = useTheme();

  const getIconColor = () => {
    if (bgcolor !== null) {
      return bgcolor;
    }
    return user?.icon_color || publicUser?.icon_color || "neutral";
  };

  const getInitials = () => {
    if (user && user.first_name && user.last_name) {
      return user?.first_name[0] + user?.last_name[0];
    }
    return publicUser?.first_name[0] + publicUser?.last_name[0];
  };

  function getContrastColor(bgColor) {
	const color = tinycolor(bgColor, { format: "rgb" }).toRgbString();
	
    return getContrastRatio(color, "#fff") > 4.5
      ? "#fff"
      : "#111";
  }

  return hoverable ? (
    <Tooltip
      placement="top-end"
      variant="outlined"
      arrow
      title={<UserCard user_id={user?.id} isEditable={false} />}
    >
      <Avatar
        sx={{
          bgcolor: getIconColor(),
          width: width,
          height: height,
		  variant: "soft",
        }}
      >
        <Typography
          level="body-sm"
          sx={{
            fontSize: `${Math.min(width, height) * 0.5}px`,
            fontWeight: "bold",
			color: getContrastColor(getIconColor()),
          }}
        >
          {getInitials()}
        </Typography>
      </Avatar>
    </Tooltip>
  ) : (
    <Avatar
      sx={{
        bgcolor: getIconColor(),
        width: width,
        height: height,
        variant: "soft",
      }}
    >
      <Typography
        level="body-sm"
        sx={{
          fontSize: `${Math.min(width, height) * 0.5}px`,
          fontWeight: "bold",
		  color: getContrastColor(getIconColor()),
        }}
      >
        {getInitials()}
      </Typography>
    </Avatar>
  );
};

UserIcon.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  bgcolor: PropTypes.string,
};

export default UserIcon;
