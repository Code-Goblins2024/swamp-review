import supabase from "../config/supabaseClient"

/**
 * Retrieve all user favorites
 * @param {string} uuid - User id
 * @returns {any[]} data - Favorite housing
 */

export const getUserFavorites = async (uuid) => {
  const { data, error } = await supabase.from("users").select(`
    housing (
      name,
      average_rating (
        average_rating
      )
    )
  `).eq("id", uuid)
  if (error) {
    console.log(`Error retrieving favorites`)
    throw error
  }
  return data;
}

/**
 * Insert a new favorite for a user
 * @param {number} housing_id - Housing selected
 * @param {string} uuid - User id
 */

export const addUserFavorite = async (housing_id, uuid) => {
  const { error } = await supabase.from("favorites").insert(
    { housing_id, user_id: uuid }
  )
  if (error) {
    console.log("Error creating favorite")
    throw error
  }
}

/**
 * Update a user's username
 * @param {string} uuid - User id
 * @param {string} new_username - New username
 */

export const updateUsername = async (uuid, new_username) => {
  // TODO: check if username is unique and valid

  const { error } = await supabase.from("users").update(
    { username: new_username }
  ).eq("id", uuid)
  if (error) {
    console.log("Error updating username")
    throw error
  }
}
