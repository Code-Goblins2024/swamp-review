begin;

select plan(59);
-- Test for the existence of columns in each table

-- attributes table
SELECT has_column('attributes', 'id');
SELECT has_column('attributes', 'attribute_name');

-- average_rating table
SELECT has_column('average_rating', 'id');
SELECT has_column('average_rating', 'average_rating');
SELECT has_column('average_rating', 'category_id');
SELECT has_column('average_rating', 'housing_id');

-- categories table
SELECT has_column('categories', 'id');
SELECT has_column('categories', 'name');

-- favorites table
SELECT has_column('favorites', 'housing_id');
SELECT has_column('favorites', 'user_id');

-- housing table
SELECT has_column('housing', 'id');
SELECT has_column('housing', 'address');
SELECT has_column('housing', 'lat');
SELECT has_column('housing', 'lng');
SELECT has_column('housing', 'location');
SELECT has_column('housing', 'name');

-- housing_tags table
SELECT has_column('housing_tags', 'id');
SELECT has_column('housing_tags', 'count');
SELECT has_column('housing_tags', 'housing_id');
SELECT has_column('housing_tags', 'tag_id');

-- housing_to_attributes table
SELECT has_column('housing_to_attributes', 'attributes_id');
SELECT has_column('housing_to_attributes', 'housing_id');

-- housing_to_ip table
SELECT has_column('housing_to_ip', 'housing_id');
SELECT has_column('housing_to_ip', 'interest_point_id');

-- interest_points table
SELECT has_column('interest_points', 'id');
SELECT has_column('interest_points', 'address');
SELECT has_column('interest_points', 'google_place_id');
SELECT has_column('interest_points', 'lat');
SELECT has_column('interest_points', 'lng');
SELECT has_column('interest_points', 'location');
SELECT has_column('interest_points', 'name');

-- reviews table
SELECT has_column('reviews', 'id');
SELECT has_column('reviews', 'content');
SELECT has_column('reviews', 'created_at');
SELECT has_column('reviews', 'housing_id');
SELECT has_column('reviews', 'room_id');
SELECT has_column('reviews', 'user_id');

-- reviews_to_categories table
SELECT has_column('reviews_to_categories', 'id');
SELECT has_column('reviews_to_categories', 'category_id');
SELECT has_column('reviews_to_categories', 'rating_value');
SELECT has_column('reviews_to_categories', 'review_id');

-- reviews_to_tags table
SELECT has_column('reviews_to_tags', 'review_id');
SELECT has_column('reviews_to_tags', 'tag_id');

-- room_type table
SELECT has_column('room_type', 'id');
SELECT has_column('room_type', 'fall_spring_price');
SELECT has_column('room_type', 'housing_id');
SELECT has_column('room_type', 'name');
SELECT has_column('room_type', 'summer_AB_price');
SELECT has_column('room_type', 'summer_C_price');

-- tags table
SELECT has_column('tags', 'id');
SELECT has_column('tags', 'name');

-- users table
SELECT has_column('users', 'id');
SELECT has_column('users', 'created_at');
SELECT has_column('users', 'email');
SELECT has_column('users', 'first_name');
SELECT has_column('users', 'last_name');
SELECT has_column('users', 'major');
SELECT has_column('users', 'role');
SELECT has_column('users', 'year');

select * from finish();
rollback;