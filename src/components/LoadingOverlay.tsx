import React from 'react';

interface LoadingOverlayProps {
  loading: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
      <div className="text-xl">Loading...</div>
    </div>
  );
};