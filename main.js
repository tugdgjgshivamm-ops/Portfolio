// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// --- 1. Three.js Background ---
const canvasContainer = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050507, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
canvasContainer.appendChild(renderer.domElement);

// Create premium particles (subtle points) and wireframe geometry for developer aesthetic
const geometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 60;
}

geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x3b82f6, // Accent color
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);

camera.position.z = 25;

// Parallax Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Slow continuous rotation
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    // Parallax
    particlesMesh.position.x += (targetX - particlesMesh.position.x) * 0.05;
    particlesMesh.position.y += (-targetY - particlesMesh.position.y) * 0.05;
    
    // Slight camera movement
    camera.position.x += (mouseX * 0.001 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.001 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// --- 2. GSAP Animations ---

// Page Load Intro Animation
const tl = gsap.timeline();

tl.from(".navbar", { y: -30, opacity: 0, duration: 1, ease: "power3.out" })
  .from(".hero-name", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
  .from(".hero-role", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
  .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
  .from(".hero-buttons .btn", { y: 20, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }, "-=0.6");


// Scroll Animations

// Section Titles
gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });
});

// General Premium Cards (slide up)
gsap.utils.toArray('.premium-card').forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });
});

// Contact Section split slide
gsap.from(".contact-info", {
    scrollTrigger: { trigger: ".contact-wrapper", start: "top 80%" },
    x: -40, opacity: 0, duration: 1, ease: "power3.out"
});

gsap.from(".contact-form", {
    scrollTrigger: { trigger: ".contact-wrapper", start: "top 80%" },
    x: 40, opacity: 0, duration: 1, ease: "power3.out"
});


// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Handle Form Submission
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! (Placeholder)');
    e.target.reset();
});
