import * as THREE from 'three';

// Create scene and camera 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    (window.innerWidth/2) / window.innerHeight,
    0.1,
    1000
);

// Get the dimensions of the parent element 
let parent = document.querySelector('#images');
let positionInfo = parent.getBoundingClientRect();
let height = positionInfo.height;
let width = positionInfo.width;

// Place the camera at a z of 100
camera.position.z = 50;

// Add a renderer
const renderer = new THREE.WebGLRenderer();
// Set the render scale
renderer.setSize(
    width/2,
    window.innerHeight,
    false
);
// Make the render background clear
renderer.setClearColor(0xffffff, 0);
// Add the renderer element to the DOM
document.querySelector("section[id='images']").appendChild(renderer.domElement);

// Add a soft white light to the scene
const light = new THREE.AmbientLight(
    0xffff00
);
scene.add(light);

// Create geometry
let geometry = new THREE.IcosahedronGeometry(
    20,
    0
);
// Create material 
let material = new THREE.MeshNormalMaterial();
// Add geo to the mesh and apply material
let icosahedron = new THREE.Mesh(
    geometry,
    material
);
// Add object to the scene
scene.add(icosahedron);

// Render/Update Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    icosahedron.rotation.x += 0.03;
    icosahedron.rotation.z += 0.02;
    icosahedron.rotation.y += 0.02;
}
animate();

