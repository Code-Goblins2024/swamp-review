import supabase from "../config/supabaseClient";

/**
 * @typedef {Object} CategoryRating
 * @param {number} id - Category id for each rating
 * @param {number} rating_value - Rating number
 */

/**
 * Insert a new user review with selected tags and rating values
 * @param {string} content - The user's input
 * @param {number} housing_id - The id for the dorm
 * @param {string} uuid - Unique user identifier
 * @param {int[]} tag_ids - User selected tags for a review
 * @param {int} room_id - The id for the room type of the review
 * @param {CategoryRating[]} ratings - Rating values for each category of a review
 * @returns {any[]} data - Review created
 */
export const addReview = async (content, housing_id, room_id, uuid, tag_ids, ratings) => {
	if (ratings.length == 0) {
		throw new Error("Ratings should not be empty");
	}

	const { data, error: reviewError } = await supabase
		.from("reviews")
		.insert({ content, housing_id, room_id, user_id: uuid })
		.select();
	if (reviewError) throw reviewError;

	const review_id = data[0].id;

	if (tag_ids.length != 0) {
		const formattedTags = tag_ids.map((tag_id) => ({
			review_id,
			tag_id,
		}));
		const { error: tagError } = await supabase.from("reviews_to_tags").insert(formattedTags);
		if (tagError) throw tagError;
	}

	const formattedRatings = ratings.map((cr) => ({
		review_id,
		category_id: cr.id,
		rating_value: cr.rating_value,
	}));

	const { error: ratingError } = await supabase.from("reviews_to_categories").insert(formattedRatings);
	if (ratingError) throw ratingError;

	return data;
};

export const getFlaggedReviews = async () => {
	const { data: flaggedReviews, error: flagError } = await supabase.from("flagged_reviews").select(`
		id,
		created_at,
		reviews (
			review_id: id,
			users (
				user_id: id,
				email,
				first_name,
				last_name
			),
			created_at,
			content,
			status
		)
	`);
	if (flagError) throw flagError;

	const reviewCounts = flaggedReviews.reduce((acc, review) => {
		acc[review.review_id] = (acc[review.review_id] || 0) + 1;
		return acc;
	}, {});

	const uniqueFlaggedReviews = flaggedReviews
		.filter(review => reviewCounts[review.review_id] > 2) // Filter for review_ids that appear more than twice
		.reduce((uniqueReviews, review) => {
			if (!uniqueReviews.some(r => r.review_id === review.review_id)) {
				uniqueReviews.push(review);
			}
			return uniqueReviews;
		}, []);

	return uniqueFlaggedReviews;
};

/**
 * Flags a review
 * @param{string} uuid - Unique user identifier
 * @param{int} review_id - Id of review to be flagged
 */

export const flagReview = async (uuid, review_id) => {

};
