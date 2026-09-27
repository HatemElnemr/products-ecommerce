import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../../App";
import { createTestQueryClient } from "../utils";
import { stubFetch, jsonResponse } from "../fetchMock";
import { heroProducts, productsBody, categoryList } from "../fixtures";

/**
 * NOTE: App.jsx creates its browser router once at module scope, so every test
 * in this file shares that router (the same way the real app does). Tests are
 * therefore ordered and navigate through the UI instead of pushing URLs.
 */
function renderApp() {
  const client = createTestQueryClient();
  return render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>,
  );
}

const homeLink = () => screen.getByRole("link", { name: "Home" });
const productsLink = () => screen.getByRole("link", { name: "Products" });
const landingHeading = () =>
  screen.getByRole("heading", { level: 1, name: /Things worth keeping/i });
const productsHeading = () =>
  screen.getByRole("heading", { level: 1, name: "Products" });

beforeEach(() => {
  stubFetch((url) => {
    if (url.includes("/category-list")) return jsonResponse(categoryList);
    if (url.includes("/category/")) return jsonResponse({ total: 4 });
    if (url.includes("sortBy=rating")) {
      return jsonResponse({ products: heroProducts, total: heroProducts.length });
    }
    return jsonResponse(productsBody());
  });
});

describe("App routing", () => {
  /** The router is shared, so walk it to a known route through the UI. */
  async function goTo(path) {
    const link = path === "/" ? homeLink() : productsLink();
    if (link.getAttribute("aria-current") === "page") return;
    fireEvent.click(link);
    await waitFor(() => expect(link).toHaveAttribute("aria-current", "page"), {
      timeout: 5000,
    });
  }

  it("boots on the landing page with the shared header", async () => {
    renderApp();

    expect(homeLink()).toHaveAttribute("href", "/");
    expect(productsLink()).toHaveAttribute("href", "/products");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /Things worth keeping/i,
      }),
    ).toBeInTheDocument();
    expect(homeLink()).toHaveAttribute("aria-current", "page");
    expect(screen.queryByPlaceholderText("Search products…")).not.toBeInTheDocument();
  });

  it("renders the products page after clicking the nav link", async () => {
    renderApp();
    await goTo("/");

    fireEvent.click(productsLink());

    expect(await waitFor(() => productsHeading())).toBeInTheDocument();
    expect(
      await screen.findByPlaceholderText("Search products…", {}, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(productsLink()).toHaveAttribute("aria-current", "page");
    expect(screen.queryByText(/Things worth keeping/i)).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/products");
  });

  it("navigates back to the landing page", async () => {
    renderApp();
    await goTo("/");

    fireEvent.click(productsLink());
    await waitFor(() => expect(productsHeading()).toBeInTheDocument());

    fireEvent.click(homeLink());

    await waitFor(() => expect(landingHeading()).toBeInTheDocument(), {
      timeout: 5000,
    });
    expect(homeLink()).toHaveAttribute("aria-current", "page");
    expect(window.location.pathname).toBe("/");
  });

  it("keeps the header mounted across route changes", async () => {
    renderApp();
    await goTo("/");

    const headerBefore = screen.getByRole("link", { name: "Home" });
    fireEvent.click(productsLink());

    // the header survives the Suspense fallback of the lazy route
    expect(screen.getByRole("link", { name: "Home" })).toBe(headerBefore);
    await waitFor(() => expect(productsHeading()).toBeInTheDocument(), {
      timeout: 5000,
    });
    expect(screen.getByRole("link", { name: "Products" })).toBeInTheDocument();
  });
});
