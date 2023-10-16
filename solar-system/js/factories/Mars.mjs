import * as THREE from 'three';
import { CelestialBodyFactory } from './CelestialBodyFactory.mjs';
import { createOrbitLine, orbitObjectAround, orbitObjectAroundSun} from '../utils/utils.js';

class Mars {
    constructor(scene, radiusEarth, sunRadius) {
        this.radius = 0.532 * radiusEarth;
        this.orbitRadius =  227900;
        this.textureMap = '../assets/textures/planetsAndMoons/mars/Mars_Texture.jpg';
        this.textureNormalMap = '../assets/textures/planetsAndMoons/mars/Mars_Normal.png';
        this.rotationSpeed = 0.01;
        this.OrbitSpeed = 0.81 * 0.001;

        this.fobosTextureMap = '../assets/textures/planetsAndMoons/moons/Moon1_Texture.jpg'
        this.deimosTextureMap = '../assets/textures/planetsAndMoons/moons/Moon2_Texture.jpg'
        this.fobosNormalMap = '../assets/textures/planetsAndMoons/moons/Moon1_Normal.png'
        this.deimosNormalMap = '../assets/textures/planetsAndMoons/moons/Moon2_Normal.png'


        this.mesh = CelestialBodyFactory(this.radius, this.textureMap, this.textureNormalMap);

        const marsOrbit = createOrbitLine(sunRadius + this.orbitRadius, sunRadius + this.orbitRadius, 0xADFF2F, 100, 90);

        scene.add(marsOrbit);
        scene.add(this.mesh);

        this.moonsInfo = [
            { name: 'Fobos', radius: 0.15*radiusEarth, texture:this.fobosTextureMap, normalMap:this.fobosNormalMap,orbitRadius: 9378,orbitSpeed: 0.001},
            { name: 'Deimos', radius: 0.044*radiusEarth, texture:this.deimosTextureMap, normalMap:this.deimosNormalMap, orbitRadius: 23460,orbitSpeed: 0.003},
        ];

        this.moons = {};

        this.moonsInfo.forEach((moonInfo) => {
            this.moons[moonInfo.name] = CelestialBodyFactory(moonInfo.radius, moonInfo.texture, moonInfo.normalMap);

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

export { Mars };
