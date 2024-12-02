import supabase from "../config/supabaseClient";

/**
 * Gets all reviews for a specific user
 * @param {string} uuid - Supabase UUID of the desired user
 * @returns {Promise<Array>} Array of user's reviews with related data
 */
export const getUserReviews = async (uuid) => {
    const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          content,
          created_at,
          tags (
            id,
            name
          ),
          ratings: reviews_to_categories (
            value: rating_value,
            category: categories (
              id,
              name
            )
          ),
          housing(name)
        `)
        .eq('user_id', uuid)
        .order('created_at', { ascending: false })

    if (error) throw error;
    return data || [];
};

/**
 * Returns whether the user has a review for the specified room type
 * @param {string} uuid - Supabase UUID of the desired user
 * @param {int} housing_id - ID of the housing
 * @param {int} room_id - ID of the room type
 * @returns {bool}
 */
export const checkUserHasReviewForRoomType = async (uuid, housing_id, room_id) => {
    const { count, error } = await supabase
        .from("reviews")
        .select("*", { count: "exact" })
        .eq("user_id", uuid)
        .eq("housing_id", housing_id)
        .eq("room_id", room_id);

    if (error) throw Error;

    return count > 0;
};

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

/**
 * Gets all flagged reviews
 * @returns {Promise<Array>} Array of flagged reviews with related data
 * @throws {Error} Error fetching data
 */
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
        acc[review.reviews.review_id] = (acc[review.reviews.review_id] || 0) + 1;
        return acc;
    }, {});

    const uniqueFlaggedReviews = flaggedReviews
        .filter(review => reviewCounts[review.reviews.review_id] > 0)
        .reduce((uniqueReviews, review) => {
            if (!uniqueReviews.some(r => r.reviews.review_id === review.reviews.review_id)) {
                uniqueReviews.push(review);
            }
            return uniqueReviews;
        }, []);

    return uniqueFlaggedReviews;
};

/**
 * Checks if a review is flagged by the provided user
 * @param {string} uuid - Unique user identifier
 * @param {int} review_id - Id of review to be checked
 * @returns {Promise<boolean>} True if review is flagged, false otherwise
 */
export const isFlagged = async (uuid, review_id) => {
    const { data, error } = await supabase.from("flagged_reviews").select().eq("user_id", uuid).eq("review_id", review_id);
    if (error) throw error;
    return data.length > 0 ? true : false;
};

/**
 * Flags a review
 * @param{string} uuid - Unique user identifier
 * @param{int} review_id - Id of review to be flagged
 */
export const flagReview = async (uuid, review_id) => {
    try {
        if (await isFlagged(uuid, review_id)) {
            const response = await supabase.from("flagged_reviews").delete().eq("user_id", uuid).eq("review_id", review_id);
            if (response.status != 204) {
                console.log("Error removing flag");
            }

            const { data: flaggedCount, error: countError } = await supabase
                .from("flagged_reviews")
                .select("review_id", { count: "exact" })
                .eq("review_id", review_id);

            if (countError) throw countError;

            if (flaggedCount && flaggedCount.length < 3) {
                const { error: updateError } = await supabase
                    .from("reviews")
                    .update({ status: "approved" })
                    .eq("id", review_id);

                if (updateError) throw updateError;
            }
        } else {
            const { error: flaggingError } = await supabase
                .from("flagged_reviews")
                .insert({ user_id: uuid, review_id });

            if (flaggingError) throw flaggingError;

            const { data: flaggedCount, error: countError } = await supabase
                .from("flagged_reviews")
                .select("review_id", { count: "exact" })
                .eq("review_id", review_id);

            if (countError) throw countError;

            if (flaggedCount && flaggedCount.length >= 3) {
                const { error: updateError } = await supabase
                    .from("reviews")
                    .update({ status: "in_review" })
                    .eq("id", review_id);

                if (updateError) throw updateError;
            }
        }
    } catch (error) {
        console.error("Error flagging review or updating status:", error);
        throw error;
    }
};

/**
 * Updates review status
 * @param{int} review_id - Id of review
 * @param{string} status - New status (enum from Supabase)
 */
export const updateReviewStatus = async (review_id, status) => {
    const { error: statusError } = await supabase.from("reviews").update({ status }).eq("id", review_id);
    if (statusError) throw statusError;

    //const response = await supabase.from("flagged_reviews").delete().eq("review_id", review_id);
    //if (response.status != 204) {
    //    console.log("Error deleting data");
    //}
};
