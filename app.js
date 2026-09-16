const money = (n) =>
  n == null || Number.isNaN(n)
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(n);

const money1 = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

async function main() {
  const res = await fetch("./data/por-blister-pcg-model.json");
  if (!res.ok) throw new Error("Failed to load model JSON");
  const m = await res.json();

  const psa = m.psa10_C_POR_extrapolations;
  const rec = m.recommendation;
  const matrix = m.pcg_scenario_matrix.immature;
  const derived = m.derived;

  document.getElementById("asOf").textContent = `as of ${m.as_of}`;
  const rn = document.getElementById("refreshNote");
  if (rn && m.market_refresh_2026_09_16) {
    const r = m.market_refresh_2026_09_16;
    rn.innerHTML = `<strong>Sep 16 refresh:</strong> eBay blister singles med $${r.ebay_singles_median} · TCG market $${r.tcg_market} · graded blister gem solds: ${r.ebay_graded_blister_psa_cgc_tag_10_sold_matches}. PSA path unchanged; PCG rawpath updated.`;
  }

  document.getElementById("kpiPsa").textContent = money(psa.immature);
  document.getElementById("kpiPsaSub").textContent = `range ${money(psa.via_RH)}–${money(psa.geo_mature)} · center ~$700`;
  document.getElementById("kpiPcg").textContent = money(rec.base_point);
  document.getElementById("kpiPcgSub").textContent = `range ${money(rec.base_range[0])}–${money(rec.base_range[1])}`;
  document.getElementById("kpiMat").textContent = derived.maturity_clipped.toFixed(2);
  document.getElementById("kpiConf").textContent = rec.confidence;

  document.getElementById("pathNote").textContent =
    "Primary path holds maturity at ~0.42 until POR reverse separates from holo. PCG stays discounted vs CGC Pristine equivalent (k=0.70) with a fading +15% first-to-market bump.";

  // Predictive path: Launch (immature) → Mid (halfway to mature) → Mature geo
  const psaPath = [
    psa.immature,
    (psa.immature + psa.geo_mature) / 2,
    psa.geo_mature,
  ];
  const pcgPath = [
    rec.base_point,
    (rec.base_point + rec.bull_if_mature_asserts) / 2,
    rec.bull_if_mature_asserts,
  ];

  const labels = ["Launch (immature)", "RH starts separating", "Mature geo"];
  const gridColor = "rgba(45,35,64,.9)";
  const tick = { color: "#a89bbf", font: { family: "IBM Plex Sans" } };

  new Chart(document.getElementById("pathChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "PSA 10 (extrapolated)",
          data: psaPath,
          borderColor: "#9b6dff",
          backgroundColor: "rgba(155,109,255,.15)",
          fill: true,
          tension: 0.28,
          pointRadius: 5,
          pointBackgroundColor: "#c4a6ff",
        },
        {
          label: "PCG Pristine 10 (base k/ftm)",
          data: pcgPath,
          borderColor: "#4de1c1",
          backgroundColor: "rgba(77,225,193,.12)",
          fill: true,
          tension: 0.28,
          pointRadius: 5,
          pointBackgroundColor: "#4de1c1",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { color: "#f3eefc" } },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${money1(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        x: { ticks: tick, grid: { color: gridColor } },
        y: {
          ticks: {
            ...tick,
            callback: (v) => "$" + Number(v).toLocaleString("en-US"),
          },
          grid: { color: gridColor },
        },
      },
    },
  });

  new Chart(document.getElementById("psaLadder"), {
    type: "bar",
    data: {
      labels: ["via RH", "Immature ★", "Mature geo", "via H"],
      datasets: [
        {
          label: "PSA 10",
          data: [psa.via_RH, psa.immature, psa.geo_mature, psa.via_H],
          backgroundColor: [
            "rgba(168,155,191,.55)",
            "rgba(155,109,255,.95)",
            "rgba(196,166,255,.75)",
            "rgba(255,107,203,.55)",
          ],
          borderRadius: 8,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: (ctx) => money1(ctx.parsed.x) },
        },
      },
      scales: {
        x: {
          ticks: {
            ...tick,
            callback: (v) => "$" + Number(v).toLocaleString("en-US"),
          },
          grid: { color: gridColor },
        },
        y: { ticks: tick, grid: { display: false } },
      },
    },
  });

  // PCG matrix table
  const thead = document.querySelector("#pcgMatrix thead");
  const tbody = document.querySelector("#pcgMatrix tbody");
  thead.innerHTML = `<tr><th>k_pcg \\ ftm</th><th>none</th><th>base +15%</th><th>agg +30%</th></tr>`;
  const rows = [
    ["low 0.55", matrix.low],
    ["base 0.70", matrix.base],
    ["high 0.85", matrix.high],
  ];
  tbody.innerHTML = rows
    .map(([name, row], i) => {
      const hl = i === 1 ? "hl" : "";
      return `<tr>
        <td>${name}</td>
        <td class="${hl}">${money(row.none)}</td>
        <td class="${hl}">${money(row.base)}</td>
        <td class="${hl}">${money(row.aggressive)}</td>
      </tr>`;
    })
    .join("");

  // Bridge cards
  document.getElementById("bridge").innerHTML = `
    <div class="card"><h3>151 Reg PSA10</h3><div class="big">${money(m.inputs["151"].psa10_H)}</div><div class="tiny">β cosmos = ${derived.beta_Cos_over_H}×</div></div>
    <div class="card"><h3>151 RH PSA10</h3><div class="big">${money(m.inputs["151"].psa10_RH_mature)}</div><div class="tiny">γ cosmos = ${derived.gamma_Cos_over_RH}×</div></div>
    <div class="card"><h3>151 Cosmos PSA10</h3><div class="big">${money(m.inputs["151"].psa10_C)}</div><div class="tiny">raw→CGC_P ≈ ${derived.m_raw_cgcP_151C.toFixed(2)}× (weak est.)</div></div>
    <div class="card"><h3>POR H PSA10</h3><div class="big">${money(m.inputs.POR.psa10_H_guide)}</div><div class="tiny">raw ~${money(m.inputs.POR.raw_H)}</div></div>
    <div class="card"><h3>POR RH PSA10</h3><div class="big">${money(m.inputs.POR.psa10_RH_guide)}</div><div class="tiny">RH/H = ${derived.POR_RH_over_H.toFixed(2)}×</div></div>
    <div class="card"><h3>POR blister raw</h3><div class="big">${money(m.inputs.POR.raw_C_blister)}</div><div class="tiny">PSA10 blister n = 0</div></div>
  `;

  document.getElementById("formula").textContent = [
    "maturity = clip((POR_RH/H) / (151_RH/H), 0.25, 1) ≈ " + derived.maturity_clipped.toFixed(3),
    "PSA10_C_POR_immature = PSA10_H_POR × (1 + (β − 1) × maturity) ≈ " + money(psa.immature),
    "CGCP_blend = 0.40·rawpath + 0.35·(PSA×α) + 0.25·(PSA×CGCP/PSA) ≈ " + money(rec.cgcp_blend_immature),
    "PCG = CGCP_blend × k_pcg × (1 + ftm)   // base: k=0.70, ftm=+15% → " + money(rec.base_point),
    "α_stack_reg_rh (inv gem weights on POR H+RH) ≈ " + derived.alpha_stack_reg_rh_primary.toFixed(3),
  ].join("\n");

  document.getElementById("assumptions").innerHTML = [
    "Blister cosmos only — GameStop/EB stamped comps excluded.",
    "Primary PSA path uses immature maturity clip until POR reverse premium forms.",
    "PCG colder than PSA/CGC → base k_pcg = 0.70.",
    "First-to-market launch bump +15%, expected to fade.",
    "151 cosmos CGC Pristine $240 is a PriceCharting estimate (weak).",
    ...rec.confidence_rationale.slice(0, 2),
  ]
    .map((t) => `<li>${t}</li>`)
    .join("");

  document.getElementById("invalidators").innerHTML = rec.invalidators
    .map((t) => `<li>${t}</li>`)
    .join("");
}

main().catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<div class="callout void"><strong>Load error:</strong> ${err.message}</div>`
  );
});
