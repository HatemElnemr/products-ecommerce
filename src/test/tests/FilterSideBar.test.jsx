import { screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import FilterSideBar from "../../features/Products/components/FilterSideBar";
import UrlProbe from "../UrlProbe";
import { renderWithProviders } from "../utils";
import { stubFetch, jsonResponse } from "../fetchMock";
import { categoryList } from "../fixtures";

function renderSidebar(route = "/products") {
  return renderWithProviders(
    <>
      <FilterSideBar />
      <UrlProbe />
    </>,
    { route },
  );
}

const panel = () => document.getElementById("filters-panel");

beforeEach(() => {
  stubFetch(() => jsonResponse(categoryList));
});

describe("FilterSideBar", () => {
  it("renders the mobile toggle, both filter blocks and the reset action", () => {
    renderSidebar();

    expect(screen.getByRole("button", { name: /Filters/ })).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Sort by")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset filters" })).toBeInTheDocument();
  });

  it("starts open", () => {
    renderSidebar();

    expect(panel()).not.toHaveClass("hidden");
    expect(screen.getByRole("button", { name: /Filters/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("collapses the panel from the mobile toggle", () => {
    renderSidebar();

    fireEvent.click(screen.getByRole("button", { name: /Filters/ }));

    expect(panel()).toHaveClass("hidden");
    expect(screen.getByRole("button", { name: /Filters/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("keeps `md:block` so a panel closed on mobile is still visible on desktop", () => {
    renderSidebar();

    fireEvent.click(screen.getByRole("button", { name: /Filters/ }));

    expect(panel()).toHaveClass("hidden", "md:block");
  });

  it("rotates the chevron when collapsed", () => {
    renderSidebar();

    const button = screen.getByRole("button", { name: /Filters/ });
    const icons = Array.from(button.querySelectorAll("svg"));
    const chevron = icons[icons.length - 1];

    expect(chevron).toHaveClass("rotate-180");
    fireEvent.click(button);
    expect(chevron).not.toHaveClass("rotate-180");
  });

  it("disables the reset action while no filter is active", () => {
    renderSidebar();

    expect(screen.getByRole("button", { name: "Reset filters" })).toBeDisabled();
  });

  it("clears every URL param when reset is clicked", async () => {
    renderSidebar("/products?search=tv&category=beauty&sort=price-asc&page=4");

    const reset = await screen.findByRole("button", { name: "Reset filters" });
    expect(reset).toBeEnabled();

    fireEvent.click(reset);

    expect(screen.getByTestId("url")).toHaveTextContent("search=|category=|sort=|page=");
  });

  it("is sticky only from the md breakpoint up", () => {
    const { container } = renderSidebar();

    const aside = container.querySelector("aside");
    expect(aside).toHaveClass("md:sticky", "md:top-20");
    expect(aside).not.toHaveClass("sticky");
    expect(aside).not.toHaveClass("top-20");
  });
});
