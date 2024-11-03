import { useCallback, useEffect, useRef } from 'react';
import { ViewMode } from '../../../types';
import { ShapeState, SHAPE_TRANSITIONS } from '../model';
import TWEEN from '@tweenjs/tween.js';

export const useShapeTransition = (
  currentState: ShapeState,
  onTransitionComplete: (newView: ViewMode) => void
) => {
  const transitionRef = useRef<TWEEN.Tween | null>(null);

  const startTransition = useCallback((from: ViewMode, to: ViewMode) => {
    if (transitionRef.current) {
      transitionRef.current.stop();
    }

    const transition = SHAPE_TRANSITIONS[from][to];
    if (!transition) return;

    // Фаза 1: Подготовка к трансформации
    new TWEEN.Tween({ progress: 0 })
      .to({ progress: 1 }, transition.phases.start)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onComplete(() => {
        // Фаза 2: Морфинг формы
        new TWEEN.Tween({ progress: 0 })
          .to({ progress: 1 }, transition.phases.morph)
          .easing(TWEEN.Easing.Exponential.InOut)
          .onComplete(() => {
            // Фаза 3: Завершение и активация эффектов
            new TWEEN.Tween({ progress: 0 })
              .to({ progress: 1 }, transition.phases.complete)
              .easing(TWEEN.Easing.Sinusoidal.InOut)
              .onComplete(() => {
                onTransitionComplete(to);
              })
              .start();
          })
          .start();
      })
      .start();
  }, [onTransitionComplete]);

  return { startTransition };
}; 