export function Button({ children, type = 'button', variant = 'primary', size = 'md', className = '', ...props }) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none btn-playful border border-black';

  const variantClasses = {
    primary: 'bg-purple-gaming text-white hover:bg-purple-gaming-dark focus:ring-purple-gaming/50',
    secondary: 'bg-coral text-white hover:bg-coral-light focus:ring-coral/50',
    outline: 'bg-white border border-black text-black hover:bg-blue-gaming-light focus:ring-purple-gaming/50',
    ghost: 'text-black hover:bg-blue-gaming-light focus:ring-purple-gaming/50',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
