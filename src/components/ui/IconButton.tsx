import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'danger' | 'ghost' | 'outline';
}

export function IconButton({
  children,
  label,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  };

  const variantClasses = {
    default: 'text-primary hover:bg-primary/10',
    danger: 'text-danger hover:bg-danger/10',
    ghost: 'text-gray-500 hover:bg-gray-100',
    outline: 'text-primary border-2 border-primary/40 hover:bg-primary/5',
  };

  return (
    <button
      aria-label={label}
      {...props}
      className={[
        'inline-flex items-center justify-center rounded-full',
        'transition-all duration-150',
        'active:scale-90',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
}
