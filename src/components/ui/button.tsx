import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'default',
  size = 'default',
  className = '',
  ...props 
}) => {
  return (
    <button
      className={`${className} ${
        variant === 'outline' 
          ? 'border border-gray-300 hover:bg-gray-100'
          : variant === 'ghost'
          ? 'hover:bg-gray-100'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } ${
        size === 'icon'
          ? 'w-8 h-8 p-1'
          : 'px-4 py-2'
      } rounded-md transition-colors`}
      {...props}
    >
      {children}
    </button>
  );
}; 