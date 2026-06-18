"use client";
import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  // Miro style badge: soft, pill-shaped
  const baseStyles = 'inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full';
  
  const variants = {
    default: 'bg-zinc-100 text-zinc-600 border border-zinc-200',
    success: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border border-amber-200',
    danger: 'bg-red-100 text-red-700 border border-red-200',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
