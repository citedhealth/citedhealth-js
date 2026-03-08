/**
 * CitedHealth API client — TypeScript wrapper for citedhealth.com REST API.
 *
 * Zero dependencies. Uses native `fetch`.
 */

import type {
  BadgeData,
  EvidenceLink,
  Ingredient,
  PaginatedResponse,
  Paper,
} from "./types.js";

export class CitedHealth {
  private baseUrl: string;

  constructor(baseUrl = "https://citedhealth.com") {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  private async get<T>(
    path: string,
    params?: Record<string, string>,
  ): Promise<T> {
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<T>;
  }

  /** Search supplement ingredients by name, category, or keyword. */
  async ingredients(options?: {
    q?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Ingredient>> {
    const params: Record<string, string> = {};
    if (options?.q) params.q = options.q;
    if (options?.category) params.category = options.category;
    if (options?.page) params.page = String(options.page);
    if (options?.pageSize) params.page_size = String(options.pageSize);
    return this.get<PaginatedResponse<Ingredient>>(
      "/api/ingredients/",
      params,
    );
  }

  /** Search PubMed-indexed papers by title or keyword. */
  async papers(options?: {
    q?: string;
    year?: number;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Paper>> {
    const params: Record<string, string> = {};
    if (options?.q) params.q = options.q;
    if (options?.year) params.year = String(options.year);
    if (options?.page) params.page = String(options.page);
    if (options?.pageSize) params.page_size = String(options.pageSize);
    return this.get<PaginatedResponse<Paper>>("/api/papers/", params);
  }

  /** Check evidence for a supplement-condition pair. */
  async evidence(options?: {
    ingredient?: string;
    condition?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<EvidenceLink>> {
    const params: Record<string, string> = {};
    if (options?.ingredient) params.ingredient = options.ingredient;
    if (options?.condition) params.condition = options.condition;
    if (options?.page) params.page = String(options.page);
    if (options?.pageSize) params.page_size = String(options.pageSize);
    return this.get<PaginatedResponse<EvidenceLink>>(
      "/api/evidence/",
      params,
    );
  }

  /** Get embeddable badge data for an ingredient-condition pair. */
  async badgeData(
    ingredientSlug: string,
    conditionSlug: string,
  ): Promise<BadgeData> {
    return this.get<BadgeData>(
      `/embed/${ingredientSlug}/for/${conditionSlug}/data.json`,
    );
  }
}
