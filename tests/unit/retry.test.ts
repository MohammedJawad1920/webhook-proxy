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

  it("retries on failure and succeeds", async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValue("ok");

    const result = await retry(operation, testConfig);

    expect(result).toBe("ok");
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("throws after all attempts exhausted", async () => {
    const error = new Error("always fails");
    const operation = vi.fn().mockRejectedValue(error);

    await expect(retry(operation, testConfig)).rejects.toThrow("always fails");
    expect(operation).toHaveBeenCalledTimes(testConfig.maxAttempts);
  });
});
