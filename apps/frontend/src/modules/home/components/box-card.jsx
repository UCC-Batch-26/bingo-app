export function BoxCard({ bgColor, letter, borderColor, fontSize, className = '' }) {
  // Determine text color based on background brightness
  // Light colors: light variants and very light backgrounds
  const lightColors = ['#FFB3A7', '#FF9F95', '#A5D9F5', '#BAE6FD', '#FEFBF3'];
  const isLightColor = lightColors.includes(bgColor) || 
                       bgColor === '#FFB3A7' || 
                       bgColor === '#A5D9F5' || 
                       bgColor === '#BAE6FD';
  // Medium-dark colors (purple, coral, blue) need white text
  const darkColors = ['#7C3AED', '#6D28D9', '#FF6B5E', '#FF9F95', '#60B5E8'];
  const isDarkColor = darkColors.includes(bgColor);
  
  const textColor = isLightColor ? '#000' : '#FFF';
  
  return (
    <div
      className={`flex-1 w-full h-full rounded-lg flex justify-center items-center transition-all duration-300 transform-gpu hover:-translate-y-2 hover:scale-105 hover:rotate-3 card-3d ${className}`}
      style={{ 
        backgroundColor: bgColor, 
        border: `1px solid ${borderColor}`,
        transformStyle: 'preserve-3d'
      }}
    >
      <p 
        className="font-black select-none" 
        style={{ 
          fontSize: `${fontSize}px`,
          color: textColor
        }}
      >
        {letter}
      </p>
    </div>
  );
}
