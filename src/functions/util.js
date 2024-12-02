import { TAG_THRESHOLD } from "../constants/Constants";

/**
 * Function to compute the tags that meet the threshold
 * @param {Array} tags - Array of tags
 * @param {number} totalReviewCount - Total review count
 * @returns {Array} Array of tags that meet the threshold
 * @throws {Error} Error computing tags
 */
export const computeTagsForHousing = (tags, totalReviewCount) => {
	const appliedTags = []; // These are the tags that meet the threshold
	tags.forEach((tag) => {
		if (tag.tag_count / totalReviewCount > TAG_THRESHOLD) {
			appliedTags.push(tag);
		}
	});
	return appliedTags;
};

/**
 * Function to calculate the average rating
 * @param {Array} average_ratings - Array of average ratings
 * @returns {number} Average rating
 * @throws {Error} Error computing average rating
 */
export const calculateAverageRating = (average_ratings) => {
    if (!average_ratings || average_ratings.length === 0) return 0;

    const sum = average_ratings.reduce((acc, curr) => {
        return acc + (curr.value || 0);
    }, 0);

    return sum / average_ratings.length;
};