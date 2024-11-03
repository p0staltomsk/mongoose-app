import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TWEEN from '@tweenjs/tween.js';
import { formatPeriodicData, type PeriodicElement } from '../data/periodicTable';
import '../styles/PeriodicTable.css';
import { Points, BufferGeometry, Float32BufferAttribute, PointsMaterial } from 'three';
import CustomElementCreator from './CustomElementCreator';
import { ElementCounter } from './ElementCounter';
import { useViewPositions } from '../hooks/useViewPositions';
import { useHeartEffect } from '../hooks/useHeartEffect';
import { useShapeEffects } from '../hooks/useShapeEffects';
import { ViewMode } from '../types';
import { SHAPE_CONSTANTS } from '../constants/shapes';
import { createObject3D, transformObjects } from '../utils/threeHelpers';
import { useStarEffect } from '../hooks/useStarEffect';
import { useShapeTransition } from '../features/shapes/lib/useShapeTransition';
import { ShapeState } from '../features/shapes/model';

const PeriodicTable: React.FC = () => {
  const render = useCallback(() => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000));
  const rendererRef = useRef<CSS3DRenderer>();
  const controlsRef = useRef<OrbitControls>();
  const objectsRef = useRef<CSS3DObject[]>([]);
  const particlesRef = useRef<Points>();
  const targetsRef = useRef<Record<ViewMode, THREE.Object3D[]>>({
    table: [],
    sphere: [],
    helix: [],
    grid: [],
    heart: [],
    star: []
  });

  const [currentView, setCurrentView] = useState<ViewMode>('table');
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [elements, setElements] = useState<PeriodicElement[]>([]);
  const [isHeartCrowned, setIsHeartCrowned] = useState(false);

  const viewPositions = useViewPositions();

  const shapeEffects = useShapeEffects({
    currentView,
    objects: objectsRef.current,
    onUpdate: render,
    isCrowned: isHeartCrowned
  });

  const transform = useCallback((targets: THREE.Object3D[], duration: number) => {
    transformObjects(objectsRef.current, targets, duration, render);
  }, [render]);

  const animateFireParticles = () => {
    requestAnimationFrame(animateFireParticles);
    TWEEN.update();
    if (particlesRef.current && currentView === 'heart') {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        // Добавляем восходящее движение
        positions[i * 3 + 1] += Math.random() * 2;
        // Добавляем случайное колебание
        positions[i * 3] += (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 2] += (Math.random() - 0.5) * 0.5;

        // Если частица поднялась слишком высоко, возвращаем её вниз
        if (positions[i * 3 + 1] > 1000) {
          const t = Math.random() * Math.PI * 2;
          const scale = 40;
          positions[i * 3] = scale * 16 * Math.pow(Math.sin(t), 3);
          positions[i * 3 + 1] = scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) - 50;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  };

  const loadElements = async () => {
    try {
      const response = await fetch('/mongoose-app/api/elements');
      if (!response.ok) throw new Error('Failed to fetch elements');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error loading elements:', error);
      return [];
    }
  };

  const updateControlsForView = (view: ViewMode) => {
    if (!controlsRef.current) return;

    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 0.05;
    controlsRef.current.zoomSpeed = 1.0;

    switch (view) {
      case 'table':
        controlsRef.current.minDistance = 2000;
        controlsRef.current.maxDistance = 6000;
        controlsRef.current.enableRotate = true;
        controlsRef.current.enablePan = true;
        controlsRef.current.panSpeed = 1.2;
        controlsRef.current.autoRotate = false;
        cameraRef.current?.position.set(0, 0, 4000);
        controlsRef.current.maxPolarAngle = Math.PI / 1.5;
        controlsRef.current.minPolarAngle = Math.PI / 3;
        break;

      case 'sphere':
        controlsRef.current.minDistance = 1000;
        controlsRef.current.maxDistance = 4000;
        controlsRef.current.enableRotate = true;
        controlsRef.current.enablePan = true;
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 2.0;
        break;

      case 'helix':
        controlsRef.current.minDistance = 1000;
        controlsRef.current.maxDistance = 4000;
        controlsRef.current.enableRotate = true;
        controlsRef.current.enablePan = true;
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 4.0;
        break;

      case 'grid':
        controlsRef.current.minDistance = 2000;
        controlsRef.current.maxDistance = 8000;
        controlsRef.current.enableRotate = true;
        controlsRef.current.enablePan = true;
        controlsRef.current.panSpeed = 1.2;
        controlsRef.current.autoRotate = false;
        cameraRef.current?.position.set(0, 0, 4000);
        controlsRef.current.maxPolarAngle = Math.PI - 0.2;
        controlsRef.current.minPolarAngle = 0.2;
        break;

      case 'heart':
        controlsRef.current.minDistance = 800;
        controlsRef.current.maxDistance = 2500;
        controlsRef.current.enableRotate = true;
        controlsRef.current.enablePan = true;
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = isHeartCrowned ? 5.0 : 2.0;
        break;

      case 'star':
        controlsRef.current.minDistance = 1500;
        controlsRef.current.maxDistance = 4000;
        controlsRef.current.enableRotate = true;
        controlsRef.current.enablePan = true;
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 1.0;
        break;
    }
  };

  const [shapeState, setShapeState] = useState<ShapeState>({
    currentView: 'table',
    previousView: null,
    isTransitioning: false,
    transitionPhase: 'complete'
  });

  const { startTransition } = useShapeTransition(
    shapeState,
    (newView) => {
      setShapeState(prev => ({
        ...prev,
        currentView: newView,
        previousView: prev.currentView,
        isTransitioning: false,
        transitionPhase: 'complete'
      }));
    }
  );

  const handleViewChange = (view: ViewMode) => {
    // Добавляем функцию очистки эффектов перед сменой вида
    const cleanupEffects = () => {
      TWEEN.removeAll();
      if (particlesRef.current) {
        sceneRef.current.remove(particlesRef.current);
      }
      // Очищаем только если переходим не на сердце
      if (currentView !== 'heart') {
        resetElementColors();
      }
    };

    // Если нажали на текущий вид - перемешиваем элементы
    if (view === currentView) {
      const total = objectsRef.current.length;
      const shuffledIndices = Array.from({ length: total }, (_, i) => i)
        .sort(() => Math.random() - 0.5);
      
      let newPositions: THREE.Object3D[] = shuffledIndices.map((_, i) => {
        switch (view) {
          case 'star':
            return viewPositions.getPositionForView('star', i, total);
          case 'heart':
            return viewPositions.getPositionForView('heart', i, total);
          case 'sphere': {
            const pos = viewPositions.getPositionForView('sphere', i, total);
            const vector = new THREE.Vector3(pos.x, pos.y, pos.z);
            const radius = Math.random() * 200 + 800;
            return vector.normalize().multiplyScalar(radius);
          }
          case 'helix':
            const helixPos = viewPositions.getPositionForView('helix', i, total);
            helixPos.y += (Math.random() - 0.5) * 200;
            return helixPos;
          case 'grid': {
            // Для грида просто случайное мерцание без изменения цвета
            const pos = viewPositions.getPositionForView('grid', i, total);
            if (Math.random() > 0.8) { // 20% элементов будут мерцать
              setTimeout(() => {
                const element = objectsRef.current[i].element as HTMLElement;
                if (element) {
                  new TWEEN.Tween({ opacity: 1 })
                    .to({ opacity: 0.3 }, 1500)
                    .easing(TWEEN.Easing.Sinusoidal.InOut)
                    .yoyo(true)
                    .repeat(1)
                    .onUpdate(({ opacity }) => {
                      element.style.opacity = String(opacity);
                    })
                    .start();
                }
              }, Math.random() * 2000);
            }
            return pos;
          }
          default: {
            // Для таблицы сохраняем классический вид и цвета
            const pos = viewPositions.getPositionForView('table', i, total);
            return pos;
          }
        }
      });

      // Применяем анимации без вращения
      objectsRef.current.forEach((object, i) => {
        const element = object.element as HTMLElement;
        if (!element) return;

        setTimeout(() => {
          // Только плавное движение
          new TWEEN.Tween(object.position)
            .to({
              x: newPositions[i].x,
              y: newPositions[i].y,
              z: newPositions[i].z
            }, 2000)
            .easing(TWEEN.Easing.Sinusoidal.InOut) // Более плавное движение
            .start();

          // Легкая пульсация масштаба только для сердца
          if (view === 'heart') {
            const initialScale = object.scale.x;
            new TWEEN.Tween(object.scale)
              .to({ 
                x: initialScale * 1.2, 
                y: initialScale * 1.2, 
                z: initialScale * 1.2 
              }, 1000)
              .easing(TWEEN.Easing.Sinusoidal.InOut)
              .yoyo(true)
              .repeat(1)
              .start();
          }

          // Обновляем цвета только для специальных видов
          switch (view) {
            case 'star':
              const isTopTriangle = i % 2 === 0;
              element.style.backgroundColor = isTopTriangle 
                ? `rgba(255,255,255,0.9)`
                : `rgba(0,56,184,0.9)`;
              element.style.boxShadow = isTopTriangle
                ? `0 0 30px rgba(135,206,235,0.7)`
                : `0 0 30px rgba(255,255,255,0.7)`;
              break;
            case 'heart':
              element.style.backgroundColor = `rgba(255,0,0,0.9)`;
              element.style.boxShadow = `0 0 30px rgba(255,0,0,0.7)`;
              break;
            case 'sphere':
            case 'helix':
            case 'grid':
            case 'table':
              // Сохраняем оригинальные цвета
              const opacity = 0.7 + Math.random() * 0.3;
              element.style.backgroundColor = `rgba(0,127,127,${opacity})`;
              element.style.boxShadow = `0 0 20px rgba(0,255,255,0.5)`;
              break;
          }
        }, Math.random() * 300); // Уменьшаем задержку для более синхронного движения
      });

      return;
    }

    // При смене вида сначала очищаем эффекты
    cleanupEffects();
    setCurrentView(view);
    updateControlsForView(view);
    
    // Подготавливаем новые позиции с учетом текущего количества элементов
    const total = objectsRef.current.length;
    let newPositions: THREE.Object3D[] = [];

    // Генерируем позиции для выбранного вида
    switch (view) {
      case 'heart':
        newPositions = Array.from({ length: total }, (_, i) => 
          viewPositions.getPositionForView('heart', i, total));
        break;
      case 'star':
        newPositions = Array.from({ length: total }, (_, i) => 
          viewPositions.getPositionForView('star', i, total));
        break;
      case 'sphere':
        newPositions = Array.from({ length: total }, (_, i) => 
          viewPositions.getPositionForView('sphere', i, total));
        break;
      case 'helix':
        newPositions = Array.from({ length: total }, (_, i) => 
          viewPositions.getPositionForView('helix', i, total));
        break;
      case 'grid':
        newPositions = Array.from({ length: total }, (_, i) => 
          viewPositions.getPositionForView('grid', i, total));
        break;
      default:
        newPositions = Array.from({ length: total }, (_, i) => 
          viewPositions.getPositionForView('table', i, total));
    }

    // Перемешиваем позиции для боле интересной анимации
    newPositions = newPositions
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    // Применяем трансформацию
    transform(newPositions, 2000);

    // Применяем специфичные эффекты для разных видов
    if (view === 'heart') {
      if (cameraRef.current) {
        cameraRef.current.position.z = 1500;
      }
      // Запускаем эффекты сердца только если переходим с другого вида
      if (currentView !== 'heart') {
        createFireParticles();
        setTimeout(() => {
          heartEffect.pulseHeart();
        }, 2000);
      }
    } else if (view === 'star') {
      if (cameraRef.current) {
        cameraRef.current.position.z = 3000;
      }
      starEffect.animateStarOfDavid();
    } else {
      // Сбрасываем эффекты только если уходим с сердца
      if (currentView === 'heart') {
        cleanupEffects();
      }
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const cleanup = () => {
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      if (controlsRef.current) {
        controlsRef.current.removeEventListener('change', render);
        controlsRef.current.dispose();
      }
      TWEEN.removeAll();
    };

    cameraRef.current.position.z = 4000;
    cameraRef.current.position.y = 0;
    cameraRef.current.position.x = 0;

    rendererRef.current = new CSS3DRenderer();
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(rendererRef.current.domElement);

    controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
    
    if (controlsRef.current) {
      controlsRef.current.minDistance = 1000;
      controlsRef.current.maxDistance = 8000;
      
      controlsRef.current.enableDamping = true;
      controlsRef.current.dampingFactor = 0.05;
      
      controlsRef.current.rotateSpeed = 0.5;
      controlsRef.current.zoomSpeed = 1.0;
      controlsRef.current.panSpeed = 0.8;

      controlsRef.current.maxPolarAngle = Math.PI / 1.5;
      controlsRef.current.minPolarAngle = Math.PI / 3;

      controlsRef.current.enableZoom = true;
      controlsRef.current.enableRotate = true;
      controlsRef.current.enablePan = true;
      
      controlsRef.current.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };

      controlsRef.current.addEventListener('change', render);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      TWEEN.update();
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Обновляем эффекты в зависимости от текущего вида
      if (currentView === 'heart') {
        heartEffect.animateFireParticles();
      } else if (currentView === 'star') {
        starEffect.animateStar();
      }

      render();
    };

    animate();

    const initializeTable = async () => {
      const customElements = await loadElements();
      const formattedCustomElements = customElements.map((element: PeriodicElement) => ({
        ...element,
        mass: element.atomicMass,
        symbol: 'NEW',
        name: element.name || 'Unknown'
      }));
      
      const data = [...formatPeriodicData(), ...formattedCustomElements];
      
      data.forEach((element, i) => {
        const el = document.createElement('div');
        el.className = 'element';
        
        const isCustomElement = i >= formatPeriodicData().length;
        
        if (isCustomElement) {
          el.classList.add('custom-element');
          el.style.backgroundColor = `rgba(255,69,0,${Math.random() * 0.5 + 0.5})`;
        } else {
          el.style.backgroundColor = `rgba(0,127,127,${Math.random() * 0.5 + 0.25})`;
        }
        
        const number = document.createElement('div');
        number.className = 'number';
        number.textContent = String(element.atomicNumber || i + 1);
        el.appendChild(number);
        
        const symbol = document.createElement('div');
        symbol.className = 'symbol';
        if (isCustomElement) {
          symbol.innerHTML = `
            <div class="custom-symbol">
              <span class="icon">⚡</span>
              <span class="text">NEW</span>
            </div>
          `;
          symbol.style.fontSize = '24px';
        } else {
          symbol.textContent = element.symbol;
        }
        el.appendChild(symbol);
        
        const details = document.createElement('div');
        details.className = 'details';
        if (isCustomElement) {
          details.classList.add('custom-details');
          details.style.fontSize = '14px';
        }
        details.innerHTML = isCustomElement ? 
          `${element.name}<br>&nbsp;` :
          `${element.name}<br>${element.mass}`;
        el.appendChild(details);

        const object = new CSS3DObject(el);
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        sceneRef.current.add(object);
        objectsRef.current.push(object);

        targetsRef.current.table.push(viewPositions.getPositionForView('table', i, data.length));
        targetsRef.current.sphere.push(viewPositions.getPositionForView('sphere', i, data.length));
        targetsRef.current.helix.push(viewPositions.getPositionForView('helix', i, data.length));
        targetsRef.current.grid.push(viewPositions.getPositionForView('grid', i, data.length));
        targetsRef.current.heart.push(viewPositions.getPositionForView('heart', i, data.length));
        targetsRef.current.star.push(viewPositions.getPositionForView('star', i, data.length));
      });

      setLoading(false);
      transform(targetsRef.current.table, 2000);
      animateFireParticles();
    };

    initializeTable();

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          if (controlsRef.current) {
            controlsRef.current.enablePan = false;
            controlsRef.current.rotateSpeed = 0.7;
            controlsRef.current.zoomSpeed = 0.7;
          }
        }
        
        render();
      }
    };

    window.addEventListener('resize', handleResize);

    return cleanup;
  }, []);

  const createFireParticles = () => {
    const particleCount = 500;
    const particles = new BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const t = Math.random() * Math.PI * 2;
      const scale = 40;
      
      positions[i * 3] = scale * 16 * Math.pow(Math.sin(t), 3);
      positions[i * 3 + 1] = scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      colors[i * 3] = 1;  // R
      colors[i * 3 + 1] = Math.random() * 0.5;  // G
      colors[i * 3 + 2] = 0;  // B
    }

    particles.setAttribute('position', new Float32BufferAttribute(positions, 3));
    particles.setAttribute('color', new Float32BufferAttribute(colors, 3));

    const material = new PointsMaterial({
      size: 5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    if (particlesRef.current) {
      sceneRef.current.remove(particlesRef.current);
    }

    particlesRef.current = new Points(particles, material);
    sceneRef.current.add(particlesRef.current);
  };

  const pulseHeart = () => {
    if (currentView !== 'heart') return;

    const duration = isHeartCrowned ? 600 : 1000;
    
    objectsRef.current.forEach((object) => {
      const element = object.element as HTMLElement;
      if (!element) return;

      // Базовая пульсация
      new TWEEN.Tween({ scale: 0.8 })
        .to({ scale: 1.2 }, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(({ scale }) => {
          object.scale.setScalar(scale);
        })
        .repeat(Infinity)
        .yoyo(true)
        .start();

      // Пульсация цвета и свечения
      new TWEEN.Tween({ intensity: 0 })
        .to({ intensity: 1 }, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(({ intensity }) => {
          // Основной цвет
          const red = Math.floor(255 * (0.7 + intensity * 0.3));
          const opacity = 0.6 + intensity * 0.4;
          
          // Размер свечения
          const glowSize = isHeartCrowned ? 25 : 15;
          
          // Применяем стили
          element.style.backgroundColor = `rgba(${red},0,0,${opacity})`;
          element.style.boxShadow = `0 0 ${glowSize}px rgba(255,0,0,${opacity})`;
        })
        .repeat(Infinity)
        .yoyo(true)
        .start();
    });

    // Анимация частиц огня
    if (particlesRef.current) {
      const material = particlesRef.current.material as PointsMaterial;
      new TWEEN.Tween({ size: 3, opacity: 0.4 })
        .to({ size: 8, opacity: 0.8 }, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(({ size, opacity }) => {
          material.size = size;
          material.opacity = opacity;
        })
        .repeat(Infinity)
        .yoyo(true)
        .start();
    }
  };

  const resetElementColors = () => {
    objectsRef.current.forEach((object) => {
      const element = object.element as HTMLElement;
      if (element) {
        element.style.backgroundColor = `rgba(0,127,127,${Math.random() * 0.5 + 0.25})`;
        element.style.boxShadow = '0px 0px 12px rgba(0,255,255,0.5)';
      }
    });
  };

  const handleSaveCustomElement = (elementName: string) => {
    // ... логика сохранения элемента ...
  };

  const handleNotify = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Добавляем новый хук
  const heartEffect = useHeartEffect({
    isActive: currentView === 'heart',
    isCrowned: isHeartCrowned,
    objects: objectsRef.current,
    particlesRef,
    sceneRef
  });

  const starEffect = useStarEffect({
    isActive: currentView === 'star',
    objects: objectsRef.current,
    onUpdate: render
  });

  return (
    <div className="relative w-full h-screen">
      <ElementCounter />
      {notification && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-md shadow-lg
          ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {notification.message}
        </div>
      )}
      <div className="controls fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-row gap-2 bg-black bg-opacity-50 p-2 rounded-full">
        <button 
          onClick={() => handleViewChange('table')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:scale-110
            ${currentView === 'table' ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
        >
          TABLE
        </button>
        <button 
          onClick={() => handleViewChange('sphere')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:scale-110
            ${currentView === 'sphere' ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
        >
          SPHERE
        </button>
        <button 
          onClick={() => handleViewChange('helix')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:scale-110
            ${currentView === 'helix' ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
        >
          HELIX
        </button>
        <button 
          onClick={() => handleViewChange('grid')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:scale-110
            ${currentView === 'grid' ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
        >
          GRID
        </button>
        <button 
          onClick={() => handleViewChange('heart')}
          disabled={shapeState.isTransitioning}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:scale-110
            ${currentView === 'heart' 
              ? `bg-red-500 shadow-lg ${isHeartCrowned ? 'ring-2 ring-yellow-400' : 'shadow-red-500/50'}` 
              : 'bg-gray-700 hover:bg-gray-600'} 
            text-white relative ${
              shapeState.isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {shapeState.isCrowned ? '👑' : '❤️‍🔥'}
          {shapeState.currentView === 'heart' && !shapeState.isCrowned && (
            <span className="absolute -top-1 -right-1 text-xs bg-yellow-400 rounded-full px-1 animate-pulse">
              👑
            </span>
          )}
        </button>
        <button 
          onClick={() => handleViewChange('star')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:scale-110
            ${currentView === 'star' ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
        >
          ✡️
        </button>
      </div>
      <CustomElementCreator 
        onSave={handleSaveCustomElement} 
        onNotify={handleNotify}
      />
      <div ref={containerRef} className="w-full h-full" id="container">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="text-xl">Loading...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeriodicTable;
