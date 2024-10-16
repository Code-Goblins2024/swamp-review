import { Card, Stack, Typography, Box } from "@mui/joy";
import { Grid2 } from "@mui/material";
import Rating from "./Rating";

const Review = () => {
	const tempCategories = [
		{
			name: "Location",
			rating: 4.0,
		},
		{
			name: "Rooms",
			rating: 3.9,
		},
		{
			name: "Bathrooms",
			rating: 2.4,
		},
		{
			name: "Amenities",
			rating: 5.0,
		},
	];

	return (
		<Card>
			<Stack spacing={2} sx={{ padding: "0.5rem" }}>
				<Grid2 container spacing={2} sx={{ flexGrow: 1 }}>
					{tempCategories.map((category) => (
						<Grid2 key={category.name} size={{ xs: 6, md: 3 }}>
							<Rating type="review" title={category.name} rating={category.rating} />
						</Grid2>
					))}
				</Grid2>
				<Typography level="body-md">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit corporis commodi illum reprehenderit
					aperiam neque, culpa fugit sint numquam vitae dolorum natus quas, fuga officiis ut eaque ullam
					similique nostrum?
				</Typography>
				<Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
					<Box>
						<Typography level="body-sm" fontWeight="lg">
							Jordan Sheehan, Oct 11 2024
						</Typography>
					</Box>
					<Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
						<Typography>&bull;</Typography>
						<Typography level="body-sm" fontWeight="lg">
							Freshman
						</Typography>
					</Stack>
					<Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
						<Typography>&bull;</Typography>
						<Typography level="body-sm" fontWeight="lg">
							Traditional Single
						</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Card>
	);
};

export default Review;
