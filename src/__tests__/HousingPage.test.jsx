import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, expect } from "vitest";
import { mockHousingData } from "./data/mockHousingData";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";
import userEvent from "@testing-library/user-event";
import HousingPage from "../pages/HousingPage";

describe("Housing page tests", () => {
	beforeEach(async () => {
		render(
			<APIProvider apiKey={import.meta.env.VITE_MAPS_KEY}>
				<MemoryRouter initialEntries={["/housing/-1"]}>
					<Routes>
						<Route path="/housing/:housingId" element={<HousingPage />} />
					</Routes>
				</MemoryRouter>
			</APIProvider>
		);
		await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument(), { timeout: 10000, interval: 1000, onTimeout: () => {
			throw new Error("Loading took too long");
		} });
	});

	it("should render housing name", async () => {

		expect(await screen.findByText(mockHousingData.name)).toBeInTheDocument();
	});

	it("should render room types in prices and in reviews", async () => {
		const testPrice = async (roomTypeObj, priceInfo) => {
			// Find and click button for appropraite price type (fall/spring, summer a/b, or summer c)
			const button = (await screen.findByText(priceInfo.buttonText)).parentElement.previousElementSibling;
			await userEvent.click(button);

			// Test room type is displayed
			const roomNames = await screen.findAllByText(roomTypeObj.name);
			expect(roomNames).toHaveLength(2);

			// Test price is displayed
			const price = screen.getByText(
				new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "USD",
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}).format(roomTypeObj[priceInfo.name])
			);
			expect(price).toBeInTheDocument();
		};

		await waitFor(async () => {
			const priceInfo = [
				{ name: "summer_C_price", buttonText: "Summer C" },
				{ name: "fall_spring_price", buttonText: "Fall/Spring" },
				{ name: "summer_AB_price", buttonText: "Summer A/B" },
			];

			// Test Room Type 1
			await testPrice(mockHousingData.room_types[0], priceInfo[0]);
			await testPrice(mockHousingData.room_types[0], priceInfo[1]);
			await testPrice(mockHousingData.room_types[0], priceInfo[2]);

			// Test Room Type 2
			await testPrice(mockHousingData.room_types[1], priceInfo[0]);
			await testPrice(mockHousingData.room_types[1], priceInfo[1]);
			await testPrice(mockHousingData.room_types[1], priceInfo[2]);
		});
	});

	it("should render all attributes", async () => {
		await waitFor(() => {
			mockHousingData.attributes.forEach((attribute) => {
				expect(screen.getByText(attribute.attribute_name)).toBeInTheDocument();
			});
		});
	});

	// Just check that the review appears, details of the review component are tested elsewhere
	it("should render all reviews", async () => {
		await waitFor(() => {
			mockHousingData.reviews.forEach((review) => {
				expect(screen.getByText(review.content)).toBeInTheDocument();
			});
		});
	});
});
