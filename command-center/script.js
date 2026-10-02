/* =========================================================
   NEXUS AI — AI AGENT OPERATING SYSTEM
   Master Command Center Engine & Reactive Orchestrator
========================================================= */

(() => {
    "use strict";

    /* =====================================================
       1. CONSTANTS & STORAGE CONFIGURATION
    ====================================================== */
    const STORAGE_KEY = "nexus_ai_os_state_v2";

    /* =====================================================
       2. DEFAULT SYSTEM STATE (REALISTIC DEMO ARCHITECTURE)
    ====================================================== */
    const defaultState = {
        theme: "dark",
        telemetryActive: true,
        notificationsEnabled: true,
        currentWorkspaceId: "workspace-alpha",
        user: {
            name: "Commander",
            email: "commander@nexus.ai",
            role: "Lead Agent Architect"
        },
        workspaces: [
            { id: "workspace-alpha", name: "Command Alpha", focus: "Autonomous Operations", avatar: "NX" },
            { id: "workspace-beta", name: "Research Cluster Beta", focus: "Intelligence Gathering", avatar: "RC" },
            { id: "workspace-gamma", name: "Production Gateway", focus: "API & Microservices", avatar: "PG" }
        ],

        /* 8 INTELLIGENT FLEET AGENTS */
        agents: [
            {
                id: "agent-001",
                name: "Research Agent",
                role: "Research",
                model: "NEXUS Reasoner",
                status: "running",
                cpu: 42,
                memory: "380 MB",
                tasksCompleted: 42,
                successRate: 98,
                uptime: "99.8%",
                lastActive: "Just now",
                icon: "⌕",
                color: "cyan",
                description: "Deep web crawler, competitive intel compiler, and multi-source evidence synthesizer.",
                capabilities: ["Web Crawling", "Source Attribution", "Semantic Parsing", "Executive Summaries"],
                permissions: { internet: true, readDocs: true, searchInfo: true, deleteFiles: false, sendEmails: false, codeExec: false },
                memory: {
                    tasks: 42,
                    savedContexts: 18,
                    knowledgeItems: 126,
                    items: [
                        { title: "AI Framework Benchmarks 2026", desc: "Indexed 45 comparative metrics across autonomous reasoning models." },
                        { title: "Vector Embeddings Schema", desc: "Standardized cosine similarity thresholds for fast cross-document retrieval." },
                        { title: "Search Engine Indexer", desc: "Cached SERP result clusters for enterprise AI platforms." }
                    ]
                }
            },
            {
                id: "agent-002",
                name: "Data Analyst",
                role: "Analysis",
                model: "NEXUS Matrix",
                status: "running",
                cpu: 56,
                memory: "512 MB",
                tasksCompleted: 36,
                successRate: 97,
                uptime: "99.4%",
                lastActive: "3 min ago",
                icon: "◇",
                color: "purple",
                description: "Performs mathematical analysis, schema validation, anomaly detection, and predictive modeling.",
                capabilities: ["Data Cleansing", "Statistical Modeling", "Anomaly Detection", "JSON Aggregation"],
                permissions: { internet: true, readDocs: true, searchInfo: true, deleteFiles: false, sendEmails: false, codeExec: true },
                memory: {
                    tasks: 36,
                    savedContexts: 14,
                    knowledgeItems: 98,
                    items: [
                        { title: "Q3 Revenue Variance Matrix", desc: "Cleaned and aligned transactional records for quarterly forecast." },
                        { title: "Latency Regression Curve", desc: "Calculated p99 latency thresholds for LLM inference gateways." }
                    ]
                }
            },
            {
                id: "agent-003",
                name: "Coding Agent",
                role: "Coding",
                model: "NEXUS CodeX",
                status: "running",
                cpu: 67,
                memory: "640 MB",
                tasksCompleted: 28,
                successRate: 95,
                uptime: "99.2%",
                lastActive: "1 min ago",
                icon: "⌘",
                color: "blue",
                description: "Generates production-grade code, refactors architectural patterns, and resolves syntax lints.",
                capabilities: ["Code Generation", "AST Refactoring", "Unit Testing", "API Integration"],
                permissions: { internet: true, readDocs: true, searchInfo: true, deleteFiles: false, sendEmails: false, codeExec: true },
                memory: {
                    tasks: 28,
                    savedContexts: 22,
                    knowledgeItems: 145,
                    items: [
                        { title: "TypeScript Interface Repository", desc: "Cached common AST node representations for rapid codegen." },
                        { title: "FastAPI Boilerplate Spec", desc: "Stored secure async endpoint templates with JWT auth." }
                    ]
                }
            },
            {
                id: "agent-004",
                name: "Testing Agent",
                role: "Testing",
                model: "NEXUS Sentinel",
                status: "waiting",
                cpu: 12,
                memory: "210 MB",
                tasksCompleted: 19,
                successRate: 99,
                uptime: "98.9%",
                lastActive: "14 min ago",
                icon: "✓",
                color: "green",
                description: "Executes automated end-to-end test suites, fuzzing, validation checks, and load verification.",
                capabilities: ["Test Suite Automation", "Edge Case Fuzzing", "Regression Testing", "Assertion Reports"],
                permissions: { internet: false, readDocs: true, searchInfo: true, deleteFiles: false, sendEmails: false, codeExec: true },
                memory: {
                    tasks: 19,
                    savedContexts: 9,
                    knowledgeItems: 64,
                    items: [
                        { title: "Integration Test Suite #408", desc: "Verified 120 API endpoint contracts without regression." }
                    ]
                }
            },
            {
                id: "agent-005",
                name: "Report Agent",
                role: "Report",
                model: "NEXUS Synthesizer",
                status: "error",
                cpu: 0,
                memory: "180 MB",
                tasksCompleted: 15,
                successRate: 92,
                uptime: "97.5%",
                lastActive: "18 min ago",
                icon: "📄",
                color: "amber",
                description: "Compiles disparate analytical streams into polished executive briefings, charts, and deliverables.",
                capabilities: ["Document Formatting", "Markdown Rendering", "Chart Composition", "Executive Synthesis"],
                permissions: { internet: false, readDocs: true, searchInfo: true, deleteFiles: false, sendEmails: true, codeExec: false },
                memory: {
                    tasks: 15,
                    savedContexts: 11,
                    knowledgeItems: 52,
                    items: [
                        { title: "C-Level Digest Template", desc: "Stored executive layout guidelines for weekly briefings." }
                    ]
                }
            },
            {
                id: "agent-006",
                name: "Planning Agent",
                role: "Planning",
                model: "NEXUS Strategic",
                status: "running",
                cpu: 38,
                memory: "320 MB",
                tasksCompleted: 52,
                successRate: 99,
                uptime: "99.9%",
                lastActive: "Just now",
                icon: "✦",
                color: "purple",
                description: "Decomposes complex high-level objectives into dependency-ordered multi-agent execution graphs.",
                capabilities: ["Goal Decomposition", "Task Phasing", "DAG Orchestration", "Risk Hedging"],
                permissions: { internet: true, readDocs: true, searchInfo: true, deleteFiles: false, sendEmails: false, codeExec: false },
                memory: {
                    tasks: 52,
                    savedContexts: 31,
                    knowledgeItems: 180,
                    items: [
                        { title: "Mission Optimization Heuristics", desc: "Cached dynamic path routing for concurrent agent execution." }
                    ]
                }
            },
            {
                id: "agent-007",
                name: "Security Sentinel",
                role: "Security",
                model: "NEXUS Guard",
                status: "idle",
                cpu: 8,
                memory: "250 MB",
                tasksCompleted: 31,
                successRate: 100,
                uptime: "99.9%",
                lastActive: "22 min ago",
                icon: "🛡",
                color: "green",
                description: "Monitors agent outbound calls, enforces zero-trust permission policies, and detects anomalies.",
                capabilities: ["Policy Enforcement", "Traffic Auditing", "Credential Scrubbing", "Sandbox Containment"],
                permissions: { internet: false, readDocs: true, searchInfo: true, deleteFiles: false, sendEmails: false, codeExec: false },
                memory: {
                    tasks: 31,
                    savedContexts: 16,
                    knowledgeItems: 112,
                    items: [
                        { title: "Zero-Trust Rulepack v4", desc: "Enforces strict air-gapping on filesystem deletion calls." }
                    ]
                }
            },
            {
                id: "agent-008",
                name: "Web Scraper",
                role: "Research",
                model: "NEXUS Fetcher",
                status: "running",
                cpu: 44,
                memory: "410 MB",
                tasksCompleted: 63,
                successRate: 94,
                uptime: "98.6%",
                lastActive: "4 min ago",
                icon: "🕸",
                color: "cyan",
                description: "High-throughput asynchronous web page extractor with headless DOM evaluation and rate throttling.",
                capabilities: ["HTML Parsing", "Dynamic JS Crawling", "Robots Compliance", "Content Deduplication"],
                permissions: { internet: true, readDocs: true, searchInfo: true, deleteFiles: false, sendEmails: false, codeExec: false },
                memory: {
                    tasks: 63,
                    savedContexts: 25,
                    knowledgeItems: 210,
                    items: [
                        { title: "Target Domain Sitemap Cache", desc: "Cached indexing routes for major research repositories." }
                    ]
                }
            }
        ],

        /* 4 ACTIVE / REGISTERED MISSIONS */
        missions: [
            {
                id: "mission-101",
                name: "AI Tools Comparison",
                goal: "Research the latest AI tools and prepare a comparison report.",
                status: "running",
                progress: 80,
                started: "12 min ago",
                duration: "12m 45s",
                currentStep: "⏳ Generating report",
                agents: ["Planning Agent", "Research Agent", "Data Analyst", "Report Agent"],
                steps: [
                    { name: "Mission created & initialized", status: "done" },
                    { name: "Planning & task decomposition completed", status: "done" },
                    { name: "Multi-source research pipeline executed", status: "done" },
                    { name: "14 industry tools analyzed & benchmarked", status: "done" },
                    { name: "Executive comparative synthesis report", status: "active" }
                ],
                output: `# NEXUS AI — Comparative Analysis Report: Next-Gen Autonomous AI Tools\n\n## Executive Summary\nAutonomous AI systems in 2026 have shifted from single-turn chat interfaces to coordinated multi-agent operating platforms capable of self-directed execution.\n\n### Key Findings\n1. **Orchestration Efficiency**: DAG-based multi-agent routing delivers 3.8x faster completion on complex knowledge workflows.\n2. **Memory Persistence**: Vector retention graphs reduced hallucination rates to below 1.2% in enterprise testing.\n3. **Sandboxed Security**: Zero-trust permission boundaries prevented 100% of unauthorized data egress incidents.\n\n### Recommended Tooling Stack\n- **Core Planner**: NEXUS Strategic Reasoner\n- **Data Engine**: NEXUS Matrix Data Fabric\n- **Safety Guard**: NEXUS Sentinel Zero-Trust Containment`
            },
            {
                id: "mission-102",
                name: "Market Research & Competitor Intel",
                goal: "Conduct competitor intel and market positioning analysis for SaaS AI platforms.",
                status: "running",
                progress: 60,
                started: "28 min ago",
                duration: "28m 10s",
                currentStep: "✓ 12 sources analyzed",
                agents: ["Research Agent", "Data Analyst", "Web Scraper"],
                steps: [
                    { name: "Mission targets identified", status: "done" },
                    { name: "Scraping 12 public competitor documentation portals", status: "done" },
                    { name: "Synthesizing pricing & feature matrices", status: "active" },
                    { name: "SWOT analysis compilation", status: "pending" }
                ],
                output: `Market research underway. 12 competitor platforms ingested into memory vector index.`
            },
            {
                id: "mission-103",
                name: "Website Security & Vulnerability Audit",
                goal: "Perform automated security audit and vulnerability scans on API gateway.",
                status: "waiting",
                progress: 10,
                started: "45 min ago",
                duration: "45m 02s",
                currentStep: "⚠ Awaiting target authorization token",
                agents: ["Security Sentinel", "Testing Agent"],
                steps: [
                    { name: "Security audit scope configured", status: "done" },
                    { name: "Token authentication validation", status: "active" },
                    { name: "Endpoint fuzzing & TLS cipher inspection", status: "pending" },
                    { name: "Remediation recommendations report", status: "pending" }
                ],
                output: `Awaiting admin clearance to proceed with penetration simulation on target endpoint.`
            },
            {
                id: "mission-104",
                name: "Q3 Financial Data Analysis",
                goal: "Analyze multi-quarter revenue metrics and generate executive summary dashboard.",
                status: "completed",
                progress: 100,
                started: "2 hr ago",
                duration: "18m 20s",
                currentStep: "✓ Final Report Generated",
                agents: ["Planning Agent", "Data Analyst", "Report Agent"],
                steps: [
                    { name: "Financial data ingest completed", status: "done" },
                    { name: "Quarterly variance and CAGR modeled", status: "done" },
                    { name: "Executive visualization charts generated", status: "done" },
                    { name: "Final executive briefing compiled", status: "done" }
                ],
                output: `# Q3 Financial Performance Synthesis\n\n- Gross Operating Margin: **74.2%** (+4.1% YoY)\n- Agent Execution Efficiency Savings: **$420,000**\n- Autonomous Workflow Coverage: **86%**`
            }
        ],

        /* WORKFLOW DEFINITIONS */
        workflows: [
            {
                id: "wf-1",
                name: "Autonomous Research & Synthesis Pipeline",
                nodesCount: 4,
                status: "ready",
                description: "Input Stream -> Research Agent -> Analysis Agent -> Report Agent -> Executive Output"
            },
            {
                id: "wf-2",
                name: "Code Quality & Vulnerability Scan",
                nodesCount: 4,
                status: "ready",
                description: "Git Trigger -> Coding Agent -> Security Sentinel -> Testing Agent -> Deploy"
            },
            {
                id: "wf-3",
                name: "Data Ingestion & Report Generator",
                nodesCount: 3,
                status: "ready",
                description: "Data Stream -> Data Analyst -> Report Agent -> Storage"
            }
        ],

        /* AUDIT & ACTIVITY LOGS */
        activities: [
            { id: "act-1", time: "10:46:12", category: "agents", source: "Report Agent", desc: "Report generated for Q3 AI Landscape successfully", status: "SUCCESS" },
            { id: "act-2", time: "10:45:02", category: "agents", source: "Analysis Agent", desc: "Comparative evaluation completed on 14 tools", status: "SUCCESS" },
            { id: "act-3", time: "10:44:18", category: "agents", source: "Data Agent", desc: "Schema validation warning: minor JSON variance detected", status: "WARN" },
            { id: "act-4", time: "10:43:50", category: "workflows", source: "Workflow #12", desc: "Autonomous Research Pipeline initiated by Commander", status: "INFO" },
            { id: "act-5", time: "10:42:10", category: "missions", source: "Mission Engine", desc: "Mission: AI Tools Comparison entered Execution Phase", status: "SUCCESS" },
            { id: "act-6", time: "10:41:05", category: "agents", source: "Research Agent", desc: "Web crawling completed: 14 primary sources verified", status: "SUCCESS" },
            { id: "act-7", time: "10:38:22", category: "errors", source: "Report Agent", desc: "Transient sandbox timeout on PDF rendering pipe", status: "ERROR" },
            { id: "act-8", time: "10:35:14", category: "system", source: "NEXUS Core", desc: "Cluster health check passed. 8 nodes responding.", status: "INFO" }
        ],

        /* SMART ALERTS */
        alerts: [
            { id: "alt-1", type: "critical", icon: "🔴", title: "Report Agent Rendering Timeout", desc: "Agent failed to compile PDF deliverable on port 9042.", time: "18 min ago", resolved: false },
            { id: "alt-2", type: "warning", icon: "🟠", title: "Data Agent Schema Attention", desc: "Data Analyst requires schema alignment for Q3 variance records.", time: "25 min ago", resolved: false },
            { id: "alt-3", type: "resolved", icon: "🟢", title: "Mission Completed", desc: "Q3 Financial Data Analysis completed with 100% test assertions.", time: "2 hr ago", resolved: true },
            { id: "alt-4", type: "resolved", icon: "🟢", title: "Coding Agent Lint Resolved", desc: "Unit test suite #492 executed with zero failures.", time: "3 hr ago", resolved: true }
        ],

        /* MARKETPLACE CATALOG */
        marketplace: [
            { id: "mkt-1", name: "Strategic Planner", role: "Planning", desc: "Decomposes multi-step goals into DAG pipelines.", model: "NEXUS Strategic", category: "Productivity", rating: 4.9, active: true },
            { id: "mkt-2", name: "Deep Web Investigator", role: "Research", desc: "Autonomously searches, crawls, and aggregates evidence.", model: "NEXUS Reasoner", category: "Research", rating: 4.8, active: true },
            { id: "mkt-3", name: "Python Architect", role: "Coding", desc: "Writes, tests, and documents modern asynchronous Python.", model: "NEXUS CodeX", category: "Coding", rating: 4.9, active: true },
            { id: "mkt-4", name: "Statistical Modeler", role: "Data", desc: "Executes anomaly detection, linear regressions, and PCA.", model: "NEXUS Matrix", category: "Data", rating: 4.7, active: true },
            { id: "mkt-5", name: "Penetration Tester", role: "Testing", desc: "Simulates OWASP Top 10 vulnerabilities on API gateways.", model: "NEXUS Sentinel", category: "Testing", rating: 4.9, active: false },
            { id: "mkt-6", name: "Executive Ghostwriter", role: "Writing", desc: "Drafts high-stakes executive briefs, memos, and decks.", model: "NEXUS Synthesizer", category: "Writing", rating: 4.6, active: true },
            { id: "mkt-7", name: "DevOps Automator", role: "Automation", desc: "Provisions cloud environments, monitors CI/CD pipelines.", model: "NEXUS Ops", category: "Automation", rating: 4.8, active: false },
            { id: "mkt-8", name: "Financial Forecaster", role: "Analysis", desc: "Builds Monte Carlo simulations and cash flow models.", model: "NEXUS Quant", category: "Analysis", rating: 4.9, active: false }
        ]
    };

    /* =====================================================
       3. STATE CONTROLLER & LOCAL PERSISTENCE
    ====================================================== */
    let state = clone(defaultState);

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return clone(defaultState);
            const saved = JSON.parse(raw);
            return mergeState(clone(defaultState), saved);
        } catch (err) {
            console.warn("[NEXUS OS] Storage load error, falling back to defaults", err);
            return clone(defaultState);
        }
    }

    function mergeState(target, source) {
        if (!source || typeof source !== "object") return target;
        for (const key of Object.keys(source)) {
            if (source[key] !== null && typeof source[key] === "object" && !Array.isArray(source[key])) {
                target[key] = mergeState(target[key] || {}, source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (err) {
            console.error("[NEXUS OS] Storage save error", err);
        }
    }

    /* =====================================================
       4. INITIALIZATION ROUTINE
    ====================================================== */
    function init() {
        state = loadState();
        applyTheme(state.theme || "dark");
        setupClock();
        setupNavigation();
        setupModals();
        setupCommandPalette();
        setupMissionMode();
        setupAgentHub();
        setupWorkflowBuilder();
        setupInsights();
        setupActivityLogs();
        setupSmartAlerts();
        setupSecurityCenter();
        setupSettings();
        setupQuickActions();

        renderAll();

        if (state.telemetryActive) {
            startTelemetryHeartbeat();
        }

        console.log("%c[NEXUS AI OPERATING SYSTEM READY]", "color: #00f0ff; font-weight: bold; font-size: 14px;");
    }

    /* =====================================================
       5. SYSTEM TELEMETRY & CLOCK
    ====================================================== */
    function setupClock() {
        const clockEl = document.getElementById("systemClock");
        function update() {
            const now = new Date();
            if (clockEl) {
                clockEl.textContent = now.toTimeString().split(" ")[0] + " UTC";
            }
        }
        update();
        setInterval(update, 1000);
    }

    let telemetryInterval = null;
    function startTelemetryHeartbeat() {
        if (telemetryInterval) clearInterval(telemetryInterval);
        telemetryInterval = setInterval(() => {
            // Subtle simulated fluctuations in agent CPU & telemetry
            let runningCount = 0;
            state.agents.forEach(agent => {
                if (agent.status === "running") {
                    runningCount++;
                    const jitter = Math.floor(Math.random() * 9) - 4;
                    agent.cpu = Math.min(99, Math.max(15, agent.cpu + jitter));
                }
            });

            const sideCpu = document.getElementById("sideCpu");
            const sideMem = document.getElementById("sideMem");
            const meshLoadBar = document.getElementById("meshLoadBar");
            const activeRatio = document.getElementById("activeAgentRatio");

            if (sideCpu) {
                const totalCpu = Math.round(state.agents.reduce((acc, a) => acc + (a.status === "running" ? a.cpu : 0), 0) / (state.agents.length || 1));
                sideCpu.textContent = totalCpu + "%";
                if (meshLoadBar) meshLoadBar.style.width = Math.min(100, totalCpu * 1.3) + "%";
            }

            if (activeRatio) {
                activeRatio.textContent = `${runningCount} / ${state.agents.length} Active`;
            }

            // Update live agent table CPU displays if on Command Center
            updateLiveAgentCpuDisplays();

        }, 3000);
    }

    function updateLiveAgentCpuDisplays() {
        const rows = document.querySelectorAll(".agent-live-row");
        rows.forEach(row => {
            const id = row.getAttribute("data-agent-id");
            const agent = state.agents.find(a => a.id === id);
            if (agent) {
                const cpuVal = row.querySelector(".agent-cpu-val");
                const cpuBar = row.querySelector(".cpu-load-fill");
                if (cpuVal && cpuBar) {
                    cpuVal.textContent = agent.status === "running" ? agent.cpu + "%" : "--";
                    cpuBar.style.width = agent.status === "running" ? agent.cpu + "%" : "0%";
                }
            }
        });
    }

    /* =====================================================
       6. THEME CONTROLLER
    ====================================================== */
    function applyTheme(theme) {
        state.theme = theme;
        if (theme === "light") {
            document.body.classList.remove("theme-dark");
            document.body.classList.add("theme-light");
        } else {
            document.body.classList.remove("theme-light");
            document.body.classList.add("theme-dark");
        }
        saveState();
    }

    /* =====================================================
       7. NAVIGATION ROUTER
    ====================================================== */
    function setupNavigation() {
        const navItems = document.querySelectorAll(".nav-item[data-page]");
        const pages = document.querySelectorAll(".page");
        const breadcrumbName = document.getElementById("breadcrumbName");

        function navigateTo(pageId) {
            navItems.forEach(item => {
                item.classList.toggle("active", item.getAttribute("data-page") === pageId);
            });

            pages.forEach(page => {
                const isTarget = page.id === `page-${pageId}`;
                page.classList.toggle("active", isTarget);
            });

            // Update breadcrumb
            const activeNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
            if (breadcrumbName && activeNav) {
                const text = activeNav.querySelector(".nav-text")?.textContent || "Command Center";
                breadcrumbName.textContent = text;
            }

            // Close mobile sidebar if open
            const sidebar = document.getElementById("sidebar");
            const overlay = document.getElementById("sidebarOverlay");
            if (sidebar) sidebar.classList.remove("open");
            if (overlay) overlay.classList.add("hidden");

            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        navItems.forEach(btn => {
            btn.addEventListener("click", () => {
                const target = btn.getAttribute("data-page");
                if (target) navigateTo(target);
            });
        });

        // Quick page switchers via [data-go]
        document.addEventListener("click", (e) => {
            const goBtn = e.target.closest("[data-go]");
            if (goBtn) {
                const target = goBtn.getAttribute("data-go");
                if (target) navigateTo(target);
            }
        });

        // Mobile sidebar toggle
        const openSidebar = document.getElementById("openSidebar");
        const closeSidebar = document.getElementById("closeSidebar");
        const sidebar = document.getElementById("sidebar");
        const sidebarOverlay = document.getElementById("sidebarOverlay");

        if (openSidebar && sidebar) {
            openSidebar.addEventListener("click", () => {
                sidebar.classList.add("open");
                if (sidebarOverlay) sidebarOverlay.classList.remove("hidden");
            });
        }

        if (closeSidebar && sidebar) {
            closeSidebar.addEventListener("click", () => {
                sidebar.classList.remove("open");
                if (sidebarOverlay) sidebarOverlay.classList.add("hidden");
            });
        }

        if (sidebarOverlay && sidebar) {
            sidebarOverlay.addEventListener("click", () => {
                sidebar.classList.remove("open");
                sidebarOverlay.classList.add("hidden");
            });
        }

        // Theme toggle button
        const themeBtn = document.getElementById("themeBtn");
        if (themeBtn) {
            themeBtn.addEventListener("click", () => {
                const next = state.theme === "dark" ? "light" : "dark";
                applyTheme(next);
                showToast(`Switched to ${next} theme`, "info");
            });
        }
    }

    /* =====================================================
       8. GLOBAL RENDER ENGINE
    ====================================================== */
    function renderAll() {
        renderTopMetrics();
        renderActiveMissions();
        renderLiveAgentTable();
        renderAgentPerformanceMini();
        renderRecentActivity();
        renderMissionsRegistry();
        renderAgentHub();
        renderInsights();
        renderFullActivityLogs();
        renderAlertsFeed();
        renderPermissionsTable();
        renderBadges();
    }

    function renderBadges() {
        const missionBadge = document.getElementById("missionBadge");
        const agentBadge = document.getElementById("agentBadge");
        const alertsBadge = document.getElementById("alertsNavBadge");
        const notifDot = document.getElementById("notificationDot");
        const notifCount = document.getElementById("notifCountLabel");

        const activeMissionsCount = state.missions.filter(m => m.status === "running").length;
        const totalAgentsCount = state.agents.length;
        const activeAlertsCount = state.alerts.filter(a => !a.resolved).length;

        if (missionBadge) missionBadge.textContent = String(activeMissionsCount).padStart(2, "0");
        if (agentBadge) agentBadge.textContent = String(totalAgentsCount).padStart(2, "0");
        if (alertsBadge) alertsBadge.textContent = String(activeAlertsCount).padStart(2, "0");
        if (notifDot) notifDot.style.display = activeAlertsCount > 0 ? "block" : "none";
        if (notifCount) notifCount.textContent = `${activeAlertsCount} Active`;

        // Notification dropdown items
        const notifList = document.getElementById("notificationList");
        if (notifList) {
            const activeAlerts = state.alerts.filter(a => !a.resolved);
            if (activeAlerts.length === 0) {
                notifList.innerHTML = `<div class="empty-state-box" style="padding:10px;"><small>No active alerts</small></div>`;
            } else {
                notifList.innerHTML = activeAlerts.map(a => `
                    <div class="dropdown-item">
                        <b>${escapeHtml(a.title)}</b>
                        <small style="color:var(--text-muted);display:block;">${escapeHtml(a.time)}</small>
                    </div>
                `).join("");
            }
        }
    }

    /* =====================================================
       9. COMMAND CENTER: KPI METRICS & ACTIVE MISSIONS
    ====================================================== */
    function renderTopMetrics() {
        const totalAgents = state.agents.length;
        const activeAgents = state.agents.filter(a => a.status === "running").length;
        const idleAgents = state.agents.filter(a => a.status === "idle").length;
        const failedAgents = state.agents.filter(a => a.status === "error").length;

        const activeMissions = state.missions.filter(m => m.status === "running").length;
        const waitingMissions = state.missions.filter(m => m.status === "waiting").length;
        const completedMissions = state.missions.filter(m => m.status === "completed").length;

        const completedTasks = state.agents.reduce((acc, a) => acc + a.tasksCompleted, 0);
        const activeAlerts = state.alerts.filter(a => !a.resolved).length;

        setText("metricTotalAgents", String(totalAgents).padStart(2, "0"));
        setText("metricActiveAgents", String(activeAgents).padStart(2, "0"));
        setText("metricIdleAgents", String(idleAgents).padStart(2, "0"));
        setText("metricFailedAgents", String(failedAgents).padStart(2, "0"));

        setText("metricActiveMissions", String(activeMissions).padStart(2, "0"));
        setText("metricRunningMissions", String(activeMissions).padStart(2, "0"));
        setText("metricWaitingMissions", String(waitingMissions).padStart(2, "0"));
        setText("metricCompletedMissions", String(completedMissions).padStart(2, "0"));

        setText("metricCompletedTasks", String(completedTasks));
        setText("metricTotalAlerts", String(activeAlerts).padStart(2, "0"));
    }

    function renderActiveMissions() {
        const container = document.getElementById("activeMissionsGrid");
        if (!container) return;

        const active = state.missions.filter(m => m.status !== "completed");
        if (active.length === 0) {
            container.innerHTML = `
                <div class="empty-state-box full-width" style="padding: 30px; background: var(--surface-1); border-radius: var(--radius-md);">
                    <span class="empty-icon">🎯</span>
                    <p>No active missions running right now.</p>
                    <button class="primary-btn sm" id="emptyLaunchMissionBtn">Launch Mission</button>
                </div>
            `;
            const emptyBtn = document.getElementById("emptyLaunchMissionBtn");
            if (emptyBtn) emptyBtn.addEventListener("click", () => openNewMissionModal());
            return;
        }

        container.innerHTML = active.map(mission => `
            <div class="mission-card ${mission.status}">
                <div class="mission-card-header">
                    <div class="mission-card-title">
                        <b>${escapeHtml(mission.name)}</b>
                        <small>Started ${escapeHtml(mission.started)}</small>
                    </div>
                    <span class="mission-badge ${mission.status}">${escapeHtml(mission.status)}</span>
                </div>

                <div class="mission-progress-container">
                    <div class="mission-progress-meta">
                        <span class="mission-step-text">${escapeHtml(mission.currentStep)}</span>
                        <span class="mission-percent">${mission.progress}%</span>
                    </div>
                    <div class="mission-bar-track">
                        <div class="mission-bar-fill" style="width: ${mission.progress}%;"></div>
                    </div>
                </div>

                <div class="mission-agents-involved">
                    <span>Agents:</span>
                    ${mission.agents.map(ag => `<span class="agent-pill-tag">${escapeHtml(ag)}</span>`).join("")}
                </div>

                <div class="mission-card-actions">
                    <button class="secondary-button sm inspect-mission-btn" data-mission-id="${mission.id}">View Details</button>
                    ${mission.status === "running" ? `
                        <button class="secondary-button sm pause-mission-btn" data-mission-id="${mission.id}">Pause</button>
                    ` : `
                        <button class="secondary-button sm resume-mission-btn" data-mission-id="${mission.id}">Resume</button>
                    `}
                    <button class="danger-button sm stop-mission-btn" data-mission-id="${mission.id}">Stop</button>
                    ${mission.progress >= 80 ? `
                        <button class="primary-btn sm view-result-btn" data-mission-id="${mission.id}" style="margin-left: auto;">View Result</button>
                    ` : ""}
                </div>
            </div>
        `).join("");

        // Attach listeners
        container.querySelectorAll(".inspect-mission-btn").forEach(btn => {
            btn.addEventListener("click", () => openMissionDetailsModal(btn.getAttribute("data-mission-id")));
        });
        container.querySelectorAll(".view-result-btn").forEach(btn => {
            btn.addEventListener("click", () => openMissionDetailsModal(btn.getAttribute("data-mission-id")));
        });
        container.querySelectorAll(".pause-mission-btn").forEach(btn => {
            btn.addEventListener("click", () => toggleMissionPause(btn.getAttribute("data-mission-id"), true));
        });
        container.querySelectorAll(".resume-mission-btn").forEach(btn => {
            btn.addEventListener("click", () => toggleMissionPause(btn.getAttribute("data-mission-id"), false));
        });
        container.querySelectorAll(".stop-mission-btn").forEach(btn => {
            btn.addEventListener("click", () => stopMission(btn.getAttribute("data-mission-id")));
        });
    }

    /* =====================================================
       10. LIVE AGENT STATUS TABLE & MINI PERFORMANCE
    ====================================================== */
    function renderLiveAgentTable() {
        const tbody = document.getElementById("liveAgentTableBody");
        if (!tbody) return;

        tbody.innerHTML = state.agents.map(agent => `
            <tr class="agent-live-row" data-agent-id="${agent.id}">
                <td>
                    <div class="table-agent-name">
                        <span class="table-agent-icon">${agent.icon}</span>
                        <div>
                            <b>${escapeHtml(agent.name)}</b>
                            <small style="display:block; font-size:10px; color:var(--text-muted);">${escapeHtml(agent.model)}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="status-pill ${agent.status}">
                        <i class="dot ${getStatusDotColor(agent.status)}"></i>
                        ${escapeHtml(agent.status.toUpperCase())}
                    </span>
                </td>
                <td>
                    <div class="cpu-load-track">
                        <div class="cpu-load-fill" style="width: ${agent.status === 'running' ? agent.cpu : 0}%;"></div>
                    </div>
                    <span class="agent-cpu-val" style="font-family:'JetBrains Mono'; font-size:11px;">
                        ${agent.status === "running" ? agent.cpu + "%" : "--"}
                    </span>
                </td>
                <td style="font-family:'JetBrains Mono'; font-size:11px;">${escapeHtml(agent.memory)}</td>
                <td style="font-family:'JetBrains Mono'; font-size:11px;"><b>${agent.tasksCompleted}</b></td>
                <td>
                    <div style="display:flex; gap:6px;">
                        <button class="secondary-button sm run-agent-quick" data-agent-id="${agent.id}" title="Run single cycle">▶</button>
                        <button class="secondary-button sm toggle-agent-status" data-agent-id="${agent.id}" title="Toggle status">
                            ${agent.status === "running" ? "⏸" : "⏵"}
                        </button>
                    </div>
                </td>
            </tr>
        `).join("");

        tbody.querySelectorAll(".run-agent-quick").forEach(btn => {
            btn.addEventListener("click", () => runAgentSingleCycle(btn.getAttribute("data-agent-id")));
        });

        tbody.querySelectorAll(".toggle-agent-status").forEach(btn => {
            btn.addEventListener("click", () => toggleAgentStatus(btn.getAttribute("data-agent-id")));
        });
    }

    function getStatusDotColor(status) {
        if (status === "running") return "green";
        if (status === "waiting") return "yellow";
        if (status === "error") return "red";
        return "idle";
    }

    function renderAgentPerformanceMini() {
        const container = document.getElementById("agentPerformanceMini");
        if (!container) return;

        // Top 4 agents
        const topAgents = state.agents.slice(0, 4);
        container.innerHTML = topAgents.map(ag => `
            <div class="perf-bar-row">
                <div class="perf-bar-header">
                    <span class="perf-bar-name">${escapeHtml(ag.name)}</span>
                    <span class="perf-bar-val">${ag.successRate}% Success</span>
                </div>
                <div class="perf-track">
                    <div class="perf-fill" style="width: ${ag.successRate}%;"></div>
                </div>
            </div>
        `).join("");
    }

    function renderRecentActivity() {
        const container = document.getElementById("recentActivityStream");
        if (!container) return;

        const recent = state.activities.slice(0, 4);
        container.innerHTML = recent.map(act => `
            <div class="activity-item">
                <div class="activity-badge ${getActivityBadgeClass(act.status)}">
                    ${getActivityBadgeIcon(act.status)}
                </div>
                <div class="activity-content">
                    <span class="activity-msg">
                        <strong style="color:var(--cyan); margin-right:6px;">[${escapeHtml(act.source)}]</strong>
                        ${escapeHtml(act.desc)}
                    </span>
                    <span class="activity-time">${escapeHtml(act.time)}</span>
                </div>
            </div>
        `).join("");
    }

    function getActivityBadgeClass(status) {
        if (status === "SUCCESS") return "success";
        if (status === "WARN") return "warning";
        if (status === "ERROR") return "error";
        return "info";
    }

    function getActivityBadgeIcon(status) {
        if (status === "SUCCESS") return "✓";
        if (status === "WARN") return "⚠";
        if (status === "ERROR") return "✕";
        return "✦";
    }

    /* =====================================================
       11. MISSION MODE IMPLEMENTATION (SECTION 4 & 19)
    ====================================================== */
    function setupMissionMode() {
        const goalForm = document.getElementById("goalMissionForm");
        const goalInput = document.getElementById("goalInput");
        const openMissionModalBtn = document.getElementById("openMissionModalBtn");
        const cmdNewMissionBtn = document.getElementById("cmdNewMissionBtn");
        const quickNewMission = document.getElementById("quickNewMission");
        const topNewMissionBtn = document.getElementById("topNewMissionBtn");
        const missionSectionAddBtn = document.getElementById("missionSectionAddBtn");
        const clearCompletedBtn = document.getElementById("clearCompletedMissionsBtn");

        if (goalForm && goalInput) {
            goalForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const text = goalInput.value.trim();
                if (text) {
                    deployMissionFromGoal(text);
                    goalInput.value = "";
                }
            });
        }

        // Preset goal pills
        document.querySelectorAll(".preset-pill").forEach(pill => {
            pill.addEventListener("click", () => {
                const goal = pill.getAttribute("data-preset");
                if (goal) deployMissionFromGoal(goal);
            });
        });

        // Add Mission Modal triggers
        [openMissionModalBtn, cmdNewMissionBtn, quickNewMission, topNewMissionBtn, missionSectionAddBtn].forEach(b => {
            if (b) b.addEventListener("click", () => openNewMissionModal());
        });

        if (clearCompletedBtn) {
            clearCompletedBtn.addEventListener("click", () => {
                state.missions = state.missions.filter(m => m.status !== "completed");
                saveState();
                renderAll();
                showToast("Cleared completed missions from registry", "info");
            });
        }

        // Filter tabs for missions registry
        document.querySelectorAll(".mission-filter-tabs .filter-tab").forEach(tab => {
            tab.addEventListener("click", () => {
                document.querySelectorAll(".mission-filter-tabs .filter-tab").forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                renderMissionsRegistry(tab.getAttribute("data-filter"));
            });
        });
    }

    function deployMissionFromGoal(goalText) {
        const id = "mission-" + Date.now().toString().slice(-4);
        const title = goalText.length > 36 ? goalText.slice(0, 34) + "..." : goalText;

        const newMission = {
            id: id,
            name: title,
            goal: goalText,
            status: "running",
            progress: 10,
            started: "Just now",
            duration: "0m 05s",
            currentStep: "✓ Mission created & decomposed",
            agents: ["Planning Agent", "Research Agent", "Data Analyst", "Report Agent"],
            steps: [
                { name: "Mission objective received & registered", status: "done" },
                { name: "Planning Agent: Task decomposition & DAG generation", status: "active" },
                { name: "Research Agent: Multi-source web crawling", status: "pending" },
                { name: "Analysis Agent: Data transformation & insight extraction", status: "pending" },
                { name: "Report Agent: Executive deliverable compilation", status: "pending" }
            ],
            output: `Mission in flight: "${goalText}". Processing multi-agent pipeline.`
        };

        state.missions.unshift(newMission);

        // Add activity log
        logActivity("missions", "Mission Engine", `Mission deployed: "${title}"`, "SUCCESS");

        // Set agents to running
        ["agent-001", "agent-002", "agent-006"].forEach(aid => {
            const ag = state.agents.find(a => a.id === aid);
            if (ag) ag.status = "running";
        });

        saveState();
        renderAll();
        showToast(`Mission "${title}" deployed successfully!`, "success");

        // Simulate progressive pipeline advancement
        simulateMissionPipeline(id);
    }

    function simulateMissionPipeline(missionId) {
        let step = 1;
        const interval = setInterval(() => {
            const mission = state.missions.find(m => m.id === missionId);
            if (!mission || mission.status !== "running") {
                clearInterval(interval);
                return;
            }

            step++;
            if (step === 2) {
                mission.progress = 30;
                mission.currentStep = "✓ Planning completed. Research started";
                mission.steps[1].status = "done";
                mission.steps[2].status = "active";
                logActivity("agents", "Planning Agent", `Generated 4 subtasks for ${mission.name}`, "SUCCESS");
            } else if (step === 3) {
                mission.progress = 60;
                mission.currentStep = "✓ 14 sources analyzed by Data Agent";
                mission.steps[2].status = "done";
                mission.steps[3].status = "active";
                logActivity("agents", "Research Agent", `Harvested 14 authoritative sources`, "SUCCESS");
            } else if (step === 4) {
                mission.progress = 85;
                mission.currentStep = "⏳ Generating executive report";
                mission.steps[3].status = "done";
                mission.steps[4].status = "active";
                logActivity("agents", "Analysis Agent", `Synthesized comparative SWOT matrix`, "SUCCESS");
            } else if (step >= 5) {
                mission.progress = 100;
                mission.status = "completed";
                mission.currentStep = "✓ Final Result Ready";
                mission.steps[4].status = "done";
                mission.output = `# Final Deliverable: ${mission.goal}\n\n## Autonomous Execution Summary\n- **Target Goal**: ${mission.goal}\n- **Pipeline Duration**: 42 seconds\n- **Agents Engaged**: Planning Agent, Research Agent, Data Analyst, Report Agent\n\n### Strategic Findings & Insights\n1. **High Confidence Verification**: 98.4% assertion accuracy achieved across cross-referenced sources.\n2. **Zero Safety Violations**: Sandboxed containment verified by Security Sentinel.\n3. **Actionable Roadmap**: All operational dependencies satisfied. Ready for downstream implementation.`;

                logActivity("missions", "Mission Engine", `Mission "${mission.name}" completed 100%`, "SUCCESS");

                // Trigger alert
                state.alerts.unshift({
                    id: "alt-" + Date.now(),
                    type: "resolved",
                    icon: "🟢",
                    title: `Mission Completed: ${mission.name}`,
                    desc: "Autonomous pipeline delivered executive result.",
                    time: "Just now",
                    resolved: true
                });

                showToast(`Mission Completed: ${mission.name}`, "success");
                clearInterval(interval);
            }

            saveState();
            renderAll();
        }, 3500);
    }

    function toggleMissionPause(id, pause) {
        const m = state.missions.find(x => x.id === id);
        if (!m) return;
        m.status = pause ? "waiting" : "running";
        if (pause) {
            m.currentStep = "⏸ Mission paused by operator";
            logActivity("missions", "Commander", `Mission "${m.name}" paused`, "WARN");
        } else {
            m.currentStep = "▶ Mission resumed";
            logActivity("missions", "Commander", `Mission "${m.name}" resumed`, "INFO");
            simulateMissionPipeline(id);
        }
        saveState();
        renderAll();
    }

    function stopMission(id) {
        const m = state.missions.find(x => x.id === id);
        if (!m) return;
        m.status = "completed";
        m.currentStep = "⏹ Mission terminated by operator";
        logActivity("missions", "Commander", `Mission "${m.name}" stopped manually`, "WARN");
        saveState();
        renderAll();
        showToast(`Mission "${m.name}" stopped`, "warning");
    }

    function renderMissionsRegistry(filter = "all") {
        const tbody = document.getElementById("missionsTableBody");
        if (!tbody) return;

        let filtered = state.missions;
        if (filter === "running") filtered = filtered.filter(m => m.status === "running");
        if (filter === "waiting") filtered = filtered.filter(m => m.status === "waiting");
        if (filter === "completed") filtered = filtered.filter(m => m.status === "completed");

        // Update counts in tabs
        setText("countMissionsAll", state.missions.length);
        setText("countMissionsRunning", state.missions.filter(m => m.status === "running").length);
        setText("countMissionsQueued", state.missions.filter(m => m.status === "waiting").length);
        setText("countMissionsDone", state.missions.filter(m => m.status === "completed").length);

        // Update Showcase card on Mission Page
        renderMissionShowcase();

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; color:var(--text-muted);">No missions found in this category.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(m => `
            <tr>
                <td>
                    <b>${escapeHtml(m.name)}</b>
                    <small style="display:block; color:var(--text-muted); font-size:10px;">${escapeHtml(m.goal.slice(0, 48))}...</small>
                </td>
                <td>
                    <span class="mission-badge ${m.status}">${escapeHtml(m.status)}</span>
                </td>
                <td style="min-width: 140px;">
                    <div style="display:flex; justify-content:space-between; font-size:10px; margin-bottom:4px;">
                        <span>${m.progress}%</span>
                        <small style="color:var(--text-muted);">${escapeHtml(m.currentStep.slice(0, 20))}...</small>
                    </div>
                    <div class="mission-bar-track" style="height:5px;">
                        <div class="mission-bar-fill" style="width: ${m.progress}%;"></div>
                    </div>
                </td>
                <td>
                    <div style="display:flex; gap:4px; flex-wrap:wrap;">
                        ${m.agents.map(a => `<span class="agent-pill-tag">${escapeHtml(a.split(" ")[0])}</span>`).join("")}
                    </div>
                </td>
                <td style="font-family:'JetBrains Mono'; font-size:10px;">${escapeHtml(m.started)}</td>
                <td>
                    <button class="secondary-button sm inspect-registry-mission" data-mission-id="${m.id}">Inspect</button>
                </td>
            </tr>
        `).join("");

        tbody.querySelectorAll(".inspect-registry-mission").forEach(btn => {
            btn.addEventListener("click", () => openMissionDetailsModal(btn.getAttribute("data-mission-id")));
        });
    }

    function renderMissionShowcase() {
        const container = document.getElementById("activeMissionShowcase");
        if (!container) return;

        const primeMission = state.missions.find(m => m.status === "running") || state.missions[0];
        if (!primeMission) {
            container.innerHTML = "";
            return;
        }

        container.innerHTML = `
            <div class="showcase-card">
                <div class="showcase-header">
                    <div class="showcase-title-area">
                        <span class="cyber-badge">PRIMARY OBJECTIVE SHOWCASE</span>
                        <h2>🎯 ${escapeHtml(primeMission.name)}</h2>
                        <div class="showcase-meta-row">
                            <span>Status: <b class="text-cyan">${primeMission.status.toUpperCase()}</b></span>
                            <span>Duration: <b>${primeMission.duration}</b></span>
                            <span>Progress: <b class="text-cyan">${primeMission.progress}%</b></span>
                        </div>
                    </div>

                    <div class="showcase-controls">
                        <button class="secondary-button sm" id="showcaseViewDetailsBtn">View Output</button>
                        ${primeMission.status === "running" ? `
                            <button class="secondary-button sm" id="showcasePauseBtn">Pause</button>
                        ` : `
                            <button class="secondary-button sm" id="showcaseResumeBtn">Resume</button>
                        `}
                        <button class="danger-button sm" id="showcaseStopBtn">Stop Mission</button>
                    </div>
                </div>

                <div class="mission-bar-track" style="height: 10px;">
                    <div class="mission-bar-fill" style="width: ${primeMission.progress}%;"></div>
                </div>

                <div class="showcase-pipeline-steps">
                    ${primeMission.steps.map((st, i) => `
                        <div class="pipeline-step-item ${st.status}">
                            <span class="step-icon">${st.status === 'done' ? '✓' : st.status === 'active' ? '⏳' : '○'}</span>
                            <span>${escapeHtml(st.name)}</span>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;

        const viewBtn = document.getElementById("showcaseViewDetailsBtn");
        if (viewBtn) viewBtn.addEventListener("click", () => openMissionDetailsModal(primeMission.id));

        const pauseBtn = document.getElementById("showcasePauseBtn");
        if (pauseBtn) pauseBtn.addEventListener("click", () => toggleMissionPause(primeMission.id, true));

        const resumeBtn = document.getElementById("showcaseResumeBtn");
        if (resumeBtn) resumeBtn.addEventListener("click", () => toggleMissionPause(primeMission.id, false));

        const stopBtn = document.getElementById("showcaseStopBtn");
        if (stopBtn) stopBtn.addEventListener("click", () => stopMission(primeMission.id));
    }

    /* MISSION DETAILS & OUTPUT MODAL */
    function openMissionDetailsModal(missionId) {
        const mission = state.missions.find(m => m.id === missionId);
        if (!mission) return;

        const overlay = document.getElementById("missionDetailsOverlay");
        const titleEl = document.getElementById("mdModalTitle");
        const bodyEl = document.getElementById("mdModalBody");

        if (titleEl) titleEl.textContent = `Mission: ${mission.name}`;

        if (bodyEl) {
            bodyEl.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:16px;">
                    <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:12px; background:var(--surface-light); padding:12px; border-radius:var(--radius-md);">
                        <div><small style="color:var(--text-muted);display:block;">Status</small><b class="text-cyan">${mission.status.toUpperCase()}</b></div>
                        <div><small style="color:var(--text-muted);display:block;">Progress</small><b>${mission.progress}%</b></div>
                        <div><small style="color:var(--text-muted);display:block;">Elapsed</small><b>${mission.duration}</b></div>
                        <div><small style="color:var(--text-muted);display:block;">Agents</small><b>${mission.agents.length} Active</b></div>
                    </div>

                    <div>
                        <h4 style="font-size:12px; color:var(--text-muted); margin-bottom:6px;">GOAL SPECIFICATION</h4>
                        <p style="font-size:13px; color:var(--text-main); line-height:1.5;">${escapeHtml(mission.goal)}</p>
                    </div>

                    <div>
                        <h4 style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">EXECUTION PIPELINE PHASES</h4>
                        <div class="showcase-pipeline-steps">
                            ${mission.steps.map(st => `
                                <div class="pipeline-step-item ${st.status}">
                                    <span class="step-icon">${st.status === 'done' ? '✓' : st.status === 'active' ? '⏳' : '○'}</span>
                                    <span>${escapeHtml(st.name)}</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>

                    <div>
                        <h4 style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">DELIVERABLE OUTPUT STREAM</h4>
                        <div style="background:#020408; border:1px solid var(--border); border-radius:var(--radius-md); padding:16px; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.6; color:#a7f3d0; max-height:240px; overflow-y:auto; white-space:pre-wrap;">${escapeHtml(mission.output)}</div>
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:10px; padding-top:12px; border-top:1px solid var(--border);">
                        <button class="secondary-button" id="copyMissionOutputBtn">Copy Output</button>
                        <button class="primary-btn" id="closeMissionModalInner">Close</button>
                    </div>
                </div>
            `;

            const copyBtn = document.getElementById("copyMissionOutputBtn");
            if (copyBtn) {
                copyBtn.addEventListener("click", () => {
                    navigator.clipboard.writeText(mission.output);
                    showToast("Mission output copied to clipboard", "success");
                });
            }

            const closeInner = document.getElementById("closeMissionModalInner");
            if (closeInner) {
                closeInner.addEventListener("click", () => {
                    if (overlay) overlay.classList.add("hidden");
                });
            }
        }

        if (overlay) overlay.classList.remove("hidden");
    }

    /* =====================================================
       12. AGENT HUB IMPLEMENTATION (SECTIONS 5, 6, 8, 9)
    ====================================================== */
    function setupAgentHub() {
        // Sub-tabs
        document.querySelectorAll(".sub-tab-btn").forEach(tab => {
            tab.addEventListener("click", () => {
                document.querySelectorAll(".sub-tab-btn").forEach(t => t.classList.remove("active"));
                document.querySelectorAll(".subtab-content").forEach(c => c.classList.add("hidden"));

                tab.classList.add("active");
                const target = tab.getAttribute("data-subtab");
                const content = document.getElementById(`subtab-${target}`);
                if (content) content.classList.remove("hidden");
            });
        });

        // Search & filter
        const searchInput = document.getElementById("agentSearchInput");
        const roleFilter = document.getElementById("agentRoleFilter");
        const statusFilter = document.getElementById("agentStatusFilter");

        if (searchInput) searchInput.addEventListener("input", () => renderAgentHub());
        if (roleFilter) roleFilter.addEventListener("change", () => renderAgentHub());
        if (statusFilter) statusFilter.addEventListener("change", () => renderAgentHub());

        // Marketplace category pills
        document.querySelectorAll(".cat-pill").forEach(pill => {
            pill.addEventListener("click", () => {
                document.querySelectorAll(".cat-pill").forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
                renderMarketplace(pill.getAttribute("data-cat"));
            });
        });

        // Playground controls
        setupPlayground();

        // Memory Inspector controls
        setupMemoryInspector();

        // Create Agent buttons
        const createBtn = document.getElementById("createAgentMainBtn");
        const quickCreateAgent = document.getElementById("quickCreateAgent");
        [createBtn, quickCreateAgent].forEach(b => {
            if (b) b.addEventListener("click", () => openCreateAgentModal());
        });

        // Jump to playground
        const jumpPlay = document.getElementById("launchPlaygroundTabBtn");
        if (jumpPlay) {
            jumpPlay.addEventListener("click", () => {
                const tab = document.querySelector('.sub-tab-btn[data-subtab="playground"]');
                if (tab) tab.click();
            });
        }
    }

    function renderAgentHub() {
        renderAgentFleetGrid();
        renderMarketplace();
    }

    function renderAgentFleetGrid() {
        const grid = document.getElementById("agentFleetGrid");
        if (!grid) return;

        const search = (document.getElementById("agentSearchInput")?.value || "").toLowerCase();
        const roleVal = document.getElementById("agentRoleFilter")?.value || "all";
        const statusVal = document.getElementById("agentStatusFilter")?.value || "all";

        let filtered = state.agents.filter(a => {
            const matchesSearch = a.name.toLowerCase().includes(search) || a.role.toLowerCase().includes(search) || a.model.toLowerCase().includes(search);
            const matchesRole = roleVal === "all" || a.role === roleVal;
            const matchesStatus = statusVal === "all" || a.status === statusVal;
            return matchesSearch && matchesRole && matchesStatus;
        });

        const countEl = document.getElementById("hubFleetCount");
        if (countEl) countEl.textContent = state.agents.length;

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="empty-state-box full-width" style="grid-column: 1 / -1; padding: 40px; background:var(--surface-1); border-radius:var(--radius-lg);">
                    <span class="empty-icon">🤖</span>
                    <p>No agents match your filter criteria.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(agent => `
            <div class="agent-card" data-agent-id="${agent.id}">
                <div class="agent-card-top">
                    <div class="agent-brand">
                        <div class="agent-icon-box">${agent.icon}</div>
                        <div class="agent-title-info">
                            <strong>${escapeHtml(agent.name)}</strong>
                            <small>${escapeHtml(agent.model)}</small>
                        </div>
                    </div>
                    <span class="status-pill ${agent.status}">
                        <i class="dot ${getStatusDotColor(agent.status)}"></i>
                        ${escapeHtml(agent.status)}
                    </span>
                </div>

                <p class="agent-desc">${escapeHtml(agent.description)}</p>

                <div class="agent-meta-metrics">
                    <div class="meta-metric-col">
                        <span>Tasks</span>
                        <b>${agent.tasksCompleted}</b>
                    </div>
                    <div class="meta-metric-col">
                        <span>Success</span>
                        <b>${agent.successRate}%</b>
                    </div>
                    <div class="meta-metric-col">
                        <span>CPU</span>
                        <b>${agent.status === "running" ? agent.cpu + "%" : "--"}</b>
                    </div>
                </div>

                <div class="agent-card-footer">
                    <button class="secondary-button sm run-agent-hub-btn" data-agent-id="${agent.id}">
                        <span>▶</span> Run
                    </button>
                    <button class="secondary-button sm mem-agent-hub-btn" data-agent-id="${agent.id}">
                        <span>🧠</span> Memory
                    </button>
                    <button class="secondary-button sm config-agent-hub-btn" data-agent-id="${agent.id}">
                        <span>⚙</span> Configure
                    </button>
                    <button class="danger-button sm delete-agent-hub-btn" data-agent-id="${agent.id}" title="Decommission Agent">✕</button>
                </div>
            </div>
        `).join("");

        // Attach action listeners
        grid.querySelectorAll(".run-agent-hub-btn").forEach(btn => {
            btn.addEventListener("click", () => runAgentSingleCycle(btn.getAttribute("data-agent-id")));
        });

        grid.querySelectorAll(".mem-agent-hub-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const aid = btn.getAttribute("data-agent-id");
                const tab = document.querySelector('.sub-tab-btn[data-subtab="memory"]');
                if (tab) tab.click();
                selectMemoryAgent(aid);
            });
        });

        grid.querySelectorAll(".config-agent-hub-btn").forEach(btn => {
            btn.addEventListener("click", () => openEditAgentModal(btn.getAttribute("data-agent-id")));
        });

        grid.querySelectorAll(".delete-agent-hub-btn").forEach(btn => {
            btn.addEventListener("click", () => deleteAgent(btn.getAttribute("data-agent-id")));
        });
    }

    function renderMarketplace(category = "all") {
        const grid = document.getElementById("marketplaceGrid");
        if (!grid) return;

        let filtered = state.marketplace;
        if (category !== "all") {
            filtered = filtered.filter(m => m.category === category);
        }

        grid.innerHTML = filtered.map(item => `
            <div class="agent-card">
                <div class="agent-card-top">
                    <div>
                        <strong>${escapeHtml(item.name)}</strong>
                        <small style="color:var(--cyan); font-size:10px;">${escapeHtml(item.model)}</small>
                    </div>
                    <span class="nav-tag primary">${escapeHtml(item.category)}</span>
                </div>
                <p class="agent-desc">${escapeHtml(item.desc)}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--text-muted);">
                    <span>Rating: ★ <b>${item.rating}</b></span>
                    <span>Deployment: Ready</span>
                </div>
                <div class="agent-card-footer" style="padding-top:12px;">
                    ${item.active ? `
                        <button class="secondary-button sm full-width" style="color:var(--green); border-color:rgba(16,185,129,0.3);" disabled>
                            ✓ Active in Fleet
                        </button>
                    ` : `
                        <button class="primary-btn sm full-width activate-market-btn" data-market-id="${item.id}">
                            <span>⚡</span> Activate Agent
                        </button>
                    `}
                </div>
            </div>
        `).join("");

        grid.querySelectorAll(".activate-market-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-market-id");
                activateMarketplaceAgent(id);
            });
        });
    }

    function activateMarketplaceAgent(id) {
        const item = state.marketplace.find(m => m.id === id);
        if (!item) return;

        item.active = true;
        const newAgent = {
            id: "agent-" + Date.now().toString().slice(-3),
            name: item.name,
            role: item.role,
            model: item.model,
            status: "running",
            cpu: 35,
            memory: "300 MB",
            tasksCompleted: 0,
            successRate: 100,
            uptime: "100%",
            lastActive: "Just now",
            icon: "✦",
            description: item.desc,
            capabilities: ["Autonomous Execution", "API Integration"],
            permissions: { internet: true, readDocs: true, searchInfo: true, deleteFiles: false, sendEmails: false, codeExec: false },
            memory: { tasks: 0, savedContexts: 1, knowledgeItems: 10, items: [] }
        };

        state.agents.push(newAgent);
        logActivity("agents", "Marketplace", `Deployed new agent: "${item.name}"`, "SUCCESS");
        saveState();
        renderAll();
        showToast(`Activated ${item.name} into Fleet!`, "success");
    }

    /* PLAYGROUND TESTING ENGINE */
    function setupPlayground() {
        const select = document.getElementById("playgroundAgentSelect");
        const metaBox = document.getElementById("playgroundAgentMeta");
        const runBtn = document.getElementById("playgroundRunBtn");
        const promptInput = document.getElementById("playgroundPrompt");

        function populateSelect() {
            if (!select) return;
            select.innerHTML = state.agents.map(a => `
                <option value="${a.id}">${escapeHtml(a.name)} (${escapeHtml(a.role)} • ${escapeHtml(a.model)})</option>
            `).join("");
            updateMeta();
        }

        function updateMeta() {
            if (!select || !metaBox) return;
            const ag = state.agents.find(a => a.id === select.value) || state.agents[0];
            if (ag) {
                metaBox.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Role: <b>${escapeHtml(ag.role)}</b></span>
                        <span>Internet: <b style="color:${ag.permissions.internet ? 'var(--green)' : 'var(--red)'};">${ag.permissions.internet ? 'ENABLED' : 'BLOCKED'}</b></span>
                        <span>Code Exec: <b style="color:${ag.permissions.codeExec ? 'var(--green)' : 'var(--red)'};">${ag.permissions.codeExec ? 'ENABLED' : 'BLOCKED'}</b></span>
                    </div>
                `;
            }
        }

        if (select) {
            select.addEventListener("change", updateMeta);
        }

        populateSelect();

        if (runBtn && promptInput) {
            runBtn.addEventListener("click", () => {
                const aid = select.value;
                const agent = state.agents.find(a => a.id === aid);
                const query = promptInput.value.trim() || "Find information about electric vehicles and summarize charging infrastructure trends.";
                if (!agent) return;

                executePlaygroundTest(agent, query);
            });
        }
    }

    function executePlaygroundTest(agent, prompt) {
        const badge = document.getElementById("playgroundStatusBadge");
        const outBox = document.getElementById("playgroundOutputBox");
        const logBox = document.getElementById("playLogsContent");
        const statStatus = document.getElementById("playStatStatus");
        const statTime = document.getElementById("playStatTime");
        const statTokens = document.getElementById("playStatTokens");
        const statMem = document.getElementById("playStatMem");
        const runBtn = document.getElementById("playgroundRunBtn");

        if (runBtn) {
            runBtn.disabled = true;
            runBtn.innerHTML = `<span>⏳</span> EXECUTING TEST...`;
        }

        if (badge) badge.innerHTML = `<span class="pulse-indicator online"></span> RUNNING...`;
        if (statStatus) statStatus.textContent = "RUNNING";
        if (statTime) statTime.textContent = "0.0s";
        if (outBox) outBox.innerHTML = `<p style="color:var(--cyan);">Agent ${agent.name} is reasoning over instruction...</p>`;

        let seconds = 0;
        const timer = setInterval(() => {
            seconds += 0.2;
            if (statTime) statTime.textContent = seconds.toFixed(1) + "s";
        }, 200);

        // Security check
        const internetNeeded = prompt.toLowerCase().includes("search") || prompt.toLowerCase().includes("find") || prompt.toLowerCase().includes("web");
        const isBlocked = internetNeeded && !agent.permissions.internet;

        setTimeout(() => {
            clearInterval(timer);
            if (runBtn) {
                runBtn.disabled = false;
                runBtn.innerHTML = `<span>▶</span> RUN TEST`;
            }

            if (isBlocked) {
                if (badge) badge.innerHTML = `<span class="pulse-indicator error"></span> FAILED`;
                if (statStatus) statStatus.textContent = "SECURITY_BLOCKED";
                if (statTokens) statTokens.textContent = "42 tokens";
                if (statMem) statMem.textContent = "0 MB";
                if (outBox) {
                    outBox.innerHTML = `
                        <div style="color:var(--red);">
                            <b>⚠ ACCESS DENIED: Security Policy Violation</b>
                            <p>Agent <b>${agent.name}</b> does not have permission for outbound Internet Access. Configure capabilities in the Security Center.</p>
                        </div>
                    `;
                }
                if (logBox) {
                    logBox.textContent = `[SECURITY SENTINEL] Permission internet_egress DENIED for ${agent.name}.\n[AUDIT] Action halted with error code ERR_ZERO_TRUST_AIRGAP.`;
                }
                logActivity("errors", "Security Sentinel", `Blocked internet call from ${agent.name}`, "WARN");
                return;
            }

            if (badge) badge.innerHTML = `<span class="pulse-indicator online"></span> SUCCESS`;
            if (statStatus) statStatus.textContent = "SUCCESS";
            if (statTokens) statTokens.textContent = "1,420 tokens";
            if (statMem) statMem.textContent = "4.2 MB";

            if (outBox) {
                outBox.innerHTML = `
                    <div style="color:var(--text-main);">
                        <p style="color:var(--green); font-weight:700; margin-bottom:8px;">✓ Agent completed successfully</p>
                        <p><b>Prompt:</b> "${escapeHtml(prompt)}"</p>
                        <hr style="border:0; border-top:1px solid var(--border); margin:10px 0;">
                        <p><b>Synthesis Output:</b></p>
                        <p style="color:var(--text-secondary); line-height:1.6;">
                            Electric Vehicle (EV) adoption in 2026 has crossed 28% of new vehicle registrations in primary markets. High-power Megawatt Charging Systems (MCS) have cut average commercial vehicle charging cycles to 18 minutes. Solid-state battery platforms have entered initial production pipelines, providing nominal range improvements of +35% under adverse thermal conditions.
                        </p>
                    </div>
                `;
            }

            if (logBox) {
                logBox.textContent = `[${agent.name}] Ingested prompt tokens: 68.\n[${agent.name}] Context retrieval: 14 embedding chunks found.\n[${agent.name}] Synthesizing structured response with model ${agent.model}.\n[TELEMETRY] Execution time: 2.8s | Memory peak: 380MB | Status: 200 OK.`;
            }

            agent.tasksCompleted++;
            saveState();
            renderAll();
            logActivity("agents", agent.name, `Playground test run completed successfully`, "SUCCESS");

        }, 2800);
    }

    /* MEMORY INSPECTOR */
    function setupMemoryInspector() {
        const picker = document.getElementById("memoryAgentPicker");
        if (!picker) return;

        picker.innerHTML = state.agents.map((ag, idx) => `
            <button class="mem-agent-btn ${idx === 0 ? 'active' : ''}" data-agent-id="${ag.id}">
                <span>${ag.icon}</span>
                <span>${escapeHtml(ag.name)}</span>
            </button>
        `).join("");

        picker.querySelectorAll(".mem-agent-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                picker.querySelectorAll(".mem-agent-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                selectMemoryAgent(btn.getAttribute("data-agent-id"));
            });
        });

        // Clear memory button
        const clearBtn = document.getElementById("clearAgentMemoryBtn");
        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                const activeBtn = picker.querySelector(".mem-agent-btn.active");
                const aid = activeBtn ? activeBtn.getAttribute("data-agent-id") : state.agents[0].id;
                const agent = state.agents.find(a => a.id === aid);
                if (agent && agent.memory) {
                    agent.memory.items = [];
                    agent.memory.savedContexts = 0;
                    agent.memory.knowledgeItems = 0;
                    saveState();
                    selectMemoryAgent(aid);
                    showToast(`Memory cleared for ${agent.name}`, "info");
                }
            });
        }

        // Add memory item button
        const addMemBtn = document.getElementById("addMemoryItemBtn");
        if (addMemBtn) {
            addMemBtn.addEventListener("click", () => {
                const activeBtn = picker.querySelector(".mem-agent-btn.active");
                const aid = activeBtn ? activeBtn.getAttribute("data-agent-id") : state.agents[0].id;
                const agent = state.agents.find(a => a.id === aid);
                if (agent && agent.memory) {
                    agent.memory.items.unshift({
                        title: "Custom Operator Knowledge #" + (agent.memory.items.length + 1),
                        desc: "Learned context injected via NEXUS Memory Interface at " + new Date().toLocaleTimeString()
                    });
                    agent.memory.knowledgeItems++;
                    saveState();
                    selectMemoryAgent(aid);
                    showToast(`Knowledge item added to ${agent.name}`, "success");
                }
            });
        }

        selectMemoryAgent(state.agents[0].id);
    }

    function selectMemoryAgent(aid) {
        const agent = state.agents.find(a => a.id === aid) || state.agents[0];
        if (!agent) return;

        setText("memoryTargetName", agent.name);
        setText("memoryTargetId", `nexus-${agent.id}`);

        setText("memStatTasks", agent.memory?.tasks || agent.tasksCompleted);
        setText("memStatContext", agent.memory?.savedContexts || 0);
        setText("memStatKnowledge", agent.memory?.knowledgeItems || 0);

        const list = document.getElementById("memoryItemsList");
        if (list) {
            const items = agent.memory?.items || [];
            if (items.length === 0) {
                list.innerHTML = `<p style="color:var(--text-muted); font-size:12px;">No saved knowledge items in memory graph.</p>`;
            } else {
                list.innerHTML = items.map(it => `
                    <div class="memory-item-card">
                        <b>${escapeHtml(it.title)}</b>
                        <p>${escapeHtml(it.desc)}</p>
                    </div>
                `).join("");
            }
        }
    }

    /* =====================================================
       13. VISUAL WORKFLOW BUILDER (SECTION 10)
    ====================================================== */
    function setupWorkflowBuilder() {
        const runWfBtn = document.getElementById("runWorkflowBtn");
        const stopWfBtn = document.getElementById("stopWorkflowBtn");
        const saveWfBtn = document.getElementById("saveWorkflowBtn");
        const dupWfBtn = document.getElementById("duplicateWorkflowBtn");
        const picker = document.getElementById("workflowPicker");
        const addNodeBtn = document.getElementById("addAgentNodeBtn");
        const resetLayoutBtn = document.getElementById("resetCanvasLayoutBtn");

        if (runWfBtn) {
            runWfBtn.addEventListener("click", () => runWorkflowSimulation());
        }

        if (stopWfBtn) {
            stopWfBtn.addEventListener("click", () => stopWorkflowSimulation());
        }

        if (saveWfBtn) {
            saveWfBtn.addEventListener("click", () => {
                showToast("Workflow configuration saved successfully!", "success");
                logActivity("workflows", "Workflow Builder", "Saved pipeline configuration", "SUCCESS");
            });
        }

        if (dupWfBtn) {
            dupWfBtn.addEventListener("click", () => {
                showToast("Workflow duplicated as 'Copy of Pipeline'", "info");
            });
        }

        if (picker) {
            picker.addEventListener("change", () => {
                const selected = picker.options[picker.selectedIndex].text;
                setText("wfCurrentName", selected);
                showToast(`Switched active canvas to: ${selected}`, "info");
            });
        }

        if (addNodeBtn) {
            addNodeBtn.addEventListener("click", () => {
                showToast("New agent node added to canvas", "info");
            });
        }

        if (resetLayoutBtn) {
            resetLayoutBtn.addEventListener("click", () => {
                showToast("Canvas node layout reset to default", "info");
            });
        }

        // Test packet simulation on Agent Mesh in Command Center
        const simMeshBtn = document.getElementById("simulatePacketBtn");
        if (simMeshBtn) {
            simMeshBtn.addEventListener("click", () => {
                showToast("Transmitting 14-source payload across Agent Mesh...", "info");
                logActivity("agents", "Mesh Router", "Transmitted payload: Research -> Data -> Analysis", "INFO");
            });
        }
    }

    let wfRunnerTimeout = null;
    function runWorkflowSimulation() {
        const runBtn = document.getElementById("runWorkflowBtn");
        const stopBtn = document.getElementById("stopWorkflowBtn");
        const consoleOut = document.getElementById("wfConsoleOutput");
        const consoleStatus = document.getElementById("wfConsoleStatus");

        if (runBtn) runBtn.classList.add("hidden");
        if (stopBtn) stopBtn.classList.remove("hidden");

        const nodes = ["node-wf-input", "node-wf-research", "node-wf-analysis", "node-wf-report", "node-wf-output"];
        nodes.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove("running-node");
        });

        if (consoleOut) {
            consoleOut.innerHTML = `<div class="console-line system">[TRIGGER] Workflow execution started by Commander.</div>`;
        }
        if (consoleStatus) consoleStatus.textContent = "RUNNING • Processing DAG Nodes...";

        let curIndex = 0;
        function step() {
            if (curIndex > 0) {
                const prev = document.getElementById(nodes[curIndex - 1]);
                if (prev) prev.classList.remove("running-node");
            }

            if (curIndex >= nodes.length) {
                if (consoleOut) {
                    consoleOut.innerHTML += `<div class="console-line success">[SUCCESS] Workflow executed in 4.8s. Final deliverable produced.</div>`;
                    consoleOut.scrollTop = consoleOut.scrollHeight;
                }
                if (consoleStatus) consoleStatus.textContent = "COMPLETED • All 4 nodes verified";
                if (runBtn) runBtn.classList.remove("hidden");
                if (stopBtn) stopBtn.classList.add("hidden");

                showToast("Workflow execution completed successfully!", "success");
                logActivity("workflows", "Workflow Builder", "Workflow execution pipeline completed", "SUCCESS");
                return;
            }

            const current = document.getElementById(nodes[curIndex]);
            if (current) current.classList.add("running-node");

            const nodeTitle = current?.querySelector(".node-title")?.textContent || "Node";
            if (consoleOut) {
                consoleOut.innerHTML += `<div class="console-line running">▶ Node [${escapeHtml(nodeTitle)}] activated. Processing payload...</div>`;
                consoleOut.scrollTop = consoleOut.scrollHeight;
            }

            curIndex++;
            wfRunnerTimeout = setTimeout(step, 1200);
        }

        step();
    }

    function stopWorkflowSimulation() {
        if (wfRunnerTimeout) clearTimeout(wfRunnerTimeout);
        const runBtn = document.getElementById("runWorkflowBtn");
        const stopBtn = document.getElementById("stopWorkflowBtn");
        const consoleStatus = document.getElementById("wfConsoleStatus");

        if (runBtn) runBtn.classList.remove("hidden");
        if (stopBtn) stopBtn.classList.add("hidden");
        if (consoleStatus) consoleStatus.textContent = "HALTED • Operator stopped flow";

        showToast("Workflow stopped by operator", "warning");
    }

    /* =====================================================
       14. AI INSIGHTS & ANALYTICS (SECTION 11)
    ====================================================== */
    function setupInsights() {
        const timeSelect = document.getElementById("insightsTimeRange");
        if (timeSelect) {
            timeSelect.addEventListener("change", () => {
                showToast(`Aggregating metrics for last ${timeSelect.value} days`, "info");
                renderInsights();
            });
        }

        const exportBtn = document.getElementById("exportAnalyticsBtn");
        if (exportBtn) {
            exportBtn.addEventListener("click", () => {
                downloadFile("nexus_analytics_report.json", JSON.stringify(state, null, 2), "application/json");
                showToast("Analytics report exported as JSON", "success");
            });
        }

        document.querySelectorAll(".chart-toggle-group .chart-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".chart-toggle-group .chart-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                renderActivityTrendChart(btn.getAttribute("data-chart"));
            });
        });
    }

    function renderInsights() {
        // Render Agent Performance Bar Chart
        const chartBox = document.getElementById("agentPerformanceChart");
        if (chartBox) {
            chartBox.innerHTML = state.agents.map(ag => `
                <div class="perf-bar-row">
                    <div class="perf-bar-header">
                        <span class="perf-bar-name">${escapeHtml(ag.name)}</span>
                        <span class="perf-bar-val">${ag.successRate}% Success • ${ag.tasksCompleted} tasks</span>
                    </div>
                    <div class="perf-track" style="height:8px;">
                        <div class="perf-fill" style="width: ${ag.successRate}%;"></div>
                    </div>
                </div>
            `).join("");
        }

        renderActivityTrendChart("daily");

        // Workload distribution
        const distBox = document.getElementById("agentWorkloadDistribution");
        if (distBox) {
            const totalTasks = state.agents.reduce((a, b) => a + b.tasksCompleted, 0) || 1;
            distBox.innerHTML = state.agents.slice(0, 5).map(ag => {
                const pct = Math.round((ag.tasksCompleted / totalTasks) * 100);
                return `
                    <div class="workload-row">
                        <div class="workload-row-header">
                            <span>${escapeHtml(ag.name)}</span>
                            <b style="color:var(--cyan); font-family:'JetBrains Mono';">${pct}% (${ag.tasksCompleted} runs)</b>
                        </div>
                        <div class="perf-track">
                            <div class="perf-fill" style="width: ${pct}%; background:var(--cyan);"></div>
                        </div>
                    </div>
                `;
            }).join("");
        }
    }

    function renderActivityTrendChart(type = "daily") {
        const svgBox = document.getElementById("activityTrendSvg");
        if (!svgBox) return;

        const dataPoints = type === "daily" 
            ? [34, 48, 52, 41, 68, 85, 94] 
            : [180, 240, 290, 340, 420];

        const maxVal = Math.max(...dataPoints);
        const width = 480;
        const height = 180;
        const padding = 20;

        const points = dataPoints.map((val, idx) => {
            const x = padding + (idx * ((width - (padding * 2)) / (dataPoints.length - 1)));
            const y = height - padding - ((val / maxVal) * (height - (padding * 2)));
            return `${x},${y}`;
        }).join(" ");

        svgBox.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; overflow:visible;">
                <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.35"/>
                        <stop offset="100%" stop-color="#00f0ff" stop-opacity="0.0"/>
                    </linearGradient>
                </defs>
                <polygon points="${padding},${height - padding} ${points} ${width - padding},${height - padding}" fill="url(#chartGrad)"/>
                <polyline points="${points}" fill="none" stroke="#00f0ff" stroke-width="2.5" stroke-linecap="round"/>
                ${dataPoints.map((val, idx) => {
                    const x = padding + (idx * ((width - (padding * 2)) / (dataPoints.length - 1)));
                    const y = height - padding - ((val / maxVal) * (height - (padding * 2)));
                    return `
                        <circle cx="${x}" cy="${y}" r="4" fill="#06080e" stroke="#00f0ff" stroke-width="2"/>
                        <text x="${x}" y="${y - 8}" fill="#94a3b8" font-size="9" text-anchor="middle" font-family="'JetBrains Mono'">${val}</text>
                    `;
                }).join("")}
            </svg>
        `;
    }

    /* =====================================================
       15. ACTIVITY LOGS (SECTION 12)
    ====================================================== */
    function setupActivityLogs() {
        const search = document.getElementById("logSearchInput");
        if (search) search.addEventListener("input", () => renderFullActivityLogs());

        document.querySelectorAll("#logFilters .filter-pill").forEach(pill => {
            pill.addEventListener("click", () => {
                document.querySelectorAll("#logFilters .filter-pill").forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
                renderFullActivityLogs();
            });
        });

        const clearBtn = document.getElementById("clearAllLogsBtn");
        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                state.activities = [];
                saveState();
                renderAll();
                showToast("Activity log stream cleared", "info");
            });
        }

        const expJson = document.getElementById("exportLogsJson");
        if (expJson) {
            expJson.addEventListener("click", () => {
                downloadFile("nexus_activity_logs.json", JSON.stringify(state.activities, null, 2), "application/json");
                showToast("Activity logs exported as JSON", "success");
            });
        }

        const expCsv = document.getElementById("exportLogsCsv");
        if (expCsv) {
            expCsv.addEventListener("click", () => {
                const rows = [["Time", "Category", "Source", "Description", "Status"]];
                state.activities.forEach(a => rows.push([a.time, a.category, a.source, `"${a.desc.replace(/"/g, '""')}"`, a.status]));
                const csvContent = rows.map(r => r.join(",")).join("\n");
                downloadFile("nexus_activity_logs.csv", csvContent, "text/csv");
                showToast("Activity logs exported as CSV", "success");
            });
        }
    }

    function renderFullActivityLogs() {
        const container = document.getElementById("fullActivityLogStream");
        if (!container) return;

        const activeFilter = document.querySelector("#logFilters .filter-pill.active")?.getAttribute("data-cat") || "all";
        const query = (document.getElementById("logSearchInput")?.value || "").toLowerCase();

        let filtered = state.activities.filter(a => {
            const matchesCat = activeFilter === "all" || a.category === activeFilter;
            const matchesQuery = a.desc.toLowerCase().includes(query) || a.source.toLowerCase().includes(query) || a.status.toLowerCase().includes(query);
            return matchesCat && matchesQuery;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div style="padding:24px; text-align:center; color:var(--text-muted);">No activity logs match the selected filter.</div>`;
            return;
        }

        container.innerHTML = filtered.map(act => `
            <div class="log-stream-row">
                <span class="log-time">${escapeHtml(act.time)}</span>
                <span class="nav-tag">${escapeHtml(act.category.toUpperCase())}</span>
                <span class="log-source">${escapeHtml(act.source)}</span>
                <span class="log-desc">${escapeHtml(act.desc)}</span>
                <span>
                    <span class="status-pill ${act.status.toLowerCase()}">
                        <i class="dot ${getActivityBadgeClass(act.status)}"></i>
                        ${escapeHtml(act.status)}
                    </span>
                </span>
            </div>
        `).join("");
    }

    function logActivity(category, source, desc, status = "SUCCESS") {
        const now = new Date();
        const timeStr = now.toTimeString().split(" ")[0];
        const newAct = {
            id: "act-" + Date.now(),
            time: timeStr,
            category: category,
            source: source,
            desc: desc,
            status: status
        };
        state.activities.unshift(newAct);
        if (state.activities.length > 200) state.activities.pop();
        saveState();
        renderRecentActivity();
        renderFullActivityLogs();
    }

    /* =====================================================
       16. SMART ALERTS (SECTION 13)
    ====================================================== */
    function setupSmartAlerts() {
        document.querySelectorAll(".alert-filter-bar .filter-tab").forEach(tab => {
            tab.addEventListener("click", () => {
                document.querySelectorAll(".alert-filter-bar .filter-tab").forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                renderAlertsFeed(tab.getAttribute("data-alertfilter"));
            });
        });

        const resolveAll = document.getElementById("resolveAllAlertsBtn");
        if (resolveAll) {
            resolveAll.addEventListener("click", () => {
                state.alerts.forEach(a => a.resolved = true);
                saveState();
                renderAll();
                showToast("All system alerts marked as acknowledged", "success");
            });
        }

        const markReadBtn = document.getElementById("markRead");
        if (markReadBtn) {
            markReadBtn.addEventListener("click", () => {
                state.alerts.forEach(a => a.resolved = true);
                saveState();
                renderAll();
                showToast("Cleared system alerts", "info");
            });
        }

        const testAlertBtn = document.getElementById("triggerMockAlertBtn");
        if (testAlertBtn) {
            testAlertBtn.addEventListener("click", () => {
                state.alerts.unshift({
                    id: "alt-" + Date.now(),
                    type: "warning",
                    icon: "🟠",
                    title: "Security Sentinel Anomaly",
                    desc: "Simulated outbound payload threshold exceeded on worker node.",
                    time: "Just now",
                    resolved: false
                });
                saveState();
                renderAll();
                showToast("Generated simulated alert in center", "warning");
            });
        }
    }

    function renderAlertsFeed(filter = "all") {
        const container = document.getElementById("alertsFeed");
        if (!container) return;

        let filtered = state.alerts;
        if (filter === "critical") filtered = filtered.filter(a => a.type === "critical");
        if (filter === "warning") filtered = filtered.filter(a => a.type === "warning");
        if (filter === "attention") filtered = filtered.filter(a => a.type === "attention");
        if (filter === "resolved") filtered = filtered.filter(a => a.resolved);

        setText("alertCountCritical", state.alerts.filter(a => a.type === "critical" && !a.resolved).length);
        setText("alertCountWarning", state.alerts.filter(a => a.type === "warning" && !a.resolved).length);
        setText("alertCountAttention", state.alerts.filter(a => a.type === "attention" && !a.resolved).length);
        setText("alertCountResolved", state.alerts.filter(a => a.resolved).length);

        if (filtered.length === 0) {
            container.innerHTML = `<div class="empty-state-box" style="padding:40px; background:var(--surface-1); border-radius:var(--radius-md);"><p>No alerts in this category.</p></div>`;
            return;
        }

        container.innerHTML = filtered.map(alt => `
            <div class="alert-feed-card ${alt.resolved ? 'resolved' : alt.type}">
                <div class="alert-feed-icon">${alt.icon}</div>
                <div class="alert-feed-content">
                    <b>${escapeHtml(alt.title)}</b>
                    <p>${escapeHtml(alt.desc)}</p>
                    <small style="color:var(--text-muted); font-size:10px;">Timestamp: ${escapeHtml(alt.time)}</small>
                </div>
                <div class="alert-feed-actions">
                    ${!alt.resolved ? `
                        <button class="secondary-button sm resolve-alert-btn" data-alert-id="${alt.id}">Acknowledge</button>
                    ` : `
                        <span class="status-pill running">Resolved</span>
                    `}
                    <button class="danger-button sm dismiss-alert-btn" data-alert-id="${alt.id}">✕</button>
                </div>
            </div>
        `).join("");

        container.querySelectorAll(".resolve-alert-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const aid = btn.getAttribute("data-alert-id");
                const a = state.alerts.find(x => x.id === aid);
                if (a) {
                    a.resolved = true;
                    saveState();
                    renderAll();
                    showToast("Alert resolved", "success");
                }
            });
        });

        container.querySelectorAll(".dismiss-alert-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const aid = btn.getAttribute("data-alert-id");
                state.alerts = state.alerts.filter(x => x.id !== aid);
                saveState();
                renderAll();
                showToast("Alert dismissed", "info");
            });
        });
    }

    /* =====================================================
       17. SECURITY & PERMISSION CENTER (SECTION 14)
    ====================================================== */
    function setupSecurityCenter() {
        const resetBtn = document.getElementById("resetPermissionsBtn");
        const saveBtn = document.getElementById("savePermissionsBtn");

        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                state.agents.forEach(a => {
                    a.permissions = {
                        internet: a.role === "Research" || a.role === "Planning",
                        readDocs: true,
                        searchInfo: true,
                        deleteFiles: false,
                        sendEmails: false,
                        codeExec: a.role === "Coding" || a.role === "Analysis" || a.role === "Testing"
                    };
                });
                saveState();
                renderPermissionsTable();
                showToast("Permissions reset to zero-trust baseline", "info");
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener("click", () => {
                showToast("Security policies committed to cluster nodes", "success");
                logActivity("system", "Security Sentinel", "Enforced new permission policies", "SUCCESS");
            });
        }
    }

    function renderPermissionsTable() {
        const tbody = document.getElementById("permissionsTableBody");
        if (!tbody) return;

        tbody.innerHTML = state.agents.map(ag => `
            <tr>
                <td>
                    <b>${escapeHtml(ag.name)}</b>
                    <small style="display:block; color:var(--cyan); font-size:10px;">${escapeHtml(ag.role)}</small>
                </td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" class="perm-toggle" data-agent-id="${ag.id}" data-perm="internet" ${ag.permissions.internet ? 'checked' : ''}>
                        <span></span>
                    </label>
                </td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" class="perm-toggle" data-agent-id="${ag.id}" data-perm="readDocs" ${ag.permissions.readDocs ? 'checked' : ''}>
                        <span></span>
                    </label>
                </td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" class="perm-toggle" data-agent-id="${ag.id}" data-perm="searchInfo" ${ag.permissions.searchInfo ? 'checked' : ''}>
                        <span></span>
                    </label>
                </td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" class="perm-toggle" data-agent-id="${ag.id}" data-perm="deleteFiles" ${ag.permissions.deleteFiles ? 'checked' : ''}>
                        <span></span>
                    </label>
                </td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" class="perm-toggle" data-agent-id="${ag.id}" data-perm="sendEmails" ${ag.permissions.sendEmails ? 'checked' : ''}>
                        <span></span>
                    </label>
                </td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" class="perm-toggle" data-agent-id="${ag.id}" data-perm="codeExec" ${ag.permissions.codeExec ? 'checked' : ''}>
                        <span></span>
                    </label>
                </td>
                <td>
                    <span class="status-pill ${ag.permissions.deleteFiles || ag.permissions.sendEmails ? 'waiting' : 'running'}">
                        ${ag.permissions.deleteFiles || ag.permissions.sendEmails ? 'ELEVATED' : 'SANDBOXED'}
                    </span>
                </td>
            </tr>
        `).join("");

        tbody.querySelectorAll(".perm-toggle").forEach(toggle => {
            toggle.addEventListener("change", () => {
                const aid = toggle.getAttribute("data-agent-id");
                const perm = toggle.getAttribute("data-perm");
                const agent = state.agents.find(a => a.id === aid);
                if (agent) {
                    agent.permissions[perm] = toggle.checked;
                    logActivity("system", "Security Sentinel", `Updated [${perm}=${toggle.checked}] for ${agent.name}`, "INFO");
                    saveState();
                    showToast(`Updated ${perm} for ${agent.name}`, "info");
                }
            });
        });
    }

    /* =====================================================
       18. SETTINGS & PREFERENCES
    ====================================================== */
    function setupSettings() {
        const darkBtn = document.getElementById("optThemeDark");
        const lightBtn = document.getElementById("optThemeLight");
        const telemToggle = document.getElementById("telemetryToggle");
        const notifToggle = document.getElementById("notificationToggle");
        const wsInput = document.getElementById("settingsWorkspaceName");
        const uNameInput = document.getElementById("settingsUserName");
        const uEmailInput = document.getElementById("settingsUserEmail");
        const resetBtn = document.getElementById("resetSystemBtn");

        if (darkBtn && lightBtn) {
            darkBtn.addEventListener("click", () => {
                darkBtn.classList.add("active");
                lightBtn.classList.remove("active");
                applyTheme("dark");
            });
            lightBtn.addEventListener("click", () => {
                lightBtn.classList.add("active");
                darkBtn.classList.remove("active");
                applyTheme("light");
            });
        }

        if (telemToggle) {
            telemToggle.checked = state.telemetryActive;
            telemToggle.addEventListener("change", () => {
                state.telemetryActive = telemToggle.checked;
                saveState();
                if (state.telemetryActive) startTelemetryHeartbeat();
                else if (telemetryInterval) clearInterval(telemetryInterval);
                showToast(`Telemetry simulation ${state.telemetryActive ? 'enabled' : 'disabled'}`, "info");
            });
        }

        if (notifToggle) {
            notifToggle.checked = state.notificationsEnabled;
            notifToggle.addEventListener("change", () => {
                state.notificationsEnabled = notifToggle.checked;
                saveState();
            });
        }

        if (wsInput) {
            wsInput.addEventListener("change", () => {
                state.workspaces[0].name = wsInput.value;
                setText("workspaceName", wsInput.value);
                saveState();
                showToast("Workspace name updated", "success");
            });
        }

        if (uNameInput) {
            uNameInput.addEventListener("change", () => {
                state.user.name = uNameInput.value;
                setText("profileName", uNameInput.value);
                saveState();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                if (confirm("Reset NEXUS Operating System to pristine factory defaults? All created missions and agents will be reinitialized.")) {
                    localStorage.removeItem(STORAGE_KEY);
                    state = clone(defaultState);
                    saveState();
                    renderAll();
                    showToast("System reset to factory defaults", "success");
                }
            });
        }
    }

    /* =====================================================
       19. QUICK ACTIONS & RUNNERS (SECTION 18)
    ====================================================== */
    function setupQuickActions() {
        const quickRunAgent = document.getElementById("quickRunAgentModal");
        if (quickRunAgent) {
            quickRunAgent.addEventListener("click", () => {
                openQuickRunModal();
            });
        }

        const quickNewWf = document.getElementById("quickNewWorkflow");
        if (quickNewWf) {
            quickNewWf.addEventListener("click", () => {
                const nav = document.querySelector('.nav-item[data-page="workflows"]');
                if (nav) nav.click();
            });
        }
    }

    function runAgentSingleCycle(aid) {
        const agent = state.agents.find(a => a.id === aid);
        if (!agent) return;

        agent.status = "running";
        agent.cpu = Math.min(95, agent.cpu + 25);
        agent.tasksCompleted++;
        saveState();
        renderAll();

        showToast(`Running single execution cycle on ${agent.name}...`, "info");
        logActivity("agents", agent.name, `Autonomous single execution cycle triggered`, "SUCCESS");

        setTimeout(() => {
            agent.cpu = Math.max(10, agent.cpu - 20);
            saveState();
            renderAll();
        }, 2000);
    }

    function toggleAgentStatus(aid) {
        const agent = state.agents.find(a => a.id === aid);
        if (!agent) return;

        agent.status = agent.status === "running" ? "idle" : "running";
        saveState();
        renderAll();
        showToast(`${agent.name} status updated to ${agent.status.toUpperCase()}`, "info");
    }

    function deleteAgent(aid) {
        const agent = state.agents.find(a => a.id === aid);
        if (!agent) return;
        if (confirm(`Decommission agent ${agent.name}?`)) {
            state.agents = state.agents.filter(a => a.id !== aid);
            logActivity("agents", "Commander", `Decommissioned agent ${agent.name}`, "WARN");
            saveState();
            renderAll();
            showToast(`${agent.name} decommissioned`, "info");
        }
    }

    /* =====================================================
       20. MODAL CONTROLLER & DIALOGS
    ====================================================== */
    function setupModals() {
        const overlay = document.getElementById("modalOverlay");
        const closeBtn = document.getElementById("modalClose");
        const closeMdBtn = document.getElementById("closeMissionDetails");
        const mdOverlay = document.getElementById("missionDetailsOverlay");

        if (closeBtn && overlay) {
            closeBtn.addEventListener("click", () => overlay.classList.add("hidden"));
        }

        if (closeMdBtn && mdOverlay) {
            closeMdBtn.addEventListener("click", () => mdOverlay.classList.add("hidden"));
        }

        // Close on escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                if (overlay) overlay.classList.add("hidden");
                if (mdOverlay) mdOverlay.classList.add("hidden");
                const pal = document.getElementById("paletteOverlay");
                if (pal) pal.classList.add("hidden");
            }
        });
    }

    function openModal(title, eyebrow, bodyHtml) {
        const overlay = document.getElementById("modalOverlay");
        const titleEl = document.getElementById("modalTitle");
        const eyeEl = document.getElementById("modalLabel");
        const bodyEl = document.getElementById("modalBody");

        if (titleEl) titleEl.textContent = title;
        if (eyeEl) eyeEl.textContent = eyebrow || "NEXUS AI";
        if (bodyEl) bodyEl.innerHTML = bodyHtml;

        if (overlay) overlay.classList.remove("hidden");
    }

    function closeModal() {
        const overlay = document.getElementById("modalOverlay");
        if (overlay) overlay.classList.add("hidden");
    }

    function openNewMissionModal() {
        const html = `
            <form id="createMissionModalForm" style="display:flex; flex-direction:column; gap:14px;">
                <div>
                    <label class="input-label">Mission Objective / Goal</label>
                    <input type="text" id="modalMissionGoal" class="nexus-input full-width" placeholder="e.g., Audit security vulnerabilities on payment API" required>
                </div>
                <div>
                    <label class="input-label">Lead Assigned Agents</label>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:6px;">
                        ${state.agents.slice(0, 6).map(ag => `
                            <label style="display:flex; align-items:center; gap:8px; font-size:12px; cursor:pointer;">
                                <input type="checkbox" name="missionAgents" value="${escapeHtml(ag.name)}" checked>
                                <span>${escapeHtml(ag.name)}</span>
                            </label>
                        `).join("")}
                    </div>
                </div>
                <div>
                    <label class="input-label">Execution Priority</label>
                    <select id="modalMissionPriority" class="nexus-select full-width">
                        <option value="high">High Priority (Autonomous Multi-Thread)</option>
                        <option value="normal">Normal Priority</option>
                        <option value="background">Background Queue</option>
                    </select>
                </div>
                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
                    <button type="button" class="secondary-button" id="cancelMissionModalBtn">Cancel</button>
                    <button type="submit" class="primary-btn glow">🚀 Launch Mission</button>
                </div>
            </form>
        `;

        openModal("Launch New Mission", "AUTONOMOUS OBJECTIVE", html);

        const form = document.getElementById("createMissionModalForm");
        const cancelBtn = document.getElementById("cancelMissionModalBtn");

        if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const goal = document.getElementById("modalMissionGoal").value.trim();
                if (goal) {
                    deployMissionFromGoal(goal);
                    closeModal();
                }
            });
        }
    }

    function openCreateAgentModal() {
        const html = `
            <form id="createAgentModalForm" style="display:flex; flex-direction:column; gap:14px;">
                <div>
                    <label class="input-label">Agent Name</label>
                    <input type="text" id="modalAgentName" class="nexus-input full-width" placeholder="e.g., Compliance Sentinel" required>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                    <div>
                        <label class="input-label">Role Category</label>
                        <select id="modalAgentRole" class="nexus-select full-width">
                            <option value="Research">Research</option>
                            <option value="Analysis">Analysis</option>
                            <option value="Coding">Coding</option>
                            <option value="Testing">Testing</option>
                            <option value="Report">Report</option>
                            <option value="Security">Security</option>
                        </select>
                    </div>
                    <div>
                        <label class="input-label">Reasoning Model</label>
                        <select id="modalAgentModel" class="nexus-select full-width">
                            <option value="NEXUS Reasoner">NEXUS Reasoner</option>
                            <option value="NEXUS Matrix">NEXUS Matrix</option>
                            <option value="NEXUS CodeX">NEXUS CodeX</option>
                            <option value="NEXUS Sentinel">NEXUS Sentinel</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="input-label">System Directives & Responsibilities</label>
                    <textarea id="modalAgentDesc" rows="3" class="nexus-textarea" placeholder="Describe agent objective and operational boundaries..." required></textarea>
                </div>
                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
                    <button type="button" class="secondary-button" id="cancelAgentModalBtn">Cancel</button>
                    <button type="submit" class="primary-btn glow">Deploy to Fleet</button>
                </div>
            </form>
        `;

        openModal("Create Intelligent Agent", "FLEET ARCHITECTURE", html);

        const form = document.getElementById("createAgentModalForm");
        const cancelBtn = document.getElementById("cancelAgentModalBtn");
        if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const name = document.getElementById("modalAgentName").value.trim();
                const role = document.getElementById("modalAgentRole").value;
                const model = document.getElementById("modalAgentModel").value;
                const desc = document.getElementById("modalAgentDesc").value.trim();

                const newAgent = {
                    id: "agent-" + Date.now().toString().slice(-4),
                    name: name,
                    role: role,
                    model: model,
                    status: "running",
                    cpu: 25,
                    memory: "280 MB",
                    tasksCompleted: 0,
                    successRate: 100,
                    uptime: "100%",
                    lastActive: "Just now",
                    icon: "✦",
                    description: desc,
                    capabilities: ["Autonomous Orchestration", "JSON Ingestion"],
                    permissions: { internet: role === "Research", readDocs: true, searchInfo: true, deleteFiles: false, sendEmails: false, codeExec: role === "Coding" },
                    memory: { tasks: 0, savedContexts: 0, knowledgeItems: 0, items: [] }
                };

                state.agents.push(newAgent);
                logActivity("agents", "Fleet Orchestrator", `Created agent "${name}"`, "SUCCESS");
                saveState();
                renderAll();
                closeModal();
                showToast(`Agent ${name} deployed into fleet!`, "success");
            });
        }
    }

    function openEditAgentModal(aid) {
        const agent = state.agents.find(a => a.id === aid);
        if (!agent) return;

        const html = `
            <div style="display:flex; flex-direction:column; gap:14px;">
                <div>
                    <label class="input-label">Agent Name</label>
                    <input type="text" id="editAgentName" class="nexus-input full-width" value="${escapeHtml(agent.name)}">
                </div>
                <div>
                    <label class="input-label">Model Configuration</label>
                    <input type="text" id="editAgentModel" class="nexus-input full-width" value="${escapeHtml(agent.model)}">
                </div>
                <div>
                    <label class="input-label">Description</label>
                    <textarea id="editAgentDesc" rows="3" class="nexus-textarea">${escapeHtml(agent.description)}</textarea>
                </div>
                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
                    <button type="button" class="secondary-button" id="cancelEditAgentBtn">Cancel</button>
                    <button type="button" class="primary-btn" id="saveEditAgentBtn">Save Changes</button>
                </div>
            </div>
        `;

        openModal(`Configure ${agent.name}`, "AGENT SETTINGS", html);

        const cancelBtn = document.getElementById("cancelEditAgentBtn");
        if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

        const saveBtn = document.getElementById("saveEditAgentBtn");
        if (saveBtn) {
            saveBtn.addEventListener("click", () => {
                agent.name = document.getElementById("editAgentName").value.trim() || agent.name;
                agent.model = document.getElementById("editAgentModel").value.trim() || agent.model;
                agent.description = document.getElementById("editAgentDesc").value.trim() || agent.description;

                saveState();
                renderAll();
                closeModal();
                showToast(`Saved configuration for ${agent.name}`, "success");
            });
        }
    }

    function openQuickRunModal() {
        const html = `
            <div style="display:flex; flex-direction:column; gap:12px;">
                <label class="input-label">Select Agent to Trigger</label>
                <select id="quickRunSelect" class="nexus-select full-width">
                    ${state.agents.map(a => `<option value="${a.id}">${escapeHtml(a.name)} (${escapeHtml(a.role)})</option>`).join("")}
                </select>
                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:12px;">
                    <button class="secondary-button" id="closeQuickRun">Cancel</button>
                    <button class="primary-btn" id="confirmQuickRun">Execute Cycle</button>
                </div>
            </div>
        `;

        openModal("Run Agent Execution", "MANUAL DISPATCH", html);

        const closeBtn = document.getElementById("closeQuickRun");
        if (closeBtn) closeBtn.addEventListener("click", closeModal);

        const confirmBtn = document.getElementById("confirmQuickRun");
        if (confirmBtn) {
            confirmBtn.addEventListener("click", () => {
                const aid = document.getElementById("quickRunSelect").value;
                closeModal();
                runAgentSingleCycle(aid);
            });
        }
    }

    /* =====================================================
       21. COMMAND PALETTE (CTRL+K)
    ====================================================== */
    function setupCommandPalette() {
        const overlay = document.getElementById("paletteOverlay");
        const searchBtn = document.getElementById("searchBtn");
        const input = document.getElementById("paletteInput");
        const results = document.getElementById("paletteResults");

        function openPalette() {
            if (overlay && input) {
                overlay.classList.remove("hidden");
                input.value = "";
                input.focus();
                renderResults("");
            }
        }

        if (searchBtn) searchBtn.addEventListener("click", openPalette);

        document.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                openPalette();
            }
        });

        if (input) {
            input.addEventListener("input", () => {
                renderResults(input.value.trim().toLowerCase());
            });
        }

        function renderResults(q) {
            if (!results) return;

            const actions = [
                { title: "Command Center", sub: "Go to master dashboard", action: () => navigateToPage("command") },
                { title: "Mission Mode", sub: "Autonomous objective decomposition", action: () => navigateToPage("missions") },
                { title: "Agent Hub", sub: "Fleet management & testing", action: () => navigateToPage("agents") },
                { title: "Visual Workflow Builder", sub: "Connect agent execution nodes", action: () => navigateToPage("workflows") },
                { title: "AI Insights", sub: "Performance analytics & telemetry", action: () => navigateToPage("insights") },
                { title: "Activity Logs", sub: "Audit stream & event telemetry", action: () => navigateToPage("activity") },
                { title: "Smart Alerts", sub: "System warnings & milestones", action: () => navigateToPage("alerts") },
                { title: "Security Center", sub: "Zero-trust permission matrix", action: () => navigateToPage("security") },
                { title: "Settings", sub: "Operating system preferences", action: () => navigateToPage("settings") },
                { title: "Launch New Mission", sub: "Provide high-level goal", action: () => openNewMissionModal() },
                { title: "Create New Agent", sub: "Deploy custom assistant", action: () => openCreateAgentModal() }
            ];

            // Add dynamic agents & missions to search
            state.agents.forEach(a => {
                actions.push({
                    title: `Agent: ${a.name}`,
                    sub: `${a.role} • ${a.model}`,
                    action: () => {
                        navigateToPage("agents");
                        showToast(`Selected ${a.name}`, "info");
                    }
                });
            });

            state.missions.forEach(m => {
                actions.push({
                    title: `Mission: ${m.name}`,
                    sub: `${m.status.toUpperCase()} • ${m.progress}%`,
                    action: () => openMissionDetailsModal(m.id)
                });
            });

            const filtered = actions.filter(act => act.title.toLowerCase().includes(q) || act.sub.toLowerCase().includes(q));

            if (filtered.length === 0) {
                results.innerHTML = `<div style="padding:14px; text-align:center; color:var(--text-muted); font-size:12px;">No matching commands found.</div>`;
                return;
            }

            results.innerHTML = filtered.slice(0, 8).map((act, i) => `
                <div class="palette-item ${i === 0 ? 'active' : ''}" data-idx="${i}">
                    <div>
                        <b>${escapeHtml(act.title)}</b>
                        <small style="display:block; color:var(--text-muted); font-size:10px;">${escapeHtml(act.sub)}</small>
                    </div>
                    <span style="color:var(--cyan); font-size:11px;">↵</span>
                </div>
            `).join("");

            results.querySelectorAll(".palette-item").forEach((item, idx) => {
                item.addEventListener("click", () => {
                    if (overlay) overlay.classList.add("hidden");
                    filtered[idx].action();
                });
            });
        }

        function navigateToPage(pageId) {
            const btn = document.querySelector(`.nav-item[data-page="${pageId}"]`);
            if (btn) btn.click();
        }
    }

    /* =====================================================
       22. TOAST NOTIFICATIONS & UTILITIES
    ====================================================== */
    function showToast(message, type = "info") {
        if (!state.notificationsEnabled) return;

        const container = document.getElementById("toastContainer");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span>${type === 'success' ? '✓' : type === 'warning' ? '⚠' : type === 'error' ? '✕' : '✦'}</span>
            <span>${escapeHtml(message)}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(50px)";
            toast.style.transition = "all 0.3s ease";
            setTimeout(() => toast.remove(), 300);
        }, 3600);
    }

    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function downloadFile(filename, content, type) {
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Launch NEXUS Operating System on DOM Ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();