/// <reference path='typings/tsd.d.ts' />
import { sayHello } from './greet';
import { render as renderCube } from './cube';
//import * as cube from './cube';

/**
 * Uses jQuery to update a div's contents
 * @param  {string} divName name of div to update
 * @param  {string} name    name of entity saying hello
 * @return {void}
 */
function showHello(divName: string, name: string) {
    const elt = $(`#${divName}`);//document.getElementById(divName);
    elt.text(sayHello(name));
}

/**
 * Begins rendering cube
 * @return {void}
 */
function render() {
  renderCube();
  //cube.render();
}

showHello('greeting', 'TypeScript');
render();
