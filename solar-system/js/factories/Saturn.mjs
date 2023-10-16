import * as THREE from 'three';
import { CelestialBodyFactory } from './CelestialBodyFactory.mjs';
import { createOrbitLine, orbitObjectAround, orbitObjectAroundSun } from '../utils/utils.js';

class Saturn {
    constructor(scene, radiusEarth, sunRadius) {
        this.radius = 9.4 * radiusEarth;
        this.orbitRadius = 1400000;
        this.textureMap = '../assets/textures/planetsAndMoons/saturn/Saturn_Texture.jpg';
        this.textureNormalMap = '../assets/textures/planetsAndMoons/saturn/Saturn_Normal.png';
        this.rotationSpeed = 0.01;
        this.OrbitSpeed = 0.33 * 0.001;
        this.RingAngle = -0.226893;

        // Cria um material com textura transparente
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('../assets/textures/planetsAndMoons/saturn/saturn_ring.png');
        const textureNormal = textureLoader.load('../assets/textures/planetsAndMoons/saturn/saturn_ring_normal_.png');

        const material = new THREE.MeshPhongMaterial({
            map: texture,
            transparent: true,
            normalMap:textureNormal
        });      
        material.map.colorSpace = THREE.SRGBColorSpace;

        // Cria uma geometria de círculo
        const radius = 6500;
        const segments = 100;
        const circleGeometry = new THREE.CircleGeometry(radius, segments);

        // Cria uma malha com a geometria e o material
        this.ringUp = new THREE.Mesh(circleGeometry, material);
        this.ringUp.scale.set(20, 20, 20);
        this.ringUp.rotation.x = Math.PI / -2; // Gire 90 graus no eixo Z
        this.ringUp.rotation.x -= this.RingAngle;
        this.ringDown = new THREE.Mesh(circleGeometry, material);
        this.ringDown.scale.set(20, 20, 20);
        this.ringDown.rotation.x = Math.PI / 2; // Gire 90 graus no eixo Z
        this.ringDown.rotation.x -= this.RingAngle;

        this.mesh = CelestialBodyFactory(this.radius, this.textureMap, this.textureNormalMap);

        // this.mesh.add(this.ringUp);

        const mercuryOrbit = createOrbitLine(sunRadius + this.orbitRadius, sunRadius + this.orbitRadius, 0xffc000, 100, 90);
        
        scene.add(this.ringUp)
        scene.add(this.ringDown)
        scene.add(mercuryOrbit);
        scene.add(this.mesh);

        this.moonsInfo = [
            { name: 'Titã', radius: 3000, texture: "../assets/textures/planetsAndMoons/moons/Moon1_Texture.jpg", orbitRadius: 280000,orbitSpeed: 0.001},
            { name: 'Encélado', radius: 2000, texture: "../assets/textures/planetsAndMoons/moons/Moon3_Texture.jpg", orbitRadius: 150000,orbitSpeed: 0.005},
            { name: 'Reia', radius: 1500, texture: "../assets/textures/planetsAndMoons/moons/Moon2_Texture.jpg", orbitRadius: 180000,orbitSpeed: 0.002},
            { name: 'Dione', radius: 2300, texture: "../assets/textures/planetsAndMoons/moons/Moon4_Texture.jpg", orbitRadius: 200000,orbitSpeed: 0.004},
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

export { Saturn };
