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

const plainConfidence = (raw) => {
  const text = String(raw || "").toLowerCase();
  if (text.includes("low") && text.includes("mod")) return "Low to moderate";
  if (text.includes("high")) return "High";
  if (text.includes("moderate")) return "Moderate";
  if (text.includes("low")) return "Low";
  return raw || "—";
};

function ebaySold(query) {
  const params = new URLSearchParams({
    _nkw: query,
    _sacat: "0",
    LH_Sold: "1",
    LH_Complete: "1",
    rt: "nc",
    _sop: "13",
  });
  return `https://www.ebay.com/sch/i.html?${params.toString()}`;
}

function linkPair(sku) {
  const ebay = ebaySold(sku.ebay_query);
  return `<a href="${sku.gemrate}" target="_blank" rel="noopener">GemRate</a>
    · <a href="${ebay}" target="_blank" rel="noopener">eBay solds</a>`;
}

async function main() {
  const res = await fetch("./data/por-blister-pcg-model.json");
  if (!res.ok) throw new Error("Failed to load model JSON");
  const m = await res.json();

  const psa = m.psa10_C_POR_extrapolations;
  const rec = m.recommendation;
  const matrix = m.pcg_scenario_matrix.immature;
  const derived = m.derived;
  const skus = Array.isArray(m.skus) ? m.skus : [];
  const skuById = Object.fromEntries(skus.map((sku) => [sku.id, sku]));

  document.getElementById("asOf").textContent = `checked ${m.as_of}`;
  const rn = document.getElementById("refreshNote");
  if (rn) {
    const r24 = m.market_refresh_2026_09_24;
    const r16 = m.market_refresh_2026_09_16;
    if (r24) {
      const tcg = r24.tcg_market == null ? "TCGPlayer had no listings" : `TCGPlayer was at $${r24.tcg_market}`;
      rn.innerHTML = `<strong>Checked Sep 24.</strong> Raw blister cards on eBay: a typical plain copy is $${r24.ebay_plain_blister_median} (${r24.ebay_plain_blister_n} sales) and a swirl is $${r24.ebay_swirl_median} (${r24.ebay_swirl_n} sales). ${tcg}. CGC has graded ${r24.gemrate_cgc_pop} copies (${r24.gemrate_pristine} pristine, ${r24.gemrate_gems_plus} gems). None of those top blister copies have sold. The guess stays about $${Math.round(r24.psa10_extrapolate_immature)} for a PSA 10 and about $${Math.round(r24.pcg_base_point)} for a PCG pristine.`;
    } else if (r16) {
      rn.innerHTML = `<strong>Checked Sep 16.</strong> Typical raw blister single on eBay was $${r16.ebay_singles_median}. TCGPlayer was $${r16.tcg_market}. Graded blister gem sales found: ${r16.ebay_graded_blister_psa_cgc_tag_10_sold_matches}.`;
    }
  }

  document.getElementById("kpiPsa").textContent = money(psa.immature);
  document.getElementById("kpiPsaSub").textContent = `Low about ${money(psa.via_RH)}. Settled market about ${money(psa.geo_mature)}.`;
  document.getElementById("kpiPcg").textContent = money(rec.base_point);
  document.getElementById("kpiPcgSub").textContent = `Fair band ${money(rec.base_range[0])}–${money(rec.base_range[1])}`;
  document.getElementById("kpiMat").textContent = derived.maturity_clipped.toFixed(2);
  document.getElementById("kpiConf").textContent = plainConfidence(rec.confidence);

  document.getElementById("pathNote").textContent =
    "Quote the early-market number. The PCG line sits below a CGC pristine on purpose: about 70% of that price, plus a small bump because these would be some of the first ones for sale. That bump should fade.";

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

  const labels = ["Early market", "Reverse starts to pull away", "Settled, like 151"];
  const gridColor = "rgba(45,35,64,.9)";
  const tick = { color: "#a89bbf", font: { family: "IBM Plex Sans" } };

  new Chart(document.getElementById("pathChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "PSA 10 guess",
          data: psaPath,
          borderColor: "#9b6dff",
          backgroundColor: "rgba(155,109,255,.15)",
          fill: true,
          tension: 0.28,
          pointRadius: 5,
          pointBackgroundColor: "#c4a6ff",
        },
        {
          label: "PCG pristine guess",
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
      labels: [
        "From the reverse holo",
        "Early-market guess",
        "Once the market settles",
        "From the regular holo",
      ],
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

  const thead = document.querySelector("#pcgMatrix thead");
  const tbody = document.querySelector("#pcgMatrix tbody");
  thead.innerHTML = `<tr><th>How PCG compares</th><th>No extra</th><th>Small first-sale bump</th><th>Hot first-sale bump</th></tr>`;
  const rows = [
    ["Colder, 55%", matrix.low],
    ["The quote, 70%", matrix.base],
    ["Warmer, 85%", matrix.high],
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

  renderCompReview(m.pcg_ebay_comp_review);

  const card = (id, title, big, tiny) => {
    const sku = skuById[id];
    const links = sku ? `<p class="links">${linkPair(sku)}</p>` : "";
    return `<div class="card"><h3>${title}</h3><div class="big">${big}</div><div class="tiny">${tiny}</div>${links}</div>`;
  };

  document.getElementById("bridge").innerHTML = [
    card("151-holo", "151 regular holo, PSA 10", money(m.inputs["151"].psa10_H), `Cosmos sells for ${derived.beta_Cos_over_H}× this`),
    card("151-reverse", "151 reverse holo, PSA 10", money(m.inputs["151"].psa10_RH_mature), `Cosmos sells for ${derived.gamma_Cos_over_RH}× this`),
    card("151-cosmos", "151 cosmos, PSA 10", money(m.inputs["151"].psa10_C), `Raw to a CGC pristine is about ${derived.m_raw_cgcP_151C.toFixed(1)}×. That multiple is a weak estimate.`),
    card("por-holo", "This set, regular holo, PSA 10", money(m.inputs.POR.psa10_H_guide), `Ungraded copies are about ${money(m.inputs.POR.raw_H)}`),
    card("por-reverse", "This set, reverse holo, PSA 10", money(m.inputs.POR.psa10_RH_guide), `The reverse is ${derived.POR_RH_over_H.toFixed(2)}× the regular holo`),
    card("por-blister", "Blister cosmos, ungraded", money(m.inputs.POR.raw_C_blister), "No blister PSA 10 has sold"),
  ].join("");

  document.getElementById("formula").textContent = [
    "How far along = the Perfect Order reverse/holo ratio, divided by the older 151 reverse/holo ratio, held between 0.25 and 1. Right now that is " + derived.maturity_clipped.toFixed(3) + ".",
    "Early PSA 10 = this set's regular-holo PSA 10 × (1 + (cosmos premium − 1) × how far along) = " + money(psa.immature) + ".",
    "CGC pristine blend = 40% from the raw price + 35% from the PSA price × a grade ratio + 25% from the PSA price × the pristine/PSA ratio = " + money(rec.cgcp_blend_immature) + ".",
    "PCG quote = that blend × 0.70 × 1.15 = " + money(rec.base_point) + ".",
  ].join("\n");

  const skuBody = document.querySelector("#skuTable tbody");
  skuBody.innerHTML = skus
    .map((sku) => {
      const rowClass = sku.counts ? "" : "out";
      const salesClass = sku.counts ? "" : "no";
      return `<tr class="${rowClass}">
        <td>${sku.name}<div class="tiny">${sku.number}</div></td>
        <td>${sku.role}</td>
        <td class="links">${linkPair(sku)}</td>
        <td class="${salesClass}">${sku.sold_note}</td>
      </tr>`;
    })
    .join("");

  document.getElementById("assumptions").innerHTML = [
    "Only blister-pack cosmos cards. Store-stamped copies are a different product.",
    "The quote uses the early-market path until this set's reverse holos pull further away from the regular holos.",
    "PCG slabs have been cheaper than PSA and CGC, so the quote uses 70% of a CGC pristine.",
    "Add 15% because the first top PCG copies can sell high. That extra should fade.",
    "The $240 figure for a 151 cosmos CGC pristine is a price-guide estimate. No clean sold price backs it.",
    "No blister PSA 10, CGC 10, or pristine copy has sold yet.",
  ]
    .map((t) => `<li>${t}</li>`)
    .join("");

  document.getElementById("invalidators").innerHTML = [
    "A real blister PSA 10 or CGC pristine sells well outside this band, and the listing is not a GameStop or EB Games stamp.",
    "A real 151 cosmos CGC pristine sells more than 40% away from the $240 estimate.",
    "This set's reverse PSA 10s rise to about twice the regular holo. Then use the settled-market path.",
    "A PCG pristine on any Perfect Order Gengar finish sells outside 55–85% of a similar CGC pristine.",
    "Raw blister cards leave the roughly $8–$20 range and stay outside it.",
    "Stamped cards get mixed into blister sales by mistake.",
  ]
    .map((t) => `<li>${t}</li>`)
    .join("");
}

function renderCompReview(review) {
  const box = document.getElementById("compReview");
  if (!box) return;
  const sales = review && Array.isArray(review.sales) ? review.sales : [];
  const note = (review && review.note) || "Real eBay sales belong here after they are checked.";
  if (!sales.length) {
    box.innerHTML = `<h3>Reviewed eBay sales</h3>
      <p class="lead">${note}</p>
      <p class="empty">Nothing reviewed yet. When sold comps are written into the price file, each sale shows here with the date, the price, the listing, and whether it counts.</p>`;
    return;
  }
  const body = sales
    .map((sale) => {
      const counts = sale.keep ? `<span class="keep">Counts</span>` : `<span class="drop">Leave out</span>`;
      const title = sale.url
        ? `<a href="${sale.url}" target="_blank" rel="noopener">${sale.title || "Listing"}</a>`
        : (sale.title || "Listing");
      return `<tr>
        <td>${sale.date || "—"}</td>
        <td>${title}</td>
        <td>${money(sale.price)}</td>
        <td>${counts}</td>
        <td>${sale.note || ""}</td>
      </tr>`;
    })
    .join("");
  box.innerHTML = `<h3>Reviewed eBay sales</h3>
    <p class="lead">${note}</p>
    <div class="table-wrap"><table>
      <thead><tr><th>Date</th><th>Listing</th><th>Price</th><th>Use it?</th><th>Why</th></tr></thead>
      <tbody>${body}</tbody>
    </table></div>`;
}

main().catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<div class="callout void"><strong>The page did not load:</strong> ${err.message}</div>`
  );
});
