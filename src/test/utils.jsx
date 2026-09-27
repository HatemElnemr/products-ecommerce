import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";

/**
 * A QueryClient with retries disabled so failures/errors surface immediately
 * and nothing stays in the cache between tests.
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
      },
    },
  });
}

/**
 * Render any UI that needs React Query + a router (pages, hooks consumers...).
 * Returns the RTL helpers plus the memory router so tests can inspect the URL.
 */
export function renderWithProviders(ui, { route = "/", queryClient } = {}) {
  const client = queryClient ?? createTestQueryClient();
  const router = createMemoryRouter([{ path: "*", element: ui }], {
    initialEntries: [route],
  });

  const result = render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return { ...result, router, queryClient: client };
}

/** Same, but for `renderHook` from @testing-library/react. */
export function createWrapper({ queryClient } = {}) {
  const client = queryClient ?? createTestQueryClient();
  function Wrapper({ children }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }
  return { Wrapper, queryClient: client };
}
