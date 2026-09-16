# Gengar POR Blister Cosmos — Predictive Path Dashboard

Static dashboard for the **most likely valuation path** of:

**2026 Perfect Order EN Gengar `#050/088` blister cosmos holo**

Tracks extrapolated **PSA 10** and **PCG Pristine 10** (9.5 / 10 / 10 / 10).

> **Blister only.** GameStop / EB Games stamped comps (~$700–825 PSA 10) are **void** for this target.

## Live quotes (model as of 2026-09-16)

| Metric | Most likely |
|--------|-------------|
| PSA 10 (immature path) | **~$685** (ladder ~$545–$840) — unchanged |
| PCG Pristine 10 | **~$164** (base range ~$143–$185) |
| Blister raw | eBay singles med **~$10** · TCGPlayer market **~$6.51** |
| Graded blister gems | **0** sold matches found |
| Confidence | Low–moderate |

### Sep 16 refresh
- Pulled 50 eBay sold blister results (47 singles after dropping 4-card lots)
- TCGPlayer product `709697`: market $6.51 (−63% on chart), 0 live listings
- No blister PSA/CGC/TAG 10 solds — PSA extrapolation still unconfirmed by prints

## View locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## GitHub Pages

`https://mastersquidwardo-blip.github.io/gengar-por-dashboard/`

## Data

- `data/por-blister-pcg-model.json` — machine-readable model
- `data/por-blister-pcg-model.md` — full notes / formulas (Sep 10 writeup; JSON is fresher)

## Stack

Zero-build: HTML + CSS + Chart.js (CDN).
