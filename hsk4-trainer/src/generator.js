/**
 * Scenario prompt generator -- plain JS version for a React + Capacitor
 * app with no TypeScript build step. Logic-identical to generator.ts
 * (kept as the design reference in this project's outputs, not shipped).
 * JSDoc comments below describe the shapes TypeScript would otherwise
 * enforce at compile time -- nothing here is checked at runtime, so if you
 * pass a malformed object it will just silently misbehave rather than
 * error immediately. Worth keeping in mind if something acts weird.
 *
 * This has three pieces that only make sense once you're talking about a
 * real app with real persistence:
 *
 *   1. ScenarioStorage -- described here as a JSDoc shape, not a class.
 *      It doesn't assume SQLite, Capacitor Preferences, or anything else --
 *      it just declares what needs to persist across app restarts (a
 *      "last shown" timestamp per scenario, a capped list of recent
 *      combo hashes, and one ephemeral pending-answer slot). Wire it up
 *      to whatever you're already using to track "last correct answer"
 *      timestamps -- same shape of data, one more table/keyspace.
 *
 *   2. pickNextScenario -- least-recently-used rotation across scenario
 *      IDs, so scenario types repeat as rarely as possible, with an
 *      override for when the user picks a topic/scenario explicitly
 *      (the "study vocab by topic" mode).
 *
 *   3. Pending-answer storage + a gradeAnswer() stub -- the AI grading
 *      step isn't built yet, so this just stores the user's typed
 *      response in an overwrite-only slot (no history, no accumulation)
 *      and leaves a single function to swap out later once personal-AI
 *      login exists.
 */

// ---------- Shapes (documentation only -- not enforced at runtime) ----------

/**
 * @typedef {"NOUN"|"VERB"|"ADJECTIVE"|"ADVERB"|"PHRASE"|"PRONOUN"|"QUESTION"|"NUMBER"|"MEASURE"|"PARTICLE"} POS
 * @typedef {"food"|"personal"|"place"|"body_part"|"medicine"|"family"|"device"} NounSubtype
 *
 * @typedef {Object} LessonWord
 * @property {string} word
 * @property {string} [pinyin]
 * @property {string} translation
 * @property {POS} pos
 * @property {NounSubtype} [subtype]
 * @property {string} [article] - override for inferArticle, e.g. "a university". Empty string "" means "no article at all".
 *
 * @typedef {Object} ArticleEntry
 * @property {string} article
 * @property {string} text
 *
 * @typedef {string|ArticleEntry} LexiconEntry
 *
 * @typedef {Object} NarrativeLexicon
 * @property {Record<string, LexiconEntry[]>} tags
 *
 * @typedef {Object} ContextSlot
 * @property {string} name
 * @property {string} tag
 * @property {string} [default]
 *
 * @typedef {Object} FreshSlot
 * @property {string} name
 * @property {string} tag
 *
 * @typedef {Object} Round
 * @property {number} round
 * @property {FreshSlot[]} fresh_slots
 * @property {string} template
 * @property {string} [response_type] - key into tag_taxonomy.response_cues
 *
 * @typedef {Object} ScenarioDefinition
 * @property {string} id
 * @property {string} label
 * @property {ContextSlot[]} context_slots
 * @property {Round[]} rounds
 *
 * @typedef {Object} GeneratedPrompt
 * @property {number} round
 * @property {string} text
 * @property {string} [cue] - What the learner should actually say this round -- e.g.
 *   "Ask {person} for what you need." resolved to "Ask the waiter for what you need."
 *   Without this, purely scene-setting rounds ("You're looking for the pharmacy.")
 *   don't make clear that a response is expected at all.
 *
 * @typedef {Object} GeneratedScenario
 * @property {string} scenarioId
 * @property {GeneratedPrompt[]} prompts
 * @property {Record<string, string>} resolvedSlots
 * @property {LessonWord[]} suggestedWords
 *
 * @typedef {Object} ScenarioStorage
 * @property {(scenarioId: string) => Promise<number|null>} getLastShown - epoch ms, or null if never shown
 * @property {(scenarioId: string, timestampMs: number) => Promise<void>} setLastShown
 * @property {() => Promise<string[]>} getRecentComboHashes
 * @property {(hash: string, cap?: number) => Promise<void>} addComboHash - caller/implementation caps list length
 * @property {(scenarioId: string, round: number, answerText: string) => Promise<void>} setPendingAnswer - ephemeral, overwrite-only, not a history
 * @property {(scenarioId: string, round: number) => Promise<string|null>} getPendingAnswer
 * @property {(scenarioId: string, round: number) => Promise<void>} clearPendingAnswer
 *
 * @typedef {Object} GradeResult
 * @property {string} feedback
 * @property {number} [score]
 */

// ---------- Persistence (implement against your own storage) ----------

/** In-memory reference implementation -- useful for tests/demos. Swap for
 * a real Capacitor Preferences / SQLite-backed implementation in the app.
 * Implements the ScenarioStorage shape described above.
 */
export class InMemoryScenarioStorage {
  constructor() {
    this.lastShown = new Map();
    this.comboHashes = [];
    this.pendingAnswers = new Map();
  }

  async getLastShown(scenarioId) {
    return this.lastShown.get(scenarioId) ?? null;
  }
  async setLastShown(scenarioId, timestampMs) {
    this.lastShown.set(scenarioId, timestampMs);
  }
  async getRecentComboHashes() {
    return [...this.comboHashes];
  }
  async addComboHash(hash, cap = 200) {
    this.comboHashes.push(hash);
    if (this.comboHashes.length > cap) this.comboHashes.shift();
  }
  async setPendingAnswer(scenarioId, round, answerText) {
    this.pendingAnswers.set(`${scenarioId}:${round}`, answerText);
  }
  async getPendingAnswer(scenarioId, round) {
    return this.pendingAnswers.get(`${scenarioId}:${round}`) ?? null;
  }
  async clearPendingAnswer(scenarioId, round) {
    this.pendingAnswers.delete(`${scenarioId}:${round}`);
  }
}

// ---------- Grading stub (wire up once personal-AI login exists) ----------

/** Placeholder. Real implementation will send {prompt, answerText} to
 * whatever AI account the user has logged into and return feedback.
 * @param {string} _prompt
 * @param {string} _answerText
 * @returns {Promise<GradeResult|null>}
 */
export async function gradeAnswer(_prompt, _answerText) {
  return null; // not implemented yet -- caller should treat null as "no grading available"
}

// ---------- Rotation-based scenario picker ----------

/** Picks the least-recently-shown scenario (ties broken randomly), so
 * types repeat as rarely as possible over a practice session. Pass
 * opts.forceScenarioId when the user has picked a topic/scenario explicitly
 * (bypasses rotation for that one call, but still updates its timestamp
 * so rotation stays fair afterward).
 * @param {ScenarioDefinition[]} scenarios
 * @param {ScenarioStorage} storage
 * @param {{ forceScenarioId?: string }} [opts]
 * @returns {Promise<ScenarioDefinition>}
 */
export async function pickNextScenario(scenarios, storage, opts) {
  const withTimestamps = await Promise.all(
    scenarios.map(async (s) => ({ scenario: s, lastShown: (await storage.getLastShown(s.id)) ?? 0 }))
  );

  // Date.now() is only millisecond-resolution. Two calls close together
  // (e.g. an app pre-fetching the next scenario right after showing one)
  // can land in the same millisecond, and a tie gets broken randomly --
  // which can pick the same scenario twice in a row and defeat the whole
  // point of rotation. Guarantee strictly-increasing values instead: never
  // less than "now", but always greater than anything already stored.
  const maxExisting = Math.max(0, ...withTimestamps.map((s) => s.lastShown));
  const now = Math.max(Date.now(), maxExisting + 1);

  if (opts?.forceScenarioId) {
    const forced = scenarios.find((s) => s.id === opts.forceScenarioId);
    if (!forced) throw new Error(`Unknown scenario id: ${opts.forceScenarioId}`);
    await storage.setLastShown(forced.id, now);
    return forced;
  }

  const oldest = Math.min(...withTimestamps.map((s) => s.lastShown));
  const candidates = withTimestamps.filter((s) => s.lastShown === oldest);
  const picked = candidates[Math.floor(Math.random() * candidates.length)].scenario;

  await storage.setLastShown(picked.id, now);
  return picked;
}

// ---------- Suggestion weights (see TEMPLATES.md for the reasoning) ----------

const SUGGESTION_WEIGHTS = {
  NOUN: 4, VERB: 4, ADJECTIVE: 4,
  ADVERB: 2, PHRASE: 2,
  PRONOUN: 1, QUESTION: 1, NUMBER: 1, MEASURE: 1, PARTICLE: 1,
};

const ARTICLE_TAGS = new Set(["THING_FOOD", "THING_PERSONAL", "PLACE", "PLACE_DESTINATION", "LANDMARK", "ADJ", "MEDICINE", "DEVICE"]);

/** Joins an article with a word, but an empty-string article means "no
 * article at all" (uncountable nouns like "money", plural-only nouns like
 * "pants") -- naively doing `${article} ${text}` for those would produce
 * a leading space (" money").
 * @param {string} article
 * @param {string} text
 */
function withArticle(article, text) {
  return article ? `${article} ${text}` : text;
}

const INTEGRATION_MAP = {
  NOUN: {
    food: ["THING_FOOD"],
    personal: ["THING_PERSONAL"],
    place: ["PLACE", "PLACE_DESTINATION", "LANDMARK"],
    body_part: ["BODY_PART"],
    medicine: ["MEDICINE"],
    family: ["FAMILY_MEMBER"],
    device: ["DEVICE"],
  },
  VERB: ["ACTION"],
  ADJECTIVE: ["ADJ"],
  ADVERB: [],
  PHRASE: [],
};

function inferArticle(word) {
  return /^[aeiou]/i.test(word.trim()) ? "an" : "a";
}

/** Strips parenthetical usage notes -- "to order (food)" -> "to order",
 * "friend (male)" -> "friend" -- since those read as broken/confusing
 * once dropped into a generated sentence rather than a dictionary entry.
 * @param {string} s
 */
function stripParentheticals(s) {
  return s.replace(/\([^)]*\)/g, "").replace(/\s{2,}/g, " ").trim();
}

/** Splits a word-list translation into individual senses. Most lists use
 * "; " between senses, but some separate with "," or "/" instead -- pick
 * whichever separator the string actually contains (checked in that
 * priority order, since a single sense can legitimately contain a comma
 * or slash that isn't a separator once a semicolon is already present).
 * @param {string} translation
 * @returns {string[]}
 */
function senses(translation) {
  const separator = translation.includes(";") ? ";" : translation.includes("/") ? "/" : ",";
  return translation.split(separator).map((s) => stripParentheticals(s.trim())).filter(Boolean);
}

/** Word-list translations are often multi-gloss ("big; large") for study
 * purposes -- only the first gloss should ever land in a sentence.
 * @param {string} translation
 */
function primaryGloss(translation) {
  return senses(translation)[0] ?? "";
}

/** For the ACTION tag specifically, the swapped-in gloss has to be a verb
 * phrase ("to ___"). Word lists sometimes list a non-verb sense first for
 * display purposes (e.g. "illness; to be sick") -- taking primaryGloss()
 * there would produce "tells you to illness." Search every sense for one
 * that actually reads as a verb phrase before falling back to the first.
 * @param {string} translation
 */
function verbGloss(translation) {
  const list = senses(translation);
  return list.find((s) => /^to\s+/i.test(s)) ?? list[0] ?? "";
}

/** Guards against ever inserting a leftover multi-sense or annotated
 * string into generated scenario text. If primaryGloss()/verbGloss()
 * didn't actually isolate one clean phrase -- it's empty, or a separator
 * / stray parenthesis survived (e.g. the translation used a separator
 * this module doesn't recognize) -- the caller should fall back to a
 * narrative-lexicon pick instead of showing broken text to the learner.
 * @param {string} phrase
 */
function isCleanPhrase(phrase) {
  return phrase.length > 0 && !/[;,/()]/.test(phrase);
}

/** @param {LessonWord} word */
function eligibleTags(word) {
  if (word.pos === "NOUN") {
    if (!word.subtype) return [];
    return INTEGRATION_MAP.NOUN[word.subtype] ?? [];
  }
  if (word.pos === "VERB") return INTEGRATION_MAP.VERB;
  if (word.pos === "ADJECTIVE") return INTEGRATION_MAP.ADJECTIVE;
  return [];
}

// ---------- Core generator ----------

export class ScenarioGenerator {
  /**
   * @param {Record<string, LexiconEntry[]>} lexicon
   * @param {ScenarioStorage} storage
   * @param {number} [historyCap]
   * @param {Record<string, string>} [responseCues] - Passed in rather than hardcoded (like
   *   `lexicon`), since it's UI-language text that belongs in scenario_data.json
   *   (tag_taxonomy.response_cues), not baked into the generator itself.
   */
  constructor(lexicon, storage, historyCap = 200, responseCues = {}) {
    this.lexicon = lexicon;
    this.storage = storage;
    this.historyCap = historyCap;
    this.responseCues = responseCues;
  }

  resolveCue(round, resolved) {
    // Only round 1 gets an explicit "what to say" cue. Round 1 is pure
    // scene-setting ("You're looking for the pharmacy.") with no built-in
    // question or request, so it's genuinely ambiguous what the learner
    // should type. Rounds 2-5 already contain a question, request, or
    // reaction to respond to, so an explicit cue there is redundant noise
    // (confirmed by user testing). response_type is still set on every
    // round in scenario_data.json in case that design decision changes
    // later -- this is the only gate.
    if (round.round !== 1) return undefined;
    if (!round.response_type) return undefined;
    const cueTemplate = this.responseCues[round.response_type];
    if (!cueTemplate) return undefined;
    return cueTemplate.replace(/\{(\w+)\}/g, (_, key) => resolved[key] ?? `{${key}}`);
  }

  formatEntry(tag, entry) {
    if (ARTICLE_TAGS.has(tag) && typeof entry !== "string") {
      return withArticle(entry.article, entry.text);
    }
    return entry;
  }

  pick(tag, exclude) {
    const options = this.lexicon[tag] ?? [];
    const filtered = options.filter((o) => !exclude.has(this.formatEntry(tag, o)));
    const pool = filtered.length > 0 ? filtered : options;
    return this.formatEntry(tag, pool[Math.floor(Math.random() * pool.length)]);
  }

  comboHash(values) {
    // Simple, dependency-free string hash (djb2). Good enough for
    // "have we shown this exact combo recently" -- not cryptographic.
    const raw = JSON.stringify(values, Object.keys(values).sort());
    let hash = 5381;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash * 33) ^ raw.charCodeAt(i);
    }
    return (hash >>> 0).toString(16);
  }

  /** Candidates are filtered against alreadyUsed BEFORE picking -- without
   * this, "ordered_item" and "wrong_item" could both resolve to the same
   * lesson noun (e.g. both "tea"), producing "the waiter brings you a tea
   * instead of a tea", which contradicts the scenario's whole premise.
   */
  resolveWithLessonBonus(tag, lessonWords, alreadyUsed) {
    const usedValues = new Set(Object.values(alreadyUsed));
    const candidates = lessonWords.filter((w) => eligibleTags(w).includes(tag));

    const validValues = [];
    for (const word of candidates) {
      let value;
      if (tag === "ACTION") {
        const verb = verbGloss(word.translation).replace(/^to\s+/i, "");
        if (!isCleanPhrase(verb)) continue;
        value = verb;
      } else {
        const gloss = primaryGloss(word.translation);
        if (!isCleanPhrase(gloss)) continue;
        if (ARTICLE_TAGS.has(tag)) {
          // NOTE: must check `!== undefined`, not `word.article || ...` --
          // an explicit article of "" (meaning "no article", e.g. for
          // uncountable "money" or plural-only "pants") is falsy in JS and
          // would otherwise silently fall through to the vowel-sound guess.
          const article = word.article !== undefined ? word.article : inferArticle(gloss);
          value = withArticle(article, gloss);
        } else {
          value = gloss;
        }
      }
      if (!usedValues.has(value)) validValues.push(value);
    }

    if (validValues.length > 0 && Math.random() < 0.5) {
      return validValues[Math.floor(Math.random() * validValues.length)];
    }
    return this.pick(tag, usedValues);
  }

  suggestWords(lessonWords, k = 5) {
    const pool = [...lessonWords];
    const picks = [];
    for (let i = 0; i < Math.min(k, pool.length); i++) {
      const weights = pool.map((w) => SUGGESTION_WEIGHTS[w.pos] ?? 1);
      const total = weights.reduce((a, b) => a + b, 0);
      let r = Math.random() * total;
      let idx = 0;
      for (; idx < weights.length; idx++) {
        r -= weights[idx];
        if (r <= 0) break;
      }
      picks.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return picks;
  }

  /** Resolves one scenario's 5 rounds, rerolling on a repeat combo (checked
   * against persisted history so it survives app restarts).
   * @param {ScenarioDefinition} scenario
   * @param {LessonWord[]} [lessonWords]
   * @param {number} [maxAttempts]
   * @returns {Promise<GeneratedScenario>}
   */
  async generate(scenario, lessonWords = [], maxAttempts = 10) {
    const recentHashes = new Set(await this.storage.getRecentComboHashes());

    let resolved = {};
    let prompts = [];

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      resolved = {};
      for (const slot of scenario.context_slots) {
        resolved[slot.name] = slot.default
          ? slot.default
          : this.resolveWithLessonBonus(slot.tag, lessonWords, resolved);
      }

      prompts = [];
      for (const rnd of scenario.rounds) {
        for (const slot of rnd.fresh_slots) {
          resolved[slot.name] = this.resolveWithLessonBonus(slot.tag, lessonWords, resolved);
        }
        const text = rnd.template.replace(/\{(\w+)\}/g, (_, key) => resolved[key] ?? `{${key}}`);
        const cue = this.resolveCue(rnd, resolved);
        prompts.push({ round: rnd.round, text, ...(cue ? { cue } : {}) });
      }

      const hash = this.comboHash(resolved);
      if (!recentHashes.has(hash)) {
        await this.storage.addComboHash(hash, this.historyCap);
        break;
      }
    }

    return {
      scenarioId: scenario.id,
      prompts,
      resolvedSlots: resolved,
      suggestedWords: this.suggestWords(lessonWords),
    };
  }
}
