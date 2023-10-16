import * as THREE from 'three';
import { CelestialBodyFactory } from './CelestialBodyFactory.mjs';
import { createOrbitLine, orbitObjectAround, orbitObjectAroundSun} from '../utils/utils.js';

class Jupiter {
    constructor(scene, radiusEarth, sunRadius) {
        this.radius = 11.2 * radiusEarth;
        this.orbitRadius =  778300;
        this.textureMap = '../assets/textures/planetsAndMoons/jupiter/Jupiter_Texture.jpg';
        this.textureNormalMap = '../assets/textures/planetsAndMoons/jupiter/Jupiter_Normal.png';
        this.rotationSpeed = 0.01;
        this.OrbitSpeed = 0.44 * 0.001;

        this.ganimedesTextureMap = '../assets/textures/planetsAndMoons/moons/Moon1_Texture.jpg'
        this.ganimedesNormalMap = '../assets/textures/planetsAndMoons/moons/Moon1_Normal.png'
        
        this.ioTextureMap = '../assets/textures/planetsAndMoons/moons/Moon2_Texture.jpg'
        this.ioNormalMap = '../assets/textures/planetsAndMoons/moons/Moon2_Normal.png'

        this.europaTextureMap = '../assets/textures/planetsAndMoons/moons/Moon3_Texture.jpg'
        this.europaNormalMap = '../assets/textures/planetsAndMoons/moons/Moon3_Normal.png'

        this.calistoTextureMap = '../assets/textures/planetsAndMoons/moons/Moon4_Texture.jpg'
        this.calistoNormalMap = '../assets/textures/planetsAndMoons/moons/Moon4_Normal.png'


        this.mesh = CelestialBodyFactory(this.radius, this.textureMap, this.textureNormalMap);

        const jupiterOrbit = createOrbitLine(sunRadius + this.orbitRadius, sunRadius + this.orbitRadius,  0xFFA500, 100, 90);

        scene.add(jupiterOrbit);
        scene.add(this.mesh);

        this.moonsInfo = [
            { name: 'Ganimedes', radius: 0.413*radiusEarth, texture:this.ganimedesTextureMap, normalMap:this.ganimedesNormalMap,orbitRadius: 152000,orbitSpeed: 0.0005},
            { name: 'Io', radius: 0.286*radiusEarth, texture:this.ioTextureMap, normalMap:this.ioNormalMap,orbitRadius: 107000,orbitSpeed: 0.001},
            { name: 'Europa', radius: 0.245*radiusEarth, texture:this.europaTextureMap, normalMap:this.europaNormalMap, orbitRadius: 122000,orbitSpeed: 0.0008},
            { name: 'Calisto', radius: 0.378*radiusEarth, texture:this.calistoTextureMap, normalMap:this.calistoNormalMap, orbitRadius: 188270,orbitSpeed: 0.0003},
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

export { Jupiter };
