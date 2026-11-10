const clock = document.getElementById("clock");

function tick() {
  if (!clock) return;
  clock.textContent = new Date().toLocaleTimeString("pt-BR", {
    hour12: false,
  });
}

tick();
setInterval(tick, 1000);
