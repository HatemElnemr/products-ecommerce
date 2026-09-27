import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SearchBar from "../../features/Products/components/SearchBar";
import UrlProbe from "../UrlProbe";
import { renderWithProviders } from "../utils";

function renderSearchBar(route = "/products") {
  return renderWithProviders(
    <>
      <SearchBar />
      <UrlProbe />
    </>,
    { route },
  );
}

describe("SearchBar", () => {
  it("seeds the input from the ?search param", () => {
    renderSearchBar("/products?search=phone&page=2");

    expect(screen.getByPlaceholderText("Search products…")).toHaveValue("phone");
  });

  it("renders a lazy, accessible text input", () => {
    renderSearchBar();

    const input = screen.getByPlaceholderText("Search products…");
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByTestId("url")).toHaveTextContent("search=");
  });

  it("updates the input immediately but does not touch the URL before the debounce", () => {
    renderSearchBar("/products?search=old&page=3");

    const input = screen.getByPlaceholderText("Search products…");
    fireEvent.change(input, { target: { value: "laptop" } });

    expect(input).toHaveValue("laptop");
    expect(screen.getByTestId("url")).toHaveTextContent("search=old");
  });

  it("writes the debounced value to the URL and resets pagination to page 1", async () => {
    renderSearchBar("/products?search=old&page=3");

    fireEvent.change(screen.getByPlaceholderText("Search products…"), {
      target: { value: "laptop" },
    });

    await waitFor(
      () => expect(screen.getByTestId("url")).toHaveTextContent("search=laptop"),
      { timeout: 2000 },
    );
    expect(screen.getByTestId("url")).toHaveTextContent("page=1");
  });

  it("removes the search param when the input is cleared", async () => {
    renderSearchBar("/products?search=old&page=3");

    fireEvent.change(screen.getByPlaceholderText("Search products…"), {
      target: { value: "   " },
    });

    await waitFor(
      () => expect(screen.getByTestId("url")).toHaveTextContent("search=|"),
      { timeout: 2000 },
    );
    expect(screen.getByTestId("url")).toHaveTextContent("page=1");
  });

  it("stays in sync when the URL changes externally (browser back)", async () => {
    const { router } = renderSearchBar("/products?search=first");

    const input = screen.getByPlaceholderText("Search products…");
    expect(input).toHaveValue("first");

    await act(async () => {
      await router.navigate("/products?search=second");
    });

    expect(input).toHaveValue("second");
  });
});
