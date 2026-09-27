import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "../../features/Landing/components/Footer";

describe("Footer", () => {
  it("renders the copyright and the demo note", () => {
    render(<Footer />);

    expect(screen.getByText("© 2026 Harbor")).toBeInTheDocument();
    expect(screen.getByText("Design demo — React UI Component")).toBeInTheDocument();
  });

  it("renders a <footer> element with the top border", () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass("border-t", "py-9");
  });
});
