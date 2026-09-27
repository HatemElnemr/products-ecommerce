import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FeatureStrip from "../../features/Landing/components/FeatureStrip";

describe("FeatureStrip", () => {
  it("renders the three promotional highlights", () => {
    render(<FeatureStrip />);

    expect(screen.getByText("48-hour delivery")).toBeInTheDocument();
    expect(screen.getByText("14-day returns")).toBeInTheDocument();
    expect(screen.getByText("Secure checkout")).toBeInTheDocument();
  });

  it("renders their sub labels", () => {
    render(<FeatureStrip />);

    expect(screen.getByText("major cities")).toBeInTheDocument();
    expect(screen.getByText("no questions asked")).toBeInTheDocument();
    expect(screen.getByText("end-to-end encrypted")).toBeInTheDocument();
  });

  it("keeps the responsive 3 column grid", () => {
    const { container } = render(<FeatureStrip />);
    const grid = container.firstChild;

    expect(grid).toHaveClass("grid", "grid-cols-1", "sm:grid-cols-3");
    expect(grid).toHaveClass("border-b", "border-[#E4E1D6]", "dark:border-[#28332D]");
  });
});
