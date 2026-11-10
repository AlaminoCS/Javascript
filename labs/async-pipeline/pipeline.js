function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timer = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export async function requestWithRetry(url, options = {}) {
  const {
    timeout = 2500,
    retries = 2,
    signal,
    onAttempt,
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const onOuterAbort = () => controller.abort();
    signal?.addEventListener("abort", onOuterAbort, { once: true });

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    onAttempt?.({
      attempt: attempt + 1,
      total: retries + 1,
      phase: "start",
    });

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      signal?.removeEventListener("abort", onOuterAbort);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      onAttempt?.({
        attempt: attempt + 1,
        total: retries + 1,
        phase: "ok",
      });
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      signal?.removeEventListener("abort", onOuterAbort);
      lastError = error;

      const aborted = error?.name === "AbortError";
      onAttempt?.({
        attempt: attempt + 1,
        total: retries + 1,
        phase: aborted && signal?.aborted ? "aborted" : "error",
        message: error.message,
      });

      if (signal?.aborted) throw error;
      if (attempt === retries) break;

      const backoff = 250 * 2 ** attempt;
      await wait(backoff, signal);
    }
  }

  throw lastError;
}
