export default function ProductsError({ error }) {
  return (
    <div className="p-12 text-center border border-dashed border-red-300 rounded-lg text-red-500">
      <p className="font-bold">Error loading products</p>
      <p className="text-sm mt-1">{error.message}</p>
    </div>
  );
}
