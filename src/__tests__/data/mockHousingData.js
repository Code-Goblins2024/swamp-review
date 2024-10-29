import { mockReviews } from "./mockReviews";

export const mockHousingData = {
	name: "Test Housing",
	address: "Test Address",
	average_ratings: [
		{
			category: {
				name: "Test Avg Rating 1",
			},
			value: 1.0,
		},
		{
			category: {
				name: "Test Avg Rating 2",
			},
			value: 2.0,
		},
	],
	attributes: [{ attribute_name: "Test Attr 1" }, { attribute_name: "Test Attr2" }],
	room_types: [
		{
			name: "Test Room 1",
			fall_spring_price: 1111,
			summer_AB_price: 2222,
			summer_C_price: 3333,
		},
		{
			name: "Test Room 2",
			fall_spring_price: 4444,
			summer_AB_price: 5555,
			summer_C_price: 6666,
		},
	],
	reviews: mockReviews,
	interest_points: [],
};
