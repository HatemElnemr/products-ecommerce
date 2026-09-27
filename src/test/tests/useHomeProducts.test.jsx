import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useHeroProducts, useLandingCategories } from "../../hooks/useHomeProducts";
import { createWrapper } from "../utils";
import { stubFetch, jsonResponse, errorResponse } from "../fetchMock";
import { heroProducts } from "../fixtures";

const BASE = "https://dummyjson.com/products";

describe("useHeroProducts", () => {
  it("loads the top 3 products by rating", async () => {
    const fetchMock = stubFetch(() =>
      jsonResponse({ products: heroProducts, total: heroProducts.length }),
    );
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useHeroProducts(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE}?limit=3&sortBy=rating&order=desc`,
    );
    expect(result.current.data).toHaveLength(3);
    expect(result.current.data[0].title).toBe("Product One");
  });

  it("fails when the endpoint responds with an error", async () => {
    stubFetch(() => errorResponse(500));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useHeroProducts(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error.message).toBe("Failed to fetch hero products");
  });
});

describe("useLandingCategories", () => {
  it("requests one endpoint per slug and formats the tiles", async () => {
    const fetchMock = stubFetch((url) => {
      if (url.includes("/category/")) return jsonResponse({ total: 12 });
      return undefined;
    });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useLandingCategories(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/category/beauty?limit=1`);

    expect(result.current.data).toEqual([
      { slug: "beauty", title: "Beauty", count: "12 items", dotBg: "bg-[#C9A227]" },
      { slug: "fragrances", title: "Fragrances", count: "12 items", dotBg: "bg-[#2F6F5E]" },
      { slug: "furniture", title: "Furniture", count: "12 items", dotBg: "bg-[#A23B2E]" },
      { slug: "smartphones", title: "Smartphones", count: "12 items", dotBg: "bg-[#5B7DB1]" },
    ]);
  });

  it("formats hyphenated slugs into readable titles", async () => {
    stubFetch(() => jsonResponse({ total: 3 }));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useLandingCategories(["mens-watches"]), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data[0]).toMatchObject({
      slug: "mens-watches",
      title: "Mens Watches",
      count: "3 items",
    });
  });

  it("falls back to 0 items when the response has no total", async () => {
    stubFetch(() => jsonResponse({}));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useLandingCategories(["beauty"]), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data[0].count).toBe("0 items");
  });

  it("rejects the whole list if one category request fails", async () => {
    stubFetch((url) =>
      url.includes("/category/furniture") ? errorResponse(404) : jsonResponse({ total: 5 }),
    );
    const { Wrapper } = createWrapper();
    const { result } = renderHook(
      () => useLandingCategories(["beauty", "furniture"]),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error.message).toBe("Failed to fetch category furniture");
  });
});
