/**
 * citedhealth — TypeScript API client for Cited Health.
 *
 * Search supplement ingredients, check evidence grades (A-F),
 * and browse PubMed-indexed papers from citedhealth.com.
 * Zero dependencies, uses native `fetch`.
 *
 * @example
 * ```ts
 * import { CitedHealth } from "citedhealth";
 *
 * const api = new CitedHealth();
 * const results = await api.ingredients({ q: "biotin" });
 * console.log(results.results[0].name); // Biotin
 * ```
 *
 * @packageDocumentation
 */

export { CitedHealth } from "./client.js";

export type {
  BadgeData,
  Condition,
  EvidenceLink,
  Ingredient,
  PaginatedResponse,
  Paper,
} from "./types.js";
