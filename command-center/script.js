/* =========================================================
   NEXUS AI
   COMMAND CENTER
   COMPLETE APPLICATION LOGIC
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const USER_KEY = "nexus_ai_user";
const THEME_KEY = "nexus_ai_theme";


/* =========================================================
   STATE
========================================================= */

let user = {
    name: "",
    email: "",
    interests: []
};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = id =>
    document.getElementById(id);

const $$ = selector =>
    document.querySelectorAll(selector);


/* =========================================================
   START APPLICATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


function initialize() {

    loadUser();

    loadTheme();

    setupOnboarding();

    setupNavigation();

    setupWorkspace();

    setupProfile();

    setupNotifications();

    setupTheme();

    setupCommandPalette();

    setupAI();

    setupQuickActions();

    setupDashboardActions();

    setupMobile();

    setupSettings();

}


/* =========================================================
   USER STORAGE
========================================================= */

function loadUser() {

    const saved =
        localStorage.getItem(USER_KEY);

    if (!saved) {

        showOnboarding();

        return;
    }


    try {

        user =
            JSON.parse(saved);

        if (
            user.name &&
            user.email
        ) {

            openApplication();

        } else {

            showOnboarding();

        }

    } catch {

        localStorage.removeItem(USER_KEY);

        showOnboarding();

    }

}


function saveUser() {

    localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
    );

}


/* =========================================================
   ONBOARDING
========================================================= */

function setupOnboarding() {

    $("get-started").addEventListener(
        "click",
        () => showStep(2)
    );


    $("back-step-1").addEventListener(
        "click",
        () => showStep(1)
    );


    $("back-step-2").addEventListener(
        "click",
        () => showStep(2)
    );


    $("profile-form").addEventListener(
        "submit",
        handleProfile
    );


    $$(".interest-card").forEach(
        card => {

            card.addEventListener(
                "click",
                () => {

                    card.classList.toggle(
                        "selected"
                    );


                    const interest =
                        card.dataset.interest;


                    if (
                        user.interests.includes(
                            interest
                        )
                    ) {

                        user.interests =
                            user.interests.filter(
                                item =>
                                    item !== interest
                            );

                    } else {

                        user.interests.push(
                            interest
                        );

                    }

                }
            );

        }
    );


    $("launch-btn").addEventListener(
        "click",
        launchApplication
    );

}


function handleProfile(event) {

    event.preventDefault();


    const name =
        $("name-input").value.trim();

    const email =
        $("email-input").value.trim();


    if (name.length < 2) {

        $("form-error").textContent =
            "Please enter your name.";

        return;
    }


    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email)
    ) {

        $("form-error").textContent =
            "Please enter a valid email.";

        return;
    }


    $("form-error").textContent = "";


    user.name = name;

    user.email = email;


    showStep(3);

}


function showStep(number) {

    $$(".onboarding-step")
        .forEach(
            step =>
                step.classList.remove(
                    "active"
                )
        );


    $(`step-${number}`)
        .classList.add(
            "active"
        );


    $$(".step-dot")
        .forEach(
            (dot,index) => {

                dot.classList.toggle(
                    "active",
                    index < number
                );

            }
        );

}


function showOnboarding() {

    $("onboarding")
        .classList.remove("hidden");

    $("initializing")
        .classList.add("hidden");

    $("app")
        .classList.add("hidden");

}


function launchApplication() {

    if (!user.name) {

        showStep(2);

        return;
    }


    saveUser();


    $("onboarding")
        .classList.add("hidden");

    $("initializing")
        .classList.remove("hidden");


    const loaders =
        $$(".loading-list div");


    loaders.forEach(
        item =>
            item.classList.remove(
                "done"
            )
    );


    loaders.forEach(
        (item,index) => {

            setTimeout(
                () =>
                    item.classList.add(
                        "done"
                    ),
                500 + index * 600
            );

        }
    );


    setTimeout(
        openApplication,
        3100
    );

}


/* =========================================================
   OPEN APPLICATION
========================================================= */

function openApplication() {

    $("onboarding")
        .classList.add("hidden");

    $("initializing")
        .classList.add("hidden");

    $("app")
        .classList.remove("hidden");


    updateUserUI();

}


function updateUserUI() {

    const name =
        user.name || "User";

    const email =
        user.email || "user@example.com";

    const initial =
        name.charAt(0).toUpperCase();


    $("dashboard-name")
        .textContent = name;

    $("sidebar-name")
        .textContent = name;

    $("sidebar-email")
        .textContent = email;

    $("sidebar-avatar")
        .textContent = initial;

    $("dropdown-avatar")
        .textContent = initial;

    $("dropdown-name")
        .textContent = name;

    $("dropdown-email")
        .textContent = email;


    updateGreeting();

}


function updateGreeting() {

    const hour =
        new Date().getHours();


    let greeting =
        "Good evening";


    if (hour < 12) {

        greeting =
            "Good morning";

    } else if (hour < 17) {

        greeting =
            "Good afternoon";

    }


    $("greeting")
        .textContent = greeting;

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    $$(".nav-item").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    showPage(
                        button.dataset.page
                    );

                    closeAllFloating();

                    closeMobile();

                }
            );

        }
    );


    $$("[data-page-link]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    showPage(
                        button.dataset.pageLink
                    );

                }
            );

        }
    );

}


function showPage(page) {

    $$(".page")
        .forEach(
            section =>
                section.classList.remove(
                    "active-page"
                )
        );


    const target =
        document.querySelector(
            `[data-content="${page}"]`
        );


    if (target) {

        target.classList.add(
            "active-page"
        );

    }


    $$(".nav-item")
        .forEach(
            item => {

                item.classList.toggle(
                    "active",
                    item.dataset.page === page
                );

            }
        );


    const names = {

        command: "Command Center",

        agents: "AI Agents",

        workflows: "Workflows",

        insights: "AI Insights",

        activity: "Activity",

        integrations: "Integrations",

        settings: "Settings"

    };


    $("breadcrumb-name")
        .textContent =
            names[page] || page;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   WORKSPACE
========================================================= */

function setupWorkspace() {

    $("workspace-button")
        .addEventListener(
            "click",
            event => {

                event.stopPropagation();

                closeProfile();

                toggleDropdown(
                    $("workspace-menu"),
                    $("workspace-button")
                );

            }
        );


    $$("#workspace-menu button")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const action =
                            button.dataset.workspaceAction;


                        if (
                            action === "current"
                        ) {

                            showToast(
                                "Workspace",
                                "Personal Workspace is active."
                            );

                        }


                        if (
                            action === "create"
                        ) {

                            closeWorkspace();

                            openCreateWorkspaceModal();

                        }


                        if (
                            action === "settings"
                        ) {

                            closeWorkspace();

                            showPage(
                                "settings"
                            );

                        }

                    }
                );

            }
        );

}


/* =========================================================
   PROFILE
========================================================= */

function setupProfile() {

    $("profile-button")
        .addEventListener(
            "click",
            event => {

                event.stopPropagation();

                closeWorkspace();

                toggleDropdown(
                    $("profile-menu"),
                    $("profile-button")
                );

            }
        );


    $$("#profile-menu button")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const action =
                            button.dataset.profileAction;


                        closeProfile();


                        if (
                            action === "profile"
                        ) {

                            openProfileModal();

                        }


                        if (
                            action === "preferences"
                        ) {

                            openPreferencesModal();

                        }


                        if (
                            action === "reset"
                        ) {

                            resetApplication();

                        }

                    }
                );

            }
        );

}


function toggleDropdown(
    menu,
    anchor
) {

    const wasHidden =
        menu.classList.contains(
            "hidden"
        );


    closeAllFloating();


    if (!wasHidden) {
        return;
    }


    const rect =
        anchor.getBoundingClientRect();


    menu.classList.remove(
        "hidden"
    );


    const width =
        menu.offsetWidth;


    let left =
        rect.left;


    let top =
        rect.bottom + 8;


    if (
        left + width >
        window.innerWidth - 15
    ) {

        left =
            window.innerWidth -
            width -
            15;

    }


    if (
        top + menu.offsetHeight >
        window.innerHeight - 15
    ) {

        top =
            rect.top -
            menu.offsetHeight -
            8;

    }


    menu.style.left =
        `${left}px`;

    menu.style.top =
        `${top}px`;

}


function closeWorkspace() {

    $("workspace-menu")
        .classList.add("hidden");

}


function closeProfile() {

    $("profile-menu")
        .classList.add("hidden");

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function setupNotifications() {

    $("notification-button")
        .addEventListener(
            "click",
            event => {

                event.stopPropagation();

                closeWorkspace();
                closeProfile();

                toggleNotification();

            }
        );


    $("close-notifications")
        .addEventListener(
            "click",
            closeNotifications
        );

}


function toggleNotification() {

    const panel =
        $("notification-panel");


    const hidden =
        panel.classList.contains(
            "hidden"
        );


    closeAllFloating();


    if (hidden) {

        panel.classList.remove(
            "hidden"
        );

    }

}


function closeNotifications() {

    $("notification-panel")
        .classList.add("hidden");

}


/* =========================================================
   THEME
========================================================= */

function loadTheme() {

    const theme =
        localStorage.getItem(
            THEME_KEY
        );


    if (theme === "light") {

        document.body
            .classList.add("light");

    }


    updateThemeButton();

}


function setupTheme() {

    $("theme-button")
        .addEventListener(
            "click",
            toggleTheme
        );

}


function toggleTheme() {

    document.body
        .classList.toggle("light");


    const light =
        document.body
            .classList.contains("light");


    localStorage.setItem(
        THEME_KEY,
        light ? "light" : "dark"
    );


    updateThemeButton();


    showToast(
        "Appearance",
        light
            ? "Light mode enabled."
            : "Dark mode enabled."
    );

}


function updateThemeButton() {

    const light =
        document.body
            .classList.contains("light");


    $("theme-button")
        .textContent =
            light ? "☀" : "◐";

}


/* =========================================================
   COMMAND PALETTE
========================================================= */

function setupCommandPalette() {

    $("search-button")
        .addEventListener(
            "click",
            openPalette
        );


    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.ctrlKey ||
                    event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                openPalette();

            }


            if (
                event.key === "Escape"
            ) {

                closePalette();

                closeAllFloating();

                closeModal();

            }

        }
    );


    $("command-palette")
        .addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("command-palette")
                ) {

                    closePalette();

                }

            }
        );


    $$(".palette-options button")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        executeCommand(
                            button.dataset.command
                        );

                    }
                );

            }
        );


    $("palette-input")
        .addEventListener(
            "input",
            filterPalette
        );

}


function openPalette() {

    closeAllFloating();

    $("command-palette")
        .classList.remove("hidden");


    $("palette-input")
        .value = "";


    $("palette-input")
        .focus();


    filterPalette();

}


function closePalette() {

    $("command-palette")
        .classList.add("hidden");

}


function filterPalette() {

    const query =
        $("palette-input")
            .value
            .toLowerCase()
            .trim();


    $$(".palette-options button")
        .forEach(
            button => {

                const text =
                    button.textContent
                        .toLowerCase();


                button.style.display =
                    text.includes(query)
                        ? "flex"
                        : "none";

            }
        );

}


function executeCommand(command) {

    closePalette();


    if (command === "ask") {

        showPage("command");

        $("prompt").focus();

        return;

    }


    showPage(command);

}


/* =========================================================
   AI COMMAND
========================================================= */

function setupAI() {

    $("send-button")
        .addEventListener(
            "click",
            sendPrompt
        );


    $("prompt")
        .addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendPrompt();

                }

            }
        );


    $("prompt")
        .addEventListener(
            "input",
            () => {

                const textarea =
                    $("prompt");

                textarea.style.height =
                    "auto";

                textarea.style.height =
                    Math.min(
                        textarea.scrollHeight,
                        150
                    ) + "px";

            }
        );


    $$(".suggestions button")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        $("prompt")
                            .value =
                            button.dataset.prompt;

                        $("prompt")
                            .focus();

                    }
                );

            }
        );


    $("close-response")
        .addEventListener(
            "click",
            () => {

                $("ai-response")
                    .classList.add("hidden");

            }
        );

}


function sendPrompt() {

    const prompt =
        $("prompt")
            .value
            .trim();


    if (!prompt) {

        showToast(
            "Ask NEXUS",
            "Type something first."
        );

        return;
    }


    const safe =
        escapeHTML(prompt);


    $("response-text").innerHTML = `

        <strong>
            I received your request:
        </strong>

        <br><br>

        "${safe}"

        <br><br>

        This Command Center is ready for a
        real AI API connection. The current
        version demonstrates the complete
        frontend interaction and response flow.

    `;


    $("ai-response")
        .classList.remove("hidden");


    $("prompt")
        .value = "";

}


/* =========================================================
   QUICK ACTIONS
========================================================= */

function setupQuickActions() {

    $$(".quick-card")
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        const action =
                            card.dataset.action;


                        if (
                            action === "agent"
                        ) {

                            showPage("agents");

                        }


                        if (
                            action === "workflow"
                        ) {

                            showPage("workflows");

                        }


                        if (
                            action === "insights"
                        ) {

                            showPage("insights");

                        }


                        if (
                            action === "research"
                        ) {

                            showPage("command");

                            $("prompt")
                                .value =
                                "Help me start a research task.";

                            $("prompt")
                                .focus();

                        }

                    }
                );

            }
        );


    $("view-all-actions")
        .addEventListener(
            "click",
            () => {

                showToast(
                    "Quick Actions",
                    "All workspace actions are available through the Command Palette."
                );

                openPalette();

            }
        );

}


/* =========================================================
   DASHBOARD ACTIONS
========================================================= */

function setupDashboardActions() {

    $("new-task-button")
        .addEventListener(
            "click",
            () => {

                showPage("command");

                $("prompt").focus();

            }
        );


    $("refresh-button")
        .addEventListener(
            refreshWorkspace
        );


    $("help-button")
        .addEventListener(
            openHelpModal
        );


    $("create-workflow")
        .addEventListener(
            openCreateWorkflowModal
        );


    $("activity-period")
        .addEventListener(
            event => {

                showToast(
                    "Activity updated",
                    event.target.value
                );

            }
        );


    $$(".integration-grid button")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        showToast(
                            "Integration",
                            "Integration settings are ready to be connected."
                        );

                    }
                );

            }
        );

}


function refreshWorkspace() {

    const button =
        $("refresh-button");


    button.disabled = true;

    button.textContent =
        "↻ Refreshing";


    setTimeout(
        () => {

            button.disabled = false;

            button.textContent =
                "↻ Refresh";

            showToast(
                "Workspace refreshed",
                "Your workspace is up to date."
            );

        },
        800
    );

}


/* =========================================================
   MOBILE
========================================================= */

function setupMobile() {

    $("mobile-menu")
        .addEventListener(
            "click",
            () => {

                $("sidebar")
                    .classList.toggle(
                        "mobile-open"
                    );

                $("sidebar-overlay")
                    .style.display =
                    $("sidebar")
                        .classList.contains(
                            "mobile-open"
                        )
                        ? "block"
                        : "none";

            }
        );


    $("sidebar-overlay")
        .addEventListener(
            "click",
            closeMobile
        );

}


function closeMobile() {

    $("sidebar")
        .classList.remove(
            "mobile-open"
        );

    $("sidebar-overlay")
        .style.display =
        "none";

}


/* =========================================================
   SETTINGS
========================================================= */

function setupSettings() {

    $("settings-theme")
        .addEventListener(
            "click",
            () => {

                toggleTheme();

            }
        );


    $("settings-profile")
        .addEventListener(
            "click",
            openProfileModal
        );


    $("settings-reset")
        .addEventListener(
            "click",
            resetApplication
        );

}


/* =========================================================
   MODALS
========================================================= */

function openModal(
    title,
    kicker,
    html
) {

    $("modal-title")
        .textContent = title;

    $("modal-kicker")
        .textContent = kicker;

    $("modal-body")
        .innerHTML = html;

    $("modal-overlay")
        .classList.remove("hidden");

}


function closeModal() {

    $("modal-overlay")
        .classList.add("hidden");

}


$("modal-close")
    .addEventListener(
        "click",
        closeModal
    );


$("modal-overlay")
    .addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("modal-overlay")
            ) {

                closeModal();

            }

        }
    );


function openProfileModal() {

    openModal(
        "My Profile",
        "ACCOUNT",
        `

        <form
            id="profile-edit-form"
            class="modal-form"
        >

            <label>
                Name

                <input
                    id="edit-name"
                    value="${escapeAttribute(user.name)}"
                    required
                >
            </label>


            <label>
                Email

                <input
                    id="edit-email"
                    type="email"
                    value="${escapeAttribute(user.email)}"
                    required
                >
            </label>


            <div class="modal-actions">

                <button
                    type="button"
                    class="secondary-btn"
                    id="cancel-profile"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    class="primary-btn"
                >
                    Save Changes
                </button>

            </div>

        </form>

        `
    );


    $("cancel-profile")
        .addEventListener(
            "click",
            closeModal
        );


    $("profile-edit-form")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const newName =
                    $("edit-name")
                        .value
                        .trim();

                const newEmail =
                    $("edit-email")
                        .value
                        .trim();


                if (
                    newName.length < 2 ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        .test(newEmail)
                ) {

                    showToast(
                        "Invalid profile",
                        "Please enter valid details."
                    );

                    return;
                }


                user.name =
                    newName;

                user.email =
                    newEmail;


                saveUser();

                updateUserUI();

                closeModal();


                showToast(
                    "Profile updated",
                    "Your profile has been saved."
                );

            }
        );

}


function openPreferencesModal() {

    openModal(
        "Preferences",
        "NEXUS AI",
        `

        <div class="modal-message">

            <p>
                Your preferences are stored locally
                for this demo.
            </p>

            <br>

            <p>
                Current theme:
                <strong>
                    ${
                        document.body.classList.contains(
                            "light"
                        )
                        ? "Light"
                        : "Dark"
                    }
                </strong>
            </p>

            <div class="modal-actions">

                <button
                    id="preference-theme"
                    class="primary-btn"
                    type="button"
                >
                    Toggle Theme
                </button>

            </div>

        </div>

        `
    );


    $("preference-theme")
        .addEventListener(
            "click",
            () => {

                toggleTheme();

                closeModal();

            }
        );

}


function openCreateWorkspaceModal() {

    openModal(
        "Create Workspace",
        "WORKSPACE",
        `

        <form
            id="workspace-form"
            class="modal-form"
        >

            <label>
                Workspace name

                <input
                    id="workspace-name"
                    placeholder="e.g. College Project"
                    required
                >
            </label>


            <div class="modal-actions">

                <button
                    type="button"
                    class="secondary-btn"
                    id="cancel-workspace"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    class="primary-btn"
                >
                    Create
                </button>

            </div>

        </form>

        `
    );


    $("cancel-workspace")
        .addEventListener(
            "click",
            closeModal
        );


    $("workspace-form")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    $("workspace-name")
                        .value
                        .trim();


                if (!name) {
                    return;
                }


                closeModal();


                showToast(
                    "Workspace created",
                    `${name} is ready to configure.`
                );

            }
        );

}


function openCreateWorkflowModal() {

    openModal(
        "Create Workflow",
        "AUTOMATION",
        `

        <div class="modal-message">

            <p>
                Build a workflow by connecting
                triggers, AI agents and actions.
            </p>

            <br>

            <p>
                Example:
            </p>

            <br>

            <strong>
                New File → AI Agent → Analyze →
                Generate Report
            </strong>

            <div class="modal-actions">

                <button
                    id="start-workflow"
                    class="primary-btn"
                    type="button"
                >
                    Start Building
                </button>

            </div>

        </div>

        `
    );


    $("start-workflow")
        .addEventListener(
            "click",
            () => {

                closeModal();

                showToast(
                    "Workflow Builder",
                    "Workflow canvas is ready for the next development phase."
                );

            }
        );

}


function openHelpModal() {

    openModal(
        "NEXUS AI Guide",
        "HELP",
        `

        <div class="modal-message">

            <p>
                <strong>Command Center</strong>
                is your central workspace.
            </p>

            <br>

            <p>
                Use the sidebar to navigate between
                AI Agents, Workflows, Insights,
                Activity, Integrations and Settings.
            </p>

            <br>

            <p>
                Press
                <strong>Ctrl + K</strong>
                anytime to open the Command Palette.
            </p>

        </div>

        `
    );

}


/* =========================================================
   RESET
========================================================= */

function resetApplication() {

    const confirmed =
        confirm(
            "Reset NEXUS AI and return to onboarding?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        USER_KEY
    );

    localStorage.removeItem(
        THEME_KEY
    );


    location.reload();

}


/* =========================================================
   FLOATING ELEMENTS
========================================================= */

function closeAllFloating() {

    closeWorkspace();

    closeProfile();

    closeNotifications();

}


/* =========================================================
   OUTSIDE CLICK
========================================================= */

document.addEventListener(
    "click",
    event => {

        const workspace =
            $("workspace-menu");

        const profile =
            $("profile-menu");

        const workspaceButton =
            $("workspace-button");

        const profileButton =
            $("profile-button");

        const notification =
            $("notification-panel");

        const notificationButton =
            $("notification-button");


        if (
            !workspace.contains(event.target) &&
            !workspaceButton.contains(event.target)
        ) {

            closeWorkspace();

        }


        if (
            !profile.contains(event.target) &&
            !profileButton.contains(event.target)
        ) {

            closeProfile();

        }


        if (
            !notification.contains(event.target) &&
            !notificationButton.contains(event.target)
        ) {

            closeNotifications();

        }

    }
);


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}


function escapeAttribute(value) {

    return escapeHTML(value)
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(
    title,
    message
) {

    $("toast-title")
        .textContent = title;

    $("toast-message")
        .textContent = message;


    $("toast")
        .classList.add("show");


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                $("toast")
                    .classList.remove(
                        "show"
                    );

            },
            2800
        );

}