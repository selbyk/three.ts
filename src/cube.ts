// set the scene size
let WIDTH = 250;
let HEIGHT = 250;

// set some camera attributes
let VIEW_ANGLE = 75;
let ASPECT = WIDTH / HEIGHT;
let NEAR = 0.1;
let FAR = 1000;

export default class Cube {
    selector: string;
    canvasElement: JQuery;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    geometry: THREE.BoxGeometry;
    material: THREE.MeshNormalMaterial;

    cube: THREE.Mesh;

    rotVelocities = {
        x: 0.01,
        y: 0.01,
        z: 0.01
    };

    constructor(selector: string) {
        this.selector = selector;
        this.canvasElement = $(this.selector);
        this.renderer = new THREE.WebGLRenderer({
            canvas: <HTMLCanvasElement>this.canvasElement.get(0),
            alpha: true,     // transparent background
            antialias: true // smooth edges
        });
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR);
        this.cube = Cube.createCube();
        // create a cube and add it to the scene
        this.scene.add(this.cube);
        // add the camera to the scene
        this.scene.add(this.camera);
        // move camera back so we can see the cube
        this.camera.position.z = 2;
        // set the renderer size
        this.renderer.setSize(WIDTH, HEIGHT);
    }

    /**
     * Creates a new cube object
     * @return {THREE.Mesh} a cube
     */
    static createCube(width = 1, height = 1, depth = 1) {
        let geometry = new THREE.BoxGeometry(width, height, depth);
        let material = new THREE.MeshNormalMaterial();
        return new THREE.Mesh(geometry, material);
    }

    /**
     * Renders the scene
     * @return {void}
     */
    render() {
        // render the scene
        this.renderer.render(this.scene, this.camera);

        // rotate cube each render
        this.cube.rotation.x += this.rotVelocities.x;
        this.cube.rotation.y += this.rotVelocities.y;
        this.cube.rotation.z += this.rotVelocities.z;
    }

    /**
     * gets cube rotation velocity on x axis
     */
    get rotX() {
        return this.rotVelocities.x;
    }

    /**
     * sets cube rotation velocity on x axis
     */
    set rotX(velocity: number) {
        this.rotVelocities.x = velocity;
    }

    /**
     * gets cube rotation velocity on y axis
     */
    get rotY() {
        return this.rotVelocities.y;
    }

    /**
     * sets cube rotation velocity on y axis
     */
    set rotY(velocity: number) {
        this.rotVelocities.y = velocity;
    }

    /**
     * gets cube rotation velocity on z axis
     */
    get rotZ() {
        return this.rotVelocities.z;
    }

    /**
     * sets cube rotation velocity on z axis
     */
    set rotZ(velocity: number) {
        this.rotVelocities.z = velocity;
    }
}
