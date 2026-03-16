# citedhealth

[![npm version](https://agentgif.com/badge/npm/citedhealth/version.svg)](https://www.npmjs.com/package/citedhealth)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/citedhealth)

TypeScript API client for [Cited Health](https://citedhealth.com) — the evidence-based supplement research platform where every health claim is backed by peer-reviewed PubMed research. Search ingredients, conditions, evidence grades (A-F), and indexed papers. Zero dependencies, uses native `fetch`. Free, no authentication required.

Cited Health maintains a growing network of supplement review sites covering hair health, sleep, and more. The platform indexes PubMed papers, extracts study data using AI, and calculates evidence grades from A (Strong — multiple RCTs/meta-analyses) to F (Negative — most studies show no effect).

> **Explore the evidence at [citedhealth.com](https://citedhealth.com)** — [Ingredients](https://citedhealth.com/api/ingredients/) · [Evidence](https://citedhealth.com/api/evidence/) · [Papers](https://citedhealth.com/api/papers/) · [Developer Docs](https://citedhealth.com/developers/)

## Table of Contents

- [Install](#install)
- [Quick Start](#quick-start)
- [What You Can Do](#what-you-can-do)
  - [Search Ingredients](#search-ingredients)
  - [Check Evidence Grades](#check-evidence-grades)
  - [Search PubMed Papers](#search-pubmed-papers)
  - [Embed Evidence Badges](#embed-evidence-badges)
- [API Reference](#api-reference)
- [TypeScript Types](#typescript-types)
- [Learn More About Evidence-Based Supplements](#learn-more-about-evidence-based-supplements)
- [Also Available](#also-available)
- [License](#license)

## Install

```bash
npm install citedhealth
```

## Quick Start

```typescript
import { CitedHealth } from "citedhealth";

const api = new CitedHealth();

// Search for supplement ingredients
const data = await api.ingredients({ q: "biotin" });
console.log(data.results[0].name); // Biotin

// Check evidence for a supplement-condition pair
const evidence = await api.evidence({ ingredient: "biotin", condition: "hair-loss" });
const link = evidence.results[0];
console.log(`Grade: ${link.grade}, Studies: ${link.total_studies}`);
```

## What You Can Do

### Search Ingredients

Cited Health catalogs supplement ingredients with their mechanisms of action, categories, and evidence profiles. Each ingredient is linked to conditions through evidence grades.

```typescript
import { CitedHealth } from "citedhealth";

const api = new CitedHealth();

// List all ingredients
const all = await api.ingredients();

// Search by name
const results = await api.ingredients({ q: "melatonin" });

// Filter by category (vitamins, herbs, amino-acids, minerals, etc.)
const vitamins = await api.ingredients({ category: "vitamins" });
```

Learn more: [Browse Ingredients](https://citedhealth.com/) · [Developer Docs](https://citedhealth.com/developers/)

### Check Evidence Grades

The evidence grading engine analyzes PubMed studies and calculates grades from A to F:

| Grade | Label | Criteria |
|-------|-------|----------|
| A | Strong | Multiple RCTs/meta-analyses, consistent positive results |
| B | Moderate | At least one RCT, mostly consistent |
| C | Limited | Small studies, some positive signals |
| D | Preliminary | In vitro, case reports, pilot studies |
| F | Negative | <30% of studies show positive effects |

```typescript
import { CitedHealth } from "citedhealth";

const api = new CitedHealth();

// Check evidence for biotin and hair loss
const evidence = await api.evidence({ ingredient: "biotin", condition: "hair-loss" });
for (const link of evidence.results) {
  console.log(`${link.grade}: ${link.ingredient.name} for ${link.condition.name}`);
  console.log(`  ${link.total_studies} studies, ${link.total_participants} participants`);
}
```

Learn more: [Evidence Reviews](https://citedhealth.com/evidence/) · [Grading Methodology](https://citedhealth.com/editorial-policy/)

### Search PubMed Papers

All papers in Cited Health are indexed from PubMed and enriched with citation data from Semantic Scholar.

```typescript
import { CitedHealth } from "citedhealth";

const api = new CitedHealth();

// Search papers by title
const papers = await api.papers({ q: "melatonin sleep quality" });

// Filter by publication year
const recent = await api.papers({ q: "biotin", year: 2024 });
for (const paper of recent.results) {
  console.log(`[PMID ${paper.pmid}] ${paper.title}`);
}
```

Learn more: [Browse Papers](https://citedhealth.com/papers/) · [OpenAPI Spec](https://citedhealth.com/api/openapi.json)

### Embed Evidence Badges

Get badge data to display evidence grades on external sites. Each badge shows the grade, study count, and links back to the full evidence review.

```typescript
import { CitedHealth } from "citedhealth";

const api = new CitedHealth();

const badge = await api.badgeData("biotin", "hair-loss");
console.log(`Grade: ${badge.grade} (${badge.grade_label})`);
console.log(`Studies: ${badge.studies}, Participants: ${badge.participants}`);
console.log(`Evidence page: ${badge.url}`);
```

Or embed directly with a script tag:
```html
<script src="https://citedhealth.com/embed/biotin/for/hair-loss/badge.js"></script>
```

## API Reference

| Method | Description | Parameters |
|--------|-------------|------------|
| `ingredients()` | List/search ingredients | `q`, `category`, `page`, `pageSize` |
| `papers()` | List/search papers | `q`, `year`, `page`, `pageSize` |
| `evidence()` | List evidence links | `ingredient`, `condition`, `page`, `pageSize` |
| `badgeData()` | Get embed badge data | `ingredientSlug`, `conditionSlug` |

## TypeScript Types

All response types are exported for type-safe usage:

```typescript
import type {
  BadgeData,
  Condition,
  EvidenceLink,
  Ingredient,
  PaginatedResponse,
  Paper,
} from "citedhealth";
```

## Learn More About Evidence-Based Supplements

- **API**: [REST API Documentation](https://citedhealth.com/developers/) · [OpenAPI 3.1.0 Spec](https://citedhealth.com/api/openapi.json)
- **Browse**: [Ingredients](https://citedhealth.com/) · [Evidence Reviews](https://citedhealth.com/evidence/) · [Papers](https://citedhealth.com/papers/)
- **Guides**: [Editorial Policy](https://citedhealth.com/editorial-policy/) · [Medical Disclaimer](https://citedhealth.com/medical-disclaimer/)
- **Embed**: [Badge Widget](https://citedhealth.com/developers/#embed-evidence-badges) · [Citation Formats](https://citedhealth.com/developers/)
- **Python**: [PyPI Package](https://pypi.org/project/citedhealth/)

## Also Available

| Platform | Install | Link |
|----------|---------|------|
| **PyPI** | `pip install citedhealth` | [PyPI](https://pypi.org/project/citedhealth/) |
| **MCP** | `uvx --from "citedhealth[mcp]" python -m citedhealth.mcp_server` | [Config](https://pypi.org/project/citedhealth/) |

## License

MIT — see [LICENSE](LICENSE).
