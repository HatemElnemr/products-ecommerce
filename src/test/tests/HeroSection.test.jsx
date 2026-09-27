import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroSection from "../../features/Landing/components/HeroSection";
import { heroProducts } from "../fixtures";
import { renderWithProviders } from "../utils";

describe("HeroSection", () => {
  it("shows the loading overlay while the hero products are loading", () => {
    renderWithProviders(<HeroSection heroProducts={[]} isLoading />);

    expect(screen.getByText("Loading highlights...")).toBeInTheDocument();
    expect(screen.queryByText("Product One")).not.toBeInTheDocument();
  });

  it("renders the three hero cards once the products arrive", () => {
    renderWithProviders(<HeroSection heroProducts={heroProducts} isLoading={false} />);

    expect(screen.getByText("Product One")).toBeInTheDocument();
    expect(screen.getByText("Product Two")).toBeInTheDocument();
    expect(screen.getByText("Product Three")).toBeInTheDocument();
    expect(screen.queryByText("Loading highlights...")).not.toBeInTheDocument();
  });

  it("renders the headline and the weekly badge", () => {
    renderWithProviders(<HeroSection heroProducts={heroProducts} />);

    expect(
      screen.getByRole("heading", { level: 1, name: /Things worth keeping/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("+194 items added this week")).toBeInTheDocument();
  });

  it("keeps the two-column hero grid", () => {
    const { container } = renderWithProviders(<HeroSection heroProducts={heroProducts} />);

    const section = container.querySelector("section");
    expect(section).toHaveClass("border-b", "py-16");

    const grid = section.firstElementChild;
    expect(grid).toHaveClass(
      "max-w-275",
      "mx-auto",
      "grid",
      "grid-cols-1",
      "md:grid-cols-[1.1fr_0.9fr]",
    );
  });
});
