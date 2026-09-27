import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProductsPage from "../../features/Products/pages/ProductsPage";
import { renderWithProviders } from "../utils";
import { stubFetch, jsonResponse } from "../fetchMock";
import { productsBody, categoryList, productList } from "../fixtures";

/**
 * A direct test of the browser back / forward buttons.
 *
 * Instead of only checking that a component writes a param to the URL (and can
 * read it back on a fresh mount), this walks a real history stack: it builds
 * entries through the UI, then pops back and forward through them and asserts
 * that every piece of visible state (search box, category label, sort label,
 * active page) is restored together — i.e. no state corruption between steps.
 */
function stubProducts() {
  return stubFetch((url) => {
    if (url.includes("/category-list")) return jsonResponse(categoryList);
    return jsonResponse(productsBody(productList, 30));
  });
}

const searchBox = () => screen.getByPlaceholderText("Search products…");
const pageButton = (n) => screen.getByRole("button", { name: String(n) });

/** The active page is styled with the solid green class (see Pagination.jsx). */
function expectActivePage(n) {
  for (let p = 1; p <= 3; p++) {
    if (p === n) expect(pageButton(p)).toHaveClass("bg-[#1D4A3D]");
    else expect(pageButton(p)).not.toHaveClass("bg-[#1D4A3D]");
  }
}

const goBack = (router) =>
  act(async () => {
    await router.navigate(-1);
  });

const goForward = (router) =>
  act(async () => {
    await router.navigate(1);
  });

describe("Browser back / forward", () => {
  it("restores the full filter state when stepping back through history", async () => {
    stubProducts();
    const { router } = renderWithProviders(<ProductsPage />, { route: "/products" });

    // let the lazy sidebar chunk and the first page of products land
    await screen.findByRole("button", { name: "All categories" }, { timeout: 5000 });
    await screen.findByText("Product One");

    // --- history entry 1: a search term (debounced push) -------------------
    fireEvent.change(searchBox(), { target: { value: "tv" } });
    await waitFor(
      () => expect(router.state.location.search).toContain("search=tv"),
      { timeout: 2000 },
    );

    // --- history entry 2: a category ---------------------------------------
    fireEvent.click(screen.getByRole("button", { name: "All categories" }));
    fireEvent.click(await screen.findByRole("option", { name: "Beauty" }));
    await waitFor(() =>
      expect(router.state.location.search).toContain("category=beauty"),
    );

    // --- history entry 3: page 2 -------------------------------------------
    fireEvent.click(pageButton(2));
    await waitFor(() => expect(router.state.location.search).toContain("page=2"));
    expectActivePage(2);

    // --- back: page 2 -> page 1, filters untouched --------------------------
    await goBack(router);
    await waitFor(() =>
      expect(router.state.location.search).not.toContain("page=2"),
    );
    expect(searchBox()).toHaveValue("tv");
    expect(screen.getByRole("button", { name: "Beauty" })).toBeInTheDocument();
    expectActivePage(1);

    // --- back: category removed, search kept -------------------------------
    await goBack(router);
    await waitFor(() =>
      expect(router.state.location.search).not.toContain("category="),
    );
    expect(searchBox()).toHaveValue("tv");
    expect(
      screen.getByRole("button", { name: "All categories" }),
    ).toBeInTheDocument();
    expectActivePage(1);

    // --- back: everything cleared ------------------------------------------
    await goBack(router);
    await waitFor(() => expect(router.state.location.search).toBe(""));
    expect(searchBox()).toHaveValue("");
    expect(
      screen.getByRole("button", { name: "All categories" }),
    ).toBeInTheDocument();
    expectActivePage(1);

    // no filter leaked into a later history entry
    expect(router.state.location.search).not.toContain("search=");
    expect(router.state.location.search).not.toContain("sort=");
  });

  it("re-applies the full filter state when stepping forward through history", async () => {
    stubProducts();
    const { router } = renderWithProviders(<ProductsPage />, { route: "/products" });

    await screen.findByRole("button", { name: "All categories" }, { timeout: 5000 });
    await screen.findByText("Product One");

    fireEvent.change(searchBox(), { target: { value: "tv" } });
    await waitFor(
      () => expect(router.state.location.search).toContain("search=tv"),
      { timeout: 2000 },
    );

    fireEvent.click(screen.getByRole("button", { name: "All categories" }));
    fireEvent.click(await screen.findByRole("option", { name: "Beauty" }));
    await waitFor(() =>
      expect(router.state.location.search).toContain("category=beauty"),
    );

    fireEvent.click(pageButton(2));
    await waitFor(() => expect(router.state.location.search).toContain("page=2"));

    // rewind the whole stack in one go, then replay it with forward
    await goBack(router);
    await goBack(router);
    await goBack(router);
    await waitFor(() => expect(router.state.location.search).toBe(""));
    expect(searchBox()).toHaveValue("");

    // forward 1: the search term comes back
    await goForward(router);
    await waitFor(() => expect(router.state.location.search).toContain("search=tv"));
    expect(searchBox()).toHaveValue("tv");
    expect(
      screen.getByRole("button", { name: "All categories" }),
    ).toBeInTheDocument();

    // forward 2: the category comes back
    await goForward(router);
    await waitFor(() =>
      expect(router.state.location.search).toContain("category=beauty"),
    );
    expect(screen.getByRole("button", { name: "Beauty" })).toBeInTheDocument();
    expect(searchBox()).toHaveValue("tv");

    // forward 3: the page comes back, and every other filter survives with it
    await goForward(router);
    await waitFor(() => expect(router.state.location.search).toContain("page=2"));
    expectActivePage(2);
    expect(searchBox()).toHaveValue("tv");
    expect(screen.getByRole("button", { name: "Beauty" })).toBeInTheDocument();

    // one consolidated check: the restored entry holds every param together
    expect(router.state.location.search).toContain("search=tv");
    expect(router.state.location.search).toContain("category=beauty");
    expect(router.state.location.search).toContain("page=2");
  });
});
