import { useRef, useEffect, MutableRefObject } from 'react';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { formatPeriodicData, type PeriodicElement } from '../../data/periodicTable';

export const usePeriodicTableSetup = (
  containerRef: MutableRefObject<HTMLDivElement | null>,
  setLoading: (loading: boolean) => void
) => {
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera>(
    new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000)
  );
  const rendererRef = useRef<CSS3DRenderer>();
  const controlsRef = useRef<OrbitControls>();
  const objectsRef = useRef<CSS3DObject[]>([]);
  const targetsRef = useRef<{ [key: string]: THREE.Object3D[] }>({
    table: [],
    sphere: [],
    helix: [],
    grid: [],
    heart: []
  });

  const render = () => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  const initializeTable = async () => {
    if (!containerRef.current) return;

    cameraRef.current.position.z = 4000;

    rendererRef.current = new CSS3DRenderer();
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(rendererRef.current.domElement);

    controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
    if (controlsRef.current) {
      controlsRef.current.minDistance = 1000;
      controlsRef.current.maxDistance = 8000;
      controlsRef.current.addEventListener('change', render);
    }

    const data = [...formatPeriodicData()];
    
    data.forEach((element, i) => {
      const el = document.createElement('div');
      el.className = 'element';
      el.style.backgroundColor = `rgba(0,127,127,${Math.random() * 0.5 + 0.25})`;
      
      const number = document.createElement('div');
      number.className = 'number';
      number.textContent = String(element.atomicNumber);
      el.appendChild(number);
      
      const symbol = document.createElement('div');
      symbol.className = 'symbol';
      symbol.textContent = element.symbol;
      el.appendChild(symbol);
      
      const details = document.createElement('div');
      details.className = 'details';
      details.innerHTML = `${element.name}<br>${element.mass}`;
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
  };

  return {
    sceneRef,
    cameraRef,
    rendererRef,
    controlsRef,
    objectsRef,
    targetsRef,
    initializeTable,
    render,
  };
};

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
  const randomOffset = Math.random() * 0.5 - 0.25;
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