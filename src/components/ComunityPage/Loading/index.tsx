export const Loading = () => {
  return Array.from({ length: 3 }).map((_, index) => (
    <div
      key={index}
      className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden animate-pulse"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-zinc-300 rounded-full"></div>
          <div>
            <div className="h-5 bg-zinc-300 rounded w-32 mb-2"></div>
            <div className="h-4 bg-zinc-300 rounded w-24"></div>
          </div>
        </div>
        <div className="h-5 bg-zinc-300 rounded w-48 mb-4"></div>
        <div className="h-4 bg-zinc-300 rounded w-32"></div>
      </div>
      <div className="p-4 bg-zinc-50 border-t border-zinc-100">
        <div className="h-10 bg-zinc-300 rounded"></div>
      </div>
    </div>
  ));
};
