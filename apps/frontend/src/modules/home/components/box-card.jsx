export function BoxCard({ bgColor, letter, borderColor, fontSize }) {
  return (
    <div
      className="flex-[1] size rounded-[10px] flex-center"
      style={{ backgroundColor: bgColor, border: `2px solid ${borderColor}` }}
    >
      <p className="font-[1000]" style={{ WebkitTextStroke: `2px ${borderColor}`, fontSize: `${fontSize}px` }}>
        {letter}
      </p>
    </div>
  );
}
