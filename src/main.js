"use strict";
var greet_1 = require("./greet");
var cube_1 = require("./cube");
function showHello(divName, name) {
    var elt = $("#" + divName);
    elt.text(greet_1.sayHello(name));
}
function render() {
    cube_1.render();
}
showHello("greeting", "TypeScript");
render();
