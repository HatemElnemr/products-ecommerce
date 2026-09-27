import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LandingPage from "../../features/Landing/pages/LandingPage";
import { renderWithProviders } from "../utils";
import { stubFetch, jsonResponse } from "../fetchMock";
import { heroProducts } from "../fixtures";

function stubLandingFetch() {
  return stubFetch((url) => {
    if (url.includes("sortBy=rating")) {
      return jsonResponse({ products: heroProducts, total: heroProducts.length });
    }
    if (url.includes("/category/")) return jsonResponse({ total: 8 });
    return undefined;
  });
}

describe("LandingPage", () => {
  it("renders the hero, feature strip, categories and footer", async () => {
    stubLandingFetch();
    renderWithProviders(<LandingPage />, { route: "/" });

    // hero + strip are eager
    expect(
      screen.getByRole("heading", { level: 1, name: /Things worth keeping/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("48-hour delivery")).toBeInTheDocument();
    expect(screen.getByText("+194 items added this week")).toBeInTheDocument();

    // CategoriesSection is lazy + data driven
    expect(
      await screen.findByRole("heading", { level: 2, name: "Shop by category" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Beauty")).toBeInTheDocument();
    expect(screen.getAllByText("8 items")).toHaveLength(4);

    // Footer is lazy
    expect(await screen.findByText("© 2026 Harbor")).toBeInTheDocument();
  });

  it("shows the hero loading overlay while the products request is pending", () => {
    stubFetch(() => new Promise(() => {})); // never resolves
    renderWithProviders(<LandingPage />, { route: "/" });

    expect(screen.getByText("Loading highlights...")).toBeInTheDocument();
    expect(screen.queryByText("Product One")).not.toBeInTheDocument();
  });

  it("requests the hero list plus the four landing categories", async () => {
    const fetchMock = stubLandingFetch();
    renderWithProviders(<LandingPage />, { route: "/" });

    await screen.findByText("Beauty");

    const urls = fetchMock.mock.calls.map(([url]) => String(url));
    expect(urls.some((u) => u.includes("/products?limit=3&sortBy=rating&order=desc"))).toBe(true);
    for (const slug of ["beauty", "fragrances", "furniture", "smartphones"]) {
      expect(urls.some((u) => u.includes(`/category/${slug}?limit=1`))).toBe(true);
    }
  });

  it("renders the hero cards with the fetched products", async () => {
    stubLandingFetch();
    renderWithProviders(<LandingPage />, { route: "/" });

    expect(await screen.findByText("Product One")).toBeInTheDocument();
    expect(screen.getByText("Product Two")).toBeInTheDocument();
    expect(screen.getByText("Product Three")).toBeInTheDocument();
  });
});
