import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LazyImage from "../../shared/components/LazyImage";

const SRC = "https://example.com/products/1.png";

describe("LazyImage", () => {
  it("renders a native lazy image with async decoding", () => {
    render(<LazyImage src={SRC} alt="Product image" />);

    const img = screen.getByRole("img", { name: "Product image" });
    expect(img).toHaveAttribute("src", SRC);
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });

  it("shows an animate-pulse skeleton and keeps the image faded out while loading", () => {
    const { container } = render(<LazyImage src={SRC} alt="Product image" />);

    const skeleton = container.querySelector('[aria-hidden="true"]');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("animate-pulse");
    expect(screen.getByRole("img")).toHaveClass("opacity-0");
  });

  it("fades the image in and removes the skeleton when it loads", () => {
    const { container } = render(<LazyImage src={SRC} alt="Product image" />);

    fireEvent.load(screen.getByRole("img"));

    expect(screen.getByRole("img")).toHaveClass("opacity-100");
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it("stops showing the skeleton if the image fails to load", () => {
    const { container } = render(<LazyImage src={SRC} alt="Product image" />);

    fireEvent.error(screen.getByRole("img"));

    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveClass("opacity-100");
  });

  it("marks already-cached images as loaded right away (no skeleton flash)", () => {
    const complete = vi
      .spyOn(HTMLImageElement.prototype, "complete", "get")
      .mockReturnValue(true);
    const naturalWidth = vi
      .spyOn(HTMLImageElement.prototype, "naturalWidth", "get")
      .mockReturnValue(100);

    const { container } = render(<LazyImage src={SRC} alt="Product image" />);

    expect(screen.getByRole("img")).toHaveClass("opacity-100");
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();

    complete.mockRestore();
    naturalWidth.mockRestore();
  });

  it("uses the wrapper classes so the image box is reserved (CLS-safe)", () => {
    const { container } = render(
      <LazyImage
        src={SRC}
        alt="Product image"
        wrapperClassName="w-full h-full flex items-center justify-center"
      />,
    );

    const wrapper = container.querySelector("span.relative");
    expect(wrapper).toHaveClass("w-full", "h-full", "flex", "items-center", "justify-center");
  });

  it("forwards extra classes to the <img>", () => {
    render(<LazyImage src={SRC} alt="Product image" className="max-w-full object-contain" />);

    expect(screen.getByRole("img")).toHaveClass("max-w-full", "object-contain");
  });
});
