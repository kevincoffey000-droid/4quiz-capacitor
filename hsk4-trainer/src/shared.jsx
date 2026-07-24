export function MasteryBox({ masteredCount, totalWords, seenCount, badListCount }) {
  return (
    <div className="mastery-box">
      <div className="mastery-header">
        <span className="mastery-label">Overall Mastery</span>
        <span className="mastery-count">{masteredCount} / {totalWords}</span>
      </div>
      <div className="mastery-bar-bg">
        <div className="mastery-bar-fill" style={{ width: `${(masteredCount / totalWords) * 100}%` }} />
      </div>
      <div className="mastery-sub">{seenCount} seen · {totalWords - seenCount} unseen · {badListCount} on bad list</div>
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
