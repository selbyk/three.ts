/// <reference path="typings/tsd.d.ts" />
import { sayHello } from "./greet";
import { render as renderCube } from "./cube";
//import * as cube from "./cube";

function showHello(divName: string, name: string) {
    const elt = $(`#${divName}`);//document.getElementById(divName);
    elt.text(sayHello(name));
}

function render() {
  renderCube();
  //cube.render();
}

showHello("greeting", "TypeScript");
render();
