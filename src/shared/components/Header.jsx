import { NavLink } from "react-router";

export default function Header() {
  return (
    
      <nav className="sticky top-0 z-20 bg-[#FAF9F4] dark:bg-[#121815] border-b border-[#E4E1D6] dark:border-[#28332D]">
        <div className="max-w-275 mx-auto px-5 h-16 flex items-center justify-between">
          <div className="font-serif font-extrabold text-xl text-[#1D4A3D] dark:text-[#4C8D7A]">
            Harbor<span className="text-[#B8862E]">.</span>
          </div>
          <div className="flex gap-7 font-medium text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `py-2 px-0.5 border-b-2 transition-colors ${
                  isActive
                    ? 'border-[#B8862E] text-[#16221D] dark:text-[#EFEDE4] font-bold'
                    : 'border-transparent text-[#4B5A52] dark:text-[#A9B3AC] hover:text-[#EFEDE4]'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `py-2 px-0.5 border-b-2 transition-colors ${
                  isActive
                    ? 'border-[#B8862E] text-[#16221D] dark:text-[#EFEDE4] font-bold'
                    : 'border-transparent text-[#4B5A52] dark:text-[#A9B3AC] hover:text-[#EFEDE4]'
                }`
              }
            >
              Products
            </NavLink>
          </div>
        </div>
      </nav>
      
  );
}
