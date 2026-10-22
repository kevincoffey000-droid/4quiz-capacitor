import { useEffect, useMemo, useRef, useState } from "react";

// ---- Word mastery model (6 levels: Red..Purple, 0..5) ----
// See "Word Mastery Color System" spec/handoff for the full rationale.
const DAY_MS = 86400000;
const MASTERY_DECAY_DAYS = { 1: 3, 2: 7, 3: 14, 4: 30, 5: 60 };
const MASTERY_FAIL_TARGET = { 1: 0, 2: 0, 3: 0, 4: 2, 5: 3 };
const MASTERY_PROMOTE_DAYS = { 3: 30, 4: 60 };

export const MASTERY_LEVEL_NAMES = ["Struggling", "Shaky", "Improving", "Learned", "Familiar", "Mastered"];
// Colorblind-safe-as-possible for a 6-hue adjacent-pair strip; validated with the
// dataviz skill's palette checker against this app's actual light/dark surfaces.
// Red vs Orange still falls short of the ideal separation floor — that pair leans
// on the legend + per-segment tooltip as secondary encoding.
export const MASTERY_COLORS = {
  light: ["#d33944", "#c14200", "#ad9000", "#00722e", "#0071d6", "#7f42a6"],
  dark: ["#e6424c", "#d35300", "#af8f00", "#0e8c41", "#0080ec", "#9351bd"],
};

// A record missing the mastery fields (pre-existing storage from before this
// feature) gets a one-time best-effort synthesis from its old fields — never
// persisted here, just projected, same as decay below.
export function normalizeMasteryRecord(record, now) {
  if (!record) {
    return { seen: 0, lastCorrect: false, timesOnBadList: 0, correctStreak: 0, lastPracticedAt: 0, level: 0, enteredLevelAt: now, lastCorrectAt: null, firstSeenAt: null };
  }
  if (record.firstSeenAt !== undefined) return record;
  const ts = record.lastPracticedAt || now;
  return {
    ...record,
    level: record.lastCorrect ? 3 : 0,
    enteredLevelAt: ts,
    lastCorrectAt: record.lastCorrect ? ts : null,
    firstSeenAt: ts,
  };
}

// Pure, read-time decay projection — never persisted, safe to call on every render.
export function resolveMasteryState(record, now) {
  if (!record || record.level === 0 || record.lastCorrectAt == null) {
    return { level: record ? record.level : 0, enteredLevelAt: record ? record.enteredLevelAt : now };
  }
  let level = record.level;
  let cursor = record.lastCorrectAt;
  while (level > 0) {
    const windowMs = MASTERY_DECAY_DAYS[level] * DAY_MS;
    if (now >= cursor + windowMs) { cursor += windowMs; level -= 1; } else break;
  }
  return { level, enteredLevelAt: level === record.level ? record.enteredLevelAt : cursor };
}

// Resolves decay first, then applies the new answer on top of wherever the word
// currently sits (decayed or not) — level is the entire state, no separate streak.
export function applyMasteryAnswer(record, correct, now) {
  const prev = normalizeMasteryRecord(record, now);
  const { level, enteredLevelAt } = resolveMasteryState(prev, now);
  let newLevel = level, newEnteredAt = enteredLevelAt, newLastCorrectAt = prev.lastCorrectAt;
  if (correct) {
    if (level <= 2) {
      newLevel = level + 1; newEnteredAt = now;
    } else if (level === 3 || level === 4) {
      const daysAtLevel = (now - enteredLevelAt) / DAY_MS;
      if (daysAtLevel >= MASTERY_PROMOTE_DAYS[level]) { newLevel = level + 1; newEnteredAt = now; }
    }
    newLastCorrectAt = now;
  } else {
    newLevel = MASTERY_FAIL_TARGET[level] ?? 0;
    newEnteredAt = now;
  }
  return { level: newLevel, enteredLevelAt: newEnteredAt, lastCorrectAt: newLastCorrectAt, firstSeenAt: prev.firstSeenAt ?? now };
}

const MASTERY_MIN_SLICE_PX = 4;

// Shaky (level 1) gets a little yellow dot texture on top of its fill — Red/Orange
// sit closest together of the six mastery colors, so this is a secondary,
// non-color signal that survives colorblindness and thin slivers. Red itself
// stays a solid fill. `offsetPx` is the segment's absolute left position within
// the strip, so the dot grid stays phase-aligned across bucket boundaries
// instead of restarting per-segment (which would show as a seam wherever two
// textured segments sit side by side).
const MASTERY_TEXTURED_LEVEL = 1;
const MASTERY_DOT_SIZE = 2.5;
function masteryFillStyle(level, colors, offsetPx = 0) {
  const color = colors[level];
  if (level !== MASTERY_TEXTURED_LEVEL) return { background: color };
  return {
    backgroundColor: color,
    backgroundImage: "radial-gradient(rgba(255, 214, 64, 0.55) 0.4px, transparent 0.7px)",
    backgroundSize: `${MASTERY_DOT_SIZE}px ${MASTERY_DOT_SIZE}px`,
    backgroundPosition: `${-offsetPx}px 0px`,
  };
}

// Progress bar for the currently selected word range: fills as words get their
// first attempt, then — once every word in the range has been seen at least
// once — switches to a bucketed, color-coded view of each word's mastery level.
export function RangeMasteryBar({ words, masteryMap, wordKeyFn, theme, badListCount }) {
  const containerRef = useRef(null);
  const [widthPx, setWidthPx] = useState(400);
  const [previewColors, setPreviewColors] = useState(false);
  const [toggleExpanded, setToggleExpanded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect?.width;
      if (w) setWidthPx(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const now = Date.now();
  const total = words.length;
  const records = useMemo(
    () => words.map(w => normalizeMasteryRecord(masteryMap[wordKeyFn(w)], now)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [words, masteryMap, wordKeyFn]
  );

  if (total === 0) return null;

  const coveredCount = records.filter(r => r.firstSeenAt != null).length;
  const coverage = coveredCount / total;
  const complete = coverage >= 1;
  const showColorView = complete || previewColors;
  const colors = MASTERY_COLORS[theme === "light" ? "light" : "dark"];

  // Always the full-width strip — a word's horizontal position never moves when
  // toggling views. Unseen words render as an empty (track-colored) gap rather
  // than red, so the colored proportion always matches coverage exactly, same
  // as the plain fill bar it replaces.
  let colorView = null;
  if (showColorView) {
    const bucketCount = Math.max(1, Math.min(total, Math.floor(widthPx / MASTERY_MIN_SLICE_PX) || 1));
    const bucketSize = Math.ceil(total / bucketCount);
    const bucketWidthPx = widthPx / bucketCount;
    const buckets = [];
    for (let i = 0; i < total; i += bucketSize) {
      buckets.push(records.slice(i, i + bucketSize));
    }
    colorView = (
      <>
        <div className="range-mastery-strip">
          {buckets.map((recs, bi) => {
            const counts = [0, 0, 0, 0, 0, 0];
            let unseenCount = 0;
            recs.forEach(r => {
              if (r.firstSeenAt == null) unseenCount++;
              else counts[resolveMasteryState(r, now).level]++;
            });
            const bucketTotal = recs.length;
            const title = [
              ...MASTERY_LEVEL_NAMES.map((name, li) => counts[li] > 0 ? `${name}: ${counts[li]}` : null),
              unseenCount > 0 ? `Unseen: ${unseenCount}` : null,
            ].filter(Boolean).join(" · ");
            let cursorPx = bi * bucketWidthPx;
            const segments = [];
            for (let li = 0; li < 6; li++) {
              const c = counts[li];
              if (c > 0) {
                segments.push(<div key={li} style={{ flex: c / bucketTotal, ...masteryFillStyle(li, colors, cursorPx) }} />);
                cursorPx += (c / bucketTotal) * bucketWidthPx;
              }
            }
            return (
              <div key={bi} className="range-mastery-bucket" title={title}>
                {segments}
                {unseenCount > 0 && <div className="range-mastery-unseen" style={{ flex: unseenCount / bucketTotal }} />}
              </div>
            );
          })}
        </div>
        <div className="range-mastery-legend">
          {MASTERY_LEVEL_NAMES.map((name, li) => (
            <span key={li} className="range-mastery-legend-item">
              <span className="range-mastery-legend-swatch" style={masteryFillStyle(li, colors)} />
              {name}
            </span>
          ))}
        </div>
      </>
    );
  }

  const pct = Math.round(coverage * 100);
  return (
    <div className="mastery-box" ref={containerRef}>
      <div className="mastery-header">
        <span className="mastery-label">{complete ? "Word Mastery" : "Range Progress"}</span>
        <span className="mastery-count">{complete ? `${total} words` : `${coveredCount} / ${total}`}</span>
      </div>
      {showColorView ? colorView : (
        <div className="mastery-bar-bg">
          <div className="mastery-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      )}
      {!complete && (
        <div className="range-mastery-preview-row">
          <div className="mastery-sub">{coveredCount} seen · {total - coveredCount} unseen · {badListCount} on bad list</div>
          {toggleExpanded ? (
            <span className="range-mastery-preview-toggle-group">
              <span className="range-mastery-preview-label">Show mastery</span>
              <button
                type="button"
                className={`word-order-switch${previewColors ? " is-shuffled" : ""}`}
                onClick={() => setPreviewColors(v => !v)}
                aria-label="Toggle preview of word mastery colors before the range is fully covered"
              >
                <span className="word-order-switch-knob" />
              </button>
              <button type="button" className="mini-collapse-btn mini-collapse-btn-right" onClick={() => setToggleExpanded(false)} aria-label="Hide mastery preview toggle">▸</button>
            </span>
          ) : (
            <button type="button" className="mini-collapse-btn" onClick={() => setToggleExpanded(true)} aria-label="Show mastery preview toggle">▾</button>
          )}
        </div>
      )}
    </div>
  );
}

export function RoundSizeBox({ roundSize, setRoundSize, options = [20, 50, 100] }) {
  return (
    <div className="range-box" style={{ marginBottom: 16 }}>
      <div className="range-header" style={{ marginBottom: 10 }}>
        <span className="mastery-label">Round Size</span>
        <span className="mastery-count">{roundSize} words</span>
      </div>
      <div className="range-presets">
        {options.map(n => (
          <button
            key={n}
            className={`preset-btn${roundSize === n ? " preset-active" : ""}`}
            onClick={() => setRoundSize(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RangeBox({
  orderedWords, totalWords,
  rangeStart, setRangeStart, rangeEnd, setRangeEnd,
  SUBRANGE_MARKS, dragBaseRef, setDragAnchorIdx, applyBlockRange,
  challengeFilter, setChallengeFilter, editingThreshold, setEditingThreshold,
  challengeThreshold, setChallengeThreshold,
  distributeOrder, setDistributeOrder,
  getChallengingWords, wordLabel,
}) {
  const [wordOrderExpanded, setWordOrderExpanded] = useState(false);
  const hundredBase = Math.floor(rangeStart / 100) * 100;
  const isFullRange = rangeStart === 0 && rangeEnd === totalWords - 1;
  const relStart = rangeStart - hundredBase;
  const relEnd = rangeEnd - hundredBase;
  const thousandTierCount = Math.ceil(totalWords / 1000);
  const thousandBase = Math.floor(rangeStart / 1000) * 1000;
  const thousandTiers = thousandTierCount > 1
    ? Array.from({ length: thousandTierCount }, (_, k) => k * 1000)
    : [];
  const tierStart = thousandBase;
  const tierEnd = Math.min(thousandBase + 999, totalWords - 1);
  const hundredBuckets = (tierEnd - tierStart + 1) > 100
    ? Array.from({ length: Math.ceil((tierEnd - tierStart + 1) / 100) }, (_, i) => [tierStart + i * 100, Math.min(tierStart + i * 100 + 99, totalWords - 1)])
    : [];
  const rangePresets = [...hundredBuckets, [0, totalWords - 1]];

  return (
    <div className="range-box">
      <div className="range-header">
        <span className="mastery-label">Word Range</span>
        <span className="mastery-count">#{rangeStart + 1} – #{rangeEnd + 1} <span style={{ color: "var(--muted-strong)" }}>({rangeEnd - rangeStart + 1} words)</span></span>
      </div>
      <div className="range-main">
        <div className="range-left">
          <div className="range-row">
            <div className="range-group">
              <label className="range-label">From</label>
              <select className="range-select" value={rangeStart} onChange={e => setRangeStart(Math.min(Number(e.target.value), rangeEnd))}>
                {Array.from({ length: totalWords }, (_, i) => (
                  <option key={i} value={i}>#{i + 1} {wordLabel(orderedWords[i])}</option>
                ))}
              </select>
            </div>
            <div className="range-group">
              <label className="range-label">To</label>
              <select className="range-select" value={rangeEnd} onChange={e => setRangeEnd(Math.max(Number(e.target.value), rangeStart))}>
                {Array.from({ length: totalWords }, (_, i) => (
                  <option key={i} value={i}>#{i + 1} {wordLabel(orderedWords[i])}</option>
                ))}
              </select>
            </div>
          </div>
          {thousandTiers.length > 0 && (
            <div className="range-presets range-presets-thousands">
              {thousandTiers.map(t => {
                const tCappedEnd = Math.min(t + 999, totalWords - 1);
                const isActive = !isFullRange && thousandBase === t;
                const activeClass = isActive ? (challengeFilter ? " preset-active-hard" : " preset-active") : "";
                return (
                  <button key={"t" + t} className={`preset-btn preset-btn-thousand${activeClass}`}
                    onClick={() => { setRangeStart(t); setRangeEnd(tCappedEnd); }}>
                    {t}+
                  </button>
                );
              })}
            </div>
          )}
          <div className="range-presets">
            {rangePresets.map(([s, e]) => {
              const cappedE = Math.min(e, totalWords - 1);
              const isAllPreset = s === 0 && cappedE === totalWords - 1;
              const isActive = isAllPreset
                ? isFullRange
                : (!isFullRange && hundredBase === s && rangeStart >= s && rangeEnd <= cappedE);
              const activeClass = isActive ? (challengeFilter ? " preset-active-hard" : " preset-active") : "";
              return (
                <button key={s + "-" + e} className={`preset-btn${activeClass}`}
                  onClick={() => { setRangeStart(s); setRangeEnd(cappedE); }}>
                  {isAllPreset ? "All" : `${s + 1}–${cappedE + 1}`}
                </button>
              );
            })}
          </div>
        </div>
        <div className="subrange-wrap">
          <span className="subrange-num" style={{ visibility: "hidden" }} aria-hidden="true">0</span>
          <span className="subrange-dot" style={{ visibility: "hidden" }} aria-hidden="true" />
          <div className="subrange-col">
            {SUBRANGE_MARKS.flatMap((m, i, marks) => {
              const els = [<span key={`n${m}`} className="subrange-num">{m}</span>];
              if (i < marks.length - 1) {
                const subStart = marks[i];
                const subEnd = marks[i + 1] - 1;
                const dotActive = relEnd < 100 && relStart >= 0 && subStart >= relStart && subEnd <= relEnd;
                const dotActiveClass = dotActive ? (challengeFilter ? " subrange-dot-active-hard" : " subrange-dot-active") : "";
                els.push(
                  <button
                    key={`d${m}`}
                    type="button"
                    data-dot-index={i}
                    className={`subrange-dot${dotActiveClass}`}
                    aria-label={`Select ${subStart + 1}-${subEnd + 1} of current block`}
                    onPointerDown={(e) => {
                      if (e.currentTarget.releasePointerCapture) {
                        try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
                      }
                      dragBaseRef.current = hundredBase;
                      setDragAnchorIdx(i);
                      applyBlockRange(hundredBase, i, i);
                    }}
                  />
                );
              }
              return els;
            })}
          </div>
        </div>
      </div>
      <div className="challenge-row">
        <button
          className={`preset-btn challenge-btn${challengeFilter ? " preset-active" : ""}`}
          onClick={() => { setChallengeFilter(v => !v); setEditingThreshold(false); }}
        >
          Hard ({getChallengingWords(orderedWords.slice(rangeStart, rangeEnd + 1)).length} words)
        </button>
        <div className="word-order-block">
          {wordOrderExpanded ? (
            <>
              <span className="range-label word-order-caption">Word Order</span>
              <div className="word-order-row">
                <span className="word-order-end-label">A–Z</span>
                <button
                  type="button"
                  className={`word-order-switch${distributeOrder ? " is-shuffled" : ""}`}
                  onClick={() => setDistributeOrder(v => !v)}
                  aria-label="Toggle word order between alphabetical and shuffled"
                  title="Distribute order: spreads ranges across the whole list instead of strict alphabetical order"
                >
                  <span className="word-order-switch-knob" />
                </button>
                <span className="word-order-end-label">Shuffled</span>
                <button type="button" className="mini-collapse-btn mini-collapse-btn-right" onClick={() => setWordOrderExpanded(false)} aria-label="Hide word order toggle">▸</button>
              </div>
            </>
          ) : (
            <button type="button" className="mini-collapse-btn" onClick={() => setWordOrderExpanded(true)} aria-label="Show word order toggle">▾</button>
          )}
        </div>
      </div>
      {challengeFilter && (
        <div className="threshold-note">
          practice words with{" "}
          {editingThreshold ? (
            <input
              className="threshold-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
              defaultValue={challengeThreshold}
              onBlur={e => { setChallengeThreshold(Math.max(1, Number(e.target.value) || 4)); setEditingThreshold(false); }}
              onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
            />
          ) : (
            <button className="threshold-chip" onClick={() => setEditingThreshold(true)}>
              {challengeThreshold}≤
            </button>
          )}
          {" "}incorrect answers from {isFullRange ? "All words" : `${rangeStart + 1}-${rangeEnd + 1}`}
        </div>
      )}
    </div>
  );
}

export function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      type="button"
      className={`theme-toggle${theme === "light" ? " is-light" : ""}`}
      onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className="theme-toggle-knob">{theme === "dark" ? "🌙" : "☀️"}</span>
    </button>
  );
}

export function DoneScreen({
  pct, isBadListSession, score,
  masteredCount, totalWords, seenCount, badListCount,
  roundSize, onReplay, onNewRound, onBadList, hardCount, onHard, onHome,
}) {
  return (
    <div className="done-card">
      <div className="done-pct">{pct}%</div>
      <div className="done-label">{isBadListSession ? "Bad List Round" : "This Round"}</div>
      <div className="done-sub">{score.correct} / {score.total} correct</div>
      <div className="done-mastery">
        <div className="done-mastery-row">
          <span className="done-mastery-label">Overall Mastery</span>
          <span className="done-mastery-val">{masteredCount} / {totalWords}</span>
        </div>
        <div className="done-mastery-bar-bg">
          <div className="done-mastery-bar-fill" style={{ width: `${(masteredCount / totalWords) * 100}%` }} />
        </div>
        <div className="mastery-sub" style={{ marginTop: 6 }}>{seenCount} seen · {totalWords - seenCount} unseen · {badListCount} still on bad list</div>
      </div>
      <div className="done-btns">
        <button className="btn-gold" onClick={onReplay}>Replay</button>
        <button className="btn-gold" onClick={onNewRound}>New {roundSize}</button>
        {badListCount > 0 && <button className="btn-red" onClick={onBadList}>Bad List ({badListCount})</button>}
        {hardCount > 0 && (
          <button className="btn-outline challenge-outline" onClick={onHard}>
            Hard ({hardCount})
          </button>
        )}
        <button className="btn-outline" onClick={onHome}>← Home</button>
      </div>
    </div>
  );
}

export function SettingsGearButton({ onClick }) {
  return (
    <button
      type="button"
      className="icon-btn subtitle-settings-btn"
      onClick={onClick}
      aria-label="Settings"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.997.608 2.296.07 2.572-1.065z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  );
}

export function SettingsModal({ settingsOpen, licenseOpen, onClose, onOpenLicense, onCloseLicense, children }) {
  if (!settingsOpen) return null;
  if (!licenseOpen) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <span className="modal-title">SETTINGS</span>
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close settings">×</button>
          </div>
          <button type="button" className="settings-item" onClick={onOpenLicense}>
            Licences
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="modal-overlay" onClick={onCloseLicense}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">LICENCES</span>
          <button type="button" className="modal-close" onClick={onCloseLicense} aria-label="Close">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function LanguageMenu({ open, onClose, current, onSwitch }) {
  if (!open) return null;
  return (
    <>
      <div className="level-menu-overlay" onClick={onClose} />
      <div className="level-menu">
        <button
          type="button"
          className={`level-menu-item${current === "zh" ? " active" : ""}`}
          onClick={current === "zh" ? onClose : onSwitch}
        >
          Chinese (HSK)
        </button>
        <button
          type="button"
          className={`level-menu-item${current === "ru" ? " active" : ""}`}
          onClick={current === "ru" ? onClose : onSwitch}
        >
          Russian (TORFL)
        </button>
      </div>
    </>
  );
}
