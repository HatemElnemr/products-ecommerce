import { useSearchParams } from "react-router";

/**
 * Tiny test probe: exposes the current URL params as text so tests can assert
 * how components write to the router state.
 */
export default function UrlProbe({ testId = "url" }) {
  const [params] = useSearchParams();

  const value = ["search", "category", "sort", "page"]
    .map((key) => `${key}=${params.get(key) ?? ""}`)
    .join("|");

  return <div data-testid={testId}>{value}</div>;
}
