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
