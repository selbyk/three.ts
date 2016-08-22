// set the scene size
let WIDTH = 250;
let HEIGHT = 250;

// set some camera attributes
let VIEW_ANGLE = 75;
let ASPECT = WIDTH / HEIGHT;
let NEAR = 0.1;
let FAR = 1000;

// get the DOM element to attach to
// - assume we've got jQuery to hand
const canvas = $('#3dcube');

// create a WebGL renderer, camera
// and a scene
const renderer = new THREE.WebGLRenderer({
    canvas: <HTMLCanvasElement>canvas.get(0),
    alpha: true,     // transparent background
    antialias: true // smooth edges
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR);

/**
 * Creates a new cube object
 * @return {THREE.Mesh} a cube
 */
function createCube(){
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshNormalMaterial();
  return new THREE.Mesh(geometry, material);
}

let cube = createCube();

// create a cube and add it to the scene
scene.add(cube);
// add the camera to the scene
scene.add(camera);
// move camera back so we can see the cube
camera.position.z = 2;
// set the renderer size
renderer.setSize(WIDTH, HEIGHT);

/**
 * Renders the scene
 * @return {void}
 */
export function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    // rotate cube a little each frame
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.02;
    cube.rotation.z += 0.03;
};
