-- Enable the "pgtap" extension
begin;

select plan(15);

-- Test for the existence of tables
SELECT has_table('attributes');
SELECT has_table('average_rating');
SELECT has_table('categories');
SELECT has_table('favorites');
SELECT has_table('housing');
SELECT has_table('housing_tags');
SELECT has_table('housing_to_attributes');
SELECT has_table('housing_to_ip');
SELECT has_table('interest_points');
SELECT has_table('reviews');
SELECT has_table('reviews_to_categories');
SELECT has_table('reviews_to_tags');
SELECT has_table('room_type');
SELECT has_table('tags');
SELECT has_table('users');

select * from finish();
rollback;