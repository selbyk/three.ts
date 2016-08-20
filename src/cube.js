"use strict";
var WIDTH = 250, HEIGHT = 250;
var VIEW_ANGLE = 75, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 1000;
var canvas = $('#threetest');
var renderer = new THREE.WebGLRenderer({
    canvas: canvas.get(0),
    alpha: true,
    antialias: true
});
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
var scene = new THREE.Scene();
scene.add(camera);
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;
renderer.setSize(WIDTH, HEIGHT);
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    cube.rotation.x += 0.05;
    cube.rotation.y += 0.05;
}
exports.render = render;
;
