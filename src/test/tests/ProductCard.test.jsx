import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProductCard from "../../features/Products/components/ProductCard";
import { makeProduct } from "../fixtures";

describe("ProductCard", () => {
  it("renders title, category, price and rating", () => {
    render(
      <ProductCard
        product={makeProduct({
          title: "Wireless Headphones",
          category: "laptops",
          price: 199,
          rating: 4.2,
        })}
      />,
    );

    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
    expect(screen.getByText("laptops")).toBeInTheDocument();
    expect(screen.getByText("$199")).toBeInTheDocument();
    expect(screen.getByText("★ 4.2")).toBeInTheDocument();
  });

  it("renders the image through LazyImage (lazy + async decoding)", () => {
    render(<ProductCard product={makeProduct({ title: "Wireless Headphones" })} />);

    const img = screen.getByRole("img", { name: "Wireless Headphones" });
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });

  it("reserves the full image box inside the aspect-ratio frame (CLS-safe)", () => {
    const { container } = render(<ProductCard product={makeProduct()} />);

    const frame = container.querySelector(".aspect-\\[1\\/0\\.85\\]");
    expect(frame).toBeInTheDocument();

    const wrapper = frame.querySelector("span.relative");
    expect(wrapper).toHaveClass("w-full", "h-full", "flex", "items-center", "justify-center");
  });

  it("keeps the card shell classes", () => {
    const { container } = render(<ProductCard product={makeProduct()} />);

    const card = container.firstElementChild;
    expect(card).toHaveClass("rounded-lg", "overflow-hidden", "flex", "flex-col");
  });
});
