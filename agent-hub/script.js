/* =========================================================
   NEXUS AI — AGENT HUB
   Frontend Interaction Engine
   ========================================================= */


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


/* =========================================================
   STATE
   ========================================================= */

let agents = [];

let completedTasks = 1284;


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeAgents();

    setupNavigation();

    setupCreateAgent();

    setupAgentFilters();

    setupAgentSearch();

    setupAgentRunButtons();

    setupActivityControls();

    setupChat();

    setupNotifications();

    setupGlobalSearch();

    setupMobileMenu();

    setupSettings();

    setupIntegrations();

    setupSort();

    setupFilterButton();

    setupUserMenu();

    updateCounts();

});


/* =========================================================
   AGENT STATE
   ========================================================= */

function initializeAgents() {

    agents = [

        {
            name: "Research Agent",
            status: "active",
            tasks: 342
        },

        {
            name: "Content Agent",
            status: "active",
            tasks: 287
        },

        {
            name: "Data Analyst",
            status: "paused",
            tasks: 451
        },

        {
            name: "Customer Support",
            status: "draft",
            tasks: 204
        }

    ];

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    $$(".nav-item").forEach(button => {

        button.addEventListener("click", () => {

            const page = button.dataset.page;

            if (!page) return;

            $$(".nav-item").forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            if (page !== "Agent Hub") {

                showToast(
                    "Navigation",
                    `${page} module is ready for integration.`
                );

            }

        });

    });

}


/* =========================================================
   CREATE AGENT MODAL
   ========================================================= */

function setupCreateAgent() {

    const modal = $("#createModal");

    const openButtons = [
        $("#createAgentBtn"),
        $("#createAgentTop")
    ];

    openButtons.forEach(button => {

        if (!button) return;

        button.addEventListener("click", openCreateModal);

    });


    $("#closeCreateModal").addEventListener(
        "click",
        closeCreateModal
    );


    $("#cancelCreate").addEventListener(
        "click",
        closeCreateModal
    );


    modal.addEventListener("click", event => {

        if (event.target === modal) {

            closeCreateModal();

        }

    });


    $("#agentForm").addEventListener(
        "submit",
        createAgent
    );


    $("#autonomyRange").addEventListener(
        "input",
        updateAutonomy
    );

}


function openCreateModal() {

    $("#createModal").classList.add("show");

    setTimeout(() => {
        $("#agentName").focus();
    }, 200);

}


function closeCreateModal() {

    $("#createModal").classList.remove("show");

}


function updateAutonomy() {

    const value = $("#autonomyRange").value;

    $("#autonomyValue").textContent =
        `${value} / 5`;

}


function createAgent(event) {

    event.preventDefault();

    const name =
        $("#agentName").value.trim();

    const objective =
        $("#agentObjective").value.trim();

    const type =
        $("#agentType").value;

    const autonomy =
        $("#autonomyRange").value;


    if (!name || !objective) {

        showToast(
            "Missing information",
            "Please complete all required fields."
        );

        return;

    }


    const grid = $("#agentsGrid");


    const card =
        document.createElement("article");


    card.className = "agent-card";

    card.dataset.name = name;

    card.dataset.status = "draft";


    const iconMap = {

        research: "🔎",
        content: "✍",
        analytics: "◈",
        support: "♧",
        custom: "✦"

    };


    const avatarClassMap = {

        research: "research",
        content: "content",
        analytics: "data",
        support: "support",
        custom: "research"

    };


    card.innerHTML = `

        <div class="agent-card-header">

            <div class="agent-avatar ${avatarClassMap[type]}">
                ${iconMap[type]}
            </div>

            <div class="agent-title">

                <h4>${escapeHTML(name)}</h4>

                <span class="status draft-status">
                    <i></i>
                    Draft
                </span>

            </div>

            <button
                class="more-button"
                data-menu="new"
            >
                ⋮
            </button>

        </div>


        <p class="agent-description">
            ${escapeHTML(objective)}
        </p>


        <div class="agent-stats">

            <div>
                <span>Tasks</span>
                <strong class="task-count">0</strong>
            </div>

            <div>
                <span>Success</span>
                <strong>—</strong>
            </div>

            <div>
                <span>Autonomy</span>
                <strong>${autonomy}/5</strong>
            </div>

        </div>


        <div class="progress-wrapper">

            <div class="progress-label">

                <span>Current task</span>

                <span class="current-task">
                    Ready to deploy
                </span>

            </div>

            <div class="progress-bar muted">

                <span style="width:0%"></span>

            </div>

        </div>


        <div class="agent-card-footer">

            <span class="last-run">
                Never run
            </span>

            <button
                class="run-button"
                data-agent="${escapeHTML(name)}"
            >
                ▶ Run
            </button>

        </div>

    `;


    grid.appendChild(card);


    attachRunButton(
        card.querySelector(".run-button")
    );


    attachMoreButton(
        card.querySelector(".more-button")
    );


    agents.push({

        name,
        status: "draft",
        tasks: 0

    });


    updateCounts();

    closeCreateModal();

    $("#agentForm").reset();

    $("#autonomyRange").value = 3;

    updateAutonomy();


    addActivity(

        "purple",

        `${name} was created`,

        `Autonomy level ${autonomy}/5 configured.`

    );


    showToast(

        "Agent created",

        `${name} has been added to your Agent Hub.`

    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   FILTERS
   ========================================================= */

function setupAgentFilters() {

    $$(".tab").forEach(tab => {

        tab.addEventListener("click", () => {

            $$(".tab").forEach(item => {
                item.classList.remove("active");
            });

            tab.classList.add("active");

            const filter =
                tab.dataset.filter;

            filterAgents(filter);

        });

    });

}


function filterAgents(filter) {

    $$(".agent-card").forEach(card => {

        const status =
            card.dataset.status;

        if (
            filter === "all" ||
            status === filter
        ) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });

}


/* =========================================================
   SEARCH
   ========================================================= */

function setupAgentSearch() {

    $("#agentSearch").addEventListener(
        "input",
        event => {

            const query =
                event.target.value
                    .toLowerCase()
                    .trim();


            $$(".agent-card").forEach(card => {

                const name =
                    card.dataset.name
                        .toLowerCase();


                if (
                    name.includes(query)
                ) {

                    card.classList.remove("hidden");

                } else {

                    card.classList.add("hidden");

                }

            });

        }
    );

}


/* =========================================================
   RUN AGENT
   ========================================================= */

function setupAgentRunButtons() {

    $$(".run-button").forEach(button => {

        attachRunButton(button);

    });

}


function attachRunButton(button) {

    if (!button) return;


    button.addEventListener(
        "click",
        () => runAgent(button)
    );

}


function runAgent(button) {

    const card =
        button.closest(".agent-card");


    const agentName =
        button.dataset.agent ||
        card.dataset.name;


    const status =
        card.querySelector(".status");


    const statusText =
        status.lastChild;


    const progress =
        card.querySelector(".progress-bar span");


    const currentTask =
        card.querySelector(".current-task");


    const lastRun =
        card.querySelector(".last-run");


    button.disabled = true;

    button.textContent = "⟳ Running";


    card.dataset.status = "active";


    status.className =
        "status active-status";


    status.innerHTML =
        "<i></i> Running";


    currentTask.textContent =
        "Agent is executing...";


    progress.style.width = "12%";


    addActivity(

        "purple",

        `${agentName} started execution`,

        "Agent execution has been initiated."

    );


    showToast(

        "Agent running",

        `${agentName} has started a new execution.`

    );


    let progressValue = 12;


    const interval = setInterval(() => {

        progressValue +=
            Math.floor(Math.random() * 16) + 7;


        if (progressValue >= 100) {

            progressValue = 100;

        }


        progress.style.width =
            `${progressValue}%`;


        if (progressValue >= 100) {

            clearInterval(interval);

            finishAgentRun(
                card,
                button,
                agentName
            );

        }

    }, 500);

}


function finishAgentRun(
    card,
    button,
    agentName
) {

    const status =
        card.querySelector(".status");


    const progress =
        card.querySelector(".progress-bar span");


    const currentTask =
        card.querySelector(".current-task");


    const lastRun =
        card.querySelector(".last-run");


    const taskCount =
        card.querySelector(".task-count");


    let tasks =
        parseInt(taskCount.textContent) || 0;


    tasks++;

    completedTasks++;


    taskCount.textContent =
        tasks.toLocaleString();


    $("#completedCount").textContent =
        completedTasks.toLocaleString();


    status.className =
        "status active-status";


    status.innerHTML =
        "<i></i> Active";


    currentTask.textContent =
        "Execution completed";


    progress.style.width =
        "100%";


    lastRun.textContent =
        "Last run just now";


    button.disabled = false;

    button.textContent = "▶ Run";


    addActivity(

        "success",

        `${agentName} completed successfully`,

        "Execution finished without errors."

    );


    showToast(

        "Execution complete",

        `${agentName} completed its task successfully.`

    );


    setTimeout(() => {

        currentTask.textContent =
            "Waiting for next task";

        progress.style.width =
            "72%";

    }, 1800);

}


/* =========================================================
   ACTIVITY
   ========================================================= */

function addActivity(
    iconType,
    title,
    description
) {

    const panel =
        $("#activityPanel");


    const item =
        document.createElement("div");


    item.className =
        "activity-item";


    const iconMap = {

        success: "✓",
        purple: "✦",
        warning: "!"

    };


    item.innerHTML = `

        <div class="activity-icon ${iconType}">
            ${iconMap[iconType]}
        </div>

        <div class="activity-content">

            <strong>
                ${escapeHTML(title)}
            </strong>

            <span>
                ${escapeHTML(description)}
            </span>

        </div>

        <time>
            just now
        </time>

    `;


    panel.prepend(item);


    while (panel.children.length > 7) {

        panel.removeChild(
            panel.lastElementChild
        );

    }

}


function setupActivityControls() {

    $("#clearActivityBtn")
        .addEventListener(
            "click",
            () => {

                $("#activityPanel").innerHTML = "";

                showToast(
                    "Activity cleared",
                    "The activity timeline has been cleared."
                );

            }
        );


    $("#refreshBtn")
        .addEventListener(
            "click",
            refreshAgents
        );

}


function refreshAgents() {

    const button =
        $("#refreshBtn");


    button.textContent =
        "⟳ Refreshing...";


    setTimeout(() => {

        button.textContent =
            "↻ Refresh";


        addActivity(

            "success",

            "Agent Hub refreshed",

            "All agent statuses are up to date."

        );


        showToast(

            "Refreshed",

            "Agent Hub data has been refreshed."

        );

    }, 900);

}


/* =========================================================
   COUNTS
   ========================================================= */

function updateCounts() {

    const active =
        agents.filter(
            agent =>
                agent.status === "active"
        ).length;


    $("#activeCount").textContent =
        active;

}


/* =========================================================
   SORT
   ========================================================= */

function setupSort() {

    $("#sortBtn").addEventListener(
        "click",
        () => {

            const grid =
                $("#agentsGrid");


            const cards =
                Array.from(
                    grid.querySelectorAll(".agent-card")
                );


            cards.sort((a,b) => {

                const nameA =
                    a.dataset.name.toLowerCase();

                const nameB =
                    b.dataset.name.toLowerCase();

                return nameA.localeCompare(nameB);

            });


            cards.forEach(card =>
                grid.appendChild(card)
            );


            showToast(
                "Sorted",
                "Agents sorted alphabetically."
            );

        }
    );

}


/* =========================================================
   FILTER BUTTON
   ========================================================= */

function setupFilterButton() {

    $("#filterBtn").addEventListener(
        "click",
        () => {

            const cards =
                Array.from(
                    document.querySelectorAll(".agent-card")
                );


            const activeCards =
                cards.filter(
                    card =>
                        card.dataset.status === "active"
                );


            cards.forEach(card => {

                card.classList.add("hidden");

            });


            activeCards.forEach(card => {

                card.classList.remove("hidden");

            });


            $$(".tab").forEach(tab => {

                tab.classList.remove("active");

            });


            const activeTab =
                document.querySelector(
                    '.tab[data-filter="active"]'
                );


            if (activeTab) {
                activeTab.classList.add("active");
            }


            showToast(
                "Filter applied",
                "Showing active agents only."
            );

        }
    );

}


/* =========================================================
   MORE MENUS
   ========================================================= */

function attachMoreButton(button) {

    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            const card =
                button.closest(".agent-card");


            const agentName =
                card.dataset.name;


            const choice =
                window.confirm(
                    `${agentName}\n\n` +
                    `OK = Pause / Resume\n` +
                    `Cancel = Delete`
                );


            if (choice) {

                toggleAgentStatus(card);

            } else {

                deleteAgent(card);

            }

        }
    );

}


function setupMoreButtons() {

    $$(".more-button").forEach(
        attachMoreButton
    );

}


function toggleAgentStatus(card) {

    const agentName =
        card.dataset.name;


    const status =
        card.querySelector(".status");


    if (card.dataset.status === "paused") {

        card.dataset.status = "active";

        status.className =
            "status active-status";

        status.innerHTML =
            "<i></i> Active";


        addActivity(
            "success",
            `${agentName} resumed`,
            "Agent is now active."
        );


        showToast(
            "Agent resumed",
            `${agentName} is now active.`
        );


    } else {

        card.dataset.status = "paused";

        status.className =
            "status paused-status";

        status.innerHTML =
            "<i></i> Paused";


        addActivity(
            "warning",
            `${agentName} paused`,
            "Agent execution has been paused."
        );


        showToast(
            "Agent paused",
            `${agentName} has been paused.`
        );

    }

}


function deleteAgent(card) {

    const agentName =
        card.dataset.name;


    const confirmed =
        window.confirm(
            `Delete "${agentName}"?`
        );


    if (!confirmed) return;


    card.style.transform =
        "scale(.95)";

    card.style.opacity =
        "0";


    setTimeout(() => {

        card.remove();


        agents =
            agents.filter(
                agent =>
                    agent.name !== agentName
            );


        updateCounts();


        addActivity(
            "warning",
            `${agentName} deleted`,
            "The agent was removed from Agent Hub."
        );


        showToast(
            "Agent deleted",
            `${agentName} has been removed.`
        );

    }, 250);

}


setupMoreButtons();


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function setupNotifications() {

    $("#notificationBtn")
        .addEventListener(
            "click",
            () => {

                showToast(

                    "Notifications",

                    "Research Agent completed a task 2 minutes ago."

                );

            }
        );

}


/* =========================================================
   GLOBAL SEARCH
   ========================================================= */

function setupGlobalSearch() {

    $("#searchBtn")
        .addEventListener(
            "click",
            () => {

                $("#agentSearch").focus();

                $("#agentSearch").scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }
        );

}


/* =========================================================
   CHATBOT
   ========================================================= */

function setupChat() {

    const toggle =
        $("#chatToggle");

    const windowElement =
        $("#chatWindow");


    toggle.addEventListener(
        "click",
        () => {

            windowElement.classList.toggle("show");

        }
    );


    $("#closeChat")
        .addEventListener(
            "click",
            () => {

                windowElement.classList.remove("show");

            }
        );


    $("#sendChat")
        .addEventListener(
            "click",
            sendChatMessage
        );


    $("#chatInput")
        .addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    sendChatMessage();

                }

            }
        );

}


function sendChatMessage() {

    const input =
        $("#chatInput");


    const text =
        input.value.trim();


    if (!text) return;


    addChatMessage(
        text,
        "user"
    );


    input.value = "";


    setTimeout(() => {

        const response =
            generateChatResponse(text);


        addChatMessage(
            response,
            "bot"
        );

    }, 600);

}


function addChatMessage(
    text,
    type
) {

    const messages =
        $("#chatMessages");


    const message =
        document.createElement("div");


    message.className =
        `message ${type}`;


    message.textContent =
        text;


    messages.appendChild(message);


    messages.scrollTop =
        messages.scrollHeight;

}


function generateChatResponse(text) {

    const query =
        text.toLowerCase();


    if (
        query.includes("active") ||
        query.includes("agents")
    ) {

        const active =
            agents.filter(
                agent =>
                    agent.status === "active"
            ).length;


        return `You currently have ${active} active agent(s) in the workspace.`;

    }


    if (
        query.includes("research")
    ) {

        return "The Research Agent is configured for information gathering, analysis and summarization.";

    }


    if (
        query.includes("run")
    ) {

        return "You can run an agent using the ▶ Run button on its agent card.";

    }


    if (
        query.includes("pause")
    ) {

        return "Use the ⋮ menu on an agent card to pause or resume that agent.";

    }


    if (
        query.includes("help")
    ) {

        return "I can help you understand agent status, executions, research agents, and workspace controls.";

    }


    return "I understand. Once the NEXUS backend is connected, I'll be able to interact with real AI agents and execution data.";

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

    $("#mobileMenuBtn")
        .addEventListener(
            "click",
            () => {

                $("#sidebar")
                    .classList
                    .toggle("open");

            }
        );

}


/* =========================================================
   SETTINGS
   ========================================================= */

function setupSettings() {

    $("#settingsBtn")
        .addEventListener(
            "click",
            () => {

                showToast(
                    "Settings",
                    "Agent preferences panel will be connected here."
                );

            }
        );


    $("#userMenuBtn")
        .addEventListener(
            "click",
            () => {

                showToast(
                    "Account",
                    "Profile and workspace controls opened."
                );

            }
        );

}


/* =========================================================
   INTEGRATIONS
   ========================================================= */

function setupIntegrations() {

    $("#integrationsBtn")
        .addEventListener(
            "click",
            () => {

                showToast(
                    "Integrations",
                    "Connect services such as GitHub, Slack and Google."
                );

            }
        );

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(
    title,
    message
) {

    const container =
        $("#toastContainer");


    const toast =
        document.createElement("div");


    toast.className =
        "toast";


    toast.innerHTML = `

        <strong>
            ${escapeHTML(title)}
        </strong>

        <span>
            ${escapeHTML(message)}
        </span>

    `;


    container.appendChild(toast);


    setTimeout(() => {

        toast.style.opacity = "0";

        toast.style.transform =
            "translateX(20px)";

        toast.style.transition =
            ".25s";

        setTimeout(
            () => toast.remove(),
            250
        );

    }, 3000);

}


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /* CTRL + K */

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            $("#agentSearch").focus();

        }


        /* ESC */

        if (event.key === "Escape") {

            $("#createModal")
                .classList
                .remove("show");

            $("#chatWindow")
                .classList
                .remove("show");

        }

    }
);