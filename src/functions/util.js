import { TAG_THRESHOLD } from "../constants/Constants";
export const computeTagsForHousing = (tags, totalReviewCount) => {
	const appliedTags = []; // These are the tags that meet the threshold
	tags.forEach((tag) => {
		if (tag.tag_count / totalReviewCount > TAG_THRESHOLD) {
			appliedTags.push(tag);
		}
	});
	return appliedTags;
};

export const calculateAverageRating = (average_ratings) => {
    if (!average_ratings || average_ratings.length === 0) return 0;

    const sum = average_ratings.reduce((acc, curr) => {
        return acc + (curr.value || 0);
    }, 0);

    return sum / average_ratings.length;
};


