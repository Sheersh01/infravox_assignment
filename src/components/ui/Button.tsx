import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  // Miro style: smooth, rounded, clean
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none rounded-xl';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm active:scale-95',
    secondary: 'bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200 shadow-sm active:scale-95',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 active:scale-95',
    ghost: 'hover:bg-zinc-100 text-zinc-600 active:scale-95',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-lg',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-8 text-base rounded-2xl',
    icon: 'h-9 w-9',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
