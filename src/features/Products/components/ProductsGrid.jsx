import ProductCard from "./ProductCard";
import ProductGridSkeleton from "./ProductGridSkeleton";
import ProductsError from "./ProductsError";
import ProductsEmpty from "./ProductsEmpty";

export default function ProductsGrid({
  products = [],
  isLoading = false,
  isError = false,
  error,
  isFetching = false,
  limit = 12,
}) {
  if (isLoading) {
    return <ProductGridSkeleton count={limit} />;
  }

  if (isError) {
    return <ProductsError error={error} />;
  }

  if (products.length === 0) {
    return <ProductsEmpty />;
  }

  /* Product Grid */
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-200 ${
        isFetching ? "opacity-60" : "opacity-100"
      }`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
