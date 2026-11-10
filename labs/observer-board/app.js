import { buildCatalog, debounce } from "./utils.js";

const catalog = buildCatalog(48);

const els = {
  search: document.getElementById("search"),
  board: document.getElementById("board"),
  seenList: document.getElementById("seenList"),
  visibleCount: document.getElementById("visibleCount"),
  filteredCount: document.getElementById("filteredCount"),
  lastKey: document.getElementById("lastKey"),
};

const visible = new Set();
let observer;

function paint(items) {
  if (observer) observer.disconnect();
  visible.clear();

  els.board.innerHTML = items
    .map(
      (item) => `
      <article class="card tone-${item.tone}" data-id="${item.id}">
        <header>
          <span class="mono">${item.id}</span>
          <span class="badge">offscreen</span>
        </header>
        <h3>${item.title}</h3>
        <p>${item.blurb}</p>
      </article>
    `,
    )
    .join("");

  els.filteredCount.textContent = String(items.length);
  syncSeen();

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const card = entry.target;
        const badge = card.querySelector(".badge");
        const id = card.dataset.id;

        if (entry.isIntersecting) {
          card.classList.add("is-inview");
          badge.textContent = "in view";
          visible.add(id);
        } else {
          card.classList.remove("is-inview");
          badge.textContent = "offscreen";
          visible.delete(id);
        }
      });
      syncSeen();
    },
    {
      root: els.board,
      threshold: 0.45,
    },
  );

  els.board.querySelectorAll(".card").forEach((card) => observer.observe(card));
}

function syncSeen() {
  els.visibleCount.textContent = String(visible.size);
  const ids = [...visible];
  els.seenList.innerHTML = ids.length
    ? ids.map((id) => `<li>${id}</li>`).join("")
    : "<li class='empty'>nenhum card no viewport</li>";
}

function applyFilter(term) {
  const query = term.trim().toLowerCase();
  const next = query
    ? catalog.filter((item) => item.title.toLowerCase().includes(query) || item.blurb.toLowerCase().includes(query))
    : catalog;
  paint(next);
}

const runFilter = debounce((value) => applyFilter(value), 240);

els.search.addEventListener("input", (event) => {
  els.lastKey.textContent = event.data ?? "⌫";
  runFilter(event.target.value);
});

paint(catalog);
