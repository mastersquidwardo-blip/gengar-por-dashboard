# Gengar POR Blister Cosmos — Predictive Path Dashboard

Static dashboard for the **most likely valuation path** of:

**2026 Perfect Order EN Gengar `#050/088` blister cosmos holo**

Tracks extrapolated **PSA 10** and **PCG Pristine 10** (9.5 / 10 / 10 / 10).

> **Blister only.** GameStop / EB Games stamped comps (~$700–825 PSA 10) are **void** for this target.

## Live quotes (model as of 2026-09-10)

| Metric | Most likely |
|--------|-------------|
| PSA 10 (immature path) | **~$685** (ladder ~$545–$840) |
| PCG Pristine 10 | **~$172** (base range ~$150–$195) |
| Confidence | Low–moderate |

## View locally

```bash
# from repo root
python3 -m http.server 8080
# open http://localhost:8080
```

Or open `index.html` via any static file server (fetch needs HTTP, not `file://`).

## GitHub Pages

Repo is public. Enable Pages: **Settings → Pages → Deploy from branch → `main` / root (`/`)**.

Expected URL:

`https://mastersquidwardo-blip.github.io/gengar-por-dashboard/`

## Data

- `data/por-blister-pcg-model.json` — machine-readable model
- `data/por-blister-pcg-model.md` — full notes / formulas

## Stack

Zero-build: HTML + CSS + Chart.js (CDN).
