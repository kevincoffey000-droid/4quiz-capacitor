import { useState, useEffect } from "react";
import { ScenarioGenerator, pickNextScenario, gradeAnswer } from "./generator.js";
import scenarioData from "./scenario_data.json";
import { CapacitorScenarioStorage } from "./scenarioStorage.js";

const SCENARIOS = scenarioData.scenarios;
const RESPONSE_CUES = scenarioData.tag_taxonomy.response_cues;

// Singletons: storage and generator hold no per-render state of their own
// (storage reads/writes through Capacitor Preferences each call), safe to share.
const storage = new CapacitorScenarioStorage();
const generator = new ScenarioGenerator(scenarioData.lexicon_example.tags, storage, 200, RESPONSE_CUES);

export default function ScenarioPractice({ lessonWords = [], onHome }) {
  const [loading, setLoading] = useState(true);
  const [scenario, setScenario] = useState(null); // GeneratedScenario
  const [roundIndex, setRoundIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]); // per-round typed answers, for the end-of-scenario transcript
  const [done, setDone] = useState(false);
  const [expandedWordIndex, setExpandedWordIndex] = useState(null);

  async function loadScenario() {
    setLoading(true);
    setDone(false);
    setRoundIndex(0);
    setAnswer("");
    setAnswers([]);
    setExpandedWordIndex(null);
    const picked = await pickNextScenario(SCENARIOS, storage);
    const generated = await generator.generate(picked, lessonWords);
    setScenario(generated);
    setLoading(false);
  }

  useEffect(() => { loadScenario(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit() {
    if (!scenario) return;
    const prompt = scenario.prompts[roundIndex];
    // Pending-answer storage is a write-only slot for a future AI-grading
    // step to read -- it's never read back into the UI here, so a scenario
    // always starts with an empty answer box, even on a repeat.
    await storage.setPendingAnswer(scenario.scenarioId, prompt.round, answer);
    await gradeAnswer(prompt.text, answer); // stub -- always returns null for now

    const nextAnswers = [...answers, { prompt: prompt.text, answer }];
    setAnswers(nextAnswers);
    if (roundIndex + 1 >= scenario.prompts.length) {
      setDone(true);
    } else {
      setRoundIndex((i) => i + 1);
      setAnswer("");
    }
  }

  function handleTextareaKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  if (loading) {
    return <div className="card done-card">Loading scenario...</div>;
  }

  if (done) {
    return (
      <div className="card">
        <div className="done-label" style={{ textAlign: "center" }}>SCENARIO COMPLETE</div>
        <div className="done-sub" style={{ textAlign: "center" }}>{SCENARIOS.find((s) => s.id === scenario.scenarioId)?.label}</div>
        <div className="convo-thread">
          {answers.map((a, i) => (
            <div key={i} className="convo-pair">
              <div className="convo-bubble convo-bubble-prompt">{a.prompt}</div>
              {a.answer.trim() && <div className="convo-bubble convo-bubble-answer">{a.answer}</div>}
            </div>
          ))}
        </div>
        <div className="done-btns" style={{ marginTop: 16 }}>
          <button type="button" className="btn-gold" onClick={loadScenario}>New Scenario</button>
          {onHome && <button type="button" className="btn-outline" onClick={onHome}>← Home</button>}
        </div>
      </div>
    );
  }

  const prompt = scenario.prompts[roundIndex];
  const total = scenario.prompts.length;

  return (
    <div className="card" style={{ maxWidth: 640 }}>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${((roundIndex + 1) / total) * 100}%` }} /></div>
      <div className="score-line">
        <span>Round {roundIndex + 1} / {total}</span>
      </div>
      <div className="scenario-layout">
        <div className="scenario-main">
          <div className="prompt-label">Scenario</div>
          <div className="prompt-en" style={{ marginBottom: prompt.cue ? 8 : 16 }}>{prompt.text}</div>
          {prompt.cue && <div className="scenario-cue" style={{ marginBottom: 16 }}>{prompt.cue}</div>}
          <textarea
            className="review-textarea"
            placeholder="Type your response... (Enter to submit)"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
            autoFocus
          />
          <button type="button" className="submit-btn" style={{ marginTop: 12 }} onClick={handleSubmit}>
            {roundIndex + 1 >= total ? "FINISH →" : "NEXT ROUND →"}
          </button>
        </div>
        {scenario.suggestedWords.length > 0 && (
          <div className="scenario-sidebar">
            <div className="word-bank-panel">
              <div className="word-bank-title">Tap a word to try using it in your answer</div>
              <div className="word-bank-words">
                {scenario.suggestedWords.map((w, i) => {
                  const isExpanded = expandedWordIndex === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`suggested-word-chip${isExpanded ? " is-expanded" : ""}`}
                      onClick={() => setExpandedWordIndex(isExpanded ? null : i)}
                    >
                      {w.word}
                      {isExpanded && (
                        <span className="suggested-word-detail">
                          {w.pinyin && <span className="suggested-word-pinyin">{w.pinyin}</span>}
                          <span className="suggested-word-def">{w.translation}</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
