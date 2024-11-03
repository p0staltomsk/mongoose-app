import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label: React.FC<LabelProps> = ({ className = '', ...props }) => {
  return (
    <label
      className={`${className} block text-sm font-medium text-gray-700`}
      {...props}
    />
  );
}; 