import supabase from "../config/supabaseClient";

export const getAllHousing = async () => {
	let { data, error } = await supabase.from("housing").select(`
    id,
    name,
    address,
    average_ratings: average_rating (
      category: categories (
        id,
        name
      ),
      value: average_rating
    ),
    attributes (
      attribute_name
    ),
    room_types: room_type (
      id,
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
      ratings: reviews_to_categories (
        value: rating_value,
        category: categories (
          id,
          name
        )
      ),
      user: users (
        *
      ),
      roomType: room_type (
        id,
        name
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
		console.log("Error retrieving housing");
		throw error;
	}

	// Sort the categories so they are displayed consistently
	data = data.map((housing) => {
		housing.average_ratings = housing.average_ratings.sort((a, b) => a.category.id - b.category.id);
		housing.reviews = housing.reviews.map((review) => {
			review.ratings = review.ratings.sort((a, b) => a.category.id - b.category.id);
			return review;
		});
		return housing;
	});

	return data;
};

export const getHousing = async (id) => {
	const { data, error } = await supabase
		.from("housing")
		.select(
			`
    name,
    address,
    average_ratings: average_rating (
      category: categories (
        id,
        name
      ),
      value: average_rating
    ),
    attributes (
      attribute_name
    ),
    room_types: room_type (
      id,
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
      ratings: reviews_to_categories (
        value: rating_value,
        category: categories (
          id,
          name
        )
      ),
      user: users (
        *
      ),
      roomType: room_type (
        id,
        name
      )
    ),
    interest_points (
      name,
      address,
      lat,
      lng
    )
  `
		)
		.eq("id", id);
	if (error) {
		console.log(`Error retrieving housing ${id}`);
		throw error;
	}

	// Sort the categories so they are displayed consistently
	const housing = data[0];
	housing.average_ratings = housing.average_ratings.sort((a, b) => a.category.id - b.category.id);
	housing.reviews = housing.reviews.map((review) => {
		review.ratings = review.ratings.sort((a, b) => a.category.id - b.category.id);
		return review;
	});

	return housing;
};

export const getInterestPoints = async (id) => {
	const { data, error } = await supabase
		.from("housing")
		.select(
			`
    interest_points (
      id,
      name,
      address,
      lat,
      lng
    )
  `
		)
		.eq("id", id);
	if (error) {
		console.log("Error retrieving interest points");
		throw error;
	}
	return data;
};

export const getHousingReviews = async (id) => {
	const { data, error } = await supabase
		.from("housing")
		.select(
			`
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
  `
		)
		.eq("id", id);
	if (error) {
		console.log(`Error retrieving reviews for housing ${id}`);
		throw error;
	}
	return data;
};



export const getAvgRatingByCategoryForHousing = async (id) => {
	const { data, error } = await supabase
		.rpc('get_avg_rating_by_category', { target_housing_id: id });

	if (error) {
		console.error('Error fetching data:', error);
		return null;
	}

	return data;
}

