# Trumpbeta: test-portfolio selection
Decision date: 13 October 2026. Status: research-design recommendation; no regressions or policy-effect estimates have been produced.

## Recommendation

Use **all 49 Kenneth French industry portfolios, monthly value-weighted total returns**, as the primary test assets. Use **all 25 size–book-to-market portfolios** as the strongest alternative-sort robustness test and **all 10 industry portfolios** as an aggregation robustness test. Use the US **Fama–French five-factor (2x3) series plus RF** for every specification.

This prioritizes interpretable differences between industries while retaining an established asset-pricing comparison. It is a methodological judgment, not evidence that the policy factor improves fit. It is conditional on constructing the policy proxy independently of test-asset returns; otherwise mechanical overlap must be addressed first.

## Verified availability and comparison

Direct downloads from Dartmouth returned HTTP 200 on the decision date. All four ZIP archives passed CRC integrity checks, their CSVs were readable, and the first monthly return blocks had the expected dimensions.

| Dataset | Verified monthly span | Role and policy interpretation | Statistical and visualization trade-off |
|---|---|---|---|
| 49 industries | July 1926–August 2026 | **Primary.** Separates Banks, Insur, Chips, Steel, Autos, Aero, Guns, Oil and other industries. These permit hypotheses about distinct policy channels. | More detailed exposure comparisons and a 49-row coefficient/fit heatmap; more individual tests, correlated returns and potentially thin industries. Early history contains missing values. |
| 10 industries | July 1926–August 2026 | **Aggregation robustness.** Broad energy, technology, manufacturing and other groups. | Ten bars or a compact heatmap are easy to present. Broad categories can combine firms with opposite exposures; financial industries are absorbed into Other. Fewer outcomes do not increase the time observations per regression. |
| 25 size–book-to-market (5x5) | July 1926–August 2026 | **Alternative-sort robustness.** Tests whether incremental fit extends beyond industry groupings. | Natural 5x5 heatmaps for policy loadings and changes in adjusted R²; indirect policy interpretation and close alignment with FF size/value construction. |
| FF5 (2x3) + RF | July 1963–August 2026 | Benchmark regressors and risk-free rate; **not a test-portfolio universe**. | Six numeric columns: five factors plus RF. Limits the longest common FF5 sample to July 1963 onward. |

The industry and size–value CSVs contain both value- and equal-weighted returns and other tables. Availability checks here concern the **first monthly value-weighted return block**. There are 1,202 monthly rows in each portfolio block and 758 in FF5. The 49-industry block contains 2,868 missing-value sentinel cells across its entire history; do not interpret its 1926 starting date as complete coverage for every industry.

For January 2017–August 2026, each checked block has 116 monthly rows and **zero -99.99/-999 sentinel cells**. This verifies availability in that window, not policy-factor coverage, economic significance or model performance. Daily variants are officially listed but were not downloaded or audited in this task. Annual data are too coarse for the intended policy analysis.

Construction sources: [49 industries][s49], [10 industries][s10], [25 size–value portfolios][s25], [FF5][s5]. Industry assignment uses historical SIC information at each June formation; size–value portfolios use June size and lagged book equity with NYSE breakpoints.

## Why these choices

**49 industries:** Banks versus insurance, chips versus other technology, and steel versus broader manufacturing give clearer hypotheses than broad sector averages. Actual tariff, tax, procurement or regulatory exposure still requires dated external evidence: an industry label does not establish exposure or its sign. Value weighting represents exposure of invested market capital but can let large firms dominate; equal weighting is an optional weighting sensitivity test and changes the economic question toward the typical firm.

**25 portfolios:** Their separate sorting rule provides a more demanding generalization check than merely changing industry granularity. However, they share stocks and size/value characteristics with FF5. FF5 is constructed from 2x3 sorts, so the 5x5 returns are **not identical factor-construction portfolios**; overlap is legitimate but benchmark fit is naturally advantaged. Industry portfolios also share underlying stocks with FF5, so none is a statistically independent replication sample.

**10 industries:** Use the published series, not a simple average of 49 returns, which would generally impose different weights. This test asks whether results survive aggregation, not whether independent data reproduce them. Show selected policy-relevant 49-industry coefficients with confidence intervals, a full 49-industry fit heatmap, a ten-industry overview, and a 5x5 robustness heatmap. Do not select displayed industries because they have the largest estimated effects.

## Lock the design before regression

1. **Specify the policy proxy and common window.** It must vary over time, have a documented unit/sign, and use dated information. A constant in-office indicator cannot be identified against an intercept in an in-office-only sample. A generic uncertainty index requires justification before it can be called Trump-specific. Do not code missing proxy observations as zero.
2. **Choose sample treatment explicitly.** January 2017–August 2026 offers 116 available return months, but includes another administration. Use that continuous window only if the proxy is defined meaningfully throughout and administration interactions/regime treatment are prespecified. Approximate in-office windows January 2017–December 2020 and January 2025–August 2026 contain 48 and 20 months, respectively; pooled, 68. January inauguration months mix administrations; test their exclusion and justify treatment of January 2021. Pooling terms assumes stable policy loadings, so examine term differences. Twenty months cannot support a strong standalone second-term conclusion. Earlier data extend history, not Trump-policy identification.
3. **Align comparable returns.** Extract monthly total-return blocks, replace documented missing codes with NA, convert percent returns consistently, and merge by month. Regress each portfolio's return minus RF on Mkt-RF, SMB, HML, RMW and CMA, then add the policy proxy. Mkt-RF is already excess return; do not subtract RF again. Use exactly the same observations in each nested comparison.
4. **Evaluate incremental fit honestly.** Raw in-sample R² cannot fall when adding a regressor. Report change in adjusted R², policy coefficients with HAC confidence intervals, and a robust nested Wald test. Report all 49 outcomes and use a prespecified multiplicity adjustment such as Holm. Check factor correlations and collinearity. More portfolios are not more independent time observations; preserve contemporaneous cross-industry dependence in any joint inference. A classical 49-asset GRS test is infeasible in a 48-month sample because its residual covariance cannot have full rank; it is not required for the fit question.
5. **Prevent circularity and look-ahead.** Prefer a policy measure external to tested returns. If the new factor is a return spread made from these industries, directly related test assets can gain fit mechanically. Use genuinely disjoint construction/test assets or carefully documented leave-out designs; an alternative sort or a later time holdout alone does not eliminate constituent overlap. Freeze exposure classifications, event selection and transformations before inspecting outcomes. Estimate normalization/PCA/orthogonalization only on training data for any chronological holdout. Current French series revise history and are not a point-in-time trading dataset.
6. **Separate explanatory fit from stronger claims.** Where sample length permits, use a chronological holdout or expanding-window comparison. Contemporaneous realized policy inputs support held-out explanatory fit, not an implementable forecast unless available at forecast time. Better fit does not establish causality, a priced risk premium, fair value or trading alpha. Policy dates can coincide with other macroeconomic news.

Download all returns and factors from the same current vintage and retain retrieval dates/checksums. French switched to CRSP CIZ starting with the January 2025 release, including a changed dividend-reinvestment convention, and reconstructs historical series. Do not splice legacy FIZ history into current CIZ data without reconciliation. See the [original Data Library][slib].

## Five-person ownership

| Person | Deliverable before implementation |
|---|---|
| 1 | Return/factor extraction plan, missing-data and common-date audit |
| 2 | Policy-proxy definition, dated sources and exposure hypotheses |
| 3 | Nested regression specifications and prespecified sample windows |
| 4 | Inference, multiplicity, overlap and look-ahead review |
| 5 | Visualization plan and consolidated methods write-up |

## Original downloads and reproducibility record

Base URL: https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp/

| File | ZIP SHA-256 |
|---|---|
| [F-F_Research_Data_5_Factors_2x3_CSV.zip][d5] | 36756c5c2559648519ac4b22913d860c6afd865cfebce920e3e8927f8e2d10b7 |
| [25_Portfolios_5x5_CSV.zip][d25] | e02edcd282d8993cf3133e71181665f888ecb57c202a99a9cbd6cdf7fc6b8429 |
| [10_Industry_Portfolios_CSV.zip][d10] | ebd937a4b995d821867aeb956a96f09a666386f38fa82516b7d1767ee4a49ae5 |
| [49_Industry_Portfolios_CSV.zip][d49] | 16b3f20bf5bd1db8f5cd7a1b29f5cab1350eb0d5106c5309f77a6629590b1c0e |

All downloaded CSV headers identify the 202608 CRSP database. These hashes identify the checked vintage; upstream revisions will change them. [OpenBB's pinned constants][openbb] confirms the identifiers and original base URL, but the availability evidence above comes from direct Dartmouth downloads.

This document alone records the portfolio decision. It does not scaffold code, install dependencies, construct a policy factor or report regression results.

[s49]: https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/Data_Library/det_49_ind_port.html
[s10]: https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/Data_Library/det_10_ind_port.html
[s25]: https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/Data_Library/tw_5_ports.html
[s5]: https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/Data_Library/f-f_5_factors_2x3.html
[slib]: https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html
[d5]: https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp/F-F_Research_Data_5_Factors_2x3_CSV.zip
[d25]: https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp/25_Portfolios_5x5_CSV.zip
[d10]: https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp/10_Industry_Portfolios_CSV.zip
[d49]: https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp/49_Industry_Portfolios_CSV.zip
[openbb]: https://github.com/openbq-org/OpenBB/blob/7c9d4221bdf66965e3f6c7f4dc6ee848073e5ae2/openbb_platform/providers/famafrench/openbb_famafrench/utils/constants.py
