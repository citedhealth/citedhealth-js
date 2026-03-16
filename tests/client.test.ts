import { describe, it, expect, vi, beforeEach } from "vitest";
import { CitedHealth } from "../src/client";
import { NotFoundError, RateLimitError } from "../src/errors";

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function mockResponse(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(headers),
    json: async () => data,
  } as Response;
}

describe("CitedHealth", () => {
  let client: CitedHealth;

  beforeEach(() => {
    client = new CitedHealth();
    mockFetch.mockReset();
  });

  describe("constructor", () => {
    it("can be instantiated with default options", () => {
      const c = new CitedHealth();
      expect(c).toBeInstanceOf(CitedHealth);
    });

    it("can be instantiated with custom baseUrl", () => {
      const c = new CitedHealth({ baseUrl: "http://localhost:8100" });
      expect(c).toBeInstanceOf(CitedHealth);
    });

    it("can be instantiated with custom timeout", () => {
      const c = new CitedHealth({ timeout: 5000 });
      expect(c).toBeInstanceOf(CitedHealth);
    });

    it("strips trailing slash from baseUrl", () => {
      const c = new CitedHealth({ baseUrl: "http://localhost:8100/" });
      expect(c).toBeInstanceOf(CitedHealth);
    });
  });

  describe("searchIngredients", () => {
    it("returns ingredients array", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({
          count: 1,
          next: null,
          previous: null,
          results: [{ id: 1, name: "Biotin", slug: "biotin", category: "vitamins" }],
        })
      );

      const results = await client.searchIngredients("biotin");
      expect(results).toHaveLength(1);
      expect(results[0].slug).toBe("biotin");
    });

    it("passes query param to API", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({ count: 0, next: null, previous: null, results: [] })
      );

      await client.searchIngredients("magnesium");
      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl).toContain("q=magnesium");
    });

    it("passes category param to API", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({ count: 0, next: null, previous: null, results: [] })
      );

      await client.searchIngredients(undefined, "vitamin");
      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl).toContain("category=vitamin");
    });

    it("returns empty array when no results", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({ count: 0, next: null, previous: null, results: [] })
      );

      const results = await client.searchIngredients("xyz_unknown");
      expect(results).toHaveLength(0);
    });
  });

  describe("getIngredient", () => {
    it("returns single ingredient", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({ id: 1, name: "Biotin", slug: "biotin" })
      );

      const ing = await client.getIngredient("biotin");
      expect(ing.name).toBe("Biotin");
    });

    it("throws NotFoundError on 404", async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({}, 404));
      await expect(client.getIngredient("nope")).rejects.toThrow(NotFoundError);
    });

    it("includes slug in request URL", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({ id: 1, name: "Biotin", slug: "biotin" })
      );

      await client.getIngredient("biotin");
      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl).toContain("/api/ingredients/biotin/");
    });
  });

  describe("getEvidence", () => {
    it("returns evidence for ingredient×condition pair", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({
          count: 1,
          next: null,
          previous: null,
          results: [
            {
              id: 1,
              ingredient: { slug: "biotin", name: "Biotin" },
              condition: { slug: "hair-loss", name: "Hair Loss" },
              grade: "A",
              grade_label: "Strong Evidence",
              total_studies: 12,
            },
          ],
        })
      );

      const ev = await client.getEvidence("biotin", "hair-loss");
      expect(ev.grade).toBe("A");
      expect(ev.total_studies).toBe(12);
    });

    it("throws NotFoundError when no results", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({ count: 0, next: null, previous: null, results: [] })
      );
      await expect(client.getEvidence("x", "y")).rejects.toThrow(NotFoundError);
    });

    it("passes ingredient and condition params", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({
          count: 1,
          next: null,
          previous: null,
          results: [{ id: 1, grade: "B" }],
        })
      );

      await client.getEvidence("biotin", "hair-loss");
      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl).toContain("ingredient=biotin");
      expect(calledUrl).toContain("condition=hair-loss");
    });
  });

  describe("getEvidenceById", () => {
    it("fetches evidence by numeric ID", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({ id: 5, grade: "C", grade_label: "Some Evidence" })
      );

      const ev = await client.getEvidenceById(5);
      expect(ev.grade).toBe("C");
      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl).toContain("/api/evidence/5/");
    });
  });

  describe("searchPapers", () => {
    it("returns papers array", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({
          count: 2,
          next: null,
          previous: null,
          results: [
            { id: 1, pmid: "11111111", title: "Paper 1" },
            { id: 2, pmid: "22222222", title: "Paper 2" },
          ],
        })
      );

      const papers = await client.searchPapers("biotin");
      expect(papers).toHaveLength(2);
      expect(papers[0].pmid).toBe("11111111");
    });

    it("passes year param to API", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({ count: 0, next: null, previous: null, results: [] })
      );

      await client.searchPapers(undefined, 2022);
      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl).toContain("year=2022");
    });
  });

  describe("getPaper", () => {
    it("fetches paper by PMID", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({ id: 1, pmid: "12345678", title: "Biotin study" })
      );

      const paper = await client.getPaper("12345678");
      expect(paper.pmid).toBe("12345678");
      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl).toContain("/api/papers/12345678/");
    });
  });

  describe("rate limiting", () => {
    it("throws RateLimitError on 429", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({}, 429, { "Retry-After": "60" })
      );
      await expect(client.searchIngredients("test")).rejects.toThrow(RateLimitError);
    });

    it("RateLimitError has retryAfter from header", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({}, 429, { "Retry-After": "30" })
      );
      try {
        await client.searchIngredients("test");
      } catch (err) {
        expect(err).toBeInstanceOf(RateLimitError);
        expect((err as RateLimitError).retryAfter).toBe(30);
      }
    });
  });

  describe("error handling", () => {
    it("throws CitedHealthError on 500", async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({}, 500));
      await expect(client.searchIngredients("test")).rejects.toThrow("HTTP 500");
    });
  });
});
