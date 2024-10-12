import { Box, Typography, Stack, Card } from "@mui/joy";
import { Grid2 } from "@mui/material";
import { useState } from "react";
import Rating from "../components/Rating";
import PricingChip from "../components/PricingChip";
import Review from "../components/Review";

const DormPage = () => {
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
	const tempPricing = [
		{
			name: "Traditional Single",
			fallSpringPrice: 3200,
			summerABPrice: 1564,
			summerCPrice: 2345,
		},
		{
			name: "Traditional Double",
			fallSpringPrice: 6400,
			summerABPrice: 3264,
			summerCPrice: 4423,
		},
	];

	const features = ["Twin XL Beds", "Game Room", "Study Longue", "Pool", "Laundry Facilities"];
	const [activePricingSemester, setActivePricingSemester] = useState("Fall/Spring");

	return (
		<Box sx={{ display: "flex", justifyContent: "center", padding: { xs: "1rem", sm: "2rem", md: "3rem" } }}>
			<Stack useFlexGap spacing={4} sx={{ width: { xs: "100%", lg: "85%", xl: "70%" } }}>
				{/* Header (Image/Title) */}
				<Stack spacing={2}>
					<img
						src="./beaty.jpg"
						style={{ borderRadius: "0.75rem", height: "20rem", width: "100%", objectFit: "cover" }}
					></img>
					<Typography level="h1">Beaty Towers</Typography>
				</Stack>

				{/* Average Ratings */}
				<Card>
					<Grid2 container spacing={2} sx={{ flexGrow: 1 }}>
						{tempCategories.map((category) => (
							<Grid2 key={category.name} size={{ xs: 6, md: 3 }}>
								<Rating type={"average"} title={category.name} rating={category.rating} />
							</Grid2>
						))}
					</Grid2>
				</Card>

				{/* Pricing/Features/POI */}
				<Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ display: "flex" }}>
					{/* Pricing/Features */}
					<Stack spacing={2} sx={{ flex: 1 }}>
						<Card sx={{ flexGrow: 1, padding: "1.25rem" }}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									flexWrap: "wrap",
									gap: "0.5rem",
								}}
							>
								<Typography level="h4" fontWeight="xl">
									Pricing
								</Typography>
								<Box sx={{ display: "flex", flexWrap: "nowrap", gap: "0.5rem" }}>
									<PricingChip
										semester={"Fall/Spring"}
										activePricingSemester={activePricingSemester}
										setActivePricingSemester={setActivePricingSemester}
									/>
									<PricingChip
										semester={"Summer A/B"}
										activePricingSemester={activePricingSemester}
										setActivePricingSemester={setActivePricingSemester}
									/>
									<PricingChip
										semester={"Summer C"}
										activePricingSemester={activePricingSemester}
										setActivePricingSemester={setActivePricingSemester}
									/>
								</Box>
							</Box>
							<Stack direction="row">
								<Stack spacing={0.5} sx={{ flexGrow: 1 }}>
									<Typography level="body-md" fontWeight="xl">
										Room
									</Typography>
									{tempPricing.map((pricing, index) => (
										<Typography key={index} level="body-md">
											{pricing.name}
										</Typography>
									))}
								</Stack>
								<Stack spacing={0.5}>
									<Typography level="body-md" fontWeight="xl" sx={{ marginRight: "1rem" }}>
										Price
									</Typography>
									{tempPricing.map((pricing, index) => (
										<Typography key={index} level="body-md">
											{new Intl.NumberFormat("en-US", {
												style: "currency",
												currency: "USD",
												minimumFractionDigits: 0,
												maximumFractionDigits: 0,
											}).format(
												activePricingSemester === "Fall/Spring"
													? pricing.fallSpringPrice
													: activePricingSemester === "Summer A/B"
													? pricing.summerABPrice
													: pricing.summerCPrice
											)}
										</Typography>
									))}
								</Stack>
							</Stack>
						</Card>

						{/* Features */}
						<Card sx={{ flexGrow: 1, padding: "1.25rem" }}>
							<Typography level="h4" fontWeight="xl">
								Features
							</Typography>
							{features.map((feature, index) => (
								<Typography key={index} level="body-md">
									{feature}
								</Typography>
							))}
						</Card>
					</Stack>

					{/* POI (Right) Side */}
					<Box sx={{ flex: 1 }}>
						<Card sx={{ height: "100%" }}>
							<div style={{ height: "100%", overflow: "hidden", backgroundColor: "red" }}>
								<img
									src="./map_placeholder.png"
									style={{ height: "100%", width: "100%", objectFit: "cover" }}
								/>
							</div>
						</Card>
					</Box>
				</Stack>

				{/* Reviews */}
				<Stack spacing={2}>
					<Typography level="h4">Read #### reviews</Typography>
					<Stack spacing={4}>
						<Review />
						<Review />
						<Review />
					</Stack>
				</Stack>
			</Stack>
		</Box>
	);
};

export default DormPage;
