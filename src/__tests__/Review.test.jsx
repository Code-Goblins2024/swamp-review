import { render, screen } from "@testing-library/react";
import { mockReviews } from "./data/mockReviews";
import Review from "../components/Review.jsx";

describe("Review tests", () => {
	const mockReview = mockReviews[0];

	it("should render all ratings", () => {
		render(<Review review={mockReview} />);

		mockReview.ratings.forEach((rating) => {
			const category = screen.getByText(rating.category.name);
			expect(category).toBeInTheDocument();

			const value = screen.getByText(rating.value.toFixed(1));
			expect(value).toBeInTheDocument();
		});
	});

	it("should render review content", () => {
		render(<Review review={mockReview} />);
		const content = screen.getByText(/Test Content/i);
		expect(content).toBeInTheDocument();
	});

	it("should render user information", () => {
		render(<Review review={mockReview} />);
		const firstname = screen.getByText((content, firstname) => content.includes(mockReview.user.first_name));
		const lastname = screen.getByText((content, lastname) => content.includes(mockReview.user.last_name));
		const year = screen.getByText((content, year) => content.includes(mockReview.year_lived.toLowerCase()));
		expect(firstname).toBeInTheDocument();
		expect(lastname).toBeInTheDocument();
		expect(year).toBeInTheDocument();
	});

	it("should render the review date with correct format", () => {
		render(<Review review={mockReview} />);

		const expectedDate = new Date(mockReview.created_at)
			.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
			.replaceAll(",", "");
		const date = screen.getByText((content, date) => content.includes(expectedDate));
		expect(date).toBeInTheDocument();
	});
});
