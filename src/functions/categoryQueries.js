import supabase from "../config/supabaseClient";

export const getAllCategories = async () => {
	const { data, error } = await supabase.from("categories").select("name");
	if (error) throw error;
	return data;
};
