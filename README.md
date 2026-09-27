<div align="center">

# 🛍️ Harbor

**A fast, filter-first React storefront — where every filter lives in the URL.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![React Router](https://img.shields.io/badge/React_Router-v8-CA4245?style=flat-square&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Vitest](https://img.shields.io/badge/Vitest-106_tests-passing-brightgreen?style=flat-square&logo=vitest&logoColor=white)](#-running-the-tests)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](#license)

</div>

---

## 📖 About

**Harbor** is a two-route e-commerce storefront built around a simple idea: **the URL is the state**.

Every user decision — the search term, the category, the sort order, the page — is written into the query string, which means filter combinations are shareable, bookmarkable, reloadable and, most importantly, **fully reversible with the browser's back/forward buttons**.

The experience is built for speed: the catalog renders a skeleton instantly, images lazy-load and fade in without shifting the layout, and below-the-fold code is split into its own chunks so the first paint never waits on it.

| Route | What it does |
|-------|--------------|
| `/` | Landing page — interactive hero banner with the top-rated products, feature strip, category tiles, footer |
| `/products` | Product catalog — search, category filter, sorting and pagination, all synced to the URL |

**Target experience:** a shopper can search `"laptop"`, narrow it to *Laptops*, sort by *Price: low to high*, jump to page 2 — then hit **back** four times and watch the page retrace every step exactly, and **forward** to replay it. No lost state, no surprise reloads.

---

## ✨ Key Features

- **🏷️ Dynamic product catalog** — paginated grid (12 per page) driven by the [DummyJSON](https://dummyjson.com) API, with total-aware page counts.
- **🔎 Instant search** — debounced (300 ms) search box that writes `?search=` to the URL and always resets to page 1.
- **🗂️ Category filtering** — accessible listbox (Headless UI) fed by `/category-list`, formatted from slug (`mens-watches` → *Mens Watches*), with an *All categories* escape hatch.
- **↕️ Sorting** — newest, price ↑/↓, top rated, A→Z; the default sort writes nothing to the URL so clean URLs stay clean.
- **📄 Pagination** — active-page highlighting, disabled prev/next arrows at the edges, smooth scroll-to-top on change.
- **🧹 One-click reset** — *Reset filters* clears `search`, `category`, `sort` and `page` at once (the action is disabled while nothing is active).
- **🖼️ Interactive hero banner** — the three top-rated products rendered as floating, hover-scaling cards with a loading overlay.
- **📱 Responsive design** — single column on mobile → `220px` filter rail + grid from `md` up; the filter panel collapses behind a *Filters* toggle on small screens without ever hiding itself on desktop.
- **🌙 Dark mode support** — every component ships paired `dark:` tokens (backgrounds, borders, text, skeletons), so the whole UI is dark-ready.
- **⚡ Performance optimizations**
  - `React.lazy` code-splitting: routes, `FilterSideBar`, `ProductsGrid`, `CategoriesSection` and `Footer` are separate chunks.
  - Image lazy loading: native `loading="lazy"` + `decoding="async"`, pulse skeleton, fade-in on load, reserved aspect-ratio box (CLS-safe).

---

## 🧪 Edge Cases & Test-Backed Features

The suite is **106 tests across 22 files** (`Vitest` + Testing Library + jsdom), with fetch fully stubbed per test — no network, no flake. The sensitive behaviors below are mapped directly to their tests in [`src/test/tests/`](src/test/tests).

### 1. Empty query states & unexpected API response structures

| Behavior | Test |
|----------|------|
| Zero matching products → empty state with guidance copy | `ProductsGrid.test.jsx` → *renders the empty state when nothing matches* · `ProductsPage.test.jsx` → *shows the empty state when no product matches* |
| Clearing the search box **removes** `?search=` instead of writing an empty value | `SearchBar.test.jsx` → *removes the search param when the input is cleared* |
| Picking the default sort deletes `?sort=` rather than storing `sort=default` | `SortFilter.test.jsx` → *removes the sort param when the default option is picked* |
| Reset with no active filters is disabled; with filters it wipes every param | `FilterSideBar.test.jsx` → *disables the reset action while no filter is active* / *clears every URL param when reset is clicked* |
| Response with **no `total`** → tiles fall back to `0 items`, no crash | `useHomeProducts.test.jsx` → *falls back to 0 items when the response has no total* |
| Single page (`total ≤ 12`) → pagination hidden entirely | `ProductsPage.test.jsx` → *hides pagination while there is a single page* |
| Failed category list → "All categories" fallback, URL untouched | `CategoryFilter.test.jsx` → *surfaces a failed category list without touching the URL* |
| A response with `total: 4` on a category URL still renders (shape-tolerant reads) | `App.test.jsx` → `stubFetch` router handles arbitrary shapes per endpoint |

### 2. Browser back/forward history synchronization (no state corruption)

Dedicated file: **[`BackForwardNavigation.test.jsx`](src/test/tests/BackForwardNavigation.test.jsx)** — a *direct* history test: it builds three real entries through the UI (search → category → page), then steps through the stack and asserts **every visible control** is restored together, not just the query string.

| Behavior | Test |
|----------|------|
| Back from `page=2` → page 1 highlighted, search box **and** category label intact | *restores the full filter state when stepping back through history* |
| Back twice → category cleared while the search term survives | same |
| Back to the start → search box empty, **no leaked `search=`/`sort=` left behind** | same |
| Forward re-applies search → category → page one entry at a time, each check asserting the *other* filters survived | *re-applies the full filter state when stepping forward through history* |
| Components stay in sync when the URL changes externally (popstate-style) | `SearchBar.test.jsx` → *stays in sync when the URL changes externally (browser back)* |
| Input seeds from `?search`, sidebar reflects `?category` on a cold mount | `ProductsPage.test.jsx` → *seeds the search input from the URL* / *reflects the category from the URL in the sidebar* |
| Every write (search/category/sort/page) resets pagination to `page=1` | `SearchBar`, `CategoryFilter`, `SortFilter` *…resets pagination to page 1* tests |

### 3. Fallback rendering & graceful recovery (network latency / image failures)

| Behavior | Test |
|----------|------|
| Hanging (never-resolving) request → grid skeleton, never a blank page | `ProductsPage.test.jsx` → *shows the grid skeleton while loading* · `LandingPage.test.jsx` → *shows the hero loading overlay while the products request is pending* |
| HTTP 500 → error state showing the thrown message, not a crash | `ProductsGrid.test.jsx` → *renders the error state with the thrown message* · `useProducts.test.jsx` → *surfaces API failures as an error state* |
| **Image fails to load** → skeleton removed and the image revealed, layout stays stable | `LazyImage.test.jsx` → *stops showing the skeleton if the image fails to load* |
| Cached image → no skeleton flash | `LazyImage.test.jsx` → *marks already-cached images as loaded right away* |
| Page-level fallback for route transitions | `PageSkeleton.test.jsx` → *is announced as a loading status* / *renders pulsing placeholders instead of real content* |
| Suspense fallbacks for lazy sidebar / categories / footer | `LandingPage.test.jsx` + `ProductsPage.test.jsx` lazy-chunk assertions |
| One failing category request rejects the whole batch with a named error | `useHomeProducts.test.jsx` → *rejects the whole list if one category request fails* |
| Refetch in flight → grid dims, previous data kept (`keepPreviousData`) | `ProductsGrid.test.jsx` → *dims the grid while refetching* · `useProducts.test.jsx` → *keeps the previous page data while refetching* |

### 4. Race conditions — rapid typing, debounce & simultaneous queries

| Behavior | Test |
|----------|------|
| Keystroke updates the input **immediately** but does *not* touch the URL before 300 ms | `SearchBar.test.jsx` → *updates the input immediately but does not touch the URL before the debounce* |
| Debounce collapses rapid keystrokes into a single URL write | `SearchBar.test.jsx` → *writes the debounced value to the URL and resets pagination to page 1* (2 s timeout) |
| Two independent queries (hero + 4 categories) resolve concurrently without interfering | `LandingPage.test.jsx` → *requests the hero list plus the four landing categories* (asserts all 5 endpoints) |
| Page change while a fetch is pending keeps previous data instead of flashing empty | `useProducts.test.jsx` → *keeps the previous page data while refetching* |
| Query keys isolate `search`/`category`/`sort`/`page` so out-of-order responses can't cross-apply | `useProducts.test.jsx` → the five endpoint-construction tests |
| History step landing mid-debounce doesn't corrupt later entries | `BackForwardNavigation.test.jsx` (search entry built via debounce, then popped) |

> Every test runs with retries disabled and a fresh `QueryClient` (`gcTime`/`staleTime` = 0), so ordering bugs and cache leaks surface immediately instead of being masked.

---

## 🛠️ Tech Stack

- **[React 19](https://react.dev/)** — UI library (`Suspense`, `lazy`, hooks)
- **[Vite 8](https://vite.dev/)** — dev server, bundler & build tool (this project uses **Vite**, not Create React App)
- **[TanStack Query (React Query) v5](https://tanstack.com/query)** — server state, caching, `keepPreviousData`, request deduplication
- **[React Router v8](https://reactrouter.com/)** — routing + URL/query-param state (`createBrowserRouter`, `useSearchParams`)
- **[Tailwind CSS v4](https://tailwindcss.com/)** — utility-first styling, `dark:` variants, arbitrary values
- **[@headlessui/react](https://headlessui.com/)** — accessible unstyled listboxes (category & sort)
- **[Lucide React](https://lucide.dev/)** — icon set
- **[DummyJSON API](https://dummyjson.com)** — mock product/catalog backend
- **[Vitest](https://vitest.dev/) + [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) + jsdom** — unit/integration tests
- **ESLint** — linting (`npm run lint`)

---

## ⚡ Performance & Architecture

**State management — "the URL is the store."**
There is no global state library. Filter state lives in the query string (`?search=&category=&sort=&page=`) and is read/written through React Router's `useSearchParams`. Each control builds a fresh `URLSearchParams`, updates its own key, forces `page=1`, and pushes. This makes state **shareable, reload-safe and history-aware for free**, while React Query owns the *server* side (cache keyed by `["products", { search, category, sort, page, limit }]`, `staleTime` 5 min, `keepPreviousData` so paging never flashes an empty grid).

**Browser back/forward navigation.**
Because filter changes are pushed (not replaced), the browser's history stack holds one entry per user decision. On a pop, components re-render from `useSearchParams`; `SearchBar` additionally syncs its local input state whenever `searchParam` changes, so the box reflects history even though it is a controlled input with its own debounce timer. This exact behavior is verified end-to-end by [`BackForwardNavigation.test.jsx`](src/test/tests/BackForwardNavigation.test.jsx), which walks the stack in both directions and asserts the *whole* UI — not just the URL — is restored without corruption.

**Lazy loading — images.**
`LazyImage` renders `<img loading="lazy" decoding="async">` inside a wrapper that reserves the aspect-ratio box (no CLS), shows an `animate-pulse` skeleton while loading, fades the image in on `load`, and drops the skeleton on `error` so a broken URL degrades gracefully instead of leaving a permanent shimmer. Already-cached images skip the skeleton entirely.

**Lazy loading — components.**
Routes (`LandingPage`, `ProductsPage`) and below-the-fold UI (`FilterSideBar`, `ProductsGrid`, `CategoriesSection`, `Footer`) are `React.lazy` chunks behind `<Suspense>` with skeleton fallbacks that mirror the final layout. The first paint therefore only depends on the shell + header + search, and data arrives into a stable skeleton rather than a reflow.

**Rendering discipline.**
Skeletons instead of spinners, pagination hidden until it's actually needed, grid opacity dimmed (not blanked) during refetch, and `window.scrollTo` on page change for a predictable reading position.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 (20+ recommended)
- **npm** (or yarn / pnpm)

### Installation

```bash
git clone <repository-url>
cd <project-folder>
npm install
```

### Running the app

```bash
npm run dev        # start the dev server (Vite, default http://localhost:5173)
```

Other scripts:

```bash
npm run build      # production build into dist/
npm run preview    # serve the production build locally
npm run lint       # ESLint over the whole project
```

### 🧪 Running the tests

```bash
npm test           # run the edge-case test suites once (vitest run)
npm run test:watch # re-run tests in watch mode while developing
```

`npm test` executes every suite in [`src/test/tests/`](src/test/tests) with a fully stubbed `fetch` — no network access required — and finishes with **22 files / 106 tests passing**.

---

## 📂 Project Structure

```
products-ecommerce/
├── index.html                     # Vite entry HTML
├── vite.config.js                 # plugins + Vitest config (jsdom, setup file)
├── eslint.config.js
│
└── src/
    ├── main.jsx                   # mounts <App />
    ├── App.jsx                    # createBrowserRouter: "/" and "/products"
    ├── index.css                  # Tailwind CSS v4 entry
    │
    ├── features/                  # feature folders (pages + components)
    │   ├── Landing/
    │   │   ├── pages/
    │   │   │   └── LandingPage.jsx
    │   │   └── components/
    │   │       ├── HeroSection.jsx        # interactive hero banner
    │   │       ├── HeroPanner.jsx / HeroCard.jsx / HeroContent.jsx
    │   │       ├── FeatureStrip.jsx
    │   │       ├── CategoriesSection.jsx  # lazy
    │   │       ├── CategoriesSkeleton.jsx
    │   │       └── Footer.jsx             # lazy
    │   │
    │   └── Products/
    │       ├── pages/
    │       │   └── ProductsPage.jsx       # URL params → query, lazy grid/sidebar
    │       └── components/
    │           ├── SearchBar.jsx          # debounced ?search=
    │           ├── FilterSideBar.jsx      # lazy, mobile toggle + reset
    │           ├── CategoryFilter.jsx     # listbox → ?category=
    │           ├── SortFilter.jsx         # listbox → ?sort=
    │           ├── Pagination.jsx         # → ?page=
    │           ├── ProductsGrid.jsx       # lazy
    │           ├── ProductCard.jsx
    │           ├── ProductsHeader.jsx
    │           ├── ProductsEmpty.jsx / ProductsError.jsx
    │           └── *Skeleton.jsx          # grid & sidebar placeholders
    │
    ├── hooks/
    │   ├── useProducts.jsx        # useProducts + useCategories (listings)
    │   └── useHomeProducts.jsx    # useHeroProducts + useLandingCategories
    │
    ├── shared/
    │   ├── Layout.jsx             # app shell (header + outlet)
    │   └── components/
    │       ├── Header.jsx         # sticky nav, active-route styling
    │       ├── LazyImage.jsx      # lazy + skeleton + fade + error recovery
    │       └── PageSkeleton.jsx   # route-transition fallback
    │
    └── test/                      # test infrastructure
        ├── setup.js               # jest-dom, cleanup, scrollTo/matchMedia stubs
        ├── utils.jsx              # renderWithProviders / createWrapper
        ├── fetchMock.js           # stubFetch + jsonResponse / errorResponse
        ├── fixtures.js            # products, categories, hero fixtures
        ├── UrlProbe.jsx           # exposes URL params for assertions
        │
        └── tests/                 # ← all *.test.jsx suites (flat)
            ├── App.test.jsx                       # routing & shared header
            ├── BackForwardNavigation.test.jsx     # direct back/forward test
            ├── ProductsPage.test.jsx
            ├── SearchBar / CategoryFilter / SortFilter / FilterSideBar
            ├── Pagination / ProductsGrid / ProductCard / ProductsHeader
            ├── LandingPage / HeroSection / HeroContent / HeroCard
            ├── CategoriesSection / FeatureStrip / Footer
            ├── PageSkeleton / LazyImage
            └── useProducts / useHomeProducts      # hook-level suites
```

---

## 🗺️ Future Roadmap

- [ ] **Shopping cart & checkout** — add-to-cart from `ProductCard`, cart drawer, multi-step checkout flow
- [ ] **User authentication** — sign in / sign up, persisted sessions, protected routes
- [ ] **Payment gateway** — Stripe integration with order confirmation & receipts
- [ ] **Wishlist & recently viewed** — persisted per-user (localStorage today, backend later)
- [ ] **Product detail route** — `/products/:id` with galleries and reviews
- [ ] **Theme toggle** — user-controlled light/dark switch (tokens are already in place)
- [ ] **Filters drawer** — price-range, rating and in-stock filters folded into the same URL contract
- [ ] **Server-side rendering / SEO** — canonical URLs and Open Graph tags per filter combination

---

## 📄 License

This project is released under the [MIT License](https://opensource.org/licenses/MIT).

---

<div align="built-with-react-query-router-tailwind">

**Harbor** — *every filter in the URL, every step in history.*

</div>
