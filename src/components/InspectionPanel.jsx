import { useState, useEffect } from "react";
import "./InspectionPanel.css";

export default function InspectionPanel({ teamId, inspection, onSetInspection }) {
  const [note, setNote] = useState(inspection?.note || "");
  // Collapsed by default only when there's a passed inspection already on record.
  const [expanded, setExpanded] = useState(!inspection?.passed);

  // If the underlying inspection changes (e.g. switching teams), reset collapse state.
  useEffect(() => {
    setExpanded(!inspection?.passed);
    setNote(inspection?.passed ? "" : inspection?.note || "");
  }, [teamId]); // eslint-disable-line react-hooks/exhaustive-deps

  function markPassed() {
    onSetInspection(teamId, true, "");
    setNote("");
    setExpanded(false);
  }

  function markFailed() {
    onSetInspection(teamId, false, note);
  }

  if (inspection?.passed && !expanded) {
    return (
      <div className="inspection-panel inspection-panel-collapsed">
        <span className="inspection-current inspection-current-pass inspection-summary">
          ✓ Passed Inspection
          <span className="inspection-current-time">
            {new Date(inspection.updatedAt).toLocaleString()}
          </span>
        </span>
        <button className="inspection-reinspect-btn" onClick={() => setExpanded(true)}>
          Re-inspect
        </button>
      </div>
    );
  }

  return (
    <div className="inspection-panel">
      {inspection && (
        <div
          className={`inspection-current ${
            inspection.passed ? "inspection-current-pass" : "inspection-current-fail"
          }`}
        >
          {inspection.passed ? "✓ Passed Inspection" : "✕ Failed Inspection"}
          {inspection.note && <p className="inspection-current-note">{inspection.note}</p>}
          <span className="inspection-current-time">
            {new Date(inspection.updatedAt).toLocaleString()}
          </span>
        </div>
      )}

      <label className="setup-label">Note (required if failing)</label>
      <textarea
        className="inspection-note-input"
        rows={2}
        placeholder="Why did it fail, or anything worth noting…"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="inspection-buttons">
        <button className="inspection-btn inspection-btn-pass" onClick={markPassed}>
          Pass
        </button>
        <button
          className="inspection-btn inspection-btn-fail"
          disabled={!note.trim()}
          onClick={markFailed}
        >
          Fail
        </button>
      </div>

      {inspection?.passed && (
        <button className="inspection-cancel-btn" onClick={() => setExpanded(false)}>
          Cancel
        </button>
      )}
    </div>
  );
}