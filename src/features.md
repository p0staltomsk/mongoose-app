# Three.js Camera Controls Integration Guide

## Установка

Прежде всего, убедитесь, что у вас установлен Three.js:

```bash
npm install three
```

## Базовая интеграция OrbitControls

OrbitControls - самый популярный и универсальный контроллер камеры. Вот как его добавить:

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Предполагается, что у вас уже есть эти объекты
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// Создаем контроллер
const controls = new OrbitControls(camera, renderer.domElement);

// Базовые настройки
controls.enableDamping = true; // Плавное затухание движений
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1; // Минимальное расстояние зума
controls.maxDistance = 50; // Максимальное расстояние зума
controls.maxPolarAngle = Math.PI / 2; // Ограничение вращения по вертикали

// Обновляем анимационный цикл
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Важно! Не забывайте обновлять контроллер
    renderer.render(scene, camera);
}
animate();
```

## Дополнительные настройки OrbitControls

```javascript
// Включение/отключение функций
controls.enableZoom = true; // Зум колесиком мыши
controls.enableRotate = true; // Вращение мышью
controls.enablePan = true; // Панорамирование правой кнопкой

// Настройка скорости
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;

// Автоматическое вращение
controls.autoRotate = true;
controls.autoRotateSpeed = 2.0; // 30 секунд на оборот

// Ограничения вращения
controls.minAzimuthAngle = -Math.PI / 2; // Ограничение горизонтального вращения
controls.maxAzimuthAngle = Math.PI / 2;
controls.minPolarAngle = 0; // Ограничение вертикального вращения
controls.maxPolarAngle = Math.PI;
```

## Альтернативные контроллеры

### TrackballControls
Подходит для неограниченного вращения камеры:

```javascript
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

const trackballControls = new TrackballControls(camera, renderer.domElement);
trackballControls.rotateSpeed = 1.0;
trackballControls.zoomSpeed = 1.2;
trackballControls.panSpeed = 0.8;
trackballControls.noZoom = false;
trackballControls.noPan = false;
trackballControls.staticMoving = false;
trackballControls.dynamicDampingFactor = 0.2;
```

### FlyControls
Для "полета" по сцене:

```javascript
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

const flyControls = new FlyControls(camera, renderer.domElement);
flyControls.movementSpeed = 1.0;
flyControls.domElement = renderer.domElement;
flyControls.rollSpeed = 0.005;
flyControls.autoForward = false;
flyControls.dragToLook = false;
```

### FirstPersonControls
Для управления от первого лица:

```javascript
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';

const fpControls = new FirstPersonControls(camera, renderer.domElement);
fpControls.lookSpeed = 0.1;
fpControls.movementSpeed = 10;
fpControls.lookVertical = true;
fpControls.constrainVertical = true;
fpControls.verticalMin = 1.0;
fpControls.verticalMax = 2.0;
```

## Обработка событий

```javascript
// Добавление обработчиков событий
controls.addEventListener('start', function() {
    console.log('Начало взаимодействия с контроллером');
});

controls.addEventListener('end', function() {
    console.log('Конец взаимодействия с контроллером');
});

controls.addEventListener('change', function() {
    console.log('Изменение положения камеры');
});
```

## Адаптивность

```javascript
// Обработка изменения размера окна
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.update();
}
```

## Рекомендации по выбору контроллера

1. **OrbitControls**: Используйте для большинства случаев, особенно когда нужно осматривать объект со всех сторон.
2. **TrackballControls**: Когда нужна полная свобода вращения без ограничений.
3. **FlyControls**: Для симуляторов полета или свободного перемещения в пространстве.
4. **FirstPersonControls**: Для игр от первого лица или виртуальных туров.

## Примечания

- Всегда вызывайте `controls.update()` в цикле анимации
- Учитывайте производительность при использовании `enableDamping`
- Настраивайте ограничения камеры в зависимости от размеров вашей сцены
- Не забудьте обработать очистку ресурсов при уничтожении сцены:

```javascript
// Очистка при уничтожении
function dispose() {
    controls.dispose();
}
```
