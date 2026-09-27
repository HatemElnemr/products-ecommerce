import { Suspense, lazy } from "react";
import HeroSection from "../components/HeroSection";
import FeatureStrip from "../components/FeatureStrip";
import CategoriesSkeleton from "../components/CategoriesSkeleton";
import { useHeroProducts, useLandingCategories } from "../../../hooks/useHomeProducts";

// Below-the-fold components are code-split
const CategoriesSection = lazy(() => import("../components/CategoriesSection"));
const Footer = lazy(() => import("../components/Footer"));

export default function LandingPage() {
  const { data: heroProducts = [], isLoading: isHeroLoading } =
    useHeroProducts();
  const { data: categories = [], isLoading: isCatLoading } = useLandingCategories([
    "beauty",
    "fragrances",
    "furniture",
    "smartphones",
  ]);

  return (
    <main className="w-full">
      {/* Hero Section */}
      <HeroSection heroProducts={heroProducts} isLoading={isHeroLoading} />

      <div className="max-w-275 mx-auto px-5">
        {/* Feature Strip */}
        <FeatureStrip />

        {/* Categories Section */}
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesSection categories={categories} isLoading={isCatLoading} />
        </Suspense>
      </div>

      {/* Footer */}
      <Suspense
        fallback={
          <footer className="border-t border-[#E4E1D6] dark:border-[#28332D] py-9 text-[#4B5A52] dark:text-[#A9B3AC] text-sm">
            <div className="max-w-275 mx-auto px-5 flex justify-between flex-wrap gap-2">
              <div className="h-4 w-32 rounded bg-[#E4E1D6] dark:bg-[#28332D] animate-pulse" />
              <div className="h-4 w-56 rounded bg-[#E4E1D6] dark:bg-[#28332D] animate-pulse" />
            </div>
          </footer>
        }
      >
        <Footer />
      </Suspense>
    </main>
  );
}
