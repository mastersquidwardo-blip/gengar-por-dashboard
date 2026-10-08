# Gengar blister cosmos — price guesses

Plain-English page for the **2026 Perfect Order Gengar `#050/088` cosmos holo from blister packs**.

Stamped GameStop and EB Games cards stay out of the blister comparison. A stamped PSA 10 is only a ceiling.

## October 8, 2026

- **PSA 10:** planning middle **about $550**, band **about $490 to $710**. The reverse-holo math lands near **$487**. A GameStop stamped PSA 10 around **$710** is a hard ceiling. The older **$686** figure is an optimistic read, up near that ceiling.
- **Still zero** graded unstamped blister cosmos sales. CGC slabs exist. None have sold.
- **Ungraded near mint:** about **$4 to $5** on TCGPlayer (product 709697, about 105 listings, heavy volume). The September 24 eBay typical price of $8.83 is stale.
- **PCG pristine:** a soft **about $161**. No public PCG sale yet. There is no formula price for Flawless.
- **Grades back:** order #5011048, 20 blister cosmos cards. Flawless 10 ×1 (certificate #000348838), Pristine 10 ×8, Gem Mint 10 ×6, Gem Mint 9.5 ×4, Near Mint 7 ×1. This looks like the entire public PCG population. Ordered September 7, received about September 11, grades back about October 8.
- **Confidence:** still low to moderate, until the first blister gem sale prints. A high share of Pristine and Flawless, plus a flood of raw copies, adds supply pressure.

### Sep 24 refresh
- eBay plain blister median **$8.83** (n=27); swirl median **$10** (n=8)
- TCGPlayer: **no listings**
- GemRate CGC pop **18** (Pristine **3**, Gems+ **7**, gem rate **38.9%**) — still **0** sales
- Still **0** blister PSA/CGC/TAG gem solds on eBay
- PSA 10 guess **~$686** (flat at the time); PCG pristine base **~$161** (band ~$145–$180)

### Sep 16 refresh
- Pulled 50 eBay sold blister results (47 singles after dropping 4-card lots)
- TCGPlayer product `709697`: market $6.51 (−63% on chart), 0 live listings
- No blister PSA/CGC/TAG 10 solds. The PSA guess was still unconfirmed by a real sale.

## View locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## GitHub Pages

`https://mastersquidwardo-blip.github.io/gengar-por-dashboard/`

## Bulk velocity dashboard

Separate page at `bulk-velocity/index.html`. It does not use the blister price file.

Dark MS-DOS view of days to sell the listed Near Mint bulk. The listing snapshot is embedded in that page (no extra data files).

```bash
python3 -m http.server 8080
# open http://localhost:8080/bulk-velocity/
```

On GitHub Pages: `https://mastersquidwardo-blip.github.io/gengar-por-dashboard/bulk-velocity/`

## Data

- `data/por-blister-pcg-model.json` — machine-readable model
- `data/por-blister-pcg-model.md` — full notes / formulas (Sep 10 writeup; JSON is fresher)

## Stack

Zero-build: HTML + CSS + Chart.js (CDN).
