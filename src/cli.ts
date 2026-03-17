import { Command } from "commander";
import { CitedHealth } from "./client.js";
import { CitedHealthError, NotFoundError, RateLimitError } from "./errors.js";

const VERSION = "0.3.0";

function format(data: unknown, compact: boolean): string {
  return compact ? JSON.stringify(data) : JSON.stringify(data, null, 2);
}

function handleError(err: unknown): void {
  if (err instanceof NotFoundError) {
    console.error(`Error: ${err.resource} not found — ${err.identifier}`);
  } else if (err instanceof RateLimitError) {
    console.error(`Error: Rate limited. Retry after ${err.retryAfter}s`);
  } else if (err instanceof CitedHealthError) {
    console.error(`Error: ${err.message}`);
  } else {
    console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
  }
  process.exit(1);
}

const program = new Command();
const client = new CitedHealth();

program
  .name("citedhealth")
  .description("CLI for the CITED Health evidence-based supplement API")
  .version(VERSION);

program
  .command("ingredients")
  .description("Search supplement ingredients")
  .argument("[query]", "search query")
  .option("-c, --category <category>", "filter by category (vitamins, minerals, amino-acids, herbs)")
  .option("--json", "compact JSON output")
  .action(async (query: string | undefined, opts: { category?: string; json?: boolean }) => {
    try {
      const results = await client.searchIngredients(query, opts.category);
      console.log(format(results, opts.json ?? false));
    } catch (err) {
      handleError(err);
    }
  });

program
  .command("ingredient")
  .description("Get a specific ingredient by slug")
  .argument("<slug>", "ingredient slug (e.g. biotin, magnesium)")
  .option("--json", "compact JSON output")
  .action(async (slug: string, opts: { json?: boolean }) => {
    try {
      const result = await client.getIngredient(slug);
      console.log(format(result, opts.json ?? false));
    } catch (err) {
      handleError(err);
    }
  });

program
  .command("evidence")
  .description("Get evidence grade for an ingredient-condition pair")
  .argument("<ingredient>", "ingredient slug (e.g. biotin)")
  .argument("<condition>", "condition slug (e.g. hair-loss)")
  .option("--json", "compact JSON output")
  .action(async (ingredient: string, condition: string, opts: { json?: boolean }) => {
    try {
      const result = await client.getEvidence(ingredient, condition);
      console.log(format(result, opts.json ?? false));
    } catch (err) {
      handleError(err);
    }
  });

program
  .command("papers")
  .description("Search PubMed papers")
  .argument("[query]", "search query")
  .option("-y, --year <year>", "filter by publication year", parseInt)
  .option("--json", "compact JSON output")
  .action(async (query: string | undefined, opts: { year?: number; json?: boolean }) => {
    try {
      const results = await client.searchPapers(query, opts.year);
      console.log(format(results, opts.json ?? false));
    } catch (err) {
      handleError(err);
    }
  });

program
  .command("paper")
  .description("Get a specific paper by PubMed ID")
  .argument("<pmid>", "PubMed ID")
  .option("--json", "compact JSON output")
  .action(async (pmid: string, opts: { json?: boolean }) => {
    try {
      const result = await client.getPaper(pmid);
      console.log(format(result, opts.json ?? false));
    } catch (err) {
      handleError(err);
    }
  });

program.parse();
