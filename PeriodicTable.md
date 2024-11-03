import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import TWEEN from '@tweenjs/tween.js';
import { formatPeriodicData, type PeriodicElement } from '../data/periodicTable';
import '../styles/PeriodicTable.css';
import { Points, BufferGeometry, Float32BufferAttribute, PointsMaterial } from 'three';
import CustomElementCreator from './CustomElementCreator';

// ... (rest of the imports and type definitions)

const PeriodicTable: React.FC = () => {
  // ... (existing state and refs)

  const [customElements, setCustomElements] = useState<PeriodicElement[]>([]);

  // ... (existing useEffect and functions)

  const handleSaveCustomElement = (elementName: string) => {
    const newElement: PeriodicElement = {
      name: elementName,
      symbol: elementName.slice(0, 2).toUpperCase(),
      mass: '???',
      number: objectsRef.current.length + 1,
    };

    setCustomElements(prev => [...prev, newElement]);

    // Create a new CSS3DObject for the custom element
    const el = document.createElement('div');
    el.className = 'element';
    el.style.backgroundColor = `rgba(255,0,0,${Math.random() * 0.5 + 0.25})`;
    
    const number = document.createElement('div');
    number.className = 'number';
    number.textContent = String(newElement.number);
    el.appendChild(number);
    
    const symbol = document.createElement('div');
    symbol.className = 'symbol';
    symbol.textContent = newElement.symbol;
    el.appendChild(symbol);
    
    const details = document.createElement('div');
    details.className = 'details';
    details.innerHTML = `${newElement.name}<br>${newElement.mass}`;
    el.appendChild(details);

    const object = new CSS3DObject(el);
    object.position.x = Math.random() * 4000 - 2000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;
    sceneRef.current.add(object);
    objectsRef.current.push(object);

    // Add new positions for the custom element in each view mode
    Object.keys(targetsRef.current).forEach((key) => {
      const viewMode = key as ViewMode;
      let newPosition;
      switch (viewMode) {
        case 'table':
          newPosition = getTablePosition(objectsRef.current.length - 1);
          break;
        case 'sphere':
          newPosition = getSpherePosition(objectsRef.current.length - 1, objectsRef.current.length);
          break;
        case 'helix':
          newPosition = getHelixPosition(objectsRef.current.length - 1);
          break;
        case 'grid':
          newPosition = getGridPosition(objectsRef.current.length - 1);
          break;
        case 'heart':
          newPosition = getHeartPosition(objectsRef.current.length - 1, objectsRef.current.length);
          break;
      }
      targetsRef.current[viewMode].push(newPosition);
    });

    // Transform to current view to include the new element
    transform(targetsRef.current[currentView], 2000);
  };

  return (
    <div className="relative w-full h-screen">
      <CustomElementCreator onSave={handleSaveCustomElement} />
      {/* ... (rest of the existing JSX) */}
    </div>
  );
};

export default PeriodicTable;