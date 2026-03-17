import { CitedHealthError, NotFoundError, RateLimitError } from "./errors.js";
import type {
  CitedHealthOptions,
  EvidenceLink,
  Ingredient,
  PaginatedResponse,
  Paper,
} from "./types.js";

const DEFAULT_BASE_URL = "https://haircited.com";
const DEFAULT_TIMEOUT = 30_000;
const SAFE_SEGMENT = /^[a-zA-Z0-9._-]+$/;

function validateSegment(value: string, label: string): void {
  if (!SAFE_SEGMENT.test(value)) {
    throw new CitedHealthError(`Invalid ${label}: ${value}`);
  }
}

export class CitedHealth {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(options: CitedHealthOptions = {}) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
  }

  private async request<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value) url.searchParams.set(key, value);
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const resp = await fetch(url.toString(), { signal: controller.signal });

      if (resp.status === 429) {
        const retryAfter = parseInt(resp.headers.get("Retry-After") ?? "0", 10);
        throw new RateLimitError(retryAfter);
      }
      if (resp.status === 404) {
        throw new NotFoundError("resource", path);
      }
      if (!resp.ok) {
        throw new CitedHealthError(`HTTP ${resp.status}`);
      }

      return (await resp.json()) as T;
    } finally {
      clearTimeout(timer);
    }
  }

  // ── Ingredients ───────────────────────────────────────────────────

  async searchIngredients(query?: string, category?: string): Promise<Ingredient[]> {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (category) params.category = category;
    const data = await this.request<PaginatedResponse<Ingredient>>("/api/ingredients/", params);
    return data.results;
  }

  async getIngredient(slug: string): Promise<Ingredient> {
    validateSegment(slug, "slug");
    return this.request<Ingredient>(`/api/ingredients/${slug}/`);
  }

  // ── Evidence ──────────────────────────────────────────────────────

  async getEvidence(ingredientSlug: string, conditionSlug: string): Promise<EvidenceLink> {
    validateSegment(ingredientSlug, "slug");
    validateSegment(conditionSlug, "slug");
    const data = await this.request<PaginatedResponse<EvidenceLink>>("/api/evidence/", {
      ingredient: ingredientSlug,
      condition: conditionSlug,
    });
    if (data.results.length === 0) {
      throw new NotFoundError("evidence", `${ingredientSlug} \u00d7 ${conditionSlug}`);
    }
    return data.results[0];
  }

  async getEvidenceById(pk: number): Promise<EvidenceLink> {
    validateSegment(String(pk), "id");
    return this.request<EvidenceLink>(`/api/evidence/${pk}/`);
  }

  // ── Papers ────────────────────────────────────────────────────────

  async searchPapers(query?: string, year?: number): Promise<Paper[]> {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (year !== undefined) params.year = String(year);
    const data = await this.request<PaginatedResponse<Paper>>("/api/papers/", params);
    return data.results;
  }

  async getPaper(pmid: string): Promise<Paper> {
    validateSegment(pmid, "pmid");
    return this.request<Paper>(`/api/papers/${pmid}/`);
  }
}
