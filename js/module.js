
import * as THREE from '../three/three.module.js';

import { OrbitControls } from '../three/OrbitControls.js';

let group, camera, scene, renderer;

let sourceGroup;

let modelGeometry, sourceGeometry, coneGeometry;

let model, source, cone;

const material = new THREE.MeshBasicMaterial({ color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, transparent: true, opacity: 0.5, flatShading: true });
const material2 = new THREE.MeshBasicMaterial({ color: 0xFF0000, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true });
const materialCone = new THREE.MeshBasicMaterial({ color: 0xAA00AA, emissive: 0x072534, side: THREE.DoubleSide, transparent: true, opacity: 0.2, flatShading: true });


init();
animate();

function init() {

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("canvas").appendChild(renderer.domElement);

    // camera

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(500, 600, 800);
    scene.add(camera);

    // controls

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 20;
    controls.maxDistance = 10000;
    controls.maxPolarAngle = Math.PI / 2;

    // ambient light

    scene.add(new THREE.AmbientLight(0x222222));

    // point light

    const light = new THREE.PointLight(0xffffff, 1);
    camera.add(light);

    // helper

    scene.add(new THREE.AxesHelper(200));

    // textures

    const loader = new THREE.TextureLoader();
    const texture = loader.load('textures/sprites/disc.png');

    group = new THREE.Group();
    scene.add(group);

    sourceGeometry = new THREE.SphereGeometry(10);
    modelGeometry = new THREE.BoxGeometry(1, 1, 1);

    model = new THREE.Mesh(modelGeometry, material);
    group.add(model);

    sourceGroup = new THREE.Group();

    coneGeometry = new THREE.ConeGeometry(100, 200, 100);
    source = new THREE.Mesh(sourceGeometry, material2);
    cone = new THREE.Mesh(coneGeometry, materialCone);

    sourceGroup.add(source);
    // sourceGroup.add(cone);

    group.add(sourceGroup);

    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(- 100, - 200, - 100);

    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);


    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {



    // group.rotation.y += 0.005;

    let x, y, z, aperture;
    x = parseInt(document.getElementById("model-size-x").value);
    y = parseInt(document.getElementById("model-size-y").value);
    z = parseInt(document.getElementById("model-size-z").value);

    // console.log(x, y, z);
    model.scale.set(x, y, z);
    model.position.y = y / 2;

    x = parseInt(document.getElementById("source-x").value);
    y = parseInt(document.getElementById("source-y").value);
    z = parseInt(document.getElementById("source-z").value);
    aperture = parseInt(document.getElementById("source-aperture").value);

    source.position.set(x, y, z);

    cone.removeFromParent();
    cone = new THREE.Mesh(new THREE.ConeGeometry(50 * y / aperture, y, 100), materialCone);
    cone.position.x = x;
    cone.position.y = y / 2;
    cone.position.z = z;
    scene.add(cone);
    // sourceGroup.add(cone);

    // console.log(modelGeometry);

    requestAnimationFrame(animate);

    render();

}

function render() {

    renderer.render(scene, camera);

}