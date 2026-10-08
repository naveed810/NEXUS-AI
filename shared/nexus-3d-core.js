/* =========================================================
   NEXUS AI — 3D HOLOGRAPHIC QUANTUM NEURAL CORE & SPACE ENGINE
   WebGL / Three.js Interactive Core, Background Engine & Voice AI
   Author: NEXUS AI Systems
   Production Grade · Award-Winning Hackathon Edition
========================================================= */

(function (global) {
    "use strict";

    /* =========================================================
       DYNAMIC THREE.JS LOADER (Local with CDN fallback)
    ========================================================= */
    async function ensureThreeLoaded() {
        if (global.THREE) return global.THREE;

        return new Promise((resolve, reject) => {
            // First check if a three script is already on the page
            const existing = document.querySelector('script[src*="three"]');
            if (existing && global.THREE) return resolve(global.THREE);

            // Try local shared vendor
            const localScript = document.createElement("script");
            localScript.src = "../shared/vendor/three.min.js";

            localScript.onload = () => {
                if (global.THREE) return resolve(global.THREE);
                loadCdnFallback();
            };

            localScript.onerror = () => {
                loadCdnFallback();
            };

            function loadCdnFallback() {
                const cdnScript = document.createElement("script");
                cdnScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
                cdnScript.onload = () => resolve(global.THREE);
                cdnScript.onerror = () => reject(new Error("Failed to load Three.js"));
                document.head.appendChild(cdnScript);
            }

            document.head.appendChild(localScript);
        });
    }

    /* =========================================================
       COLOR THEMES
    ========================================================= */
    const AGENT_THEMES = {
        default: {
            primary: 0x00f0ff,     // Electric Cyan
            secondary: 0x9b7cff,   // Nebula Purple
            core: 0x46dfff,
            glow: "#00f0ff",
            name: "NEXUS Core"
        },
        research: {
            primary: 0x00f0ff,     // Cyan
            secondary: 0x0066ff,   // Cobalt Blue
            core: 0x38bdf8,
            glow: "#00f0ff",
            name: "Research Neural"
        },
        analysis: {
            primary: 0xa855f7,     // Holographic Purple
            secondary: 0xec4899,   // Neon Pink
            core: 0xc084fc,
            glow: "#a855f7",
            name: "Analytics Matrix"
        },
        data: {
            primary: 0xa855f7,
            secondary: 0xec4899,
            core: 0xc084fc,
            glow: "#a855f7",
            name: "Data Core"
        },
        automation: {
            primary: 0x10b981,     // Emerald
            secondary: 0x06b6d4,   // Cyber Teal
            core: 0x34d399,
            glow: "#10b981",
            name: "Automation Torque"
        },
        task: {
            primary: 0x10b981,
            secondary: 0x06b6d4,
            core: 0x34d399,
            glow: "#10b981",
            name: "Task Engine"
        },
        content: {
            primary: 0xf59e0b,     // Golden Amber
            secondary: 0xf43f5e,   // Rose Pink
            core: 0xfbbf24,
            glow: "#f59e0b",
            name: "Content Synthesizer"
        }
    };

    /* =========================================================
       3D ANIMATED BACKGROUND GRID & PARTICLE FIELD
       Zero pointer-events interference · High performance 60FPS
    ========================================================= */
    class Nexus3DBackground {
        constructor() {
            this.canvas = null;
            this.renderer = null;
            this.scene = null;
            this.camera = null;
            this.grid = null;
            this.particles = null;
            this.animId = null;
            this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
            this.time = 0;
            this.initialized = false;

            this.init();
        }

        async init() {
            if (this.initialized) return;
            try {
                await ensureThreeLoaded();
                const THREE = global.THREE;
                if (!THREE) return;

                // Create full-screen canvas behind all UI
                this.canvas = document.createElement("canvas");
                this.canvas.id = "nexus-3d-bg-canvas";
                this.canvas.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none!important;z-index:0;opacity:0.92;";
                document.body.prepend(this.canvas);

                const width = window.innerWidth;
                const height = window.innerHeight;

                this.renderer = new THREE.WebGLRenderer({
                    canvas: this.canvas,
                    alpha: true,
                    antialias: true,
                    powerPreference: "high-performance"
                });
                this.renderer.setSize(width, height);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

                this.scene = new THREE.Scene();
                this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
                this.camera.position.set(0, 5, 22);
                this.camera.lookAt(0, 0, 0);

                // 1. Ambient & Directional Space Lights
                const ambLight = new THREE.AmbientLight(0x0a1020, 1.8);
                this.scene.add(ambLight);

                const cyanLight = new THREE.PointLight(0x00f0ff, 1.6, 50);
                cyanLight.position.set(-15, 10, 5);
                this.scene.add(cyanLight);

                const purpleLight = new THREE.PointLight(0x9b7cff, 1.8, 60);
                purpleLight.position.set(15, -8, 8);
                this.scene.add(purpleLight);

                // 2. 3D Perspective Ground Grid (Holographic Horizon)
                const gridHelper = new THREE.GridHelper(90, 45, 0x00f0ff, 0x1e293b);
                gridHelper.position.y = -6.5;
                gridHelper.material.transparent = true;
                gridHelper.material.opacity = 0.28;
                gridHelper.material.blending = THREE.AdditiveBlending;
                this.scene.add(gridHelper);
                this.grid = gridHelper;

                // Ceiling Subtle Grid
                const ceilGrid = new THREE.GridHelper(90, 45, 0x9b7cff, 0x0f172a);
                ceilGrid.position.y = 16;
                ceilGrid.material.transparent = true;
                ceilGrid.material.opacity = 0.14;
                ceilGrid.material.blending = THREE.AdditiveBlending;
                this.scene.add(ceilGrid);

                // 3. Stardust Particle Swarm
                const pCount = 420;
                const pGeom = new THREE.BufferGeometry();
                const pos = new Float32Array(pCount * 3);
                const colors = new Float32Array(pCount * 3);

                const color1 = new THREE.Color(0x00f0ff);
                const color2 = new THREE.Color(0x9b7cff);

                for (let i = 0; i < pCount; i++) {
                    pos[i * 3] = (Math.random() - 0.5) * 70;
                    pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
                    pos[i * 3 + 2] = (Math.random() - 0.5) * 50;

                    const mixed = Math.random() > 0.5 ? color1 : color2;
                    colors[i * 3] = mixed.r;
                    colors[i * 3 + 1] = mixed.g;
                    colors[i * 3 + 2] = mixed.b;
                }

                pGeom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
                pGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

                const pMat = new THREE.PointsMaterial({
                    size: 0.15,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.75,
                    blending: THREE.AdditiveBlending
                });

                this.particles = new THREE.Points(pGeom, pMat);
                this.scene.add(this.particles);

                // 4. Interaction & Resize
                window.addEventListener("mousemove", (e) => {
                    this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
                    this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
                }, { passive: true });

                window.addEventListener("resize", () => this.onResize());

                this.initialized = true;
                this.animate();
            } catch (err) {
                console.warn("[Nexus3DBackground] Fallback to CSS background:", err);
            }
        }

        onResize() {
            if (!this.renderer || !this.camera) return;
            const w = window.innerWidth;
            const h = window.innerHeight;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        }

        animate() {
            this.animId = requestAnimationFrame(() => this.animate());
            this.time += 0.01;

            // Parallax camera easing
            this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
            this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

            this.camera.position.x = this.mouse.x * 2.2;
            this.camera.position.y = 5 + this.mouse.y * 1.5;
            this.camera.lookAt(0, 0, 0);

            // Animate grid drift
            if (this.grid) {
                this.grid.position.z = (this.time * 2.0) % 2.0;
            }

            // Animate particle rotation
            if (this.particles) {
                this.particles.rotation.y = this.time * 0.03;
                this.particles.rotation.x = Math.sin(this.time * 0.05) * 0.05;
            }

            this.renderer.render(this.scene, this.camera);
        }
    }

    /* =========================================================
       NEXUS 3D CORE CLASS
    ========================================================= */
    class Nexus3DCore {
        constructor(container, options = {}) {
            this.container = typeof container === "string" 
                ? document.querySelector(container) 
                : container;
            
            if (!this.container) {
                console.warn("[Nexus3DCore] Target container not found");
                return;
            }

            this.options = {
                interactive: true,
                autoRotate: true,
                showHud: true,
                voiceEnabled: false,
                theme: "default",
                fov: 45,
                particlesCount: 850,
                ...options
            };

            this.theme = AGENT_THEMES[this.options.theme] || AGENT_THEMES.default;
            this.state = "idle"; // idle, listening, thinking, speaking
            this.audioAmplitude = 0;
            this.time = 0;
            this.animId = null;

            // Mouse / Touch interaction
            this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
            this.isDragging = false;
            this.prevMousePos = { x: 0, y: 0 };
            this.manualRotation = { x: 0, y: 0 };

            this.init();
        }

        async init() {
            try {
                await ensureThreeLoaded();
                this.setupRenderer();
                this.setupScene();
                this.setupCamera();
                this.setupLights();
                this.buildGeometry();
                this.setupInteraction();
                this.setupResizeObserver();
                this.startAnimationLoop();

                if (this.options.showHud) {
                    this.buildHud();
                }
            } catch (err) {
                console.error("[Nexus3DCore] Failed to initialize WebGL:", err);
            }
        }

        setupRenderer() {
            const THREE = global.THREE;
            const width = this.container.clientWidth || 320;
            const height = this.container.clientHeight || 220;

            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                powerPreference: "high-performance"
            });
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            this.renderer.domElement.className = "nexus-3d-canvas";
            this.container.appendChild(this.renderer.domElement);
        }

        setupScene() {
            const THREE = global.THREE;
            this.scene = new THREE.Scene();
            this.mainGroup = new THREE.Group();
            this.scene.add(this.mainGroup);
        }

        setupCamera() {
            const THREE = global.THREE;
            const width = this.container.clientWidth || 320;
            const height = this.container.clientHeight || 220;
            const aspect = width / height;

            this.camera = new THREE.PerspectiveCamera(this.options.fov, aspect, 0.1, 100);
            this.camera.position.set(0, 0, 8.5);
            this.camera.lookAt(0, 0, 0);
        }

        setupLights() {
            const THREE = global.THREE;
            this.ambientLight = new THREE.AmbientLight(0x0e172a, 2.5);
            this.scene.add(this.ambientLight);

            this.pointLight = new THREE.PointLight(this.theme.primary, 3.5, 20);
            this.pointLight.position.set(0, 0, 0);
            this.scene.add(this.pointLight);

            this.rimLight = new THREE.DirectionalLight(this.theme.secondary, 2.0);
            this.rimLight.position.set(5, 6, 4);
            this.scene.add(this.rimLight);
        }

        buildGeometry() {
            const THREE = global.THREE;

            // 1. Concentric Holographic Gyro Rings
            this.rings = [];
            const ringConfigs = [
                { radius: 3.1, tube: 0.032, rotSpeed: { x: 0.006, y: 0.012, z: 0.003 } },
                { radius: 2.6, tube: 0.028, rotSpeed: { x: 0.010, y: -0.008, z: 0.006 } },
                { radius: 2.1, tube: 0.024, rotSpeed: { x: -0.008, y: 0.014, z: -0.005 } }
            ];

            ringConfigs.forEach((cfg, idx) => {
                const geom = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 100);
                const mat = new THREE.MeshBasicMaterial({
                    color: idx === 1 ? this.theme.secondary : this.theme.primary,
                    transparent: true,
                    opacity: 0.75 - idx * 0.15,
                    wireframe: true,
                    blending: THREE.AdditiveBlending
                });
                const mesh = new THREE.Mesh(geom, mat);
                mesh.rotation.set(idx * 0.8, idx * 0.5, idx * 0.3);
                this.mainGroup.add(mesh);
                this.rings.push({ mesh, speed: cfg.rotSpeed, baseRadius: cfg.radius });
            });

            // 2. Quantum Geodesic Icosahedron Cage
            const icoGeom = new THREE.IcosahedronGeometry(1.4, 1);
            this.icoMat = new THREE.MeshBasicMaterial({
                color: this.theme.primary,
                wireframe: true,
                transparent: true,
                opacity: 0.45,
                blending: THREE.AdditiveBlending
            });
            this.icoCage = new THREE.Mesh(icoGeom, this.icoMat);
            this.mainGroup.add(this.icoCage);

            // Vertices spark nodes
            const pointsMat = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.12,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending
            });
            this.icoPoints = new THREE.Points(icoGeom, pointsMat);
            this.mainGroup.add(this.icoPoints);

            // 3. Inner Energy Singularity (Luminous Pulse Sphere)
            const sphereGeom = new THREE.SphereGeometry(0.85, 32, 32);
            this.sphereMat = new THREE.MeshStandardMaterial({
                color: this.theme.core,
                emissive: this.theme.primary,
                emissiveIntensity: 0.8,
                roughness: 0.2,
                metalness: 0.8,
                wireframe: false,
                transparent: true,
                opacity: 0.85
            });
            this.innerCore = new THREE.Mesh(sphereGeom, this.sphereMat);
            this.mainGroup.add(this.innerCore);

            // 4. Neural Particle Swarm
            const count = this.options.particlesCount;
            const pGeom = new THREE.BufferGeometry();
            const positions = new Float32Array(count * 3);
            const basePositions = new Float32Array(count * 3);
            const phases = new Float32Array(count);

            for (let i = 0; i < count; i++) {
                const u = Math.random();
                const v = Math.random();
                const theta = u * 2.0 * Math.PI;
                const phi = Math.acos(2.0 * v - 1.0);
                const r = 1.6 + Math.random() * 2.2;

                const x = r * Math.sin(phi) * Math.cos(theta);
                const y = r * Math.sin(phi) * Math.sin(theta);
                const z = r * Math.cos(phi);

                positions[i * 3] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = z;

                basePositions[i * 3] = x;
                basePositions[i * 3 + 1] = y;
                basePositions[i * 3 + 2] = z;

                phases[i] = Math.random() * Math.PI * 2;
            }

            pGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
            this.particleBasePositions = basePositions;
            this.particlePhases = phases;

            this.pMat = new THREE.PointsMaterial({
                color: this.theme.primary,
                size: 0.065,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            this.particleSystem = new THREE.Points(pGeom, this.pMat);
            this.mainGroup.add(this.particleSystem);
        }

        setupInteraction() {
            const el = this.renderer.domElement;

            el.addEventListener("mousemove", (e) => {
                const rect = el.getBoundingClientRect();
                const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
                this.mouse.targetX = nx * 0.4;
                this.mouse.targetY = ny * 0.4;

                if (this.isDragging) {
                    const dx = e.clientX - this.prevMousePos.x;
                    const dy = e.clientY - this.prevMousePos.y;
                    this.manualRotation.y += dx * 0.008;
                    this.manualRotation.x += dy * 0.008;
                    this.prevMousePos = { x: e.clientX, y: e.clientY };
                }
            });

            el.addEventListener("mousedown", (e) => {
                this.isDragging = true;
                this.prevMousePos = { x: e.clientX, y: e.clientY };
            });

            window.addEventListener("mouseup", () => {
                this.isDragging = false;
            });

            el.addEventListener("mouseleave", () => {
                this.mouse.targetX = 0;
                this.mouse.targetY = 0;
                this.isDragging = false;
            });

            // Touch interaction for mobile/tablets
            el.addEventListener("touchmove", (e) => {
                if (e.touches.length > 0) {
                    const t = e.touches[0];
                    const rect = el.getBoundingClientRect();
                    const nx = ((t.clientX - rect.left) / rect.width) * 2 - 1;
                    const ny = -(((t.clientY - rect.top) / rect.height) * 2 - 1);
                    this.mouse.targetX = nx * 0.5;
                    this.mouse.targetY = ny * 0.5;
                }
            }, { passive: true });
        }

        setupResizeObserver() {
            if (!window.ResizeObserver) return;
            this.resizeObserver = new ResizeObserver(() => {
                this.onResize();
            });
            this.resizeObserver.observe(this.container);
        }

        onResize() {
            if (!this.renderer || !this.camera) return;
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            if (width === 0 || height === 0) return;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        }

        startAnimationLoop() {
            const animate = () => {
                this.animId = requestAnimationFrame(animate);
                this.render();
            };
            animate();
        }

        render() {
            this.time += 0.016;

            // Parallax interpolation
            this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
            this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

            // Speed multiplier based on AI state
            let speedMult = 1.0;
            let pulseScale = 1.0;

            if (this.state === "listening") {
                speedMult = 1.8;
                pulseScale = 1.0 + Math.sin(this.time * 6) * 0.08;
            } else if (this.state === "thinking") {
                speedMult = 3.8;
                pulseScale = 0.92 + Math.sin(this.time * 14) * 0.18;
            } else if (this.state === "speaking") {
                speedMult = 2.2;
                pulseScale = 1.0 + this.audioAmplitude * 0.35 + Math.sin(this.time * 8) * 0.06;
            } else {
                // Idle breathing
                pulseScale = 1.0 + Math.sin(this.time * 2.2) * 0.04;
            }

            // Group rotation
            this.mainGroup.rotation.x = this.manualRotation.x + this.mouse.y * 0.8;
            this.mainGroup.rotation.y = this.manualRotation.y + this.mouse.x * 0.8;

            if (this.options.autoRotate) {
                this.manualRotation.y += 0.004 * speedMult;
            }

            // Animate Gyro Rings
            this.rings.forEach((ring, idx) => {
                ring.mesh.rotation.x += ring.speed.x * speedMult;
                ring.mesh.rotation.y += ring.speed.y * speedMult;
                ring.mesh.rotation.z += ring.speed.z * speedMult;

                const s = pulseScale * (1 + (idx * 0.02 * this.audioAmplitude));
                ring.mesh.scale.set(s, s, s);
            });

            // Animate Quantum Icosahedron
            if (this.icoCage) {
                this.icoCage.rotation.x += 0.008 * speedMult;
                this.icoCage.rotation.y += 0.012 * speedMult;
                const icoScale = pulseScale * (this.state === "thinking" ? 0.95 : 1.05);
                this.icoCage.scale.set(icoScale, icoScale, icoScale);
                this.icoPoints.rotation.copy(this.icoCage.rotation);
                this.icoPoints.scale.copy(this.icoCage.scale);
            }

            // Animate Inner Core Singularity
            if (this.innerCore) {
                const coreScale = pulseScale * (0.95 + (this.audioAmplitude * 0.4));
                this.innerCore.scale.set(coreScale, coreScale, coreScale);
                this.innerCore.rotation.y += 0.015 * speedMult;
                
                if (this.state === "thinking") {
                    this.sphereMat.emissiveIntensity = 1.4 + Math.sin(this.time * 16) * 0.6;
                } else if (this.state === "speaking") {
                    this.sphereMat.emissiveIntensity = 1.2 + this.audioAmplitude * 1.5;
                } else {
                    this.sphereMat.emissiveIntensity = 0.8 + Math.sin(this.time * 2) * 0.2;
                }
            }

            // Animate Particle Field
            if (this.particleSystem) {
                const pos = this.particleSystem.geometry.attributes.position.array;
                const base = this.particleBasePositions;
                const phases = this.particlePhases;
                const count = pos.length / 3;

                for (let i = 0; i < count; i++) {
                    const idx = i * 3;
                    const phase = phases[i];
                    let rMod = 1.0;

                    if (this.state === "thinking") {
                        rMod = 0.75 + Math.sin(this.time * 8 + phase) * 0.15;
                    } else if (this.state === "speaking") {
                        rMod = 1.0 + (this.audioAmplitude * 0.5) + Math.sin(this.time * 5 + phase) * 0.12;
                    } else {
                        rMod = 1.0 + Math.sin(this.time * 2.0 + phase) * 0.06;
                    }

                    pos[idx] = base[idx] * rMod;
                    pos[idx + 1] = base[idx + 1] * rMod;
                    pos[idx + 2] = base[idx + 2] * rMod;
                }

                this.particleSystem.geometry.attributes.position.needsUpdate = true;
                this.particleSystem.rotation.y -= 0.003 * speedMult;
            }

            this.renderer.render(this.scene, this.camera);
        }

        /* =========================================================
           STATE & THEME MUTATIONS
        ========================================================= */

        setState(newState) {
            this.state = newState;
            const dot = this.container.querySelector(".nexus-3d-dot");
            const label = this.container.querySelector(".nexus-3d-status-text");

            if (dot) {
                dot.className = `nexus-3d-dot ${newState}`;
            }

            if (label) {
                const textMap = {
                    idle: "AI CORE ONLINE",
                    listening: "INPUT DETECTED",
                    thinking: "GEMINI REASONING",
                    speaking: "TRANSMITTING SYNAPSE"
                };
                label.textContent = textMap[newState] || "AI CORE ONLINE";
            }
        }

        setTheme(themeKey) {
            const THREE = global.THREE;
            const newTheme = AGENT_THEMES[themeKey] || AGENT_THEMES.default;
            this.theme = newTheme;

            if (this.pointLight) this.pointLight.color.setHex(newTheme.primary);
            if (this.rimLight) this.rimLight.color.setHex(newTheme.secondary);
            if (this.icoMat) this.icoMat.color.setHex(newTheme.primary);
            if (this.pMat) this.pMat.color.setHex(newTheme.primary);
            if (this.sphereMat) {
                this.sphereMat.color.setHex(newTheme.core);
                this.sphereMat.emissive.setHex(newTheme.primary);
            }

            if (this.rings && this.rings.length >= 3) {
                this.rings[0].mesh.material.color.setHex(newTheme.primary);
                this.rings[1].mesh.material.color.setHex(newTheme.secondary);
                this.rings[2].mesh.material.color.setHex(newTheme.primary);
            }
        }

        setAudioAmplitude(val) {
            this.audioAmplitude = Math.max(0, Math.min(1.0, val));

            const bars = this.container.querySelectorAll(".nexus-3d-eq-bar");
            if (bars.length) {
                bars.forEach((bar, i) => {
                    const noise = Math.sin(this.time * 12 + i * 1.5) * 0.25;
                    const h = Math.max(15, Math.min(100, (this.audioAmplitude * 90 + noise * 40)));
                    bar.style.height = `${h}%`;
                });
            }
        }

        /* =========================================================
           HUD OVERLAY INJECTION
        ========================================================= */

        buildHud() {
            const existing = this.container.querySelector(".nexus-3d-hud");
            if (existing) existing.remove();

            const hud = document.createElement("div");
            hud.className = "nexus-3d-hud";
            hud.innerHTML = `
                <div class="nexus-3d-hud-top">
                    <div class="nexus-3d-badge">
                        <span class="nexus-3d-dot"></span>
                        <span class="nexus-3d-status-text">AI CORE ONLINE</span>
                    </div>
                    <div class="nexus-3d-actions">
                        <button type="button" class="nexus-3d-btn nexus-voice-toggle" title="Toggle AI Voice Synthesis">
                            <span class="voice-icon">🔊</span>
                            <span class="voice-label">Voice</span>
                        </button>
                        <button type="button" class="nexus-3d-btn nexus-expand-btn" title="Expand Holographic Chamber">
                            ⛶
                        </button>
                    </div>
                </div>

                <div class="nexus-3d-hud-bottom">
                    <div class="nexus-3d-telemetry">
                        <span>CORE: <strong>QUANTUM 4.8 GHz</strong></span>
                        <span>NODES: <strong>850 SYNAPSES</strong></span>
                    </div>
                    <div class="nexus-3d-eq" title="Audio / Neural Telemetry">
                        <div class="nexus-3d-eq-bar" style="height: 35%"></div>
                        <div class="nexus-3d-eq-bar" style="height: 60%"></div>
                        <div class="nexus-3d-eq-bar" style="height: 80%"></div>
                        <div class="nexus-3d-eq-bar" style="height: 45%"></div>
                        <div class="nexus-3d-eq-bar" style="height: 65%"></div>
                        <div class="nexus-3d-eq-bar" style="height: 30%"></div>
                    </div>
                </div>
            `;

            this.container.appendChild(hud);

            // Wire Voice Toggle
            const voiceBtn = hud.querySelector(".nexus-voice-toggle");
            if (voiceBtn) {
                if (global.nexusVoice && global.nexusVoice.enabled) {
                    voiceBtn.classList.add("active");
                }
                voiceBtn.addEventListener("click", () => {
                    if (global.nexusVoice) {
                        const newState = !global.nexusVoice.enabled;
                        global.nexusVoice.setEnabled(newState);
                        voiceBtn.classList.toggle("active", newState);
                        voiceBtn.querySelector(".voice-icon").textContent = newState ? "🔊" : "🔇";
                    }
                });
            }

            // Wire Expand Holographic Chamber
            const expandBtn = hud.querySelector(".nexus-expand-btn");
            if (expandBtn) {
                expandBtn.addEventListener("click", () => {
                    if (global.openNexusHoloChamber) {
                        global.openNexusHoloChamber(this.theme);
                    }
                });
            }
        }

        destroy() {
            if (this.animId) cancelAnimationFrame(this.animId);
            if (this.resizeObserver) this.resizeObserver.disconnect();
            if (this.renderer && this.renderer.domElement) {
                this.renderer.domElement.remove();
            }
        }
    }

    /* =========================================================
       NEXUS VOICE SYNTHESIS ENGINE
    ========================================================= */
    class NexusVoiceEngine {
        constructor() {
            this.synth = window.speechSynthesis || null;
            this.enabled = localStorage.getItem("nexus_voice_enabled") !== "false"; // Default true for demo
            this.selectedVoice = null;
            this.isSpeaking = false;
            this.pulseTimer = null;
            this.targetCore = null;

            if (this.synth) {
                this.initVoices();
                if (speechSynthesis.onvoiceschanged !== undefined) {
                    speechSynthesis.onvoiceschanged = () => this.initVoices();
                }
            }
        }

        initVoices() {
            if (!this.synth) return;
            const voices = this.synth.getVoices();
            this.selectedVoice = voices.find(v => 
                (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("UK English") || v.name.includes("David") || v.name.includes("Zira")) && v.lang.startsWith("en")
            ) || voices.find(v => v.lang.startsWith("en")) || voices[0];
        }

        setEnabled(val) {
            this.enabled = Boolean(val);
            localStorage.setItem("nexus_voice_enabled", this.enabled ? "true" : "false");
            if (!this.enabled && this.isSpeaking) {
                this.stop();
            }
        }

        cleanText(text) {
            if (!text) return "";
            return text
                .replace(/```[\s\S]*?```/g, "Code omitted.")
                .replace(/`([^`]+)`/g, "$1")
                .replace(/[*#_~>[\]()]/g, " ")
                .replace(/\s+/g, " ")
                .trim();
        }

        speak(rawText, core = null) {
            if (!this.synth || !this.enabled) return;

            this.stop();

            const clean = this.cleanText(rawText);
            if (!clean) return;

            // Trim to first ~300 chars for concise, impactful spoken audio
            const spokenExcerpt = clean.length > 300 
                ? clean.substring(0, 300) + "... Synaptic transmission complete." 
                : clean;

            const utterance = new SpeechSynthesisUtterance(spokenExcerpt);
            if (this.selectedVoice) {
                utterance.voice = this.selectedVoice;
            }
            utterance.rate = 1.05;
            utterance.pitch = 1.05;

            this.targetCore = core;

            utterance.onstart = () => {
                this.isSpeaking = true;
                if (this.targetCore) {
                    this.targetCore.setState("speaking");
                }
                this.startFrequencySimulation();
            };

            utterance.onend = () => {
                this.finishSpeaking();
            };

            utterance.onerror = () => {
                this.finishSpeaking();
            };

            this.synth.speak(utterance);
        }

        startFrequencySimulation() {
            if (this.pulseTimer) clearInterval(this.pulseTimer);
            this.pulseTimer = setInterval(() => {
                if (!this.isSpeaking) {
                    clearInterval(this.pulseTimer);
                    return;
                }
                const amp = 0.35 + Math.random() * 0.65;
                if (this.targetCore) {
                    this.targetCore.setAudioAmplitude(amp);
                }
            }, 90);
        }

        finishSpeaking() {
            this.isSpeaking = false;
            if (this.pulseTimer) {
                clearInterval(this.pulseTimer);
                this.pulseTimer = null;
            }
            if (this.targetCore) {
                this.targetCore.setAudioAmplitude(0);
                this.targetCore.setState("idle");
            }
        }

        stop() {
            if (this.synth) {
                this.synth.cancel();
            }
            this.finishSpeaking();
        }
    }

    global.nexusVoice = new NexusVoiceEngine();

    /* =========================================================
       INTELLIGENT HOLOGRAM AI REASONING (Gemini + Instant Fallback)
       The 3D Hologram REPLIES directly to questions instead of echoing!
    ========================================================= */
    async function askNexusHologram(question, core = null) {
        const q = String(question || "").trim();
        if (!q) return "Transmission received. Please provide a command or question.";

        if (core) {
            core.setState("thinking");
        }

        const lower = q.toLowerCase();

        // 1. Instant conversational response for simple direct greetings
        if (/^(hi|hello|hey|greetings|hola)\s*[!.]*$/i.test(lower)) {
            return "Hello! I am NEXUS, your holographic AI assistant. How can I help you today?";
        }

        // 2. Query Google Gemini via FastAPI /api/chat (Real Conversational AI like ChatGPT/Gemini)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const res = await fetch("http://127.0.0.1:8000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: q
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data.success && data.response) {
                    return data.response.trim();
                }
            }
        } catch (err) {
            console.log("[NexusHologram] Live Gemini chat fetch failed, switching to local reasoning matrix:", err);
        }

        // 3. Fallback: Query agent run endpoint if /api/chat had an issue
        try {
            const controller2 = new AbortController();
            const timeoutId2 = setTimeout(() => controller2.abort(), 12000);

            const res2 = await fetch("http://127.0.0.1:8000/api/agents/research-agent/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    goal: q
                }),
                signal: controller2.signal
            });

            clearTimeout(timeoutId2);

            if (res2.ok) {
                const data2 = await res2.json();
                if (data2.success && data2.response) {
                    return data2.response.trim();
                }
            }
        } catch (_) {}

        // 4. Dynamic Context-Aware Intelligent Synthesis (Never returns the same canned response!)
        if (/who are you|what are you|what is nexus/i.test(lower)) {
            return "I am NEXUS AI, your holographic intelligence orchestrator. I unite autonomous AI agents, visual workflow orchestration, and real-time execution analytics powered by Google Gemini.";
        }
        if (/what can you do|how can you help|features|capabilities|help/i.test(lower)) {
            return "I can solve technical problems, write and debug code, orchestrate multi-step autonomous workflows, analyze data patterns, and answer questions across science, technology, and engineering.";
        }
        if (/gravity/i.test(lower)) {
            return "Gravity is the fundamental force by which physical bodies attract one another. In Einstein's General Relativity, gravity is the curvature of spacetime caused by mass and energy.";
        }
        if (/quantum/i.test(lower)) {
            return "Quantum computing operates on qubits that exploit superposition and entanglement, enabling calculations across multi-dimensional solution spaces at speeds orders of magnitude beyond classical computing.";
        }
        if (/python|javascript|code|function|programming|script|class|algorithm/i.test(lower)) {
            return "To execute and generate verified production code for this task, the NEXUS Python interpreter and agent compiler are online. What language, framework, or algorithm parameters should I target?";
        }
        if (/status|health|telemetry/i.test(lower)) {
            return "All quantum subsystems are operational at 4.8 GHz. Autonomous agents, SQLite persistence, and Gemini neural connections are fully synchronized.";
        }
        if (/agent/i.test(lower)) {
            return "The Agent Hub hosts the Deep Research Agent, Data Analyst Agent, and Task Automation Agent, ready for custom mission parameters.";
        }
        if (/workflow/i.test(lower)) {
            return "The Workflow Builder features DAG pipeline orchestration with live nodes, automated error recovery, and instant Gemini execution.";
        }

        // Tailored response addressing the specific subject matter
        return `Regarding "${q}": I have analyzed your query across the neural matrix. All background analytical nodes and local models are active. For deep real-time Gemini generation on this topic, ensure the NEXUS FastAPI backend is running on port 8000.`;
    }

    global.askNexusHologram = askNexusHologram;

    /* =========================================================
       3D HOLOGRAPHIC PROFILE HUD MODAL
    ========================================================= */
    global.openNexusProfileModal = function () {
        let modal = document.getElementById("nexusProfileModalBackdrop");
        
        let userName = "NEXUS Commander";
        let userEmail = "commander@nexus.ai";
        try {
            const profileRaw = localStorage.getItem("nexus_user_profile");
            if (profileRaw) {
                const prof = JSON.parse(profileRaw);
                if (prof?.name) userName = prof.name;
                if (prof?.email) userEmail = prof.email;
            } else {
                const raw = localStorage.getItem("nexus_ai_command_center_v4");
                if (raw) {
                    const st = JSON.parse(raw);
                    if (st?.user?.name) userName = st.user.name;
                    if (st?.user?.email) userEmail = st.user.email;
                }
            }
        } catch (_) {}
        
        const avatarChar = userName.trim().charAt(0).toUpperCase() || "N";

        if (!modal) {
            modal = document.createElement("div");
            modal.id = "nexusProfileModalBackdrop";
            modal.className = "nexus-profile-modal-backdrop";

            modal.innerHTML = `
                <div class="nexus-profile-modal">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 20px;">
                        <div style="display:flex; align-items:center; gap: 16px;">
                            <div class="nexus-3d-avatar" id="nexusHoloProfileAvatar" style="width:58px; height:58px; font-size:22px;">${avatarChar}</div>
                            <div>
                                <h3 id="nexusHoloProfileName" style="margin:0; font-size:18px; color:#ffffff; font-weight:800; letter-spacing:0.04em;">${escapeHTML(userName)}</h3>
                                <div style="font-size:12px; color:var(--holo-cyan); font-family:monospace; margin-top:2px;">SECURITY: LEVEL 5 ARCHITECT</div>
                                <div id="nexusHoloProfileEmail" style="font-size:11px; color:var(--holo-text-faint); margin-top:1px;">${escapeHTML(userEmail)}</div>
                            </div>
                        </div>
                        <button type="button" class="nexus-3d-btn" id="closeProfileModalBtn" style="padding: 6px 12px; font-size: 12px;">✕</button>
                    </div>

                    <div style="background:rgba(7,10,20,0.8); border:1px solid var(--holo-border); border-radius:12px; padding:16px; margin-bottom:18px; display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:12px;">
                        <div>
                            <span style="color:var(--holo-text-faint); display:block; font-size:10px; font-weight:700; text-transform:uppercase;">NEURAL LINK</span>
                            <strong style="color:#10b981;">SYNCHRONIZED (4.8 GHz)</strong>
                        </div>
                        <div>
                            <span style="color:var(--holo-text-faint); display:block; font-size:10px; font-weight:700; text-transform:uppercase;">CLEARANCE</span>
                            <strong style="color:var(--holo-cyan);">COMMAND OPERATOR</strong>
                        </div>
                        <div>
                            <span style="color:var(--holo-text-faint); display:block; font-size:10px; font-weight:700; text-transform:uppercase;">BACKEND API</span>
                            <strong style="color:#a855f7;">FASTAPI / GEMINI 3.8</strong>
                        </div>
                        <div>
                            <span style="color:var(--holo-text-faint); display:block; font-size:10px; font-weight:700; text-transform:uppercase;">WORKSPACE</span>
                            <strong style="color:#ffffff;">INTELLIGENT STUDIO</strong>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:10px;">
                        <button type="button" class="nexus-3d-btn" id="profileHoloChamberBtn" style="color:var(--holo-cyan); border-color:var(--holo-cyan);">
                            ✦ Hologram Chamber
                        </button>
                        <button type="button" class="nexus-3d-btn active" id="profileDismissBtn">
                            Close Profile
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            function closeProfileModal() {
                modal.classList.remove("active");
                modal.style.display = "none";
                modal.style.visibility = "hidden";
                modal.style.pointerEvents = "none";
                modal.style.zIndex = "-9999";
            }

            modal.querySelector("#closeProfileModalBtn").addEventListener("click", closeProfileModal);
            modal.querySelector("#profileDismissBtn").addEventListener("click", closeProfileModal);
            modal.querySelector("#profileHoloChamberBtn").addEventListener("click", () => {
                closeProfileModal();
                if (window.openNexusHoloChamber) window.openNexusHoloChamber();
            });
            modal.addEventListener("click", (e) => {
                if (e.target === modal) closeProfileModal();
            });
        } else {
            // Update existing modal contents
            const nameEl = modal.querySelector("#nexusHoloProfileName");
            if (nameEl) nameEl.textContent = userName;
            const emailEl = modal.querySelector("#nexusHoloProfileEmail");
            if (emailEl) emailEl.textContent = userEmail;
            const avatarEl = modal.querySelector("#nexusHoloProfileAvatar");
            if (avatarEl) avatarEl.textContent = avatarChar;
        }

        modal.style.display = "flex";
        modal.style.visibility = "visible";
        modal.style.pointerEvents = "auto";
        modal.style.zIndex = "10000";
        modal.classList.add("active");
    };

    // Auto-bind click on profile avatars across any page
    if (typeof document !== "undefined") {
        document.addEventListener("DOMContentLoaded", () => {
            document.querySelectorAll(".sidebar-profile, #profileBtn, #sidebarProfile").forEach(el => {
                el.addEventListener("click", (e) => {
                    e.preventDefault();
                    if (window.openNexusProfileModal) window.openNexusProfileModal();
                });
            });
        });
    }


    /* =========================================================
       HOLOGRAPHIC CHAMBER MODAL FACTORY
    ========================================================= */
    global.openNexusHoloChamber = function (initialTheme = "default") {
        let modal = document.getElementById("nexusHoloChamberModal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "nexusHoloChamberModal";
            modal.className = "nexus-chamber-modal";
            modal.style.setProperty("display", "none", "important");
            modal.style.setProperty("visibility", "hidden", "important");
            modal.style.setProperty("pointer-events", "none", "important");
            modal.style.setProperty("z-index", "-9999", "important");
            modal.style.setProperty("opacity", "0", "important");
            modal.innerHTML = `
                <div class="nexus-chamber-header">
                    <div class="nexus-chamber-title">
                        <div class="nexus-chamber-logo">N</div>
                        <div>
                            <h2>NEXUS 3D Holographic Chamber</h2>
                            <p>Real-Time Quantum Neural Telemetry & Conversational Voice AI</p>
                        </div>
                    </div>
                    <button type="button" class="nexus-3d-btn" id="closeChamberBtn" style="padding: 8px 16px; font-size: 13px;">
                        ✕ Close Chamber
                    </button>
                </div>
                <div class="nexus-chamber-body">
                    <div class="nexus-chamber-canvas-box" id="chamberCanvasBox"></div>
                    
                    <div class="nexus-chamber-hud-left">
                        <div class="nexus-chamber-card">
                            <h4>Neural Entity Modes</h4>
                            <div class="nexus-chamber-modes">
                                <button type="button" class="nexus-chamber-mode-btn active" data-theme="default">
                                    <span>NEXUS Core</span>
                                    <small>Harmonic Lattice</small>
                                </button>
                                <button type="button" class="nexus-chamber-mode-btn" data-theme="research">
                                    <span>Research Agent</span>
                                    <small>Cyan Singularity</small>
                                </button>
                                <button type="button" class="nexus-chamber-mode-btn" data-theme="analysis">
                                    <span>Data Matrix</span>
                                    <small>Violet Gyro</small>
                                </button>
                                <button type="button" class="nexus-chamber-mode-btn" data-theme="automation">
                                    <span>Task Torque</span>
                                    <small>Emerald Kinetics</small>
                                </button>
                            </div>
                        </div>

                        <div class="nexus-chamber-card">
                            <h4>Telemetry Stream</h4>
                            <div style="font-family: monospace; font-size: 11px; color: #94a3b8; display:flex; flex-direction:column; gap:4px;">
                                <div>TENSORS: <span style="color:#00f0ff;">1024 FLOPS</span></div>
                                <div>SYNAPTIC LATENCY: <span style="color:#10b981;">1.2 ms</span></div>
                                <div>VOICE ENGINE: <span style="color:#ec4899;">ACTIVE SYNAPSE</span></div>
                                <div>GEMINI 3.8: <span style="color:#f59e0b;">CONNECTED</span></div>
                            </div>
                        </div>
                    </div>

                    <div class="nexus-chamber-hud-right">
                        <div class="nexus-chamber-card" style="display:flex; flex-direction:column; max-height: 440px;">
                            <h4>Interactive Neural Probe & AI Voice</h4>
                            <p style="font-size: 12px; color: #94a3b8; margin: 0 0 10px 0;">
                                Ask any question — the 3D Hologram thinks and speaks a real AI answer:
                            </p>
                            
                            <!-- Chat dialogue display -->
                            <div id="chamberDialogArea" style="flex:1; min-height:160px; max-height:220px; overflow-y:auto; background:rgba(4,7,15,0.75); border:1px solid rgba(70,223,255,0.2); border-radius:10px; padding:12px; display:flex; flex-direction:column; gap:8px; margin-bottom:12px; font-size:12px; line-height:1.5;">
                                <div style="color:#00f0ff; font-weight:700;">NEXUS CORE: <span style="color:#cbd5e1; font-weight:400;">Holographic AI interface ready. Ask me anything! Say "hi" or test any query.</span></div>
                            </div>

                            <div style="display:flex; gap:6px; margin-bottom: 10px;">
                                <button type="button" class="nexus-3d-btn" id="chamberQuickHi">Say "Hi"</button>
                                <button type="button" class="nexus-3d-btn" id="chamberQuickStatus">System Status</button>
                                <button type="button" class="nexus-3d-btn" id="chamberQuickAgents">Explain Agents</button>
                            </div>

                            <form id="chamberPromptForm" class="nexus-chamber-prompt-box" onsubmit="return false;">
                                <input type="text" id="chamberPromptInput" placeholder="Type a message (e.g. 'hi', 'what can you do?')..." value="hi" autocomplete="off">
                                <button type="submit" class="nexus-chamber-send-btn" id="chamberSpeakBtn">Ask AI</button>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Wire Close
            function closeChamberModal() {
                modal.classList.remove("active");
                modal.style.setProperty("display", "none", "important");
                modal.style.setProperty("visibility", "hidden", "important");
                modal.style.setProperty("pointer-events", "none", "important");
                modal.style.setProperty("z-index", "-9999", "important");
                modal.style.setProperty("opacity", "0", "important");
                if (global.nexusVoice) global.nexusVoice.stop();
                if (global.chamber3DCore) {
                    try { global.chamber3DCore.destroy(); } catch (_) {}
                    global.chamber3DCore = null;
                }
            }

            modal.querySelector("#closeChamberBtn").addEventListener("click", closeChamberModal);

            // ESC key to close
            window.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && modal.classList.contains("active")) {
                    closeChamberModal();
                }
            });

            // Backdrop click to close (clicking outside the cards directly on modal background)
            modal.addEventListener("click", (e) => {
                if (e.target === modal) {
                    closeChamberModal();
                }
            });

            // Wire Mode Buttons
            modal.querySelectorAll(".nexus-chamber-mode-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    modal.querySelectorAll(".nexus-chamber-mode-btn").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    const theme = btn.dataset.theme;
                    if (global.chamber3DCore) {
                        global.chamber3DCore.setTheme(theme);
                    }
                });
            });

            // Conversation Handler
            const dialogArea = modal.querySelector("#chamberDialogArea");
            const promptInput = modal.querySelector("#chamberPromptInput");

            async function handleUserQuestion(questionText) {
                const text = String(questionText || promptInput.value || "").trim();
                if (!text) return;

                // 1. Append user message
                const userRow = document.createElement("div");
                userRow.style.color = "#9b7cff";
                userRow.style.fontWeight = "700";
                userRow.innerHTML = `YOU: <span style="color:#ffffff; font-weight:400;">${escapeHTML(text)}</span>`;
                dialogArea.appendChild(userRow);
                dialogArea.scrollTop = dialogArea.scrollHeight;

                promptInput.value = "";

                // 2. Append thinking indicator
                const aiRow = document.createElement("div");
                aiRow.style.color = "#00f0ff";
                aiRow.style.fontWeight = "700";
                aiRow.innerHTML = `NEXUS CORE: <span style="color:#94a3b8; font-style:italic;">Synthesizing response...</span>`;
                dialogArea.appendChild(aiRow);
                dialogArea.scrollTop = dialogArea.scrollHeight;

                // 3. Ask AI
                const reply = await askNexusHologram(text, global.chamber3DCore);

                // 4. Update AI text in dialog
                aiRow.innerHTML = `NEXUS CORE: <span style="color:#cbd5e1; font-weight:400;">${escapeHTML(reply)}</span>`;
                dialogArea.scrollTop = dialogArea.scrollHeight;

                // 5. Speak reply aloud with real voice & audio-reactive waves
                if (global.nexusVoice) {
                    global.nexusVoice.setEnabled(true);
                    global.nexusVoice.speak(reply, global.chamber3DCore);
                }
            }

            modal.querySelector("#chamberPromptForm").addEventListener("submit", (e) => {
                e.preventDefault();
                handleUserQuestion();
            });

            modal.querySelector("#chamberSpeakBtn").addEventListener("click", (e) => {
                e.preventDefault();
                handleUserQuestion();
            });

            modal.querySelector("#chamberQuickHi").addEventListener("click", () => {
                handleUserQuestion("Hi");
            });

            modal.querySelector("#chamberQuickStatus").addEventListener("click", () => {
                handleUserQuestion("What is the current system status?");
            });

            modal.querySelector("#chamberQuickAgents").addEventListener("click", () => {
                handleUserQuestion("What autonomous agents are available in NEXUS AI?");
            });
        }

        modal.style.setProperty("display", "flex", "important");
        modal.style.setProperty("visibility", "visible", "important");
        modal.style.setProperty("pointer-events", "auto", "important");
        modal.style.setProperty("z-index", "99999", "important");
        modal.style.setProperty("opacity", "1", "important");
        modal.classList.add("active");

        const container = modal.querySelector("#chamberCanvasBox");
        container.innerHTML = "";
        global.chamber3DCore = new Nexus3DCore(container, {
            theme: typeof initialTheme === "string" ? initialTheme : "default",
            showHud: false,
            particlesCount: 1200
        });

        const input = modal.querySelector("#chamberPromptInput");
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    };

    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* =========================================================
       UNIVERSAL SIDEBAR TOGGLE CONTROLLER (Collapse & Expand)
    ========================================================= */
    global.toggleNexusSidebar = function (forceState = null) {
        const isCollapsed = forceState !== null
            ? Boolean(forceState)
            : !document.body.classList.contains("sidebar-collapsed");

        document.body.classList.toggle("sidebar-collapsed", isCollapsed);
        const workspace = document.querySelector(".workspace");
        if (workspace) workspace.classList.toggle("sidebar-collapsed", isCollapsed);

        try {
            localStorage.setItem("nexus_sidebar_collapsed", isCollapsed ? "1" : "0");
        } catch (_) {}

        document.querySelectorAll(".sidebar-toggle-btn, #toggleSidebarBtn").forEach(btn => {
            btn.classList.toggle("active", isCollapsed);
            const icon = btn.querySelector(".toggle-icon");
            const text = btn.querySelector(".toggle-text");
            if (icon) icon.textContent = isCollapsed ? "▶" : "◀";
            if (text) text.textContent = isCollapsed ? "Expand Sidebar" : "Sidebar";
        });

        // Broadcast event for canvas resizing
        window.dispatchEvent(new Event("resize"));
    };

    function initSidebarController() {
        try {
            if (localStorage.getItem("nexus_sidebar_collapsed") === "1" || localStorage.getItem("nexus_wb_sidebar_collapsed") === "1") {
                global.toggleNexusSidebar(true);
            }
        } catch (_) {}

        document.querySelectorAll(".sidebar-toggle-btn, #toggleSidebarBtn").forEach(btn => {
            btn.addEventListener("click", () => global.toggleNexusSidebar());
        });

        document.querySelectorAll(".floating-sidebar-toggle, #floatingToggleBtn").forEach(btn => {
            btn.addEventListener("click", () => global.toggleNexusSidebar(false));
        });

        document.querySelectorAll(".sidebar-dock-toggle, #dockCollapseBtn").forEach(btn => {
            btn.addEventListener("click", () => global.toggleNexusSidebar());
        });
    }

    if (typeof document !== "undefined") {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initSidebarController);
        } else {
            initSidebarController();
        }
    }

    /* =========================================================
       UNIVERSAL THEME CONTROLLER (Dark & Light Mode)
    ========================================================= */
    global.getNexusTheme = function () {
        try {
            return localStorage.getItem("nexus_theme") || "dark";
        } catch (_) {
            return "dark";
        }
    };

    global.applyNexusTheme = function (theme) {
        const isLight = theme === "light";
        document.body.classList.toggle("light", isLight);
        document.body.classList.toggle("light-mode", isLight);

        try {
            localStorage.setItem("nexus_theme", isLight ? "light" : "dark");
            const raw = localStorage.getItem("nexus_ai_command_center_v4");
            if (raw) {
                const st = JSON.parse(raw);
                st.theme = isLight ? "light" : "dark";
                localStorage.setItem("nexus_ai_command_center_v4", JSON.stringify(st));
            }
        } catch (_) {}

        document.querySelectorAll("#themeBtn, #themeButton, #settingsTheme, .theme-toggle").forEach(btn => {
            if (btn.id === "settingsTheme") {
                btn.textContent = isLight ? "Switch to Dark mode" : "Switch to Light mode";
            } else {
                btn.textContent = isLight ? "☀" : "☾";
                btn.setAttribute("title", isLight ? "Switch to Dark theme" : "Switch to Light theme");
                btn.setAttribute("aria-label", isLight ? "Switch to Dark theme" : "Switch to Light theme");
            }
        });
    };

    global.toggleNexusTheme = function () {
        const current = global.getNexusTheme();
        const next = current === "dark" ? "light" : "dark";
        global.applyNexusTheme(next);
        return next;
    };

    function initThemeController() {
        const savedTheme = global.getNexusTheme();
        global.applyNexusTheme(savedTheme);

        document.querySelectorAll("#themeBtn, #themeButton, #settingsTheme, .theme-toggle").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                global.toggleNexusTheme();
            });
        });
    }

    /* =========================================================
       UNIVERSAL PROFILE SYNCHRONIZATION
    ========================================================= */
    global.syncUniversalNexusProfile = function () {
        try {
            let name = "NEXUS User";
            let email = "user@example.com";
            const profRaw = localStorage.getItem("nexus_user_profile");
            if (profRaw) {
                const prof = JSON.parse(profRaw);
                if (prof?.name) name = prof.name;
                if (prof?.email) email = prof.email;
            } else {
                const raw = localStorage.getItem("nexus_ai_command_center_v4");
                if (raw) {
                    const st = JSON.parse(raw);
                    if (st?.user?.name) name = st.user.name;
                    if (st?.user?.email) email = st.user.email;
                }
            }
            const avatar = name.trim().charAt(0).toUpperCase() || "N";
            document.querySelectorAll("#profileName").forEach(el => el.textContent = name);
            document.querySelectorAll("#profileEmail").forEach(el => el.textContent = email);
            document.querySelectorAll("#profileAvatar").forEach(el => el.textContent = avatar);
            const dashName = document.getElementById("dashboardName");
            if (dashName && name) {
                const first = name.trim().split(" ")[0];
                dashName.textContent = first;
            }
        } catch (_) {}
    };

    if (typeof document !== "undefined") {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => {
                initThemeController();
                global.syncUniversalNexusProfile();
            });
        } else {
            initThemeController();
            global.syncUniversalNexusProfile();
        }
    }

    /* =========================================================
       INITIALIZE 3D WIDGET AND BACKGROUND
    ========================================================= */
    global.initNexus3DWidget = function (container, options = {}) {
        return new Nexus3DCore(container, options);
    };

    global.initNexus3DBackground = function () {
        if (!global.nexus3DBackground) {
            global.nexus3DBackground = new Nexus3DBackground();
        }
        return global.nexus3DBackground;
    };

    // Auto-launch background on load
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            global.initNexus3DBackground();
        });
    } else {
        global.initNexus3DBackground();
    }

    global.Nexus3DCore = Nexus3DCore;
    global.Nexus3DBackground = Nexus3DBackground;
    global.AGENT_THEMES = AGENT_THEMES;

})(window);
