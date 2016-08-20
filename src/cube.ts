/// <reference path='typings/tsd.d.ts' />
// set the scene size
let WIDTH = 250,
    HEIGHT = 250;

// set some camera attributes
let VIEW_ANGLE = 75,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 1000;

// get the DOM element to attach to
// - assume we've got jQuery to hand
const canvas = $('#threetest');

// create a WebGL renderer, camera
// and a scene
let renderer = new THREE.WebGLRenderer({
    canvas: <HTMLCanvasElement>canvas.get(0),
    alpha: true,     // transparent background
    antialias: true // smooth edges
});

let camera = new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR);

let scene = new THREE.Scene();

// add the camera to the scene
scene.add(camera);

// the camera starts at 0,0,0
// so pull it back
let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshNormalMaterial();
let cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5; // move camera back so we can see the cube

// start the renderer
renderer.setSize(WIDTH, HEIGHT);

export function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    // rotate cube a little each frame
    cube.rotation.x += 0.05;
    cube.rotation.y += 0.05;
};
