import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { Points, PointsMaterial } from 'three';
import { SHAPE_COLORS } from '../features/shapes/model';

interface UseHeartEffectProps {
  isActive: boolean;
  isCrowned: boolean;
  objects: CSS3DObject[];
  particlesRef: React.MutableRefObject<Points | undefined>;
  sceneRef: React.MutableRefObject<THREE.Scene>;
}

export const useHeartEffect = ({
  isActive,
  isCrowned,
  objects,
  particlesRef,
  sceneRef
}: UseHeartEffectProps) => {
  const animationFrameRef = useRef<number>();
  const tweensRef = useRef<TWEEN.Tween[]>([]);
  const isAnimatingRef = useRef(false);

  // Очистка всех анимаций
  const clearAnimations = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    tweensRef.current.forEach(tween => tween.stop());
    tweensRef.current = [];
    isAnimatingRef.current = false;
  }, []);

  const pulseHeart = useCallback(() => {
    if (!isActive || isAnimatingRef.current) return;
    
    try {
      isAnimatingRef.current = true;
      clearAnimations();

      const duration = isCrowned ? 600 : 1000;
      
      objects.forEach((object) => {
        const element = object.element as HTMLElement;
        if (!element) return;

        // Анимация масштаба
        const scaleTween = new TWEEN.Tween({ scale: 0.8 })
          .to({ scale: 1.2 }, duration)
          .easing(TWEEN.Easing.Sinusoidal.InOut)
          .onUpdate(({ scale }) => {
            if (object && object.scale) {
              object.scale.setScalar(scale);
            }
          })
          .repeat(Infinity)
          .yoyo(true);

        // Анимация цвета
        const colorTween = new TWEEN.Tween({ intensity: 0 })
          .to({ intensity: 1 }, duration)
          .easing(TWEEN.Easing.Sinusoidal.InOut)
          .onUpdate(({ intensity }) => {
            if (element) {
              const red = Math.floor(255 * (0.7 + intensity * 0.3));
              const opacity = 0.6 + intensity * 0.4;
              const glowSize = isCrowned ? 25 : 15;
              
              element.style.backgroundColor = `rgba(${red},0,0,${opacity})`;
              element.style.boxShadow = `0 0 ${glowSize}px rgba(255,0,0,${opacity})`;
            }
          })
          .repeat(Infinity)
          .yoyo(true);

        scaleTween.start();
        colorTween.start();
        tweensRef.current.push(scaleTween, colorTween);
      });

      // Анимация частиц
      if (particlesRef.current) {
        const material = particlesRef.current.material as PointsMaterial;
        const particleTween = new TWEEN.Tween({ size: 3, opacity: 0.4 })
          .to({ size: 8, opacity: 0.8 }, duration)
          .easing(TWEEN.Easing.Sinusoidal.InOut)
          .onUpdate(({ size, opacity }) => {
            if (material) {
              material.size = size;
              material.opacity = opacity;
            }
          })
          .repeat(Infinity)
          .yoyo(true);

        particleTween.start();
        tweensRef.current.push(particleTween);
      }
    } catch (error) {
      console.error('Error in pulseHeart:', error);
      clearAnimations();
    }
  }, [isActive, isCrowned, objects, particlesRef]);

  const animate = useCallback(() => {
    if (!isActive || !isAnimatingRef.current) return;
    
    try {
      TWEEN.update();
      animationFrameRef.current = requestAnimationFrame(animate);
    } catch (error) {
      console.error('Error in heart animation:', error);
      clearAnimations();
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      pulseHeart();
      animate();
    }

    return clearAnimations;
  }, [isActive, isCrowned, pulseHeart, animate, clearAnimations]);

  return {
    pulseHeart,
    clearAnimations
  };
}; 