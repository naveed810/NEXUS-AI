/**
 * ====================================================================
 * NEXUS AI — HOLOGRAPHIC CINEMATIC BOOT EXPERIENCE
 * Represents the real NEXUS AI architecture:
 * Core Intelligence · Gemini AI · FastAPI Backend · Database ·
 * Command Center · Agent Hub · Workflow Builder · AI Insights
 * ====================================================================
 */

(function (global) {
    "use strict";

    // Audio Synthesizer via Web Audio API (zero external assets needed)
    function playBootSound(type = "chime") {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;

            if (type === "node") {
                // High-tech subtle blip
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(580, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === "ready") {
                // Futuristic double chord
                [440, 660, 880].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = "triangle";
                    osc.frequency.setValueAtTime(freq, now + i * 0.06);
                    gain.gain.setValueAtTime(0.05, now + i * 0.06);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + i * 0.06);
                    osc.stop(now + 0.4);
                });
            } else if (type === "enter") {
                // Cinematic warp sweep
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(140, now);
                osc.frequency.exponentialRampToValueAtTime(720, now + 0.4);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.55);
            }
        } catch (_) {}
    }

    class NexusHolographicBoot {
        constructor() {
            this.overlay = null;
            this.canvasContainer = null;
            this.renderer = null;
            this.scene = null;
            this.camera = null;
            this.coreMesh = null;
            this.innerCore = null;
            this.outerRing1 = null;
            this.outerRing2 = null;
            this.particles = null;
            this.satellites = [];
            this.beams = [];
            this.animId = null;
            this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
            this.isDismissed = false;
            this.backendTelemetry = null;
            this.phase = 0;
            this.startTime = 0;
        }

        init(forceReplay = false) {
            // Check if already dismissed in this tab session
            if (!forceReplay && sessionStorage.getItem("nexus_boot_dismissed") === "1") {
                this.finishImmediate();
                return;
            }

            this.isDismissed = false;
            this.phase = 0;

            this.buildDOM();
            this.initThree();
            this.bindEvents();
            this.runSequence();
        }

        buildDOM() {
            let el = document.getElementById("nexusBootOverlay");
            if (el) el.remove();

            el = document.createElement("div");
            el.id = "nexusBootOverlay";
            el.className = "nexus-boot-overlay";
            el.innerHTML = `
                <!-- 3D Canvas Background -->
                <div id="nexusBootCanvasContainer" class="nexus-boot-canvas-container"></div>
                <div class="nexus-boot-grid"></div>
                <div class="nexus-boot-scanlines"></div>
                <div class="nexus-boot-vignette"></div>

                <!-- Top Header Control -->
                <div class="nexus-boot-header">
                    <div class="nexus-boot-header-brand">
                        <span class="nexus-boot-mini-logo">N</span>
                        <span>NEXUS OS // NEURAL KERNEL v4.2</span>
                    </div>
                    <button id="nexusBootSkipBtn" class="nexus-boot-skip-btn" type="button" title="Skip cinematic boot (ESC)">
                        <span>Skip Intro</span> <kbd>ESC</kbd>
                    </button>
                </div>

                <!-- Central Stage -->
                <div class="nexus-boot-stage">

                    <!-- PHASE 1: IDENTITY -->
                    <div id="nexusBootBrand" class="nexus-boot-brand">
                        <div class="nexus-boot-logo-glitch">
                            <div class="nexus-boot-logo-mark">N</div>
                            <div class="nexus-boot-logo-ring ring-1"></div>
                            <div class="nexus-boot-logo-ring ring-2"></div>
                        </div>
                        <h1 class="nexus-boot-title">NEXUS <span>AI</span></h1>
                        <div class="nexus-boot-subtitle">INTELLIGENT WORK STUDIO</div>
                        
                        <div class="nexus-boot-status-pill">
                            <span class="nexus-boot-pulse-dot"></span>
                            <span id="nexusBootStatusText">NEXUS AI SYSTEM INITIALIZING...</span>
                        </div>
                    </div>

                    <!-- PHASE 2 & 3: ARCHITECTURE NODES -->
                    <div id="nexusBootTelemetryGrid" class="nexus-boot-telemetry-grid">
                        <div class="nexus-node-card" id="bootNodeCore">
                            <div class="node-icon">◉</div>
                            <div class="node-details">
                                <span class="node-label">CORE INTELLIGENCE</span>
                                <span class="node-status" id="statusCore">SYNCHRONIZING...</span>
                            </div>
                        </div>
                        <div class="nexus-node-card" id="bootNodeGemini">
                            <div class="node-icon">◉</div>
                            <div class="node-details">
                                <span class="node-label">GEMINI AI</span>
                                <span class="node-status" id="statusGemini">CONNECTING...</span>
                            </div>
                        </div>
                        <div class="nexus-node-card" id="bootNodeFastAPI">
                            <div class="node-icon">◉</div>
                            <div class="node-details">
                                <span class="node-label">FASTAPI BACKEND</span>
                                <span class="node-status" id="statusFastAPI">POLLING PORT 8000...</span>
                            </div>
                        </div>
                        <div class="nexus-node-card" id="bootNodeDatabase">
                            <div class="node-icon">◉</div>
                            <div class="node-details">
                                <span class="node-label">DATABASE</span>
                                <span class="node-status" id="statusDatabase">CHECKING SQLITE...</span>
                            </div>
                        </div>
                        <div class="nexus-node-card" id="bootNodeCommand">
                            <div class="node-icon">◉</div>
                            <div class="node-details">
                                <span class="node-label">COMMAND CENTER</span>
                                <span class="node-status" id="statusCommand">LOADING WORKSPACE...</span>
                            </div>
                        </div>
                        <div class="nexus-node-card" id="bootNodeAgents">
                            <div class="node-icon">◉</div>
                            <div class="node-details">
                                <span class="node-label">AGENT HUB</span>
                                <span class="node-status" id="statusAgents">INITIALIZING CLUSTERS...</span>
                            </div>
                        </div>
                        <div class="nexus-node-card" id="bootNodeWorkflow">
                            <div class="node-icon">◉</div>
                            <div class="node-details">
                                <span class="node-label">WORKFLOW ENGINE</span>
                                <span class="node-status" id="statusWorkflow">MAPPING NODES...</span>
                            </div>
                        </div>
                        <div class="nexus-node-card" id="bootNodeInsights">
                            <div class="node-icon">◉</div>
                            <div class="node-details">
                                <span class="node-label">AI INSIGHTS</span>
                                <span class="node-status" id="statusInsights">CALIBRATING METRICS...</span>
                            </div>
                        </div>
                    </div>

                    <!-- PHASE 4: 4 MODULE SATELLITE HUD -->
                    <div id="nexusBootModulesCluster" class="nexus-boot-modules-cluster">
                        <div class="module-orbit-item orbit-top">
                            <span class="orbit-dot"></span>
                            <span class="orbit-name">COMMAND CENTER</span>
                            <span class="orbit-meta">CENTRAL HUD</span>
                        </div>
                        <div class="module-orbit-item orbit-right">
                            <span class="orbit-dot"></span>
                            <span class="orbit-name">AGENT HUB</span>
                            <span class="orbit-meta">AI TEAM</span>
                        </div>
                        <div class="module-orbit-item orbit-bottom">
                            <span class="orbit-dot"></span>
                            <span class="orbit-name">WORKFLOW BUILDER</span>
                            <span class="orbit-meta">AUTOMATION</span>
                        </div>
                        <div class="module-orbit-item orbit-left">
                            <span class="orbit-dot"></span>
                            <span class="orbit-name">AI INSIGHTS</span>
                            <span class="orbit-meta">TELEMETRY</span>
                        </div>
                    </div>

                    <!-- PHASE 5: READY & ENTER -->
                    <div id="nexusBootReadyPanel" class="nexus-boot-ready-panel">
                        <div class="ready-badge-pill">
                            <span class="ready-spark">✦</span>
                            <span>ALL SYSTEMS NOMINAL · QUANTUM SYNC OPTIMAL</span>
                        </div>
                        <h2 class="ready-title">NEXUS AI ONLINE</h2>
                        <p class="ready-desc">INTELLIGENT WORKSPACE READY FOR OPERATION</p>
                        <button id="nexusBootEnterBtn" class="nexus-boot-enter-btn" type="button">
                            <span class="enter-btn-backdrop"></span>
                            <span class="enter-btn-glow"></span>
                            <span class="enter-btn-content">
                                <strong>ENTER NEXUS AI</strong>
                                <span class="enter-arrow">→</span>
                            </span>
                        </button>
                    </div>

                </div>
            `;

            document.body.prepend(el);
            this.overlay = el;
            this.canvasContainer = el.querySelector("#nexusBootCanvasContainer");
        }

        initThree() {
            const THREE = global.THREE;
            if (!THREE || !this.canvasContainer) return;

            const width = window.innerWidth;
            const height = window.innerHeight;

            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
            this.camera.position.set(0, 0, 26);

            this.renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
                powerPreference: "high-performance"
            });
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
            this.canvasContainer.appendChild(this.renderer.domElement);

            // 1. Directional and Point Lights
            const ambLight = new THREE.AmbientLight(0x060914, 2.0);
            this.scene.add(ambLight);

            const cyanLight = new THREE.PointLight(0x00f0ff, 3.5, 45);
            cyanLight.position.set(0, 0, 8);
            this.scene.add(cyanLight);

            const purpleLight = new THREE.PointLight(0x9b7cff, 2.5, 50);
            purpleLight.position.set(-12, 10, 10);
            this.scene.add(purpleLight);

            // 2. Central Holographic Core (Wireframe + Energy Core)
            const coreGroup = new THREE.Group();
            this.scene.add(coreGroup);
            this.coreGroup = coreGroup;

            const icosaGeom = new THREE.IcosahedronGeometry(3.6, 1);
            const icosaMat = new THREE.MeshBasicMaterial({
                color: 0x00f0ff,
                wireframe: true,
                transparent: true,
                opacity: 0.55
            });
            this.coreMesh = new THREE.Mesh(icosaGeom, icosaMat);
            coreGroup.add(this.coreMesh);

            const innerGeom = new THREE.SphereGeometry(2.1, 24, 24);
            const innerMat = new THREE.MeshBasicMaterial({
                color: 0x9b7cff,
                wireframe: true,
                transparent: true,
                opacity: 0.35
            });
            this.innerCore = new THREE.Mesh(innerGeom, innerMat);
            coreGroup.add(this.innerCore);

            // 3. Dual Holographic Orbital Rings
            const ring1Geom = new THREE.TorusGeometry(5.2, 0.05, 12, 64);
            const ring1Mat = new THREE.MeshBasicMaterial({
                color: 0x00f0ff,
                transparent: true,
                opacity: 0.7
            });
            this.outerRing1 = new THREE.Mesh(ring1Geom, ring1Mat);
            this.outerRing1.rotation.x = Math.PI / 3;
            coreGroup.add(this.outerRing1);

            const ring2Geom = new THREE.TorusGeometry(6.4, 0.04, 12, 64);
            const ring2Mat = new THREE.MeshBasicMaterial({
                color: 0xa855f7,
                transparent: true,
                opacity: 0.55
            });
            this.outerRing2 = new THREE.Mesh(ring2Geom, ring2Mat);
            this.outerRing2.rotation.y = Math.PI / 4;
            coreGroup.add(this.outerRing2);

            // 4. Background Holographic Starfield / Quantum Dust
            const count = 900;
            const pGeom = new THREE.BufferGeometry();
            const pPos = new Float32Array(count * 3);
            const pCols = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
                pPos[i * 3] = (Math.random() - 0.5) * 80;
                pPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
                pPos[i * 3 + 2] = (Math.random() - 0.5) * 60;

                const isCyan = Math.random() > 0.4;
                pCols[i * 3] = isCyan ? 0.0 : 0.6;
                pCols[i * 3 + 1] = isCyan ? 0.94 : 0.48;
                pCols[i * 3 + 2] = 1.0;
            }

            pGeom.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
            pGeom.setAttribute("color", new THREE.BufferAttribute(pCols, 3));

            const pMat = new THREE.PointsMaterial({
                size: 0.16,
                vertexColors: true,
                transparent: true,
                opacity: 0.75
            });
            this.particles = new THREE.Points(pGeom, pMat);
            this.scene.add(this.particles);

            // 5. Four Module Satellite Nodes in 3D Space
            const moduleCoords = [
                { x: 0, y: 8, z: 0 },   // Command Center (Top)
                { x: 10, y: 0, z: -2 }, // Agent Hub (Right)
                { x: 0, y: -8, z: 0 },  // Workflow Builder (Bottom)
                { x: -10, y: 0, z: -2 } // AI Insights (Left)
            ];

            moduleCoords.forEach(pos => {
                const nodeGeom = new THREE.OctahedronGeometry(0.7, 0);
                const nodeMat = new THREE.MeshBasicMaterial({
                    color: 0x00f0ff,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.85
                });
                const mesh = new THREE.Mesh(nodeGeom, nodeMat);
                mesh.position.set(pos.x, pos.y, pos.z);
                this.scene.add(mesh);
                this.satellites.push(mesh);

                // Beam connecting core to satellite
                const lineGeom = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(pos.x, pos.y, pos.z)
                ]);
                const lineMat = new THREE.LineBasicMaterial({
                    color: 0x00f0ff,
                    transparent: true,
                    opacity: 0.25
                });
                const line = new THREE.Line(lineGeom, lineMat);
                this.scene.add(line);
                this.beams.push(line);
            });

            // Start animation loop
            this.animate = this.animate.bind(this);
            this.animId = requestAnimationFrame(this.animate);
        }

        animate() {
            if (this.isDismissed) return;
            this.animId = requestAnimationFrame(this.animate);

            const time = performance.now() * 0.001;

            // Rotate central core
            if (this.coreMesh) {
                this.coreMesh.rotation.x = time * 0.35;
                this.coreMesh.rotation.y = time * 0.45;
            }
            if (this.innerCore) {
                this.innerCore.rotation.x = -time * 0.25;
                this.innerCore.rotation.y = -time * 0.35;
                const s = 1.0 + Math.sin(time * 3.5) * 0.08;
                this.innerCore.scale.set(s, s, s);
            }
            if (this.outerRing1) {
                this.outerRing1.rotation.z = time * 0.6;
                this.outerRing1.rotation.x = (Math.PI / 3) + Math.sin(time) * 0.15;
            }
            if (this.outerRing2) {
                this.outerRing2.rotation.z = -time * 0.45;
                this.outerRing2.rotation.y = (Math.PI / 4) + Math.cos(time) * 0.15;
            }

            // Orbit satellites subtly
            this.satellites.forEach((sat, i) => {
                sat.rotation.y = time * 1.2;
                sat.rotation.x = time * 0.8;
                sat.position.y += Math.sin(time * 2 + i) * 0.004;
            });

            // Rotate starfield
            if (this.particles) {
                this.particles.rotation.y = time * 0.04;
            }

            // Mouse parallax smoothly
            this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
            this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

            if (this.camera) {
                this.camera.position.x = this.mouse.x * 2.5;
                this.camera.position.y = this.mouse.y * 2.0;
                this.camera.lookAt(0, 0, 0);
            }

            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        }

        bindEvents() {
            // Parallax
            window.addEventListener("pointermove", (e) => {
                const nx = (e.clientX / window.innerWidth) * 2 - 1;
                const ny = -(e.clientY / window.innerHeight) * 2 + 1;
                this.mouse.targetX = nx;
                this.mouse.targetY = ny;
            });

            // Resize
            window.addEventListener("resize", () => {
                if (!this.renderer || !this.camera) return;
                const w = window.innerWidth;
                const h = window.innerHeight;
                this.camera.aspect = w / h;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(w, h);
            });

            // Skip Intro button
            const skipBtn = this.overlay.querySelector("#nexusBootSkipBtn");
            if (skipBtn) {
                skipBtn.addEventListener("click", () => this.dismiss());
            }

            // ESC key to skip
            window.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && !this.isDismissed) {
                    this.dismiss();
                } else if ((e.key === "Enter" || e.key === " ") && this.phase >= 4 && !this.isDismissed) {
                    this.dismiss();
                }
            });

            // Enter button
            const enterBtn = this.overlay.querySelector("#nexusBootEnterBtn");
            if (enterBtn) {
                enterBtn.addEventListener("click", () => {
                    playBootSound("enter");
                    this.dismiss();
                });
            }
        }

        async runSequence() {
            this.startTime = performance.now();
            this.phase = 1;

            // 1. Kick off real backend health check in parallel
            const healthPromise = this.fetchRealSystemHealth();

            // PHASE 1: BRAND REVEAL (0 - 1.0s)
            await this.wait(400);
            const brand = this.overlay.querySelector("#nexusBootBrand");
            if (brand) brand.classList.add("visible");

            // Show skip intro button after 800ms
            setTimeout(() => {
                const skip = this.overlay.querySelector("#nexusBootSkipBtn");
                if (skip) skip.classList.add("visible");
            }, 800);

            // PHASE 2 & 3: ARCHITECTURE NODES (1.0s - 2.4s)
            await this.wait(600);
            this.phase = 2;
            const grid = this.overlay.querySelector("#nexusBootTelemetryGrid");
            if (grid) grid.classList.add("visible");

            const statusText = this.overlay.querySelector("#nexusBootStatusText");
            if (statusText) statusText.textContent = "SYNCHRONIZING NEURAL CLUSTERS & APIS...";

            // Await real backend response
            const telemetry = await healthPromise;

            // Reveal 8 nodes sequentially with live telemetry status and audio blips
            const nodeIds = [
                "bootNodeCore", "bootNodeFastAPI", "bootNodeGemini", "bootNodeDatabase",
                "bootNodeCommand", "bootNodeAgents", "bootNodeWorkflow", "bootNodeInsights"
            ];

            for (let i = 0; i < nodeIds.length; i++) {
                if (this.isDismissed) return;
                const node = this.overlay.querySelector(`#${nodeIds[i]}`);
                if (node) {
                    node.classList.add("active");
                    this.applyNodeTelemetry(nodeIds[i], telemetry);
                    playBootSound("node");
                }
                await this.wait(120);
            }

            // PHASE 4: 4 SATELLITE MODULE RINGS (2.4s - 3.4s)
            this.phase = 3;
            if (statusText) statusText.textContent = "ORCHESTRATING MODULE WORKSPACE SATELLITES...";

            const modulesCluster = this.overlay.querySelector("#nexusBootModulesCluster");
            if (modulesCluster) modulesCluster.classList.add("visible");

            // Animate beam connections
            this.beams.forEach(b => {
                if (b.material) b.material.opacity = 0.75;
            });

            await this.wait(800);

            // PHASE 5: SYSTEM READY & ENTER CTA (3.4s - 4.2s)
            this.phase = 4;
            if (statusText) {
                statusText.innerHTML = "✦ NEXUS AI ONLINE · ALL CLUSTERS ACTIVE ✦";
                statusText.style.color = "#00f0ff";
            }

            const readyPanel = this.overlay.querySelector("#nexusBootReadyPanel");
            if (readyPanel) {
                readyPanel.classList.add("visible");
                playBootSound("ready");
            }

            // Camera dolly forward effect
            if (this.camera) {
                let dollyStep = 0;
                const dollyInterval = setInterval(() => {
                    if (this.isDismissed || dollyStep > 30) {
                        clearInterval(dollyInterval);
                        return;
                    }
                    this.camera.position.z -= 0.15;
                    dollyStep++;
                }, 30);
            }
        }

        applyNodeTelemetry(nodeId, t) {
            const setStatus = (id, text, type) => {
                const el = this.overlay?.querySelector(`#${id}`);
                if (!el) return;
                el.textContent = text;
                el.className = `node-status ${type}`;
            };

            switch (nodeId) {
                case "bootNodeCore":
                    setStatus("statusCore", "SYNCHRONIZED (4.8 GHz)", "success");
                    break;
                case "bootNodeFastAPI":
                    setStatus("statusFastAPI", t.online ? "CONNECTED (PORT 8000)" : "OFFLINE (STANDALONE)", t.online ? "success" : "warn");
                    break;
                case "bootNodeGemini":
                    setStatus("statusGemini", t.gemini === "connected" ? "CONNECTED (GEMINI 3.8 FLASH)" : "OFFLINE (FALLBACK REASONING)", t.gemini === "connected" ? "success" : "warn");
                    break;
                case "bootNodeDatabase":
                    setStatus("statusDatabase", t.database === "connected" ? "CONNECTED (SQLITE)" : "OFFLINE (BROWSER STORAGE)", t.database === "connected" ? "success" : "warn");
                    break;
                case "bootNodeCommand":
                    setStatus("statusCommand", "READY (PRIMARY HUD)", "success");
                    break;
                case "bootNodeAgents":
                    setStatus("statusAgents", "READY (3 ACTIVE)", "success");
                    break;
                case "bootNodeWorkflow":
                    setStatus("statusWorkflow", "READY (4 ACTIVE)", "success");
                    break;
                case "bootNodeInsights":
                    setStatus("statusInsights", "READY (TELEMETRY LIVE)", "success");
                    break;
            }
        }

        async fetchRealSystemHealth() {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);

                const res = await fetch("http://127.0.0.1:8000/api/system/status", {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const data = await res.json();
                    return {
                        online: true,
                        fastapi: "online",
                        gemini: data.llm === "connected" ? "connected" : "offline",
                        database: data.database === "connected" ? "connected" : "offline",
                        agents: data.agents || "available",
                        workflows: data.workflows || "available",
                        executions: data.executions_recorded || 0
                    };
                }
            } catch (_) {}

            return {
                online: false,
                fastapi: "offline",
                gemini: "offline",
                database: "offline",
                agents: "local",
                workflows: "local",
                executions: 0
            };
        }

        applyRealTelemetry(t) {
            ["bootNodeCore", "bootNodeFastAPI", "bootNodeGemini", "bootNodeDatabase",
             "bootNodeCommand", "bootNodeAgents", "bootNodeWorkflow", "bootNodeInsights"].forEach(id => {
                this.applyNodeTelemetry(id, t);
            });
        }

        dismiss() {
            if (this.isDismissed) return;
            this.isDismissed = true;

            sessionStorage.setItem("nexus_boot_dismissed", "1");

            if (this.overlay) {
                this.overlay.classList.add("dismissing");

                // Camera zoom-through transition
                if (this.camera) {
                    const startZ = this.camera.position.z;
                    const zoomStart = performance.now();
                    const zoomLoop = () => {
                        const elapsed = (performance.now() - zoomStart) / 600;
                        if (elapsed < 1.0) {
                            this.camera.position.z = startZ - elapsed * 18;
                            requestAnimationFrame(zoomLoop);
                        }
                    };
                    zoomLoop();
                }

                setTimeout(() => {
                    this.teardown();
                    // Reveal Command Center or Onboarding
                    this.activateMainWorkspace();
                }, 620);
            } else {
                this.activateMainWorkspace();
            }
        }

        finishImmediate() {
            this.isDismissed = true;
            if (this.overlay) {
                this.overlay.remove();
                this.overlay = null;
            }
            this.activateMainWorkspace();
        }

        teardown() {
            if (this.animId) {
                cancelAnimationFrame(this.animId);
                this.animId = null;
            }
            if (this.renderer) {
                try {
                    this.renderer.dispose();
                    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
                    }
                } catch (_) {}
                this.renderer = null;
            }
            if (this.overlay) {
                this.overlay.classList.remove("dismissing");
                this.overlay.classList.add("dismissed");
                this.overlay.style.cssText = "display:none!important;visibility:hidden!important;pointer-events:none!important;z-index:-99999!important;opacity:0!important;";
            }
        }

        activateMainWorkspace() {
            // Signal to Command Center and other listeners
            window.dispatchEvent(new CustomEvent("nexus:boot-complete"));

            // Check if app has onboarding or returning state
            try {
                let onboarded = false;
                const raw = localStorage.getItem("nexus_ai_command_center_v4");
                if (raw) {
                    const st = JSON.parse(raw);
                    if (st?.onboarded && st?.user?.name && st.user.name.trim().length >= 2) {
                        onboarded = true;
                    }
                }

                const onboardingEl = document.getElementById("onboarding");
                const appShellEl = document.getElementById("appShell");

                if (onboarded) {
                    if (onboardingEl) onboardingEl.classList.add("hidden");
                    if (appShellEl) {
                        appShellEl.classList.remove("hidden");
                        appShellEl.classList.add("nexus-reveal-in");
                    }
                } else {
                    if (appShellEl) appShellEl.classList.add("hidden");
                    if (onboardingEl) {
                        onboardingEl.classList.remove("hidden");
                        onboardingEl.classList.add("nexus-reveal-in");
                    }
                }
            } catch (_) {}
        }

        wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    // Public API
    global.NexusBoot = new NexusHolographicBoot();

    global.replayNexusBoot = function () {
        sessionStorage.removeItem("nexus_boot_dismissed");
        global.NexusBoot.init(true);
    };

    // Auto-launch on DOM ready
    if (typeof document !== "undefined") {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => {
                global.NexusBoot.init();
            });
        } else {
            global.NexusBoot.init();
        }
    }

})(typeof window !== "undefined" ? window : this);
