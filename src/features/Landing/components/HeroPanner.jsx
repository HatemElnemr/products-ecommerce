import { Star } from "lucide-react";
import HeroCard from "./HeroCard";


export default function HeroPanner() {
  return (
   <div className="relative aspect-[4/3.2] md:aspect-auto min-h-95 rounded-xl overflow-hidden bg-[radial-gradient(circle_at_30%_25%,#E4C874_0%,transparent_42%),radial-gradient(circle_at_75%_70%,#4C8D7A_0%,transparent_45%),linear-gradient(155deg,#1D4A3D,#0F2A22)]">
               <div className="absolute inset-0">
                 {/* Card 1 */}
                 <HeroCard className="top-[12%] left-[6%] -rotate-7 z-1"/>
   
                 {/* Card 2 */}
                 <div className="absolute w-28 sm:w-33 bg-[#FCFBF7] dark:bg-[#1A2320] text-[#16221D] dark:text-[#EFEDE4] rounded-xl p-3.5 shadow-[0_18px_38px_rgba(10,25,20,0.34)] top-[36%] left-[36%] rotate-4 z-2">
                   <span className="text-2xl block mb-2">🧴</span>
                   <p className="font-bold text-xs sm:text-sm truncate mb-1.5">
                     Amber Night
                   </p>
                   <div className="flex justify-between items-center text-[11.5px]">
                     <span className="font-extrabold font-serif text-xs sm:text-sm">
                       $64
                     </span>
                     <span className="text-[#4B5A52] dark:text-[#A9B3AC] flex items-center gap-0.5">
                       <Star className="w-3 h-3 fill-amber-400 stroke-amber-400 inline" />{" "}
                       4.8
                     </span>
                   </div>
                 </div>
   
                 {/* Card 3 */}
                 <div className="absolute w-28 sm:w-33 bg-[#FCFBF7] dark:bg-[#1A2320] text-[#16221D] dark:text-[#EFEDE4] rounded-xl p-3.5 shadow-[0_14px_32px_rgba(10,25,20,0.28)] bottom-[10%] right-[6%] rotate-9 z-1">
                   <span className="text-2xl block mb-2">👜</span>
                   <p className="font-bold text-xs sm:text-sm truncate mb-1.5">
                     Canvas Tote
                   </p>
                   <div className="flex justify-between items-center text-[11.5px]">
                     <span className="font-extrabold font-serif text-xs sm:text-sm">
                       $42
                     </span>
                     <span className="text-[#4B5A52] dark:text-[#A9B3AC] flex items-center gap-0.5">
                       <Star className="w-3 h-3 fill-amber-400 stroke-amber-400 inline" />{" "}
                       4.5
                     </span>
                   </div>
                 </div>
               </div>
   
               <div className="absolute bottom-4 left-4 bg-[#FAF9F4]/94 dark:bg-[#121815]/94 text-[#16221D] dark:text-[#EFEDE4] px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold z-3">
                 +194 items added this week
               </div> 
               </div>
  )
}
