import { requestWithRetry } from "./pipeline.js";

const endpoints = {
  users: "https://jsonplaceholder.typicode.com/users",
  posts: "https://jsonplaceholder.typicode.com/posts?_limit=8",
  fail: "https://httpbin.org/status/500",
  slow: "https://httpbin.org/delay/5",
};

const els = {
  form: document.getElementById("runForm"),
  endpoint: document.getElementById("endpoint"),
  timeoutMs: document.getElementById("timeoutMs"),
  retries: document.getElementById("retries"),
  runBtn: document.getElementById("runBtn"),
  abortBtn: document.getElementById("abortBtn"),
  trace: document.getElementById("trace"),
  output: document.getElementById("output"),
  meta: document.getElementById("meta"),
  statusCard: document.getElementById("statusCard"),
  statusText: document.getElementById("statusText"),
  statusDetail: document.getElementById("statusDetail"),
};

let activeController = null;

function setStatus(state, detail) {
  els.statusCard.dataset.state = state;
  els.statusText.textContent = state;
  els.statusDetail.textContent = detail;
}

function addTrace(text) {
  const item = document.createElement("li");
  item.textContent = `${new Date().toLocaleTimeString("pt-BR", { hour12: false })} · ${text}`;
  els.trace.prepend(item);
}

els.form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (activeController) {
    activeController.abort();
  }

  activeController = new AbortController();
  const key = els.endpoint.value;
  const url = endpoints[key];
  const timeout = Number(els.timeoutMs.value) || 2500;
  const retries = Number(els.retries.value) || 0;
  const started = performance.now();

  els.runBtn.disabled = true;
  els.output.textContent = "// buscando…";
  els.meta.textContent = "—";
  setStatus("loading", `tentando ${key}`);
  addTrace(`start · ${key}`);

  try {
    const data = await requestWithRetry(url, {
      timeout,
      retries,
      signal: activeController.signal,
      onAttempt({ attempt, total, phase, message }) {
        if (phase === "start") addTrace(`attempt ${attempt}/${total}`);
        if (phase === "error") addTrace(`falhou · ${message}`);
        if (phase === "aborted") addTrace("abortado");
        if (phase === "ok") addTrace(`ok · attempt ${attempt}`);
      },
    });

    const elapsed = Math.round(performance.now() - started);
    els.output.textContent = JSON.stringify(data, null, 2);
    els.meta.textContent = `${elapsed}ms · ${Array.isArray(data) ? data.length + " itens" : "objeto"}`;
    setStatus("success", "pipeline concluiu");
  } catch (error) {
    const aborted = error?.name === "AbortError";
    els.output.textContent = `// ${aborted ? "request abortada" : error.message}`;
    els.meta.textContent = "falha";
    setStatus(aborted ? "aborted" : "error", aborted ? "você cancelou" : "sem resposta útil");
    addTrace(aborted ? "fim · abort" : `fim · ${error.message}`);
  } finally {
    els.runBtn.disabled = false;
    activeController = null;
  }
});

els.abortBtn.addEventListener("click", () => {
  if (!activeController) {
    addTrace("nada pra abortar");
    return;
  }
  activeController.abort();
  addTrace("abort solicitado");
});
