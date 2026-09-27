import { Suspense, lazy } from "react";
import ProductsHeader from "../components/ProductsHeader";
import SearchBar from "../components/SearchBar";
import FilterSideBarSkeleton from "../components/FilterSideBarSkeleton";
import ProductGridSkeleton from "../components/ProductGridSkeleton";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router";
import { useProducts } from "../../../hooks/useProducts";

// Heavy below-the-fold components are code-split (own chunks)
const FilterSideBar = lazy(() => import("../components/FilterSideBar"));
const ProductsGrid = lazy(() => import("../components/ProductsGrid"));


export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract URL state
  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || null;
  const sortParam = searchParams.get("sort") || "default";
  const pageParam = Number(searchParams.get("page")) || 1;
  const limit = 12;

  const { data, isLoading, isError, error, isFetching } = useProducts({
    search: searchParam,
    category: categoryParam,
    sort: sortParam,
    page: pageParam,
    limit,
  });

  const products = data?.products || []
  const total = data?.total || 0
  const totalPages = Math.max(1, Math.ceil(total / limit));
  console.log(products)

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString())
    setSearchParams(newParams);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  return (
    <main className="max-w-275 mx-auto px-5 py-9 pb-16">
      {/* Page Header */}
      <ProductsHeader />

      {/* Search Input */}
      <SearchBar />

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-start">
        {/* Filters Sidebar */}
        <Suspense fallback={<FilterSideBarSkeleton />}>
          <FilterSideBar />
        </Suspense>

        {/* Product Grid & Pagination */}
        <Suspense fallback={<ProductGridSkeleton count={limit} />}>
          <ProductsGrid
            products={products}
            isLoading={isLoading}
            isError={isError}
            error={error}
            isFetching={isFetching}
            limit={limit}
          />
        </Suspense>
      </div>

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={pageParam}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}
