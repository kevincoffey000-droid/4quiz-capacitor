# Sentence Generator — Status Report

**Retired as of 2026-07-31.** This was a one-off snapshot written before I had direct access to the shared handoff folder (`C:\Users\USER\OneDrive\Desktop\language-app-scenario-generator`). Now that both sides can read/write there directly, `SYNC_LOG.md` in that folder is the live source of truth — check there instead of this file for anything current. Leaving this in place as a historical record of the Jul 31 state, not for future updates.

---

Written for whoever (human or agent) is also working on this feature, to sync up on what's actually in the repo right now vs. what's still open. Reflects the state as of this write-up — re-check file contents if it's been a while.

## Update: cue gating + gloss-parsing hardening pulled in

Two changes described on the generator side (in a separate "handoff folder" I don't have direct filesystem access to, so these are reconstructed from a description, not a byte-for-byte copy — flagging in case anything drifted):

1. **`resolveCue()` now only returns a cue for round 1** (`if (round.round !== 1) return undefined;` before the existing checks) — every other round returns `undefined`. Verified: only round 1 shows cue text in a real generated scenario, confirmed in both an isolated test and a full browser run.
2. **`primaryGloss()`/`verbGloss()` hardened** against translations that separate senses with `,` or `/` instead of `;`, and now strip parenthetical notes (`"to order (food)"` → `"to order"`). Implemented as a shared `senses()` helper (picks whichever separator is actually present: `;` first, then `/`, then `,`) plus a new `isCleanPhrase()` guard — if a resolved gloss still contains a separator or stray parenthesis after parsing (meaning something didn't parse cleanly), the word is skipped as a lesson-word candidate for that slot entirely, falling back to the narrative-lexicon pick instead of ever inserting a leftover multi-sense/annotated string. Verified with synthetic words using `,`, `/`, and `(...)` in their translations, across all three code paths that call it (ARTICLE_TAGS nouns/adjectives, and the ACTION verb path) — 200+ generations, zero leaked malformed text, and confirmed the *cleaned* value does get used (not just silently always falling back).

`ScenarioPractice.jsx`'s cue rendering (`{prompt.cue && <div className="scenario-cue">...}`) was already safe for `cue === undefined` — that's a plain falsy-and-short-circuit in React, renders nothing, not an empty element. Confirmed by reading the code and by the round-2+ output in the browser test showing no cue line at all.

## On the mojibake question

Investigated where it happened, since it matters for trusting future tagging work:

- The corruption I originally saw was a precise, verifiable signature: UTF-8 bytes read back as Latin-1/Windows-1252 (e.g. `Buffer.from('大学', 'utf8')` reinterpreted byte-by-byte as Latin-1 chars reproduces the exact garbled text I received, and reversing it with `Buffer.from(garbled, 'latin1').toString('utf8')` recovers the original — confirmed on multiple samples).
- But that reversal only worked cleanly for ~14% of characters. The rest have a UTF-8 continuation byte landing in the 0x80–0x9F range, which Latin-1 treats as unprintable C1 control codes — bytes that a purely binary-safe transcoding bug would preserve, but that a text-rendering layer (browser textbox, terminal, clipboard) is likely to drop or alter instead. That's exactly the failure pattern I saw (missing/altered characters, not just invisible ones).
- Conclusion: this points to something in the step that turned the actual file into the text that reached me — not the file itself, and not anything in how I processed it (I never applied the corrupted `word`/`pinyin` fields to anything; HSK1's tagging was cross-checked against this app's own already-correct hanzi with zero mismatches, and HSK2's used position + the unaffected `pos`/`subtype`/`article`/`translation` fields only). I don't have visibility into that upstream step from my side, so I can't pin down the exact tool, but the file itself being clean UTF-8 lines up with everything I found.

## On the translation-reordering divergence

Worth separating two things that are related but not the same:

1. **The encoding corruption** — never affected tagging, since the corrupted fields were never used (see above).
2. **A deliberate choice not to sync `App.jsx`'s `english` field to the lexicon's `translation` field** — this is the actual reason gloss-order fixes (like 病's verb sense moving first) never made it into `App.jsx`. It wasn't the corruption; I chose not to overwrite `english` at all, tags-only, because that field is the polished, learner-facing text from an entirely separate vocab-review pass earlier in this project, and blindly overwriting it with the lexicon's ordering risked undoing intentional editorial choices from that work. The `verbGloss()` fix handles the generator's specific technical need (finding a "to ___" sense) without touching the display text, which is why it's a good fit rather than a workaround to feel bad about.

If full convergence between the lexicon's gloss ordering and `App.jsx`'s display text ever matters (e.g. for consistency once HSK3–9 get tagged), that should be a deliberate word-by-word merge decision, not an automatic overwrite in either direction — flagging it here rather than just doing it.

## TL;DR

The feature works end-to-end and is live in both trainers as the "Sentence Generator" mode. Built, ran it in a real browser through a full 5-round scenario, zero console errors. Two gaps remain before it's complete everywhere: most HSK levels aren't tagged yet, and AI grading is still a stub (by design, pending the personal-AI login work).

## What's wired up right now

- **`src/generator.js`** — the core logic: `ScenarioGenerator`, `pickNextScenario`, `gradeAnswer` (stub), `InMemoryScenarioStorage` (for tests). Plain JS, ES module syntax, zero dependencies beyond built-ins.
- **`src/scenario_data.json`** — tag taxonomy, `response_cues`, the English narrative lexicon, and 13 scenario definitions.
- **`src/scenarioStorage.js`** — exports `CapacitorScenarioStorage`, implementing the `ScenarioStorage` shape via `@capacitor/preferences` (now a real dependency — `^8.0.1`, matching this project's Capacitor 8.4.2 core/android/ios). Values are JSON-encoded under keys namespaced `scenario_*` so they don't collide with the app's existing mastery/bad-list data (which lives directly in `localStorage`, not Preferences).
- **`src/ScenarioPractice.jsx`** — the practice-mode UI. Loads a scenario on mount, walks through rounds (textarea + submit, Enter-to-submit), shows the response cue in italic gold under the prompt text, shows a "Try using..." sidebar of suggested words with a "Show definitions" toggle (reusing the app's existing `.mc-switch` toggle component), and ends on a full transcript screen with "New Scenario" / "← Home".
- Wired into both trainers as `mode === "scenario"` (the "Sentence Generator" card on the home screen) in both `App.jsx` and `RussianApp.jsx`.

## What changed in this pass

1. **Reconciled `ScenarioPractice.jsx`** (which had been built against an earlier round of files) to point at the current `generator.js` / `scenario_data.json` / `CapacitorScenarioStorage`, replacing references to `generator.ts`, the old 3-scenario `scenarioContent.js`, and the original `LocalStorageScenarioStorage`. All of those are gone now (see "Removed" below) — nothing in the repo references them anymore.
2. **Tagged HSK1 (300 words) and HSK2 (200 words)** in `App.jsx` with real `pos` / `subtype` / `article`, sourced from the lexicon handoff data. The handoff JSON's `word`/`pinyin` fields had encoding corruption (mojibake), so rather than trust those, I aligned by array position against the app's own already-correct `HSK1_WORDS`/`HSK2_WORDS` and verified with a cross-check (0 hanzi mismatches on HSK1, and every apparent translation "mismatch" on both lists turned out to be pure gloss-reordering for the same word, not misalignment) before applying anything.
3. **`App.jsx`'s `scenarioLessonWords` mapping** (in the `mode === "scenario"` block) now passes through the real `pos`/`subtype`/`article` instead of hardcoding `pos: "NOUN"` for every word.
4. **Response cues are now rendered** in `ScenarioPractice.jsx` — the data already had them, the UI just wasn't showing them yet.
5. **Fixed a real content bug found during testing**: words tagged `VERB` whose first (display-order) gloss isn't a "to ___" phrase — e.g. 病, tagged VERB, displayed as `"illness; to be sick"` — were producing broken sentences like *"tells you to illness."* Root cause: `primaryGloss()` always takes the first semicolon-separated sense, but this app's own earlier vocab-cleanup pass had reordered some glosses for readability, putting the noun sense first. Fixed in `generator.js`: the ACTION-slot resolver now has a dedicated `verbGloss()` that searches **all** senses for one starting with "to ", falling back to the first only if none match. This is a generator-side fix — none of the HSK display text was touched. Affected 8 words total across HSK1/HSK2 (list below), none of them missing a "to ___" sense entirely, so the fix fully covers all known cases.
   - HSK1: 病 (illness; to be sick), 点 (o'clock; point; to order (food)), 请 (please; to invite)
   - HSK2: 点, 过去 (the past; to go over), 离 (from (a place); to leave), 姓 (surname; to be named), 运动 (sports; to exercise)

## Tested

- `npm run build` — clean, no errors.
- Full end-to-end browser run (Playwright): switched to HSK1, opened "Sentence Generator," played all 5 rounds of a real generated scenario, submitted answers, reached the transcript/replay screen. Confirmed: response cues render, vocab swap-in works, suggested-words sidebar + definitions toggle work, zero console errors throughout.
- Isolated test of the verb-gloss fix: forced the 病 ("illness; to be sick") word into an ACTION slot repeatedly until the 50%-chance swap-in fired, confirmed the output now reads "to be sick," not "illness."

## Not done yet / open items

- **HSK3 through HSK7-9 (10,211 words) have no `pos`/`subtype`/`article` tags yet** — only HSK1/HSK2 (500 words) do. Untagged words still work fine as suggested-word chips, they just never get the lesson-word swap-in bonus in scenario text. This is the largest remaining content task if the goal is full coverage, not just the first two levels.
- **The Russian word list has no `subtype` tagging at all.** `RussianApp.jsx` maps its existing grammar `pos` field through `RU_POS_TO_GENERATOR_POS` so VERB/ADJECTIVE swap-in can work, but there's no `subtype`, so NOUN-gated slots (food/personal/place/body_part/medicine/family/device) never get real Russian vocab swapped in.
- **AI grading is still a stub** — `gradeAnswer()` always returns `null`. The user's typed answer is persisted via `setPendingAnswer` but nothing reads or grades it yet. This was always going to wait on the personal-AI login/BYO-account flow, which is out of scope here.
- **Combo-hash / last-shown history is still a flat list per app install**, not scoped per-user or per-device. Original open question from the handoff docs, still unresolved, probably fine at current scale.

## File inventory

| File | Status |
|---|---|
| `src/generator.js` | Core logic. Plain JS, no build step needed. |
| `src/scenario_data.json` | Tag taxonomy, response cues, English narrative lexicon, 13 scenarios. |
| `src/scenarioStorage.js` | `CapacitorScenarioStorage` — implements `ScenarioStorage` via `@capacitor/preferences`. |
| `src/ScenarioPractice.jsx` | Practice-mode UI component. |
| `src/generator.ts`, `tsconfig.json`, `demo.ts` | **Removed.** Were the typed reference version; this project has no TypeScript build step, so these were dead weight once `generator.js` existed. Don't resurrect `generator.ts` as a "spec" without also porting the verb-gloss fix above into it, or it'll regress. |
| `src/scenarioContent.js` | **Removed.** Superseded by `scenario_data.json` (3 scenarios vs. 13, no response cues, still had the direction-phrase-leak bug that was fixed later). |

## Heads up for whoever picks this up next

- `pos`/`subtype`/`article` now live directly on the HSK word objects in `App.jsx` (alongside `hanzi`/`pinyin`/`english`) rather than in a separate lexicon file — that was a deliberate choice to keep one source of truth instead of two files drifting apart.
- If you tag more HSK levels: don't trust `word`/`pinyin` text from a pasted lexicon file without checking it renders correctly first (mojibake is easy to miss and easy to silently propagate). Aligning by array position against the app's existing word arrays and cross-checking via the (unaffected) `translation`/`pos` fields worked well here.
- Storage is Capacitor Preferences now, not localStorage — if you're testing outside a native shell, Capacitor's web-fallback plugin (`@capacitor/preferences`'s browser implementation) handles it transparently, no extra setup needed, confirmed working in a plain browser dev-server run.
