import supabase from "../config/supabaseClient";

export const getAllTags = async () => {
	const { data, error } = await supabase.from("tags").select("id, name").gt("id", -1);
	if (error) throw error;
	return data;
};

export const getTagCountsForHousing = async (housingId) => {
	const { data, error } = await supabase.rpc("get_tag_counts_for_single_housing", { housing_id_param: housingId });
	if (error) throw error;
	return data;
};
