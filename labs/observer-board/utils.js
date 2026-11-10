export function debounce(fn, wait = 220) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

export function buildCatalog(size = 48) {
  const topics = [
    "closures",
    "prototype",
    "event loop",
    "modules",
    "proxy",
    "generators",
    "maps",
    "sets",
    "weakref",
    "streams",
  ];

  return Array.from({ length: size }, (_, index) => {
    const topic = topics[index % topics.length];
    return {
      id: `item-${index + 1}`,
      title: `${topic} · #${String(index + 1).padStart(2, "0")}`,
      blurb: `card gerado pra exercitar observer + filtro (${topic})`,
      tone: index % 3,
    };
  });
}
