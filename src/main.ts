/// <reference path='typings/tsd.d.ts' />
import { sayHello } from './greet';
import Cube from './cube';

// a cube object
let cube = new Cube('#3dcube');

/**
 * Uses jQuery to update a div's contents
 * @param  {string} divName name of div to update
 * @param  {string} name    name of entity saying hello
 * @return {void}
 */
function showHello(divName: string, name: string) {
    $(`#${divName}`).text(sayHello(name));
}

/**
 * Takes the rotation on each axis of the cube and arbitrarily adds or subtracts
 * 0.002
 * @return {void}
 */
function changeItUp() {
    cube.rotX = Math.random() > 0.5 ? cube.rotX + 0.002 : cube.rotX - 0.002;
    cube.rotY = Math.random() > 0.5 ? cube.rotY + 0.002 : cube.rotY - 0.002;
    cube.rotZ = Math.random() > 0.5 ? cube.rotZ + 0.002 : cube.rotZ - 0.002;
}

/**
 * Begins rendering cube
 * @return {void}
 */
function render() {
    //renderCube();
    requestAnimationFrame(render);
    cube.render();
}

showHello('greeting', 'TypeScript');
render();

// interval on changeItUp()
let changeItUpInterval = setInterval(changeItUp, 250);
