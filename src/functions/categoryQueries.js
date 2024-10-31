import supabase from "../config/supabaseClient";

export const getAllCategories = async () => {
	const { data, error } = await supabase.from("categories").select("id, name").gt("id", -1);
	if (error) throw error;
	return data;
};
