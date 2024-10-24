import supabase from "../config/supabaseClient";

/**
 * Creates a record for the user in the public.users table
 * @param {Object} user - The object containing the user's data
 * @param {string} user.id - The uuid of the user (contained in auth.users)
 * @param {string} user.email - The email of the user
 * @param {string} user.first_name - The firstname of the user
 * @param {string} user.last_name - The lastname of the user
 * @param {string} user.major - The major of the user
 * @param {string} user.year - The year of the user (reference enum from Supabase)
 */
export const createPublicUser = async (user) => {
	const { error } = await supabase.from("users").insert(user);
	if (error) {
		console.log("Error creating user");
		throw error;
	}
};
