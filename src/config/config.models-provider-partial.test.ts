import { describe, expect, it } from "vitest";
import { validateConfigObject } from "./config.js";

describe("model provider partial config validation", () => {
  it("accepts auth-only provider overrides", () => {
    const res = validateConfigObject({
      models: {
        providers: {
          google: {
            apiKey: { source: "env", provider: "default", id: "GEMINI_API_KEY" },
          },
        },
      },
    });

    expect(res.ok).toBe(true);
  });
});
