import { Star } from "lucide-react";
import LazyImage from "../../../shared/components/LazyImage";

export default function HeroCard({
  className,
  product
}) {
  return (
    <div
      className={`absolute w-28 sm:w-33 bg-[#FCFBF7] dark:bg-[#1A2320] text-[#16221D] dark:text-[#EFEDE4] rounded-xl p-3.5 shadow-[0_14px_32px_rgba(10,25,20,0.28)] transition-transform hover:scale-105 ${className}`}
    >
      <LazyImage
        src={product.images[0]}
        alt={product.title}
        wrapperClassName="text-2xl block mb-2"
      />
      <p className="font-bold text-xs sm:text-sm truncate mb-1.5">{product.title}</p>
      <div className="flex justify-between items-center text-[11.5px]">
        <span className="font-extrabold font-serif text-xs sm:text-sm">
          ${product.price}
        </span>
        <span className="text-[#4B5A52] dark:text-[#A9B3AC] flex items-center gap-0.5">
          <Star className="w-3 h-3 fill-amber-400 stroke-amber-400 inline" />{" "}
          {product.rating}
        </span>
      </div>
    </div>
  );
}
