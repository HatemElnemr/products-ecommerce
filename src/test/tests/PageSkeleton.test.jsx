import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PageSkeleton from "../../shared/components/PageSkeleton";

describe("PageSkeleton", () => {
  it("is announced as a loading status", () => {
    render(<PageSkeleton />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders pulsing placeholders instead of real content", () => {
    const { container } = render(<PageSkeleton />);

    const pulseBlocks = container.querySelectorAll(".animate-pulse");
    expect(pulseBlocks.length).toBeGreaterThanOrEqual(5);
    expect(screen.queryByText(/Things worth keeping/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Products/)).not.toBeInTheDocument();
  });

  it("matches the page shell (max-w-275 container)", () => {
    const { container } = render(<PageSkeleton />);
    expect(container.querySelector("main")).toHaveClass("max-w-275", "mx-auto", "px-5");
  });
});
