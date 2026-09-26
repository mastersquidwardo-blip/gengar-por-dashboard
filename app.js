const dollars = (n) => {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));
};

const cents = (n) => {
  if (n == null || Number.isNaN(Number(n))) return "—";
  const num = Number(n);
  const digits = Number.isInteger(num) ? 0 : 2;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(num);
};

function prettyDate(iso) {
  const parts = String(iso || "").split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const [year, month, day] = parts;
  if (!year || !month || !day || !months[month - 1]) return String(iso || "");
  return `${months[month - 1]} ${day}, ${year}`;
}

function plainConfidence(raw) {
  const text = String(raw || "").toLowerCase();
  if (text.includes("low") && text.includes("mod")) return "Low to moderate";
  if (text.includes("high")) return "High";
  if (text.includes("moderate")) return "Moderate";
  if (text.includes("low")) return "Low";
  return "Low to moderate";
}

function fill(figures) {
  document.querySelectorAll("[data-fill]").forEach((el) => {
    const key = el.getAttribute("data-fill");
    if (figures[key] != null) el.textContent = figures[key];
  });
}

function gradeSentence(refresh) {
  const copies = refresh && refresh.gemrate_cgc_pop;
  const gems = refresh && refresh.gemrate_gems_plus;
  const pristine = refresh && refresh.gemrate_pristine;
  if (copies == null || gems == null || pristine == null) {
    return "CGC has already graded some copies, including a few at the very top. None of those top blister copies have sold.";
  }
  const sales = refresh.gemrate_sales;
  const sold = sales === 0 || sales == null
    ? "None of them have sold."
    : "Recorded sales of those top copies are still scarce.";
  return `CGC has already graded about ${copies} copies. About ${gems} of those are gem grades, including ${pristine} at the top pristine grade. ${sold}`;
}

function tcgSentence(refresh, prior) {
  const empty = !refresh || refresh.tcg_listings === 0 || refresh.tcg_market == null;
  if (!empty) {
    return `TCGPlayer’s market price when we looked was about ${cents(refresh.tcg_market)}. eBay sold prices are still the ones we trust.`;
  }
  const older = prior && prior.tcg_market != null
    ? ` The last market price we saw there, in mid-September, was about ${cents(prior.tcg_market)}.`
    : "";
  return `TCGPlayer had no listings when we looked.${older} eBay sold prices are the ones we trust.`;
}

function renderSteps(steps) {
  const list = document.getElementById("steps");
  if (!list || !Array.isArray(steps) || !steps.length) return;
  const fragment = document.createDocumentFragment();
  steps.forEach((step) => {
    const item = document.createElement("li");
    item.className = `step ${step.mark || ""}`.trim();

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
    when.textContent = step.when || "";
    const title = document.createElement("h3");
    title.textContent = step.title || "";
    const copy = document.createElement("p");
    copy.textContent = step.body || "";
    body.append(when, title, copy);

    item.append(rail, body);
    fragment.append(item);
  });
  list.replaceChildren(fragment);
}

async function main() {
  const res = await fetch("./data/por-blister-pcg-model.json");
  if (!res.ok) throw new Error("notes unavailable");
  const model = await res.json();

  const earlyPsa = model.psa10_C_POR_extrapolations;
  const rec = model.recommendation;
  const refresh = model.market_refresh_2026_09_24 || {};
  const prior = model.market_refresh_2026_09_16 || {};
  const range = (model.inputs.POR && model.inputs.POR.raw_C_blister_ebay_range) || [];
  const olderGuide = model.inputs["151"] && model.inputs["151"].cgcP_C_estimate;
  const copy = model.plain_language || {};

  fill({
    checked: prettyDate(model.as_of),
    confidence: plainConfidence(rec.confidence),
    "psa-early": dollars(earlyPsa.immature),
    "pcg-early": dollars(rec.base_point),
    "psa-later": dollars(earlyPsa.geo_mature),
    "pcg-later": dollars(rec.bull_if_mature_asserts),
    "psa-low": dollars(earlyPsa.via_RH),
    "psa-high": dollars(earlyPsa.via_H),
    "pcg-band-low": dollars(rec.base_range[0]),
    "pcg-band-high": dollars(rec.base_range[1]),
    "pcg-cautious": dollars(rec.bear),
    "pcg-hot": dollars(rec.bull),
    "guide-151": dollars(olderGuide),
    "raw-low": cents(range[0]),
    "raw-high": cents(range[1]),
    plain: cents(refresh.ebay_plain_blister_median),
    swirl: cents(refresh.ebay_swirl_median),
    "plain-count": refresh.ebay_plain_blister_n != null ? String(refresh.ebay_plain_blister_n) : "—",
    "swirl-count": refresh.ebay_swirl_n != null ? String(refresh.ebay_swirl_n) : "—",
  });

  document.querySelectorAll('time[data-fill="checked"]').forEach((el) => {
    if (model.as_of) el.setAttribute("datetime", model.as_of);
  });

  const release = document.getElementById("release-means");
  if (release && copy.release_means) release.textContent = copy.release_means;

  const intro = document.getElementById("timeline-intro");
  if (intro && copy.timeline_intro) intro.textContent = copy.timeline_intro;

  const grades = document.getElementById("grade-count");
  if (grades) grades.textContent = gradeSentence(refresh);

  const tcg = document.getElementById("tcg-note");
  if (tcg) tcg.textContent = tcgSentence(refresh, prior);

  if (Array.isArray(copy.steps) && copy.steps.length) renderSteps(copy.steps);
}

main().catch((err) => {
  console.error(err);
  const box = document.getElementById("load-error");
  if (!box) return;
  box.hidden = false;
  box.textContent = "The latest price notes did not load. The figures on the page are from the last check we wrote down.";
});
