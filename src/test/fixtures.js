/** Shape used by ProductCard / HeroCard (dummyjson subset). */
export function makeProduct(overrides = {}) {
  return {
    id: 1,
    title: "Essence Mascara Lash Princess",
    price: 9.99,
    rating: 4.5,
    category: "beauty",
    images: ["https://example.com/products/1.png"],
    ...overrides,
  };
}

export const heroProducts = [
  makeProduct({ id: 1, title: "Product One", price: 10, rating: 4.9 }),
  makeProduct({ id: 2, title: "Product Two", price: 20, rating: 4.8 }),
  makeProduct({ id: 3, title: "Product Three", price: 30, rating: 4.7 }),
];

export const productList = [
  makeProduct({ id: 1, title: "Product One" }),
  makeProduct({ id: 2, title: "Product Two", category: "laptops" }),
];

/** dummyjson list response */
export function productsBody(products = productList, total = products.length) {
  return { products, total, skip: 0, limit: products.length };
}

/** dummyjson category-list response */
export const categoryList = [
  "beauty",
  "fragrances",
  "furniture",
  "smartphones",
  "mens-watches",
  "laptops",
];

/** Landing page fixtures: hero query + the 4 per-category queries */
export const landingCategories = [
  { slug: "beauty", title: "Beauty", count: "10 items", dotBg: "bg-[#C9A227]" },
  { slug: "fragrances", title: "Fragrances", count: "5 items", dotBg: "bg-[#2F6F5E]" },
  { slug: "furniture", title: "Furniture", count: "7 items", dotBg: "bg-[#A23B2E]" },
  { slug: "smartphones", title: "Smartphones", count: "9 items", dotBg: "bg-[#5B7DB1]" },
];
