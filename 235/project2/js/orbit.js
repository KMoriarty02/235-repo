import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    50,
    (window.innerWidth/2) / window.innerHeight,
    0.1,
    1000
);

// Global variable declarations 
let renderer;
let torusRing, innerTorusRing, celestial, core, wireframe;

// Get the element size 
let parent = document.querySelector('#images');
let positionInfo = parent.getBoundingClientRect();
let width = positionInfo.width;

init();
animate();

function init() {
    // Move the camera back 
    camera.position.z = 8;
    camera.position.y = 2
    camera.rotation.x -= 0.25;

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
    // Set up the ambient light 
    let ambient = new THREE.HemisphereLight(
        0xffffff,
        0xbfd4d2,
        3
    );
    scene.add(ambient);

    // Set up the directional light 
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

    // Create all the meshes 

    // Orbiting tourus
    let torusGeo = new THREE.TorusGeometry(3, 0.15, 8, 40);
    let torusMat = new THREE.MeshStandardMaterial({
        color: 0x4BFAC8,
        flatShading: true,
        polygonOffset: true,
        polygonOffsetUnits: 1,
        polygonOffsetFactor: 1
    });
    torusRing = new THREE.Mesh(
        torusGeo,
        torusMat
    );
    torusRing.castShadow = true;
    torusRing.receiveShadow = true;
    scene.add(torusRing)

    // Inner torus 
    let innerTorusGeo = new THREE.TorusGeometry(2.25, 0.15, 8, 40);
    let innerTorusMat = new THREE.MeshStandardMaterial({
        color: 0xFA914B,
        flatShading: true,
        polygonOffset: true,
        polygonOffsetUnits: 1,
        polygonOffsetFactor: 1
    });
    innerTorusRing = new THREE.Mesh(
        innerTorusGeo,
        innerTorusMat
    );
    innerTorusRing.castShadow = true;
    innerTorusRing.receiveShadow = true;
    scene.add(innerTorusRing)

    // Celestial body 
    let celestGeo = new THREE.IcosahedronGeometry(2, 3);
    let celestMat = new THREE.MeshStandardMaterial({
        color: 0x80cbc4,
        polygonOffset: true,
        polygonOffsetUnits: 1,
        polygonOffsetFactor: 1
    });
    celestial = new THREE.Mesh(
        celestGeo,
        celestMat
    );
    celestial.castShadow = true;
    celestial.receiveShadow = true;
    scene.add(celestial);

    // Create wireframe for the celestial body
    let geo = new THREE.EdgesGeometry(celestial.geometry);
    let mat = new THREE.LineBasicMaterial({
        color: 0xffffff
    });
    wireframe = new THREE.LineSegments(
        geo,
        mat
    );
    scene.add(wireframe);


    // Core 
    let coreGeo = new THREE.OctahedronGeometry(20);
    let coreMat = new THREE.MeshStandardMaterial({
        flatShading: true,
        color: 0xff9800,
        emissive: 0xff9800,
        emissiveIntensity: 0.35,
        polygonOffset: true,
        polygonOffsetUnits: 1,
        polygonOffsetFactor: 1
    });
    core = new THREE.Mesh(
        coreGeo,
        coreMat
    );
    core.castShadow = true;
    core.position.y += 3; 
    scene.add(core);

    // Rescale listener
    window.addEventListener('resize', onWindowResize);
    onWindowResize();
}

// Rescale the window size 
function onWindowResize() {
    renderer.setSize(
        width/2,
        window.innerHeight,
        false
    );
}

function animate() {
    requestAnimationFrame(animate);

    // Celestial rotations
    celestial.rotation.x += 0.008;
    celestial.rotation.y += 0.0045;
    celestial.rotation.z += 0.02;
    wireframe.rotation.x += 0.008;
    wireframe.rotation.y += 0.0045;
    wireframe.rotation.z += 0.02;

    // Inner ring rotation
    innerTorusRing.rotation.x += 0.015;

    // Outer ring rotation
    torusRing.rotation.y += 0.01;
    
    renderer.render(scene, camera);
}