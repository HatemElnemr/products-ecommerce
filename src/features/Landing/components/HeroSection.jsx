import HeroCard from "./HeroCard";
import HeroContent from "./HeroContent";

export default function HeroSection({ heroProducts = [], isLoading = false }) {
  return (
    <section className="border-b border-[#E4E1D6] dark:border-[#28332D] py-16">
      <div className="max-w-275 mx-auto px-5 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 items-stretch">
        <HeroContent />

        {/* Hero Visual Banner */}
        <div className="relative aspect-[4/3.2] md:aspect-auto min-h-95 rounded-xl overflow-hidden bg-[radial-gradient(circle_at_30%_25%,#E4C874_0%,transparent_42%),radial-gradient(circle_at_75%_70%,#4C8D7A_0%,transparent_45%),linear-gradient(155deg,#1D4A3D,#0F2A22)]">
          <div className="absolute inset-0">
            {isLoading ? (
              /* Loading Skeleton overlay */
              <div className="absolute inset-0 flex items-center justify-center text-white/60 text-xs">
                Loading highlights...
              </div>
            ) : (
              <>
                <HeroCard
                  product={heroProducts[0]}
                  className="top-[12%] left-[6%] -rotate-7 z-1"
                />
                <HeroCard
                  product={heroProducts[1]}
                  className="top-[36%] left-[36%] rotate-4 z-2"
                />
                <HeroCard
                  product={heroProducts[2]}
                  className="bottom-[10%] right-[6%] rotate-9 z-1 shadow-[0_14px_32px_rgba(10,25,20,0.28)]!"
                />
              </>
            )}
          </div>

          <div className="absolute bottom-4 left-4 bg-[#FAF9F4]/94 dark:bg-[#121815]/94 text-[#16221D] dark:text-[#EFEDE4] px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold z-3">
            +194 items added this week
          </div>
        </div>
      </div>
    </section>
  );
}
