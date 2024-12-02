import supabase from "../config/supabaseClient";

/**
 * Gets all categories
 * @returns {Promise<Array>} Array of all categories
 * @throws {Error} Error fetching data
 */
export const getAllCategories = async () => {
	const { data, error } = await supabase.from("categories").select("id, name").gt("id", -1);
	if (error) throw error;
	return data;
};
