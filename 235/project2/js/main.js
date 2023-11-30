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

let parent = document.querySelector(".artwork");
let positionInfo = parent.getBoundingClientRect();
let height = positionInfo.height;
let width = positionInfo.width;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(
    width,
    height
); // The render scale
renderer.setClearColor(0xffffff, 0); // Make canvas clear
//renderer.outputColorSpace = THREE.SRGBColorSpace;
document.querySelector("#images").appendChild(renderer.domElement);



/*
let line = `<div class='result'><img src='${smallUrl}' title='${result.id}'/>`;
    line += `<span><a target='_blank' href='${url}'>View on Giphy</a>`;
    line += `<p>Rating: ${rating}</p></span></div>`
*/

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
scene.add(cube); // added to coords (0,0,0)

// move the camera out of the cube
camera.position.z = 6;

// Render loop
function animate() {
    requestAnimationFrame(animate);

    // make the cube spin
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

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
