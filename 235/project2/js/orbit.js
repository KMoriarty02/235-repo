import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import { SUBTRACTION } from 'three-bvh-csg';

// Create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    50,
    (window.innerWidth/2) / window.innerHeight,
    0.1,
    1000
);

let renderer;

init();
animate();

function init() {
    let parent = document.querySelector('#images');
    let positionInfo = parent.getBoundingClientRect();
    let width = positionInfo.width;

    // Move the camera back 
    camera.position.z = 75;

    // Make the background color
    scene.background = new THREE.Color( 0xffd1dc );

    // Create the renderer
    renderer = new THREE.WebGLRenderer();
    // Set the render scale
    renderer.setSize(
        width/2,
        window.innerHeight,
        false
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Add the renderer element to the DOM
    document.querySelector("section[id='images']").appendChild(renderer.domElement);

    // Add lights
    let ambient = new THREE.HemisphereLight(
        0xffffff,
        0xbfd4d2,
        3
    );
    scene.add(ambient);

    let directional = new THREE.DirectionalLight(
        0xffffff,
        0.3
    );
    directional.position.set(1, 4, 3).multiplyScalar(3);
    directional.castShadow = true;
    directional.shadow.mapSize.setScalar(2048); // set the resolution of the shadow
    directional.shadow.bias = - 1e-4;
    directional.shadow.normalBias = 1e-4;
    scene.add(directional);

    // Add a plane for the shadows to cast on 
    let planeGeo = new THREE.PlaneGeometry();
    let planeMat = new THREE.ShadowMaterial({
        color: 0xffd1dc,
        transparent: true,
        opacity: 0.075,
        side: THREE.DoubleSide
    });
    let plane = new THREE.Mesh(
        planeGeo,
        planeMat
    );
    // Place the plane 
    plane.position.y = -3;
    plane.rotation.x = -Math.PI/2;
    plane.scale.setScalar(10);
    plane.receiveShadow = true;
    scene.add(plane);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}