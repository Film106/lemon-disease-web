import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'ghost';
}

export function SecondaryButton({
  children,
  fullWidth = false,
  size = 'md',
  variant = 'outline',
  className = '',
  ...props
}: SecondaryButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[44px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]',
  };

  const variantClasses = {
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white',
    ghost: 'border-0 text-primary bg-transparent hover:bg-primary/10',
  };

  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
        'transition-all duration-150',
        'active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
}
