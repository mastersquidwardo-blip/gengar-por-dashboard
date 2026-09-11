# POR Gengar #050/088 — Blister Cosmos Holo PCG Pristine 10 Model

**As of:** 2026-09-10  
**Target:** POR Gengar #050/088 blister cosmos holo only — PCG Pristine 10 (9.5/10/10/10)  
**Exclusion:** ALL GameStop / EB Games stamped comps VOID for blister target

> **VOID:** Prior ~$700–825 GameStop/EB exclusive PSA10 cluster is VOID for blister cosmos. Do not use as blister comps.

> **WEAK COMP FLAG:** WEAK — PriceCharting estimate $240; no hard sold comps on PC page  
> **NO DIRECT PSA10:** NONE — no direct comps; all PSA10_C_POR are extrapolations

---

## 1. Formulas

Finishes: **H** = regular holo, **RH** = reverse holo, **C** = cosmos holo.

### Stack weights
```
w_inv ∝ 1/gem_rate, normalize          # harder gems weigh more
w_eq  = 1/3 each                        # equal-weight sensitivity
```

GemRate PSA gem rates used: H 23.7%, RH 17.9%, C (mini tin) 10.6%.

### α stack (CGC Pristine / PSA10)
```
α_stack = (Σ w_f · CGCP_f) / (Σ w_f · PSA10_f)
```
- Compute **with and without** cosmos when CGCP_C is only an estimate.
- **α_stack_reg_rh** (primary for `from_α` path): H+RH only, using finishes with **real** CGCP sales.
  - 151 RH CGCP not available → use **POR** H guide CGCP $69 + RH sold CGCP $225.
  - Primary weights = `w_inv` renormalized on {H, RH}.

### 151 cosmos multiples
```
β = PSA10_C_151 / PSA10_H_151     # Cos/Reg
γ = PSA10_C_151 / PSA10_RH_151    # Cos/RH
m_raw_cgcP_151C = CGCP_C_151 / Raw_C_151   # primary; FLAG estimate
m_raw_psa_151C  = PSA10_C_151 / Raw_C_151
```

### POR blister cosmos PSA10 (no direct comps)
```
PSA10_C_POR_via_H   = PSA10_H_POR · β
PSA10_C_POR_via_RH  = PSA10_RH_POR · γ
PSA10_C_POR_geo     = √(via_H · via_RH)          # mature reference

maturity = (PSA10_RH_POR / PSA10_H_POR) / (PSA10_RH_151 / PSA10_H_151)
maturity = clip(maturity, 0.25, 1.0)
PSA10_C_POR_immature = PSA10_H_POR · (1 + (β − 1) · maturity)
```

### CGC Pristine cosmos POR
```
CGCP_rawpath   = Raw_C_POR · m_raw_cgcP_151C
CGCP_from_psa  = PSA10_C_POR_* · (CGCP_C_151 / PSA10_C_151)
CGCP_from_α    = PSA10_C_POR_* · α_stack_reg_rh

CGCP_blend = 0.40·rawpath + 0.35·from_α + 0.25·from_psa     # documented
```

### PCG Pristine 10 (9.5 / 10 / 10 / 10)
```
k_pcg ∈ {0.55, 0.70, 0.85}     # low / base / high vs CGC Pristine equiv (PCG colder)
ftm   ∈ {0.00, 0.15, 0.30}     # none / base launch / aggressive first-to-market

PCG = CGCP_blend · k_pcg · (1 + ftm)
```

---

## 2. Filled number tables

### 2a. Weights
| Weight set | H | RH | C |
|------------|--:|---:|--:|
| w_inv (primary) | 0.2193 | 0.2904 | 0.4903 |
| w_eq | 0.3333 | 0.3333 | 0.3333 |
| w_inv H+RH only | 0.4303 | 0.5697 | — |

### 2b. 151 Gengar #094
| Metric | H | RH (mature May+) | C (cosmos) |
|--------|--:|-----------------:|----------:|
| PSA10 median | $250.00 (n=29) | $729.06 (n=12) | $1,342.50 (n=4) |
| Raw | ~$4.25 | — | ~$28 (guide $27.99) |
| PSA10 guide | $250.25 | — | $1,385 |
| CGC 10 Gem | ~$55 ($36–65) | — | $133.50 sold (not Pristine) |
| CGC Pristine | guide $399.87 (cred. sold med $400; dropped $60 outlier) | — | **est. $240 — WEAK, no hard solds** |

| Derived | Value |
|---------|------:|
| β Cos/Reg (stated / exact) | 5.37 / 5.37 |
| γ Cos/RH (stated / exact) | 1.841 / 1.8414 |
| RH/Reg mature | 2.916 |
| m_raw→CGC Pristine C | 8.5714× (**estimate**) |
| m_raw→PSA10 C (sales / guide) | 47.9464× / 49.4643× |
| m_raw→CGC Gem C | 4.7679× |
| CGCP/PSA10 cosmos (est.) | 0.1788 |
| α H-only 151 | 1.5995 |
| α C-only 151 (est.) | 0.1788 |
| α inv H+C 151 (incl. weak C) | 0.288 |
| α eq H+C 151 (incl. weak C) | 0.4018 |

### 2c. POR #050 (blister / set copies — GS/EB excluded)
| Metric | H | RH | C blister |
|--------|--:|---:|----------:|
| Raw | ~$1.54 | ~$2.00 | ~$13.05 (solds $8–20) |
| PSA10 guide | $240 | $296.21 | **none** |
| PSA10 sales | ~$178–$355 | ~$255–$500 | — |
| CGC 10 Gem | ~$36–$50 | ~$36–$50 (one $129.99 outlier) | — |
| CGC Pristine | guide $69 (thin) | **sold $225** (2026-08-03) | — |
| Other | — | — | Gr8 blister $81; Gr9 PC ~$104 (watch GS in Gr9 tabs) |

| Derived | Value |
|---------|------:|
| POR RH/H PSA10 | 1.2342 |
| maturity raw → clipped | 0.4233 → **0.4233** |
| α_stack_reg_rh inv (primary) | **0.5804** |
| α_stack_reg_rh eq (sensitivity) | 0.5483 |

### 2d. POR blister cosmos PSA10 extrapolations
| Path | PSA10_C_POR |
|------|------------:|
| via_H = 240 × 5.37 | **$1,288.80** |
| via_RH = 296.21 × 1.841 | **$545.32** |
| geo mature √(via_H·via_RH) | **$838.34** |
| immature (maturity-scaled) | **$683.91** |

Early-market note: POR RH/H ≈ 1.2342 ≪ 2.916 → cosmos premium **not fully mature**. Prefer **immature** for launch.

### 2e. CGC Pristine cosmos POR paths
Blend: `0.40·rawpath + 0.35·from_α(inv) + 0.25·from_psa_ratio`

| Path | Immature (PSA $683.91) | Mature geo (PSA $838.34) |
|------|---------------------------------------:|------------------------------------------:|
| rawpath | $111.86 | $111.86 |
| from_psa_ratio | $122.26 | $149.87 |
| from_α inv | $396.92 | $486.55 |
| from_α eq (sens.) | $374.98 | $459.65 |
| **blend_inv (preferred)** | **$214.23** | **$252.50** |
| blend_eq sens. | $206.55 | $243.09 |

Reference via_H / via_RH CGCP blend_inv: $364.14 / $179.89.

---

## 3. Scenario matrix — PCG Pristine 10

`PCG = CGCP_blend · k_pcg · (1 + ftm)`

### Immature (preferred launch regime) — CGCP blend $214.23

| k_pcg \ ftm | none (0%) | base (+15%) | aggressive (+30%) |
|-------------|----------:|------------:|------------------:|
| low 0.55 | $117.83 | $135.50 | $153.18 |
| **base 0.70** | **$149.96** | **$172.46** | **$194.95** |
| high 0.85 | $182.10 | $209.41 | $236.73 |

### Mature geo — CGCP blend $252.50

| k_pcg \ ftm | none (0%) | base (+15%) | aggressive (+30%) |
|-------------|----------:|------------:|------------------:|
| low 0.55 | $138.88 | $159.71 | $180.54 |
| base 0.70 | $176.75 | $203.26 | $229.78 |
| high 0.85 | $214.63 | $246.82 | $279.02 |

### PSA-equivalent launch band (reference only)
| Scenario | Extrapolated PSA10 |
|----------|-------------------:|
| Immature | $683.91 |
| Mature geo | $838.34 |
| via_H | $1,288.80 |
| via_RH | $545.32 |

No direct blister cosmos PSA10 comps; extrapolated only. GameStop ~700-825 VOID.

---

## 4. Recommended launch quote

| | PCG Pristine 10 |
|--|----------------:|
| **Base point** (immature × k=0.70 × ftm=+15%) | **$172.46** |
| **Base range** (same k; ftm 0% → +30%) | **$149.96 – $194.95** |
| Bear (immature × k=0.55 × ftm=0%) | $117.83 |
| Bull (immature × k=0.85 × ftm=+30%) | $236.73 |
| Bull if mature geo asserts (k=0.70 × ftm=+15%) | $203.26 |

**Primary scenario:** immature (POR RH/H not yet at 151 mature 2.916×)  
**Underlying CGCP blend (immature):** $214.23  
**Confidence:** **LOW–MODERATE**

### Why this band
- Blister-only: strips GS/EB scarcity channel that produced the voided ~$700–825 PSA10 cluster.
- Raw→151-cosmos-CGCP multiple (~8.5714× on est. $240) maps blister raw ~$13 → ~$112 rawpath; PSA-ratio and α paths pull blend to ~$214.
- PCG not as hot as PSA/CGC → k=0.70 base liquidity discount vs CGC Pristine equivalent.
- Modest +15% first-to-market launch premium that is expected to fade.
- Maturity clip 0.4233 keeps cosmos premium well below full 151 β=5.37×.

### What would invalidate
- First blister-labeled cosmos PSA10 or CGC Pristine solds clear of GS/EB stamps print outside model band
- Hard 151 cosmos CGC Pristine solds replace $240 estimate by >±40%
- POR RH/H PSA10 ratio moves toward ≥2.0 (maturity up) — shift toward mature_geo path
- PCG Pristine 10 on any POR Gengar finish trades at k outside 0.55–0.85 vs CGC Pristine peers
- Blister raw median exits $8–$20 band sustainably
- Contamination: GS/EB stamped comps mislabeled as blister

### Confidence rationale
- No blister cosmos PSA10 solds (n=0)
- 151 cosmos CGC Pristine is PriceCharting estimate $240 with no hard sold comps — WEAK
- 151 cosmos PSA10 n=4 only
- POR RH/H maturity ~0.42 — cosmos premium likely not fully mature
- PCG liquidity discount k∈{0.55,0.70,0.85} is judgmental (PCG colder than PSA/CGC)
- Prior GameStop PSA10 ~$700–825 is VOID for blister target

---

## 5. Explicit void — GameStop / EB Games

**Prior PSA10 cosmos cluster ~$700–825 (and any GS/EB-stamped CGC/other grades) is VOID for this blister model.**

Those comps price the GameStop / EB Games exclusive stamp scarcity channel, not blister pack cosmos. Mixing them into blister launch quotes double-counts exclusivity and will overstate blister PCG Pristine.

---

## 6. Weak-comp flags (do not ignore)

1. **151 cosmos CGC Pristine = $240 PriceCharting estimate — no hard sold comps on the PC page.** Primary `m_raw_cgcP_151C` and `from_psa_ratio` both inherit this weakness. Treat CGCP levels as directional until a real sold prints.
2. **POR blister cosmos PSA10 n = 0.** All PSA10_C_POR figures are algebraic extrapolations.
3. **151 cosmos PSA10 n = 4** (May 2026 cluster only) — β/γ fragile.
4. **POR H CGC Pristine guide $69 is thin.**
5. **Grade 9 blister PC ~$104** — watch GameStop contamination in grade-9 tabs before using as a floor bridge.

---

## 7. Sources (inputs)

- 151 PSA10 medians: prior cleaned analysis (Reg n=29, RH mature May+ n=12, Cosmos n=4)
- 151 / POR PriceCharting guides & solds as of 2026-09-10 (user-provided)
- Gem rates: GemRate Reg 23.7%, RH 17.9%, Cosmos/mini tin 10.6%
- 151 cosmos CGC Pristine $240 = PC estimate only — FLAG WEAK
- POR blister cosmos: raw med ~$13.05; PSA10 n=0; exclude all GS/EB stamped
- POR RH CGC Pristine: use $225 sold 2026-08-03 (not $325 dual ask)
- 151 Reg CGC Pristine: guide $399.87; credible solds median $400 (dropped $60 outlier)

---

## 8. Machine-readable companion

Full numeric dump: `/workspace/por-blister-pcg-model.json`
