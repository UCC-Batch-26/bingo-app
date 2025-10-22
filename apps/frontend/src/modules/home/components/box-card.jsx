export function BoxCard({ bgColor, letter, borderColor, fontSize, className = '' }) {
  return (
    <div
      className={`flex-1 w-full h-full rounded-xl flex justify-center items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
      style={{ 
        backgroundColor: bgColor, 
        border: `3px solid ${borderColor}`,
        boxShadow: `0 4px 15px ${borderColor}20, inset 0 1px 0 rgba(255,255,255,0.2)`
      }}
    >
      <p 
        className="font-black select-none" 
        style={{ 
          WebkitTextStroke: `3px ${borderColor}`, 
          fontSize: `${fontSize}px`,
          textShadow: `2px 2px 4px rgba(0,0,0,0.3)`,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
        }}
      >
        {letter}
      </p>
    </div>
  );
}
