import HeroCard from "./HeroCard";
import HeroContent from "./HeroContent";

export default function HeroSection({ heroProducts = [], isLoading = false }) {
  return (
    <section className="border-b border-[#E4E1D6] dark:border-[#28332D] py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* المحتوى النصي */}
        <div className="md:col-span-7 lg:col-span-6">
          <HeroContent />
        </div>

        {/* البانر البصري */}
        <div className="md:col-span-5 lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/10] md:aspect-square lg:aspect-[4/3] w-full max-h-[460px] md:max-h-[520px] rounded-xl sm:rounded-2xl overflow-hidden bg-[radial-gradient(circle_at_30%_25%,#E4C874_0%,transparent_42%),radial-gradient(circle_at_75%_70%,#4C8D7A_0%,transparent_45%),linear-gradient(155deg,#1D4A3D,#0F2A22)] shadow-xl">
          <div className="absolute inset-0">
            {isLoading ? (
              /* Skeleton Loading State */
              <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm font-medium animate-pulse">
                Loading highlights...
              </div>
            ) : (
              <>
                {/* الكارت الأول */}
                <HeroCard
                  product={heroProducts[0]}
                  className="top-[8%] sm:top-[10%] left-[4%] sm:left-[6%] -rotate-6 sm:-rotate-7 z-1 scale-90 sm:scale-100 origin-top-left transition-all duration-300"
                />

                {/* الكارت الثاني */}
                <HeroCard
                  product={heroProducts[1]}
                  className="top-[32%] sm:top-[35%] left-[28%] sm:left-[34%] rotate-3 sm:rotate-4 z-2 scale-90 sm:scale-100 origin-center transition-all duration-300"
                />

                {/* الكارت الثالث */}
                <HeroCard
                  product={heroProducts[2]}
                  className="bottom-[8%] sm:bottom-[10%] right-[4%] sm:right-[6%] rotate-6 sm:rotate-9 z-1 scale-90 sm:scale-100 origin-bottom-right transition-all duration-300 shadow-[0_14px_32px_rgba(10,25,20,0.28)]"
                />
              </>
            )}
          </div>

          {/* البادج السفلي */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-[#FAF9F4]/90 dark:bg-[#121815]/90 backdrop-blur-md text-[#16221D] dark:text-[#EFEDE4] px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold z-3 shadow-md border border-white/10">
            +194 items added this week
          </div>
        </div>

      </div>
    </section>
  );
}
