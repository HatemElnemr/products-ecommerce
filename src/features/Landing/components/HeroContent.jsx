import { Link } from "react-router";


export default function HeroContent() {
  return (
    <div className="flex flex-col justify-center">
                <p className="text-[#2F6F5E] dark:text-[#4C8D7A] font-bold mb-3 text-sm tracking-wide uppercase">
                  Fall 2026 edit
                </p>
                <h1 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-4.5 text-[#16221D] dark:text-[#EFEDE4]">
                  Things worth keeping, not just buying
                </h1>
                <p className="text-[#4B5A52] dark:text-[#A9B3AC] max-w-[46ch] mb-7 text-base sm:text-lg">
                  We shortlist from thousands of listings — electronics, fragrance,
                  furniture — so your feed stays worth scrolling.
                </p>
                <div className="flex flex-wrap gap-3.5">
                  <Link to="/products">
                    <button className="px-6 py-3.5 cursor-pointer bg-[#1D4A3D] hover:bg-[#2F6F5E] text-white font-bold rounded-md text-sm transition-colors">
                      Browse products
                    </button>
                  </Link>
                </div>
              </div>
  )
}
