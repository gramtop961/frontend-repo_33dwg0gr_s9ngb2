export default function Legend() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-green-100 text-green-600 font-semibold">✓</span>
          <span className="text-slate-600">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-red-100 text-red-600 font-semibold">✗</span>
          <span className="text-slate-600">Incomplete</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-slate-500">Tip: Use this matrix in presentations or status meetings.</span>
        </div>
      </div>
    </div>
  );
}
