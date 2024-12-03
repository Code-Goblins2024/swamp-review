/**
 * Standard component for displaying ratings
 * Accepts a "type" prop with two options - "average" for categorical ratings displayed at the top of dorm pages,
 * and "review" for categorical ratings that are displayed on each individual review
 */
import { Typography, Box, Stack, Chip } from "@mui/joy";
import { StarHalf, Star, StarOutline } from "@mui/icons-material";
import { useMemo, useState, useLayoutEffect } from "react";
import PropTypes from "prop-types";

const Rating = ({ type, title, rating }) => {
	const trailingDecimal = useMemo(() => {
		return Math.round((Math.round((rating - Math.floor(rating)) * 100) / 100) * 2) / 2;
	}, [rating]);

	const [starStyle, setStarStyle] = useState({});
	const [titleLevel, setTitleLevel] = useState("");

	useLayoutEffect(() => {
		if (type === "average") {
			setStarStyle({ fontSize: { xs: "1.3rem", md: "1.3rem", lg: "1.5rem" }, color: "#FFDF00" });
			setTitleLevel("body-md");
		}
		if (type === "review") {
			setStarStyle({ fontSize: { xs: "1.35rem", md: "1.15rem", lg: "1.35rem" }, color: "#FFDF00" });
			setTitleLevel("body-sm");
		}
	}, [type]);

	return (
		<>
			<Typography
				level={titleLevel}
				fontWeight="lg"
				sx={{ paddingLeft: "0.1rem", textAlign: { xs: "center", md: "start" } }}
			>
				{title}
			</Typography>
			<Box>
				<Stack
					direction="row"
					spacing={1}
					sx={{
						justifyContent: { xs: "center", md: "start" },
						alignItems: "center",
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						{Array.from({
							length: Math.floor(rating),
						}).map((_, index) => (
							<Star key={index} sx={starStyle} fontSize="medium" />
						))}

						{/* Render Either Empty, Half, or Solid Star Based On Trailing Decimal */}
						{trailingDecimal == 0.5 && <StarHalf sx={starStyle} fontSize="medium" />}
						{trailingDecimal == 1 && <Star sx={starStyle} fontSize="medium" />}

						{/* Render All Outline Stars */}
						{Array.from({
							length: Math.round(5 - Math.ceil(rating)),
						}).map((_, index) => (
							<StarOutline key={index} sx={starStyle} fontSize="medium" />
						))}
					</Box>
					{type === "average" && (
            <Chip
              color="primary"
              variant="outlined"
              sx={{
                borderRadius: "5px",
                borderWidth: "1px",
              }}
            >
              <Typography sx={{ fontSize: { xs: "1rem", sm: "1.1rem", lg: "1.2rem" } }} fontWeight="xl">
              {rating.toFixed(1)}
            </Typography>
            </Chip>
					)}

					{type === "review" && (
						<Typography sx={{ fontSize: { xs: "0.9rem", sm: "0.95rem", lg: "1rem" } }} fontWeight="xl">
							{rating.toFixed(1)}
						</Typography>
					)}
				</Stack>
			</Box>
		</>
	);
};

Rating.propTypes = {
	type: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	rating: PropTypes.number.isRequired,
};

export default Rating;
