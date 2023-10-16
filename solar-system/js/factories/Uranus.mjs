import * as THREE from 'three';
import { CelestialBodyFactory } from './CelestialBodyFactory.mjs';
import { createOrbitLine, orbitObjectAround, orbitObjectAroundSun} from '../utils/utils.js';

class Uranus {
    constructor(scene, radiusEarth, sunRadius) {
        this.radius = 4.007 * radiusEarth;
        this.orbitRadius = 2000000;
        this.textureMap = '../assets/textures/planetsAndMoons/uranus/Uranus_Texture.jpg';
        this.textureNormalMap = '../assets/textures/planetsAndMoons/uranus/Uranus_Normal.png';
        this.rotationSpeed = 0.01;
        this.OrbitSpeed = 0.00002;

        this.mirandaTextureMap = '../assets/textures/planetsAndMoons/moons/Moon1_Texture.jpg'
        this.arielTextureMap = '../assets/textures/planetsAndMoons/moons/Moon2_Texture.jpg'
        this.umbrielTextureMap = '../assets/textures/planetsAndMoons/moons/Moon3_Texture.jpg'
        this.titaniaTextureMap = '../assets/textures/planetsAndMoons/moons/Moon4_Texture.jpg'
        this.oberonTextureMap = '../assets/textures/planetsAndMoons/moons/Moon1_Texture.jpg'
        
        this.mirandaNormalMap = '../assets/textures/planetsAndMoons/moons/Moon1_Normal.jpg'
        this.arielNormalMap = '../assets/textures/planetsAndMoons/moons/Moon2_Normal.jpg'
        this.umbrielNormalMap = '../assets/textures/planetsAndMoons/moons/Moon3_Normal.jpg'
        this.titaniaNormalMap = '../assets/textures/planetsAndMoons/moons/Moon4_Normal.jpg'
        this.oberonNormalMap = '../assets/textures/planetsAndMoons/moons/Moon1_Normal.jpg'


        this.mesh = CelestialBodyFactory(this.radius, this.textureMap, this.textureNormalMap);

        const uranusOrbit = createOrbitLine(sunRadius + this.orbitRadius, sunRadius + this.orbitRadius, 0xADFF2F, 100, 90);

        scene.add(uranusOrbit);
        scene.add(this.mesh);

        this.moonsInfo = [
            // { name: 'Moon1', radius: 1000, texture: this.textureMap, orbitRadius: 20000,orbitSpeed: 0.001},
            { name: 'Miranda', radius: 0.82*radiusEarth, texture:this.mirandaTextureMap, normalMap:this.mirandaNormalMap,orbitRadius: 41390,orbitSpeed: 0.006},
            { name: 'Ariel', radius: 0.97*radiusEarth, texture:this.arielTextureMap, normalMap:this.arielNormalMap, orbitRadius: 60020,orbitSpeed: 0.004},
            { name: 'Umbriel', radius: 0.92*radiusEarth, texture:this.umbrielTextureMap, normalMap:this.umbrielNormalMap,orbitRadius: 81600,orbitSpeed: 0.003},
            { name: 'Titania', radius: 0.23*radiusEarth, texture:this.titaniaTextureMap, normalMap:this.titaniaNormalMap, orbitRadius: 100584,orbitSpeed: 0.002},
            { name: 'Oberon', radius: 0.19*radiusEarth, texture:this.oberonTextureMap, normalMap:this.oberonNormalMap, orbitRadius: 200300,orbitSpeed: 0.001}
        ];

        this.moons = {};

        this.moonsInfo.forEach((moonInfo) => {
            this.moons[moonInfo.name] = CelestialBodyFactory(moonInfo.radius, moonInfo.texture, null);

            this.mesh.add(createOrbitLine(moonInfo.orbitRadius, moonInfo.orbitRadius, 0xffffff, 100, 90));
            scene.add(this.moons[moonInfo.name]);
        });
    }

    animate() {
        const clock = new THREE.Clock();
        const delta = clock.getDelta();

        this.mesh.rotation.y += this.rotationSpeed;  

        this.moonsInfo.forEach((moonInfo) => {
            orbitObjectAround(this.mesh, this.moons[moonInfo.name], moonInfo.orbitRadius, moonInfo.orbitSpeed);
        });
    }
}

export { Uranus };
