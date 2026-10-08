const money = (n) =>
  n == null || Number.isNaN(Number(n))
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(Number(n));

function setText(el, value) {
  if (!el || value == null) return;
  el.textContent = String(value);
}

function rangeText(low, high) {
  const a = money(low);
  const b = money(high);
  if (a === "—" || b === "—") return null;
  return `${a}–${b}`;
}

function prettyDate(iso) {
  if (typeof iso !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return iso;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function cell(text) {
  const td = document.createElement("td");
  setText(td, text == null || text === "" ? "—" : text);
  return td;
}

function renderPicture(rec, refresh) {
  const body = document.querySelector("#picture tbody");
  if (!body) return;
  const band = rangeText(
    (rec.psa10_band || [])[0] ?? (refresh.psa10_band || [])[0],
    (rec.psa10_band || [])[1] ?? (refresh.psa10_band || [])[1]
  );
  const rows = [
    ["Reverse holo times the older cosmos gap", money(rec.psa10_method_reverse_times_older_ratio ?? refresh.psa10_method_reverse_times_older_ratio), ""],
    ["Planning middle", money(rec.psa10_planning_middle ?? refresh.psa10_planning_middle), "plan"],
    ["Band", band, ""],
    ["Older optimistic guess", money(rec.psa10_optimistic_near_ceiling ?? refresh.prior_optimistic_psa), ""],
    ["GameStop stamped PSA 10", rec.psa10_stamped_ceiling == null && refresh.gamestop_psa10_ceiling == null ? null : `${money(rec.psa10_stamped_ceiling ?? refresh.gamestop_psa10_ceiling)} ceiling`, ""],
  ];
  if (rows.some(([, value]) => value == null || value === "—")) return;
  body.replaceChildren();
  rows.forEach(([label, value, className]) => {
    const tr = document.createElement("tr");
    if (className) tr.className = className;
    tr.append(cell(label), cell(value));
    body.append(tr);
  });
}

function renderAnchors(refresh) {
  const body = document.querySelector("#anchors tbody");
  if (!body || !refresh) return;
  const holoGuide = money(refresh.psa10_H_pricecharting_guide);
  const holoSold = money(refresh.psa10_H_ebay_median);
  const reverseGuide = money(refresh.psa10_RH_pricecharting_guide);
  const reverseSold = money(refresh.psa10_RH_ebay_median);
  const pristine = rangeText(refresh.cgc_pristine_RH_sold_low, refresh.cgc_pristine_RH_sold_high);
  const priced = [holoGuide, holoSold, reverseGuide, reverseSold, pristine];
  if (priced.some((value) => value == null || value === "—")) return;
  body.replaceChildren();
  [
    ["Regular holo PSA 10", holoGuide, holoSold],
    ["Reverse holo PSA 10", reverseGuide, reverseSold],
    ["Reverse holo CGC pristine", "—", pristine],
  ].forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((value) => tr.append(cell(value)));
    body.append(tr);
  });
}

function renderPop(pop) {
  const body = document.querySelector("#popTable tbody");
  if (!body || !pop || !Array.isArray(pop.grades) || !pop.grades.length) return;
  body.replaceChildren();
  let sum = 0;
  pop.grades.forEach((grade) => {
    const count = grade && grade.count;
    if (typeof count === "number") sum += count;
    const tr = document.createElement("tr");
    tr.append(cell(grade && grade.grade), cell(count == null ? null : String(count)), cell(grade && grade.note));
    body.append(tr);
  });
  const total = document.createElement("tr");
  total.className = "plan";
  total.append(cell("All grades"), cell(String(sum)), cell("Grades in hand"));
  body.append(total);
}

function renderSteps(steps) {
  const list = document.getElementById("timeline");
  if (!list || !Array.isArray(steps) || !steps.length) return;
  const allowed = new Set(["past", "now", "later", "soon"]);
  list.replaceChildren();
  steps.forEach((step) => {
    if (!step) return;
    const item = document.createElement("li");
    item.className = `step ${allowed.has(step.mark) ? step.mark : "later"}`;
    const rail = document.createElement("div");
    rail.className = "rail";
    const dot = document.createElement("span");
    dot.className = "dot";
    const line = document.createElement("span");
    line.className = "line";
    rail.append(dot, line);
    const body = document.createElement("div");
    body.className = "step-body";
    const when = document.createElement("p");
    when.className = "when";
    setText(when, step.when || "");
    const title = document.createElement("h3");
    setText(title, step.title || "");
    const copy = document.createElement("p");
    setText(copy, step.body || "");
    body.append(when, title, copy);
    item.append(rail, body);
    list.append(item);
  });
}

function renderChart(rec, refresh) {
  const canvas = document.getElementById("psaChart");
  if (!canvas || !window.Chart) return;
  const bars = [
    ["Reverse math", rec.psa10_method_reverse_times_older_ratio ?? refresh.psa10_method_reverse_times_older_ratio, "#9b6dff"],
    ["Planning middle", rec.psa10_planning_middle ?? refresh.psa10_planning_middle, "#ffb454"],
    ["Older guess", rec.psa10_optimistic_near_ceiling ?? refresh.prior_optimistic_psa, "#6d6280"],
    ["Stamp ceiling", rec.psa10_stamped_ceiling ?? refresh.gamestop_psa10_ceiling, "#e07a8a"],
  ].filter(([, value]) => value != null && !Number.isNaN(Number(value)));
  if (!bars.length) return;
  const tick = { color: "#a89bbf", font: { family: "IBM Plex Sans" } };
  const grid = "rgba(45,35,64,.9)";
  new window.Chart(canvas, {
    type: "bar",
    data: {
      labels: bars.map(([label]) => label),
      datasets: [
        {
          data: bars.map(([, value]) => Number(value)),
          backgroundColor: bars.map(([, , color]) => color),
          borderRadius: 8,
          maxBarThickness: 72,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => (ctx.parsed.y == null ? "" : money(ctx.parsed.y)),
          },
        },
      },
      scales: {
        x: { ticks: tick, grid: { display: false } },
        y: {
          beginAtZero: true,
          ticks: { ...tick, callback: (value) => "$" + Number(value).toLocaleString("en-US") },
          grid: { color: grid },
        },
      },
    },
  });
}

async function main() {
  const res = await fetch("./data/por-blister-pcg-model.json?v=20261008");
  if (!res.ok) throw new Error("Price file did not load");
  const model = await res.json();
  const rec = model.recommendation || {};
  const refresh = model.market_refresh_2026_10_08 || {};
  const copy = model.plain_language || {};
  const pop = model.pcg_population || {};

  const checked = copy.checked || prettyDate(model.as_of);
  setText(document.getElementById("asOf"), checked ? `as of ${checked}` : null);
  setText(document.getElementById("kpiPsa"), money(rec.psa10_planning_middle ?? refresh.psa10_planning_middle));
  setText(
    document.getElementById("kpiPsaBand"),
    rangeText((rec.psa10_band || refresh.psa10_band || [])[0], (rec.psa10_band || refresh.psa10_band || [])[1])
  );
  setText(document.getElementById("kpiPsaSub"), copy.psa_sub);
  setText(document.getElementById("kpiPcg"), money(rec.base_point ?? refresh.pcg_pristine_soft));
  setText(document.getElementById("kpiPcgSub"), copy.pcg_sub);
  setText(document.getElementById("kpiRaw"), rangeText(refresh.raw_nm_low, refresh.raw_nm_high));
  setText(document.getElementById("kpiRawSub"), copy.raw_sub);
  setText(document.getElementById("ceilingNote"), copy.stamped_ceiling);
  setText(document.getElementById("zeroSales"), copy.zero_sales);
  setText(document.getElementById("methodNote"), copy.method);
  setText(document.getElementById("chartNote"), copy.chart_note);
  setText(document.getElementById("anchorIntro"), copy.anchors_intro);
  setText(document.getElementById("rawNote"), copy.raw_note);
  setText(document.getElementById("rawRange"), rangeText(refresh.raw_nm_low, refresh.raw_nm_high));
  setText(document.getElementById("rawListings"), refresh.tcg_listings == null ? null : `about ${Number(refresh.tcg_listings).toLocaleString("en-US")}`);
  setText(document.getElementById("rawProduct"), refresh.tcg_product_id == null ? null : String(refresh.tcg_product_id));
  setText(document.getElementById("popSummary"), pop.summary);
  setText(document.getElementById("popCaveat"), copy.pop_caveat);
  setText(document.getElementById("timelineIntro"), copy.timeline_intro);
  setText(document.getElementById("confidenceNote"), copy.confidence);

  renderPicture(rec, refresh);
  renderAnchors(refresh);
  renderPop(pop);
  renderSteps(copy.steps);
  try {
    renderChart(rec, refresh);
  } catch (err) {
    console.error(err);
  }
}

main().catch((err) => {
  console.error(err);
  const box = document.getElementById("load-error");
  if (!box) return;
  box.hidden = false;
  setText(box, "The latest price notes did not load. The figures on the page are from the last check we wrote down.");
});
