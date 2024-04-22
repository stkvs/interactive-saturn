import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
	antialias: true,
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement);
controls.enableDamping = true;
controls.damping = 0.2

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
	new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);

bloomPass.threshold = 0;
bloomPass.strength = 1.5;
bloomPass.radius = 1;

const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const loader = new GLTFLoader();
let model; // Declare model variable outside loader.load function

loader.load(
    './assets/saturn-model/scene.gltf',
    function ( gltf ) {
        // Called when the model is loaded
        model = gltf.scene; // Use the outer model variable
        model.scale.setScalar(0.001); // Set the scale to 0.1 (10 times smaller)
        scene.add( model );
    },
    function ( xhr ) {
        // Called while loading is progressing
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
        // Called if there's an error loading the model
        console.error( 'Error loading GLTF model:', error );
    }
);

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( directionalLight );
directionalLight.position.set(0, 5, 10)

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
	controls.update()

	if (model) { // Check if model is defined before attempting to rotate
        model.rotation.y += 0.01;
    }
	
	//renderer.render( scene, camera );
	bloomComposer.render();
}

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  bloomComposer.setSize(window.innerWidth, window.innerHeight);
}

animate();