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

// Move the camera back
camera.position.z = 80;

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
let light = new THREE.DirectionalLight( 0xffffff, 3 );
light.position.set( 3, 0, 0 );
scene.add( light );

// Create the torus knot
let geometry = new THREE.TorusKnotGeometry(
    15,
    3,
    74,
    6,
    4,
    5
)
let material = new THREE.MeshLambertMaterial({
    color: 0xe63b60,
    wireframe: true
});
let torus = new THREE.Mesh(
    geometry,
    material
);
scene.add(torus);
torus.position.x -= 30;

// Create octahedron
let octahedronGeo = new THREE.OctahedronGeometry(
    20
);
let color = new THREE.Color("#61b0b7");
let octaMaterial = new THREE.MeshLambertMaterial({
    color: color.getHex(), 
    wireframe: true
});
let octahedron = new THREE.Mesh(
    octahedronGeo,
    octaMaterial
);
octahedron.position.x += 30; 
scene.add(octahedron);

// Render/Update Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    // Rotate the torus
    torus.rotation.x += 0.006;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.005;

    // Rotate the octahedron
    octahedron.rotation.x += 0.01;
    octahedron.rotation.y += 0.01;
}
animate();