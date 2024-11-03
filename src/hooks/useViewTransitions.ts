import { useState, useCallback } from 'react';
import { ViewMode } from '../types';
import TWEEN from '@tweenjs/tween.js';

interface UseViewTransitionsProps {
  onTransitionStart: () => void;
  onTransitionComplete: () => void;
  transform: (targets: THREE.Object3D[], duration: number) => void;
  updateCamera: (view: ViewMode) => void;
  resetColors: () => void;
}

export const useViewTransitions = ({
  onTransitionStart,
  onTransitionComplete,
  transform,
  updateCamera,
  resetColors
}: UseViewTransitionsProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>('table');
  const [previousView, setPreviousView] = useState<ViewMode>('table');

  const handleTransition = useCallback(async (
    view: ViewMode, 
    targets: THREE.Object3D[],
    duration: number = 2000
  ) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    onTransitionStart();
    setPreviousView(currentView);

    // Сначала сбрасываем текущее состояние
    resetColors();
    
    // Обновляем камеру для нового вида
    updateCamera(view);

    // Запускаем анимацию перехода
    return new Promise<void>((resolve) => {
      transform(targets, duration);

      // Ждем завершения анимации
      setTimeout(() => {
        setCurrentView(view);
        setIsTransitioning(false);
        onTransitionComplete();
        resolve();
      }, duration);
    });
  }, [
    isTransitioning,
    currentView,
    onTransitionStart,
    onTransitionComplete,
    transform,
    updateCamera,
    resetColors
  ]);

  return {
    currentView,
    previousView,
    isTransitioning,
    handleTransition,
    setCurrentView
  };
}; 