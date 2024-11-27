import supabase from "../config/supabaseClient";

export const getAllTags = async () => {
	const { data, error } = await supabase.from("tags").select("id, name").gt("id", -1);
	if (error) throw error;
	return data;
};

export const getTagCountsForAllHousing = async () => {
	const { data, error } = await supabase.rpc("get_tag_counts_for_all_housing");
	if (error) throw error;

	const groupedTagCounts = {};
	data.forEach((ar) => {
		const { housing_id, ...rest } = ar;
		if (!(housing_id in groupedTagCounts)) groupedTagCounts[housing_id] = [];
		groupedTagCounts[housing_id].push(rest);
	});

	return groupedTagCounts;
};

export const getTagCountsForHousing = async (housingId) => {
	const { data, error } = await supabase.rpc("get_tag_counts_for_single_housing", { housing_id_param: housingId });
	if (error) throw error;
	return data;
};

export const getTagsForUser = async (uuid) => {
	let { data, error } = await supabase
		.from("users_to_tags")
		.select("tags(id, name)")
		.eq("user_id", uuid);

		data = data.map((tag) => tag.tags);
	if (error) {
		console.log(`Error retrieving user tags`);
		throw error;
	}
	return data;
};
export const updateTagsForUser = async (uuid, tags) => {  
	// Remove tags that are not in the new tags
	const { data: deleteData, error: deleteError } = await supabase
	  .from("users_to_tags")
	  .delete()
	  .eq("user_id", uuid)
	  .not("tag_id", "in", `(${tags.join(',')})`) // Fixed to join the tags array
	  .select("tag_id");
  
	if (deleteError) {
	  console.error("Error deleting old tags:", deleteError);
	  throw deleteError;
	}
  
	// Get the existing tags for the user
	const { data: existingTags, error: existingTagsError } = await supabase
	  .from("users_to_tags")
	  .select("tag_id")
	  .eq("user_id", uuid);
  
	if (existingTagsError) {
	  console.error("Error fetching existing tags:", existingTagsError);
	  throw existingTagsError;
	}
  
	// Extract just the tag_ids from the existingTags
	const existingTagIds = existingTags.map(tag => tag.tag_id);
  
	// Filter out tags that are already associated with the user
	const newTags = tags.filter(tag => !existingTagIds.includes(tag));
	const tagsToInsert = newTags.map(tag => ({ user_id: uuid, tag_id: tag }));
  
	// Insert the new tags, skipping conflicts
	const { data: insertData, error: insertError } = await supabase
	  .from("users_to_tags")
	  .insert(tagsToInsert);
  
	if (insertError) {
	  console.error("Error inserting new tags:", insertError);
	  throw insertError;
	}
  
	return insertData; // Return the result of the insert operation
  };
  