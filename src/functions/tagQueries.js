import supabase from "../config/supabaseClient";

export const getAllTags = async () => {
	const { data, error } = await supabase.from("tags").select("id, name").gt("id", -1);
	if (error) throw error;
	return data;
};
