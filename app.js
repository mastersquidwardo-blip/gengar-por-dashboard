const money = (n) =>
  n == null || Number.isNaN(Number(n))
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(Number(n));

const times = (n) => (n == null || Number.isNaN(n) ? "—" : `${n.toFixed(2)}×`);

async function main() {
  const res = await fetch("./data/por-blister-pcg-model.json");
  if (!res.ok) throw new Error("Price file did not load");
  const m = await res.json();

  const set151 = m.inputs["151"];
  const por = m.inputs.POR;
  const psa = m.psa10_C_POR_extrapolations;
  const rec = m.recommendation;

  const psaQuote = psa.immature;
  const psaFromReverse = psa.via_RH;
  const cgcQuote = rec.cgcp_blend_immature;
  const pcgQuote = rec.base_point;

  const cosmosOverReverse = set151.psa10_C / set151.psa10_RH_mature;
  const porReverseOverHolo = por.psa10_RH_guide / por.psa10_H_guide;
  const set151ReverseOverHolo = set151.psa10_RH_mature / set151.psa10_H;
  const quoteOverReverse = psaQuote / por.psa10_RH_guide;

  document.getElementById("asOf").textContent = `as of ${m.as_of}`;

  document.getElementById("kpiPsa").textContent = money(psaQuote);
  document.getElementById("kpiCgc").textContent = money(cgcQuote);
  document.getElementById("kpiCgcSub").textContent = `151 cosmos CGC pristine in the blend is an estimate, ${money(set151.cgcP_C_estimate)}.`;
  document.getElementById("kpiPcg").textContent = money(pcgQuote);
  document.getElementById("kpiPcgSub").textContent =
    `${times(pcgQuote / psaQuote)} the PSA 10 · ${times(pcgQuote / cgcQuote)} the CGC pristine`;

  const rows = [
    ["151 reverse", money(set151.psa10_RH_mature), "—", "—"],
    ["151 cosmos", money(set151.psa10_C), times(cosmosOverReverse), `${money(set151.cgcP_C_estimate)} estimate`],
    ["This set, reverse", money(por.psa10_RH_guide), `${times(porReverseOverHolo)} its own holo`, money(por.cgcP_RH_sold)],
    ["Blister cosmos", money(psaQuote), times(quoteOverReverse), money(cgcQuote)],
  ];
  document.querySelector("#stack tbody").innerHTML = rows
    .map(
      ([name, psaCell, versus, cgc], i) =>
        `<tr class="${i === 3 ? "quote" : ""}"><td>${name}</td><td>${psaCell}</td><td>${versus}</td><td>${cgc}</td></tr>`
    )
    .join("");

  document.getElementById("layerNote").textContent =
    `151's reverse is ${times(set151ReverseOverHolo)} its holo. This set's reverse is ${times(porReverseOverHolo)} its holo. ` +
    `Copying 151's cosmos-over-reverse gap onto this reverse is ${money(psaFromReverse)}. The PSA quote is ${money(psaQuote)} because the reverse gap here is only partway open. ` +
    `The PCG dot on the chart is ${money(pcgQuote)}.`;

  const tick = { color: "#a89bbf", font: { family: "IBM Plex Sans" } };
  const grid = "rgba(45,35,64,.9)";
  new Chart(document.getElementById("stackChart"), {
    type: "line",
    data: {
      labels: ["151 reverse", "151 cosmos", "This set, reverse", "Blister cosmos"],
      datasets: [
        {
          label: "PSA 10",
          data: [set151.psa10_RH_mature, set151.psa10_C, por.psa10_RH_guide, psaQuote],
          borderColor: "#9b6dff",
          backgroundColor: "rgba(155,109,255,.12)",
          fill: false,
          tension: 0.25,
          pointRadius: 5,
          pointBackgroundColor: "#c4a6ff",
        },
        {
          label: "CGC pristine",
          data: [null, set151.cgcP_C_estimate, por.cgcP_RH_sold, cgcQuote],
          borderColor: "#4de1c1",
          backgroundColor: "transparent",
          fill: false,
          tension: 0.25,
          pointRadius: 5,
          spanGaps: true,
          pointBackgroundColor: "#4de1c1",
        },
        {
          label: "PCG pristine",
          data: [null, null, null, pcgQuote],
          borderColor: "#ffb454",
          backgroundColor: "#ffb454",
          showLine: false,
          pointRadius: 8,
          pointHoverRadius: 9,
        },
      ],
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { color: "#f3eefc" } },
        tooltip: {
          callbacks: { label: (ctx) => (ctx.parsed.y == null ? "" : `${ctx.dataset.label}: ${money(ctx.parsed.y)}`) },
        },
      },
      scales: {
        x: { ticks: tick, grid: { color: grid } },
        y: {
          ticks: { ...tick, callback: (v) => "$" + Number(v).toLocaleString("en-US") },
          grid: { color: grid },
        },
      },
    },
  });
}

main().catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<p class="callout"><strong>The page did not load.</strong> ${err.message}</p>`
  );
});
