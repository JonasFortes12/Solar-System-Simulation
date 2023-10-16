import * as THREE from 'three';
import { CelestialBodyFactory } from './CelestialBodyFactory.mjs';
import { createOrbitLine, orbitObjectAround, orbitObjectAroundSun} from '../utils/utils.js';

class Neptune {
    constructor(scene, radiusEarth, sunRadius) {
        this.radius = 3.883 * radiusEarth;
        this.orbitRadius =   2600000;
        this.textureMap = '../assets/textures/planetsAndMoons/neptune/Neptune_Texture.jpg';
        this.textureNormalMap = '../assets/textures/planetsAndMoons/neptune/Neptune_Normal.png';
        this.rotationSpeed = 0.01;
        this.OrbitSpeed = 0.00001;

        this.tritaoTextureMap = '../assets/textures/planetsAndMoons/moons/Moon1_Texture.jpg'
        this.tritaoNormalMap = '../assets/textures/planetsAndMoons/moons/Moon1_Normal.png'
        
        this.proteusTextureMap = '../assets/textures/planetsAndMoons/moons/Moon2_Texture.jpg'
        this.proteusNormalMap = '../assets/textures/planetsAndMoons/moons/Moon2_Normal.png'

        this.nereidaTextureMap = '../assets/textures/planetsAndMoons/moons/Moon3_Texture.jpg'
        this.nereidaNormalMap = '../assets/textures/planetsAndMoons/moons/Moon3_Normal.png'



        this.mesh = CelestialBodyFactory(this.radius, this.textureMap, this.textureNormalMap);

        const neptuneOrbit = createOrbitLine(sunRadius + this.orbitRadius, sunRadius + this.orbitRadius,  0xFFA89A, 100, 90);

        scene.add(neptuneOrbit);
        scene.add(this.mesh);

        this.moonsInfo = [
            { name: 'Tritão', radius: 0.212*radiusEarth, texture:this.tritaoTextureMap, normalMap:this.tritaoNormalMap,orbitRadius: 154760,orbitSpeed: 0.0003},
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

export { Neptune };
