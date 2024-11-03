import React, { useEffect, useRef, useCallback } from 'react';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { SHAPE_CONSTANTS } from '../constants/shapes';
import { SHAPE_COLORS } from '../features/shapes/model';

interface UseStarEffectProps {
  isActive: boolean;
  objects: CSS3DObject[];
  onUpdate: () => void;
}

const calculateStarOfDavidPosition = (index: number, total: number) => {
  const object = new THREE.Object3D();
  const radius = SHAPE_CONSTANTS.STAR.RADIUS.OUTER;
  
  // Определяем, к какому треугольнику относится точка
  const isFirstTriangle = index < total / 2;
  const pointsPerTriangle = Math.floor(total / 2);
  const localIndex = isFirstTriangle ? index : index - pointsPerTriangle;
  
  // Вычисляем угол для точки в треугольнике (120° между точками)
  const angleStep = (2 * Math.PI) / 3;
  const triangleIndex = Math.floor(localIndex / (pointsPerTriangle / 3));
  const angle = triangleIndex * angleStep + (isFirstTriangle ? 0 : Math.PI / 3); // Поворот второго треугольника на 60°
  
  // Вычисляем позицию
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  // Разная высота для треугольников
  const z = isFirstTriangle ? 50 : -50;
  
  // Добавляем небольшое случайное смещение для объема
  const randomOffset = {
    x: (Math.random() - 0.5) * 20,
    y: (Math.random() - 0.5) * 20,
    z: (Math.random() - 0.5) * 10
  };
  
  object.position.set(
    x + randomOffset.x,
    y + randomOffset.y,
    z + randomOffset.z
  );
  
  // Ориентируем элементы к центру
  const rotationAngle = Math.atan2(y, x);
  object.rotation.set(
    isFirstTriangle ? Math.PI / 6 : -Math.PI / 6, // Наклон к центру
    rotationAngle,
    isFirstTriangle ? 0 : Math.PI // Поворот для второго треугольника
  );
  
  return object;
};

export const useStarEffect = ({ isActive, objects, onUpdate }: UseStarEffectProps) => {
  const tweensRef = useRef<TWEEN.Tween[]>([]);
  const animationFrameRef = useRef<number>();

  const animateStar = useCallback(() => {
    if (!isActive || !objects.length) return;

    tweensRef.current.forEach(tween => tween.stop());
    tweensRef.current = [];

    objects.forEach((object, index) => {
      const element = object.element as HTMLElement;
      if (!element) return;

      // Анимация вращения и свечения
      const tween = new TWEEN.Tween({
        rotation: 0,
        glow: 0,
        brightness: 0
      })
        .to({
          rotation: Math.PI * 2,
          glow: 1,
          brightness: 1
        }, SHAPE_CONSTANTS.STAR.ROTATION_DURATION)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onUpdate(({ rotation, glow, brightness }) => {
          // Вращение элемента
          object.rotation.z = rotation * 0.1;

          // Градиентное свечение
          const blue = Math.floor(200 + brightness * 55);
          const opacity = 0.5 + glow * 0.3;
          const glowSize = SHAPE_CONSTANTS.STAR.COLORS.GLOW.MIN_SIZE + 
            glow * (SHAPE_CONSTANTS.STAR.COLORS.GLOW.MAX_SIZE - SHAPE_CONSTANTS.STAR.COLORS.GLOW.MIN_SIZE);
          
          element.style.background = `
            radial-gradient(circle at 50% 50%, 
              rgba(0,100,${blue},${opacity}) 0%,
              rgba(0,50,${blue - 50},${opacity * 0.8}) 70%,
              rgba(0,0,${blue - 100},${opacity * 0.6}) 100%)
          `;
          
          element.style.boxShadow = `
            0 0 ${glowSize}px rgba(0,100,255,${0.3 + glow * 0.4}),
            inset 0 0 ${glowSize/2}px rgba(0,150,255,${0.2 + glow * 0.3})
          `;
        })
        .repeat(Infinity)
        .start();

      tweensRef.current.push(tween);
    });
  }, [isActive, objects, onUpdate]);

  const animateStarOfDavid = useCallback(() => {
    if (!isActive) return;

    objects.forEach((object, index) => {
      const element = object.element as HTMLElement;
      if (!element) return;

      const isFirstTriangle = index < objects.length / 2;
      
      new TWEEN.Tween({ rotation: 0, intensity: 0 })
        .to({ rotation: Math.PI * 2, intensity: 1 }, 5000)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onUpdate(({ rotation, intensity }) => {
          object.rotation.z += isFirstTriangle ? 0.001 : -0.001;
          
          const opacity = 0.5 + intensity * 0.3;
          const glowSize = 10 + intensity * 15;
          
          element.style.background = `
            radial-gradient(circle at 50% 50%,
              ${SHAPE_COLORS.STAR.background}${opacity}) 0%,
              ${SHAPE_COLORS.STAR.background}${opacity * 0.8}) 70%,
              ${SHAPE_COLORS.STAR.background}${opacity * 0.6}) 100%)
          `;
          
          element.style.boxShadow = `
            0 0 ${glowSize}px ${SHAPE_COLORS.STAR.glow}${opacity}),
            inset 0 0 ${glowSize/2}px ${SHAPE_COLORS.STAR.glow}${opacity * 0.8})
          `;
        })
        .repeat(Infinity)
        .start();
    });
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      animateStar();
      animateStarOfDavid();
      const animate = () => {
        TWEEN.update();
        onUpdate();
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      tweensRef.current.forEach(tween => tween.stop());
      tweensRef.current = [];
    };
  }, [isActive, animateStar, animateStarOfDavid, onUpdate]);

  return {
    animateStar,
    animateStarOfDavid
  };
};