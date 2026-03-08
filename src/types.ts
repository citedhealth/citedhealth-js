/**
 * Cited Health API response types.
 */

/** Paginated list response wrapper. */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Ingredient summary in list responses. */
export interface Ingredient {
  slug: string;
  name: string;
  category: string;
  mechanism: string;
  description: string;
  url: string;
}

/** Condition summary in list responses. */
export interface Condition {
  slug: string;
  name: string;
  description: string;
  url: string;
}

/** Evidence link between an ingredient and condition. */
export interface EvidenceLink {
  ingredient: { slug: string; name: string };
  condition: { slug: string; name: string };
  grade: string;
  grade_label: string;
  total_studies: number;
  total_participants: number;
  direction: string;
  url: string;
}

/** Paper indexed from PubMed. */
export interface Paper {
  pmid: string;
  title: string;
  abstract?: string;
  publication_year: number;
  journal?: string;
  citation_count: number;
  url: string;
}

/** Badge data for embedding evidence grades on external sites. */
export interface BadgeData {
  ingredient: string;
  condition: string;
  grade: string;
  grade_label: string;
  studies: number;
  participants: number;
  direction: string;
  url: string;
  embed_js: string;
}
