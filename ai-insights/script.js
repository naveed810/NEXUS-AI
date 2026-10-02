(() => {
  "use strict";

  const STORAGE_KEY = "nexus-ai-insights-state-v1";
  const THEME_KEY = "nexus-ai-insights-theme";

  const seedAgents = [
    {
      id: "research",
      name: "Research Agent",
      status: "active",
      runs: 186,
      success: 178,
      avg: 18,
      specialty: "Research & synthesis"
    },
    {
      id: "data",
      name: "Data Analyst",
      status: "active",
      runs: 154,
      success: 149,
      avg: 24,
      specialty: "Data analysis & reporting"
    },
    {
      id: "content",
      name: "Content Agent",
      status: "idle",
      runs: 128,
      success: 119,
      avg: 15,
      specialty: "Content generation"
    },
    {
      id: "monitor",
      name: "Monitor Agent",
      status: "active",
      runs: 212,
      success: 207,
      avg: 9,
      specialty: "System monitoring"
    },
    {
      id: "planner",
      name: "Task Planner",
      status: "paused",
      runs: 96,
      success: 88,
      avg: 21,
      specialty: "Task planning & routing"
    },
    {
      id: "support",
      name: "Support Agent",
      status: "idle",
      runs: 117,
      success: 111,
      avg: 13,
      specialty: "Support automation"
    }
  ];


  const seedActivity = [
    {
      agent: "Monitor Agent",
      type: "success",
      message: "Health check workflow completed",
      time: "Just now",
      duration: 8
    },
    {
      agent: "Research Agent",
      type: "success",
      message: "Research summary generated",
      time: "2 min ago",
      duration: 17
    },
    {
      agent: "Data Analyst",
      type: "running",
      message: "Quarterly metrics analysis running",
      time: "5 min ago",
      duration: 28
    },
    {
      agent: "Content Agent",
      type: "failed",
      message: "Draft generation timed out",
      time: "11 min ago",
      duration: 42
    },
    {
      agent: "Support Agent",
      type: "success",
      message: "Support queue classified",
      time: "18 min ago",
      duration: 12
    },
    {
      agent: "Task Planner",
      type: "success",
      message: "Workflow plan prepared",
      time: "27 min ago",
      duration: 20
    }
  ];


  const $ = (id) => document.getElementById(id);
  function syncNexusProfile() {
    try {
      const raw = localStorage.getItem("nexus_ai_command_center_v4");
      const state = raw ? JSON.parse(raw) : {};
      const name = state?.user?.name || "NEXUS User";
      const email = state?.user?.email || "user@example.com";
      const avatar = name.trim().charAt(0).toUpperCase() || "N";
      $("profileName")?.replaceChildren(document.createTextNode(name));
      $("profileEmail")?.replaceChildren(document.createTextNode(email));
      $("profileAvatar")?.replaceChildren(document.createTextNode(avatar));
    } catch (_) {}
  }



  const clone = (value) =>
    JSON.parse(JSON.stringify(value));


  const state = loadState();


  function loadState() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "null"
      );

      if (!saved) {
        return {
          agents: clone(seedAgents),
          activity: clone(seedActivity)
        };
      }

      return {
        agents:
          Array.isArray(saved.agents) && saved.agents.length
            ? saved.agents
            : clone(seedAgents),

        activity:
          Array.isArray(saved.activity)
            ? saved.activity
            : clone(seedActivity)
      };

    } catch (error) {
      console.warn("Could not load saved AI Insights state.", error);

      return {
        agents: clone(seedAgents),
        activity: clone(seedActivity)
      };
    }
  }


  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );
    } catch (error) {
      console.warn("Could not save AI Insights state.", error);
    }
  }


  function escapeHtml(value) {
    return String(value).replace(
      /[&<>'"]/g,
      (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      })[character]
    );
  }


  function clamp(value, min, max) {
    return Math.min(
      max,
      Math.max(min, value)
    );
  }


  function periodFactor() {
    const select = $("rangeSelect");

    if (!select) {
      return 1;
    }

    const days = Number(select.value);

    return days / 30;
  }


  function totals() {
    const factor = periodFactor();

    const runs = Math.round(
      state.agents.reduce(
        (sum, agent) => sum + agent.runs,
        0
      ) * factor
    );


    const success = Math.round(
      state.agents.reduce(
        (sum, agent) => sum + agent.success,
        0
      ) * factor
    );


    const failed = Math.max(
      0,
      runs - success
    );


    const avg = state.agents.length
      ? Math.round(
          state.agents.reduce(
            (sum, agent) => sum + agent.avg,
            0
          ) / state.agents.length
        )
      : 0;


    const active = state.agents.filter(
      (agent) => agent.status === "active"
    ).length;


    const successRate = runs
      ? (success / runs) * 100
      : 0;


    return {
      runs,
      success,
      failed,
      avg,
      active,
      successRate
    };
  }


  function renderKpis() {
    const total = totals();

    $("totalRuns").textContent =
      total.runs.toLocaleString();


    $("successRate").textContent =
      `${total.successRate.toFixed(1)}%`;


    $("activeAgents").textContent =
      total.active;


    $("avgRuntime").textContent =
      `${total.avg}s`;


    $("runsTrend").textContent =
      "+8.4%";


    $("successTrend").textContent =
      total.successRate >= 90
        ? "+2.1%"
        : "-1.3%";


    $("successTrend").className =
      `trend ${
        total.successRate >= 90
          ? "positive"
          : "negative"
      }`;


    $("agentTrend").textContent =
      `${total.active}`;


    $("runtimeTrend").textContent =
      "-4.8%";


    $("runtimeTrend").className =
      "trend positive";


    $("successfulRuns").textContent =
      total.success.toLocaleString();


    $("failedRuns").textContent =
      total.failed.toLocaleString();


    $("otherRuns").textContent =
      "0";


    $("donutValue").textContent =
      `${Math.round(total.successRate)}%`;


    const successDegrees =
      total.successRate * 3.6;


    const failedDegrees =
      (100 - total.successRate) * 3.6;


    $("donutChart").style.background =
      `conic-gradient(
        var(--success) 0deg ${successDegrees}deg,
        var(--danger) ${successDegrees}deg ${successDegrees + failedDegrees}deg,
        var(--warning) ${successDegrees + failedDegrees}deg 360deg
      )`;
  }


  function buildChartData(days) {
    const points = Math.min(
      days,
      14
    );


    const base = Math.max(
      5,
      Math.round(
        state.agents.reduce(
          (sum, agent) => sum + agent.runs,
          0
        ) / 30
      )
    );


    return Array.from(
      { length: points },
      (_, index) => {

        const wave =
          Math.sin(index * 1.13) *
          base *
          0.18;


        const growth =
          index *
          base *
          0.012;


        const runs =
          Math.max(
            2,
            Math.round(
              base +
              wave +
              growth
            )
          );


        const success =
          Math.max(
            1,
            Math.round(
              runs *
              (
                0.91 +
                Math.sin(index * 0.8) *
                0.025
              )
            )
          );


        return {
          label: `${index + 1}`,
          runs,
          success
        };
      }
    );
  }


  function renderRunsChart() {
    const host = $("runsChart");

    const days =
      Number($("rangeSelect").value);


    const data =
      buildChartData(days);


    const width = 760;

    const height = 225;

    const padding = {
      left: 12,
      right: 12,
      top: 10,
      bottom: 25
    };


    const max = Math.max(
      ...data.map(
        (item) => item.runs
      ),
      1
    );


    const x = (index) =>
      padding.left +
      (
        index *
        (
          width -
          padding.left -
          padding.right
        )
      ) /
      Math.max(
        1,
        data.length - 1
      );


    const y = (value) =>
      padding.top +
      (
        height -
        padding.top -
        padding.bottom
      ) *
      (
        1 -
        value / max
      );


    const linePath = (key) =>
      data
        .map(
          (item, index) =>
            `${
              index ? "L" : "M"
            } ${x(index).toFixed(1)} ${y(
              item[key]
            ).toFixed(1)}`
        )
        .join(" ");


    const areaPath =
      `${linePath("runs")}
       L ${x(data.length - 1).toFixed(1)} ${
         height - padding.bottom
       }
       L ${x(0).toFixed(1)} ${
         height - padding.bottom
       }
       Z`;


    const grid = [0, 0.25, 0.5, 0.75, 1]
      .map(
        (value) =>
          `<line
            class="chart-grid-line"
            x1="${padding.left}"
            y1="${y(max * value)}"
            x2="${width - padding.right}"
            y2="${y(max * value)}"
          />`
      )
      .join("");


    const labels = data
      .map(
        (item, index) =>
          index %
            Math.max(
              1,
              Math.ceil(data.length / 7)
            ) ===
          0
            ? `<text
                class="chart-axis-label"
                x="${x(index)}"
                y="${height - 5}"
                text-anchor="middle"
              >
                ${index + 1}
              </text>`
            : ""
      )
      .join("");


    const points = data
      .map(
        (item, index) =>
          `<circle
            class="chart-point"
            cx="${x(index)}"
            cy="${y(item.runs)}"
            r="3"
          />`
      )
      .join("");


    host.innerHTML = `
      <svg
        class="chart-svg"
        viewBox="0 0 ${width} ${height}"
        role="img"
        aria-label="Runs over time"
      >

        <defs>

          <linearGradient
            id="areaGradient"
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >

            <stop
              offset="0%"
              stop-color="var(--accent)"
            />

            <stop
              offset="100%"
              stop-color="var(--accent)"
              stop-opacity="0"
            />

          </linearGradient>

        </defs>

        ${grid}

        <path
          class="chart-area"
          d="${areaPath}"
        />

        <path
          class="chart-line"
          d="${linePath("runs")}"
        />

        <path
          class="chart-line success-line"
          d="${linePath("success")}"
        />

        ${points}

        ${labels}

      </svg>
    `;
  }


  function renderRuntimeChart() {
    const host = $("runtimeChart");


    const data = [...state.agents]
      .sort(
        (a, b) =>
          b.avg - a.avg
      );


    const max = Math.max(
      ...data.map(
        (agent) => agent.avg
      ),
      1
    );


    host.innerHTML = data
      .map((agent) => {

        const percentage =
          clamp(
            (agent.avg / max) * 100,
            3,
            100
          );


        return `
          <div
            class="bar-group"
            title="${escapeHtml(agent.name)}: ${agent.avg}s"
          >

            <div
              class="bar"
              style="height:${percentage}%"
            >

              <span class="bar-value">
                ${agent.avg}s
              </span>

            </div>

            <span class="bar-label">
              ${escapeHtml(
                agent.name.replace(
                  " Agent",
                  ""
                )
              )}
            </span>

          </div>
        `;
      })
      .join("");
  }


  function reliability(agent) {
    return agent.runs
      ? (agent.success / agent.runs) * 100
      : 0;
  }


  function renderTable() {
    const query =
      $("agentSearch").value
        .trim()
        .toLowerCase();


    const filter =
      $("statusFilter").value;


    const filtered =
      state.agents.filter(
        (agent) => {

          const matchesQuery =
            !query ||
            agent.name
              .toLowerCase()
              .includes(query) ||
            agent.specialty
              .toLowerCase()
              .includes(query);


          const matchesStatus =
            filter === "all" ||
            agent.status === filter;


          return (
            matchesQuery &&
            matchesStatus
          );
        }
      );


    $("emptyTable")
      .classList.toggle(
        "hidden",
        filtered.length !== 0
      );


    $("agentTableBody").innerHTML =
      filtered
        .map((agent) => {

          const rate =
            reliability(agent);


          const initials =
            agent.name
              .split(" ")
              .map(
                (word) => word[0]
              )
              .join("")
              .slice(0, 2);


          return `
            <tr>

              <td>

                <div class="agent-cell">

                  <span class="agent-avatar">
                    ${escapeHtml(initials)}
                  </span>

                  <span>
                    ${escapeHtml(
                      agent.name
                    )}
                  </span>

                </div>

              </td>


              <td>

                <span
                  class="status-pill ${escapeHtml(
                    agent.status
                  )}"
                >
                  ${escapeHtml(
                    agent.status
                  )}
                </span>

              </td>


              <td>
                ${agent.runs}
              </td>


              <td>
                ${agent.success}
              </td>


              <td>
                ${agent.avg}s
              </td>


              <td>

                <div class="reliability">

                  <span>
                    ${rate.toFixed(1)}%
                  </span>

                  <span class="progress">
                    <span
                      style="width:${rate}%"
                    ></span>
                  </span>

                </div>

              </td>


              <td>

                <button
                  class="row-button details-btn"
                  data-id="${escapeHtml(agent.id)}"
                  type="button"
                >
                  Details →
                </button>

              </td>

            </tr>
          `;
        })
        .join("");
  }


  function renderInsights() {
    const sorted =
      [...state.agents].sort(
        (a, b) =>
          reliability(b) -
          reliability(a)
      );


    const fastest =
      [...state.agents].sort(
        (a, b) =>
          a.avg - b.avg
      )[0];


    const slowest =
      [...state.agents].sort(
        (a, b) =>
          b.avg - a.avg
      )[0];


    const total =
      totals();


    if (
      !sorted.length ||
      !fastest ||
      !slowest
    ) {
      $("insightsList").innerHTML = `
        <article class="insight-item">
          <div class="insight-icon">!</div>

          <div>
            <strong>
              No telemetry available
            </strong>

            <p>
              Add agent execution data to generate insights.
            </p>
          </div>
        </article>
      `;

      return;
    }


    const items = [

      {
        icon: "↗",

        title:
          "Reliability is stable",

        text:
          `${total.successRate.toFixed(
            1
          )}% of tracked executions completed successfully in the selected period.`
      },


      {
        icon: "⚡",

        title:
          `${fastest.name} is the fastest`,

        text:
          `Average runtime is ${fastest.avg}s, making it the quickest execution path in the current agent set.`
      },


      {
        icon: "◌",

        title:
          `${slowest.name} needs runtime attention`,

        text:
          `Average runtime is ${slowest.avg}s. Review its workflow steps if latency becomes a priority.`
      },


      {
        icon: "✦",

        title:
          `${sorted[0].name} has highest reliability`,

        text:
          `Its current success ratio is ${reliability(
            sorted[0]
          ).toFixed(
            1
          )}% across ${sorted[0].runs} tracked runs.`
      }

    ];


    $("insightsList").innerHTML =
      items
        .map(
          (item) =>
            `
              <article class="insight-item">

                <div class="insight-icon">
                  ${item.icon}
                </div>

                <div>

                  <strong>
                    ${escapeHtml(
                      item.title
                    )}
                  </strong>

                  <p>
                    ${escapeHtml(
                      item.text
                    )}
                  </p>

                </div>

              </article>
            `
        )
        .join("");
  }


  function renderActivity() {
    const list =
      $("activityList");


    if (!state.activity.length) {

      list.innerHTML = `
        <div class="empty-state">
          No recent activity to display.
        </div>
      `;

      return;
    }


    list.innerHTML =
      state.activity
        .slice(0, 8)
        .map((item) => {

          const icon =
            item.type === "success"
              ? "✓"
              : item.type === "failed"
                ? "!"
                : "•";


          return `
            <div class="activity-item">

              <div
                class="activity-icon ${escapeHtml(
                  item.type
                )}"
              >
                ${icon}
              </div>


              <div class="activity-main">

                <strong>
                  ${escapeHtml(
                    item.agent
                  )}
                </strong>

                <span>
                  ${escapeHtml(
                    item.message
                  )}
                  ·
                  ${item.duration}s
                </span>

              </div>


              <span class="activity-time">
                ${escapeHtml(
                  item.time
                )}
              </span>

            </div>
          `;
        })
        .join("");
  }


  function renderAll() {
    renderKpis();

    renderRunsChart();

    renderRuntimeChart();

    renderTable();

    renderInsights();

    renderActivity();
  }


  function showToast(
    message,
    type = "success"
  ) {
    const toast =
      document.createElement(
        "div"
      );


    toast.className =
      `toast ${type}`;


    toast.textContent =
      message;


    $("toastRegion")
      .appendChild(toast);


    window.setTimeout(
      () => toast.remove(),
      2800
    );
  }


  function updateTimestamp() {
    $("lastUpdated").textContent =
      `Updated ${new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      )}`;
  }


  function refresh() {

    state.agents.forEach(
      (agent) => {

        const delta =
          Math.random() > 0.45
            ? 1
            : 0;


        agent.runs += delta;


        if (
          delta &&
          Math.random() > 0.08
        ) {
          agent.success += 1;
        }


        agent.avg =
          clamp(
            Math.round(
              agent.avg +
              (Math.random() - 0.5) *
                2
            ),
            6,
            45
          );
      }
    );


    if (state.agents.length) {

      const sample =
        state.agents[
          Math.floor(
            Math.random() *
              state.agents.length
          )
        ];


      state.activity.unshift({
        agent: sample.name,

        type: "success",

        message:
          "Insight telemetry refreshed",

        time: "Just now",

        duration: sample.avg
      });

    }


    state.activity =
      state.activity.slice(
        0,
        8
      );


    saveState();

    renderAll();

    updateTimestamp();

    showToast(
      "AI Insights refreshed successfully."
    );
  }


  function exportCsv() {

    const rows = [
      [
        "Agent",
        "Status",
        "Runs",
        "Successful",
        "Avg Runtime (s)",
        "Reliability (%)"
      ]
    ];


    state.agents.forEach(
      (agent) => {

        rows.push([
          agent.name,
          agent.status,
          agent.runs,
          agent.success,
          agent.avg,
          reliability(
            agent
          ).toFixed(1)
        ]);

      }
    );


    const csv =
      rows
        .map(
          (row) =>
            row
              .map(
                (value) =>
                  `"${String(
                    value
                  ).replace(
                    /"/g,
                    '""'
                  )}"`
              )
              .join(",")
        )
        .join("\n");


    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;"
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


    link.href = url;

    link.download =
      "nexus-ai-insights.csv";


    document.body.appendChild(
      link
    );


    link.click();

    link.remove();


    URL.revokeObjectURL(
      url
    );


    showToast(
      "CSV export created."
    );
  }


  function openDetails(id) {

    const agent =
      state.agents.find(
        (item) =>
          item.id === id
      );


    if (!agent) {
      return;
    }


    const rate =
      reliability(agent);


    $("dialogAgentName")
      .textContent =
      agent.name;


    $("dialogContent").innerHTML = `

      <div class="dialog-grid">

        <div class="detail-card">
          <span>Status</span>
          <strong>
            ${escapeHtml(
              agent.status
            )}
          </strong>
        </div>


        <div class="detail-card">
          <span>Specialty</span>
          <strong>
            ${escapeHtml(
              agent.specialty
            )}
          </strong>
        </div>


        <div class="detail-card">
          <span>Total runs</span>
          <strong>
            ${agent.runs}
          </strong>
        </div>


        <div class="detail-card">
          <span>Successful runs</span>
          <strong>
            ${agent.success}
          </strong>
        </div>


        <div class="detail-card">
          <span>Average runtime</span>
          <strong>
            ${agent.avg}s
          </strong>
        </div>


        <div class="detail-card">
          <span>Reliability</span>
          <strong>
            ${rate.toFixed(1)}%
          </strong>
        </div>

      </div>


      <div class="detail-note">

        This view is driven by the current
        NEXUS AI Insights telemetry model.
        When the project backend is connected,
        these metrics can be populated directly
        from execution records without changing
        the dashboard UI.

      </div>
    `;


    const dialog =
      $("agentDialog");


    if (
      typeof dialog.showModal ===
      "function"
    ) {
      dialog.showModal();
    } else {
      dialog.setAttribute(
        "open",
        ""
      );
    }
  }


  function closeDialog() {
    const dialog =
      $("agentDialog");


    if (
      typeof dialog.close ===
      "function"
    ) {
      dialog.close();
    } else {
      dialog.removeAttribute(
        "open"
      );
    }
  }


  function resetData() {

    state.agents =
      clone(seedAgents);


    state.activity =
      clone(seedActivity);


    saveState();

    renderAll();

    updateTimestamp();

    showToast(
      "Demo telemetry reset."
    );
  }


  function toggleTheme() {

    document.body.classList.toggle(
      "light"
    );


    const light =
      document.body.classList.contains(
        "light"
      );


    localStorage.setItem(
      THEME_KEY,
      light
        ? "light"
        : "dark"
    );


    $("themeBtn").textContent =
      light
        ? "☀"
        : "☾";


    $("themeBtn").setAttribute(
      "aria-label",
      light
        ? "Switch to dark theme"
        : "Switch to light theme"
    );
  }


  function loadTheme() {

    const theme =
      localStorage.getItem(
        THEME_KEY
      );


    if (theme === "light") {
      document.body.classList.add(
        "light"
      );
    }


    $("themeBtn").textContent =
      document.body.classList.contains(
        "light"
      )
        ? "☀"
        : "☾";
  }


  function bindEvents() {

    $("rangeSelect")
      .addEventListener(
        "change",
        () => {

          renderAll();

          updateTimestamp();

          showToast(
            `Showing the last ${
              $("rangeSelect").value
            } days.`
          );
        }
      );


    $("refreshBtn")
      .addEventListener(
        "click",
        refresh
      );


    $("generateInsightsBtn")
      .addEventListener(
        "click",
        () => {

          renderInsights();

          showToast(
            "New AI insights generated from current telemetry."
          );
        }
      );


    $("agentSearch")
      .addEventListener(
        "input",
        renderTable
      );


    $("statusFilter")
      .addEventListener(
        "change",
        renderTable
      );


    $("exportBtn")
      .addEventListener(
        "click",
        exportCsv
      );


    $("resetDataBtn")
      .addEventListener(
        "click",
        resetData
      );


    $("clearActivityBtn")
      .addEventListener(
        "click",
        () => {

          state.activity = [];

          saveState();

          renderActivity();

          updateTimestamp();

          showToast(
            "Activity view cleared."
          );
        }
      );


    $("themeBtn")
      .addEventListener(
        "click",
        toggleTheme
      );


    $("closeDialogBtn")
      .addEventListener(
        "click",
        closeDialog
      );


    $("agentDialog")
      .addEventListener(
        "click",
        (event) => {

          if (
            event.target ===
            $("agentDialog")
          ) {
            closeDialog();
          }

        }
      );


    $("agentTableBody")
      .addEventListener(
        "click",
        (event) => {

          const button =
            event.target.closest(
              ".details-btn"
            );


          if (button) {
            openDetails(
              button.dataset.id
            );
          }

        }
      );


    $("profileButton")?.addEventListener("click", () => {
      window.location.href = "../command-center/index.html#profile";
    });

    $("menuBtn")
      .addEventListener(
        "click",
        () => {

          $("sidebar")
            .classList.toggle(
              "open"
            );

        }
      );


    document
      .querySelectorAll(
        ".nav-item"
      )
      .forEach(
        (item) => {

          item.addEventListener(
            "click",
            () => {

              $("sidebar")
                .classList.remove(
                  "open"
                );

            }
          );

        }
      );
  }


  syncNexusProfile();
  loadTheme();

  bindEvents();

  renderAll();

  updateTimestamp();

})();