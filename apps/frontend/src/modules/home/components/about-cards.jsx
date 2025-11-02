export function AboutCards({ title, description, className = '' }) {
  return (
    <div className={`flex-1 bg-white border border-black rounded-lg p-6 cursor-pointer relative ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-3 h-3 bg-coral border border-black rounded-full mt-2 flex-shrink-0"></div>
        <h4 className="text-base font-bold text-black leading-tight">{title}</h4>
      </div>
      <p className="text-sm text-black leading-relaxed">{description}</p>
    </div>
  );
}
