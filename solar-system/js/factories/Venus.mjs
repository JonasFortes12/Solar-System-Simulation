import * as THREE from 'three';
import { CelestialBodyFactory } from './CelestialBodyFactory.mjs';
import { createOrbitLine, orbitObjectAround, orbitObjectAroundSun} from '../utils/utils.js';

class Venus {
    constructor(scene, radiusEarth, sunRadius) {
        this.radius = 0.949 * radiusEarth;
        this.orbitRadius = 110000;
        this.textureMap = '../assets/textures/planetsAndMoons/venus/venus_surface.jpg';
        this.textureNormalMap = '../assets/textures/planetsAndMoons/venus/venus_normal.png';
        this.rotationSpeed = 0.01;
        this.OrbitSpeed = 1.17 * 0.001;

        this.mesh = CelestialBodyFactory(this.radius, this.textureMap, this.textureNormalMap);

        const mercuryOrbit = createOrbitLine(sunRadius + this.orbitRadius, sunRadius + this.orbitRadius, 0xFF8C00, 100, 90);

        scene.add(mercuryOrbit);
        scene.add(this.mesh);

        this.moonsInfo = [
            // { name: 'Moon1', radius: 1000, texture: this.textureMap, orbitRadius: 20000,orbitSpeed: 0.001},
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

export { Venus };
