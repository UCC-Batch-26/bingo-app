export function HowToPlayCards({ type, description, className = '' }) {
  return (
    <div className={`w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-lg hover:-translate-y-1 transition-all duration-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
        <h3 className="text-lg font-semibold text-slate-900">As a {type}:</h3>
      </div>
      <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
