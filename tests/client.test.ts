import { describe, expect, it } from "vitest";
import { CitedHealth } from "../src/index.js";

describe("CitedHealth", () => {
  it("can be instantiated with default base URL", () => {
    const api = new CitedHealth();
    expect(api).toBeInstanceOf(CitedHealth);
  });

  it("can be instantiated with custom base URL", () => {
    const api = new CitedHealth("http://localhost:8100");
    expect(api).toBeInstanceOf(CitedHealth);
  });

  it("has ingredients method", () => {
    const api = new CitedHealth();
    expect(typeof api.ingredients).toBe("function");
  });

  it("has papers method", () => {
    const api = new CitedHealth();
    expect(typeof api.papers).toBe("function");
  });

  it("has evidence method", () => {
    const api = new CitedHealth();
    expect(typeof api.evidence).toBe("function");
  });

  it("has badgeData method", () => {
    const api = new CitedHealth();
    expect(typeof api.badgeData).toBe("function");
  });
});
