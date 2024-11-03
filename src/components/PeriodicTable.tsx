import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import TWEEN from '@tweenjs/tween.js';
import { formatPeriodicData, type PeriodicElement } from '../data/periodicTable';
import '../styles/PeriodicTable.css';
import { Points, BufferGeometry, Float32BufferAttribute, PointsMaterial } from 'three';
import CustomElementCreator from './CustomElementCreator';
import { ElementCounter } from './ElementCounter';

type ViewMode = 'table' | 'sphere' | 'helix' | 'grid' | 'heart';

const PeriodicTable: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('table');
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [elements, setElements] = useState<PeriodicElement[]>([]);

  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera>(
    new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000)
  );
  const rendererRef = useRef<CSS3DRenderer>();
  const controlsRef = useRef<TrackballControls>();
  const objectsRef = useRef<CSS3DObject[]>([]);
  const targetsRef = useRef<{ [key in ViewMode]: THREE.Object3D[] }>({
    table: [],
    sphere: [],
    helix: [],
    grid: [],
    heart: []
  });
  const particlesRef = useRef<Points>();

  const render = () => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

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

  const transform = (targets: THREE.Object3D[], duration: number) => {
    TWEEN.removeAll();

    objectsRef.current.forEach((object, index) => {
      const target = targets[index];
      if (target) {
        new TWEEN.Tween(object.position)
          .to({ 
            x: target.position.x, 
            y: target.position.y, 
            z: target.position.z 
          }, duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();

        new TWEEN.Tween(object.rotation)
          .to({ 
            x: target.rotation.x, 
            y: target.rotation.y, 
            z: target.rotation.z 
          }, duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
      }
    });

    new TWEEN.Tween({})
      .to({}, duration)
      .onUpdate(render)
      .start();
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

  useEffect(() => {
    if (!containerRef.current) return;

    cameraRef.current.position.z = 4000;

    rendererRef.current = new CSS3DRenderer();
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(rendererRef.current.domElement);

    controlsRef.current = new TrackballControls(cameraRef.current, rendererRef.current.domElement);
    controlsRef.current.minDistance = 500;
    controlsRef.current.maxDistance = 8000;
    controlsRef.current.enableZoom = true;
    controlsRef.current.zoomSpeed = 1.0;
    controlsRef.current.rotateSpeed = 0.5;
    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 0.05;
    controlsRef.current.addEventListener('change', render);

    const animate = () => {
      requestAnimationFrame(animate);
      controlsRef.current?.update();
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

        targetsRef.current.table.push(getTablePosition(i));
        targetsRef.current.sphere.push(getSpherePosition(i, data.length));
        targetsRef.current.helix.push(getHelixPosition(i));
        targetsRef.current.grid.push(getGridPosition(i));
        targetsRef.current.heart.push(getHeartPosition(i, data.length));
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

        // Адаптивное расстояние камеры
        const isMobile = window.innerWidth <= 768;
        if (currentView === 'table') {
          cameraRef.current.position.z = isMobile ? 6000 : 4000;
        } else if (currentView === 'heart') {
          cameraRef.current.position.z = isMobile ? 2000 : 1500;
        }
        // ... остальные виды ...

        render();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, []);

  const getTablePosition = (index: number) => {
    const object = new THREE.Object3D();
    const x = (index % 18) * 140 - 1330;
    const y = -((Math.floor(index / 18)) * 180) + 990;
    object.position.set(x, y, 0);
    return object;
  };

  const getSpherePosition = (index: number, total: number) => {
    const object = new THREE.Object3D();
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;
    object.position.setFromSphericalCoords(800, phi, theta);
    return object;
  };

  const getHelixPosition = (index: number) => {
    const object = new THREE.Object3D();
    const theta = index * 0.175 + Math.PI;
    const y = -(index * 8) + 450;
    object.position.setFromCylindricalCoords(900, theta, y);
    return object;
  };

  const getGridPosition = (index: number) => {
    const object = new THREE.Object3D();
    object.position.x = ((index % 5) * 400) - 800;
    object.position.y = (-(Math.floor(index / 5) % 5) * 400) + 800;
    object.position.z = (Math.floor(index / 25)) * 1000 - 2000;
    return object;
  };

  const getHeartPosition = (index: number, total: number) => {
    const object = new THREE.Object3D();
    const randomOffset = Math.random() * 0.5 - 0.25; // от -0.25 до 0.25
    const t = ((index + randomOffset) / total) * 2 * Math.PI;
    const scale = 30;
    
    const x = scale * 16 * Math.pow(Math.sin(t), 3);
    const y = scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    const z = (Math.random() * 20) - 10;
    
    object.position.set(x, y, z);
    
    object.rotation.set(
      Math.random() * 0.2 - 0.1,
      Math.random() * 0.2 - 0.1,
      Math.random() * 0.2 - 0.1
    );
    
    return object;
  };

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
    
    if (view === 'heart') {
      const shuffledPositions = [...targetsRef.current.heart]
        .sort(() => Math.random() - 0.5)
        .map((_, i) => getHeartPosition(i, objectsRef.current.length));
      
      transform(shuffledPositions, 2000);
      cameraRef.current.position.z = 1500;
      createFireParticles();
      setTimeout(pulseHeart, 2000);
    } else {
      transform(targetsRef.current[view], 2000);
      resetElementColors();
      if (particlesRef.current) {
        sceneRef.current.remove(particlesRef.current);
      }
      if (view === 'table') {
        cameraRef.current.position.z = 4000;
      } else if (view === 'sphere') {
        cameraRef.current.position.z = 3000;
      } else if (view === 'helix') {
        cameraRef.current.position.z = 3500;
      } else if (view === 'grid') {
        cameraRef.current.position.z = 4000;
      }
    }
  };

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
    if (currentView === 'heart') {
      const duration = 2000;
      const scaleMin = 0.85;
      const scaleMax = 1.15;
      
      objectsRef.current.forEach((object) => {
        const originalPos = object.position.clone();
        
        new TWEEN.Tween({
          scale: scaleMin,
          intensity: 0
        })
          .to({
            scale: scaleMax,
            intensity: 1
          }, duration)
          .easing(TWEEN.Easing.Sinusoidal.InOut)
          .onUpdate(({ scale, intensity }) => {
            object.scale.setScalar(scale);
            const element = object.element as HTMLElement;
            if (element) {
              const opacity = 0.5 + intensity * 0.5;
              element.style.backgroundColor = `rgba(255,0,0,${opacity})`;
            }
          })
          .repeat(Infinity)
          .yoyo(true)
          .start();
      });
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

  return (
    <div className="relative w-full h-screen">
      <ElementCounter />
      {notification && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-md shadow-lg
          ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {notification.message}
        </div>
      )}
      <div className="controls">
        <button onClick={() => handleViewChange('table')}>TABLE</button>
        <button onClick={() => handleViewChange('sphere')}>SPHERE</button>
        <button onClick={() => handleViewChange('helix')}>HELIX</button>
        <button onClick={() => handleViewChange('grid')}>GRID</button>
        <button 
          onClick={() => handleViewChange('heart')}
          data-active={currentView === 'heart'}
        >
          ❤️‍🔥
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
