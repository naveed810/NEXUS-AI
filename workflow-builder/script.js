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


    showToast(
        "Workflow saved locally"
    );


    return true;

}


/* ================= RUN WORKFLOW ================= */

function runWorkflow() {

    if (state.isRunning) {

        return false;

    }


    if (!state.nodes.length) {

        showToast(
            "Add at least one node before running"
        );

        return false;

    }


    const validation =
        validateWorkflow();


    if (!validation.valid) {

        showToast(
            validation.message
        );

        return false;

    }


    state.isRunning =
        true;


    const runButton =
        document.getElementById(
            "runBtn"
        );


    runButton.disabled =
        true;


    runButton.textContent =
        "⏳ Running...";


    setTimeout(
        () => {

            state.isRunning =
                false;


            runButton.disabled =
                false;


            runButton.textContent =
                "▶ Run Workflow";


            showToast(
                `Workflow completed · ${state.nodes.length} nodes processed`
            );

        },
        700
    );


    return true;

}


/* ================= VALIDATION ================= */

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


    updateStatus();


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