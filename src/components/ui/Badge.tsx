import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  // Industrial badge: sharp edges, mono font, explicit borders
  const baseStyles = 'inline-flex items-center border px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest';
  
  const variants = {
    default: 'border-zinc-700 bg-zinc-900 text-zinc-300',
    success: 'border-lime-400 bg-lime-400/10 text-lime-400',
    warning: 'border-amber-500 bg-amber-500/10 text-amber-500',
    danger: 'border-red-500 bg-red-500/10 text-red-500',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
