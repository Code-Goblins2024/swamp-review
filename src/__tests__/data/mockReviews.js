export const mockReviews = [
	{
		ratings: [
			{
				category: {
					name: "Test Category 1",
				},
				value: 1.0,
			},
			{
				category: {
					name: "Test Category 2",
				},
				value: 2.0,
			},
		],
		content: "Test Content 1",
		user: {
			first_name: "Test Firstname 1",
			last_name: "Test Lastname 1",
			year: "Other",
		},
		created_at: "2000-01-02 02:15:00+00",
	},
	{
		ratings: [
			{
				category: {
					name: "Test Category 3",
				},
				value: 3.0,
			},
			{
				category: {
					name: "Test Category 4",
				},
				value: 4.0,
			},
		],
		content: "Test Content 2",
		user: {
			first_name: "Test Firstname 2",
			last_name: "Test Lastname 2",
			year: "Other",
		},
		created_at: "2001-01-02 02:15:00+00",
	},
];
