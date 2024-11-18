import { Card, Stack, Typography, Box, Button } from "@mui/joy";
import { Grid2 } from "@mui/material";
import Rating from "./Rating";
import PropTypes from "prop-types";
import CustomChip from "./CustomChip";
import { flagReview } from "../functions/reviewQueries";

async function handleFlagging(uuid, review_id) {
    try {
        await flagReview(uuid, review_id);
    } catch (error) {
        console.log(error)
    }
}

const Review = ({ review, session }) => {
    return (
        <Card>
            <Stack spacing={2} sx={{ padding: "0.5rem" }}>
                <Grid2 container spacing={2} sx={{ flexGrow: 1 }}>
                    {review.ratings.map((rating, index) => (
                        <Grid2 key={index} size={{ xs: 6, md: 3 }}>
                            <Rating type="review" title={rating.category.name} rating={rating.value} />
                        </Grid2>
                    ))}
                    <Button type="button" onClick={() => handleFlagging(session.user.id, review.review_id)}>Flag</Button>
                </Grid2>
                {review.content && <Typography level="body-md">{review.content}</Typography>}
                {review.tags.length > 0 && (
                    <Box sx={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {review.tags.map((tag) => (
                            <CustomChip key={tag.id} active={true} name={tag.name} />
                        ))}
                    </Box>
                )}
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                    <Box>
                        <Typography level="body-sm" fontWeight="lg">
                            {review.user.first_name} {review.user.last_name},{" "}
                            {new Date(review.created_at)
                                .toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })
                                .replaceAll(",", "")}
                        </Typography>
                    </Box>
                    {review?.user?.year && (
                        <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
                            <Typography>&bull;</Typography>
                            <Typography level="body-sm" fontWeight="lg">
                                {review.user.year}
                                {["First", "Second", "Third", "Fourth", "Fifth"].includes(review.user.year) && "-year"}
                            </Typography>
                        </Stack>
                    )}

                    {review?.roomType && (
                        <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
                            <Typography>&bull;</Typography>
                            <Typography level="body-sm" fontWeight="lg">
                                {review.roomType.name}
                            </Typography>
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </Card>
    );
};

Review.propTypes = {
    review: PropTypes.object,
};

export default Review;
