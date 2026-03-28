import { describe, it, expect, vi } from "vitest";
import { retry } from "../../src/utils/retry";

const testConfig = { maxAttempts: 3, baseDelayMs: 10, maxDelayMs: 100 };

describe("retry", () => {
  it("returns result on first success", async () => {
    const operation = vi.fn().mockResolvedValue("ok");

    const result = await retry(operation, testConfig);

    expect(result).toBe("ok");
    expect(operation).toHaveBeenCalledTimes(1);
  });
});
