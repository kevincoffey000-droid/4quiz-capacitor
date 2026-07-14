# HSK 4 Trainer

A minimalist Chinese vocabulary trainer for **New HSK 3.0 Level 4** — 1000 words with four practice modes and progress tracking that remembers the words you find hard.

## Practice modes

- **EN → 汉字** — see English, type the Chinese characters
- **汉字 → EN** — see Chinese, type the English meaning
- **汉字 → Pinyin** — see Chinese, type the pinyin
- **Multiple choice** — see English, pick the right characters

Words you get wrong are added to a "challenging words" list so you can drill them separately. Progress is saved in your browser via `localStorage`.

## Running it locally

You'll need [Node.js](https://nodejs.org) (version 18 or newer).

```bash
npm install      # install dependencies (first time only)
npm run dev      # start the dev server
```

Then open the URL it prints (usually http://localhost:5173) in your browser. Edits to the code hot-reload instantly.

## Other commands

```bash
npm run build    # bundle for production into dist/
npm run preview  # preview the production build locally
```

## Project structure

```
hsk4-trainer/
├── index.html          # page shell
├── src/
│   ├── main.jsx        # React entry point
│   └── App.jsx         # the whole app + word list + styles
├── package.json        # dependencies & scripts
└── vite.config.js      # build config
```

Almost everything lives in `src/App.jsx` — the word list is the `HSK4_WORDS` array near the top, and all styling is in the `STYLES` string.

## Tech

Built with [React](https://react.dev) and [Vite](https://vitejs.dev). No backend — it runs entirely in the browser.
