import { useState } from "react";

/**
 * Reusable lazy-loaded image.
 *
 * - `loading="lazy"` + `decoding="async"` on the native <img>
 * - `animate-pulse` skeleton while the image is loading
 * - fade-in transition once loaded (prevents the "pop" effect)
 * - the wrapper reserves the image box so the layout never shifts (CLS-safe)
 *
 * @param {string} src            image source
 * @param {string} alt            image alt text
 * @param {string} className      extra classes for the <img> itself
 * @param {string} wrapperClassName  classes for the positioning wrapper
 *                                 (replaces the default `block` display)
 */
export default function LazyImage({
  src,
  alt = "",
  className = "",
  wrapperClassName = "block",
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Cached images can already be complete before React attaches onLoad.
  const handleRef = (img) => {
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    }
  };

  return (
    <span className={`relative ${wrapperClassName}`}>
      {!isLoaded && (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-[#E4E1D6] dark:bg-[#28332D] rounded-md"
        />
      )}

      <img
        ref={handleRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
        className={`transition-opacity duration-500 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </span>
  );
}
