import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProductsGrid from "../../features/Products/components/ProductsGrid";
import { productList } from "../fixtures";

describe("ProductsGrid", () => {
  it("renders the skeleton grid while loading", () => {
    const { container } = render(<ProductsGrid isLoading limit={12} />);

    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(12);
    expect(screen.queryByText("Product One")).not.toBeInTheDocument();
  });

  it("uses the provided limit for the skeleton count", () => {
    const { container } = render(<ProductsGrid isLoading limit={4} />);
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(4);
  });

  it("renders the error state with the thrown message", () => {
    render(
      <ProductsGrid
        isError
        error={new Error("Failed to fetch products")}
        isLoading={false}
      />,
    );

    expect(screen.getByText("Error loading products")).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch products")).toBeInTheDocument();
  });

  it("renders the empty state when nothing matches", () => {
    render(<ProductsGrid products={[]} isLoading={false} isError={false} />);

    expect(
      screen.getByText("No products match your search or filters."),
    ).toBeInTheDocument();
    expect(screen.getByText("Try adjusting your filters or search terms.")).toBeInTheDocument();
  });

  it("renders one ProductCard per product", () => {
    const { container } = render(
      <ProductsGrid products={productList} isLoading={false} isError={false} />,
    );

    expect(screen.getByText("Product One")).toBeInTheDocument();
    expect(screen.getByText("Product Two")).toBeInTheDocument();
    expect(container.querySelectorAll(".overflow-hidden")).toHaveLength(productList.length);
  });

  it("dims the grid while refetching", () => {
    const { container, rerender } = render(
      <ProductsGrid products={productList} isFetching={false} />,
    );
    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("opacity-100");

    rerender(<ProductsGrid products={productList} isFetching />);
    expect(grid).toHaveClass("opacity-60");
  });
});
