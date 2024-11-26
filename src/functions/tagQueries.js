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
