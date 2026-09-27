import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroCard from "../../features/Landing/components/HeroCard";
import { makeProduct } from "../fixtures";

describe("HeroCard", () => {
  it("renders the product title, price and rating", () => {
    render(<HeroCard product={makeProduct({ title: "Amber Night", price: 64, rating: 4.8 })} />);

    expect(screen.getByText("Amber Night")).toBeInTheDocument();
    expect(screen.getByText("$64")).toBeInTheDocument();
    expect(screen.getByText("4.8")).toBeInTheDocument();
  });

  it("renders the image through LazyImage (lazy + async decoding)", () => {
    render(<HeroCard product={makeProduct({ title: "Amber Night" })} />);

    const img = screen.getByRole("img", { name: "Amber Night" });
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });

  it("applies the position classes passed via className", () => {
    const { container } = render(
      <HeroCard product={makeProduct()} className="top-[12%] left-[6%] -rotate-7 z-1" />,
    );

    const card = container.firstElementChild;
    expect(card).toHaveClass("absolute", "top-[12%]", "left-[6%]", "-rotate-7", "z-1");
  });

  it("keeps the original image wrapper classes (text-2xl block mb-2)", () => {
    const { container } = render(<HeroCard product={makeProduct()} />);

    const wrapper = container.querySelector("span.relative");
    expect(wrapper).toHaveClass("text-2xl", "block", "mb-2");
  });
});
