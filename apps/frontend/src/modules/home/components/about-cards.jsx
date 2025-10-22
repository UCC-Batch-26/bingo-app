export function AboutCards({ title, description, className = '' }) {
  return (
    <div className={`flex-1 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer p-6 ${className}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
        <h4 className="text-sm font-semibold text-slate-900 leading-tight">{title}</h4>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
