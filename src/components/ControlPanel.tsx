import React from 'react';

type ViewMode = 'table' | 'sphere' | 'helix' | 'grid' | 'heart';

interface ControlPanelProps {
  currentView: ViewMode;
  isHeartCrowned: boolean;
  onViewChange: (view: ViewMode) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ currentView, isHeartCrowned, onViewChange }) => {
  return (
    <div className="controls fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-row gap-2 bg-black bg-opacity-50 p-2 rounded-full">
      {(['table', 'sphere', 'helix', 'grid'] as ViewMode[]).map((view) => (
        <button 
          key={view}
          onClick={() => onViewChange(view)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:scale-110
            ${currentView === view ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
        >
          {view.toUpperCase()}
        </button>
      ))}
      <button 
        onClick={() => onViewChange('heart')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:scale-110
          ${currentView === 'heart' 
            ? `bg-red-500 shadow-lg ${isHeartCrowned ? 'ring-2 ring-yellow-400' : 'shadow-red-500/50'}` 
            : 'bg-gray-700 hover:bg-gray-600'} 
          text-white relative`}
      >
        {isHeartCrowned ? '👑' : '❤️‍🔥'}
        {currentView === 'heart' && !isHeartCrowned && (
          <span className="absolute -top-1 -right-1 text-xs bg-yellow-400 rounded-full px-1 animate-pulse">
            👑
          </span>
        )}
      </button>
    </div>
  );
};