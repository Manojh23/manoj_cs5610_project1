const currentYearElements = document.querySelectorAll(".current-year");
const currentFile = window.location.pathname.split("/").pop() || "index.html";
const navigationLinks = document.querySelectorAll(".nav-link");

currentYearElements.forEach((el) => {
  el.textContent = new Date().getFullYear().toString();
});

navigationLinks.forEach((link) => {
  const linkFile = link.getAttribute("href")?.split("/").pop();
  if (linkFile === currentFile) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

// Typing animation on the homepage hero
const typingEl = document.querySelector("#typing-text");

if (typingEl) {
  const typingWords = [
    "mechanistic interpretability",
    "natural language processing",
    "large language models",
    "graph neural networks",
    "self-supervised learning",
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeStep() {
    const word = typingWords[wordIndex];

    if (deleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typingEl.textContent = word.slice(0, charIndex);

    if (!deleting && charIndex === word.length) {
      deleting = true;
      setTimeout(typeStep, 1800);
      return;
    }

    if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
    }

    setTimeout(typeStep, deleting ? 50 : 85);
  }

  typeStep();
}

// Shared calendar rendering
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function groupIntoWeeks(days) {
  const startDow = new Date(days[0].date).getDay();
  const padded = [...Array(startDow).fill(null), ...days];
  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }
  return weeks;
}

function buildCalendarHtml(days, year, palettePrefix, unitLabel) {
  const total = days.reduce((sum, d) => sum + d.count, 0);
  const weeks = groupIntoWeeks(days);
  const unitSingular = unitLabel.replace(/s$/, "");

  let html = `<p class="contrib-summary"><strong>${total}</strong> ${unitLabel} in ${year}</p>`;
  html += `<div class="contrib-scroll"><div class="contrib-canvas">`;

  html += `<div class="contrib-day-col">`;
  html += `<span class="contrib-month-lbl"></span>`;
  DAY_LABELS.forEach((lbl) => {
    html += `<span class="contrib-day-lbl">${lbl}</span>`;
  });
  html += `</div>`;

  weeks.forEach((week, wi) => {
    const firstReal = week.find((d) => d !== null);
    let monthLbl = "";
    if (firstReal) {
      const d = new Date(firstReal.date);
      if (wi === 0 || d.getDate() <= 7) {
        monthLbl = MONTH_NAMES[d.getMonth()];
      }
    }

    html += `<div class="contrib-col">`;
    html += `<span class="contrib-month-lbl">${monthLbl}</span>`;
    for (let row = 0; row < 7; row++) {
      const day = week[row] !== undefined ? week[row] : null;
      if (!day) {
        html += `<span class="contrib-cell contrib-empty"></span>`;
      } else {
        const plural = day.count !== 1 ? "s" : "";
        html += `<span class="contrib-cell ${palettePrefix}${day.level}" title="${day.date}: ${day.count} ${unitSingular}${plural}"></span>`;
      }
    }
    html += `</div>`;
  });

  html += `</div></div>`;

  html += `<div class="contrib-legend">`;
  html += `<span class="legend-txt">Less</span>`;
  for (let i = 0; i <= 4; i++) {
    html += `<span class="contrib-cell ${palettePrefix}${i}"></span>`;
  }
  html += `<span class="legend-txt">More</span>`;
  html += `</div>`;

  return html;
}

function buildYearButtons(container, years, activeYear, onSelect) {
  container.innerHTML = "";
  years.forEach((yr) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = yr === activeYear ? "yr-btn yr-btn-active" : "yr-btn";
    btn.textContent = yr;
    btn.addEventListener("click", () => {
      container.querySelectorAll(".yr-btn").forEach((b) => {
        b.classList.remove("yr-btn-active");
      });
      btn.classList.add("yr-btn-active");
      onSelect(yr);
    });
    container.append(btn);
  });
}

function renderStats(container, items) {
  container.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "stat-pill";
    li.innerHTML = `<span class="stat-value">${item.value}</span><span class="stat-label">${item.label}</span>`;
    container.append(li);
  });
}

function computeLongestStreak(days) {
  let best = 0;
  let cur = 0;
  days.forEach((d) => {
    if (d.count > 0) {
      cur += 1;
      if (cur > best) best = cur;
    } else {
      cur = 0;
    }
  });
  return best;
}

// GitHub calendar + stats
const ghGrid = document.querySelector("#gh-contribution-grid");
const ghYearSel = document.querySelector("#gh-year-selector");
const ghStatsRow = document.querySelector("#gh-stats-row");

if (ghGrid && ghYearSel && ghStatsRow) {
  const GH_USER = "Manojh23";
  let dataByYear = {};
  let allDays = [];

  function renderGhYear(yr) {
    const days = dataByYear[yr];
    if (!days || days.length === 0) {
      ghGrid.innerHTML = `<p class="chart-msg">No data for ${yr}.</p>`;
      return;
    }
    ghGrid.innerHTML = buildCalendarHtml(
      days,
      yr,
      "contrib-gh-l",
      "contributions"
    );

    const yearTotal = days.reduce((s, d) => s + d.count, 0);
    const streak = computeLongestStreak(allDays);
    const lifetimeTotal = allDays.reduce((s, d) => s + d.count, 0);

    renderStats(ghStatsRow, [
      { value: yearTotal, label: `contributions in ${yr}` },
      { value: lifetimeTotal, label: "all-time contributions" },
      { value: streak, label: "longest streak (days)" },
    ]);
  }

  async function loadGh() {
    try {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=all`
      );
      if (!res.ok) throw new Error("network error");
      const json = await res.json();

      allDays = json.contributions.slice();
      json.contributions.forEach((day) => {
        const yr = day.date.slice(0, 4);
        if (!dataByYear[yr]) dataByYear[yr] = [];
        dataByYear[yr].push(day);
      });

      const years = Object.keys(dataByYear).sort(
        (a, b) => Number(b) - Number(a)
      );
      const activeYear = years[0];
      buildYearButtons(ghYearSel, years, activeYear, renderGhYear);
      renderGhYear(activeYear);
    } catch {
      ghGrid.innerHTML = `<p class="chart-msg">Could not load contribution data.</p>`;
    }
  }

  loadGh();
}

// LeetCode calendar + stats
const lcGrid = document.querySelector("#lc-contribution-grid");
const lcYearSel = document.querySelector("#lc-year-selector");
const lcStatsRow = document.querySelector("#lc-stats-row");

if (lcGrid && lcYearSel && lcStatsRow) {
  const LC_USER = "HManoj";

  function levelFor(count) {
    if (count <= 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 9) return 3;
    return 4;
  }

  function buildYearDays(year, submissionMap) {
    const now = new Date();
    const isCurrent = year === now.getUTCFullYear();
    const start = new Date(Date.UTC(year, 0, 1));
    const end = isCurrent
      ? new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
        )
      : new Date(Date.UTC(year, 11, 31));

    const days = [];
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      const iso = d.toISOString().slice(0, 10);
      const count = submissionMap[iso] || 0;
      days.push({ date: iso, count, level: levelFor(count) });
    }
    return days;
  }

  async function loadLc() {
    try {
      const res = await fetch(
        `https://leetcode-api-faisalshohag.vercel.app/${LC_USER}`
      );
      if (!res.ok) throw new Error("network error");
      const json = await res.json();

      const rawCal = json.submissionCalendar || {};
      const submissionMap = {};
      const yearsWithData = new Set();

      Object.keys(rawCal).forEach((ts) => {
        const date = new Date(Number(ts) * 1000);
        const iso = date.toISOString().slice(0, 10);
        submissionMap[iso] = (submissionMap[iso] || 0) + Number(rawCal[ts]);
        yearsWithData.add(String(date.getUTCFullYear()));
      });

      const years = Array.from(yearsWithData).sort(
        (a, b) => Number(b) - Number(a)
      );

      if (years.length === 0) {
        lcGrid.innerHTML = `<p class="chart-msg">No LeetCode data available.</p>`;
        return;
      }

      const activeYear = years[0];

      function renderLcYear(yr) {
        const days = buildYearDays(Number(yr), submissionMap);
        lcGrid.innerHTML = buildCalendarHtml(
          days,
          yr,
          "contrib-lc-l",
          "submissions"
        );
      }

      buildYearButtons(lcYearSel, years, activeYear, renderLcYear);
      renderLcYear(activeYear);

      const totalSolved = json.totalSolved ?? 0;
      const easy = json.easySolved ?? 0;
      const medium = json.mediumSolved ?? 0;
      const hard = json.hardSolved ?? 0;

      renderStats(lcStatsRow, [
        { value: totalSolved, label: "problems solved" },
        { value: easy, label: "easy" },
        { value: medium, label: "medium" },
        { value: hard, label: "hard" },
      ]);
    } catch {
      lcGrid.innerHTML = `<p class="chart-msg">Could not load LeetCode data.</p>`;
    }
  }

  loadLc();
}
