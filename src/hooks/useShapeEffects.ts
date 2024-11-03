import { useRef, useEffect, useCallback } from 'react';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import TWEEN from '@tweenjs/tween.js';
import { ViewMode } from '../types';

interface UseShapeEffectsProps {
  currentView: ViewMode;
  objects: CSS3DObject[];
  onUpdate: () => void;
  isCrowned?: boolean;
}

export const useShapeEffects = ({ 
  currentView, 
  objects, 
  onUpdate,
  isCrowned = false 
}: UseShapeEffectsProps) => {
  const animationFrameRef = useRef<number>();

  const animate = useCallback(() => {
    if (!objects.length) return;
    TWEEN.update();
    onUpdate();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [objects, onUpdate]);

  useEffect(() => {
    animate();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      TWEEN.removeAll();
    };
  }, [animate]);

  return { animate };
}; 