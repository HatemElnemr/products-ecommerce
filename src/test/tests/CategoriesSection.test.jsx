import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CategoriesSection from "../../features/Landing/components/CategoriesSection";
import { landingCategories } from "../fixtures";

describe("CategoriesSection", () => {
  it("renders the section title", () => {
    render(<CategoriesSection categories={[]} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Shop by category" }),
    ).toBeInTheDocument();
  });

  it("renders 4 skeleton cards while loading", () => {
    const { container } = render(<CategoriesSection categories={[]} isLoading />);

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons).toHaveLength(4);
    expect(screen.queryByText("Beauty")).not.toBeInTheDocument();
  });

  it("renders every category with its title, count and dot color", () => {
    const { container } = render(
      <CategoriesSection categories={landingCategories} isLoading={false} />,
    );

    expect(screen.getByText("Beauty")).toBeInTheDocument();
    expect(screen.getByText("10 items")).toBeInTheDocument();
    expect(screen.getByText("Smartphones")).toBeInTheDocument();
    expect(screen.getByText("9 items")).toBeInTheDocument();

    expect(container.querySelector('div[class*="bg-[#C9A227]"]')).toBeInTheDocument();
    expect(container.querySelector('div[class*="bg-[#5B7DB1]"]')).toBeInTheDocument();
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(0);
  });

  it("uses the category slug as React key (no duplicate-key warnings)", () => {
    const { container } = render(
      <CategoriesSection categories={landingCategories} />,
    );

    const cards = container.querySelectorAll(".cursor-pointer");
    expect(cards).toHaveLength(landingCategories.length);
  });
});
