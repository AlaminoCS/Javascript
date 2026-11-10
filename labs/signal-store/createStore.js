export function createStore(initial) {
  let state = Object.freeze(structuredClone(initial));
  const listeners = new Set();

  return {
    get() {
      return state;
    },
    set(updater) {
      const draft = typeof updater === "function" ? updater(state) : updater;
      state = Object.freeze({ ...draft });
      listeners.forEach((fn) => fn(state));
    },
    subscribe(fn) {
      listeners.add(fn);
      fn(state);
      return () => listeners.delete(fn);
    },
  };
}
