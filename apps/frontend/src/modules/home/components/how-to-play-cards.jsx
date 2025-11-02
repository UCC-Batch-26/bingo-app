export function HowToPlayCards({ type, description, className = '' }) {
  return (
    <div className={`w-full max-w-md bg-white border border-black rounded-lg p-8 relative ${className}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-4 h-4 bg-purple-gaming border border-black rounded-full"></div>
        <h3 className="text-xl font-bold text-black">As a {type}:</h3>
      </div>
      <p className="text-black leading-relaxed text-base">{description}</p>
    </div>
  );
}
