/* =========================================================
   NEXUS AI — AGENT HUB
   Complete frontend interaction layer
========================================================= */

"use strict";

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "nexus_agent_hub_state_v1";

function syncNexusProfile() {
    try {
        const raw = localStorage.getItem("nexus_ai_command_center_v4");
        const state = raw ? JSON.parse(raw) : {};
        const name = state?.user?.name || "NEXUS User";
        const email = state?.user?.email || "user@example.com";
        const avatar = name.trim().charAt(0).toUpperCase() || "N";
        document.getElementById("profileName")?.replaceChildren(document.createTextNode(name));
        document.getElementById("profileEmail")?.replaceChildren(document.createTextNode(email));
        document.getElementById("profileAvatar")?.replaceChildren(document.createTextNode(avatar));
    } catch (_) {}
}



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
        model: "NEXUS Reasoner",
        status: "running",
        progress: 72,
        tasks: 42,
        success: 98,
        lastRun: "2 min ago",
        activity: 94,
        color: "cyan",
        capabilities: [
            "Web Research",
            "Summarization",
            "Source Analysis",
            "Report Generation"
        ],
        history: [62, 75, 69, 88, 74, 91, 82, 96, 84, 93, 87, 98]
    },

    {
        id: "analysis-002",
        name: "Data Analyst",
        role: "Analysis",
        description:
            "Analyzes structured information and converts complex data into useful insights.",
        model: "NEXUS Reasoner",
        status: "running",
        progress: 56,
        tasks: 36,
        success: 97,
        lastRun: "8 min ago",
        activity: 87,
        color: "purple",
        capabilities: [
            "Data Analysis",
            "Pattern Detection",
            "Insights",
            "Visualization"
        ],
        history: [70, 78, 73, 84, 81, 88, 91, 86, 89, 94, 90, 97]
    },

    {
        id: "automation-003",
        name: "Task Automator",
        role: "Automation",
        description:
            "Handles repeatable work, task preparation and automated workflow operations.",
        model: "NEXUS Core",
        status: "idle",
        progress: 31,
        tasks: 29,
        success: 95,
        lastRun: "21 min ago",
        activity: 63,
        color: "green",
        capabilities: [
            "Task Execution",
            "Scheduling",
            "Workflow Actions",
            "Notifications"
        ],
        history: [52, 63, 70, 66, 76, 81, 73, 87, 79, 84, 91, 95]
    },

    {
        id: "content-004",
        name: "Content Agent",
        role: "Content",
        description:
            "Creates structured drafts, summaries and content concepts from instructions.",
        model: "NEXUS Fast",
        status: "paused",
        progress: 18,
        tasks: 21,
        success: 94,
        lastRun: "1 hr ago",
        activity: 42,
        color: "orange",
        capabilities: [
            "Drafting",
            "Summarization",
            "Content Planning",
            "Formatting"
        ],
        history: [60, 58, 72, 64, 75, 70, 81, 77, 86, 82, 91, 94]
    }
];


/* =========================================================
   DEFAULT STATE
========================================================= */

const defaultState = {
    agents: defaultAgents,
    selectedAgentId: "research-001",

    completedTasks: 128,

    activities: [
        {
            id: "a1",
            icon: "✓",
            type: "success",
            title: "Research Agent completed a task",
            description: "Research summary generated successfully.",
            time: "2 min ago"
        },
        {
            id: "a2",
            icon: "▶",
            type: "",
            title: "Data Analyst started execution",
            description: "Workspace analytics task is running.",
            time: "8 min ago"
        },
        {
            id: "a3",
            icon: "!",
            type: "warning",
            title: "Content Agent paused",
            description: "Agent is waiting for new configuration.",
            time: "1 hr ago"
        },
        {
            id: "a4",
            icon: "✦",
            type: "",
            title: "Agent Hub synchronized",
            description: "All local agent configurations are ready.",
            time: "2 hr ago"
        }
    ],

    notifications: 3,

    lightMode: false
};


/* =========================================================
   STATE
========================================================= */

let state = loadState();

let activeExecution = null;
let executionTimer = null;
let toastTimer = null;


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => Array.from(document.querySelectorAll(selector));


/* =========================================================
   LOAD / SAVE
========================================================= */

function cloneDefaultState() {
    return JSON.parse(JSON.stringify(defaultState));
}


function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return cloneDefaultState();
        }

        const parsed = JSON.parse(saved);

        if (
            !parsed ||
            !Array.isArray(parsed.agents) ||
            parsed.agents.length === 0
        ) {
            return cloneDefaultState();
        }

        return {
            ...cloneDefaultState(),
            ...parsed
        };

    } catch (error) {
        console.warn("NEXUS Agent Hub: Could not load saved state.", error);
        return cloneDefaultState();
    }
}


function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.warn("NEXUS Agent Hub: Could not save state.", error);
    }
}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    syncNexusProfile();

    applyTheme();

    bindEvents();

    renderAll();

    showToast(
        "Agent Hub ready",
        "Your AI workforce is connected and ready.",
        "success"
    );

});


/* =========================================================
   EVENT BINDING
========================================================= */

function bindEvents() {

    /* Create agent */
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


    /* Hero run */
    $("#heroRunButton")?.addEventListener(
        "click",
        () => {
            const agent = getSelectedAgent();

            if (!agent) {
                showToast(
                    "No agent selected",
                    "Select an agent before starting an execution.",
                    "warning"
                );

                return;
            }

            runAgent(agent.id);
        }
    );


    /* Search */
    $("#agentSearch")?.addEventListener(
        "input",
        renderAgents
    );


    /* Filters */
    $("#statusFilter")?.addEventListener(
        "change",
        renderAgents
    );

    $("#sortAgents")?.addEventListener(
        "change",
        renderAgents
    );


    /* Refresh */
    $("#refreshButton")?.addEventListener(
        "click",
        () => {

            renderAll();

            showToast(
                "Dashboard refreshed",
                "Agent Hub data has been synchronized.",
                "success"
            );
        }
    );


    /* Theme */
    $("#themeButton")?.addEventListener(
        "click",
        toggleTheme
    );


    /* Notifications */
    $("#notificationButton")?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            const panel = $("#notificationPanel");

            panel.classList.toggle("hidden");
        }
    );


    $("#markNotificationsButton")?.addEventListener(
        "click",
        markNotificationsRead
    );


    /* Activity */
    $("#clearActivityButton")?.addEventListener(
        "click",
        clearActivity
    );


    /* Create form */
    $("#createAgentForm")?.addEventListener(
        "submit",
        handleCreateAgent
    );


    /* Console */
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


    /* Suggestions */
    $$(".suggestion-button").forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const prompt = button.dataset.prompt || "";

                $("#agentPrompt").value = prompt;

                $("#agentPrompt").focus();
            }
        );

    });


    /* Details controls */
    $("#detailsRunButton")?.addEventListener(
        "click",
        () => {

            const agent = getSelectedAgent();

            if (!agent) return;

            closeModal("detailsModal");

            runAgent(agent.id);
        }
    );


    $("#detailsPauseButton")?.addEventListener(
        "click",
        () => {

            const agent = getSelectedAgent();

            if (!agent) return;

            toggleAgentStatus(agent.id);

            renderAll();

            updateDetailsModal(agent.id);
        }
    );


    /* Mobile menu */
    $("#mobileMenuButton")?.addEventListener(
        "click",
        () => {

            $("#sidebar")?.classList.toggle("mobile-open");
        }
    );


    /* Workspace */
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


    /* Profile */
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


    /* Navigation */
    $$(".nav-item").forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                handleNavigation(button.dataset.nav);

            }
        );

    });


    /* Modal close buttons */
    $$("[data-close-modal]").forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                closeModal(button.dataset.closeModal);

            }
        );

    });


    /* Backdrop close */
    $$(".modal-backdrop").forEach((backdrop) => {

        backdrop.addEventListener(
            "click",
            (event) => {

                if (event.target === backdrop) {

                    backdrop.classList.add("hidden");

                }

            }
        );

    });


    /* Escape */
    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeAllModals();

                $("#notificationPanel")?.classList.add("hidden");

            }

        }
    );


    /* Outside notification click */
    document.addEventListener(
        "click",
        (event) => {

            const panel = $("#notificationPanel");
            const button = $("#notificationButton");

            if (
                panel &&
                !panel.classList.contains("hidden") &&
                !panel.contains(event.target) &&
                !button.contains(event.target)
            ) {
                panel.classList.add("hidden");
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

    $("#navAgentCount").textContent = state.agents.length;

}


/* =========================================================
   AGENTS
========================================================= */

function renderAgents() {

    const grid = $("#agentsGrid");
    const empty = $("#emptyAgents");

    if (!grid || !empty) return;

    const searchValue =
        ($("#agentSearch")?.value || "")
            .trim()
            .toLowerCase();

    const status =
        $("#statusFilter")?.value || "all";

    const sort =
        $("#sortAgents")?.value || "name";

    let agents = [...state.agents];


    /* Search */
    if (searchValue) {

        agents = agents.filter((agent) => {

            const searchable =
                `${agent.name} ${agent.role} ${agent.description}`
                    .toLowerCase();

            return searchable.includes(searchValue);

        });

    }


    /* Status */
    if (status !== "all") {

        agents = agents.filter(
            (agent) => agent.status === status
        );

    }


    /* Sort */
    if (sort === "name") {

        agents.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    } else if (sort === "status") {

        const order = {
            running: 1,
            idle: 2,
            paused: 3
        };

        agents.sort(
            (a, b) =>
                (order[a.status] || 9) -
                (order[b.status] || 9)
        );

    } else if (sort === "activity") {

        agents.sort(
            (a, b) =>
                Number(b.activity || 0) -
                Number(a.activity || 0)
        );

    }


    if (agents.length === 0) {

        grid.innerHTML = "";

        empty.classList.remove("hidden");

        return;

    }


    empty.classList.add("hidden");


    grid.innerHTML = agents
        .map(createAgentCard)
        .join("");


    $$(".agent-card").forEach((card) => {

        card.addEventListener(
            "click",
            () => {

                selectAgent(card.dataset.agentId);

            }
        );

    });


    $$(".agent-run").forEach((button) => {

        button.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                runAgent(button.dataset.agentId);

            }
        );

    });


    $$(".agent-secondary").forEach((button) => {

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

    });

}


/* =========================================================
   AGENT CARD
========================================================= */

function createAgentCard(agent) {

    const selected =
        state.selectedAgentId === agent.id
            ? "selected"
            : "";

    const statusClass =
        agent.status || "idle";

    const statusLabel =
        capitalize(agent.status || "idle");

    const color =
        agent.color || "cyan";

    const actionText =
        agent.status === "running"
            ? "Run Again"
            : "Run Agent";

    return `
        <article
            class="agent-card ${selected}"
            data-agent-id="${escapeAttribute(agent.id)}"
        >

            <div class="agent-top">

                <div class="agent-identity">

                    <div class="agent-avatar ${escapeAttribute(color)}">
                        ${getInitials(agent.name)}
                    </div>

                    <div>
                        <h3 title="${escapeAttribute(agent.name)}">
                            ${escapeHTML(agent.name)}
                        </h3>

                        <span class="agent-role">
                            ${escapeHTML(agent.role)} Agent
                        </span>
                    </div>

                </div>

                <span class="status-chip ${statusClass}">
                    <span class="status-dot ${getStatusDotClass(agent.status)}"></span>
                    ${statusLabel}
                </span>

            </div>


            <p class="agent-description">
                ${escapeHTML(agent.description)}
            </p>


            <div class="agent-progress">

                <div class="progress-header">
                    <span>Current workload</span>
                    <strong>${Number(agent.progress) || 0}%</strong>
                </div>

                <div class="progress-track">
                    <div
                        class="progress-fill"
                        style="width: ${clamp(agent.progress, 0, 100)}%"
                    ></div>
                </div>

            </div>


            <div class="agent-meta">

                <div class="agent-meta-item">
                    <span>Tasks</span>
                    <strong>${Number(agent.tasks) || 0}</strong>
                </div>

                <div class="agent-meta-item">
                    <span>Success</span>
                    <strong>${Number(agent.success) || 0}%</strong>
                </div>

                <div class="agent-meta-item">
                    <span>Last run</span>
                    <strong>${escapeHTML(agent.lastRun || "Never")}</strong>
                </div>

            </div>


            <div class="agent-actions">

                <button
                    class="agent-run"
                    type="button"
                    data-agent-id="${escapeAttribute(agent.id)}"
                >
                    ▶ ${actionText}
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
                    title="${agent.status === "paused" ? "Resume agent" : "Pause agent"}"
                    data-action="toggle"
                    data-agent-id="${escapeAttribute(agent.id)}"
                >
                    ${agent.status === "paused" ? "▶" : "Ⅱ"}
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

function selectAgent(agentId) {

    const agent = state.agents.find(
        (item) => item.id === agentId
    );

    if (!agent) return;

    state.selectedAgentId = agentId;

    saveState();

    renderAgents();

    renderExecution();

    renderConsole();

}


/* =========================================================
   GET SELECTED
========================================================= */

function getSelectedAgent() {

    return state.agents.find(
        (agent) =>
            agent.id === state.selectedAgentId
    ) || null;

}


/* =========================================================
   AGENT ACTIONS
========================================================= */

function handleAgentSecondaryAction(action, agentId) {

    const agent =
        state.agents.find(
            (item) => item.id === agentId
        );

    if (!agent) {

        showToast(
            "Agent unavailable",
            "The selected agent could not be found.",
            "warning"
        );

        return;

    }


    if (action === "details") {

        selectAgent(agentId);

        updateDetailsModal(agentId);

        openModal("detailsModal");

        return;

    }


    if (action === "toggle") {

        toggleAgentStatus(agentId);

        return;

    }


    if (action === "delete") {

        deleteAgent(agentId);

    }

}


/* =========================================================
   TOGGLE STATUS
========================================================= */

function toggleAgentStatus(agentId) {

    const agent =
        state.agents.find(
            (item) => item.id === agentId
        );

    if (!agent) return;


    if (agent.status === "paused") {

        agent.status = "idle";

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

    } else {

        agent.status = "paused";

        if (
            activeExecution &&
            activeExecution.agentId === agentId
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

function deleteAgent(agentId) {

    const agent =
        state.agents.find(
            (item) => item.id === agentId
        );

    if (!agent) return;


    const confirmed = window.confirm(
        `Delete "${agent.name}" from Agent Hub?`
    );

    if (!confirmed) return;


    if (
        activeExecution &&
        activeExecution.agentId === agentId
    ) {
        stopExecution();
    }


    state.agents =
        state.agents.filter(
            (item) => item.id !== agentId
        );


    if (state.agents.length > 0) {

        if (state.selectedAgentId === agentId) {

            state.selectedAgentId =
                state.agents[0].id;

        }

    } else {

        state.selectedAgentId = null;

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

function runAgent(agentId) {

    const agent =
        state.agents.find(
            (item) => item.id === agentId
        );

    if (!agent) {

        showToast(
            "Agent unavailable",
            "The selected agent could not be found.",
            "warning"
        );

        return;

    }


    if (agent.status === "paused") {

        showToast(
            "Agent is paused",
            "Resume this agent before running it.",
            "warning"
        );

        return;

    }


    selectAgent(agentId);


    /* Stop previous execution */
    if (executionTimer) {

        clearInterval(executionTimer);

        executionTimer = null;

    }


    agent.status = "running";

    agent.progress =
        Math.max(
            8,
            Math.min(35, Number(agent.progress) || 10)
        );


    agent.lastRun = "Just now";

    activeExecution = {
        agentId,
        progress: agent.progress,
        startedAt: Date.now()
    };


    addActivity(
        "▶",
        "",
        `${agent.name} started execution`,
        `Using ${agent.model || "NEXUS Core"} intelligence.`
    );


    saveState();

    renderAll();


    showToast(
        "Execution started",
        `${agent.name} is now processing.`,
        "success"
    );


    executionTimer = setInterval(
        () => {

            const current =
                state.agents.find(
                    (item) =>
                        item.id === agentId
                );

            if (!current) {

                stopExecution();

                return;

            }


            activeExecution.progress +=
                Math.floor(Math.random() * 11) + 5;


            current.progress =
                Math.min(
                    activeExecution.progress,
                    100
                );


            renderExecution();


            if (
                activeExecution.progress >= 100
            ) {

                completeExecution(current);

            }

        },
        850
    );

}


/* =========================================================
   COMPLETE EXECUTION
========================================================= */

function completeExecution(agent) {

    if (executionTimer) {

        clearInterval(executionTimer);

        executionTimer = null;

    }


    agent.progress = 100;

    agent.tasks =
        Number(agent.tasks || 0) + 1;

    agent.success =
        Math.min(
            100,
            Number(agent.success || 0) +
                (Math.random() > 0.5 ? 1 : 0)
        );

    agent.lastRun = "Just now";

    state.completedTasks =
        Number(state.completedTasks || 0) + 1;


    agent.history =
        Array.isArray(agent.history)
            ? agent.history
            : [];

    agent.history.push(
        Math.floor(
            88 + Math.random() * 12
        )
    );

    if (agent.history.length > 14) {

        agent.history.shift();

    }


    activeExecution = null;


    addActivity(
        "✓",
        "success",
        `${agent.name} completed execution`,
        "Task completed successfully."
    );


    saveState();

    renderAll();


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

        clearInterval(executionTimer);

        executionTimer = null;

    }

    activeExecution = null;

    renderExecution();

}


/* =========================================================
   EXECUTION MONITOR
========================================================= */

function renderExecution() {

    const container = $("#executionMain");

    if (!container) return;


    const agent = getSelectedAgent();


    if (!agent) {

        container.innerHTML = `
            <div class="execution-empty">
                <div class="execution-icon">✦</div>

                <h3>No agents available</h3>

                <p>
                    Create an agent to start managing AI executions.
                </p>
            </div>
        `;

        return;

    }


    const isActive =
        activeExecution &&
        activeExecution.agentId === agent.id;


    const progress =
        isActive
            ? activeExecution.progress
            : agent.progress;


    container.innerHTML = `
        <div class="execution-active">

            <div class="execution-agent-header">

                <div class="execution-agent-avatar">
                    ${getInitials(agent.name)}
                </div>

                <div>
                    <h3>${escapeHTML(agent.name)}</h3>
                    <p>
                        ${
                            isActive
                                ? "Processing current task..."
                                : `${capitalize(agent.status)} · ${agent.model}`
                        }
                    </p>
                </div>

            </div>


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
                        ${clamp(progress, 0, 100)}%
                    </strong>
                </div>

                <div class="big-progress">
                    <span style="width:${clamp(progress, 0, 100)}%"></span>
                </div>

            </div>


            <div class="execution-stats">

                <div class="execution-stat">
                    <span>Tasks completed</span>
                    <strong>${agent.tasks}</strong>
                </div>

                <div class="execution-stat">
                    <span>Success rate</span>
                    <strong>${agent.success}%</strong>
                </div>

                <div class="execution-stat">
                    <span>Last execution</span>
                    <strong>${escapeHTML(agent.lastRun)}</strong>
                </div>

            </div>


            <div class="execution-controls">

                <button
                    class="primary-button"
                    type="button"
                    id="executionRunButton"
                >
                    ▶ Run Agent
                </button>

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


    $("#executionRunButton")?.addEventListener(
        "click",
        () => runAgent(agent.id)
    );


    $("#executionDetailsButton")?.addEventListener(
        "click",
        () => {

            updateDetailsModal(agent.id);

            openModal("detailsModal");

        }
    );

}


/* =========================================================
   CREATE AGENT
========================================================= */

function handleCreateAgent(event) {

    event.preventDefault();


    const form = event.currentTarget;


    const name =
        $("#agentName").value.trim();

    const role =
        $("#agentRole").value;

    const description =
        $("#agentDescription").value.trim();

    const model =
        $("#agentModel").value;

    const autoRun =
        $("#agentAutoRun").checked;


    if (!name) {

        showToast(
            "Agent name required",
            "Enter a name for your new agent.",
            "warning"
        );

        $("#agentName").focus();

        return;

    }


    if (!description) {

        showToast(
            "Description required",
            "Describe what this agent should specialize in.",
            "warning"
        );

        $("#agentDescription").focus();

        return;

    }


    const id =
        `agent-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 7)}`;


    const colorMap = {
        Research: "cyan",
        Analysis: "purple",
        Automation: "green",
        Content: "orange",
        Support: "cyan"
    };


    const newAgent = {

        id,

        name,

        role,

        description,

        model,

        status: autoRun
            ? "running"
            : "idle",

        progress: autoRun
            ? 12
            : 0,

        tasks: 0,

        success: 100,

        lastRun: "Never",

        activity: 50,

        color:
            colorMap[role] || "cyan",

        capabilities:
            getCapabilitiesForRole(role),

        history: [
            76,
            82,
            74,
            88,
            80,
            92
        ]

    };


    state.agents.unshift(newAgent);

    state.selectedAgentId = id;


    addActivity(
        "✦",
        "",
        `${name} created`,
        `${role} Agent configured with ${model}.`
    );


    saveState();

    renderAll();

    form.reset();

    closeModal("createModal");


    showToast(
        "Agent created",
        `${name} is now part of your AI workforce.`,
        "success"
    );


    if (autoRun) {

        setTimeout(
            () => runAgent(id),
            250
        );

    }

}


/* =========================================================
   ROLE CAPABILITIES
========================================================= */

function getCapabilitiesForRole(role) {

    const capabilities = {

        Research: [
            "Web Research",
            "Summarization",
            "Source Analysis",
            "Report Generation"
        ],

        Analysis: [
            "Data Analysis",
            "Pattern Detection",
            "Insights",
            "Visualization"
        ],

        Automation: [
            "Task Execution",
            "Scheduling",
            "Workflow Actions",
            "Notifications"
        ],

        Content: [
            "Drafting",
            "Summarization",
            "Content Planning",
            "Formatting"
        ],

        Support: [
            "Question Answering",
            "Classification",
            "Knowledge Search",
            "Response Generation"
        ]

    };


    return capabilities[role] || [
        "Reasoning",
        "Task Execution",
        "Analysis"
    ];

}


/* =========================================================
   DETAILS MODAL
========================================================= */

function updateDetailsModal(agentId) {

    const agent =
        state.agents.find(
            (item) => item.id === agentId
        );

    if (!agent) return;


    state.selectedAgentId = agentId;


    $("#detailsAvatar").textContent =
        getInitials(agent.name);

    $("#detailsRole").textContent =
        `${agent.role.toUpperCase()} AGENT`;

    $("#detailsTitle").textContent =
        agent.name;

    $("#detailsDescription").textContent =
        agent.description;

    $("#detailsStatus").textContent =
        capitalize(agent.status);

    $("#detailsTasks").textContent =
        agent.tasks;

    $("#detailsSuccess").textContent =
        `${agent.success}%`;

    $("#detailsModel").textContent =
        agent.model;

    $("#detailsLastRun").textContent =
        `Last run: ${agent.lastRun}`;


    const bars = $("#historyBars");

    const history =
        Array.isArray(agent.history)
            ? agent.history
            : [60, 70, 80];


    bars.innerHTML =
        history
            .map(
                (value) => `
                    <div
                        class="history-bar"
                        style="height:${clamp(value, 15, 100)}%"
                        title="${value}% success"
                    ></div>
                `
            )
            .join("");


    const capabilities =
        $("#capabilityList");

    capabilities.innerHTML =
        (agent.capabilities || [])
            .map(
                (capability) =>
                    `<span class="capability">
                        ${escapeHTML(capability)}
                    </span>`
            )
            .join("");


    const pauseButton =
        $("#detailsPauseButton");

    if (agent.status === "paused") {

        pauseButton.textContent =
            "Resume Agent";

    } else {

        pauseButton.textContent =
            "Pause Agent";

    }


    const runButton =
        $("#detailsRunButton");

    runButton.textContent =
        agent.status === "paused"
            ? "Resume & Run"
            : "Run Agent";

}


/* =========================================================
   CONSOLE
========================================================= */

function renderConsole() {

    const agent = getSelectedAgent();

    const greeting = $("#consoleGreeting");

    if (!greeting) return;


    if (!agent) {

        greeting.textContent =
            "Create an agent and give it a task.";

        return;

    }


    greeting.textContent =
        `${agent.name} is selected. Describe a task and send it to the agent.`;

}


function sendAgentPrompt() {

    const input = $("#agentPrompt");

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


    const agent = getSelectedAgent();


    if (!agent) {

        showToast(
            "No agent selected",
            "Select an agent before sending a task.",
            "warning"
        );

        return;

    }


    if (agent.status === "paused") {

        showToast(
            "Agent is paused",
            "Resume the agent before sending a task.",
            "warning"
        );

        return;

    }


    input.value = "";


    addActivity(
        "➤",
        "",
        `Task sent to ${agent.name}`,
        shorten(prompt, 90)
    );


    showToast(
        "Task submitted",
        `${agent.name} received your instruction.`,
        "success"
    );


    runAgent(agent.id);

}


/* =========================================================
   ACTIVITY
========================================================= */

function renderActivities() {

    const list = $("#activityList");

    if (!list) return;


    if (!state.activities.length) {

        list.innerHTML = `
            <div class="execution-empty">
                <div class="execution-icon">◷</div>
                <h3>No activity yet</h3>
                <p>Agent actions will appear here.</p>
            </div>
        `;

        return;

    }


    list.innerHTML =
        state.activities
            .slice(0, 12)
            .map(
                (activity) => `
                    <div class="activity-item">

                        <div class="activity-icon ${escapeAttribute(activity.type || "")}">
                            ${escapeHTML(activity.icon || "•")}
                        </div>

                        <div class="activity-text">

                            <strong>
                                ${escapeHTML(activity.title)}
                            </strong>

                            <span>
                                ${escapeHTML(activity.description)}
                            </span>

                        </div>

                        <span class="activity-time">
                            ${escapeHTML(activity.time)}
                        </span>

                    </div>
                `
            )
            .join("");

}


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

        time: "Just now"

    });


    state.activities =
        state.activities.slice(0, 20);

}


function clearActivity() {

    if (!state.activities.length) {

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
                agent.status === "running"
        ).length;


    const successfulTasks =
        state.agents.reduce(
            (totalTasks, agent) =>
                totalTasks +
                Number(agent.tasks || 0),
            0
        );


    const successValues =
        state.agents.map(
            (agent) =>
                Number(agent.success || 0)
        );


    const averageSuccess =
        successValues.length
            ? (
                successValues.reduce(
                    (a, b) => a + b,
                    0
                ) / successValues.length
            ).toFixed(1)
            : "0.0";


    $("#totalAgents").textContent =
        total;

    $("#runningAgents").textContent =
        running;

    $("#completedTasks").textContent =
        Number(state.completedTasks || 0);

    $("#successRate").textContent =
        `${averageSuccess}%`;

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function updateNotificationBadge() {

    const badge =
        $("#notificationBadge");

    if (!badge) return;


    const count =
        Number(state.notifications || 0);


    badge.textContent = count;


    badge.style.display =
        count > 0
            ? "grid"
            : "none";

}


function markNotificationsRead() {

    state.notifications = 0;

    saveState();

    updateNotificationBadge();

    $$(".notification-item").forEach(
        (item) =>
            item.classList.remove("unread")
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

function openModal(id) {

    const modal = $(`#${id}`);

    if (!modal) return;

    modal.classList.remove("hidden");

    document.body.style.overflow = "hidden";


    const firstInput =
        modal.querySelector(
            "input, textarea, select"
        );

    if (firstInput) {

        setTimeout(
            () => firstInput.focus(),
            80
        );

    }

}


function closeModal(id) {

    const modal = $(`#${id}`);

    if (!modal) return;

    modal.classList.add("hidden");

    if (
        $$(".modal-backdrop:not(.hidden)").length === 0
    ) {
        document.body.style.overflow = "";
    }

}


function closeAllModals() {

    $$(".modal-backdrop").forEach(
        (modal) =>
            modal.classList.add("hidden")
    );

    document.body.style.overflow = "";

}


/* =========================================================
   THEME
========================================================= */

function applyTheme() {

    document.body.classList.toggle(
        "light-mode",
        Boolean(state.lightMode)
    );

}


function toggleTheme() {

    state.lightMode =
        !Boolean(state.lightMode);

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
   NAVIGATION
========================================================= */

function handleNavigation(destination) {

    const routes = {
        command: "../command-center/index.html",
        agents: "../agent-hub/index.html",
        workflows: "../workflow-builder/index.html",
        insights: "../ai-insights/index.html"
    };

    if (routes[destination]) {
        window.location.href = routes[destination];
        return;
    }

    const messages = {
        tasks:
            "Tasks are managed through the Command Center and agent execution layer.",
        activity:
            "Showing the latest Agent Hub system activity.",
        settings:
            "Agent Hub settings are ready for backend integration."
    };

    showToast(
        capitalize(destination),
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
        document.createElement("div");

    toast.className = "toast";


    toast.innerHTML = `
        <div class="toast-icon">
            ${icon}
        </div>

        <div>
            <strong>${escapeHTML(title)}</strong>
            <span>${escapeHTML(message)}</span>
        </div>
    `;


    container.appendChild(toast);


    setTimeout(
        () => {

            toast.style.opacity = "0";
            toast.style.transform = "translateX(12px)";

            setTimeout(
                () => toast.remove(),
                200
            );

        },
        3200
    );

}


/* =========================================================
   UTILITIES
========================================================= */

function capitalize(value) {

    if (!value) return "";

    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

}


function getInitials(name) {

    if (!name) return "AI";


    const words =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (words.length === 1) {

        return words[0]
            .slice(0, 2)
            .toUpperCase();

    }


    return (
        words[0][0] +
        words[1][0]
    ).toUpperCase();

}


function getStatusDotClass(status) {

    if (status === "running") {
        return "online";
    }

    if (status === "paused") {
        return "paused";
    }

    return "";

}


function clamp(value, min, max) {

    const number = Number(value);

    if (Number.isNaN(number)) {
        return min;
    }

    return Math.min(
        max,
        Math.max(min, number)
    );

}


function shorten(text, length) {

    if (!text) return "";

    return text.length > length
        ? `${text.slice(0, length - 1)}…`
        : text;

}


/* =========================================================
   SECURITY / HTML ESCAPING
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function escapeAttribute(value) {

    return escapeHTML(value);

}