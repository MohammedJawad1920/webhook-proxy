const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export async function retry<T>(
  operation: () => Promise<T>,
  config: { maxAttempts: number; baseDelayMs: number; maxDelayMs: number },
): Promise<T> {
  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      // 1. Check if this is the last attempt
      if (attempt === config.maxAttempts - 1) {
        throw error;
      }

      // 2. Otherwise calculate delay and sleep
      const delay = Math.min(
        config.baseDelayMs * 2 ** attempt,
        config.maxDelayMs,
      );
      await sleep(delay);
    }
  }
  throw new Error("Retry loop exited unexpectedly");
}
