import { mockReviews } from "./mockReviews";

export const mockHousingData = {
	name: "Test Housing",
	address: "Test Address",
	attributes: [{ attribute_name: "Test Attr 1" }, { attribute_name: "Test Attr 2" }],
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
