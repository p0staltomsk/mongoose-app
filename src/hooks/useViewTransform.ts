import { MutableRefObject } from 'react';
import * as THREE from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TWEEN from '@tweenjs/tween.js';

type ViewMode = 'table' | 'sphere' | 'helix' | 'grid' | 'heart';

export const useViewTransform = (
  objectsRef: MutableRefObject<CSS3DObject[]>,
  targetsRef: MutableRefObject<{ [key: string]: THREE.Object3D[] }>,
  controlsRef: MutableRefObject<OrbitControls | undefined>,
  cameraRef: MutableRefObject<THREE.PerspectiveCamera>,
  render: () => void
) => {
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
        controlsRef.current.autoRotateSpeed = 2.0;
        break;
    }
  };

  return { transform, updateControlsForView };
};