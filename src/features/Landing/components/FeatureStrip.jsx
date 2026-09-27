export default function FeatureStrip() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-[#E4E1D6] dark:border-[#28332D]">
      <div className="py-6 px-5 text-center sm:border-r border-[#E4E1D6] dark:border-[#28332D]">
        <strong className="block text-lg font-bold text-[#16221D] dark:text-[#EFEDE4]">
          48-hour delivery
        </strong>
        <span className="text-[#4B5A52] dark:text-[#A9B3AC] text-sm">
          major cities
        </span>
      </div>
      <div className="py-6 px-5 text-center sm:border-r border-[#E4E1D6] dark:border-[#28332D]">
        <strong className="block text-lg font-bold text-[#16221D] dark:text-[#EFEDE4]">
          14-day returns
        </strong>
        <span className="text-[#4B5A52] dark:text-[#A9B3AC] text-sm">
          no questions asked
        </span>
      </div>
      <div className="py-6 px-5 text-center">
        <strong className="block text-lg font-bold text-[#16221D] dark:text-[#EFEDE4]">
          Secure checkout
        </strong>
        <span className="text-[#4B5A52] dark:text-[#A9B3AC] text-sm">
          end-to-end encrypted
        </span>
      </div>
    </div>
  );
}
