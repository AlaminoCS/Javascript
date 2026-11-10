import { createStore } from "./createStore.js";

const seed = {
  pulse: 0,
  onlyOpen: false,
  tasks: [
    { id: crypto.randomUUID(), title: "ler o createStore.js", done: false },
    { id: crypto.randomUUID(), title: "mexer no undo", done: false },
    { id: crypto.randomUUID(), title: "marcar uma tarefa", done: true },
  ],
  history: [],
  events: ["store bootou"],
};

const store = createStore(seed);

const els = {
  form: document.getElementById("taskForm"),
  input: document.getElementById("taskInput"),
  list: document.getElementById("taskList"),
  undo: document.getElementById("undoBtn"),
  clearDone: document.getElementById("clearDoneBtn"),
  onlyOpen: document.getElementById("onlyOpen"),
  pulseBtn: document.getElementById("pulseBtn"),
  pulseValue: document.getElementById("pulseValue"),
  openCount: document.getElementById("openCount"),
  doneCount: document.getElementById("doneCount"),
  historyCount: document.getElementById("historyCount"),
  eventLog: document.getElementById("eventLog"),
};

function pushEvent(message) {
  store.set((s) => ({
    ...s,
    events: [message, ...s.events].slice(0, 12),
  }));
}

function snapshot(tasks) {
  return structuredClone(tasks);
}

function withHistory(nextTasks, label) {
  store.set((s) => ({
    ...s,
    history: [...s.history, snapshot(s.tasks)].slice(-20),
    tasks: nextTasks,
    events: [label, ...s.events].slice(0, 12),
  }));
}

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = els.input.value.trim();
  if (!title) return;

  const task = { id: crypto.randomUUID(), title, done: false };
  withHistory([task, ...store.get().tasks], `add · ${title}`);
  els.input.value = "";
  els.input.focus();
});

els.list.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-action]");
  if (!btn) return;

  const { action, id } = btn.dataset;
  const { tasks } = store.get();

  if (action === "toggle") {
    const next = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task,
    );
    withHistory(next, "toggle tarefa");
  }

  if (action === "remove") {
    withHistory(
      tasks.filter((task) => task.id !== id),
      "remove tarefa",
    );
  }
});

els.undo.addEventListener("click", () => {
  const { history, tasks } = store.get();
  if (!history.length) {
    pushEvent("nada pra desfazer");
    return;
  }

  const previous = history[history.length - 1];
  store.set((s) => ({
    ...s,
    tasks: previous,
    history: s.history.slice(0, -1),
    events: ["undo", ...s.events].slice(0, 12),
  }));

  void tasks;
});

els.clearDone.addEventListener("click", () => {
  const open = store.get().tasks.filter((task) => !task.done);
  withHistory(open, "limpei as feitas");
});

els.onlyOpen.addEventListener("change", () => {
  store.set((s) => ({
    ...s,
    onlyOpen: els.onlyOpen.checked,
    events: [
      els.onlyOpen.checked ? "filtro: só abertas" : "filtro: todas",
      ...s.events,
    ].slice(0, 12),
  }));
});

els.pulseBtn.addEventListener("click", () => {
  store.set((s) => ({
    ...s,
    pulse: s.pulse + 1,
    events: [`pulse ${s.pulse + 1}`, ...s.events].slice(0, 12),
  }));
});

function render(state) {
  const open = state.tasks.filter((task) => !task.done).length;
  const done = state.tasks.length - open;
  const visible = state.onlyOpen
    ? state.tasks.filter((task) => !task.done)
    : state.tasks;

  els.openCount.textContent = String(open);
  els.doneCount.textContent = String(done);
  els.historyCount.textContent = String(state.history.length);
  els.pulseValue.textContent = String(state.pulse);
  els.onlyOpen.checked = state.onlyOpen;
  els.undo.disabled = state.history.length === 0;

  els.list.innerHTML = visible
    .map(
      (task) => `
      <li class="task ${task.done ? "is-done" : ""}">
        <button type="button" data-action="toggle" data-id="${task.id}" class="check" aria-label="alternar">
          ${task.done ? "✓" : ""}
        </button>
        <span>${escapeHtml(task.title)}</span>
        <button type="button" data-action="remove" data-id="${task.id}" class="ghost-x" aria-label="remover">✕</button>
      </li>
    `,
    )
    .join("");

  els.eventLog.innerHTML = state.events
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

store.subscribe(render);
