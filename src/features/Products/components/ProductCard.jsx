import LazyImage from "../../../shared/components/LazyImage";

export default function ProductCard({product}) {
  return (
    <div
      key={product.id}
      className="border border-[#E4E1D6] dark:border-[#28332D] rounded-lg overflow-hidden bg-white dark:bg-[#1A2320] flex flex-col"
    >
      <div className="aspect-[1/0.85] bg-linear-to-br from-[#e9e5d8] to-[#d8d2bf] dark:from-[#28332D] dark:to-[#121815] flex items-center justify-center text-4xl">
        <LazyImage
          src={product.images[0]}
          alt={product.title}
          wrapperClassName="w-full h-full flex items-center justify-center"
        />
      </div>
      <div className="p-4 flex flex-col flex-1 gap-1.5">
        <span className="text-[11px] font-bold text-[#2F6F5E] dark:text-[#4C8D7A] uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="text-sm font-bold text-[#16221D] dark:text-[#EFEDE4] font-sans">
          {product.title}
        </h3>
        <div className="flex justify-between items-center mt-auto pt-2">
          <span className="font-serif font-extrabold text-base text-[#16221D] dark:text-[#EFEDE4]">
            ${product.price}
          </span>
          <span className="text-xs text-[#4B5A52] dark:text-[#A9B3AC]">
            ★ {product.rating}
          </span>
        </div>
      </div>
    </div>
  );
}
