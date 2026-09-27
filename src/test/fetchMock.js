import { vi } from "vitest";

/** Minimal `Response`-like object good enough for the app's fetch calls. */
export function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

export function errorResponse(status = 500) {
  return { ok: false, status, json: async () => ({}) };
}

/**
 * Stub the global `fetch` with a router-style handler.
 *
 *   const fetchMock = stubFetch((url) => {
 *     if (url.includes("sortBy=rating")) return jsonResponse({ products: [...] });
 *     return jsonResponse({ total: 10 });
 *   });
 *
 * Throws if the handler returns `undefined`, so unexpected requests fail loudly.
 */
export function stubFetch(handler) {
  const mock = vi.fn(async (input) => {
    const url = String(input);
    const response = handler(url);
    if (response === undefined) {
      throw new Error(`Unhandled fetch in test: ${url}`);
    }
    return response;
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}
