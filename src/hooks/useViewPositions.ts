import * as THREE from 'three';
import { ViewMode } from '../types';

export const useViewPositions = () => {
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
    
    const phi = (index / total) * 2 * Math.PI;
    const scale = 30;
    const randomRadius = 0.9 + Math.random() * 0.2;
    
    const x = scale * 16 * Math.pow(Math.sin(phi), 3) * randomRadius;
    const y = scale * (13 * Math.cos(phi) - 5 * Math.cos(2 * phi) - 
      2 * Math.cos(3 * phi) - Math.cos(4 * phi)) * randomRadius;
    const z = (Math.random() * 30 - 15) * (1 - Math.abs(Math.sin(phi)));
    
    object.position.set(x, y, z);
    
    const tangentAngle = Math.atan2(
      Math.cos(phi) * 13 - Math.cos(2 * phi) * 10 - Math.cos(3 * phi) * 6 - Math.cos(4 * phi) * 4,
      Math.pow(Math.sin(phi), 2) * 48
    );
    
    object.rotation.set(
      Math.random() * 0.2 - 0.1 + tangentAngle * 0.5,
      Math.random() * 0.2 - 0.1,
      tangentAngle
    );
    
    return object;
  };

  const getStarPosition = (index: number, total: number) => {
    const object = new THREE.Object3D();
    
    const points = 12;
    const outerRadius = 800;
    const innerRadius = outerRadius * 0.6;
    const middleRadius = outerRadius * 0.8;
    
    const segment = index % points;
    const angle = (segment / points) * Math.PI * 2;
    const layerIndex = Math.floor(index / points);
    
    let radius = outerRadius;
    let heightOffset = 0;
    
    switch (layerIndex % 3) {
      case 0:
        radius = outerRadius;
        heightOffset = 0;
        break;
      case 1:
        radius = middleRadius;
        heightOffset = segment % 2 ? 50 : -50;
        break;
      case 2:
        radius = innerRadius;
        heightOffset = segment % 2 ? -100 : 100;
        break;
    }
    
    const randomOffset = {
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 30,
      z: (Math.random() - 0.5) * 30
    };
    
    const x = radius * Math.cos(angle) + randomOffset.x;
    const y = radius * Math.sin(angle) + randomOffset.y;
    const z = heightOffset + randomOffset.z;
    
    object.position.set(x, y, z);
    
    const rotationAngle = Math.atan2(y, x);
    object.rotation.set(
      Math.random() * 0.2 - 0.1,
      rotationAngle + Math.PI / 2,
      Math.random() * 0.2 - 0.1
    );
    
    return object;
  };

  const getPositionForView = (view: ViewMode, index: number, total: number) => {
    switch (view) {
      case 'table':
        return getTablePosition(index);
      case 'sphere':
        return getSpherePosition(index, total);
      case 'helix':
        return getHelixPosition(index);
      case 'grid':
        return getGridPosition(index);
      case 'heart':
        return getHeartPosition(index, total);
      case 'star':
        return getStarPosition(index, total);
    }
  };

  return {
    getPositionForView,
    getTablePosition,
    getSpherePosition,
    getHelixPosition,
    getGridPosition,
    getHeartPosition,
    getStarPosition
  };
}; 