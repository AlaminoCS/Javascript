# Vanilla JS Labs

Três laboratórios pequenos de **JavaScript puro** para mostrar o que a linguagem resolve sozinha: estado, fluxo assíncrono e DOM com performance.

Sem React, sem Vue, sem Vite, sem bundler. Só HTML, CSS e ES modules.

**Demo ao vivo:** [alaminocs.github.io/Javascript](https://alaminocs.github.io/Javascript/)

---

## Do que se trata

Este repo é um portfólio técnico de fundamentos. Cada pasta em `labs/` é uma página completa e independente: você abre, interage e lê o código.

| Lab | Ideia | Conceitos |
| --- | --- | --- |
| [signal-store](./labs/signal-store/) | store próprio com UI reativa | closures, imutabilidade, pub/sub, undo |
| [async-pipeline](./labs/async-pipeline/) | fetch que aguenta falha | `async/await`, timeout, retry, `AbortController` |
| [observer-board](./labs/observer-board/) | lista filtrável com viewport | debounce, eventos, `IntersectionObserver` |

Não é um framework, nem um curso completo. É código curto, legível e rodando no ar.

---

## Como testar (online)

1. Abra a home: [alaminocs.github.io/Javascript](https://alaminocs.github.io/Javascript/)
2. Clique em um dos três cards (**entrar no lab**)
3. Mexa na UI:
   - **signal-store** — adiciona tarefas, marca, desfaz (`undo`), filtra
   - **async-pipeline** — troca o endpoint, roda, força falha/lento, usa **abort**
   - **observer-board** — digita no filtro e rola a lista (os cards acendem na viewport)

Pronto. Não precisa instalar nada.

---

## Como testar (local)

Os arquivos usam `import`/`export`, então **não dá** para abrir o `index.html` direto no `file://`. Precisa de um servidor HTTP na raiz do repo.

```bash
git clone https://github.com/AlaminoCS/Javascript.git
cd Javascript
npx serve .
```

Depois abra o endereço que o `serve` mostrar (geralmente `http://localhost:3000`).

Alternativas:

```bash
# Python
python -m http.server 5500

# VS Code / Cursor
# extensão Live Server na pasta do repo
```

Rotas úteis localmente:

- `/` — home
- `/labs/signal-store/`
- `/labs/async-pipeline/`
- `/labs/observer-board/`

---

## Estrutura

```text
Javascript/
├── index.html              # landing
├── styles/                 # tokens + base + home
├── scripts/home.js
└── labs/
    ├── signal-store/       # createStore + app
    ├── async-pipeline/     # requestWithRetry + app
    └── observer-board/     # debounce + IntersectionObserver
```

Cada lab tem o próprio `index.html`, CSS e JS. A home só aponta para eles.

---

## Stack

- HTML / CSS / JavaScript (ES modules)
- Tipografia: Fraunces, Sora, IBM Plex Mono
- Deploy: GitHub Pages (`main` / raiz)

---

Feito por [AlaminoCS](https://github.com/AlaminoCS) · [portfólio](https://vanderlei.alamino.dev.br/)
