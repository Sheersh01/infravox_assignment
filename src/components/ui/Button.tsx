import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  // Industrial design: square corners, stark contrast, strong borders
  const baseStyles = 'inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 disabled:opacity-50 disabled:pointer-events-none ring-offset-zinc-950';
  
  const variants = {
    primary: 'bg-lime-400 text-black hover:bg-lime-500 border-2 border-lime-400 active:translate-y-px',
    secondary: 'bg-zinc-900 text-zinc-300 hover:text-lime-400 hover:border-lime-400 border-2 border-zinc-700 active:translate-y-px',
    danger: 'bg-transparent text-red-500 hover:bg-red-500 hover:text-black border-2 border-red-500 active:translate-y-px',
    ghost: 'hover:bg-zinc-800 hover:text-lime-400 text-zinc-400',
  };

  const sizes = {
    sm: 'h-8 px-3 text-[10px]',
    md: 'h-10 py-2 px-4 text-xs',
    lg: 'h-12 px-8 text-sm',
    icon: 'h-9 w-9 border-none', // Special case for icon buttons to not have thick borders
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
