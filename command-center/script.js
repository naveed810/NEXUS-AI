/* =========================================================
   NEXUS AI — INTELLIGENT WORK STUDIO
   Complete Command Center JavaScript
========================================================= */

(() => {
    "use strict";

    /* =====================================================
       STORAGE
    ====================================================== */

    const STORAGE_KEY = "nexus_ai_command_center_v4";


    /* =====================================================
       DEFAULT STATE
    ====================================================== */

    const defaultState = {

        onboarded: false,

        user: {
            name: "",
            email: ""
        },

        theme: "dark",

        notificationsEnabled: true,

        selectedFocus: "AI & Productivity",

        currentWorkspaceId: "workspace-1",

        workspaces: [
            {
                id: "workspace-1",
                name: "Personal Workspace",
                focus: "AI & Productivity"
            }
        ],

        tasks: [
            {
                id: 1,
                title: "Review project requirements",
                description: "Prepare the final project checklist.",
                priority: "high",
                completed: false,
                createdAt: Date.now() - 86400000
            },
            {
                id: 2,
                title: "Explore AI agent ideas",
                description: "Define useful agents for the workspace.",
                priority: "medium",
                completed: false,
                createdAt: Date.now() - 62000000
            },
            {
                id: 3,
                title: "Organize workspace",
                description: "Clean up current project tasks.",
                priority: "low",
                completed: true,
                createdAt: Date.now() - 45000000
            }
        ],

        agents: [
            {
                id: 1,
                name: "Research Agent",
                description: "Finds, organizes and summarizes information.",
                role: "Research",
                status: "active",
                runs: 28,
                icon: "⌕"
            },
            {
                id: 2,
                name: "Insights Agent",
                description: "Analyzes activity and discovers useful patterns.",
                role: "Analytics",
                status: "active",
                runs: 19,
                icon: "◇"
            },
            {
                id: 3,
                name: "Automation Agent",
                description: "Handles repetitive workflow operations.",
                role: "Automation",
                status: "paused",
                runs: 34,
                icon: "⚡"
            },
            {
                id: 4,
                name: "Planning Agent",
                description: "Turns goals into structured execution plans.",
                role: "Planning",
                status: "active",
                runs: 14,
                icon: "✦"
            }
        ],

        workflows: [
            {
                id: 1,
                name: "Daily Briefing",
                description: "Prepare a concise workspace briefing every morning.",
                status: "active",
                progress: 82,
                runs: 42
            },
            {
                id: 2,
                name: "Research Digest",
                description: "Collect research and prepare a digest.",
                status: "active",
                progress: 64,
                runs: 26
            },
            {
                id: 3,
                name: "Task Triage",
                description: "Sort incoming work by priority.",
                status: "paused",
                progress: 41,
                runs: 17
            }
        ],

        notifications: [
            {
                id: 1,
                title: "Workspace ready",
                message: "Your NEXUS AI workspace is ready.",
                time: Date.now() - 120000,
                read: false
            },
            {
                id: 2,
                title: "Research Agent completed a run",
                message: "The latest research operation finished successfully.",
                time: Date.now() - 3600000,
                read: false
            },
            {
                id: 3,
                title: "Workflow update",
                message: "Daily Briefing is currently active.",
                time: Date.now() - 7200000,
                read: true
            }
        ],

        activity: [
            {
                id: 1,
                title: "Workspace initialized",
                message: "NEXUS AI Command Center was created.",
                time: Date.now() - 86400000
            },
            {
                id: 2,
                title: "Research Agent activated",
                message: "Research Agent is ready for work.",
                time: Date.now() - 54000000
            },
            {
                id: 3,
                title: "Task completed",
                message: "Organize workspace was marked complete.",
                time: Date.now() - 30000000
            },
            {
                id: 4,
                title: "Workflow started",
                message: "Daily Briefing workflow is active.",
                time: Date.now() - 18000000
            }
        ],

        integrations: {}
    };


    /* =====================================================
       STATE
    ====================================================== */

    let state = loadState();

    let currentPage = "command";

    let selectedFocus = state.selectedFocus || "AI & Productivity";

    let toastTimer = null;


    /* =====================================================
       DOM HELPER
    ====================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];


    /* =====================================================
       STORAGE FUNCTIONS
    ====================================================== */

    function cloneDefaultState() {

        return JSON.parse(
            JSON.stringify(defaultState)
        );

    }


    function loadState() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return cloneDefaultState();
            }

            const parsed =
                JSON.parse(saved);

            return mergeState(
                cloneDefaultState(),
                parsed
            );

        } catch (error) {

            console.error(
                "NEXUS state load error:",
                error
            );

            return cloneDefaultState();
        }
    }


    function mergeState(base, saved) {

        return {
            ...base,
            ...saved,

            user: {
                ...base.user,
                ...(saved.user || {})
            },

            tasks:
                Array.isArray(saved.tasks)
                    ? saved.tasks
                    : base.tasks,

            agents:
                Array.isArray(saved.agents)
                    ? saved.agents
                    : base.agents,

            workflows:
                Array.isArray(saved.workflows)
                    ? saved.workflows
                    : base.workflows,

            notifications:
                Array.isArray(saved.notifications)
                    ? saved.notifications
                    : base.notifications,

            activity:
                Array.isArray(saved.activity)
                    ? saved.activity
                    : base.activity,

            workspaces:
                Array.isArray(saved.workspaces)
                    ? saved.workspaces
                    : base.workspaces,

            integrations:
                saved.integrations || {}
        };
    }


    function saveState() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state)
        );
    }


    /* =====================================================
       INITIALIZATION
    ====================================================== */

    function init() {

        initOnboarding();

        if (state.onboarded) {

            showApp();

            bootApp();

        }
    }


    /* =====================================================
       ONBOARDING
    ====================================================== */

    function initOnboarding() {

        const onboarding =
            $("#onboarding");

        const appShell =
            $("#appShell");

        if (!onboarding || !appShell) {
            return;
        }


        if (state.onboarded) {

            onboarding.classList.add("hidden");

            appShell.classList.remove("hidden");

            return;
        }


        showOnboardingStep(1);


        $("#startBtn")?.addEventListener(
            "click",
            () => {

                showOnboardingStep(2);

            }
        );


        $("#profileForm")?.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const name =
                    $("#nameInput").value.trim();

                const email =
                    $("#emailInput").value.trim();


                if (name.length < 2) {

                    showToast(
                        "Please enter your name.",
                        "error"
                    );

                    return;
                }


                if (!isValidEmail(email)) {

                    showToast(
                        "Please enter a valid email address.",
                        "error"
                    );

                    return;
                }


                state.user.name = name;

                state.user.email = email;

                saveState();

                showOnboardingStep(3);

            }
        );


        $$(".focus-card").forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    $$(".focus-card")
                        .forEach(item =>
                            item.classList.remove("active")
                        );

                    card.classList.add("active");

                    selectedFocus =
                        card.dataset.focus ||
                        "AI & Productivity";

                }
            );

        });


        $("#workspaceForm")?.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const workspaceName =
                    $("#workspaceInput")
                        .value
                        .trim();


                if (workspaceName.length < 2) {

                    showToast(
                        "Please enter a workspace name.",
                        "error"
                    );

                    return;
                }


                const workspace = {

                    id:
                        "workspace-" +
                        Date.now(),

                    name:
                        workspaceName,

                    focus:
                        selectedFocus

                };


                state.workspaces = [
                    ...state.workspaces,
                    workspace
                ];


                state.currentWorkspaceId =
                    workspace.id;

                state.selectedFocus =
                    selectedFocus;

                state.onboarded = true;


                state.activity.unshift({

                    id: Date.now(),

                    title: "Workspace launched",

                    message:
                        `${workspaceName} was created with ${selectedFocus} focus.`,

                    time: Date.now()

                });


                state.notifications.unshift({

                    id: Date.now(),

                    title: "Welcome to NEXUS AI",

                    message:
                        `${state.user.name}, your workspace is ready.`,

                    time: Date.now(),

                    read: false

                });


                saveState();


                launchWorkspace();

            }
        );

    }


    function showOnboardingStep(step) {

        $$(".onboarding-step")
            .forEach(section => {

                section.classList.toggle(
                    "hidden",
                    Number(section.dataset.step) !== step
                );

            });


        $$(".onboarding-dots i")
            .forEach((dot, index) => {

                dot.classList.toggle(
                    "active",
                    index + 1 === step
                );

            });

    }


    function launchWorkspace() {

        const onboarding =
            $("#onboarding");

        const appShell =
            $("#appShell");


        onboarding.style.opacity = "0";

        onboarding.style.transform =
            "scale(.98)";


        setTimeout(() => {

            onboarding.classList.add("hidden");

            appShell.classList.remove("hidden");

            requestAnimationFrame(() => {

                appShell.style.opacity = "1";

            });

            bootApp();

            showToast(
                `Welcome to NEXUS AI, ${state.user.name}.`,
                "success"
            );

        }, 400);

    }


    function showApp() {

        $("#onboarding")?.classList.add(
            "hidden"
        );

        $("#appShell")?.classList.remove(
            "hidden"
        );

    }


    /* =====================================================
       APP BOOT
    ====================================================== */

    function bootApp() {

        applyTheme();

        renderIdentity();

        renderAll();

        bindAppEvents();

        navigate("command");

    }


    /* =====================================================
       IDENTITY
    ====================================================== */

    function renderIdentity() {

        const name =
            state.user.name ||
            "there";

        const email =
            state.user.email ||
            "user@example.com";


        setText(
            "#dashboardName",
            firstName(name)
        );

        setText(
            "#profileName",
            name
        );

        setText(
            "#profileEmail",
            email
        );


        setText(
            "#profileAvatar",
            initials(name)
        );


        const workspace =
            getCurrentWorkspace();


        if (workspace) {

            setText(
                "#workspaceName",
                workspace.name
            );

            setText(
                "#workspaceFocus",
                workspace.focus
            );

            setText(
                "#workspaceAvatar",
                initials(workspace.name)
            );

        }


        updateGreeting();

    }


    function updateGreeting() {

        const hour =
            new Date().getHours();

        let greeting = "evening";

        if (hour < 5) {
            greeting = "night";
        } else if (hour < 12) {
            greeting = "morning";
        } else if (hour < 17) {
            greeting = "afternoon";
        }

        setText(
            "#period",
            greeting
        );

    }


    function firstName(name) {

        return (
            name
                .trim()
                .split(/\s+/)[0] ||
            "there"
        );

    }


    function initials(value) {

        const words =
            value
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        if (!words.length) {
            return "N";
        }


        if (words.length === 1) {

            return words[0]
                .substring(0, 2)
                .toUpperCase();

        }


        return (
            words[0][0] +
            words[words.length - 1][0]
        ).toUpperCase();

    }


    function getCurrentWorkspace() {

        return state.workspaces.find(
            workspace =>
                workspace.id ===
                state.currentWorkspaceId
        ) || state.workspaces[0];

    }


    /* =====================================================
       RENDER ALL
    ====================================================== */

    function renderAll() {

        renderWorkspaceList();

        renderTasks();

        renderAgents();

        renderAgentPreview();

        renderWorkflows();

        renderActivity();

        renderNotifications();

        renderChart();

        renderIntegrations();

        updateStats();

        updateAgentBadge();

        updateNotificationDot();

        updateSettings();

    }


    /* =====================================================
       TASKS
    ====================================================== */

    function renderTasks() {

        const container =
            $("#taskList");

        if (!container) {
            return;
        }


        if (!state.tasks.length) {

            container.innerHTML = `

                <div class="empty-state">

                    <strong>
                        No tasks yet
                    </strong>

                    Create your first task to get started.

                </div>

            `;

            return;
        }


        const sorted =
            [...state.tasks].sort(
                (a, b) =>
                    Number(a.completed) -
                    Number(b.completed)
            );


        container.innerHTML =
            sorted
                .map(task => taskHTML(task))
                .join("");


        $$(".task-check", container)
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        toggleTask(
                            Number(button.dataset.id)
                        );

                    }
                );

            });


        $$(".task-menu", container)
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        openTaskMenu(
                            Number(button.dataset.id)
                        );

                    }
                );

            });

    }


    function taskHTML(task) {

        return `

            <div
                class="task-card ${task.completed ? "done" : ""}"
                data-task-id="${task.id}">

                <button
                    class="task-check ${task.completed ? "checked" : ""}"
                    data-id="${task.id}"
                    title="Mark task complete">

                    ${task.completed ? "✓" : ""}

                </button>


                <div class="task-card-main">

                    <b>
                        ${escapeHTML(task.title)}
                    </b>

                    <small>
                        ${escapeHTML(
                            task.description ||
                            "No description"
                        )}
                    </small>

                </div>


                <span class="priority ${task.priority}">
                    ${task.priority}
                </span>


                <button
                    class="task-menu"
                    data-id="${task.id}"
                    title="Task options">

                    ⋯

                </button>

            </div>

        `;

    }


    function toggleTask(id) {

        const task =
            state.tasks.find(
                item => item.id === id
            );


        if (!task) {
            return;
        }


        task.completed =
            !task.completed;


        if (task.completed) {

            addActivity(
                "Task completed",
                `"${task.title}" was marked complete.`
            );

            addNotification(
                "Task completed",
                task.title
            );

        } else {

            addActivity(
                "Task reopened",
                `"${task.title}" was reopened.`
            );

        }


        saveState();

        renderAll();

        showToast(
            task.completed
                ? "Task completed."
                : "Task moved back to pending.",
            "success"
        );

    }


    function openTaskMenu(id) {

        const task =
            state.tasks.find(
                item => item.id === id
            );


        if (!task) {
            return;
        }


        openModal({

            label: "TASK",

            title: "Task options",

            body: `

                <div class="modal-form">

                    <div class="confirm-box">

                        <strong>
                            ${escapeHTML(task.title)}
                        </strong>

                        <br><br>

                        Choose what you want to do
                        with this task.

                    </div>


                    <div class="modal-actions">

                        <button
                            class="secondary-button"
                            data-modal-action="edit-task">

                            Edit

                        </button>


                        <button
                            class="danger-button"
                            data-modal-action="delete-task">

                            Delete

                        </button>

                    </div>

                </div>

            `

        });


        $("#modalBody")
            .querySelector(
                '[data-modal-action="edit-task"]'
            )
            ?.addEventListener(
                "click",
                () => {

                    closeModal();

                    openTaskModal(task);

                }
            );


        $("#modalBody")
            .querySelector(
                '[data-modal-action="delete-task"]'
            )
            ?.addEventListener(
                "click",
                () => {

                    closeModal();

                    deleteTask(task.id);

                }
            );

    }


    function openTaskModal(task = null) {

        const editing =
            Boolean(task);


        openModal({

            label: "PRODUCTIVITY",

            title:
                editing
                    ? "Edit task"
                    : "Create new task",

            body: `

                <form
                    class="modal-form"
                    id="taskModalForm">

                    <label>

                        Task title

                        <input
                            class="modal-input"
                            id="modalTaskTitle"
                            value="${editing ? escapeAttribute(task.title) : ""}"
                            placeholder="e.g. Prepare project presentation"
                            maxlength="100"
                            required>

                    </label>


                    <label>

                        Description

                        <textarea
                            class="modal-textarea"
                            id="modalTaskDescription"
                            placeholder="Add useful context..."
                            maxlength="300">${editing ? escapeHTML(task.description || "") : ""}</textarea>

                    </label>


                    <label>

                        Priority

                        <select
                            class="modal-select"
                            id="modalTaskPriority">

                            <option
                                value="high"
                                ${editing && task.priority === "high" ? "selected" : ""}>
                                High
                            </option>

                            <option
                                value="medium"
                                ${editing && task.priority === "medium" ? "selected" : ""}>
                                Medium
                            </option>

                            <option
                                value="low"
                                ${editing && task.priority === "low" ? "selected" : ""}>
                                Low
                            </option>

                        </select>

                    </label>


                    <div class="modal-actions">

                        <button
                            type="button"
                            class="secondary-button"
                            id="cancelTaskModal">

                            Cancel

                        </button>


                        <button
                            type="submit"
                            class="primary-btn">

                            ${editing ? "Save changes" : "Create task"}

                        </button>

                    </div>

                </form>

            `

        });


        $("#cancelTaskModal")
            ?.addEventListener(
                "click",
                closeModal
            );


        $("#taskModalForm")
            ?.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    const title =
                        $("#modalTaskTitle")
                            .value
                            .trim();

                    const description =
                        $("#modalTaskDescription")
                            .value
                            .trim();

                    const priority =
                        $("#modalTaskPriority")
                            .value;


                    if (!title) {
                        return;
                    }


                    if (editing) {

                        task.title =
                            title;

                        task.description =
                            description;

                        task.priority =
                            priority;


                        addActivity(
                            "Task updated",
                            `"${title}" was updated.`
                        );


                        showToast(
                            "Task updated.",
                            "success"
                        );

                    } else {

                        const newTask = {

                            id: Date.now(),

                            title,

                            description,

                            priority,

                            completed: false,

                            createdAt: Date.now()

                        };


                        state.tasks.unshift(
                            newTask
                        );


                        addActivity(
                            "Task created",
                            `"${title}" was added to your workspace.`
                        );


                        addNotification(
                            "New task created",
                            title
                        );


                        showToast(
                            "Task created.",
                            "success"
                        );

                    }


                    saveState();

                    closeModal();

                    renderAll();

                }
            );

    }


    function deleteTask(id) {

        const task =
            state.tasks.find(
                item => item.id === id
            );


        if (!task) {
            return;
        }


        openModal({

            label: "TASK",

            title: "Delete task?",

            body: `

                <div class="modal-form">

                    <div class="confirm-box">

                        This will permanently remove
                        <strong>
                            ${escapeHTML(task.title)}
                        </strong>
                        from this browser workspace.

                    </div>


                    <div class="modal-actions">

                        <button
                            class="secondary-button"
                            id="cancelDelete">

                            Cancel

                        </button>


                        <button
                            class="danger-button"
                            id="confirmDelete">

                            Delete task

                        </button>

                    </div>

                </div>

            `

        });


        $("#cancelDelete")
            ?.addEventListener(
                "click",
                closeModal
            );


        $("#confirmDelete")
            ?.addEventListener(
                "click",
                () => {

                    state.tasks =
                        state.tasks.filter(
                            item =>
                                item.id !== id
                        );


                    addActivity(
                        "Task deleted",
                        `"${task.title}" was removed.`
                    );


                    saveState();

                    closeModal();

                    renderAll();

                    showToast(
                        "Task deleted.",
                        "success"
                    );

                }
            );

    }


    /* =====================================================
       STATS
    ====================================================== */

    function updateStats() {

        const total =
            state.tasks.length;

        const completed =
            state.tasks.filter(
                task => task.completed
            ).length;

        const pending =
            total - completed;

        const high =
            state.tasks.filter(
                task =>
                    task.priority === "high" &&
                    !task.completed
            ).length;


        setText(
            "#totalTasks",
            total
        );

        setText(
            "#doneTasks",
            completed
        );

        setText(
            "#pendingTasks",
            pending
        );

        setText(
            "#highTasks",
            high
        );


        const percentage =
            total
                ? Math.round(
                    (completed / total) * 100
                )
                : 0;


        setText(
            "#healthTasks",
            `${percentage}%`
        );

    }


    /* =====================================================
       AGENTS
    ====================================================== */

    function renderAgents() {

        const container =
            $("#agentGrid");

        if (!container) {
            return;
        }


        if (!state.agents.length) {

            container.innerHTML = `

                <div class="empty-state">

                    <strong>
                        No AI agents
                    </strong>

                    Create your first specialized
                    NEXUS AI agent.

                </div>

            `;

            return;
        }


        container.innerHTML =
            state.agents
                .map(agent => agentHTML(agent))
                .join("");


        $$(".agent-toggle", container)
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        toggleAgent(
                            Number(button.dataset.id)
                        );

                    }
                );

            });


        $$(".agent-run", container)
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        runAgent(
                            Number(button.dataset.id)
                        );

                    }
                );

            });


        $$(".agent-delete", container)
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteAgent(
                            Number(button.dataset.id)
                        );

                    }
                );

            });

    }


    function agentHTML(agent) {

        const active =
            agent.status === "active";


        return `

            <article class="agent-card">

                <div class="agent-card-top">

                    <div class="agent-card-icon">
                        ${agent.icon || "✦"}
                    </div>


                    <div
                        class="agent-card-status ${active ? "active" : ""}">

                        <i></i>

                        ${active ? "Active" : "Paused"}

                    </div>

                </div>


                <h3>
                    ${escapeHTML(agent.name)}
                </h3>


                <p>
                    ${escapeHTML(agent.description)}
                </p>


                <div class="agent-meta">

                    <span>
                        Role: ${escapeHTML(agent.role)}
                    </span>

                    <span>
                        ${agent.runs} runs
                    </span>

                </div>


                <div class="agent-card-actions">

                    <button
                        class="small-button agent-toggle"
                        data-id="${agent.id}">

                        ${active ? "Pause" : "Activate"}

                    </button>


                    <button
                        class="small-button agent-run"
                        data-id="${agent.id}">

                        Run now

                    </button>


                    <button
                        class="small-button agent-delete"
                        data-id="${agent.id}">

                        Delete

                    </button>

                </div>

            </article>

        `;

    }


    function renderAgentPreview() {

        const container =
            $("#agentPreview");

        if (!container) {
            return;
        }


        const agents =
            state.agents.slice(0, 4);


        if (!agents.length) {

            container.innerHTML = `

                <div class="empty-state">
                    No agents created yet.
                </div>

            `;

            return;
        }


        container.innerHTML =
            agents
                .map(agent => `

                    <div class="agent-preview">

                        <div class="agent-icon">
                            ${agent.icon || "✦"}
                        </div>


                        <div class="agent-preview-main">

                            <b>
                                ${escapeHTML(agent.name)}
                            </b>

                            <small>
                                ${escapeHTML(agent.role)}
                            </small>

                        </div>


                        <div
                            class="agent-status ${agent.status === "active" ? "active" : ""}">

                            <i></i>

                            ${agent.status === "active"
                                ? "Active"
                                : "Paused"}

                        </div>

                    </div>

                `)
                .join("");

    }


    function updateAgentBadge() {

        const active =
            state.agents.filter(
                agent =>
                    agent.status === "active"
            ).length;


        setText(
            "#agentBadge",
            active
        );


        setText(
            "#activeAgentLabel",
            `${active} active`
        );

    }


    function toggleAgent(id) {

        const agent =
            state.agents.find(
                item => item.id === id
            );


        if (!agent) {
            return;
        }


        agent.status =
            agent.status === "active"
                ? "paused"
                : "active";


        addActivity(
            agent.status === "active"
                ? "Agent activated"
                : "Agent paused",
            `${agent.name} is now ${agent.status}.`
        );


        saveState();

        renderAll();

        showToast(
            `${agent.name} is ${agent.status}.`,
            "success"
        );

    }


    function runAgent(id) {

        const agent =
            state.agents.find(
                item => item.id === id
            );


        if (!agent) {
            return;
        }


        if (agent.status !== "active") {

            showToast(
                "Activate this agent before running it.",
                "error"
            );

            return;
        }


        agent.runs += 1;


        addActivity(
            "Agent execution",
            `${agent.name} completed a simulated run.`
        );


        addNotification(
            "Agent run completed",
            `${agent.name} finished successfully.`
        );


        saveState();

        renderAll();


        showToast(
            `${agent.name} completed a run.`,
            "success"
        );

    }


    function deleteAgent(id) {

        const agent =
            state.agents.find(
                item => item.id === id
            );


        if (!agent) {
            return;
        }


        openModal({

            label: "AI AGENT",

            title: "Delete agent?",

            body: `

                <div class="modal-form">

                    <div class="confirm-box">

                        Remove
                        <strong>
                            ${escapeHTML(agent.name)}
                        </strong>
                        from your workspace?

                    </div>


                    <div class="modal-actions">

                        <button
                            class="secondary-button"
                            id="cancelAgentDelete">

                            Cancel

                        </button>


                        <button
                            class="danger-button"
                            id="confirmAgentDelete">

                            Delete agent

                        </button>

                    </div>

                </div>

            `

        });


        $("#cancelAgentDelete")
            ?.addEventListener(
                "click",
                closeModal
            );


        $("#confirmAgentDelete")
            ?.addEventListener(
                "click",
                () => {

                    state.agents =
                        state.agents.filter(
                            item =>
                                item.id !== id
                        );


                    addActivity(
                        "Agent deleted",
                        `${agent.name} was removed.`
                    );


                    saveState();

                    closeModal();

                    renderAll();

                    showToast(
                        "Agent deleted.",
                        "success"
                    );

                }
            );

    }


    function openAgentModal() {

        openModal({

            label: "AI AGENTS",

            title: "Create AI agent",

            body: `

                <form
                    class="modal-form"
                    id="agentModalForm">

                    <label>

                        Agent name

                        <input
                            class="modal-input"
                            id="agentName"
                            placeholder="e.g. Content Research Agent"
                            maxlength="50"
                            required>

                    </label>


                    <label>

                        Role

                        <select
                            class="modal-select"
                            id="agentRole">

                            <option>
                                Research
                            </option>

                            <option>
                                Analytics
                            </option>

                            <option>
                                Automation
                            </option>

                            <option>
                                Planning
                            </option>

                            <option>
                                Development
                            </option>

                        </select>

                    </label>


                    <label>

                        Description

                        <textarea
                            class="modal-textarea"
                            id="agentDescription"
                            placeholder="What should this agent do?"
                            maxlength="250"
                            required></textarea>

                    </label>


                    <div class="modal-actions">

                        <button
                            type="button"
                            class="secondary-button"
                            id="cancelAgent">

                            Cancel

                        </button>


                        <button
                            type="submit"
                            class="primary-btn">

                            Create agent

                        </button>

                    </div>

                </form>

            `

        });


        $("#cancelAgent")
            ?.addEventListener(
                "click",
                closeModal
            );


        $("#agentModalForm")
            ?.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    const name =
                        $("#agentName")
                            .value
                            .trim();

                    const role =
                        $("#agentRole")
                            .value;

                    const description =
                        $("#agentDescription")
                            .value
                            .trim();


                    if (!name || !description) {
                        return;
                    }


                    const icons = {

                        Research: "⌕",

                        Analytics: "◇",

                        Automation: "⚡",

                        Planning: "✦",

                        Development: "⌘"

                    };


                    const agent = {

                        id: Date.now(),

                        name,

                        description,

                        role,

                        status: "active",

                        runs: 0,

                        icon:
                            icons[role] || "✦"

                    };


                    state.agents.unshift(
                        agent
                    );


                    addActivity(
                        "AI agent created",
                        `${name} was added to Agent Hub.`
                    );


                    addNotification(
                        "New AI agent",
                        `${name} is ready.`
                    );


                    saveState();

                    closeModal();

                    renderAll();

                    navigate("agents");


                    showToast(
                        `${name} created successfully.`,
                        "success"
                    );

                }
            );

    }


    /* =====================================================
       WORKFLOWS
    ====================================================== */

    function renderWorkflows() {

        const container =
            $("#workflowGrid");

        if (!container) {
            return;
        }


        if (!state.workflows.length) {

            container.innerHTML = `

                <div class="empty-state">

                    <strong>
                        No workflows
                    </strong>

                    Create an automation workflow.

                </div>

            `;

            return;
        }


        container.innerHTML =
            state.workflows
                .map(workflow =>
                    workflowHTML(workflow)
                )
                .join("");


        $$(".workflow-toggle", container)
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        toggleWorkflow(
                            Number(button.dataset.id)
                        );

                    }
                );

            });


        $$(".workflow-run", container)
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        runWorkflow(
                            Number(button.dataset.id)
                        );

                    }
                );

            });

    }


    function workflowHTML(workflow) {

        const active =
            workflow.status === "active";


        return `

            <article class="workflow-card">

                <div class="workflow-icon">
                    ⌘
                </div>


                <h3>
                    ${escapeHTML(workflow.name)}
                </h3>


                <p>
                    ${escapeHTML(workflow.description)}
                </p>


                <div class="workflow-progress">

                    <span
                        style="width:${workflow.progress}%">
                    </span>

                </div>


                <div class="workflow-bottom">

                    <small>
                        ${workflow.runs} runs
                    </small>


                    <small>
                        ${workflow.progress}% ready
                    </small>

                </div>


                <div class="agent-card-actions">

                    <button
                        class="small-button workflow-toggle"
                        data-id="${workflow.id}">

                        ${active ? "Pause" : "Activate"}

                    </button>


                    <button
                        class="small-button workflow-run"
                        data-id="${workflow.id}">

                        Run now

                    </button>

                </div>

            </article>

        `;

    }


    function toggleWorkflow(id) {

        const workflow =
            state.workflows.find(
                item => item.id === id
            );


        if (!workflow) {
            return;
        }


        workflow.status =
            workflow.status === "active"
                ? "paused"
                : "active";


        addActivity(
            workflow.status === "active"
                ? "Workflow activated"
                : "Workflow paused",
            `${workflow.name} is now ${workflow.status}.`
        );


        saveState();

        renderAll();


        showToast(
            `${workflow.name} is ${workflow.status}.`,
            "success"
        );

    }


    function runWorkflow(id) {

        const workflow =
            state.workflows.find(
                item => item.id === id
            );


        if (!workflow) {
            return;
        }


        if (workflow.status !== "active") {

            showToast(
                "Activate this workflow before running it.",
                "error"
            );

            return;
        }


        workflow.runs += 1;


        workflow.progress =
            Math.min(
                100,
                workflow.progress + 2
            );


        addActivity(
            "Workflow executed",
            `${workflow.name} completed a simulated run.`
        );


        addNotification(
            "Workflow completed",
            `${workflow.name} finished successfully.`
        );


        saveState();

        renderAll();


        showToast(
            `${workflow.name} completed.`,
            "success"
        );

    }


    function openWorkflowModal() {

        openModal({

            label: "AUTOMATION",

            title: "Create workflow",

            body: `

                <form
                    class="modal-form"
                    id="workflowModalForm">

                    <label>

                        Workflow name

                        <input
                            class="modal-input"
                            id="workflowName"
                            placeholder="e.g. Weekly Project Review"
                            maxlength="60"
                            required>

                    </label>


                    <label>

                        Description

                        <textarea
                            class="modal-textarea"
                            id="workflowDescription"
                            placeholder="Describe what this workflow automates..."
                            maxlength="250"
                            required></textarea>

                    </label>


                    <div class="modal-actions">

                        <button
                            type="button"
                            class="secondary-button"
                            id="cancelWorkflow">

                            Cancel

                        </button>


                        <button
                            type="submit"
                            class="primary-btn">

                            Create workflow

                        </button>

                    </div>

                </form>

            `

        });


        $("#cancelWorkflow")
            ?.addEventListener(
                "click",
                closeModal
            );


        $("#workflowModalForm")
            ?.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    const name =
                        $("#workflowName")
                            .value
                            .trim();

                    const description =
                        $("#workflowDescription")
                            .value
                            .trim();


                    if (!name || !description) {
                        return;
                    }


                    const workflow = {

                        id: Date.now(),

                        name,

                        description,

                        status: "active",

                        progress: 25,

                        runs: 0

                    };


                    state.workflows.unshift(
                        workflow
                    );


                    addActivity(
                        "Workflow created",
                        `${name} was added to your automation workspace.`
                    );


                    addNotification(
                        "New workflow",
                        `${name} is ready.`
                    );


                    saveState();

                    closeModal();

                    renderAll();

                    navigate("workflows");


                    showToast(
                        `${name} created successfully.`,
                        "success"
                    );

                }
            );

    }


    /* =====================================================
       ACTIVITY
    ====================================================== */

    function addActivity(title, message) {

        state.activity.unshift({

            id: Date.now(),

            title,

            message,

            time: Date.now()

        });


        state.activity =
            state.activity.slice(0, 50);


        saveState();

        renderActivity();

    }


    function renderActivity() {

        const container =
            $("#timeline");

        if (!container) {
            return;
        }


        if (!state.activity.length) {

            container.innerHTML = `

                <div class="empty-state">

                    <strong>
                        No activity
                    </strong>

                    Workspace activity will appear here.

                </div>

            `;

            return;
        }


        container.innerHTML =
            state.activity
                .slice(0, 30)
                .map(item => `

                    <div class="timeline-item">

                        <div class="timeline-item-content">

                            <b>
                                ${escapeHTML(item.title)}
                            </b>

                            <p>
                                ${escapeHTML(item.message)}
                            </p>

                            <time>
                                ${formatRelativeTime(item.time)}
                            </time>

                        </div>

                    </div>

                `)
                .join("");

    }


    /* =====================================================
       NOTIFICATIONS
    ====================================================== */

    function addNotification(title, message) {

        if (!state.notificationsEnabled) {
            return;
        }


        state.notifications.unshift({

            id: Date.now(),

            title,

            message,

            time: Date.now(),

            read: false

        });


        state.notifications =
            state.notifications.slice(0, 20);


        saveState();

        renderNotifications();

        updateNotificationDot();

    }


    function renderNotifications() {

        const container =
            $("#notificationList");

        if (!container) {
            return;
        }


        if (!state.notifications.length) {

            container.innerHTML = `

                <div class="empty-state">

                    No notifications yet.

                </div>

            `;

            return;
        }


        container.innerHTML =
            state.notifications
                .slice(0, 8)
                .map(item => `

                    <div class="notification-item">

                        <i
                            style="${item.read ? "opacity:.25" : ""}">
                        </i>

                        <div>

                            <b>
                                ${escapeHTML(item.title)}
                            </b>

                            <p>
                                ${escapeHTML(item.message)}
                            </p>

                            <time>
                                ${formatRelativeTime(item.time)}
                            </time>

                        </div>

                    </div>

                `)
                .join("");

    }


    function updateNotificationDot() {

        const unread =
            state.notifications.some(
                item => !item.read
            );


        $("#notificationDot")
            ?.classList.toggle(
                "read",
                !unread
            );

    }


    function markNotificationsRead() {

        state.notifications
            .forEach(
                notification =>
                    notification.read = true
            );


        saveState();

        renderNotifications();

        updateNotificationDot();

        showToast(
            "Notifications marked as read.",
            "success"
        );

    }


    /* =====================================================
       CHART
    ====================================================== */

    function renderChart() {

        const chart =
            $("#chart");

        if (!chart) {
            return;
        }


        const values =
            getChartValues();


        chart.innerHTML =
            values
                .map((value, index) => `

                    <div
                        class="chart-bar"
                        style="height:${value}%"
                        title="${value} activity">

                    </div>

                `)
                .join("");

    }


    function getChartValues() {

        const base =
            state.activity.length;


        const seed = [
            34,
            52,
            42,
            70,
            58,
            82,
            66
        ];


        return seed.map(
            (value, index) =>
                Math.min(
                    95,
                    value +
                    Math.min(
                        18,
                        base * 2
                    ) +
                    ((index + base) % 7)
                )
        );

    }


    /* =====================================================
       WORKSPACES
    ====================================================== */

    function renderWorkspaceList() {

        const container =
            $("#workspaceList");

        if (!container) {
            return;
        }


        container.innerHTML =
            state.workspaces
                .map(workspace => `

                    <button
                        class="dropdown-item workspace-option"
                        data-id="${workspace.id}">

                        <span class="workspace-avatar">
                            ${escapeHTML(
                                initials(workspace.name)
                            )}
                        </span>

                        <span>

                            <b>
                                ${escapeHTML(workspace.name)}
                            </b>

                            <small>
                                ${escapeHTML(workspace.focus)}
                            </small>

                        </span>

                    </button>

                `)
                .join("");


        $$(".workspace-option", container)
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        switchWorkspace(
                            button.dataset.id
                        );

                    }
                );

            });

    }


    function switchWorkspace(id) {

        const workspace =
            state.workspaces.find(
                item => item.id === id
            );


        if (!workspace) {
            return;
        }


        state.currentWorkspaceId =
            id;

        state.selectedFocus =
            workspace.focus;


        saveState();

        renderIdentity();

        renderWorkspaceList();

        closeDropdowns();


        addActivity(
            "Workspace switched",
            `Switched to ${workspace.name}.`
        );


        showToast(
            `${workspace.name} selected.`,
            "success"
        );

    }


    function openWorkspaceModal() {

        openModal({

            label: "WORKSPACE",

            title: "Create workspace",

            body: `

                <form
                    class="modal-form"
                    id="workspaceModalForm">

                    <label>

                        Workspace name

                        <input
                            class="modal-input"
                            id="newWorkspaceName"
                            placeholder="e.g. College Projects"
                            maxlength="40"
                            required>

                    </label>


                    <label>

                        Focus

                        <select
                            class="modal-select"
                            id="newWorkspaceFocus">

                            <option>
                                AI & Productivity
                            </option>

                            <option>
                                Development
                            </option>

                            <option>
                                Research
                            </option>

                            <option>
                                Automation
                            </option>

                        </select>

                    </label>


                    <div class="modal-actions">

                        <button
                            type="button"
                            class="secondary-button"
                            id="cancelWorkspace">

                            Cancel

                        </button>


                        <button
                            type="submit"
                            class="primary-btn">

                            Create workspace

                        </button>

                    </div>

                </form>

            `

        });


        $("#cancelWorkspace")
            ?.addEventListener(
                "click",
                closeModal
            );


        $("#workspaceModalForm")
            ?.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    const name =
                        $("#newWorkspaceName")
                            .value
                            .trim();

                    const focus =
                        $("#newWorkspaceFocus")
                            .value;


                    if (!name) {
                        return;
                    }


                    const workspace = {

                        id:
                            "workspace-" +
                            Date.now(),

                        name,

                        focus

                    };


                    state.workspaces.push(
                        workspace
                    );

                    state.currentWorkspaceId =
                        workspace.id;

                    state.selectedFocus =
                        focus;


                    addActivity(
                        "Workspace created",
                        `${name} was created.`
                    );


                    saveState();

                    closeModal();

                    renderAll();

                    renderIdentity();

                    closeDropdowns();


                    showToast(
                        `${name} created.`,
                        "success"
                    );

                }
            );

    }


    /* =====================================================
       INTEGRATIONS
    ====================================================== */

    function renderIntegrations() {

        $$("[data-integration]")
            .forEach(button => {

                const name =
                    button.dataset.integration;

                const connected =
                    Boolean(
                        state.integrations[name]
                    );


                button.classList.toggle(
                    "connected",
                    connected
                );


                button.textContent =
                    connected
                        ? "Connected"
                        : "Connect";

            });

    }


    function toggleIntegration(name) {

        const connected =
            Boolean(
                state.integrations[name]
            );


        state.integrations[name] =
            !connected;


        addActivity(
            connected
                ? "Integration disconnected"
                : "Integration connected",
            `${name} is now ${
                connected
                    ? "disconnected"
                    : "connected"
            }.`
        );


        saveState();

        renderIntegrations();


        showToast(
            `${name} ${
                connected
                    ? "disconnected"
                    : "connected"
            }.`,
            "success"
        );

    }


    /* =====================================================
       SETTINGS
    ====================================================== */

    function updateSettings() {

        const toggle =
            $("#notificationToggle");


        if (toggle) {

            toggle.checked =
                Boolean(
                    state.notificationsEnabled
                );

        }

    }


    function toggleTheme() {

        state.theme =
            state.theme === "dark"
                ? "light"
                : "dark";


        saveState();

        applyTheme();


        showToast(
            `${capitalize(state.theme)} mode enabled.`,
            "success"
        );

    }


    function applyTheme() {

        document.body.classList.toggle(
            "light",
            state.theme === "light"
        );

    }


    function updateNotificationPreference(enabled) {

        state.notificationsEnabled =
            enabled;


        saveState();


        showToast(
            enabled
                ? "Notifications enabled."
                : "Notifications disabled.",
            "success"
        );

    }


    /* =====================================================
       PROFILE
    ====================================================== */

    function openProfileModal() {

        openModal({

            label: "PROFILE",

            title: "Edit profile",

            body: `

                <form
                    class="modal-form"
                    id="profileEditForm">

                    <label>

                        Name

                        <input
                            class="modal-input"
                            id="editName"
                            value="${escapeAttribute(state.user.name)}"
                            maxlength="40"
                            required>

                    </label>


                    <label>

                        Email

                        <input
                            class="modal-input"
                            type="email"
                            id="editEmail"
                            value="${escapeAttribute(state.user.email)}"
                            maxlength="100"
                            required>

                    </label>


                    <div class="modal-actions">

                        <button
                            type="button"
                            class="secondary-button"
                            id="cancelProfile">

                            Cancel

                        </button>


                        <button
                            type="submit"
                            class="primary-btn">

                            Save profile

                        </button>

                    </div>

                </form>

            `

        });


        $("#cancelProfile")
            ?.addEventListener(
                "click",
                closeModal
            );


        $("#profileEditForm")
            ?.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    const name =
                        $("#editName")
                            .value
                            .trim();

                    const email =
                        $("#editEmail")
                            .value
                            .trim();


                    if (
                        name.length < 2 ||
                        !isValidEmail(email)
                    ) {

                        showToast(
                            "Please enter valid profile information.",
                            "error"
                        );

                        return;

                    }


                    state.user.name =
                        name;

                    state.user.email =
                        email;


                    addActivity(
                        "Profile updated",
                        "Your NEXUS AI profile was updated."
                    );


                    saveState();

                    renderIdentity();

                    closeModal();


                    showToast(
                        "Profile updated.",
                        "success"
                    );

                }
            );

    }


    /* =====================================================
       HELP
    ====================================================== */

    function openHelpModal() {

        openModal({

            label: "NEXUS GUIDE",

            title: "How NEXUS AI works",

            body: `

                <div class="modal-form">

                    <div class="confirm-box">

                        <strong>
                            Command Center
                        </strong>

                        <br>

                        Use the dashboard to manage
                        tasks, agents and workspace activity.

                    </div>


                    <div class="confirm-box">

                        <strong>
                            AI Agents
                        </strong>

                        <br>

                        Create specialized assistants
                        and control their execution.

                    </div>


                    <div class="confirm-box">

                        <strong>
                            Workflows
                        </strong>

                        <br>

                        Build reusable automation flows
                        for repetitive operations.

                    </div>


                    <div class="confirm-box">

                        <strong>
                            Command Palette
                        </strong>

                        <br>

                        Press
                        <strong>Ctrl + K</strong>
                        or
                        <strong>⌘ + K</strong>
                        to quickly access commands.

                    </div>

                </div>

            `

        });

    }


    /* =====================================================
       AI COMMAND INTERFACE
    ====================================================== */

    function executeAICommand(command) {

        const text =
            command
                .trim()
                .toLowerCase();


        if (!text) {
            return;
        }


        let response = "";


        if (
            text.includes("summarize") &&
            text.includes("activity")
        ) {

            const completed =
                state.tasks.filter(
                    task => task.completed
                ).length;


            response =
                `Your workspace currently has ` +
                `${state.tasks.length} tasks, ` +
                `${completed} completed, ` +
                `${state.agents.filter(a => a.status === "active").length} active AI agents, ` +
                `and ${state.workflows.filter(w => w.status === "active").length} active workflows.`;

        } else if (
            text.includes("focus") ||
            text.includes("should i do")
        ) {

            const priority =
                state.tasks.find(
                    task =>
                        !task.completed &&
                        task.priority === "high"
                );


            response =
                priority
                    ? `Your current high-priority focus could be "${priority.title}".`
                    : "You have no unfinished high-priority task right now. Consider creating a focused task.";

        } else if (
            text.includes("active") &&
            text.includes("agent")
        ) {

            const active =
                state.agents
                    .filter(
                        agent =>
                            agent.status === "active"
                    )
                    .map(
                        agent =>
                            agent.name
                    );


            response =
                active.length
                    ? `Active agents: ${active.join(", ")}.`
                    : "There are currently no active agents.";

        } else if (
            text.includes("task")
        ) {

            response =
                `You currently have ${state.tasks.length} tasks. ` +
                `${state.tasks.filter(t => !t.completed).length} still need attention.`;

        } else if (
            text.includes("workflow")
        ) {

            response =
                `There are ${state.workflows.length} workflows, ` +
                `with ${state.workflows.filter(w => w.status === "active").length} currently active.`;

        } else {

            response =
                `NEXUS analyzed your request: "${command}". ` +
                `Try asking about your activity, tasks, agents, workflows, or focus.`;

        }


        const responseBox =
            $("#aiResponse");


        if (!responseBox) {
            return;
        }


        responseBox.innerHTML = `
            <strong>✦ NEXUS AI</strong>
            <br>
            ${escapeHTML(response)}
        `;


        responseBox.classList.remove(
            "hidden"
        );


        addActivity(
            "NEXUS AI command",
            `Processed: ${command}`
        );

    }


    /* =====================================================
       COMMAND PALETTE
    ====================================================== */

    const paletteCommands = [

        {
            icon: "✦",
            name: "Ask NEXUS AI",
            action: () => {

                closePalette();

                navigate("command");

                setTimeout(
                    () => $("#aiInput")?.focus(),
                    100
                );

            }
        },

        {
            icon: "＋",
            name: "Create task",
            action: () => {

                closePalette();

                openTaskModal();

            }
        },

        {
            icon: "✦",
            name: "Open Agent Hub",
            action: () => {

                closePalette();

                navigate("agents");

            }
        },

        {
            icon: "⚡",
            name: "Create AI agent",
            action: () => {

                closePalette();

                openAgentModal();

            }
        },

        {
            icon: "⌘",
            name: "Open Workflows",
            action: () => {

                closePalette();

                navigate("workflows");

            }
        },

        {
            icon: "◇",
            name: "Open Insights",
            action: () => {

                closePalette();

                navigate("insights");

            }
        },

        {
            icon: "◐",
            name: "Toggle theme",
            action: () => {

                closePalette();

                toggleTheme();

            }
        },

        {
            icon: "↻",
            name: "Refresh workspace",
            action: () => {

                closePalette();

                refreshWorkspace();

            }
        },

        {
            icon: "⚙",
            name: "Open Settings",
            action: () => {

                closePalette();

                navigate("settings");

            }
        }

    ];


    function openPalette() {

        const overlay =
            $("#paletteOverlay");


        if (!overlay) {
            return;
        }


        overlay.classList.remove(
            "hidden"
        );


        renderPalette(
            ""
        );


        setTimeout(
            () =>
                $("#paletteInput")
                    ?.focus(),
            50
        );

    }


    function closePalette() {

        $("#paletteOverlay")
            ?.classList.add(
                "hidden"
            );

    }


    function renderPalette(query = "") {

        const container =
            $("#paletteResults");

        if (!container) {
            return;
        }


        const normalized =
            query
                .toLowerCase()
                .trim();


        const filtered =
            paletteCommands.filter(
                command =>
                    command.name
                        .toLowerCase()
                        .includes(normalized)
            );


        if (!filtered.length) {

            container.innerHTML = `

                <div class="empty-state">
                    No commands found.
                </div>

            `;

            return;
        }


        container.innerHTML =
            filtered
                .map(
                    (command, index) => `

                        <button
                            class="palette-item ${index === 0 ? "selected" : ""}"
                            data-command-index="${paletteCommands.indexOf(command)}">

                            <span class="palette-item-icon">
                                ${command.icon}
                            </span>

                            <span>
                                ${escapeHTML(command.name)}
                            </span>

                            <span>
                                →
                            </span>

                        </button>

                    `
                )
                .join("");


        $$(".palette-item", container)
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const command =
                            paletteCommands[
                                Number(
                                    button.dataset.commandIndex
                                )
                            ];


                        command?.action();

                    }
                );

            });

    }


    /* =====================================================
       NAVIGATION
    ====================================================== */

    function navigate(page) {

        const validPages = [
            "command",
            "agents",
            "workflows",
            "insights",
            "activity",
            "integrations",
            "settings"
        ];


        if (!validPages.includes(page)) {
            page = "command";
        }


        currentPage = page;


        $$(".page")
            .forEach(section => {

                section.classList.toggle(
                    "active",
                    section.id ===
                    `page-${page}`
                );

            });


        $$(".nav-item")
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.page === page
                );

            });


        const labels = {

            command: "Command Center",

            agents: "AI Agents",

            workflows: "Workflows",

            insights: "AI Insights",

            activity: "Activity",

            integrations: "Integrations",

            settings: "Settings"

        };


        setText(
            "#breadcrumbName",
            labels[page]
        );


        closeDropdowns();

        closeSidebarMobile();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =====================================================
       REFRESH
    ====================================================== */

    function refreshWorkspace() {

        const refreshButton =
            $("#refreshBtn");


        if (refreshButton) {

            refreshButton.disabled = true;

            refreshButton.innerHTML =
                "↻ Refreshing...";

        }


        setTimeout(
            () => {

                state =
                    loadState();


                renderIdentity();

                renderAll();


                if (refreshButton) {

                    refreshButton.disabled =
                        false;

                    refreshButton.innerHTML =
                        "↻ <span>Refresh</span>";

                }


                addActivity(
                    "Workspace refreshed",
                    "Workspace data was synchronized locally."
                );


                showToast(
                    "Workspace refreshed.",
                    "success"
                );

            },
            550
        );

    }


    /* =====================================================
       MODAL SYSTEM
    ====================================================== */

    function openModal({
        label = "NEXUS AI",
        title = "Modal",
        body = ""
    }) {

        setText(
            "#modalLabel",
            label
        );

        setText(
            "#modalTitle",
            title
        );


        const bodyElement =
            $("#modalBody");


        if (bodyElement) {
            bodyElement.innerHTML = body;
        }


        $("#modalOverlay")
            ?.classList.remove(
                "hidden"
            );

    }


    function closeModal() {

        $("#modalOverlay")
            ?.classList.add(
                "hidden"
            );

    }


    /* =====================================================
       DROPDOWNS
    ====================================================== */

    function closeDropdowns() {

        $$(".dropdown")
            .forEach(dropdown =>
                dropdown.classList.add(
                    "hidden"
                )
            );

    }


    function toggleDropdown(id) {

        const dropdown =
            $(`#${id}`);


        if (!dropdown) {
            return;
        }


        const currentlyHidden =
            dropdown.classList.contains(
                "hidden"
            );


        closeDropdowns();


        if (currentlyHidden) {

            dropdown.classList.remove(
                "hidden"
            );

        }

    }


    /* =====================================================
       MOBILE SIDEBAR
    ====================================================== */

    function openSidebarMobile() {

        $("#sidebar")
            ?.classList.add(
                "mobile-open"
            );

        $("#sidebarOverlay")
            ?.classList.remove(
                "hidden"
            );

    }


    function closeSidebarMobile() {

        $("#sidebar")
            ?.classList.remove(
                "mobile-open"
            );

        $("#sidebarOverlay")
            ?.classList.add(
                "hidden"
            );

    }


    /* =====================================================
       RESET
    ====================================================== */

    function resetWorkspace() {

        openModal({

            label: "DANGER ZONE",

            title: "Reset workspace?",

            body: `

                <div class="modal-form">

                    <div class="confirm-box">

                        This will remove all locally stored
                        NEXUS AI workspace data from this browser.

                        <br><br>

                        Your GitHub files and project files
                        will <strong>not</strong> be affected.

                    </div>


                    <div class="modal-actions">

                        <button
                            class="secondary-button"
                            id="cancelReset">

                            Cancel

                        </button>


                        <button
                            class="danger-button"
                            id="confirmReset">

                            Reset workspace

                        </button>

                    </div>

                </div>

            `

        });


        $("#cancelReset")
            ?.addEventListener(
                "click",
                closeModal
            );


        $("#confirmReset")
            ?.addEventListener(
                "click",
                () => {

                    localStorage.removeItem(
                        STORAGE_KEY
                    );


                    state =
                        cloneDefaultState();


                    closeModal();


                    location.reload();

                }
            );

    }


    /* =====================================================
       EVENT BINDING
    ====================================================== */

    function bindAppEvents() {

        /* Navigation */

        $$(".nav-item")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        navigate(
                            button.dataset.page
                        );

                    }
                );

            });


        /* Top controls */

        $("#searchBtn")
            ?.addEventListener(
                "click",
                openPalette
            );


        $("#themeBtn")
            ?.addEventListener(
                "click",
                toggleTheme
            );


        $("#settingsTheme")
            ?.addEventListener(
                "click",
                toggleTheme
            );


        $("#notificationBtn")
            ?.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    toggleDropdown(
                        "notificationMenu"
                    );

                }
            );


        $("#markRead")
            ?.addEventListener(
                "click",
                markNotificationsRead
            );


        /* Workspace */

        $("#workspaceSwitcher")
            ?.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    toggleDropdown(
                        "workspaceMenu"
                    );

                }
            );


        $("#addWorkspaceBtn")
            ?.addEventListener(
                "click",
                () => {

                    closeDropdowns();

                    openWorkspaceModal();

                }
            );


        /* Tasks */

        $("#newTaskBtn")
            ?.addEventListener(
                "click",
                () =>
                    openTaskModal()
            );


        $("#addTaskText")
            ?.addEventListener(
                "click",
                () =>
                    openTaskModal()
            );


        /* Quick actions */

        $("#quickAgent")
            ?.addEventListener(
                "click",
                openAgentModal
            );


        $("#quickWorkflow")
            ?.addEventListener(
                "click",
                openWorkflowModal
            );


        $("#quickInsight")
            ?.addEventListener(
                "click",
                () =>
                    navigate("insights")
            );


        $("#quickResearch")
            ?.addEventListener(
                "click",
                () => {

                    openTaskModal();

                    setTimeout(
                        () => {

                            if ($("#modalTaskTitle")) {

                                $("#modalTaskTitle")
                                    .value =
                                    "Research new topic";

                                $("#modalTaskDescription")
                                    .value =
                                    "Start a focused research task.";

                                $("#modalTaskPriority")
                                    .value =
                                    "medium";

                            }

                        },
                        50
                    );

                }
            );


        /* Page links */

        $$("[data-go]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        navigate(
                            button.dataset.go
                        );

                    }
                );

            });


        /* AI form */

        $("#aiForm")
            ?.addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    const input =
                        $("#aiInput");

                    const command =
                        input.value.trim();


                    if (!command) {

                        showToast(
                            "Ask NEXUS something first.",
                            "error"
                        );

                        return;
                    }


                    executeAICommand(
                        command
                    );


                    input.value = "";

                }
            );


        /* AI suggestion chips */

        $$(".ai-chips button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const command =
                            button.dataset.command;

                        $("#aiInput").value =
                            command;

                        executeAICommand(
                            command
                        );

                        $("#aiInput").value = "";

                    }
                );

            });


        /* Refresh */

        $("#refreshBtn")
            ?.addEventListener(
                "click",
                refreshWorkspace
            );


        /* Agents */

        $("#createAgentBtn")
            ?.addEventListener(
                "click",
                openAgentModal
            );


        /* Workflows */

        $("#createWorkflowBtn")
            ?.addEventListener(
                "click",
                openWorkflowModal
            );


        /* Integrations */

        $$("[data-integration]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        toggleIntegration(
                            button.dataset.integration
                        );

                    }
                );

            });


        /* Profile */

        $("#profileBtn")
            ?.addEventListener(
                "click",
                openProfileModal
            );


        $("#settingsProfile")
            ?.addEventListener(
                "click",
                openProfileModal
            );


        /* Help */

        $("#helpBtn")
            ?.addEventListener(
                "click",
                openHelpModal
            );


        /* Notifications */

        $("#notificationToggle")
            ?.addEventListener(
                "change",
                event =>
                    updateNotificationPreference(
                        event.target.checked
                    )
            );


        /* Reset */

        $("#resetBtn")
            ?.addEventListener(
                "click",
                resetWorkspace
            );


        /* Modal close */

        $("#modalClose")
            ?.addEventListener(
                "click",
                closeModal
            );


        /* Sidebar */

        $("#openSidebar")
            ?.addEventListener(
                "click",
                openSidebarMobile
            );


        $("#closeSidebar")
            ?.addEventListener(
                "click",
                closeSidebarMobile
            );


        $("#sidebarOverlay")
            ?.addEventListener(
                "click",
                closeSidebarMobile
            );


        /* Palette search */

        $("#paletteInput")
            ?.addEventListener(
                "input",
                event =>
                    renderPalette(
                        event.target.value
                    )
            );


        /* Palette overlay */

        $("#paletteOverlay")
            ?.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        $("#paletteOverlay")
                    ) {

                        closePalette();

                    }

                }
            );


        /* Modal overlay */

        $("#modalOverlay")
            ?.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        $("#modalOverlay")
                    ) {

                        closeModal();

                    }

                }
            );


        /* Keyboard shortcuts */

        document.addEventListener(
            "keydown",
            handleKeyboard
        );


        /* Outside click */

        document.addEventListener(
            "click",
            event => {

                if (
                    !event.target.closest(
                        ".workspace-container"
                    ) &&
                    !event.target.closest(
                        ".notification-container"
                    )
                ) {

                    closeDropdowns();

                }

            }
        );

    }


    /* =====================================================
       KEYBOARD
    ====================================================== */

    function handleKeyboard(event) {

        const key =
            event.key.toLowerCase();


        if (
            (event.ctrlKey || event.metaKey) &&
            key === "k"
        ) {

            event.preventDefault();

            openPalette();

            return;
        }


        if (key === "escape") {

            closePalette();

            closeModal();

            closeDropdowns();

            return;

        }


        const palette =
            $("#paletteOverlay");


        if (
            !palette?.classList.contains(
                "hidden"
            )
        ) {

            if (key === "enter") {

                const selected =
                    $(".palette-item.selected");

                selected?.click();

            }

        }

    }


    /* =====================================================
       TOAST
    ====================================================== */

    function showToast(
        message,
        type = "success"
    ) {

        const toast =
            $("#toast");


        if (!toast) {
            return;
        }


        clearTimeout(
            toastTimer
        );


        toast.textContent =
            message;


        toast.className =
            `toast ${type}`;


        toast.classList.remove(
            "hidden"
        );


        toastTimer =
            setTimeout(
                () => {

                    toast.classList.add(
                        "hidden"
                    );

                },
                3000
            );

    }


    /* =====================================================
       UTILITY
    ====================================================== */

    function setText(
        selector,
        value
    ) {

        const element =
            $(selector);


        if (element) {
            element.textContent =
                String(value);
        }

    }


    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }


    function capitalize(value) {

        return value
            ? value.charAt(0).toUpperCase() +
              value.slice(1)
            : "";

    }


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


    function formatRelativeTime(timestamp) {

        const difference =
            Math.max(
                0,
                Date.now() - timestamp
            );


        const seconds =
            Math.floor(
                difference / 1000
            );


        if (seconds < 10) {
            return "just now";
        }


        if (seconds < 60) {
            return `${seconds}s ago`;
        }


        const minutes =
            Math.floor(
                seconds / 60
            );


        if (minutes < 60) {
            return `${minutes}m ago`;
        }


        const hours =
            Math.floor(
                minutes / 60
            );


        if (hours < 24) {
            return `${hours}h ago`;
        }


        const days =
            Math.floor(
                hours / 24
            );


        if (days < 30) {
            return `${days}d ago`;
        }


        return new Date(timestamp)
            .toLocaleDateString();

    }


    /* =====================================================
       START APPLICATION
    ====================================================== */

    init();

})();