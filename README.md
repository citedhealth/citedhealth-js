# citedhealth

[![npm](https://img.shields.io/npm/v/citedhealth)](https://www.npmjs.com/package/citedhealth)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Zero Runtime Dependencies](https://img.shields.io/badge/runtime_deps-0-brightgreen)](https://www.npmjs.com/package/citedhealth)

TypeScript client for the [CITED Health](https://citedhealth.com) evidence-based supplement API. Query 74 ingredients, 30 conditions, 152 evidence links, and 2,881 PubMed papers — zero dependencies, native fetch.

CITED Health indexes PubMed research and calculates evidence grades from A (strong: multiple RCTs/meta-analyses) to F (negative: most studies show no effect). The API is free, no authentication required, and returns JSON with CORS enabled.

> **Explore the evidence at [citedhealth.com](https://citedhealth.com)** — [Ingredients](https://citedhealth.com/api/ingredients/) · [Evidence](https://citedhealth.com/api/evidence/) · [Papers](https://citedhealth.com/api/papers/) · [Developer Docs](https://citedhealth.com/developers/)

<p align="center">
  <img src="demo.gif" alt="citedhealth TypeScript client demo — searching biotin evidence grades, PubMed papers, and supplement data from citedhealth.com" width="800">
</p>

## Table of Contents

- [Install](#install)
- [Quick Start](#quick-start)
- [What You Can Do](#what-you-can-do)
  - [Search Supplement Ingredients](#search-supplement-ingredients)
  - [Check Evidence Grades](#check-evidence-grades)
  - [Search PubMed Papers](#search-pubmed-papers)
- [Command-Line Interface](#command-line-interface)
- [Error Handling](#error-handling)
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

const client = new CitedHealth();

// Search ingredients
const ingredients = await client.searchIngredients("biotin");
console.log(ingredients[0].name); // "Biotin"

// Get evidence grade for ingredient-condition pair
const evidence = await client.getEvidence("biotin", "nutritional-deficiency-hair-loss");
console.log(`Grade: ${evidence.grade} — ${evidence.grade_label}`);
// Grade: A — Strong Evidence

// Search PubMed papers
const papers = await client.searchPapers("biotin hair loss");
console.log(`${papers.length} papers found`);
```

## What You Can Do

### Search Supplement Ingredients

Find ingredients by name or filter by category. Each ingredient includes mechanism of action, recommended dosage by population, available forms, and evidence linkage.

| Category | Examples |
|----------|---------|
| vitamins | Biotin, Vitamin D, Vitamin C |
| minerals | Magnesium, Zinc, Iron |
| amino-acids | L-Theanine, Tryptophan, Glycine |
| herbs | Ashwagandha, Valerian, Melatonin |

```typescript
import { CitedHealth } from "citedhealth";

const client = new CitedHealth();

// Search by keyword — returns matching ingredients
const results = await client.searchIngredients("melatonin");
console.log(results[0].mechanism); // "Regulates circadian rhythm..."

// Filter by category
const minerals = await client.searchIngredients(undefined, "minerals");

// Get a specific ingredient by slug
const biotin = await client.getIngredient("biotin");
console.log(biotin.recommended_dosage); // { general: "2.5-5mg", deficiency: "10-30mg" }
```

Learn more: [Browse Ingredients](https://citedhealth.com/) · [Evidence Database](https://citedhealth.com/api/evidence/) · [Developer Docs](https://citedhealth.com/developers/)

### Check Evidence Grades

Every ingredient-condition pair has an evidence grade calculated from peer-reviewed PubMed studies. Grades reflect the strength, consistency, and quantity of evidence.

| Grade | Label | Criteria |
|-------|-------|----------|
| A | Strong Evidence | Multiple RCTs/meta-analyses, consistent positive results |
| B | Good Evidence | At least one RCT, mostly consistent |
| C | Some Evidence | Small studies, some positive signals |
| D | Very Early Research | In vitro, case reports, pilot studies |
| F | Evidence Against | <30% of studies show positive effects |

```typescript
import { CitedHealth } from "citedhealth";

const client = new CitedHealth();

// Get evidence for a specific ingredient-condition pair
const evidence = await client.getEvidence("biotin", "nutritional-deficiency-hair-loss");
console.log(`Grade ${evidence.grade}: ${evidence.total_studies} studies`);
// Grade A: 12 studies

// Evidence includes direction of effect
console.log(evidence.direction); // "positive" | "negative" | "neutral" | "mixed"
console.log(evidence.summary);   // Human-readable summary

// Fetch by ID if you already know it
const ev = await client.getEvidenceById(1);
```

Learn more: [Evidence Reviews](https://citedhealth.com/api/evidence/) · [Grading Methodology](https://citedhealth.com/editorial-policy/) · [Hair Health](https://haircited.com) · [Sleep Health](https://sleepcited.com)

### Search PubMed Papers

All 2,881 papers are indexed from PubMed and enriched with citation data from Semantic Scholar. Filter by keyword or publication year.

```typescript
import { CitedHealth } from "citedhealth";

const client = new CitedHealth();

// Search papers by title/abstract keyword
const papers = await client.searchPapers("melatonin sleep quality");
for (const paper of papers) {
  // Each paper includes PMID, journal, citation count, open access status
  console.log(`[PMID ${paper.pmid}] ${paper.title} (${paper.publication_year})`);
  console.log(`  ${paper.citation_count} citations — ${paper.pubmed_link}`);
}

// Filter by publication year
const recent = await client.searchPapers("biotin", 2023);

// Fetch a specific paper by PubMed ID
const paper = await client.getPaper("12345678");
```

Learn more: [Browse Papers](https://citedhealth.com/papers/) · [OpenAPI Spec](https://citedhealth.com/api/openapi.json) · [REST API Docs](https://citedhealth.com/developers/)

## Command-Line Interface

Query the CITED Health API directly from your terminal:

```bash
# Install globally
npm install -g citedhealth

# Or use without installing
npx citedhealth
```

### Commands

| Command | Description |
|---------|-------------|
| `citedhealth ingredients [query]` | Search supplement ingredients |
| `citedhealth ingredient <slug>` | Get a specific ingredient by slug |
| `citedhealth evidence <ingredient> <condition>` | Get evidence grade for a pair |
| `citedhealth papers [query]` | Search PubMed papers |
| `citedhealth paper <pmid>` | Get a specific paper by PubMed ID |

### Options

| Option | Commands | Description |
|--------|----------|-------------|
| `-c, --category` | `ingredients` | Filter by category (vitamins, minerals, amino-acids, herbs) |
| `-y, --year` | `papers` | Filter by publication year |
| `--json` | all | Compact JSON output (default: pretty-printed) |

### Examples

```bash
# Search ingredients by name
citedhealth ingredients biotin

# Filter ingredients by category
citedhealth ingredients --category vitamins

# Get evidence grade for biotin and hair loss
citedhealth evidence biotin nutritional-deficiency-hair-loss

# Search papers from a specific year
citedhealth papers --year 2024

# Get a specific paper by PubMed ID
citedhealth paper 6764927

# Compact JSON for piping to jq
citedhealth papers --year 2024 --json | jq '.[0].title'
```

## Error Handling

The client throws typed errors for common failure cases:

```typescript
import { CitedHealth, NotFoundError, RateLimitError, CitedHealthError } from "citedhealth";

const client = new CitedHealth();

try {
  const evidence = await client.getEvidence("biotin", "nonexistent-condition");
} catch (err) {
  if (err instanceof NotFoundError) {
    // 404 response or empty result for getEvidence
    console.log(`Not found: ${err.resource} — ${err.identifier}`);
  } else if (err instanceof RateLimitError) {
    // 429 response (500 req/hr anonymous limit)
    console.log(`Rate limited. Retry after ${err.retryAfter}s`);
  } else if (err instanceof CitedHealthError) {
    // Other API errors (5xx, network issues)
    console.log(`API error: ${err.message}`);
  }
}
```

## API Reference

| Method | Description | Returns |
|--------|-------------|---------|
| `searchIngredients(query?, category?)` | Search ingredients by name or category | `Promise<Ingredient[]>` |
| `getIngredient(slug)` | Get ingredient by slug | `Promise<Ingredient>` |
| `getEvidence(ingredientSlug, conditionSlug)` | Get evidence for ingredient-condition pair | `Promise<EvidenceLink>` |
| `getEvidenceById(id)` | Get evidence link by numeric ID | `Promise<EvidenceLink>` |
| `searchPapers(query?, year?)` | Search PubMed papers | `Promise<Paper[]>` |
| `getPaper(pmid)` | Get paper by PubMed ID | `Promise<Paper>` |

Full API documentation: [citedhealth.com/developers/](https://citedhealth.com/developers/)
OpenAPI 3.1.0 spec: [citedhealth.com/api/openapi.json](https://citedhealth.com/api/openapi.json)

### Constructor Options

```typescript
const client = new CitedHealth({
  baseUrl: "https://citedhealth.com", // default
  timeout: 30_000,                    // ms, default 30s
});
```

## TypeScript Types

All types are exported:

```typescript
import type {
  CitedHealthOptions,
  EvidenceLink,
  Ingredient,
  NestedCondition,
  NestedIngredient,
  PaginatedResponse,
  Paper,
} from "citedhealth";

import { CitedHealthError, NotFoundError, RateLimitError } from "citedhealth";
```

## Learn More About Evidence-Based Supplements

- **Tools**: [Evidence Checker](https://citedhealth.com/api/evidence/) · [Ingredient Browser](https://citedhealth.com/) · [Paper Search](https://citedhealth.com/papers/)
- **Browse**: [Hair Health](https://haircited.com) · [Sleep Health](https://sleepcited.com) · [All Ingredients](https://citedhealth.com/api/ingredients/)
- **Guides**: [Grading Methodology](https://citedhealth.com/editorial-policy/) · [Medical Disclaimer](https://citedhealth.com/medical-disclaimer/)
- **API**: [REST API Docs](https://citedhealth.com/developers/) · [OpenAPI Spec](https://citedhealth.com/api/openapi.json)
- **Python**: [citedhealth on PyPI](https://pypi.org/project/citedhealth/)
- **Go**: [citedhealth-go on pkg.go.dev](https://pkg.go.dev/github.com/citedhealth/citedhealth-go)
- **Rust**: [citedhealth on crates.io](https://crates.io/crates/citedhealth)
- **Ruby**: [citedhealth on RubyGems](https://rubygems.org/gems/citedhealth)

## Also Available

| Platform | Install | Link |
|----------|---------|------|
| **PyPI** | `pip install citedhealth` | [PyPI](https://pypi.org/project/citedhealth/) |
| **Go** | `go get github.com/citedhealth/citedhealth-go` | [pkg.go.dev](https://pkg.go.dev/github.com/citedhealth/citedhealth-go) |
| **Rust** | `cargo add citedhealth` | [crates.io](https://crates.io/crates/citedhealth) |
| **Ruby** | `gem install citedhealth` | [RubyGems](https://rubygems.org/gems/citedhealth) |
| **MCP** | `uvx citedhealth-mcp` | [PyPI](https://pypi.org/project/citedhealth-mcp/) |

## License

MIT — see [LICENSE](LICENSE).
