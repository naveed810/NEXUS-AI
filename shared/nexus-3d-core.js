/* =========================================================
   NEXUS AI — 3D HOLOGRAPHIC QUANTUM NEURAL CORE
   WebGL / Three.js Interactive Core & Voice Engine
   Author: NEXUS AI Systems
========================================================= */

(function (global) {
    "use strict";

    /* =========================================================
       DYNAMIC THREE.JS LOADER (Local with CDN fallback)
    ========================================================= */
    async function ensureThreeLoaded() {
        if (global.THREE) return global.THREE;

        return new Promise((resolve, reject) => {
            // First try local shared vendor
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

                // Scale reaction
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
                
                // Emissive flash
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
                        // Inward collapse vortex
                        rMod = 0.75 + Math.sin(this.time * 8 + phase) * 0.15;
                    } else if (this.state === "speaking") {
                        // Outward audio wave ripples
                        rMod = 1.0 + (this.audioAmplitude * 0.5) + Math.sin(this.time * 5 + phase) * 0.12;
                    } else {
                        // Gentle ambient floating
                        rMod = 1.0 + Math.sin(this.time * 2.0 + phase) * 0.06;
                    }

                    pos[idx] = base[idx] * rMod;
                    pos[idx + 1] = base[idx + 1] * rMod;
                    pos[idx + 2] = base[idx + 2] * rMod;
                }

                this.particleSystem.geometry.attributes.position.needsUpdate = true;
                this.particleSystem.rotation.y -= 0.003 * speedMult;
            }

            // Render Frame
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

            const badge = this.container.querySelector(".nexus-3d-badge");
            if (badge) {
                badge.style.borderColor = `rgba(70, 223, 255, 0.4)`;
            }
        }

        setAudioAmplitude(val) {
            this.audioAmplitude = Math.max(0, Math.min(1.0, val));

            // Update HUD EQ bars
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
            // Remove previous HUD if exists
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
            this.enabled = localStorage.getItem("nexus_voice_enabled") === "true";
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
            // Prioritize clean, natural English voices (Google UK English, Microsoft Natural, etc.)
            this.selectedVoice = voices.find(v => 
                (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("UK English")) && v.lang.startsWith("en")
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
                .replace(/```[\s\S]*?```/g, "Code block omitted.") // Remove code blocks
                .replace(/`([^`]+)`/g, "$1")                      // Remove inline code
                .replace(/[*#_~>[\]()]/g, " ")                     // Remove markdown symbols
                .replace(/\s+/g, " ")                              // Normalize spaces
                .trim();
        }

        speak(rawText, core = null) {
            if (!this.synth || !this.enabled) return;

            this.stop(); // Stop any active speech

            const clean = this.cleanText(rawText);
            if (!clean) return;

            // Trim to first ~350 characters for crisp spoken insight during demos
            const spokenExcerpt = clean.length > 350 
                ? clean.substring(0, 350) + "... Task complete." 
                : clean;

            const utterance = new SpeechSynthesisUtterance(spokenExcerpt);
            if (this.selectedVoice) {
                utterance.voice = this.selectedVoice;
            }
            utterance.rate = 1.05;   // Crisp cadence
            utterance.pitch = 1.08;  // Clear, intelligent tone

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
                // Modulated speech waveform frequency
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

    // Initialize global voice engine instance
    global.nexusVoice = new NexusVoiceEngine();

    /* =========================================================
       HOLOGRAPHIC CHAMBER MODAL FACTORY
    ========================================================= */
    global.openNexusHoloChamber = function (initialTheme = "default") {
        let modal = document.getElementById("nexusHoloChamberModal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "nexusHoloChamberModal";
            modal.className = "nexus-chamber-modal";
            modal.innerHTML = `
                <div class="nexus-chamber-header">
                    <div class="nexus-chamber-title">
                        <div class="nexus-chamber-logo">N</div>
                        <div>
                            <h2>NEXUS 3D Holographic Chamber</h2>
                            <p>Real-Time Quantum Neural Telemetry & Voice Synthesis</p>
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
                                <div>VOICE CODES: <span style="color:#ec4899;">PCM 48kHz</span></div>
                                <div>ORBIT: <span style="color:#f59e0b;">GIMBAL ACTIVE</span></div>
                            </div>
                        </div>
                    </div>

                    <div class="nexus-chamber-hud-right">
                        <div class="nexus-chamber-card">
                            <h4>Interactive Neural Probe</h4>
                            <p style="font-size: 12px; color: #94a3b8; margin: 0 0 10px 0;">
                                Test state transitions and trigger live audio-reactive speech:
                            </p>
                            <div style="display:flex; gap:6px; margin-bottom: 10px;">
                                <button type="button" class="nexus-3d-btn" id="chamberStateIdle">Idle</button>
                                <button type="button" class="nexus-3d-btn" id="chamberStateListen">Listening</button>
                                <button type="button" class="nexus-3d-btn" id="chamberStateThink">Thinking</button>
                                <button type="button" class="nexus-3d-btn active" id="chamberStateSpeak">Speak Insight</button>
                            </div>
                            <div class="nexus-chamber-prompt-box">
                                <input type="text" id="chamberPromptInput" placeholder="Type instruction to speak..." value="NEXUS AI Quantum Neural Core is fully operational. All agent systems synchronized.">
                                <button type="button" class="nexus-chamber-send-btn" id="chamberSpeakBtn">Speak</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Wire Close
            modal.querySelector("#closeChamberBtn").addEventListener("click", () => {
                modal.classList.remove("active");
                if (global.chamber3DCore) {
                    global.chamber3DCore.destroy();
                    global.chamber3DCore = null;
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

            // Wire State Testing Buttons
            modal.querySelector("#chamberStateIdle").addEventListener("click", () => {
                if (global.chamber3DCore) global.chamber3DCore.setState("idle");
            });
            modal.querySelector("#chamberStateListen").addEventListener("click", () => {
                if (global.chamber3DCore) global.chamber3DCore.setState("listening");
            });
            modal.querySelector("#chamberStateThink").addEventListener("click", () => {
                if (global.chamber3DCore) global.chamber3DCore.setState("thinking");
            });
            modal.querySelector("#chamberStateSpeak").addEventListener("click", () => {
                const prompt = modal.querySelector("#chamberPromptInput").value;
                if (global.nexusVoice) {
                    global.nexusVoice.setEnabled(true);
                    global.nexusVoice.speak(prompt, global.chamber3DCore);
                }
            });
            modal.querySelector("#chamberSpeakBtn").addEventListener("click", () => {
                const prompt = modal.querySelector("#chamberPromptInput").value;
                if (global.nexusVoice) {
                    global.nexusVoice.setEnabled(true);
                    global.nexusVoice.speak(prompt, global.chamber3DCore);
                }
            });
        }

        modal.classList.add("active");

        // Initialize 3D Core in the Chamber Canvas Box
        const container = modal.querySelector("#chamberCanvasBox");
        container.innerHTML = "";
        global.chamber3DCore = new Nexus3DCore(container, {
            theme: typeof initialTheme === "string" ? initialTheme : "default",
            showHud: false,
            particlesCount: 1200
        });
    };

    /* =========================================================
       HELPER TO INITIALIZE 3D WIDGET ON ANY ELEMENT
    ========================================================= */
    global.initNexus3DWidget = function (container, options = {}) {
        return new Nexus3DCore(container, options);
    };

    global.Nexus3DCore = Nexus3DCore;
    global.AGENT_THEMES = AGENT_THEMES;

})(window);
