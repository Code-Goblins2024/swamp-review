import { Box, Button, Typography, Stack, Card } from "@mui/joy";
import { Grid2 } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getHousing } from "../functions/housingQueries";
import { getAllCategories } from "../functions/categoryQueries";
import { getAvgRatingByCategoryForHousing } from "../functions/housingQueries";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Rating from "../components/Rating";
import PricingChip from "../components/PricingChip";
import Review from "../components/Review";
import NoReviewsCard from "../components/NoReviewsCard";
import ReviewModal from "../components/ReviewModal";

const HousingPage = () => {
	const { housingId } = useParams();
	const [housingData, setHousingData] = useState(null);
	const [categories, setCategories] = useState(null); // For passing into the review modal
	const [avgRatings, setAvgRatings] = useState(null);
	const [reviewModalOpen, setReviewModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [activePricingSemester, setActivePricingSemester] = useState("Fall/Spring");

	useEffect(() => {
		const loadHousingData = async () => {
			try {
				const housingRes = await getHousing(housingId);
				setHousingData(housingRes);
				const categoriesRes = await getAllCategories();
				setCategories(categoriesRes);

				const avgRes = await getAvgRatingByCategoryForHousing(housingId);
				setAvgRatings(avgRes);
			} catch (error) {
				// TODO: Redirect on failure
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		loadHousingData();
	}, [housingId]);

	const handleClickReviewButton = () => {
		setReviewModalOpen(true);
	};

	if (!housingData) return null;
	if (!avgRatings) return null;

	return (
		<Box sx={{ display: "flex", justifyContent: "center", padding: { xs: "1rem", sm: "2rem", md: "3rem" } }}>
			<Stack useFlexGap spacing={4} sx={{ width: { xs: "100%", lg: "85%", xl: "70%" } }}>
				{/* Header (Image/Title) */}
				<Stack spacing={2}>
					<img
						src={`/housingImages/${housingData.name}.jpg`}
						style={{ borderRadius: "0.75rem", height: "20rem", width: "100%", objectFit: "cover" }}
					></img>
					<Stack
						sx={{
							display: "flex",
							flexDirection: { xs: "column", sm: "row" },
							gap: "0.75rem",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Typography level="h1">{housingData.name}</Typography>
						<Button
							color="primary"
							size="lg"
							onClick={handleClickReviewButton}
							sx={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								gap: "0.2rem",
							}}
						>
							<Typography color="white" level="body-md">
								Review
							</Typography>
							<ArrowForwardIcon color="white" fontSize="small" />
						</Button>
					</Stack>
				</Stack>

				{/* Average Ratings */}
				<Card>
					<Grid2 container spacing={2} sx={{ flexGrow: 1 }}>
						{housingData.average_ratings.map((average_rating) => (
							<Grid2 key={average_rating.category.name} size={{ xs: 6, md: 3 }}>
								<Rating
									type={"average"}
									title={average_rating.category.name}
									rating={average_rating.value}
								/>
							</Grid2>
						))}
						{housingData.average_ratings.length === 0 && (
							<>
								{categories.map((category) => (
									<Grid2 key={category.name} size={{ xs: 6, md: 3 }}>
										<Rating type={"average"} title={category.name} rating={0.0} />
									</Grid2>
								))}
							</>
						)}
					</Grid2>
				</Card>

				{/* Pricing/Features/POI */}
				<Stack direction={{ xs: "column", md: "row" }} spacing={2}>
					{/* Pricing/Features */}
					<Stack spacing={2} sx={{ flex: 1 }}>
						<Card>
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
									{housingData.room_types.map((room_type, index) => (
										<Typography key={index} level="body-md">
											{room_type.name}
										</Typography>
									))}
								</Stack>
								<Stack spacing={0.5}>
									<Typography level="body-md" fontWeight="xl" sx={{ marginRight: "1rem" }}>
										Price
									</Typography>
									{housingData.room_types.map((room_type, index) => (
										<Typography key={index} level="body-md">
											{new Intl.NumberFormat("en-US", {
												style: "currency",
												currency: "USD",
												minimumFractionDigits: 0,
												maximumFractionDigits: 0,
											}).format(
												activePricingSemester === "Fall/Spring"
													? room_type.fall_spring_price
													: activePricingSemester === "Summer A/B"
														? room_type.summer_AB_price
														: room_type.summer_C_price
											)}
										</Typography>
									))}
								</Stack>
							</Stack>
						</Card>

						{/* Features */}
						<Card sx={{ padding: "1.25rem" }}>
							<Typography level="h4" fontWeight="xl">
								Features
							</Typography>
							{housingData.attributes.map((attribute, index) => (
								<Typography key={index} level="body-md">
									{attribute.attribute_name}
								</Typography>
							))}
						</Card>
					</Stack>

					{/* POI (Right) Side */}
					<Box sx={{ flex: 1 }}>
						<Card sx={{ height: "100%" }}>
							<Box sx={{ height: "100%", position: "relative" }}> <Box component="img"
								src="/map_placeholder.png"
								alt="Map placeholder"
								sx={{
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									width: "100%",
									height: "100%",
									objectFit: "cover",
								}}
							/>
							</Box>
						</Card>
					</Box>
				</Stack>

				{/* Reviews */}
				<Stack spacing={2}>
					{housingData.reviews.length === 0 && <Typography level="h4">No reviews yet</Typography>}
					{housingData.reviews.length > 0 && (
						<Typography level="h4">
							Read {housingData.reviews.length} review{housingData.reviews.length !== 1 && "s"}
						</Typography>
					)}
					<Stack spacing={4}>
						{housingData.reviews.map((review, index) => (
							<Review key={index} review={review} />
						))}
						{housingData.reviews.length === 0 && (
							<NoReviewsCard
								housingName={housingData.name}
								handleClickReviewButton={handleClickReviewButton}
							/>
						)}
					</Stack>
				</Stack>
			</Stack>

			<ReviewModal
				reviewModalOpen={reviewModalOpen}
				setReviewModalOpen={setReviewModalOpen}
				loading={loading}
				categories={categories}
				housingData={{
					id: housingId,
					name: housingData?.name,
					roomTypes: housingData?.room_types,
				}}
				setHousingData={setHousingData}
			/>
		</Box>
	);
};

export default HousingPage;
