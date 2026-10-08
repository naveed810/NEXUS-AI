/* =========================================================
   NEXUS AI — AGENT HUB
   Premium Frontend Interaction Layer
   FastAPI + Gemini Integration
========================================================= */

"use strict";

function syncNexusProfile() {
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
        document.getElementById("profileName")?.replaceChildren(document.createTextNode(name));
        document.getElementById("profileEmail")?.replaceChildren(document.createTextNode(email));
        document.getElementById("profileAvatar")?.replaceChildren(document.createTextNode(avatar));
    } catch (_) {}
}

if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", syncNexusProfile);
    } else {
        syncNexusProfile();
    }
}


/* =========================================================
   BACKEND / GEMINI CONNECTION
========================================================= */

const API_BASE_URL = "http://127.0.0.1:8000";

const BACKEND_AGENT_MAP = {
    "research-001": "research-agent",
    "analysis-002": "data-agent",
    "automation-003": "task-agent"
};

let backendConnected = false;

let latestAIResponse = "";

let latestUserPrompt = "";


/* =========================================================
   BACKEND REQUEST
========================================================= */

async function backendFetch(path, options = {}) {

    const response = await fetch(
        `${API_BASE_URL}${path}`,
        {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            ...options
        }
    );


    const rawText = await response.text();

    let data = {};


    try {

        data = rawText
            ? JSON.parse(rawText)
            : {};

    } catch {

        data = {
            detail:
                rawText ||
                "Unknown backend response."
        };

    }


    if (!response.ok) {

        throw new Error(
            data?.detail ||
            data?.message ||
            data?.error ||
            `Backend request failed with HTTP ${response.status}.`
        );

    }


    return data;
}


/* =========================================================
   BACKEND AGENT ID
========================================================= */

function getBackendAgentId(agentId) {

    return (
        BACKEND_AGENT_MAP[agentId] ||
        null
    );

}


/* =========================================================
   BUILD USER GOAL
========================================================= */

function buildAgentGoal(
    agent,
    prompt = ""
) {

    if (
        prompt &&
        prompt.trim()
    ) {

        return prompt.trim();

    }


    return `
Act as the ${agent.role || "AI"} agent named ${agent.name}.

Agent description:
${agent.description || "Complete the assigned task."}

Provide a useful response to the user.
`.trim();

}


/* =========================================================
   RUN BACKEND AGENT
========================================================= */

async function runBackendAgent(
    agent,
    prompt = ""
) {

    const backendId =
        getBackendAgentId(agent.id);


    if (!backendId) {

        throw new Error(
            `${agent.name} is not connected to a backend AI agent yet.`
        );

    }


    return backendFetch(
        `/api/agents/${encodeURIComponent(backendId)}/run`,
        {
            method: "POST",

            body: JSON.stringify({
                goal: buildAgentGoal(
                    agent,
                    prompt
                )
            })
        }
    );

}


/* =========================================================
   EXTRACT GEMINI RESPONSE
========================================================= */

function extractAIResponse(result) {

    return (
        result?.response ||
        result?.execution?.response ||
        result?.message ||
        "The AI agent completed the task without returning a response."
    );

}


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY =
    "nexus_agent_hub_state_v2";


/* =========================================================
   DEFAULT AGENTS
========================================================= */

const defaultAgents = [

    {
        id: "research-001",

        name: "Research Agent",

        role: "Research",

        description:
            "Researches information, compares sources and produces structured summaries.",

        model:
            "Gemini 3.6 Flash",

        status:
            "running",

        progress:
            72,

        tasks:
            42,

        success:
            98,

        lastRun:
            "2 min ago",

        activity:
            94,

        color:
            "cyan",

        capabilities: [
            "Research Analysis",
            "Summarization",
            "Source Analysis",
            "Report Generation"
        ],

        history: [
            62,
            75,
            69,
            88,
            74,
            91,
            82,
            96,
            84,
            93,
            87,
            98
        ]

    },


    {
        id: "analysis-002",

        name: "Data Analyst",

        role: "Analysis",

        description:
            "Analyzes structured information and converts complex data into useful insights.",

        model:
            "Gemini 3.6 Flash",

        status:
            "idle",

        progress:
            56,

        tasks:
            36,

        success:
            97,

        lastRun:
            "8 min ago",

        activity:
            87,

        color:
            "purple",

        capabilities: [
            "Data Analysis",
            "Pattern Detection",
            "Insights",
            "Visualization"
        ],

        history: [
            70,
            78,
            73,
            84,
            81,
            88,
            91,
            86,
            89,
            94,
            90,
            97
        ]

    },


    {
        id: "automation-003",

        name: "Task Automator",

        role: "Automation",

        description:
            "Handles repeatable work, task preparation and automated workflow operations.",

        model:
            "Gemini 3.6 Flash",

        status:
            "idle",

        progress:
            31,

        tasks:
            29,

        success:
            95,

        lastRun:
            "21 min ago",

        activity:
            63,

        color:
            "green",

        capabilities: [
            "Task Execution",
            "Scheduling",
            "Workflow Actions",
            "Notifications"
        ],

        history: [
            52,
            63,
            70,
            66,
            76,
            81,
            73,
            87,
            79,
            84,
            91,
            95
        ]

    },


    {
        id: "content-004",

        name: "Content Agent",

        role: "Content",

        description:
            "Creates structured drafts, summaries and content concepts from instructions.",

        model:
            "Not connected",

        status:
            "paused",

        progress:
            18,

        tasks:
            21,

        success:
            94,

        lastRun:
            "1 hr ago",

        activity:
            42,

        color:
            "orange",

        capabilities: [
            "Drafting",
            "Summarization",
            "Content Planning",
            "Formatting"
        ],

        history: [
            60,
            58,
            72,
            64,
            75,
            70,
            81,
            77,
            86,
            82,
            91,
            94
        ]

    }

];


/* =========================================================
   DEFAULT STATE
========================================================= */

const defaultState = {

    agents:
        defaultAgents,

    selectedAgentId:
        "research-001",

    completedTasks:
        0,

    activities: [

        {
            id: "a1",

            icon: "✓",

            type: "success",

            title:
                "Research Agent completed a task",

            description:
                "Research summary generated successfully.",

            time:
                "2 min ago"
        },

        {
            id: "a2",

            icon: "▶",

            type: "",

            title:
                "Data Analyst started execution",

            description:
                "Workspace analytics task is running.",

            time:
                "8 min ago"
        },

        {
            id: "a3",

            icon: "!",

            type: "warning",

            title:
                "Content Agent paused",

            description:
                "Agent is waiting for new configuration.",

            time:
                "1 hr ago"
        }

    ],

    notifications:
        3,

    lightMode:
        false
};


/* =========================================================
   STATE
========================================================= */

let state =
    loadState();


let activeExecution =
    null;


let executionTimer =
    null;


/* =========================================================
   DOM HELPERS
========================================================= */

const $ =
    (selector) =>
        document.querySelector(selector);


const $$ =
    (selector) =>
        Array.from(
            document.querySelectorAll(selector)
        );


/* =========================================================
   CLONE DEFAULT STATE
========================================================= */

function cloneDefaultState() {

    return JSON.parse(
        JSON.stringify(
            defaultState
        )
    );

}


/* =========================================================
   LOAD STATE
========================================================= */

function loadState() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!saved) {

            return cloneDefaultState();

        }


        const parsed =
            JSON.parse(saved);


        if (
            !parsed ||
            !Array.isArray(parsed.agents)
        ) {

            return cloneDefaultState();

        }


        return {

            ...cloneDefaultState(),

            ...parsed

        };

    }

    catch (error) {

        console.warn(
            "NEXUS Agent Hub state could not be loaded.",
            error
        );

        return cloneDefaultState();

    }

}


/* =========================================================
   SAVE STATE
========================================================= */

function saveState() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state)
        );

    }

    catch (error) {

        console.warn(
            "NEXUS Agent Hub state could not be saved.",
            error
        );

    }

}


/* =========================================================
   BACKEND CONNECTION CHECK
========================================================= */

async function checkBackendConnection() {

    try {

        const result =
            await backendFetch(
                "/api/health"
            );


        backendConnected =
            result?.status === "healthy";


        updateBackendIndicator(
            backendConnected
        );


        console.log(
            "NEXUS AI backend connected.",
            result
        );


        return true;

    }

    catch (error) {

        backendConnected =
            false;


        updateBackendIndicator(
            false
        );


        console.warn(
            "NEXUS AI backend unavailable:",
            error.message
        );


        return false;

    }

}


/* =========================================================
   BACKEND INDICATOR
========================================================= */

function updateBackendIndicator(
    connected
) {

    const selectors = [

        "#backendStatus",

        "#systemStatus",

        "#connectionStatus"

    ];


    for (
        const selector of selectors
    ) {

        const element =
            $(selector);


        if (!element) {

            continue;

        }


        element.textContent =
            connected
                ? "Backend online"
                : "Backend offline";


        element.classList.toggle(
            "online",
            connected
        );


        element.classList.toggle(
            "offline",
            !connected
        );


        break;

    }

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        applyTheme();

        bindEvents();

        renderAll();

        checkBackendConnection();

        /* Initialize 3D Quantum Neural Core */
        if (window.initNexus3DWidget) {
            const container = document.getElementById("agentHub3DCore");
            if (container) {
                window.hub3DCore = window.initNexus3DWidget(container, {
                    theme: "default",
                    showHud: true
                });
            }
        }

        showToast(
            "Agent Hub ready",
            "NEXUS AI is ready for execution.",
            "success"
        );

    }
);
/* =========================================================
   EVENT BINDING
========================================================= */

function bindEvents() {

    /* -----------------------------------------------------
       CREATE AGENT
    ----------------------------------------------------- */

    $("#headerCreateButton")?.addEventListener(
        "click",
        () => openModal("createModal")
    );


    $("#heroCreateButton")?.addEventListener(
        "click",
        () => openModal("createModal")
    );


    $("#emptyCreateButton")?.addEventListener(
        "click",
        () => openModal("createModal")
    );


    /* -----------------------------------------------------
       HERO RUN
    ----------------------------------------------------- */

    $("#heroRunButton")?.addEventListener(
        "click",
        () => {

            const agent =
                getSelectedAgent();


            if (!agent) {

                showToast(
                    "No agent selected",
                    "Select an agent before starting an execution.",
                    "warning"
                );

                return;

            }


            runAgent(
                agent.id
            );

        }
    );


    /* -----------------------------------------------------
       SEARCH
    ----------------------------------------------------- */

    $("#agentSearch")?.addEventListener(
        "input",
        renderAgents
    );


    /* -----------------------------------------------------
       STATUS FILTER
    ----------------------------------------------------- */

    $("#statusFilter")?.addEventListener(
        "change",
        renderAgents
    );


    /* -----------------------------------------------------
       SORT
    ----------------------------------------------------- */

    $("#sortAgents")?.addEventListener(
        "change",
        renderAgents
    );


    /* -----------------------------------------------------
       REFRESH
    ----------------------------------------------------- */

    $("#refreshButton")?.addEventListener(
        "click",
        async () => {

            renderAll();

            await checkBackendConnection();

            showToast(
                "Dashboard refreshed",
                backendConnected
                    ? "Agent Hub is synchronized with the backend."
                    : "Backend is currently unavailable.",
                backendConnected
                    ? "success"
                    : "warning"
            );

        }
    );


    /* -----------------------------------------------------
       THEME
    ----------------------------------------------------- */

    $("#themeButton")?.addEventListener(
        "click",
        toggleTheme
    );


    /* -----------------------------------------------------
       NOTIFICATIONS
    ----------------------------------------------------- */

    $("#notificationButton")?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            const panel =
                $("#notificationPanel");


            if (!panel) return;


            panel.classList.toggle(
                "hidden"
            );

        }
    );


    $("#markNotificationsButton")?.addEventListener(
        "click",
        markNotificationsRead
    );


    /* -----------------------------------------------------
       ACTIVITY
    ----------------------------------------------------- */

    $("#clearActivityButton")?.addEventListener(
        "click",
        clearActivity
    );


    /* -----------------------------------------------------
       CREATE AGENT FORM
    ----------------------------------------------------- */

    $("#createAgentForm")?.addEventListener(
        "submit",
        handleCreateAgent
    );


    /* -----------------------------------------------------
       AGENT CONSOLE
    ----------------------------------------------------- */

    $("#sendAgentButton")?.addEventListener(
        "click",
        sendAgentPrompt
    );


    $("#agentPrompt")?.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendAgentPrompt();

            }

        }
    );

    $("#agentPrompt")?.addEventListener("focus", () => {
        window.hub3DCore?.setState("listening");
    });

    $("#agentPrompt")?.addEventListener("input", () => {
        if ($("#agentPrompt").value.trim().length > 0) {
            window.hub3DCore?.setState("listening");
        }
    });

    $("#agentPrompt")?.addEventListener("blur", () => {
        if (window.hub3DCore?.state === "listening" && !window.nexusVoice?.isSpeaking) {
            window.hub3DCore?.setState("idle");
        }
    });


    /* -----------------------------------------------------
       PROMPT SUGGESTIONS
    ----------------------------------------------------- */

    $$(".suggestion-button").forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const prompt =
                        button.dataset.prompt ||
                        "";


                    const input =
                        $("#agentPrompt");


                    if (!input) return;


                    input.value =
                        prompt;


                    input.focus();

                }
            );

        }
    );


    /* -----------------------------------------------------
       DETAILS MODAL
    ----------------------------------------------------- */

    $("#detailsRunButton")?.addEventListener(
        "click",
        () => {

            const agent =
                getSelectedAgent();


            if (!agent) return;


            closeModal(
                "detailsModal"
            );


            runAgent(
                agent.id
            );

        }
    );


    $("#detailsPauseButton")?.addEventListener(
        "click",
        () => {

            const agent =
                getSelectedAgent();


            if (!agent) return;


            toggleAgentStatus(
                agent.id
            );


            updateDetailsModal(
                agent.id
            );

        }
    );


    /* -----------------------------------------------------
       MOBILE MENU
    ----------------------------------------------------- */

    $("#mobileMenuButton")?.addEventListener(
        "click",
        (e) => {
            e.stopPropagation();
            $("#sidebar")?.classList.toggle(
                "mobile-open"
            );
        }
    );

    document.addEventListener("click", (e) => {
        const sidebar = $("#sidebar");
        const btn = $("#mobileMenuButton");
        if (sidebar?.classList.contains("mobile-open") && !sidebar.contains(e.target) && !btn?.contains(e.target)) {
            sidebar.classList.remove("mobile-open");
        }
    });


    /* -----------------------------------------------------
       WORKSPACE
    ----------------------------------------------------- */

    $("#workspaceButton")?.addEventListener(
        "click",
        () => {

            showToast(
                "Workspace",
                "NEXUS Workspace is currently active.",
                "info"
            );

        }
    );


    /* -----------------------------------------------------
       PROFILE
    ----------------------------------------------------- */

    $("#profileButton")?.addEventListener(
        "click",
        () => {

            showToast(
                "Member profile",
                "Agent Engineer workspace profile.",
                "info"
            );

        }
    );


    /* -----------------------------------------------------
       NAVIGATION
    ----------------------------------------------------- */

    $$(".nav-item").forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    handleNavigation(
                        button.dataset.nav
                    );

                }
            );

        }
    );


    /* -----------------------------------------------------
       MODAL CLOSE BUTTONS
    ----------------------------------------------------- */

    $$("[data-close-modal]").forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    closeModal(
                        button.dataset.closeModal
                    );

                }
            );

        }
    );


    /* -----------------------------------------------------
       MODAL BACKDROP
    ----------------------------------------------------- */

    $$(".modal-backdrop").forEach(
        (backdrop) => {

            backdrop.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target === backdrop
                    ) {

                        backdrop.classList.add(
                            "hidden"
                        );

                    }

                }
            );

        }
    );


    /* -----------------------------------------------------
       ESCAPE KEY
    ----------------------------------------------------- */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                closeAllModals();

                $("#notificationPanel")
                    ?.classList.add(
                        "hidden"
                    );

            }

        }
    );


    /* -----------------------------------------------------
       OUTSIDE NOTIFICATION CLICK
    ----------------------------------------------------- */

    document.addEventListener(
        "click",
        (event) => {

            const panel =
                $("#notificationPanel");


            const button =
                $("#notificationButton");


            if (
                panel &&
                button &&
                !panel.classList.contains("hidden") &&
                !panel.contains(event.target) &&
                !button.contains(event.target)
            ) {

                panel.classList.add(
                    "hidden"
                );

            }

        }
    );

}


/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {

    renderAgents();

    renderStats();

    renderActivities();

    renderExecution();

    renderConsole();

    updateNotificationBadge();


    const navCount =
        $("#navAgentCount");


    if (navCount) {

        navCount.textContent =
            state.agents.length;

    }

}


/* =========================================================
   RENDER AGENTS
========================================================= */

function renderAgents() {

    const grid =
        $("#agentsGrid");


    const empty =
        $("#emptyAgents");


    if (
        !grid ||
        !empty
    ) {

        return;

    }


    const searchValue =
        (
            $("#agentSearch")?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const status =
        $("#statusFilter")?.value ||
        "all";


    const sort =
        $("#sortAgents")?.value ||
        "name";


    let agents =
        [...state.agents];


    /* -----------------------------------------------------
       SEARCH
    ----------------------------------------------------- */

    if (searchValue) {

        agents =
            agents.filter(
                (agent) => {

                    const searchable =
                        `
                        ${agent.name}
                        ${agent.role}
                        ${agent.description}
                        ${(agent.capabilities || []).join(" ")}
                        `
                        .toLowerCase();


                    return searchable.includes(
                        searchValue
                    );

                }
            );

    }


    /* -----------------------------------------------------
       STATUS
    ----------------------------------------------------- */

    if (
        status !== "all"
    ) {

        agents =
            agents.filter(
                (agent) =>
                    agent.status === status
            );

    }


    /* -----------------------------------------------------
       SORT
    ----------------------------------------------------- */

    if (
        sort === "name"
    ) {

        agents.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    }


    else if (
        sort === "status"
    ) {

        const order = {

            running: 1,

            idle: 2,

            paused: 3

        };


        agents.sort(
            (a, b) =>
                (
                    order[a.status] || 9
                ) -
                (
                    order[b.status] || 9
                )
        );

    }


    else if (
        sort === "activity"
    ) {

        agents.sort(
            (a, b) =>
                Number(
                    b.activity || 0
                ) -
                Number(
                    a.activity || 0
                )
        );

    }


    /* -----------------------------------------------------
       EMPTY
    ----------------------------------------------------- */

    if (
        agents.length === 0
    ) {

        grid.innerHTML = "";

        empty.classList.remove(
            "hidden"
        );

        return;

    }


    empty.classList.add(
        "hidden"
    );


    /* -----------------------------------------------------
       CREATE CARDS
    ----------------------------------------------------- */

    grid.innerHTML =
        agents
            .map(
                createAgentCard
            )
            .join("");


    /* -----------------------------------------------------
       CARD CLICK
    ----------------------------------------------------- */

    $$(".agent-card").forEach(
        (card) => {

            card.addEventListener(
                "click",
                () => {

                    selectAgent(
                        card.dataset.agentId
                    );

                }
            );

        }
    );


    /* -----------------------------------------------------
       RUN BUTTON
    ----------------------------------------------------- */

    $$(".agent-run").forEach(
        (button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();


                    runAgent(
                        button.dataset.agentId
                    );

                }
            );

        }
    );


    /* -----------------------------------------------------
       SECONDARY BUTTONS
    ----------------------------------------------------- */

    $$(".agent-secondary").forEach(
        (button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();


                    handleAgentSecondaryAction(
                        button.dataset.action,
                        button.dataset.agentId
                    );

                }
            );

        }
    );

}


/* =========================================================
   CREATE AGENT CARD
========================================================= */

function createAgentCard(
    agent
) {

    const selected =
        state.selectedAgentId === agent.id
            ? "selected"
            : "";


    const status =
        agent.status ||
        "idle";


    const statusLabel =
        capitalize(
            status
        );


    const color =
        agent.color ||
        "cyan";


    const actionText =
        status === "running"
            ? "Run Again"
            : "Run Agent";


    const progress =
        clamp(
            agent.progress,
            0,
            100
        );


    return `

        <article
            class="agent-card ${selected}"
            data-agent-id="${escapeAttribute(agent.id)}"
        >

            <div class="agent-top">

                <div class="agent-identity">

                    <div
                        class="agent-avatar ${escapeAttribute(color)}"
                    >
                        ${getInitials(agent.name)}
                    </div>


                    <div>

                        <h3>
                            ${escapeHTML(agent.name)}
                        </h3>


                        <span class="agent-role">

                            ${escapeHTML(agent.role)}
                            Agent

                        </span>

                    </div>

                </div>


                <span
                    class="status-chip ${escapeAttribute(status)}"
                >

                    <span
                        class="status-dot ${getStatusDotClass(status)}"
                    ></span>

                    ${escapeHTML(statusLabel)}

                </span>

            </div>


            <p class="agent-description">

                ${escapeHTML(agent.description)}

            </p>


            <div class="agent-progress">

                <div class="progress-header">

                    <span>
                        Current workload
                    </span>

                    <strong>
                        ${progress}%
                    </strong>

                </div>


                <div class="progress-track">

                    <div
                        class="progress-fill"
                        style="width:${progress}%"
                    ></div>

                </div>

            </div>


            <div class="agent-meta">

                <div class="agent-meta-item">

                    <span>
                        Tasks
                    </span>

                    <strong>
                        ${Number(agent.tasks) || 0}
                    </strong>

                </div>


                <div class="agent-meta-item">

                    <span>
                        Success
                    </span>

                    <strong>
                        ${Number(agent.success) || 0}%
                    </strong>

                </div>


                <div class="agent-meta-item">

                    <span>
                        Last run
                    </span>

                    <strong>
                        ${escapeHTML(
                            agent.lastRun ||
                            "Never"
                        )}
                    </strong>

                </div>

            </div>


            <div class="agent-actions">

                <button
                    class="agent-run"
                    type="button"
                    data-agent-id="${escapeAttribute(agent.id)}"
                >

                    ▶
                    ${escapeHTML(actionText)}

                </button>


                <button
                    class="agent-secondary"
                    type="button"
                    title="View agent details"
                    data-action="details"
                    data-agent-id="${escapeAttribute(agent.id)}"
                >

                    ◉

                </button>


                <button
                    class="agent-secondary"
                    type="button"
                    title="${
                        status === "paused"
                            ? "Resume agent"
                            : "Pause agent"
                    }"
                    data-action="toggle"
                    data-agent-id="${escapeAttribute(agent.id)}"
                >

                    ${
                        status === "paused"
                            ? "▶"
                            : "Ⅱ"
                    }

                </button>


                <button
                    class="agent-secondary"
                    type="button"
                    title="Delete agent"
                    data-action="delete"
                    data-agent-id="${escapeAttribute(agent.id)}"
                >

                    ×

                </button>

            </div>

        </article>

    `;

}


/* =========================================================
   SELECT AGENT
========================================================= */

function selectAgent(
    agentId
) {

    const agent =
        state.agents.find(
            (item) =>
                item.id === agentId
        );


    if (!agent) {

        return;

    }


    state.selectedAgentId =
        agentId;


    saveState();


    renderAgents();

    renderExecution();

    renderConsole();

    /* Morph 3D Quantum Neural Core to match selected Agent */
    if (window.hub3DCore) {
        const role = (agent.role || "").toLowerCase();
        let theme = "default";
        if (role.includes("research")) theme = "research";
        else if (role.includes("analy") || role.includes("data")) theme = "analysis";
        else if (role.includes("auto") || role.includes("task")) theme = "automation";
        else if (role.includes("content")) theme = "content";
        window.hub3DCore.setTheme(theme);
    }


    showToast(
        "Agent selected",
        `${agent.name} is now active.`,
        "info"
    );

}


/* =========================================================
   GET SELECTED AGENT
========================================================= */

function getSelectedAgent() {

    return (
        state.agents.find(
            (agent) =>
                agent.id ===
                state.selectedAgentId
        ) ||
        null
    );

}


/* =========================================================
   SECONDARY AGENT ACTIONS
========================================================= */

function handleAgentSecondaryAction(
    action,
    agentId
) {

    const agent =
        state.agents.find(
            (item) =>
                item.id === agentId
        );


    if (!agent) {

        showToast(
            "Agent unavailable",
            "The selected agent could not be found.",
            "warning"
        );

        return;

    }


    if (
        action === "details"
    ) {

        selectAgent(
            agentId
        );


        updateDetailsModal(
            agentId
        );


        openModal(
            "detailsModal"
        );


        return;

    }


    if (
        action === "toggle"
    ) {

        toggleAgentStatus(
            agentId
        );


        return;

    }


    if (
        action === "delete"
    ) {

        deleteAgent(
            agentId
        );

    }

}


/* =========================================================
   TOGGLE AGENT STATUS
========================================================= */

function toggleAgentStatus(
    agentId
) {

    const agent =
        state.agents.find(
            (item) =>
                item.id === agentId
        );


    if (!agent) return;


    if (
        agent.status === "paused"
    ) {

        agent.status =
            "idle";


        addActivity(
            "▶",
            "",
            `${agent.name} resumed`,
            "Agent is available for new tasks."
        );


        showToast(
            "Agent resumed",
            `${agent.name} is available again.`,
            "success"
        );

    }

    else {

        agent.status =
            "paused";


        if (
            activeExecution &&
            activeExecution.agentId ===
                agentId
        ) {

            stopExecution();

        }


        addActivity(
            "Ⅱ",
            "warning",
            `${agent.name} paused`,
            "Agent execution has been paused."
        );


        showToast(
            "Agent paused",
            `${agent.name} has been paused.`,
            "warning"
        );

    }


    saveState();

    renderAll();

}


/* =========================================================
   DELETE AGENT
========================================================= */

function deleteAgent(
    agentId
) {

    const agent =
        state.agents.find(
            (item) =>
                item.id === agentId
        );


    if (!agent) return;


    const confirmed =
        window.confirm(
            `Delete "${agent.name}" from Agent Hub?`
        );


    if (!confirmed) {

        return;

    }


    if (
        activeExecution &&
        activeExecution.agentId ===
            agentId
    ) {

        stopExecution();

    }


    state.agents =
        state.agents.filter(
            (item) =>
                item.id !== agentId
        );


    if (
        state.agents.length > 0
    ) {

        if (
            state.selectedAgentId ===
            agentId
        ) {

            state.selectedAgentId =
                state.agents[0].id;

        }

    }

    else {

        state.selectedAgentId =
            null;

    }


    addActivity(
        "×",
        "warning",
        `${agent.name} deleted`,
        "Agent was removed from this workspace."
    );


    saveState();

    renderAll();


    showToast(
        "Agent deleted",
        `${agent.name} has been removed.`,
        "success"
    );

}
/* =========================================================
   RUN AGENT
========================================================= */

async function runAgent(
    agentId,
    customPrompt = ""
) {

    const agent =
        state.agents.find(
            (item) =>
                item.id === agentId
        );


    if (!agent) {

        showToast(
            "Agent unavailable",
            "The selected agent could not be found.",
            "warning"
        );

        return;

    }


    if (
        agent.status === "paused"
    ) {

        showToast(
            "Agent is paused",
            "Resume this agent before running it.",
            "warning"
        );

        return;

    }


    const backendId =
        getBackendAgentId(
            agent.id
        );


    if (!backendId) {

        showToast(
            "Backend agent unavailable",
            `${agent.name} is not connected to a FastAPI agent yet.`,
            "warning"
        );

        return;

    }


    selectAgent(
        agentId
    );


    if (executionTimer) {

        clearInterval(
            executionTimer
        );

        executionTimer = null;

    }


    const prompt =
        buildAgentGoal(
            agent,
            customPrompt
        );


    latestUserPrompt =
        prompt;


    latestAIResponse =
        "";


    /* -----------------------------------------------------
       EXECUTION STATE
    ----------------------------------------------------- */

    agent.status =
        "running";

    /* Transition 3D core into high-speed thinking singularity */
    window.hub3DCore?.setState("thinking");


    agent.progress =
        Math.max(
            8,
            Math.min(
                25,
                Number(agent.progress) || 10
            )
        );


    agent.lastRun =
        "Just now";


    activeExecution = {

        agentId:

            agentId,

        progress:

            agent.progress,

        startedAt:

            Date.now(),

        backendStatus:

            "running"

    };


    addActivity(
        "▶",
        "",
        `${agent.name} started execution`,
        shorten(
            prompt,
            120
        )
    );


    saveState();

    renderAll();


    showToast(
        "AI execution started",
        `${agent.name} is sending your task to Gemini.`,
        "success"
    );


    /* -----------------------------------------------------
       VISUAL PROGRESS
    ----------------------------------------------------- */

    executionTimer =
        setInterval(
            () => {

                if (
                    !activeExecution ||
                    activeExecution.agentId !==
                        agentId
                ) {

                    return;

                }


                activeExecution.progress =
                    Math.min(
                        92,
                        activeExecution.progress +
                            3
                    );


                agent.progress =
                    activeExecution.progress;


                renderExecution();

            },
            500
        );


    /* -----------------------------------------------------
       REAL FASTAPI REQUEST
    ----------------------------------------------------- */

    try {

        const result =
            await runBackendAgent(
                agent,
                prompt
            );


        backendConnected =
            true;


        updateBackendIndicator(
            true
        );


        const response =
            extractAIResponse(
                result
            );


        latestAIResponse =
            response;


        agent.lastResponse =
            response;


        agent.lastPrompt =
            prompt;


        if (
            activeExecution &&
            activeExecution.agentId ===
                agentId
        ) {

            activeExecution.backendStatus =
                result?.status ||
                result?.execution?.status ||
                "completed";


            activeExecution.progress =
                100;

        }


        completeExecution(
            agent,
            response
        );


    }

    catch (error) {

        backendConnected =
            false;


        updateBackendIndicator(
            false
        );


        if (executionTimer) {

            clearInterval(
                executionTimer
            );

            executionTimer =
                null;

        }


        activeExecution =
            null;


        agent.status =
            "idle";


        agent.progress =
            Math.max(
                10,
                Number(agent.progress) || 10
            );


        addActivity(
            "!",
            "warning",
            `${agent.name} execution failed`,
            shorten(
                error.message ||
                    "Unknown backend error.",
                140
            )
        );


        saveState();

        renderAll();


        showToast(
            "AI request failed",
            error.message ||
                "Could not reach the NEXUS AI backend.",
            "warning"
        );

    }

}


/* =========================================================
   COMPLETE EXECUTION
========================================================= */

function completeExecution(
    agent,
    response = ""
) {

    if (executionTimer) {

        clearInterval(
            executionTimer
        );

        executionTimer =
            null;

    }


    agent.progress =
        100;


    agent.tasks =
        Number(
            agent.tasks || 0
        ) + 1;


    /*
       Keep the displayed success rate
       realistic and deterministic.
    */

    const currentSuccess =
        Number(
            agent.success || 0
        );


    agent.success =
        Math.min(
            100,
            currentSuccess
        );


    agent.lastRun =
        "Just now";


    state.completedTasks =
        Number(
            state.completedTasks || 0
        ) + 1;


    /* -----------------------------------------------------
       HISTORY
    ----------------------------------------------------- */

    if (
        !Array.isArray(
            agent.history
        )
    ) {

        agent.history = [];

    }


    agent.history.push(
        agent.success
    );


    if (
        agent.history.length > 14
    ) {

        agent.history.shift();

    }


    activeExecution =
        null;


    addActivity(
        "✓",
        "success",
        `${agent.name} completed execution`,
        "Gemini response generated successfully."
    );


    saveState();

    renderAll();

    /* 3D Core Speaking State & Voice Synthesis */
    if (window.hub3DCore) {
        window.hub3DCore.setState("speaking");
        if (window.nexusVoice && window.nexusVoice.enabled) {
            window.nexusVoice.speak(response, window.hub3DCore);
        } else {
            setTimeout(() => {
                if (!window.nexusVoice?.isSpeaking) {
                    window.hub3DCore?.setState("idle");
                }
            }, 2600);
        }
    }

    showToast(
        "Execution completed",
        `${agent.name} finished successfully.`,
        "success"
    );

}


/* =========================================================
   STOP EXECUTION
========================================================= */

function stopExecution() {

    if (executionTimer) {

        clearInterval(
            executionTimer
        );

        executionTimer =
            null;

    }


    activeExecution =
        null;


    renderExecution();

}


/* =========================================================
   EXECUTION MONITOR
========================================================= */

function renderExecution() {

    const container =
        $("#executionMain");


    if (!container) {

        return;

    }


    const agent =
        getSelectedAgent();


    if (!agent) {

        container.innerHTML = `

            <div class="execution-empty">

                <div class="execution-icon">
                    ✦
                </div>

                <h3>
                    No agents available
                </h3>

                <p>
                    Create an agent to start managing AI executions.
                </p>

            </div>

        `;

        return;

    }


    const isActive =
        Boolean(
            activeExecution &&
            activeExecution.agentId ===
                agent.id
        );


    const progress =
        isActive
            ? activeExecution.progress
            : agent.progress;


    const hasResponse =
        Boolean(
            agent.lastResponse
        );


    container.innerHTML = `

        <div class="execution-active">


            <!-- =========================================
                 AGENT HEADER
            ========================================== -->

            <div class="execution-agent-header">

                <div class="execution-agent-avatar">

                    ${getInitials(
                        agent.name
                    )}

                </div>


                <div>

                    <h3>
                        ${escapeHTML(
                            agent.name
                        )}
                    </h3>


                    <p>

                        ${
                            isActive
                                ? "Processing your request..."
                                : `${capitalize(
                                    agent.status
                                )} · ${
                                    escapeHTML(
                                        agent.model
                                    )
                                }`
                        }

                    </p>

                </div>

            </div>


            <!-- =========================================
                 PROGRESS
            ========================================== -->

            <div class="execution-progress">

                <div class="execution-progress-header">

                    <span>

                        ${
                            isActive
                                ? "Execution progress"
                                : "Current workload"
                        }

                    </span>


                    <strong>

                        ${clamp(
                            progress,
                            0,
                            100
                        )}%

                    </strong>

                </div>


                <div class="big-progress">

                    <span
                        style="
                            width:${clamp(
                                progress,
                                0,
                                100
                            )}%
                        "
                    ></span>

                </div>

            </div>


            <!-- =========================================
                 AI RESPONSE
            ========================================== -->

            ${
                hasResponse &&
                !isActive

                    ? createAIResponseCard(
                        agent
                    )

                    : ""
            }


            <!-- =========================================
                 EXECUTION STATS
            ========================================== -->

            <div class="execution-stats">

                <div class="execution-stat">

                    <span>
                        Tasks completed
                    </span>

                    <strong>
                        ${Number(
                            agent.tasks || 0
                        )}
                    </strong>

                </div>


                <div class="execution-stat">

                    <span>
                        Success rate
                    </span>

                    <strong>
                        ${Number(
                            agent.success || 0
                        )}%
                    </strong>

                </div>


                <div class="execution-stat">

                    <span>
                        Last execution
                    </span>

                    <strong>
                        ${escapeHTML(
                            agent.lastRun ||
                            "Never"
                        )}
                    </strong>

                </div>

            </div>


            <!-- =========================================
                 CONTROLS
            ========================================== -->

            <div class="execution-controls">

                <button
                    class="primary-button"
                    type="button"
                    id="executionRunButton"
                >
                    ▶ Run Agent
                </button>


                ${
                    hasResponse &&
                    !isActive

                        ? `
                            <button
                                class="secondary-button"
                                type="button"
                                id="copyExecutionButton"
                            >
                                📋 Copy
                            </button>

                            <button
                                class="secondary-button"
                                type="button"
                                id="exportExecutionButton"
                            >
                                ⬇ Export
                            </button>
                        `

                        : ""
                }


                <button
                    class="secondary-button"
                    type="button"
                    id="executionDetailsButton"
                >
                    View Details
                </button>

            </div>

        </div>

    `;


    /* -----------------------------------------------------
       RUN
    ----------------------------------------------------- */

    $("#executionRunButton")
        ?.addEventListener(
            "click",
            () => {

                runAgent(
                    agent.id
                );

            }
        );


    /* -----------------------------------------------------
       COPY
    ----------------------------------------------------- */

    $("#copyExecutionButton")
        ?.addEventListener(
            "click",
            () => {

                copyAIResponse(
                    agent.lastResponse
                );

            }
        );


    /* -----------------------------------------------------
       EXPORT
    ----------------------------------------------------- */

    $("#exportExecutionButton")
        ?.addEventListener(
            "click",
            () => {

                exportAIReport(
                    agent
                );

            }
        );


    /* -----------------------------------------------------
       DETAILS
    ----------------------------------------------------- */

    $("#executionDetailsButton")
        ?.addEventListener(
            "click",
            () => {

                updateDetailsModal(
                    agent.id
                );


                openModal(
                    "detailsModal"
                );

            }
        );

}


/* =========================================================
   PREMIUM AI RESPONSE CARD
========================================================= */

function createAIResponseCard(
    agent
) {

    const response =
        agent.lastResponse ||
        "";


    const prompt =
        agent.lastPrompt ||
        latestUserPrompt ||
        "";


    const rendered =
        renderMarkdown(
            response
        );


    const wordCount =
        countWords(
            response
        );


    const readingTime =
        Math.max(
            1,
            Math.ceil(
                wordCount / 200
            )
        );


    return `

        <section
            class="nexus-ai-response-card"
            id="nexusAIResponseCard"
        >

            <div class="nexus-response-header">

                <div class="nexus-response-brand">

                    <div class="nexus-ai-orb">
                        ✦
                    </div>


                    <div>

                        <span class="nexus-response-eyebrow">
                            NEXUS AI
                        </span>

                        <h3>
                            AI Research Response
                        </h3>

                    </div>

                </div>


                <div class="nexus-response-status">

                    <span class="nexus-live-dot"></span>

                    Completed

                </div>

            </div>


            ${
                prompt
                    ? `
                        <div class="nexus-response-prompt">

                            <span>
                                TASK
                            </span>

                            <p>
                                ${escapeHTML(
                                    prompt
                                )}
                            </p>

                        </div>
                    `
                    : ""
            }


            <div
                class="nexus-response-body markdown-body"
            >

                ${rendered}

            </div>


            <div class="nexus-response-footer">

                <div class="nexus-response-metrics">

                    <span>
                        ${wordCount} words
                    </span>

                    <span>
                        ~${readingTime} min read
                    </span>

                    <span>
                        Gemini
                    </span>

                </div>


                <div class="nexus-response-actions">

                    <button
                        type="button"
                        class="nexus-action-button"
                        data-response-action="copy"
                    >
                        📋 Copy
                    </button>


                    <button
                        type="button"
                        class="nexus-action-button"
                        data-response-action="export"
                    >
                        ⬇ Export
                    </button>


                    <button
                        type="button"
                        class="nexus-action-button nexus-speak-btn"
                        data-response-action="speak"
                    >
                        🔊 Speak Answer
                    </button>

                    <button
                        type="button"
                        class="nexus-action-button"
                        data-response-action="rerun"
                    >
                        ↻ Run Again
                    </button>

                </div>

            </div>

        </section>

    `;

}


/* =========================================================
   RESPONSE ACTION BINDING
========================================================= */

document.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                "[data-response-action]"
            );


        if (!button) return;


        const action =
            button.dataset.responseAction;


        const agent =
            getSelectedAgent();


        if (!agent) return;


        if (
            action === "copy"
        ) {

            copyAIResponse(
                agent.lastResponse
            );

        }


        else if (
            action === "export"
        ) {

            exportAIReport(
                agent
            );

        }


        else if (
            action === "speak"
        ) {

            if (window.nexusVoice) {
                if (window.nexusVoice.isSpeaking) {
                    window.nexusVoice.stop();
                    button.innerHTML = "🔊 Speak Answer";
                    button.classList.remove("speaking");
                } else {
                    window.nexusVoice.setEnabled(true);
                    button.innerHTML = "⏹ Stop Voice";
                    button.classList.add("speaking");
                    window.nexusVoice.speak(agent.lastResponse, window.hub3DCore);

                    const pollVoice = setInterval(() => {
                        if (!window.nexusVoice.isSpeaking) {
                            button.innerHTML = "🔊 Speak Answer";
                            button.classList.remove("speaking");
                            clearInterval(pollVoice);
                        }
                    }, 250);
                }
            }

        }


        else if (
            action === "rerun"
        ) {

            runAgent(
                agent.id,
                agent.lastPrompt || ""
            );

        }

    }
);


/* =========================================================
   MARKDOWN RENDERER
========================================================= */

function renderMarkdown(
    markdown
) {

    if (!markdown) {

        return `
            <p>
                No response was returned.
            </p>
        `;

    }


    let text =
        String(markdown)
            .replace(/\r\n/g, "\n")
            .trim();


    /*
       Escape HTML first so Gemini output
       cannot inject arbitrary HTML.
    */

    text =
        escapeHTML(
            text
        );


    /*
       CODE BLOCKS
    */

    const codeBlocks = [];


    text =
        text.replace(
            /```([\s\S]*?)```/g,
            (
                match,
                code
            ) => {

                const token =
                    `___NEXUS_CODE_${codeBlocks.length}___`;


                codeBlocks.push(
                    `
                    <pre class="nexus-code-block"><code>${code.trim()}</code></pre>
                    `
                );


                return token;

            }
        );


    /*
       HEADINGS
    */

    text =
        text.replace(
            /^### (.+)$/gm,
            "<h4>$1</h4>"
        );


    text =
        text.replace(
            /^## (.+)$/gm,
            "<h3>$1</h3>"
        );


    text =
        text.replace(
            /^# (.+)$/gm,
            "<h2>$1</h2>"
        );


    /*
       HORIZONTAL RULE
    */

    text =
        text.replace(
            /^---$/gm,
            "<hr>"
        );


    /*
       BOLD
    */

    text =
        text.replace(
            /\*\*(.+?)\*\*/g,
            "<strong>$1</strong>"
        );


    /*
       ITALIC
    */

    text =
        text.replace(
            /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
            "<em>$1</em>"
        );


    /*
       INLINE CODE
    */

    text =
        text.replace(
            /`([^`\n]+)`/g,
            "<code class=\"nexus-inline-code\">$1</code>"
        );


    /*
       LINKS
    */

    text =
        text.replace(
            /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
            `
            <a
                href="$2"
                target="_blank"
                rel="noopener noreferrer"
            >
                $1
            </a>
            `
        );


    /*
       BLOCKQUOTES
    */

    text =
        text.replace(
            /^&gt; (.+)$/gm,
            `
            <blockquote>
                $1
            </blockquote>
            `
        );


    /*
       BULLET LISTS
    */

    text =
        text.replace(
            /(?:^|\n)((?:[-*] .+(?:\n|$))+)/g,
            (
                match,
                list
            ) => {

                const items =
                    list
                        .trim()
                        .split("\n")
                        .map(
                            (line) =>
                                line
                                    .replace(
                                        /^[-*]\s+/,
                                        ""
                                    )
                        )
                        .map(
                            (item) =>
                                `<li>${item}</li>`
                        )
                        .join("");


                return `
                    <ul>
                        ${items}
                    </ul>
                `;

            }
        );


    /*
       NUMBERED LISTS
    */

    text =
        text.replace(
            /(?:^|\n)((?:\d+\.\s.+(?:\n|$))+)/g,
            (
                match,
                list
            ) => {

                const items =
                    list
                        .trim()
                        .split("\n")
                        .map(
                            (line) =>
                                line.replace(
                                    /^\d+\.\s+/,
                                    ""
                                )
                        )
                        .map(
                            (item) =>
                                `<li>${item}</li>`
                        )
                        .join("");


                return `
                    <ol>
                        ${items}
                    </ol>
                `;

            }
        );


    /*
       PARAGRAPHS
    */

    const blocks =
        text
            .split(/\n{2,}/)
            .map(
                (block) =>
                    block.trim()
            )
            .filter(Boolean);


    let html =
        blocks
            .map(
                (block) => {

                    if (
                        block.startsWith("<h2>") ||
                        block.startsWith("<h3>") ||
                        block.startsWith("<h4>") ||
                        block.startsWith("<ul>") ||
                        block.startsWith("<ol>") ||
                        block.startsWith("<blockquote>") ||
                        block.startsWith("<pre") ||
                        block.startsWith("<hr")
                    ) {

                        return block;

                    }


                    return `
                        <p>
                            ${block.replace(
                                /\n/g,
                                "<br>"
                            )}
                        </p>
                    `;

                }
            )
            .join("");


    /*
       Restore code blocks.
    */

    codeBlocks.forEach(
        (block, index) => {

            html =
                html.replace(
                    `___NEXUS_CODE_${index}___`,
                    block
                );

        }
    );


    return html;

}


/* =========================================================
   COPY RESPONSE
========================================================= */

async function copyAIResponse(
    response
) {

    if (!response) {

        showToast(
            "Nothing to copy",
            "There is no AI response available.",
            "warning"
        );

        return;

    }


    try {

        await navigator.clipboard.writeText(
            response
        );


        showToast(
            "Response copied",
            "The Gemini response is now in your clipboard.",
            "success"
        );

    }

    catch (error) {

        showToast(
            "Copy failed",
            "Your browser blocked clipboard access.",
            "warning"
        );

    }

}


/* =========================================================
   EXPORT AI REPORT
========================================================= */

function exportAIReport(
    agent
) {

    if (
        !agent ||
        !agent.lastResponse
    ) {

        showToast(
            "Nothing to export",
            "Run an agent before exporting a report.",
            "warning"
        );

        return;

    }


    const report = `

NEXUS AI — RESEARCH REPORT
========================================

Agent:
${agent.name}

Model:
${agent.model}

Task:
${agent.lastPrompt || "AI Agent Task"}

Generated:
${new Date().toLocaleString()}

========================================

${agent.lastResponse}

========================================

Generated by NEXUS AI Intelligent Work Studio.

`;


    const blob =
        new Blob(
            [report.trim()],
            {
                type:
                    "text/plain;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `NEXUS-AI-${slugify(
            agent.name
        )}-report.txt`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "Report exported",
        "Your AI report has been downloaded as a text file.",
        "success"
    );

}


/* =========================================================
   WORD COUNT
========================================================= */

function countWords(
    text
) {

    if (!text) {

        return 0;

    }


    return (
        String(text)
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .length
    );

}


/* =========================================================
   SLUGIFY
========================================================= */

function slugify(
    text
) {

    return String(
        text || "agent"
    )
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );

}
/* =========================================================
   CREATE AGENT
========================================================= */

function handleCreateAgent(
    event
) {

    event.preventDefault();


    const name =
        $("#newAgentName")?.value.trim() ||
        "";


    const role =
        $("#newAgentRole")?.value.trim() ||
        "Custom";


    const description =
        $("#newAgentDescription")?.value.trim() ||
        "Custom AI agent created in NEXUS AI.";


    if (!name) {

        showToast(
            "Agent name required",
            "Enter a name for your new agent.",
            "warning"
        );

        $("#newAgentName")?.focus();

        return;

    }


    const id =
        `custom-${Date.now()}`;


    const newAgent = {

        id,

        name,

        role,

        description,

        model:
            "Gemini 3.6 Flash",

        status:
            "idle",

        progress:
            0,

        tasks:
            0,

        success:
            100,

        lastRun:
            "Never",

        activity:
            0,

        color:
            "cyan",

        capabilities: [
            "AI Execution",
            "Task Processing",
            "Custom Instructions"
        ],

        history: [
            100
        ]

    };


    state.agents.push(
        newAgent
    );


    state.selectedAgentId =
        id;


    addActivity(
        "✦",
        "success",
        `${name} created`,
        "New AI agent added to the workspace."
    );


    saveState();

    renderAll();


    closeModal(
        "createModal"
    );


    $("#createAgentForm")?.reset();


    showToast(
        "Agent created",
        `${name} is ready for AI tasks.`,
        "success"
    );

}


/* =========================================================
   CONSOLE
========================================================= */

function renderConsole() {

    const agent =
        getSelectedAgent();


    const input =
        $("#agentPrompt");


    const selectedName =
        $("#selectedAgentName");


    const selectedRole =
        $("#selectedAgentRole");


    const selectedAvatar =
        $("#selectedAgentAvatar");


    if (!agent) {

        if (selectedName) {

            selectedName.textContent =
                "No agent selected";

        }


        if (selectedRole) {

            selectedRole.textContent =
                "Select an agent to begin";

        }


        if (selectedAvatar) {

            selectedAvatar.textContent =
                "AI";

        }


        if (input) {

            input.disabled =
                true;

        }


        return;

    }


    if (selectedName) {

        selectedName.textContent =
            agent.name;

    }


    if (selectedRole) {

        selectedRole.textContent =
            `${agent.role} Agent · ${agent.model}`;

    }


    if (selectedAvatar) {

        selectedAvatar.textContent =
            getInitials(
                agent.name
            );

    }


    if (input) {

        input.disabled =
            agent.status === "paused";

    }


    const statusElement =
        $("#consoleStatus");


    if (statusElement) {

        statusElement.textContent =
            agent.status === "paused"
                ? "Agent paused"
                : backendConnected
                    ? "Backend connected"
                    : "Checking backend...";

    }

}


/* =========================================================
   UPDATE DETAILS MODAL
========================================================= */

function updateDetailsModal(
    agentId
) {

    const agent =
        state.agents.find(
            (item) =>
                item.id === agentId
        );


    if (!agent) return;


    const fields = {

        "#detailsAgentName":
            agent.name,

        "#detailsAgentRole":
            `${agent.role} Agent`,

        "#detailsAgentStatus":
            capitalize(
                agent.status
            ),

        "#detailsAgentModel":
            agent.model,

        "#detailsAgentTasks":
            String(
                agent.tasks || 0
            ),

        "#detailsAgentSuccess":
            `${agent.success || 0}%`,

        "#detailsAgentLastRun":
            agent.lastRun ||
            "Never",

        "#detailsAgentDescription":
            agent.description

    };


    Object.entries(
        fields
    ).forEach(
        (
            [selector, value]
        ) => {

            const element =
                $(selector);


            if (element) {

                element.textContent =
                    value;

            }

        }
    );


    const capabilityContainer =
        $("#detailsCapabilities");


    if (
        capabilityContainer
    ) {

        capabilityContainer.innerHTML =
            (
                agent.capabilities ||
                []
            )
            .map(
                (capability) => `

                    <span class="capability-chip">

                        ${escapeHTML(
                            capability
                        )}

                    </span>

                `
            )
            .join("");

    }


    const historyContainer =
        $("#detailsHistory");


    if (
        historyContainer
    ) {

        const history =
            agent.history ||
            [];


        historyContainer.innerHTML =
            history
                .slice(-10)
                .map(
                    (value) => `

                        <div class="history-bar">

                            <span
                                style="
                                    height:${clamp(
                                        value,
                                        0,
                                        100
                                    )}%
                                "
                            ></span>

                        </div>

                    `
                )
                .join("");

    }


    const pauseButton =
        $("#detailsPauseButton");


    if (pauseButton) {

        pauseButton.textContent =
            agent.status === "paused"
                ? "Resume Agent"
                : "Pause Agent";

    }

}


/* =========================================================
   ACTIVITY
========================================================= */

function renderActivities() {

    const list =
        $("#activityList");


    if (!list) return;


    if (
        !state.activities.length
    ) {

        list.innerHTML = `

            <div class="execution-empty">

                <div class="execution-icon">
                    ◷
                </div>

                <h3>
                    No activity yet
                </h3>

                <p>
                    Agent actions will appear here.
                </p>

            </div>

        `;

        return;

    }


    list.innerHTML =
        state.activities
            .slice(
                0,
                12
            )
            .map(
                (
                    activity
                ) => `

                    <div class="activity-item">

                        <div
                            class="activity-icon ${escapeAttribute(
                                activity.type || ""
                            )}"
                        >

                            ${escapeHTML(
                                activity.icon || "•"
                            )}

                        </div>


                        <div class="activity-text">

                            <strong>
                                ${escapeHTML(
                                    activity.title
                                )}
                            </strong>


                            <span>
                                ${escapeHTML(
                                    activity.description
                                )}
                            </span>

                        </div>


                        <span class="activity-time">

                            ${escapeHTML(
                                activity.time
                            )}

                        </span>

                    </div>

                `
            )
            .join("");

}


/* =========================================================
   ADD ACTIVITY
========================================================= */

function addActivity(
    icon,
    type,
    title,
    description
) {

    state.activities.unshift({

        id:
            `activity-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 6)}`,

        icon,

        type,

        title,

        description,

        time:
            "Just now"

    });


    state.activities =
        state.activities.slice(
            0,
            20
        );

}


/* =========================================================
   CLEAR ACTIVITY
========================================================= */

function clearActivity() {

    if (
        !state.activities.length
    ) {

        showToast(
            "Activity already clear",
            "There are no activity items to remove.",
            "info"
        );

        return;

    }


    state.activities = [];


    saveState();


    renderActivities();


    showToast(
        "Activity cleared",
        "The activity feed has been cleared.",
        "success"
    );

}


/* =========================================================
   STATS
========================================================= */

function renderStats() {

    const total =
        state.agents.length;


    const running =
        state.agents.filter(
            (agent) =>
                agent.status ===
                "running"
        ).length;


    const completed =
        Number(
            state.completedTasks || 0
        );


    const successValues =
        state.agents
            .map(
                (agent) =>
                    Number(
                        agent.success || 0
                    )
            );


    const averageSuccess =
        successValues.length
            ? (
                successValues.reduce(
                    (
                        totalValue,
                        value
                    ) =>
                        totalValue + value,
                    0
                ) /
                successValues.length
            ).toFixed(1)

            : "0.0";


    const totalElement =
        $("#totalAgents");


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    const runningElement =
        $("#runningAgents");


    if (runningElement) {

        runningElement.textContent =
            running;

    }


    const completedElement =
        $("#completedTasks");


    if (completedElement) {

        completedElement.textContent =
            completed;

    }


    const successElement =
        $("#successRate");


    if (successElement) {

        successElement.textContent =
            `${averageSuccess}%`;

    }


    const headerCompleted =
        $("#headerCompletedTasks");


    if (headerCompleted) {

        headerCompleted.textContent =
            completed;

    }

}


/* =========================================================
   NOTIFICATION BADGE
========================================================= */

function updateNotificationBadge() {

    const badge =
        $("#notificationBadge");


    if (!badge) return;


    const count =
        Number(
            state.notifications || 0
        );


    badge.textContent =
        count;


    badge.style.display =
        count > 0
            ? "grid"
            : "none";

}


/* =========================================================
   MARK NOTIFICATIONS READ
========================================================= */

function markNotificationsRead() {

    state.notifications =
        0;


    saveState();


    updateNotificationBadge();


    $$(".notification-item")
        .forEach(
            (item) =>
                item.classList.remove(
                    "unread"
                )
        );


    $("#notificationPanel")
        ?.classList.add(
            "hidden"
        );


    showToast(
        "Notifications cleared",
        "All notifications have been marked as read.",
        "success"
    );

}


/* =========================================================
   MODALS
========================================================= */

function openModal(
    id
) {

    const modal =
        $(`#${id}`);


    if (!modal) {

        showToast(
            "Modal unavailable",
            `The ${id} component was not found in the page.`,
            "warning"
        );

        return;

    }


    modal.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";


    const firstInput =
        modal.querySelector(
            "input, textarea, select"
        );


    if (firstInput) {

        setTimeout(
            () =>
                firstInput.focus(),
            80
        );

    }

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal(
    id
) {

    const modal =
        $(`#${id}`);


    if (!modal) return;


    modal.classList.add(
        "hidden"
    );


    if (
        $$(
            ".modal-backdrop:not(.hidden)"
        ).length === 0
    ) {

        document.body.style.overflow =
            "";

    }

}


/* =========================================================
   CLOSE ALL MODALS
========================================================= */

function closeAllModals() {

    $$(".modal-backdrop")
        .forEach(
            (modal) =>
                modal.classList.add(
                    "hidden"
                )
        );


    document.body.style.overflow =
        "";

}


/* =========================================================
   THEME
========================================================= */

function applyTheme() {

    document.body.classList.toggle(
        "light-mode",
        Boolean(
            state.lightMode
        )
    );

}


/* =========================================================
   TOGGLE THEME
========================================================= */

function toggleTheme() {

    state.lightMode =
        !Boolean(
            state.lightMode
        );


    applyTheme();


    saveState();


    showToast(
        "Appearance updated",
        state.lightMode
            ? "Light appearance enabled."
            : "Dark NEXUS appearance enabled.",
        "info"
    );

}


/* =========================================================
   AGENT PROMPT
========================================================= */

function sendAgentPrompt() {

    const input =
        $("#agentPrompt");


    if (!input) return;


    const prompt =
        input.value.trim();


    if (!prompt) {

        showToast(
            "Task required",
            "Describe what you want your selected agent to do.",
            "warning"
        );


        input.focus();


        return;

    }


    const agent =
        getSelectedAgent();


    if (!agent) {

        showToast(
            "No agent selected",
            "Select an agent before sending a task.",
            "warning"
        );

        return;

    }


    if (
        agent.status ===
        "paused"
    ) {

        showToast(
            "Agent is paused",
            "Resume the agent before sending a task.",
            "warning"
        );

        return;

    }


    input.value =
        "";


    addActivity(
        "➤",
        "",
        `Task sent to ${agent.name}`,
        shorten(
            prompt,
            90
        )
    );


    saveState();


    renderActivities();


    showToast(
        "Task submitted",
        `${agent.name} received your instruction.`,
        "success"
    );


    runAgent(
        agent.id,
        prompt
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function handleNavigation(
    destination
) {

    $$(".nav-item")
        .forEach(
            (button) =>
                button.classList.toggle(
                    "active",
                    button.dataset.nav ===
                        destination
                )
        );


    const routes = {

        command:
            "../command-center/index.html",

        agents:
            "../agent-hub/index.html",

        workflows:
            "../workflow-builder/index.html",

        insights:
            "../ai-insights/index.html",

        tasks:
            "../command-center/index.html#command",

        activity:
            "../command-center/index.html#activity",

        settings:
            "../command-center/index.html#settings"

    };


    if (
        destination ===
        "agents"
    ) {

        $("#agentsSection")
            ?.scrollIntoView({
                behavior:
                    "smooth",

                block:
                    "start"
            });


        return;

    }


    if (
        routes[destination]
    ) {

        window.location.href =
            routes[destination];


        return;

    }


    const messages = {

        tasks:
            "Tasks are managed through the Command Center.",

        activity:
            "Showing the latest Agent Hub system activity.",

        settings:
            "Agent Hub settings are ready for backend configuration."

    };


    showToast(
        capitalize(
            destination
        ),
        messages[destination] ||
            "This workspace module is available.",
        "info"
    );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    title,
    message,
    type = "success"
) {

    const container =
        $("#toastContainer");


    if (!container) return;


    const icon =
        type === "warning"
            ? "!"
            : type === "info"
                ? "i"
                : "✓";


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast";


    toast.innerHTML = `

        <div class="toast-icon">

            ${icon}

        </div>


        <div>

            <strong>
                ${escapeHTML(
                    title
                )}
            </strong>


            <span>
                ${escapeHTML(
                    message
                )}
            </span>

        </div>

    `;


    container.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.style.opacity =
                "0";


            toast.style.transform =
                "translateX(12px)";


            setTimeout(
                () =>
                    toast.remove(),
                200
            );

        },
        3200
    );

}
/* =========================================================
   UTILITY — ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   UTILITY — ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


/* =========================================================
   UTILITY — CAPITALIZE
========================================================= */

function capitalize(
    value
) {

    if (!value) {

        return "";

    }


    const text =
        String(value);


    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );

}


/* =========================================================
   UTILITY — INITIALS
========================================================= */

function getInitials(
    name
) {

    if (!name) {

        return "AI";

    }


    const words =
        String(name)
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (
        words.length === 1
    ) {

        return words[0]
            .slice(0, 2)
            .toUpperCase();

    }


    return (
        words[0].charAt(0) +
        words[
            words.length - 1
        ].charAt(0)
    ).toUpperCase();

}


/* =========================================================
   UTILITY — STATUS DOT
========================================================= */

function getStatusDotClass(
    status
) {

    if (
        status === "running"
    ) {

        return "running";

    }


    if (
        status === "paused"
    ) {

        return "paused";

    }


    return "idle";

}


/* =========================================================
   UTILITY — CLAMP
========================================================= */

function clamp(
    value,
    min,
    max
) {

    const number =
        Number(value);


    if (
        Number.isNaN(number)
    ) {

        return min;

    }


    return Math.min(
        max,
        Math.max(
            min,
            number
        )
    );

}


/* =========================================================
   UTILITY — SHORTEN
========================================================= */

function shorten(
    value,
    length = 100
) {

    const text =
        String(
            value || ""
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();


    if (
        text.length <= length
    ) {

        return text;

    }


    return (
        text.slice(
            0,
            length - 3
        ) +
        "..."
    );

}


/* =========================================================
   AGENT HEALTH
========================================================= */

function getAgentHealth(
    agent
) {

    if (!agent) {

        return "unknown";

    }


    if (
        agent.status ===
        "paused"
    ) {

        return "paused";

    }


    if (
        agent.status ===
        "running"
    ) {

        return "active";

    }


    if (
        Number(agent.success || 0) >= 90
    ) {

        return "healthy";

    }


    if (
        Number(agent.success || 0) >= 70
    ) {

        return "stable";

    }


    return "attention";

}


/* =========================================================
   RESPONSE TEXT
========================================================= */

function getLatestResponse() {

    const agent =
        getSelectedAgent();


    if (
        !agent
    ) {

        return "";

    }


    return (
        agent.lastResponse ||
        latestAIResponse ||
        ""
    );

}


/* =========================================================
   SEARCH RESET
========================================================= */

function resetAgentFilters() {

    const search =
        $("#agentSearch");


    const filter =
        $("#statusFilter");


    const sort =
        $("#sortAgents");


    if (search) {

        search.value =
            "";

    }


    if (filter) {

        filter.value =
            "all";

    }


    if (sort) {

        sort.value =
            "name";

    }


    renderAgents();

}


/* =========================================================
   REFRESH CURRENT AGENT
========================================================= */

async function refreshCurrentAgent() {

    const agent =
        getSelectedAgent();


    if (!agent) {

        return;

    }


    await checkBackendConnection();


    renderAll();

}


/* =========================================================
   BACKEND DEBUG HELPERS
========================================================= */

window.NEXUS_API = {

    baseURL:
        API_BASE_URL,


    health:
        async function () {

            return backendFetch(
                "/api/health"
            );

        },


    agents:
        async function () {

            return backendFetch(
                "/api/agents"
            );

        },


    run:
        async function (
            agentId,
            goal
        ) {

            return backendFetch(
                `/api/agents/${encodeURIComponent(
                    agentId
                )}/run`,
                {
                    method:
                        "POST",

                    body:
                        JSON.stringify({
                            goal
                        })
                }
            );

        },


    status:
        async function () {

            return backendFetch(
                "/api/system/status"
            );

        },


    getState:
        function () {

            return state;

        },


    getSelectedAgent:
        function () {

            return getSelectedAgent();

        },


    resetState:
        function () {

            localStorage.removeItem(
                STORAGE_KEY
            );


            state =
                cloneDefaultState();


            renderAll();


            showToast(
                "Agent Hub reset",
                "Local Agent Hub state has been restored.",
                "success"
            );

        }

};


/* =========================================================
   GLOBAL AGENT HUB API
========================================================= */

window.NEXUS_AGENT_HUB = {

    runAgent,

    selectAgent,

    getSelectedAgent,

    renderAll,

    refreshCurrentAgent,

    resetAgentFilters,

    copyAIResponse,

    exportAIReport,

    toggleTheme

};


/* =========================================================
   BACKEND CONNECTION RETRY
========================================================= */

window.addEventListener(
    "online",
    () => {

        checkBackendConnection();

    }
);


/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            renderAll();

        }

    }
);


/* =========================================================
   PERIODIC BACKEND HEALTH CHECK
========================================================= */

setInterval(
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            checkBackendConnection();

        }

    },
    30000
);


/* =========================================================
   PREVENT ACCIDENTAL FORM SUBMISSION
========================================================= */

document.addEventListener(
    "submit",
    (event) => {

        const form =
            event.target;


        if (
            form &&
            form.id !==
                "createAgentForm"
        ) {

            event.preventDefault();

        }

    }
);


/* =========================================================
   FINAL STARTUP CHECK
========================================================= */

(function nexusStartup() {

    /*
       The DOMContentLoaded handler in Part 1
       performs the main initialization.

       This section only exposes a safe startup
       marker for debugging.
    */

    window.NEXUS_READY =
        true;


    console.log(
        "%c NEXUS AI Agent Hub ",
        "font-weight:bold;font-size:16px;"
    );


    console.log(
        "Frontend: READY"
    );


    console.log(
        `Backend: ${API_BASE_URL}`
    );


    console.log(
        "Gemini integration: ENABLED THROUGH FASTAPI"
    );

})();