import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProductsPage from "../../features/Products/pages/ProductsPage";
import { renderWithProviders } from "../utils";
import { stubFetch, jsonResponse, errorResponse } from "../fetchMock";
import { productsBody, categoryList, productList } from "../fixtures";

function stubProducts({ body = productsBody(), status = 200, pending = false } = {}) {
  return stubFetch((url) => {
    if (pending) return new Promise(() => {}); // hang every request
    if (url.includes("/category-list")) return jsonResponse(categoryList);
    if (status >= 400) return errorResponse(status);
    if (url.includes("/category/")) return jsonResponse(body);
    return jsonResponse(body);
  });
}

function renderProductsPage(route = "/products") {
  return renderWithProviders(<ProductsPage />, { route });
}

describe("ProductsPage", () => {
  it("renders the header, the search box and the filter sidebar", async () => {
    stubProducts();
    renderProductsPage();

    expect(
      screen.getByRole("heading", { level: 1, name: "Products" }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search products…")).toBeInTheDocument();
    // the sidebar is a lazy chunk, allow a cold import to finish
    expect(
      await screen.findByText("Category", {}, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(screen.getByText("Sort by")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset filters" })).toBeInTheDocument();
  });

  it("renders the product cards once the data resolves", async () => {
    stubProducts();
    renderProductsPage();

    expect(await screen.findByText("Product One")).toBeInTheDocument();
    expect(screen.getByText("Product Two")).toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: "Product One" }).length).toBeGreaterThan(0);
  });

  it("shows the grid skeleton while loading", () => {
    stubProducts({ pending: true });
    const { container } = renderProductsPage();

    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThanOrEqual(12);
    expect(screen.queryByText("Product One")).not.toBeInTheDocument();
  });

  it("shows the error state when the request fails", async () => {
    stubProducts({ status: 500 });
    renderProductsPage();

    expect(await screen.findByText("Error loading products")).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch products")).toBeInTheDocument();
  });

  it("shows the empty state when no product matches", async () => {
    stubProducts({ body: productsBody([], 0) });
    renderProductsPage();

    expect(
      await screen.findByText("No products match your search or filters."),
    ).toBeInTheDocument();
  });

  it("renders pagination when there is more than one page", async () => {
    stubProducts({ body: productsBody(productList, 30) });
    renderProductsPage();

    expect(await screen.findByRole("button", { name: "3" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
  });

  it("hides pagination while there is a single page", async () => {
    stubProducts({ body: productsBody(productList, 5) });
    renderProductsPage();

    await screen.findByText("Product One");
    expect(screen.queryByRole("button", { name: "2" })).not.toBeInTheDocument();
  });

  it("writes the page to the URL when a page number is clicked", async () => {
    stubProducts({ body: productsBody(productList, 30) });
    const { router } = renderProductsPage();

    fireEvent.click(await screen.findByRole("button", { name: "2" }));

    await waitFor(() => expect(router.state.location.search).toContain("page=2"));
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("seeds the search input from the URL", async () => {
    stubProducts({ body: productsBody([], 0) });
    renderProductsPage("/products?search=tv");

    expect(await screen.findByPlaceholderText("Search products…")).toHaveValue("tv");
    expect(
      screen.getByRole("heading", { level: 1, name: "Products" }),
    ).toBeInTheDocument();
  });

  it("reflects the category from the URL in the sidebar", async () => {
    stubProducts({ body: productsBody([], 0) });
    renderProductsPage("/products?category=beauty");

    expect(await screen.findByRole("button", { name: "Beauty" })).toBeInTheDocument();
  });
});
