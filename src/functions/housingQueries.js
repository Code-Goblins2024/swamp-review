import supabase from "../config/supabaseClient";

export const getAllHousing = async () => {
  const { data, error } = await supabase.from("housing").select(`
    name,
    averageRating (
      categories (
        name
      ),
      averageRating
    ),
    attributes (
      attributeName
    ),
    roomType (
      name
    )
  `);
  if (error) {
    console.log("Error retrieving housing:", error)
  }
  return data;
}

export const getHousing = async (id) => {
  const { data, error } = await supabase.from("housing").select(`
    name,
    address,
    averageRating (
      categories (
        name
      ),
      averageRating
    ),
    attributes (
      attributeName
    ),
    roomType (
      name,
      fallSpringPrice,
      summerABPrice,
      summerCPrice
    )
  `).eq("id", id)
  if (error) {
    console.log(`Error retrieving housing ${id}:`, error)
  }
  return data;
}

export const getInterestPoints = async (id) => {
  const { data, error } = await supabase.from("housing").select(
    `id,
    name,
    interestPoints (
      name,
      address
    ),
  `).eq("id", id)
  if (error) {
    console.log("Error retrieving pois:", error)
  }
  return data;
}

export const getReviewTags = async () => {
  const { data, error } = await supabase.from("reviews").select(`
    created_at,
    content,
    tags (
      name
    )
  `)
  return data;
}

export const getHousingReviews = async (id) => {
  const { data, error } = await supabase.from("housing").select(`
    id,
    name,
    address,
    reviews (
      rating,
      content
    )
  `).eq("id", id)
  return data;
}

export const getUserFavorites = async (id) => {
  const { data, error } = await supabase.from("users").select(`
    housing (
      name,
      averageRating (
        averageRating
      )
    )
  `).eq("id", id)
  return data;
}
