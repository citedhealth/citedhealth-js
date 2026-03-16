import { describe, expect, it } from "vitest";
import type {
  EvidenceLink,
  Ingredient,
  NestedCondition,
  NestedIngredient,
  PaginatedResponse,
  Paper,
} from "../src/types";
import { CitedHealthError, NotFoundError, RateLimitError } from "../src/errors";

describe("types", () => {
  it("Ingredient interface matches API shape", () => {
    const ingredient: Ingredient = {
      id: 1,
      name: "Biotin",
      slug: "biotin",
      category: "vitamin",
      mechanism: "Supports keratin",
      recommended_dosage: { general: "2.5-5mg" },
      forms: ["capsule", "tablet"],
      is_featured: true,
    };
    expect(ingredient.slug).toBe("biotin");
  });

  it("EvidenceLink uses nested refs", () => {
    const link: EvidenceLink = {
      id: 1,
      ingredient: { slug: "biotin", name: "Biotin" },
      condition: { slug: "hair-loss", name: "Hair Loss" },
      grade: "B",
      grade_label: "Good",
      summary: "Supports hair health",
      direction: "positive",
      total_studies: 5,
      total_participants: 300,
    };
    expect(link.grade).toBe("B");
  });

  it("PaginatedResponse wraps results", () => {
    const page: PaginatedResponse<NestedIngredient> = {
      count: 2,
      next: null,
      previous: null,
      results: [
        { slug: "biotin", name: "Biotin" },
        { slug: "magnesium", name: "Magnesium" },
      ],
    };
    expect(page.results).toHaveLength(2);
    expect(page.count).toBe(2);
  });

  it("NestedCondition has slug and name", () => {
    const cond: NestedCondition = { slug: "hair-loss", name: "Hair Loss" };
    expect(cond.slug).toBe("hair-loss");
  });

  it("Paper has pubmed_link", () => {
    const paper: Paper = {
      id: 1,
      pmid: "12345678",
      title: "Biotin and Hair Growth",
      journal: "J Nutr",
      publication_year: 2022,
      study_type: "RCT",
      citation_count: 42,
      is_open_access: true,
      pubmed_link: "https://pubmed.ncbi.nlm.nih.gov/12345678/",
    };
    expect(paper.pmid).toBe("12345678");
  });
});

describe("errors", () => {
  it("NotFoundError has resource and identifier", () => {
    const err = new NotFoundError("Ingredient", "biotin");
    expect(err).toBeInstanceOf(CitedHealthError);
    expect(err.resource).toBe("Ingredient");
    expect(err.identifier).toBe("biotin");
    expect(err.message).toBe("Ingredient not found: biotin");
  });

  it("RateLimitError has retryAfter", () => {
    const err = new RateLimitError(60);
    expect(err.retryAfter).toBe(60);
    expect(err.message).toContain("60");
  });

  it("RateLimitError defaults retryAfter to 0", () => {
    const err = new RateLimitError();
    expect(err.retryAfter).toBe(0);
  });

  it("CitedHealthError is base class", () => {
    const err = new CitedHealthError("test error");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("CitedHealthError");
  });

  it("NotFoundError.name is NotFoundError", () => {
    const err = new NotFoundError("Paper", "12345");
    expect(err.name).toBe("NotFoundError");
  });

  it("RateLimitError.name is RateLimitError", () => {
    const err = new RateLimitError(30);
    expect(err.name).toBe("RateLimitError");
  });
});
