import { Box, Button, Typography, Stack, Card, CircularProgress } from "@mui/joy";
import { Grid2 } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getHousing } from "../functions/housingQueries";
import { getAllCategories } from "../functions/categoryQueries";
import { getAllTags } from "../functions/tagQueries";
import { useNavigate, useLocation } from "react-router-dom";
import { flagReview } from "../functions/reviewQueries";
import useAuth from "../store/authStore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Rating from "../components/Rating";
import CustomChip from "../components/CustomChip";
import Review from "../components/Review";
import NoReviewsCard from "../components/NoReviewsCard";
import ReviewForm from "../components/ReviewForm";
import CustomMap from "../components/CustomMap";

const HousingPage = () => {
	const { session } = useAuth();
	const { housingId } = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const [housingData, setHousingData] = useState(null);
	const [categories, setCategories] = useState(null); // For passing into the review form
	const [tags, setTags] = useState(null);
	const [pois, setPois] = useState(null);
	const [reviewFormOpen, setReviewFormOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [activePricingSemester, setActivePricingSemester] = useState("Fall/Spring");
	const [flagLoading, setFlagLoading] = useState(null);

	useEffect(() => {
		const loadHousingData = async () => {
			try {
				const housingRes = await getHousing(housingId);
				setHousingData(housingRes);
				const categoriesRes = await getAllCategories();
				setCategories(categoriesRes);
				const tagsRes = await getAllTags();
				setTags(tagsRes);
			} catch (error) {
				// TODO: Redirect on failure
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		loadHousingData();
	}, [housingId]);

	useEffect(() => {
		if (housingData) {
			const newPois = housingData.interest_points.map((ip) => ({
				key: ip.name,
				location: { lat: ip.lat, lng: ip.lng },
			}));
			setPois(newPois);
		}
	}, [housingData]);

	useEffect(() => {
		// Check if there's a param specifying to open the review form
		const queryParams = new URLSearchParams(location.search);
		if (queryParams.get("showReviewForm") === "true") {
			setReviewFormOpen(true);

			// Clear the param after receiving it
			queryParams.delete("showReviewForm");
			const newUrl = `${location.pathname}?${queryParams.toString()}`;
			navigate(newUrl, { replace: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	const handleClickReviewButton = () => {
		setReviewFormOpen(true);
	};

	const handleClickFlag = async (review_id) => {
		if (flagLoading) return;
		setFlagLoading(review_id);

		await flagReview(session.user.id, review_id);
		const newHousingData = await getHousing(housingId);
		setHousingData(newHousingData);
		setFlagLoading(null);
	};

	if (!housingData || !categories || !tags || !pois) {
		return (
			<Box
				sx={{
					width: "100%",
					height: "100vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ display: "flex", justifyContent: "center", padding: { xs: "1rem", sm: "2rem", md: "3rem" } }}>
			<Stack useFlexGap spacing={4} sx={{ width: { xs: "100%", lg: "85%", xl: "70%" } }}>
				{!reviewFormOpen && (
					<>
						{/* Header */}
						<Stack spacing={2}>
							{/* Header Image */}
							<img
								src={`/housingImages/${housingData.name}.jpg`}
								style={{ borderRadius: "0.75rem", height: "20rem", width: "100%", objectFit: "cover" }}
							></img>

							{/* Header Title/MOBILE Tag List/Review Button */}
							<Stack
								sx={{
									display: "flex",
									flexDirection: { xs: "column", sm: "row" },
									gap: "0.75rem",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<Typography level="h2">{housingData.name}</Typography>

								{/* Tag List (MOBILE SCREENS ONLY) */}
								<Box
									sx={{
										display: { xs: "flex", sm: "none" },
										justifyContent: { xs: "center", sm: "start" },
										gap: "0.75rem",
										flexWrap: "wrap",
									}}
								>
									{housingData.tags.map((tag) => (
										<CustomChip key={tag.tag_name} name={tag.tag_name} active={true} />
									))}
								</Box>

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

							{/* Tag List (SMALL SCREENS AND BIGGER) */}
							<Box
								sx={{
									display: { xs: "none", sm: "flex" },
									justifyContent: { xs: "center", sm: "start" },
									gap: "0.75rem",
									flexWrap: "wrap",
								}}
							>
								{housingData.tags.map((tag) => (
									<CustomChip key={tag.tag_name} name={tag.tag_name} active={true} />
								))}
							</Box>
						</Stack>

						{/* Average Ratings */}
						<Card>
							<Grid2 container spacing={2} sx={{ flexGrow: 1 }}>
								{housingData.average_ratings.map((average_rating) => (
									<Grid2 key={average_rating.category} size={{ xs: 6, md: 3 }}>
										<Rating
											type={"average"}
											title={average_rating.category}
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
										<Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
											<CustomChip
												name={"Fall/Spring"}
												active={activePricingSemester === "Fall/Spring"}
												onClick={
													activePricingSemester !== "Fall/Spring"
														? () => setActivePricingSemester("Fall/Spring")
														: null
												}
											/>
											<CustomChip
												name={"Summer A/B"}
												active={activePricingSemester === "Summer A/B"}
												onClick={
													activePricingSemester !== "Summer A/B"
														? () => setActivePricingSemester("Summer A/B")
														: null
												}
											/>
											<CustomChip
												name={"Summer C"}
												active={activePricingSemester === "Summer C"}
												onClick={
													activePricingSemester !== "Summer C"
														? () => setActivePricingSemester("Summer C")
														: null
												}
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
									<Box sx={{ height: "100%", position: "relative" }}>
										<CustomMap
											housingName={housingData.name}
											housingPosition={
												housingData
													? { lat: housingData.lat, lng: housingData.lng }
													: { lat: 0, lng: 0 }
											}
											pois={pois}
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
								{housingData.reviews
									.filter((review) => review.user.id === session?.user?.id)
									.map((review, index) => (
										<Review
											key={index}
											review={review}
											ownedByCurrentUser={true}
											session={session}
											handleClickFlag={handleClickFlag}
											flagLoading={flagLoading}
										/>
									))}
								{housingData.reviews
									.filter((review) => review.user.id !== session?.user?.id)
									.map((review, index) => (
										<Review
											key={index}
											review={review}
											session={session}
											ownedByCurrentUser={false}
											handleClickFlag={handleClickFlag}
											flagLoading={flagLoading}
										/>
									))}
								{housingData.reviews.length === 0 && (
									<NoReviewsCard
										housingName={housingData.name}
										handleClickReviewButton={handleClickReviewButton}
									/>
								)}
							</Stack>
						</Stack>
					</>
				)}

				{reviewFormOpen && (
					<Stack spacing={2}>
						<img
							src={`/housingImages/${housingData.name}.jpg`}
							style={{ borderRadius: "0.75rem", height: "20rem", width: "100%", objectFit: "cover" }}
						></img>
						<ReviewForm
							reviewFormOpen={reviewFormOpen}
							setReviewFormOpen={setReviewFormOpen}
							loading={loading}
							categories={categories}
							tags={tags}
							housingData={{
								id: housingId,
								name: housingData?.name,
								roomTypes: housingData?.room_types,
							}}
							setHousingData={setHousingData}
						/>
					</Stack>
				)}
			</Stack>
		</Box>
	);
};

export default HousingPage;
