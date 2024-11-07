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

	const { data, error } = await supabase
		.from("reviews")
		.insert({ content, housing_id, room_id, user_id: uuid })
		.select();
	if (error) {
		console.log("Couldn't create review");
		throw error;
	}

	const review_id = data[0].id;

	if (tag_ids.length != 0) {
		tag_ids.forEach(async (tag_id) => {
			const { error } = await supabase.from("reviews_to_tags").insert({ review_id, tag_id });
			if (error) {
				console.log("Couldn't create tag");
				throw error;
			}
		});
	}

	ratings.forEach(async (cr) => {
		const { error } = await supabase
			.from("reviews_to_categories")
			.insert({ review_id, category_id: cr.id, rating_value: cr.rating_value });
		if (error) {
			console.log("Couldn't create rating for category");
			throw error;
		}
	});

	return data;
};
