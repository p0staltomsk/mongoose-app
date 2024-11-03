import { useEffect, useCallback } from 'react';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { StarEffectProps } from '../features/shapes/model';

interface AnimationParams {
  scale: number;
  intensity: number;
  rotation: number;
}

export const useStarEffect = ({ isActive, objects, onUpdate }: StarEffectProps) => {
  const createStarOfDavid = useCallback((index: number, total: number) => {
    const starSize = 800;
    const innerRadius = starSize * 0.4;
    const outerRadius = starSize;
    
    // Создаем точки для двух треугольников звезды Давида
    const points: THREE.Vector3[] = [];
    
    // Первый треугольник (верхний)
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + Math.PI / 6; // Поворачиваем на 30 градусов
      // Внешняя точка
      points.push(new THREE.Vector3(
        Math.cos(angle) * outerRadius,
        Math.sin(angle) * outerRadius,
        0
      ));
      // Внутренняя точка
      const innerAngle = angle + Math.PI / 3;
      points.push(new THREE.Vector3(
        Math.cos(innerAngle) * innerRadius,
        Math.sin(innerAngle) * innerRadius,
        0
      ));
    }

    // Второй треугольник (нижний)
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 - Math.PI / 6; // Поворачиваем на -30 градусов
      // Внешняя точка
      points.push(new THREE.Vector3(
        Math.cos(angle) * outerRadius,
        Math.sin(angle) * outerRadius,
        0
      ));
      // Внутренняя точка
      const innerAngle = angle + Math.PI / 3;
      points.push(new THREE.Vector3(
        Math.cos(innerAngle) * innerRadius,
        Math.sin(innerAngle) * innerRadius,
        0
      ));
    }
    
    // Распределяем элементы по точкам звезды
    const basePointIndex = index % points.length;
    const nextPointIndex = (basePointIndex + 1) % points.length;
    
    const basePoint = points[basePointIndex];
    const nextPoint = points[nextPointIndex];

    // Создаем плавное движение между точками
    const time = Date.now() * 0.0002; // Супер медленное движение
    const floatFactor = (Math.sin(time + index * 0.5) + 1) * 0.5;
    
    const floatingPoint = new THREE.Vector3(
      basePoint.x + (nextPoint.x - basePoint.x) * floatFactor,
      basePoint.y + (nextPoint.y - basePoint.y) * floatFactor,
      basePoint.z + (nextPoint.z - basePoint.z) * floatFactor
    );

    // Добавляем медленное колебание по Z для объема
    const wobbleAmount = 40;
    const wobble = Math.sin(time * 1.5 + index * 0.2) * wobbleAmount;
    floatingPoint.z += wobble;

    return floatingPoint;
  }, []);

  const shuffleElements = useCallback(() => {
    if (!isActive) return;

    // Создаем новые случайные позиции для всех точек
    const shuffledIndices = Array.from({ length: objects.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);

    objects.forEach((object, i) => {
      const element = object.element as HTMLElement;
      if (!element) return;

      // Берем случайную позицию из перемешанного массива
      const newPosition = createStarOfDavid(shuffledIndices[i], objects.length);

      // Добавляем случайную задержку для каждого элемента
      setTimeout(() => {
        new TWEEN.Tween(object.position)
          .to({
            x: newPosition.x,
            y: newPosition.y,
            z: newPosition.z
          }, 3000) // Плавное перемещение
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();

        // Добавляем эффект вращения при перемешивании
        new TWEEN.Tween(object.rotation)
          .to({
            z: Math.PI * 2 * (Math.random() > 0.5 ? 1 : -1)
          }, 3000)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();

        // Добавляем пульсацию при перемешивании
        const initialScale = object.scale.x;
        new TWEEN.Tween(object.scale)
          .to({ x: initialScale * 1.3, y: initialScale * 1.3, z: initialScale * 1.3 }, 1500)
          .easing(TWEEN.Easing.Quadratic.Out)
          .yoyo(true)
          .repeat(1)
          .start();

        // Усиливаем свечение при перемешивании
        const intensity = Math.random() * 0.5 + 0.5;
        const isTopTriangle = i % 2 === 0;
        if (isTopTriangle) {
          element.style.backgroundColor = `rgba(255,255,255,${0.8 + intensity * 0.2})`;
          element.style.boxShadow = `0 0 50px rgba(135,206,235,${intensity})`;
        } else {
          element.style.backgroundColor = `rgba(0,56,184,${0.8 + intensity * 0.2})`;
          element.style.boxShadow = `0 0 50px rgba(255,255,255,${intensity})`;
        }
      }, Math.random() * 500); // Случайная задержка до 500мс
    });
  }, [isActive, objects, createStarOfDavid]);

  const animateStarOfDavid = useCallback(() => {
    if (!isActive) return;

    objects.forEach((object, index) => {
      const element = object.element as HTMLElement;
      if (!element) return;

      // Медленное движение по звезде
      const updatePosition = () => {
        const newPosition = createStarOfDavid(index, objects.length);
        
        new TWEEN.Tween(object.position)
          .to({
            x: newPosition.x,
            y: newPosition.y,
            z: newPosition.z
          }, 5000) // Еще медленнее!
          .easing(TWEEN.Easing.Sinusoidal.InOut)
          .onComplete(() => {
            setTimeout(() => updatePosition(), Math.random() * 2000 + 2000);
          })
          .start();
      };

      updatePosition();

      // Анимация вращения и свечения
      const params: AnimationParams = {
        scale: 0.9,
        intensity: 0,
        rotation: 0
      };

      new TWEEN.Tween(params)
        .to({
          scale: 1.1,
          intensity: 1,
          rotation: Math.PI / 3
        }, 4000)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onUpdate(({ scale, intensity, rotation }) => {
          object.scale.setScalar(scale);
          object.rotation.z = rotation;
          
          // Цвета флага Израиля - белый и синий
          const isTopTriangle = index % 2 === 0;
          if (isTopTriangle) {
            // Белый с голубым свечением
            element.style.backgroundColor = `rgba(255,255,255,${0.7 + intensity * 0.3})`;
            element.style.boxShadow = `0 0 30px rgba(135,206,235,${0.5 + intensity * 0.5})`;
          } else {
            // Синий с белым свечением
            element.style.backgroundColor = `rgba(0,56,184,${0.7 + intensity * 0.3})`;
            element.style.boxShadow = `0 0 30px rgba(255,255,255,${0.5 + intensity * 0.5})`;
          }
        })
        .repeat(Infinity)
        .yoyo(true)
        .start();
    });
  }, [isActive, objects, createStarOfDavid]);

  useEffect(() => {
    if (isActive) {
      animateStarOfDavid();
    }
    return () => {
      TWEEN.removeAll();
    };
  }, [isActive, animateStarOfDavid]);

  return {
    animateStarOfDavid,
    shuffleElements
  };
};