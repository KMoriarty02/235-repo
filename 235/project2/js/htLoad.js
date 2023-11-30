import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,                                     // FOV
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1,                                    // Near clipping plane
    1000                                    // Far clipping plane
);
const light = new THREE.AmbientLight(
    0x404040
);
scene.add(light);

let parent = document.querySelector("#images");
let positionInfo = parent.getBoundingClientRect();
let height = positionInfo.height;
let width = positionInfo.width;

/*
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    physicallyCorrectLights: true, 
    outputEncoding: THREE.sRGBEncoding,
    gammaOutput: true,
    gammaFactor: 2.2
});
*/
const renderer = new THREE.WebGL1Renderer();
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.colorSpace = THREE.SRGBColorSpace;
renderer.setSize(
    width,
    window.innerHeight
); // The render scale
renderer.setClearColor(0xffffff, 0); // Make canvas clear
document.querySelector("section[id='images']").appendChild(renderer.domElement);
// Cube constants
const geometry = new THREE.BoxGeometry(
    1,
    1,
    1
);
const material = new THREE.MeshBasicMaterial( { color: 0x6551db } );
const cube = new THREE.Mesh(
    geometry,
    material
);
//scene.add(cube); // added to coords (0,0,0)

// Load in glb model file 
let proto = null;
loader.load(
    '../models/huntressProto.glb',
    function (gltf) {
        proto = gltf.asset;
        scene.add(gltf.scene);
}, 
undefined, 
function (error) {
    console.error(error);
});

// move the camera out of the cube
camera.position.z = 2;
camera.position.x = 4.7;
camera.position.y = 1;

// Render loop
function animate() {
    requestAnimationFrame(animate);

    // make the cube spin
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    //proto.rotation.x += 0.01;

    //camera.rotation.y += 0.01;

    // lerp the colors 
    /*
    material.color.lerpColors(
        rgb(101, 81, 219),
        rgb(81, 149, 219)
    );
    */

    renderer.render(
        scene,
        camera
    );
}
animate();

let req = null;
let frame = 0;

const cameraAnimate = () => {
    req = requestAnimationFrame(cameraAnimate);

    frame = frame <= 100 ? frame + 1 : frame;
    if (frame <= 100) {
        const p = initialCameraPosition;
        const rotSpeed = -easeOutCirc(frame / 120) * Math.PI * 20;

        camera.position.y = 10;
        camera.position.x = p.x * Math.cs(rotSpeed) + p.z * Math.sin(rotSpeed);
        camera.position.z = p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed);
        camera.LookAt(target);
    } else {
        renderer.render(scene, camera);
    }

}
