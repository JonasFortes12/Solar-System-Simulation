import * as THREE from 'three';
import { createOrbitLine, orbitObjectAround, orbitObjectAroundSun } from '../js/utils/utils.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Earth } from './factories/Earth.mjs';
import { Stars } from './factories/Stars.mjs';
import Stats from 'three/addons/libs/stats.module.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { Sun } from './factories/Sun.mjs';

// Planets imports 
import { Mercury } from './factories/Mercury.mjs';
import { Venus } from './factories/Venus.mjs';
import { Mars } from './factories/Mars.mjs';
import { Jupiter } from './factories/Jupiter.mjs';
import { AsteroidBelt } from './factories/AsteroidBelt.mjs';
import { Saturn } from './factories/Saturn.mjs';
import { Neptune } from './factories/Neptune.mjs';
import { Uranus } from './factories/Uranus.mjs';

const radius = 6371;
const moonScale = 0.23;
const sunRadius = 150000;

let EarthOrbitSpeed, MercuryOrbitSpeed, VenusOrbitSpeed, MarsOrbitSpeed, JupiterOrbitSpeed, NeptuneOrbitSpeed, UranusOrbitSpeed, SaturnOrbitSpeed;

const MARGIN = 0;
let SCREEN_HEIGHT = window.innerHeight - MARGIN * 2 - 80;
let SCREEN_WIDTH = window.innerWidth;

let camera, controls, scene, renderer, stats;
let dirLight, bulbLight, bulbMat;

let composer;

let earth, sun, mercury, venus, asteroidBelt, mars, jupiter, neptune, uranus, saturn;

let d, dPlanet, dMoon;
const dMoonVec = new THREE.Vector3();

const clock = new THREE.Clock();

const textureLoader = new THREE.TextureLoader();

init();
animate();

function setSystemVelocity(aumento){
	mercury.OrbitSpeed = aumento*MercuryOrbitSpeed;
	venus.OrbitSpeed = aumento*VenusOrbitSpeed;
	earth.orbitSpeed = aumento*EarthOrbitSpeed;
	mars.OrbitSpeed = aumento*MarsOrbitSpeed;
	jupiter.OrbitSpeed = aumento*JupiterOrbitSpeed;
	saturn.OrbitSpeed = aumento*SaturnOrbitSpeed;
	neptune.OrbitSpeed = aumento*NeptuneOrbitSpeed;
	uranus.OrbitSpeed = aumento*UranusOrbitSpeed;	
}

function init() {

	camera = new THREE.PerspectiveCamera(25, SCREEN_WIDTH / SCREEN_HEIGHT, 50, 1e7);
	camera.position.z = radius * 200;

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x000000, 0.00000025);

	
	// earth and his moon
	earth = new Earth(scene, sunRadius);
	EarthOrbitSpeed = earth.orbitSpeed;
	
	// stars
	
	const stars = new Stars(scene, radius * 3);
	
	//sun
	
	sun = new Sun(scene, sunRadius);
	const light = new THREE.AmbientLight(0xFFFFFF, 0.1); // soft white light
	scene.add(light);
	
	
	//mercury
	mercury = new Mercury(scene, earth.radius, sunRadius);
	MercuryOrbitSpeed = mercury.OrbitSpeed;
	
	//venus
	venus = new Venus(scene, earth.radius, sunRadius);
	VenusOrbitSpeed = venus.OrbitSpeed;
	

	//mars
	mars = new Mars(scene, earth.radius, sunRadius);
	MarsOrbitSpeed = mars.OrbitSpeed;

	//jupiter
	jupiter = new Jupiter(scene, earth.radius, sunRadius);
	JupiterOrbitSpeed = jupiter.OrbitSpeed;

	//saturn
	saturn = new Saturn(scene, earth.radius, sunRadius);
	SaturnOrbitSpeed = saturn.OrbitSpeed;

	//uranus
	uranus = new Uranus(scene, earth.radius, sunRadius);
	UranusOrbitSpeed = uranus.OrbitSpeed;

	//neptune
	neptune = new Neptune(scene, earth.radius, sunRadius);
	NeptuneOrbitSpeed = neptune.OrbitSpeed;

	//asteroid belts
	asteroidBelt = new AsteroidBelt(scene);	





	//renderer

	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	document.body.appendChild(renderer.domElement);

	//controls

	controls = new FlyControls(camera, renderer.domElement);
	controls.movementSpeed = 500;
	controls.domElement = renderer.domElement;
	controls.rollSpeed = Math.PI / 12;
	controls.autoForward = false;
	controls.dragToLook = true;

	//stats

	// stats = new Stats();
	// document.body.appendChild(stats.dom);

	//windowResize

	window.addEventListener('resize', onWindowResize);

	document.addEventListener('keydown', function (event) {
		// Verifique se a tecla pressionada está no intervalo de 1 a 9.
		if (event.key >= '1' && event.key <= '9') {
		  // Converte a tecla pressionada em um número.
		  const aumento = parseInt(event.key);
		  console.log(aumento);
		  setSystemVelocity(aumento);
		}
	});

	// postprocessing

	const renderModel = new RenderPass(scene, camera);
	const effectFilm = new FilmPass(0.35);
	const outputPass = new OutputPass();

	composer = new EffectComposer(renderer);
	composer.addPass(renderModel);
	composer.addPass(effectFilm);
	composer.addPass(outputPass);

	const renderPass = new RenderPass(scene, camera);
	const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
	bloomPass.threshold = 0.1; // Ajuste o limite para controlar o brilho afetado pelo "bloom"
	bloomPass.strength = 0.6; // Ajuste a intensidade do "bloom"
	bloomPass.radius = 1.2; // Ajuste o raio do "bloom"

	composer.addPass(renderPass);
	composer.addPass(bloomPass);

}

function onWindowResize() {

	SCREEN_HEIGHT = window.innerHeight;
	SCREEN_WIDTH = window.innerWidth;

	camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	camera.updateProjectionMatrix();

	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	composer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

}

function animate() {

	requestAnimationFrame(animate);
	venus.animate();
	mercury.animate();
	uranus.animate();
	earth.animate();
	mars.animate();
	jupiter.animate();
	saturn.animate();

	neptune.animate();
	// asteroidBelt.animate();
	render();
	// stats.update();

}

function render() {
	const delta = clock.getDelta();

	orbitObjectAroundSun(earth.meshPlanet, sun.radius + earth.orbitRadius, earth.orbitSpeed);
	orbitObjectAroundSun(mercury.mesh, sun.radius + mercury.orbitRadius, mercury.OrbitSpeed);
	orbitObjectAroundSun(venus.mesh, sun.radius + venus.orbitRadius, venus.OrbitSpeed);
	orbitObjectAroundSun(mars.mesh, sun.radius + mars.orbitRadius, mars.OrbitSpeed);
	orbitObjectAroundSun(jupiter.mesh, sun.radius + jupiter.orbitRadius, jupiter.OrbitSpeed);
	orbitObjectAroundSun(saturn.mesh, sun.radius + saturn.orbitRadius, saturn.OrbitSpeed);
	orbitObjectAroundSun(saturn.ringUp, sun.radius + saturn.orbitRadius, saturn.OrbitSpeed);
	orbitObjectAroundSun(saturn.ringDown, sun.radius + saturn.orbitRadius, saturn.OrbitSpeed);

	orbitObjectAroundSun(neptune.mesh, sun.radius + neptune.orbitRadius, neptune.OrbitSpeed);
	orbitObjectAroundSun(uranus.mesh, sun.radius + uranus.orbitRadius, uranus.OrbitSpeed);

	// slow down as we approach the surface
	dPlanet = camera.position.length();

	dMoonVec.subVectors(camera.position, earth.Moon.meshMoon.position);
	dMoon = dMoonVec.length();

	if (dMoon < dPlanet) {

		d = (dMoon - radius * moonScale * 1.01);

	} else {

		d = (dPlanet - radius * 1.01);

	}

	controls.movementSpeed = 0.33 * d;
	controls.update(delta);

	composer.render(delta);
}
