/** A supplement ingredient. */
export interface Ingredient {
  id: number;
  name: string;
  slug: string;
  category: string;
  mechanism: string;
  recommended_dosage: Record<string, string>;
  forms: string[];
  is_featured: boolean;
}

/** Nested ingredient reference in evidence links. */
export interface NestedIngredient {
  slug: string;
  name: string;
}

/** Nested condition reference in evidence links. */
export interface NestedCondition {
  slug: string;
  name: string;
}

/** A PubMed-indexed paper. */
export interface Paper {
  id: number;
  pmid: string;
  title: string;
  journal: string;
  publication_year: number | null;
  study_type: string;
  citation_count: number;
  is_open_access: boolean;
  pubmed_link: string;
}

/** Evidence for an ingredient×condition pair. */
export interface EvidenceLink {
  id: number;
  ingredient: NestedIngredient;
  condition: NestedCondition;
  grade: "A" | "B" | "C" | "D" | "F";
  grade_label: string;
  summary: string;
  direction: "positive" | "negative" | "neutral" | "mixed";
  total_studies: number;
  total_participants: number;
}

/** Paginated API response. */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Client configuration options. */
export interface CitedHealthOptions {
  baseUrl?: string;
  timeout?: number;
}
