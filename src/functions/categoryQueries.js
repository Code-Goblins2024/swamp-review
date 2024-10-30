import supabase from "../config/supabaseClient";

export const getAllCategories = async () => {
	const { data, error } = await supabase.from("categories").select("id, name");
	if (error) throw error;
	return data;
};
