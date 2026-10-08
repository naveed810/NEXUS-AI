
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
                const state = JSON.parse(raw);
                if (state?.user?.name) name = state.user.name;
                if (state?.user?.email) email = state.user.email;
            }
        }
        const avatar = name.trim().charAt(0).toUpperCase() || "N";
        document.getElementById("profileName")?.replaceChildren(document.createTextNode(name));
        document.getElementById("profileEmail")?.replaceChildren(document.createTextNode(email));
        document.getElementById("profileAvatar")?.replaceChildren(document.createTextNode(avatar));
    } catch (_) {}
}

const state = {

    workflowName:
        "Customer Support Workflow",

    nodes: [],

    connections: [],

    selectedNodeId: null,

    nextNodeId: 1,

    isRunning: false,

    pendingConnection: null
};


const NODE_META = {

    "Trigger": {

        icon: "⚡",

        description:
            "Starts the workflow when an event occurs."

    },

    "AI Agent": {

        icon: "🤖",

        description:
            "Processes information using an AI agent."

    },

    "Tool": {

        icon: "🔧",

        description:
            "Runs a tool, API, search, or external action."

    },

    "Condition": {

        icon: "🔀",

        description:
            "Checks a rule and controls the next step."

    },

    "Output": {

        icon: "📤",

        description:
            "Produces the final workflow result."

    }

};


const els = {};
/* =========================================================
   PERSIST WORKFLOW STATE
========================================================= */

function persistWorkflowState() {

    try {

        const payload = {

            workflowName:
                state.workflowName,

            nodes:
                state.nodes,

            connections:
                state.connections,

            selectedNodeId:
                state.selectedNodeId,

            nextNodeId:
                state.nextNodeId,

            savedAt:
                new Date().toISOString()

        };


        localStorage.setItem(
            "nexusWorkflowBuilderState",
            JSON.stringify(payload)
        );

    }

    catch (error) {

        console.warn(
            "[NEXUS AI] Could not persist workflow state.",
            error
        );

    }

}
/* =========================================================
   RESTORE WORKFLOW STATE
========================================================= */

function restoreWorkflowState() {

    try {

        let raw =
            localStorage.getItem(
                "nexusWorkflowBuilderState"
            );

        if (!raw) {
            raw = localStorage.getItem("nexusWorkflow");
        }

        if (!raw) {
            return false;
        }

        const saved =
            JSON.parse(raw);

        if (
            !saved ||
            !Array.isArray(saved.nodes) ||
            !Array.isArray(saved.connections)
        ) {
            return false;
        }

        state.workflowName =
            saved.workflowName ||
            saved.name ||
            "Customer Support Workflow";

        state.nodes =
            saved.nodes;

        state.connections =
            saved.connections;

        state.selectedNodeId =
            saved.selectedNodeId || null;

        state.nextNodeId =
            Number(saved.nextNodeId) ||
            (
                state.nodes.length + 1
            );

        if (els.title) {
            els.title.textContent =
                state.workflowName;
        }

        console.log(
            "[NEXUS AI] Workflow state restored:",
            state.nodes.length,
            "nodes",
            state.connections.length,
            "connections"
        );

        return true;

    }

    catch (error) {

        console.warn(
            "[NEXUS AI] Could not restore workflow state.",
            error
        );

        return false;

    }

}

/* ================= INITIALIZATION ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        els.canvas =
            document.getElementById(
                "workflowCanvas"
            );

        els.connectionsLayer =
            document.getElementById(
                "connectionsLayer"
            );

        els.emptyState =
            document.getElementById(
                "emptyState"
            );

        els.status =
            document.getElementById(
                "workflowStatus"
            );

        els.title =
            document.getElementById(
                "workflowTitle"
            );

        syncNexusProfile();
        restoreWorkflowState();

        els.toast =
            document.getElementById(
                "toast"
            );

        els.inspectorContent =
            document.getElementById(
                "inspectorContent"
            );

        els.selectionDot =
            document.getElementById(
                "selectionDot"
            );

        els.modalBackdrop =
            document.getElementById(
                "modalBackdrop"
            );

        if (window.initNexus3DWidget) {
            const container = document.getElementById("workflow3DCore");
            if (container) {
                window.workflow3DCore = window.initNexus3DWidget(container, {
                    theme: "automation",
                    showHud: true
                });
            }
        }


        /*
         * MOBILE WORKSPACE NAVIGATION
         */
        const mobileMenuBtn = document.getElementById("mobileMenuBtn");
        const workflowSidebar = document.getElementById("workflowSidebar");

        mobileMenuBtn?.addEventListener("click", (e) => {
            e.stopPropagation();
            workflowSidebar?.classList.toggle("open");
        });

        document.addEventListener("click", (e) => {
            if (workflowSidebar?.classList.contains("open") && !workflowSidebar.contains(e.target) && !mobileMenuBtn?.contains(e.target)) {
                workflowSidebar.classList.remove("open");
            }
        });

        document.getElementById("sidebarProfile")?.addEventListener("click", (e) => {
            e.preventDefault();
            if (window.openNexusProfileModal) {
                window.openNexusProfileModal();
            } else {
                window.location.href = "../command-center/index.html#profile";
            }
        });

        document
            .querySelectorAll(".module-sidebar-nav a")
            .forEach(link => {
                link.addEventListener("click", event => {
                    workflowSidebar?.classList.remove("open");

                    const href = link.getAttribute("href");
                    if (href === "#" || link.id === "currentWorkflowNav") {
                        event.preventDefault();
                        return false;
                    }
                });
            });
        /*
         * NODE BUTTONS
         */

        document
            .querySelectorAll(
                "[data-node-type]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        addNode(
                            button.dataset.nodeType
                        );

                    }
                );

            });


        /*
         * TOP BUTTONS
         */

        document
            .getElementById("saveBtn")
            .addEventListener(
                "click",
                saveWorkflow
            );


        document
            .getElementById("runBtn")
            .addEventListener(
                "click",
                runWorkflow
            );


        /*
         * SIDEBAR ACTIONS
         */

        document
            .getElementById("connectBtn")
            .addEventListener(
                "click",
                connectSelected
            );


        document
            .getElementById("editBtn")
            .addEventListener(
                "click",
                () =>
                    openNodeEditor(
                        state.selectedNodeId
                    )
            );


        document
            .getElementById("deleteBtn")
            .addEventListener(
                "click",
                deleteSelected
            );


        document
            .getElementById("clearBtn")
            .addEventListener(
                "click",
                clearWorkflow
            );


        /*
         * OTHER BUTTONS
         */

        document
            .getElementById("emptyAddBtn")
            .addEventListener(
                "click",
                () =>
                    addNode("Trigger")
            );


        document
            .getElementById("sampleBtn")
            .addEventListener(
                "click",
                loadSampleWorkflow
            );


        document
            .getElementById("newBtn")
            .addEventListener(
                "click",
                newWorkflow
            );


        document
            .getElementById("renameBtn")
            .addEventListener(
                "click",
                renameWorkflow
            );


        /*
         * MODAL
         */

        document
            .getElementById("modalCloseBtn")
            .addEventListener(
                "click",
                closeModal
            );


        document
            .getElementById("modalCancelBtn")
            .addEventListener(
                "click",
                closeModal
            );


        document
            .getElementById("modalSaveBtn")
            .addEventListener(
                "click",
                saveModalChanges
            );


        /*
         * CANVAS
         */

        els.canvas.addEventListener(
            "click",
            event => {

                if (
                    event.target === els.canvas ||
                    event.target.classList.contains(
                        "grid-overlay"
                    )
                ) {

                    selectNode(null);

                }

            }
        );


        window.addEventListener(
            "resize",
            drawConnections
        );


        render();

        /* Restore the last Gemini result after the page initializes.
           This keeps the answer visible even if Live Server/browser
           reloads the document. */
        restoreWorkflowResult();

        /* Never allow the current Workflow Builder nav item to
           navigate/reload the same page. */
        document.getElementById("currentWorkflowNav")?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            return false;
        });

        /* Persist state immediately before any browser navigation/reload. */
        window.addEventListener("beforeunload", () => {
            persistWorkflowState();
        });

    }
);


/* ================= ADD NODE ================= */

function addNode(
    type,
    options = {}
) {

    if (!NODE_META[type]) {

        return false;

    }


    const id =
        options.id ||
        `node-${state.nextNodeId++}`;


    if (
        state.nodes.some(
            node =>
                node.id === id
        )
    ) {

        return false;

    }


    const node = {

        id,

        type,

        name:
            options.name ||
            type,

        description:
            options.description ||
            NODE_META[type].description,

        x:
            Number.isFinite(options.x)
                ? options.x
                : getNewNodeX(),

        y:
            Number.isFinite(options.y)
                ? options.y
                : getNewNodeY(),

        config:
            options.config ||
            {}

    };


    state.nodes.push(node);


    selectNode(id);


    render();


    showToast(
        `${type} node added`
    );


    return true;
}


/* ================= NODE POSITION ================= */

function getNewNodeX() {

    const index =
        state.nodes.length;

    return (
        70 +
        (index % 3) * 245
    );

}


function getNewNodeY() {

    const index =
        state.nodes.length;

    return (
        80 +
        Math.floor(index / 3) * 150
    );

}


/* ================= SELECT NODE ================= */

function selectNode(id) {

    state.selectedNodeId =
        id;

    renderNodeSelection();

    renderInspector();

}


/* ================= RENDER ================= */

function render() {

    if (!els.canvas) {

        return;

    }


    els.canvas
        .querySelectorAll(
            ".workflow-node"
        )
        .forEach(
            node =>
                node.remove()
        );


    state.nodes.forEach(
        node => {

            const element =
                document.createElement(
                    "article"
                );


            element.className =
                "workflow-node" +
                (
                    node.id ===
                    state.selectedNodeId
                        ? " selected"
                        : ""
                );


            element.dataset.nodeId =
                node.id;


            element.style.left =
                `${node.x}px`;


            element.style.top =
                `${node.y}px`;


            element.innerHTML = `

                <div class="node-actions">

                    <button
                        class="node-action"
                        data-action="edit"
                        title="Edit node"
                        type="button">
                        ✏
                    </button>

                    <button
                        class="node-action"
                        data-action="delete"
                        title="Delete node"
                        type="button">
                        ×
                    </button>

                </div>


                <div class="node-header">

                    <div class="node-icon">
                        ${NODE_META[node.type].icon}
                    </div>

                    <div>

                        <div class="node-type">
                            ${escapeHtml(node.type)}
                        </div>

                        <div class="node-name">
                            ${escapeHtml(node.name)}
                        </div>

                    </div>

                </div>


                <div class="node-body">
                    ${escapeHtml(node.description)}
                </div>

            `;


            element.addEventListener(
                "click",
                event => {
                    event.stopPropagation();
                    selectNode(
                        node.id
                    );
                }
            );

            // Node Drag & Drop Functionality
            let isDragging = false;
            let dragStartX = 0;
            let dragStartY = 0;
            let initialNodeX = 0;
            let initialNodeY = 0;
            let hasMoved = false;

            element.addEventListener("pointerdown", (e) => {
                if (e.target.closest(".node-action")) return;
                isDragging = true;
                hasMoved = false;
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                initialNodeX = node.x;
                initialNodeY = node.y;
                try {
                    element.setPointerCapture(e.pointerId);
                } catch (_) {}
                selectNode(node.id);
            });

            element.addEventListener("pointermove", (e) => {
                if (!isDragging) return;
                const dx = e.clientX - dragStartX;
                const dy = e.clientY - dragStartY;
                if (!hasMoved && Math.hypot(dx, dy) > 4) {
                    hasMoved = true;
                    element.classList.add("dragging");
                }
                if (!hasMoved) return;
                
                const newX = Math.max(10, Math.round(initialNodeX + dx));
                const newY = Math.max(10, Math.round(initialNodeY + dy));
                
                node.x = newX;
                node.y = newY;
                element.style.left = `${newX}px`;
                element.style.top = `${newY}px`;
                
                drawConnections();
            });

            const stopDrag = (e) => {
                if (!isDragging) return;
                isDragging = false;
                element.classList.remove("dragging");
                try {
                    element.releasePointerCapture(e.pointerId);
                } catch (_) {}
                if (hasMoved) {
                    drawConnections();
                    persistWorkflowState();
                }
            };

            element.addEventListener("pointerup", stopDrag);
            element.addEventListener("pointercancel", stopDrag);

            element
                .querySelector(
                    '[data-action="edit"]'
                )
                .addEventListener(
                    "click",
                    event => {
                        event.stopPropagation();
                        openNodeEditor(
                            node.id
                        );
                    }
                );

            element
                .querySelector(
                    '[data-action="delete"]'
                )
                .addEventListener(
                    "click",
                    event => {
                        event.stopPropagation();
                        deleteNode(
                            node.id
                        );
                    }
                );


            els.canvas.appendChild(
                element
            );

        }
    );


    els.emptyState.style.display =
        state.nodes.length
            ? "none"
            : "block";


    updateStatus();

    renderInspector();

    drawConnections();
    persistWorkflowState();

}


/* ================= NODE SELECTION UI ================= */

function renderNodeSelection() {

    document
        .querySelectorAll(
            ".workflow-node"
        )
        .forEach(
            element => {

                element.classList.toggle(
                    "selected",
                    element.dataset.nodeId ===
                    state.selectedNodeId
                );

            }
        );

}


/* ================= INSPECTOR ================= */

function renderInspector() {

    const node =
        getSelectedNode();


    els.selectionDot.classList.toggle(
        "active",
        Boolean(node)
    );


    if (!node) {

        els.inspectorContent.innerHTML = `

            <div class="inspector-empty">

                <div>🖱️</div>

                <p>
                    Select a node to view
                    and edit its settings.
                </p>

            </div>

        `;

        return;

    }


    const configText =
        node.config.value ||
        node.config.prompt ||
        node.config.url ||
        node.config.rule ||
        node.config.result ||
        "";


    els.inspectorContent.innerHTML = `

        <div class="field">

            <label>
                Node name
            </label>

            <input
                id="inspectorName"
                type="text"
                value="${escapeAttribute(node.name)}">

        </div>


        <div class="field">

            <label>
                Type
            </label>

            <input
                type="text"
                value="${escapeAttribute(node.type)}"
                disabled>

        </div>


        <div class="field">

            <label>
                Description
            </label>

            <textarea
                id="inspectorDescription">
${escapeHtml(node.description)}</textarea>

        </div>


        <div class="field">

            <label>
                Configuration
            </label>

            <textarea
                id="inspectorConfig"
                placeholder="Optional settings...">${escapeHtml(configText)}</textarea>

        </div>


        <div class="inspector-actions">

            <button
                class="btn btn-primary"
                id="applyInspectorBtn"
                type="button">
                Apply Changes
            </button>

            <button
                class="btn btn-secondary"
                id="inspectorEditBtn"
                type="button">
                Open Editor
            </button>

        </div>

    `;


    document
        .getElementById(
            "applyInspectorBtn"
        )
        .addEventListener(
            "click",
            applyInspectorChanges
        );


    document
        .getElementById(
            "inspectorEditBtn"
        )
        .addEventListener(
            "click",
            () =>
                openNodeEditor(
                    node.id
                )
        );

}


/* ================= APPLY INSPECTOR ================= */

function applyInspectorChanges() {

    const node =
        getSelectedNode();


    if (!node) {

        showToast(
            "Select a node first"
        );

        return false;

    }


    node.name =
        document
            .getElementById(
                "inspectorName"
            )
            .value
            .trim() ||
        node.type;


    node.description =
        document
            .getElementById(
                "inspectorDescription"
            )
            .value
            .trim() ||
        NODE_META[node.type].description;


    const value =
        document
            .getElementById(
                "inspectorConfig"
            )
            .value
            .trim();


    node.config =
        value
            ? { value }
            : {};


    render();


    showToast(
        "Node updated"
    );


    return true;
}


/* ================= EDIT MODAL ================= */

function openNodeEditor(nodeId) {

    const node =
        state.nodes.find(
            item =>
                item.id === nodeId
        );


    if (!node) {

        showToast(
            "Select a node first"
        );

        return false;

    }


    document
        .getElementById(
            "modalTitle"
        )
        .textContent =
        `Edit ${node.type}`;


    document
        .getElementById(
            "modalBody"
        )
        .innerHTML = `

            <div class="field">

                <label>
                    Name
                </label>

                <input
                    id="modalName"
                    type="text"
                    value="${escapeAttribute(node.name)}">

            </div>


            <div class="field">

                <label>
                    Description
                </label>

                <textarea
                    id="modalDescription">${escapeHtml(node.description)}</textarea>

            </div>


            <div class="field">

                <label>
                    Configuration
                </label>

                <textarea
                    id="modalConfig"
                    placeholder="Example: search customer database">${escapeHtml(
                        node.config.value ||
                        node.config.prompt ||
                        node.config.url ||
                        node.config.rule ||
                        node.config.result ||
                        ""
                    )}</textarea>

            </div>

        `;


    els.modalBackdrop.dataset.nodeId =
        nodeId;


    els.modalBackdrop.classList.remove(
        "hidden"
    );


    document
        .getElementById(
            "modalName"
        )
        .focus();


    return true;
}


/* ================= SAVE MODAL ================= */

function saveModalChanges() {

    const node =
        state.nodes.find(
            item =>
                item.id ===
                els.modalBackdrop.dataset.nodeId
        );


    if (!node) {

        return false;

    }


    node.name =
        document
            .getElementById(
                "modalName"
            )
            .value
            .trim() ||
        node.type;


    node.description =
        document
            .getElementById(
                "modalDescription"
            )
            .value
            .trim() ||
        NODE_META[node.type].description;


    const value =
        document
            .getElementById(
                "modalConfig"
            )
            .value
            .trim();


    node.config =
        value
            ? { value }
            : {};


    closeModal();

    render();

    showToast(
        "Changes saved"
    );


    return true;
}


/* ================= CLOSE MODAL ================= */

function closeModal() {

    els.modalBackdrop.classList.add(
        "hidden"
    );

    delete els.modalBackdrop.dataset.nodeId;

}


/* ================= DELETE ================= */

function deleteSelected() {

    if (!state.selectedNodeId) {

        showToast(
            "Select a node first"
        );

        return false;

    }


    return deleteNode(
        state.selectedNodeId
    );

}


function deleteNode(nodeId) {

    const index =
        state.nodes.findIndex(
            node =>
                node.id === nodeId
        );


    if (index === -1) {

        return false;

    }


    const nodeName =
        state.nodes[index].name;


    state.nodes.splice(
        index,
        1
    );


    state.connections =
        state.connections.filter(
            connection =>
                connection.from !== nodeId &&
                connection.to !== nodeId
        );


    state.selectedNodeId =
        null;


    state.pendingConnection =
        null;


    render();


    showToast(
        `${nodeName} deleted`
    );


    return true;

}


/* ================= CONNECT NODES ================= */

function connectSelected() {

    const selected =
        state.selectedNodeId;


    if (!selected) {

        showToast(
            "Select the first node, then select the second node"
        );

        return false;

    }


    if (!state.pendingConnection) {

        state.pendingConnection =
            selected;

        updateStatus();


        showToast(
            "First node selected. Now select the second node and click Connect Selected again."
        );


        return true;

    }


    const from =
        state.pendingConnection;


    const to =
        selected;


    state.pendingConnection =
        null;


    if (from === to) {

        showToast(
            "A node cannot connect to itself"
        );

        return false;

    }


    if (
        state.connections.some(
            connection =>
                connection.from === from &&
                connection.to === to
        )
    ) {

        showToast(
            "Those nodes are already connected"
        );

        return false;

    }


    state.connections.push({

        from,

        to

    });


    render();


    showToast(
        "Nodes connected"
    );


    return true;

}


/* ================= DRAW CONNECTIONS ================= */

function drawConnections() {

    if (!els.connectionsLayer) {

        return;

    }


    els.connectionsLayer.innerHTML =
        "";


    state.connections.forEach(
        connection => {

            const fromEl =
                els.canvas.querySelector(
                    `[data-node-id="${CSS.escape(connection.from)}"]`
                );


            const toEl =
                els.canvas.querySelector(
                    `[data-node-id="${CSS.escape(connection.to)}"]`
                );


            if (
                !fromEl ||
                !toEl
            ) {

                return;

            }


            const x1 =
                fromEl.offsetLeft +
                fromEl.offsetWidth;


            const y1 =
                fromEl.offsetTop +
                fromEl.offsetHeight / 2;


            const x2 =
                toEl.offsetLeft;


            const y2 =
                toEl.offsetTop +
                toEl.offsetHeight / 2;


            const curve =
                Math.max(
                    45,
                    Math.abs(x2 - x1) * .45
                );


            const path =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "path"
                );


            path.setAttribute(
                "d",
                `M ${x1} ${y1}
                 C ${x1 + curve} ${y1},
                   ${x2 - curve} ${y2},
                   ${x2} ${y2}`
            );


            els.connectionsLayer.appendChild(
                path
            );

        }
    );

}

/* =========================================================
   PERSIST LAST WORKFLOW RESULT
========================================================= */

function saveWorkflowResult(response, metadata = {}) {

    try {

        localStorage.setItem(
            "nexusWorkflowLastResult",
            JSON.stringify({

                workflowName:
                    state.workflowName,

                response:
                    String(response ?? ""),

                metadata: {
                    nodes:
                        metadata.nodes ?? state.nodes.length,
                    connections:
                        metadata.connections ?? state.connections.length,
                    duration:
                        metadata.duration ?? "—",
                    executionId:
                        metadata.executionId ?? "N/A"
                },

                completedAt:
                    new Date().toISOString()

            })
        );

    }

    catch (error) {

        console.warn(
            "[NEXUS AI] Could not save workflow result.",
            error
        );

    }

}


function restoreWorkflowResult() {

    try {

        const raw =
            localStorage.getItem(
                "nexusWorkflowLastResult"
            );

        if (!raw) {
            return false;
        }

        const saved = JSON.parse(raw);

        if (!saved || typeof saved.response !== "string" || !saved.response.trim()) {
            return false;
        }

        showWorkflowResult(
            saved.response,
            saved.metadata || {}
        );

        return true;

    } catch (error) {

        console.warn(
            "[NEXUS AI] Could not restore workflow result.",
            error
        );

        return false;
    }

}
/* ================= SAVE WORKFLOW ================= */

function saveWorkflow() {

    const payload = {

        name:
            state.workflowName,

        nodes:
            state.nodes,

        connections:
            state.connections,

        savedAt:
            new Date().toISOString()

    };


    localStorage.setItem(
        "nexusWorkflow",
        JSON.stringify(payload)
    );

    persistWorkflowState();


    showToast(
        "Workflow saved locally"
    );


    return true;

}


/* ================= RUN WORKFLOW ================= */
async function runWorkflow() {

    if (state.isRunning) {
        return false;
    }

    if (!state.nodes.length) {
        showToast(
            "Add at least one node before running"
        );
        return false;
    }

    const validation = validateWorkflow();

    if (!validation.valid) {
        showToast(
            validation.message
        );
        return false;
    }

    state.isRunning = true;

    const runButton =
        document.getElementById("runBtn");

    if (runButton) {
        runButton.disabled = true;
        runButton.textContent = "⏳ Running...";
    }

    const startedAt = performance.now();

    showToast(
        "Workflow started"
    );

    try {

        /*
         * Build a useful workflow goal from the
         * configured nodes.
         */

        const nodeDescriptions = state.nodes
            .map((node, index) => {

                const config =
                    node.config || {};

                const configValue =
                    config.value ||
                    config.prompt ||
                    config.url ||
                    config.rule ||
                    config.result ||
                    "";

                return [
                    `Step ${index + 1}: ${node.name}`,
                    `Type: ${node.type}`,
                    `Description: ${node.description}`,
                    configValue
                        ? `Configuration: ${configValue}`
                        : ""
                ]
                    .filter(Boolean)
                    .join("\n");

            })
            .join("\n\n");


        /*
         * Build connection description.
         */

        const nodeMap = {};

        state.nodes.forEach(node => {

            nodeMap[node.id] =
                node.name || node.type;

        });


        const connectionDescriptions =
            state.connections
                .map(connection => {

                    const from =
                        nodeMap[
                            connection.from
                        ] || connection.from;

                    const to =
                        nodeMap[
                            connection.to
                        ] || connection.to;

                    return `${from} → ${to}`;

                })
                .join("\n");


        /*
         * Create the workflow objective.
         *
         * This is sent to the backend and Gemini.
         */

        const goal = `
Execute the workflow "${state.workflowName}".

Workflow objective:
Process the configured workflow from the first node to the final output.

Workflow steps:

${nodeDescriptions}

Workflow connections:

${connectionDescriptions || "No explicit connections."}

Execute the workflow logically and provide the final useful result.
Do not claim external actions were actually performed unless they
were genuinely executed by the system.
`.trim();


        /*
         * Send workflow to FastAPI.
         */
        window.workflow3DCore?.setState("thinking");

        const response =
            await fetch(
                `http://127.0.0.1:8000/api/workflows/research-workflow/run`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        workflow_name:
                            state.workflowName,

                        goal,

                        nodes:
                            state.nodes,

                        connections:
                            state.connections

                    })
                }
            );


        /*
         * Handle HTTP errors.
         */

        if (!response.ok) {

            throw new Error(
                `Backend returned HTTP ${response.status}`
            );

        }


        const result =
            await response.json();


        /*
         * Handle backend execution failure.
         */

        if (!result.success) {

            throw new Error(
                result.error ||
                result.message ||
                "Workflow execution failed."
            );

        }


        const elapsed =
            Math.round(
                performance.now() -
                startedAt
            );


        /*
         * Get the actual Gemini response.
         */

        const aiResponse =
            result.response ||
            result.execution?.response ||
            result.message ||
            "Workflow completed without a response.";


        /*
         * Display the result.
         */

        showWorkflowResult(
            aiResponse,
            {
                duration:
                    result.duration_ms ||
                    elapsed,

                nodes:
                    result.nodes_processed ||
                    state.nodes.length,

                connections:
                    result.connections_processed ||
                    state.connections.length,

                executionId:
                    result.execution_id ||
                    result.execution?.execution_id ||
                    result.execution?.id ||
                    "N/A"
            }
        );


        saveWorkflowResult(
            aiResponse,
            {
                duration:
                    result.duration_ms ||
                    elapsed,

                nodes:
                    result.nodes_processed ||
                    state.nodes.length,

                connections:
                    result.connections_processed ||
                    state.connections.length,

                executionId:
                    result.execution_id ||
                    result.execution?.execution_id ||
                    result.execution?.id ||
                    "N/A"
            }
        );


        /*
         * Update UI.
         */

        state.isRunning = false;

        if (runButton) {
            runButton.disabled = false;
            runButton.textContent =
                "▶ Run Workflow";
        }


        showToast(
            "Workflow completed successfully"
        );


        return true;

    } catch (error) {

         console.error(
            "[NEXUS AI] Workflow execution error:",
            error
        );


        state.isRunning = false;

        if (runButton) {
            runButton.disabled = false;
            runButton.textContent =
                "▶ Run Workflow";
        }


        showToast(
            error.message ||
            "Workflow execution failed."
        );


        return false;
    }
}
/* =========================================================
   WORKFLOW RESULT DISPLAY
   IMPORTANT:
   Result is placed OUTSIDE the workflow canvas so
   rendering the result can never delete workflow nodes.
========================================================= */

/* =========================================================
   NEXUS AI WORKFLOW RESULT
========================================================= */

function showWorkflowResult(response, metadata = {}) {

    console.log(
        "[NEXUS AI] Gemini workflow response:",
        response
    );

    let panel =
        document.getElementById(
            "workflowExecutionResult"
        );


    /* Create the result panel only once */

    if (!panel) {

        panel =
            document.createElement("section");

        panel.id =
            "workflowExecutionResult";

        panel.className =
            "workflow-execution-result";


        const canvasPanel =
            document.querySelector(
                ".canvas-panel"
            );


        if (!canvasPanel) {

            console.error(
                "[NEXUS AI] .canvas-panel not found"
            );

            return;

        }


        /*
         * Put result AFTER the canvas.
         * Never put it inside #workflowCanvas.
         */

        canvasPanel.appendChild(
            panel
        );

    }


    /* Convert Gemini response safely */

    const answer =
        String(
            response ??
            "Gemini returned an empty response."
        );


    const workflowName =
        String(
            state.workflowName ||
            "NEXUS AI Workflow"
        );


    const nodes =
        metadata.nodes ??
        state.nodes.length;


    const connections =
        metadata.connections ??
        state.connections.length;


    const duration =
        metadata.duration ??
        "—";


    const executionId =
        String(
            metadata.executionId ||
            "N/A"
        );


    /*
     * Build HTML WITHOUT using escapeHtml().
     * This prevents a missing helper from
     * breaking the result display.
     */

    panel.innerHTML = `

        <div class="workflow-result-header">

            <div>

                <div
                    style="
                        color:#46dfff;
                        font-size:10px;
                        font-weight:800;
                        letter-spacing:.14em;
                        margin-bottom:6px;
                    "
                >
                    NEXUS AI EXECUTION
                </div>

                <h2>
                    Workflow Completed
                </h2>

            </div>

            <div style="display:flex;align-items:center;gap:10px;">
                <span class="workflow-result-status">
                    ● COMPLETED
                </span>
                <button
                    type="button"
                    class="icon-btn"
                    id="closeWorkflowResultBtn"
                    title="Close Report"
                    style="border:1px solid rgba(255,255,255,.1);border-radius:8px;background:rgba(255,255,255,.05);color:var(--muted);width:32px;height:32px;display:inline-grid;place-items:center;cursor:pointer;font-size:14px;"
                >
                    ✕
                </button>
            </div>

        </div>


        <div class="workflow-result-metrics">

            <div>

                <strong>
                    ${nodes}
                </strong>

                <span>
                    Nodes
                </span>

            </div>


            <div>

                <strong>
                    ${connections}
                </strong>

                <span>
                    Connections
                </span>

            </div>


            <div>

                <strong>
                    ${duration}
                    ${
                        typeof duration === "number"
                            ? " ms"
                            : ""
                    }
                </strong>

                <span>
                    Duration
                </span>

            </div>

        </div>


        <div
            class="workflow-result-body"
            id="workflowGeminiAnswer"
        ></div>


        <div class="workflow-result-footer">

            <small>
                ${workflowName}
                · Gemini AI
                · Execution ID:
                ${executionId}
            </small>


            <div style="display:flex;gap:8px;">
                <button
                    type="button"
                    class="btn btn-secondary"
                    id="speakWorkflowResultBtn"
                >
                    🔊 Speak Report
                </button>

                <button
                    type="button"
                    class="btn btn-secondary"
                    id="copyWorkflowResultBtn"
                >
                    📋 Copy Result
                </button>
            </div>

        </div>

    `;


    /*
     * Put the Gemini answer using textContent.
     *
     * This is safer than inserting Gemini text
     * directly into HTML.
     */

    const answerElement =
        document.getElementById(
            "workflowGeminiAnswer"
        );


    if (answerElement) {

        answerElement.textContent =
            answer;

    }


    /*
     * Close button
     */
    const closeBtn = document.getElementById("closeWorkflowResultBtn");
    if (closeBtn) {
        closeBtn.onclick = () => {
            panel.remove();
        };
    }

    /*
     * Speak button
     */
    const speakButton = document.getElementById("speakWorkflowResultBtn");
    if (speakButton) {
        speakButton.onclick = function () {
            if (window.nexusVoice) {
                if (window.nexusVoice.isSpeaking) {
                    window.nexusVoice.stop();
                    speakButton.innerHTML = "🔊 Speak Report";
                    speakButton.classList.remove("active");
                } else {
                    window.nexusVoice.setEnabled(true);
                    speakButton.innerHTML = "⏹ Stop Voice";
                    speakButton.classList.add("active");
                    window.nexusVoice.speak(answer);
                    const poll = setInterval(() => {
                        if (!window.nexusVoice.isSpeaking) {
                            speakButton.innerHTML = "🔊 Speak Report";
                            speakButton.classList.remove("active");
                            clearInterval(poll);
                        }
                    }, 250);
                }
            }
        };
    }

    /*
     * Copy button
     */

    const copyButton =
        document.getElementById(
            "copyWorkflowResultBtn"
        );


    if (copyButton) {

        copyButton.onclick =
            async function () {

                try {

                    await navigator.clipboard.writeText(
                        answer
                    );

                    showToast(
                        "Copied",
                        "Gemini workflow result copied."
                    );

                } catch (error) {

                    console.error(
                        "[NEXUS AI] Copy failed:",
                        error
                    );

                    showToast(
                        "Copy failed"
                    );

                }

            };

    }


    /*
     * DO NOT call render().
     * DO NOT modify state.nodes.
     * DO NOT modify state.connections.
     */


    console.log(
        "[NEXUS AI] Workflow result displayed successfully."
    );

    /* Keep the result visible without changing the page URL. */
    panel.hidden = false;

    try {
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (_) {}

    return panel;

}
function validateWorkflow() {

    if (!state.nodes.length) {

        return {

            valid: false,

            message:
                "Workflow is empty"

        };

    }


    if (
        state.nodes.length > 1 &&
        state.connections.length === 0
    ) {

        return {

            valid: false,

            message:
                "Connect your nodes before running"

        };

    }


    const nodeIds =
        new Set(
            state.nodes.map(
                node =>
                    node.id
            )
        );


    const validConnections =
        state.connections.every(
            connection =>
                nodeIds.has(
                    connection.from
                ) &&
                nodeIds.has(
                    connection.to
                )
        );


    if (!validConnections) {

        return {

            valid: false,

            message:
                "Workflow contains an invalid connection"

        };

    }


    return {

        valid: true,

        message:
            "Workflow is valid"

    };

}


/* ================= CLEAR ================= */

function clearWorkflow() {

    state.nodes = [];

    state.connections = [];

    state.selectedNodeId =
        null;

    state.pendingConnection =
        null;


    localStorage.removeItem("nexusWorkflowLastResult");

    document
        .getElementById("workflowExecutionResult")
        ?.remove();


    render();


    showToast(
        "Workflow cleared"
    );


    return true;

}


/* ================= NEW WORKFLOW ================= */

function newWorkflow() {

    clearWorkflow();


    state.workflowName =
        "New AI Workflow";


    els.title.textContent =
        state.workflowName;


    localStorage.removeItem("nexusWorkflowLastResult");

    updateStatus();
    persistWorkflowState();


    showToast(
        "New workflow created"
    );


    return true;

}


/* ================= SAMPLE WORKFLOW ================= */

function loadSampleWorkflow() {

    clearWorkflow();


    state.workflowName =
        "Customer Support Workflow";


    els.title.textContent =
        state.workflowName;


    localStorage.removeItem("nexusWorkflowLastResult");
    document
        .getElementById("workflowExecutionResult")
        ?.remove();


    addNode(
        "Trigger",
        {
            name:
                "New Customer Request",

            x: 70,

            y: 100
        }
    );


    addNode(
        "AI Agent",
        {
            name:
                "Support Agent",

            x: 330,

            y: 100
        }
    );


    addNode(
        "Condition",
        {
            name:
                "Needs Escalation?",

            x: 590,

            y: 100
        }
    );


    addNode(
        "Tool",
        {
            name:
                "Create Ticket",

            x: 850,

            y: 40
        }
    );


    addNode(
        "Output",
        {
            name:
                "Send Response",

            x: 850,

            y: 190
        }
    );


    state.connections = [

        {
            from:
                state.nodes[0].id,

            to:
                state.nodes[1].id
        },

        {
            from:
                state.nodes[1].id,

            to:
                state.nodes[2].id
        },

        {
            from:
                state.nodes[2].id,

            to:
                state.nodes[3].id
        },

        {
            from:
                state.nodes[2].id,

            to:
                state.nodes[4].id
        }

    ];


    selectNode(
        state.nodes[0].id
    );


    render();
    persistWorkflowState();
    showToast(
        "Sample workflow loaded"
    );


    return true;

}


/* ================= RENAME ================= */

function renameWorkflow() {

    const name =
        window.prompt(
            "Enter workflow name:",
            state.workflowName
        );


    if (name === null) {

        return false;

    }


    const trimmed =
        name.trim();


    if (!trimmed) {

        showToast(
            "Workflow name cannot be empty"
        );

        return false;

    }


    state.workflowName =
        trimmed;


    els.title.textContent =
        trimmed;


    persistWorkflowState();


    showToast(
        "Workflow renamed"
    );


    return true;

}


/* ================= STATUS ================= */

function updateStatus() {

    if (!els.status) {

        return;

    }


    const pending =
        state.pendingConnection
            ? " · Select another node"
            : "";


    els.status.textContent =

        `${state.nodes.length}
        node${state.nodes.length === 1 ? "" : "s"}
        ·
        ${state.connections.length}
        connection${state.connections.length === 1 ? "" : "s"}
        ${pending}`;

}


/* ================= GET SELECTED NODE ================= */

function getSelectedNode() {

    return state.nodes.find(
        node =>
            node.id ===
            state.selectedNodeId
    ) || null;

}


/* ================= TOAST ================= */

function showToast(message) {

    if (!els.toast) {

        return;

    }


    els.toast.textContent =
        message;


    els.toast.classList.add(
        "show"
    );


    clearTimeout(
        showToast.timer
    );


    showToast.timer =
        setTimeout(
            () =>
                els.toast.classList.remove(
                    "show"
                ),
            2200
        );

}


/* ================= SECURITY HELPERS ================= */

function escapeHtml(value) {

    return String(
        value ?? ""
    ).replace(
        /[&<>'"]/g,
        character =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "'": "&#39;",
                '"': "&quot;"
            }[character])
    );

}


function escapeAttribute(value) {

    return escapeHtml(value);

}


/* ================= PUBLIC FUNCTIONS ================= */

window.addNode =
    addNode;

window.saveWorkflow =
    saveWorkflow;

window.runWorkflow =
    runWorkflow;

window.clearWorkflow =
    clearWorkflow;

window.deleteNode =
    deleteNode;

window.loadSampleWorkflow =
    loadSampleWorkflow;

window.newWorkflow =
    newWorkflow;

window.connectSelected =
    connectSelected;

window.openNodeEditor =
    openNodeEditor;