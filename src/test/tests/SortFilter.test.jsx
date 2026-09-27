import { screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SortFilter from "../../features/Products/components/SortFilter";
import UrlProbe from "../UrlProbe";
import { renderWithProviders } from "../utils";

function renderSort(route = "/products") {
  return renderWithProviders(
    <>
      <SortFilter />
      <UrlProbe />
    </>,
    { route },
  );
}

const openMenu = () => fireEvent.click(screen.getByRole("button", { name: /Newest|Price|Top rated|Name/ }));

describe("SortFilter", () => {
  it("renders the heading and the default option", () => {
    renderSort();

    expect(screen.getByText("Sort by")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Newest" })).toBeInTheDocument();
  });

  it("shows the sort coming from the URL", () => {
    renderSort("/products?sort=rating-desc");

    expect(screen.getByRole("button", { name: "Top rated" })).toBeInTheDocument();
  });

  it("lists every sort option when opened", () => {
    renderSort();
    openMenu();

    expect(screen.getByRole("option", { name: "Newest" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Price: low to high" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Price: high to low" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Top rated" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Name: A to Z" })).toBeInTheDocument();
  });

  it("writes the chosen sort to the URL and resets the page", () => {
    renderSort("/products?page=3");

    openMenu();
    fireEvent.click(screen.getByRole("option", { name: "Price: low to high" }));

    expect(screen.getByTestId("url")).toHaveTextContent("sort=price-asc");
    expect(screen.getByTestId("url")).toHaveTextContent("page=1");
    expect(screen.getByRole("button", { name: "Price: low to high" })).toBeInTheDocument();
  });

  it("removes the sort param when the default option is picked", () => {
    renderSort("/products?sort=price-desc&page=2");

    openMenu();
    fireEvent.click(screen.getByRole("option", { name: "Newest" }));

    expect(screen.getByTestId("url")).toHaveTextContent("sort=|");
    expect(screen.getByTestId("url")).toHaveTextContent("page=1");
  });
});
