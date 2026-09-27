import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Pagination from "../../features/Products/components/Pagination";

const buttonsOf = (container) => Array.from(container.querySelectorAll("button"));

describe("Pagination", () => {
  it("renders one button per page", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);

    for (let p = 1; p <= 5; p++) {
      expect(screen.getByRole("button", { name: String(p) })).toBeInTheDocument();
    }
  });

  it("highlights the active page", () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "3" })).toHaveClass("bg-[#1D4A3D]");
    expect(screen.getByRole("button", { name: "2" })).not.toHaveClass("bg-[#1D4A3D]");
  });

  it("disables previous on the first page and next on the last page", () => {
    const { container, rerender } = render(
      <Pagination currentPage={1} totalPages={4} onPageChange={vi.fn()} />,
    );

    let buttons = buttonsOf(container);
    expect(buttons[0]).toBeDisabled();
    expect(buttons[buttons.length - 1]).not.toBeDisabled();

    rerender(<Pagination currentPage={4} totalPages={4} onPageChange={vi.fn()} />);

    buttons = buttonsOf(container);
    expect(buttons[0]).not.toBeDisabled();
    expect(buttons[buttons.length - 1]).toBeDisabled();
  });

  it("calls onPageChange with the clicked page number", () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={4} onPageChange={onPageChange} />);

    screen.getByRole("button", { name: "4" }).click();

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("wires the arrows to previous / next", () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <Pagination currentPage={2} totalPages={4} onPageChange={onPageChange} />,
    );

    const buttons = buttonsOf(container);
    buttons[0].click();
    buttons[buttons.length - 1].click();

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });
});
