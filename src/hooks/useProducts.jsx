import { useQuery, keepPreviousData } from "@tanstack/react-query";

const BASE_URL = "https://dummyjson.com/products";

async function fetchProducts({ search, category, sort, page, limit }) {
  const skip = (page - 1) * limit;
  let url = `${BASE_URL}?limit=${limit}&skip=${skip}`;

  if (search) {
    url = `${BASE_URL}/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
  } else if (category) {
    url = `${BASE_URL}/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
  }

  if (sort && sort !== "default") {
    const [sortBy, order] = sort.split("-");
    url += `&sortBy=${sortBy}&order=${order}`;
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

export const useProducts = ({
  search = "",
  category = null,
  sort = "default",
  page = 1,
  limit = 6,
} = {}) => {
  return useQuery({
    queryKey: ["products", { search, category, sort, page, limit }],
    queryFn: () => fetchProducts({ search, category, sort, page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/category-list`);
      if (!res.ok) throw new Error("failed to fetch categories");
      return res.json();
    },
    staleTime: 1000 * 60 * 60, // Cache category list for 1 hour
  });
};
