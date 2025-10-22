export function Button({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500/50 shadow-sm',
    secondary: 'bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-500/50 shadow-sm',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-indigo-500/50',
    ghost: 'text-slate-700 hover:bg-slate-50 focus:ring-indigo-500/50'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
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
