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

/**
 * Retrieve all user favorites
 * @param {string} uuid - User id
 * @returns {any[]} data - Favorite housing
 */

export const getUserFavorites = async (uuid) => {
	const { data, error } = await supabase
		.from('favorites')
		.select(`
			housing (
				id,
				name,
				average_ratings: average_rating (
					category: categories (
						name
					),
					value: average_rating
				)
			)
		`)
		.eq('user_id', uuid);
	if (error) {
		console.log(`Error retrieving favorites`);
		throw error;
	}
	return data;
};

/**
 * Insert a new favorite for a user
 * @param {number} housing_id - Housing selected
 * @param {string} uuid - User id
 */

export const addUserFavorite = async (housing_id, uuid) => {
	const { error } = await supabase.from("favorites").insert({ housing_id, user_id: uuid });
	if (error) {
		console.log("Error creating favorite");
		throw error;
	}
};

/**
 * Remove a favorite for a user
 * @param {number} housing_id - Housing selected
 * @param {string} uuid - User id
 */

export const removeUserFavorite = async (housing_id, uuid) => {
	const { error } = await supabase.from("favorites").delete().eq("housing_id", housing_id).eq("user_id", uuid);
	if (error) {
		console.log("Error deleting favorite");
		throw error;
	}
}

/**
 * Update a user's username
 * @param {string} uuid - User id
 * @param {string} new_username - New username
 */

export const updateUsername = async (uuid, new_username) => {
	// TODO: check if username is unique and valid

	const { error } = await supabase.from("users").update({ username: new_username }).eq("id", uuid);
	if (error) {
		console.log("Error updating username");
		throw error;
	}
};

/**
 * Retrieve user data
 * @param {string} uuid - User id
 * @returns {any[]} data - User data
 */

export const getUser = async (uuid) => {
	const { data, error } = await supabase
		.from('users')
		.select(`
			first_name,
			last_name,
			email,
			major,
			year,
			role,
			icon_color,
			theme_ld`,
		)
		.eq('id', uuid);
	if (error) {
		console.log(`Error retrieving user data`);
		throw error;
	}
	return data;
};

/**
 * Retrieve user data
 * @param {string} uuid - User id
 * @returns {any[]} data - User role (admin, user, moderator, faculty)
 */

export const getUserRole = async (uuid) => {
	const { data, error } = await supabase
		.from('users')
		.select(`
			role`)
		.eq('id', uuid);
	if (error) {
		console.log(`Error retrieving user data`);
		throw error;
	}
	return data;
};
