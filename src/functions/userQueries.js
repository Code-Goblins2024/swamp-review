import supabase from "../config/supabaseClient";
import { getTagCountsForAllHousing } from "./tagQueries";
import { computeTagsForHousing, calculateAverageRating } from "./util";
import { getAvgRatingByCategoryForAllHousing, getReviewCountsForAllHousing, getHousing } from "./housingQueries";

/**
 * Creates a record for the user in the public.users table
 * @param {Object} user - The object containing the user's data
 * @param {string} user.id - The uuid of the user (contained in auth.users)
 * @param {string} user.email - The email of the user
 * @param {string} user.first_name - The firstname of the user
 * @param {string} user.last_name - The lastname of the user
 * @param {string} user.major - The major of the user
 * @param {string} user.year - The year of the user (reference enum from Supabase)
 */
export const createPublicUser = async (user) => {
	const { error } = await supabase.from("users").insert(user);
	if (error) {
		console.log("Error creating user");
		throw error;
	}
};

/**
 * Retrieve all user favorites
 * @param {string} uuid - User id
 * @returns {any[]} data - Favorite housing
 */

export const getUserFavorites = async (uuid) => {
	let { data, error } = await supabase
		.from("favorites")
		.select(
			`
			housing (
        id,
        name,
        address,
        attributes (
          attribute_name
        ),
        room_types: room_type (
          id,
          name,
          fall_spring_price,
          summer_AB_price,
          summer_C_price
        ),
        reviews (
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
          user: users (
            *
          ),
          roomType: room_type (
            id,
            name
          )
        ),
        interest_points (
          name,
          address,
          lat,
          lng
        )
			)
		`
		)
		.eq("user_id", uuid)
		.gt("housing_id", -1);

	if (error) {
		console.log(`Error retrieving favorites`);
		throw error;
	}

	const avgRatings = await getAvgRatingByCategoryForAllHousing();
	data = data.map((obj) => {
		return obj.housing?.id in avgRatings
			? { ...obj.housing, average_ratings: avgRatings[obj.housing?.id] }
			: { ...obj.housing, average_ratings: [] };
	});

	const tagCounts = await getTagCountsForAllHousing();
	data = data.map((housing) => {
		if (housing?.id in tagCounts)
			return { ...housing, tags: computeTagsForHousing(tagCounts[housing?.id], housing?.reviews?.length) };

		return { ...housing, tags: [] };
	});

	return data;
};

/**
 * Insert a new favorite for a user
 * @param {number} housing_id - Housing selected
 * @param {string} uuid - User id
 */

export const addUserFavorite = async (housing_id, uuid) => {
	const { error } = await supabase.from("favorites").insert({ housing_id, user_id: uuid });
	if (error) {
		console.log("Error creating favorite");
		throw error;
	}
};

/**
 * Remove a favorite for a user
 * @param {number} housing_id - Housing selected
 * @param {string} uuid - User id
 */

export const removeUserFavorite = async (housing_id, uuid) => {
	const { error } = await supabase.from("favorites").delete().eq("housing_id", housing_id).eq("user_id", uuid);
	if (error) {
		console.log("Error deleting favorite");
		throw error;
	}
};

/**
 * Update a user's username
 * @param {string} uuid - User id
 * @param {string} new_username - New username
 */

export const updateUsername = async (uuid, new_username) => {
	// TODO: check if username is unique and valid

	const { error } = await supabase.from("users").update({ username: new_username }).eq("id", uuid);
	if (error) {
		console.log("Error updating username");
		throw error;
	}
};

/**
 * Retrieve user data
 * @param {string} uuid - User id
 * @returns {any[]} data - User data
 */

export const getUser = async (uuid) => {
	const { data, error } = await supabase
		.from("users")
		.select(
			`
			first_name,
			last_name,
			email,
			major,
			year,
			role,
			icon_color,
			theme_ld`
		)
		.eq("id", uuid);
	if (error) {
		console.log(`Error retrieving user data`);
		throw error;
	}
	return data[0];
};

/**
 * Update user data
 * @param {string} uuid - User id
 * @param {Object} updatedUser - User data
 */
export const updateUser = async (uuid, updatedUser) => {
	const { data, error } = await supabase
		.from("users")
		.update({
			...updatedUser,
		})
		.eq("id", uuid)
		.select();
	if (error) {
		console.log("Error updating user");
		throw error;
	}
	return { data, error };
};

/**
 * Retrieve user data
 * @param {string} uuid - User id
 * @returns {string} data - User role (admin, user, moderator, faculty)
 */
export const getUserRole = async (uuid) => {
	const { data, error } = await supabase
		.from("users")
		.select(
			`
			role`
		)
		.eq("id", uuid);
	if (error) {
		console.log(`Error retrieving user data`);
		throw error;
	}
	return data;
};

/**
 * Retrieve user data
 * @param {string} uuid - User id
 * @returns {array} data - Array of housing objects
 */
export const getUserRecommendations = async (uuid, recommendationsLength = 3) => {

	const collabData = await getCollabRecommendations(uuid);

	//get list of favorite housing to not be returned as recommendations
	const favorites = await getUserFavorites(uuid);
	const favoritesIds = favorites.map((favorite) => favorite.id);

	// Get content-based recommendations
	const contentData = await getContentRecommendations(uuid, favoritesIds);

	// Combine both recommendations systems
	const recommendationsObj = combineRankings(collabData, contentData);
	const recommendations = recommendationsObj.map((housing) => housing.housing_id);

	//if recommendations are less than recommendations length, append more recommendations from highest rated housing
	if (recommendations.length < recommendationsLength) {
		await addHighestRatedHousing(recommendations, favoritesIds);
	}

	let toprecs = recommendations;
	if (recommendations.length > recommendationsLength) {
		toprecs = recommendations.slice(0, recommendationsLength - recommendations.length); // Limit to remaining slots in recommendations
	}

	const fullHousingObjects = await Promise.all(
		toprecs.map(async (housing_id) => {
			const data = await getHousing(housing_id);
			return {id: housing_id, ...data};
		})
	);

	return fullHousingObjects;
};

/**
 * Retrieves collaborative filtering recommendations for a user.
 *
 * This function calls a stored procedure `get_user_recommendations` in the Supabase database
 * to compute user recommendations based on collaborative filtering.
 *
 * @param {string} uuid - The unique identifier of the user for whom to retrieve recommendations.
 * @returns {Promise<Array>} A promise that resolves to an array of collaborative filtering recommendations.
 * @throws Will throw an error if the Supabase RPC call fails.
 */
const getCollabRecommendations = async (uuid) => {
	//compute user recommendations based on collaboative filtering
	let { data: collabData, error } = await supabase.rpc("get_user_recommendations", { user_id_param: uuid });
	if (error) throw error;

	if (!collabData || collabData.length === 0) {
		console.log("No collab recommendations found");
		collabData = [];
	}

	return collabData;
};

/**
 * Computes user content recommendations based on content-based filtering.
 *
 * @param {string} uuid - The unique identifier of the user.
 * @param {Array<number>} favoritesIds - An array of housing IDs that the user has marked as favorites.
 * @returns {Promise<Array<{housing_id: number, matchCount: number, matchScore: number}>>} A promise that resolves to an array of recommended housing objects, each containing:
 * - housing_id: The ID of the housing.
 * - matchCount: The number of tags that match the user's tags.
 * - matchScore: The sum of tag counts for the matched tags.
 */
const getContentRecommendations = async (uuid, favoritesIds) => {
	// compute user recommendations based on content-based filtering
	// Compute tag counts
	const tagCounts = await getTagCountsForAllHousing();
	const reviewCounts = await getReviewCountsForAllHousing();
	const tagsForHousing = [];
	for (const [key, value] of Object.entries(reviewCounts)) {
		tagsForHousing.push({ housing_id: key, tags: computeTagsForHousing(tagCounts[key] ? tagCounts[key] : [], value) });
	}
	const userTags = await supabase.from("users_to_tags").select("tags(id, name)").eq("user_id", uuid);
	const tagsToMatch = userTags.data.map((tag) => tag.tags.name);
	
	let contentData = tagsForHousing
		.map(housing => {
			// Calculate match count and sum of tag_count for matched tags
			const matchedTags = housing.tags.filter(tag => tagsToMatch.includes(tag.tag_name));
			const matchCount = matchedTags.length;
			const matchScore = matchedTags.reduce((sum, tag) => sum + tag.tag_count, 0);
			

			return { housing_id: parseInt(housing.housing_id), matchCount, matchScore };
		})
		.filter(housing => housing.matchCount > 0) // Keep only housing with at least one match
		.filter(housing => !favoritesIds.includes(housing.housing_id)) // Exclude favorites
		.sort((a, b) => {
			// Sort by matchCount first, then by matchScore if tied
			if (b.matchCount !== a.matchCount) {
				return b.matchCount - a.matchCount;
			} else {
				return b.matchScore - a.matchScore;
			}
		});

		if (!contentData || contentData.length === 0) {
			console.log("No content recommendations found");
			contentData = [];
		}
	
	return contentData;
};

/**
 * Combines two arrays of ranking objects, merges duplicates, and calculates a total score for each unique item.
 * The total score is calculated based on predefined weights for frequency, matchCount, and matchScore.
 * The resulting array is sorted in descending order of totalScore.
 *
 * @param {Array<Object>} array1 - The first array of ranking objects.
 * @param {Array<Object>} array2 - The second array of ranking objects.
 * @returns {Array<Object>} - The combined and sorted array of ranking objects.
 *
 * @typedef {Object} RankingObject
 * @property {number} housing_id - The unique identifier for the housing.
 * @property {number} [frequency=0] - The frequency metric.
 * @property {number} [matchCount=0] - The match count metric.
 * @property {number} [matchScore=0] - The match score metric.
 * @property {number} totalScore - The calculated total score based on the weights.
 */
const combineRankings = (array1, array2) => {
	// Define weights for each metric
	const weights = { frequency: 0.6, matchCount: 0.3, matchScore: 0.1 };
    
    // Step 1: Append both arrays
    const combinedArray = [...array1, ...array2];

    // Step 2: Merge duplicates and add missing attributes
    const result = [];
    const seen = {};

    combinedArray.forEach(item => {
        const id = parseInt(item.housing_id); // Normalize `housing_id` to an integer
        if (!seen[id]) {
            // If `housing_id` is not yet processed, add it to the result
            seen[id] = {
                housing_id: id,
                frequency: 0,
                matchCount: 0,
                matchScore: 0,
            };
            result.push(seen[id]);
        }

        // Update the metrics
        seen[id].frequency += item.frequency || 0;
        seen[id].matchCount += item.matchCount || 0;
        seen[id].matchScore += item.matchScore || 0;
		seen[id].totalScore =
			seen[id].frequency * weights.frequency +
			seen[id].matchCount * weights.matchCount +
			seen[id].matchScore * weights.matchScore;
    });

    // Convert to array and sort by totalScore
    return Object.values(result).sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Adds the highest-rated housing IDs to the recommendations list.
 *
 * @param {Array<number>} recommendations - The current list of recommended housing IDs.
 * @param {number} [recommendationsLength=3] - The desired length of the recommendations list.
 * @param {Array<number>} favoritesIds - The list of favorite housing IDs to exclude from recommendations.
 * @returns {Promise<Array<number>>} The updated list of recommended housing IDs.
 */
const addHighestRatedHousing = async (recommendations, favoritesIds) => {
	const housingRatings = await getAvgRatingByCategoryForAllHousing();
	// calculate based on global average rating
	const topRatedHousing = [];
	for(const [key, value] of Object.entries(housingRatings)) {
		// Calculate the average rating for each housing
		topRatedHousing.push({ housing_id: parseInt(key), averageRating: calculateAverageRating(value) });
	}

	// Sort by average rating (descending)
	topRatedHousing.sort((a, b) => b.averageRating - a.averageRating);
	// Extract housing IDs and filter out those already in recommendations
	const topRatedSlice = topRatedHousing
		.map(house => house.housing_id) // Get only IDs
		.filter(houseId => !recommendations.includes(houseId)) // Exclude existing IDs
		.filter(houseId => !favoritesIds.includes(houseId)) // Exclude favorites

	// Append the filtered top-rated housing IDs to recommendations
	recommendations.push(...topRatedSlice);

	return recommendations;
}