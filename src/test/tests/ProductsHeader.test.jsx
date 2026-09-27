import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProductsHeader from "../../features/Products/components/ProductsHeader";
import { renderWithProviders } from "../utils";

describe("ProductsHeader", () => {
  it("renders the page title", () => {
    renderWithProviders(<ProductsHeader />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Products" }),
    ).toBeInTheDocument();
  });

  it("keeps the bottom spacing of the header row", () => {
    const { container } = renderWithProviders(<ProductsHeader />);
    expect(container.firstElementChild).toHaveClass("flex", "items-end", "justify-between", "mb-6");
  });
});
