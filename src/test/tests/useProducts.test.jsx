import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useProducts, useCategories } from "../../hooks/useProducts";
import { createWrapper } from "../utils";
import { stubFetch, jsonResponse, errorResponse } from "../fetchMock";
import { productsBody, categoryList, productList } from "../fixtures";

const BASE = "https://dummyjson.com/products";

function renderUseProducts(props) {
  const { Wrapper } = createWrapper();
  return renderHook(() => useProducts(props), { wrapper: Wrapper });
}

describe("useProducts", () => {
  it("fetches the default listing (page 1, no search/category/sort)", async () => {
    const fetchMock = stubFetch(() => jsonResponse(productsBody()));
    const { result } = renderUseProducts({ limit: 12 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(`${BASE}?limit=12&skip=0`);
    expect(result.current.data.products).toEqual(productList);
    expect(result.current.data.total).toBe(productList.length);
  });

  it("builds the search endpoint and encodes the query", async () => {
    const fetchMock = stubFetch(() => jsonResponse(productsBody()));
    const { result } = renderUseProducts({ search: "tv set", page: 2, limit: 6 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/search?q=tv%20set&limit=6&skip=6`);
  });

  it("builds the category endpoint", async () => {
    const fetchMock = stubFetch(() => jsonResponse(productsBody()));
    const { result } = renderUseProducts({ category: "beauty", limit: 6 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/category/beauty?limit=6&skip=0`);
  });

  it("appends sortBy/order for a non-default sort", async () => {
    const fetchMock = stubFetch(() => jsonResponse(productsBody()));
    const { result } = renderUseProducts({ sort: "price-asc", page: 3, limit: 12 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE}?limit=12&skip=24&sortBy=price&order=asc`,
    );
  });

  it("does not append sorting params for the default sort", async () => {
    const fetchMock = stubFetch(() => jsonResponse(productsBody()));
    const { result } = renderUseProducts({ sort: "default" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(String(fetchMock.mock.calls[0][0])).not.toContain("sortBy");
  });

  it("surfaces API failures as an error state", async () => {
    stubFetch(() => errorResponse(500));
    const { result } = renderUseProducts({});

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error.message).toBe("Failed to fetch products");
  });

  it("keeps the previous page data while refetching (keepPreviousData)", async () => {
    stubFetch(() => jsonResponse(productsBody()));
    const { Wrapper } = createWrapper();
    const { result, rerender } = renderHook((props) => useProducts(props), {
      wrapper: Wrapper,
      initialProps: { page: 1, limit: 6 },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const firstPage = result.current.data;

    rerender({ page: 2, limit: 6 });

    expect(result.current.data).toBe(firstPage);
  });
});

describe("useCategories", () => {
  it("returns the dummyjson category list", async () => {
    const fetchMock = stubFetch(() => jsonResponse(categoryList));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useCategories(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/category-list`);
    expect(result.current.data).toEqual(categoryList);
  });

  it("throws when the category list request fails", async () => {
    stubFetch(() => errorResponse(503));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useCategories(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error.message).toBe("failed to fetch categories");
  });
});
