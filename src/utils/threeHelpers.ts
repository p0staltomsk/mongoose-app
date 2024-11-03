import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

export const createObject3D = () => new THREE.Object3D();

export const transformObjects = (
  objects: CSS3DObject[],
  targets: THREE.Object3D[],
  duration: number,
  onUpdate: () => void
) => {
  TWEEN.removeAll();

  objects.forEach((object, index) => {
    const target = targets[index];
    if (!target) return;

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
  });

  new TWEEN.Tween({})
    .to({}, duration)
    .onUpdate(onUpdate)
    .start();
}; 