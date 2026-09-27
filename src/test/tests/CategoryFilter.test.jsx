import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CategoryFilter from "../../features/Products/components/CategoryFilter";
import UrlProbe from "../UrlProbe";
import { renderWithProviders } from "../utils";
import { stubFetch, jsonResponse } from "../fetchMock";
import { categoryList } from "../fixtures";

function renderFilter(route = "/products") {
  return renderWithProviders(
    <>
      <CategoryFilter />
      <UrlProbe />
    </>,
    { route },
  );
}

const openMenu = () =>
  fireEvent.click(screen.getByRole("button", { name: /categories|Watches|Beauty|Loading/i }));

describe("CategoryFilter", () => {
  it("shows a loading label until the category list arrives", () => {
    stubFetch(() => new Promise(() => {})); // never resolves
    renderFilter();

    expect(screen.getByRole("button", { name: "Loading..." })).toBeInTheDocument();
  });

  it("defaults to 'All categories' once loaded", async () => {
    stubFetch(() => jsonResponse(categoryList));
    renderFilter();

    expect(
      await screen.findByRole("button", { name: "All categories" }),
    ).toBeInTheDocument();
  });

  it("lists the fetched categories formatted", async () => {
    stubFetch(() => jsonResponse(categoryList));
    renderFilter();

    await screen.findByRole("button", { name: "All categories" });
    openMenu();

    expect(await screen.findByRole("option", { name: /All Categories/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Beauty" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Fragrances" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Mens Watches" })).toBeInTheDocument();
  });

  it("puts the selected category in the URL and resets the page", async () => {
    stubFetch(() => jsonResponse(categoryList));
    renderFilter("/products?page=5");

    await screen.findByRole("button", { name: "All categories" });
    openMenu();

    fireEvent.click(await screen.findByRole("option", { name: "Beauty" }));

    expect(screen.getByTestId("url")).toHaveTextContent("category=beauty");
    expect(screen.getByTestId("url")).toHaveTextContent("page=1");
  });

  it("labels the category that comes from the URL", async () => {
    stubFetch(() => jsonResponse(categoryList));
    renderFilter("/products?category=mens-watches");

    expect(await screen.findByRole("button", { name: "Mens Watches" })).toBeInTheDocument();
  });

  it("surfaces a failed category list without touching the URL", async () => {
    stubFetch(() => {
      throw new Error("network down");
    });
    renderFilter();

    await waitFor(
      () =>
        expect(screen.getByRole("button", { name: "All categories" })).toBeInTheDocument(),
      { timeout: 2000 },
    );
    expect(screen.getByTestId("url")).toHaveTextContent("category=");
  });
});
