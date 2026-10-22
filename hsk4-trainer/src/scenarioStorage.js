import { Preferences } from "@capacitor/preferences";

// Capacitor-Preferences-backed implementation of the ScenarioStorage
// interface from generator.js. Preferences only stores strings, so every
// value here is JSON-encoded. Keys are namespaced under "scenario_" to
// avoid colliding with the app's existing mastery/bad-list storage (see
// App.jsx's storageKey(), which uses localStorage directly, not Preferences).

const LAST_SHOWN_KEY = "scenario_last_shown";
const COMBO_HASHES_KEY = "scenario_combo_hashes";
const COMBO_HASH_CAP = 200;
const pendingAnswerKey = (scenarioId, round) => `scenario_pending_${scenarioId}_${round}`;

async function readJSON(key, fallback) {
  const { value } = await Preferences.get({ key });
  if (value == null) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function writeJSON(key, value) {
  await Preferences.set({ key, value: JSON.stringify(value) });
}

export class CapacitorScenarioStorage {
  async getLastShown(scenarioId) {
    const map = await readJSON(LAST_SHOWN_KEY, {});
    return map[scenarioId] ?? null;
  }

  async setLastShown(scenarioId, timestampMs) {
    const map = await readJSON(LAST_SHOWN_KEY, {});
    map[scenarioId] = timestampMs;
    await writeJSON(LAST_SHOWN_KEY, map);
  }

  async getRecentComboHashes() {
    return readJSON(COMBO_HASHES_KEY, []);
  }

  async addComboHash(hash, cap = COMBO_HASH_CAP) {
    const list = await readJSON(COMBO_HASHES_KEY, []);
    list.push(hash);
    while (list.length > cap) list.shift();
    await writeJSON(COMBO_HASHES_KEY, list);
  }

  async setPendingAnswer(scenarioId, round, answerText) {
    await Preferences.set({ key: pendingAnswerKey(scenarioId, round), value: answerText });
  }

  async getPendingAnswer(scenarioId, round) {
    const { value } = await Preferences.get({ key: pendingAnswerKey(scenarioId, round) });
    return value ?? null;
  }

  async clearPendingAnswer(scenarioId, round) {
    await Preferences.remove({ key: pendingAnswerKey(scenarioId, round) });
  }
}
