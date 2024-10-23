import supabase from "../config/supabaseClient";

export const getAllHousing = async () => {
  const { data, error } = await supabase.from("housing").select(`
    name,
    address,
    average_rating (
      categories (
        name
      ),
      average_rating
    ),
    attributes (
      attribute_name
    ),
    room_type (
      name,
      fall_spring_price,
      summer_AB_price,
      summer_C_price
    ),
    reviews (
      content,
      created_at,
      tags (
        name
      ),
      reviews_to_categories (
        rating_value,
        categories (
          name
        )
      )
    ),
    interest_points (
      name,
      address,
      lat,
      lng
    )
`);
  if (error) {
    console.log("Error retrieving housing")
    throw error
  }
  return data;
}

export const getHousing = async (id) => {
  const { data, error } = await supabase.from("housing").select(`
    name,
    address,
    average_rating (
      categories (
        name
      ),
      average_rating
    ),
    attributes (
      attribute_name
    ),
    room_type (
      name,
      fall_spring_price,
      summer_AB_price,
      summer_C_price
    ),
    reviews (
      content,
      created_at,
      tags (
        name
      ),
      reviews_to_categories (
        rating_value,
        categories (
          name
        )
      )
    ),
    interest_points (
      name,
      address,
      lat,
      lng
    )
  `).eq("id", id)
  if (error) {
    console.log(`Error retrieving housing ${id}`)
    throw error
  }
  return data[0];
}

export const getInterestPoints = async (id) => {
  const { data, error } = await supabase.from("housing").select(`
    interest_points (
      id,
      name,
      address,
      lat,
      lng
    )
  `).eq("id", id)
  if (error) {
    console.log("Error retrieving interest points")
    throw error
  }
  return data;
}

export const getHousingReviews = async (id) => {
  const { data, error } = await supabase.from("housing").select(`
    id,
    name,
    address,
    reviews (
      rating,
      content,
      created_at,
      tags (
        name
      )
    )
  `).eq("id", id)
  if (error) {
    console.log(`Error retrieving reviews for housing ${id}`)
    throw error
  }
  return data;
}


