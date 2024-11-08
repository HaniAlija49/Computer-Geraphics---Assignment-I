import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 30, 50);
controls.update();

const groundGeometry = new THREE.PlaneGeometry(65, 65);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x6b8e23, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const createBuilding = (width, height, depth, color, position, rotation = 0) => {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({ color });
    const building = new THREE.Mesh(geometry, material);
    building.position.set(...position);
    building.rotation.y = rotation;
    return building;
};

const createCircularRoad = (radius, color, position) => {
    const roadGeometry = new THREE.CircleGeometry(radius, 64);
    const roadMaterial = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.set(...position);
    return road;
};

const createRoad = (width, height, color, position, rotation = 0) => {
    const roadGeometry = new THREE.PlaneGeometry(width, height);
    const roadMaterial = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.position.set(...position);
    road.rotation.x = -Math.PI / 2;
    road.rotation.z = rotation;
    return road;
};

const building1 = createBuilding(9, 9, 18, 0xffffff, [8.25, 3, 20]);
const building2 = createBuilding(9, 9, 18, 0xffffff, [-12.75, 3, 21.5], -1);
const building3 = createBuilding(9, 9, 18, 0xffffff, [20.25, 3, -0.25], -1);
const building4 = createBuilding(9, 9, 27, 0xffffff, [-9, 3, -18.25]);

scene.add(building1, building2, building3, building4);

const mainRoad = createRoad(6, 72, 0x333333, [0, 0.01, 2.75], -1);
const circularRoad = createCircularRoad(7.5, 0x333333, [0, 0.01, 2]);
const road1 = createRoad(4.5, 27, 0x333333, [0, 0.01, 19.25]);
const road2 = createRoad(3, 21, 0x333333, [7.5, 0.01, 5.75], 1);
const road3 = createRoad(3, 12, 0x333333, [15.75, 0.01, 16.25]);
const road4 = createRoad(4.5, 30, 0x333333, [-1.5, 0.01, -17.5]);

scene.add(circularRoad, mainRoad, road1, road2, road3, road4);

const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 20, 10);
scene.add(pointLight);

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(7.5, 1, 0);
scene.add(sphere);

const animateSphere = () => {
    gsap.timeline({ repeat: -1 })
        .to(sphere.position, {
            duration: 5,
            onUpdate: function() {
                const time = this.progress() * Math.PI * 2;
                sphere.position.x = 7.5 * Math.cos(time);
                sphere.position.z = 7.5 * Math.sin(time) + 2;
            },
            ease: "linear"
        })
        .to(sphere.position, {
            duration: 3,
            x: 0,
            z: 5,
            ease: "power1.inOut"
        })
        .to(sphere.position, {
            duration: 3,
            x: 7.5,
            z: 5.75,
            ease: "power1.inOut"
        });
};

animateSphere();

const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
