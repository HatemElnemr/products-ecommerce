import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroContent from "../../features/Landing/components/HeroContent";
import { renderWithProviders } from "../utils";

describe("HeroContent", () => {
  it("renders the eyebrow, headline and copy", () => {
    renderWithProviders(<HeroContent />);

    expect(screen.getByText("Fall 2026 edit")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: /Things worth keeping/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/We shortlist from thousands of listings/i)).toBeInTheDocument();
  });

  it("links the CTA to the products page", () => {
    renderWithProviders(<HeroContent />);

    const cta = screen.getByRole("link", { name: /Browse products/i });
    expect(cta).toHaveAttribute("href", "/products");
    expect(cta.querySelector("button")).toHaveTextContent("Browse products");
  });
});
