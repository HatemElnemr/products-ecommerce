import { useQuery } from '@tanstack/react-query';

const BASE_URL = 'https://dummyjson.com/products';

// Helper to assign nice dot colors to dynamic categories
const DOT_COLORS = [
  'bg-[#C9A227]',
  'bg-[#2F6F5E]',
  'bg-[#A23B2E]',
  'bg-[#5B7DB1]',
  'bg-[#8E44AD]',
  'bg-[#D35400]',
];

export function useHeroProducts() {
  return useQuery({
    queryKey: ['landing', 'hero-products'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}?limit=3&sortBy=rating&order=desc`);
      if(!res.ok) throw new Error('Failed to fetch hero products');
      const data = await res.json()
      return data.products;
    },
    staleTime: 1000 * 60 * 15,
  })
}

export function useLandingCategories(
  selectedSlugs = ['beauty', 'fragrances', 'furniture', 'smartphones']
) {
  return useQuery({
    queryKey: ['landing', 'categories-landing', selectedSlugs],
    queryFn: async () => {
      const categoryPromises = selectedSlugs.map(async (slug, index) => {
        const res = await fetch(`${BASE_URL}/category/${slug}?limit=1`);
        if (!res.ok) throw new Error(`Failed to fetch category ${slug}`);
        const data = await res.json();

        // Format slug title (e.g., "mens-watches" -> "Men's Watches")
        const formattedTitle = slug
          .replace('-', ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());

        return {
          slug,
          title: formattedTitle,
          count: `${data.total || 0} items`,
          dotBg: DOT_COLORS[index % DOT_COLORS.length],
        };
      });

      return Promise.all(categoryPromises);
    },
    staleTime: 1000 * 60 * 60,
  });
}