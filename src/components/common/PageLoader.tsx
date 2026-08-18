export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8 space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-800 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-300">Loading module...</p>
        <p className="text-xs text-slate-500 mt-1">PulseBoard route assembly in progress</p>
      </div>
    </div>
  );
}

export default PageLoader;
