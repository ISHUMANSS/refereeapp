import { useState } from "react";
import { RULE_CATEGORIES } from "../utils/rules";
import "./ViolationModal.css";

export default function ViolationModal({ team, onSelect, onClose }) {
  const [search, setSearch] = useState("");
  const [pendingRule, setPendingRule] = useState(null); // { code, categoryId, color, defaultSeverity }
  const [note, setNote] = useState("");

  if (!team) return null;

  const query = search.trim().toLowerCase();
  const filteredCategories = RULE_CATEGORIES.map((cat) => ({
    ...cat,
    rules: cat.rules.filter(
      (r) =>
        !query ||
        r.code.toLowerCase().includes(query) ||
        r.title.toLowerCase().includes(query)
    ),
  })).filter((cat) => cat.rules.length > 0);

  function handleConfirm(severity) {
    onSelect(pendingRule.code, severity, note);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>
          Assign Violation — {team.number} {team.name}
        </h2>

        {!pendingRule ? (
          <>
            <input
              className="modal-search"
              placeholder="Search rule code or title (e.g. G1, safety)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <div className="rule-list">
              {filteredCategories.length === 0 && (
                <p className="rule-empty">No rules match "{search}".</p>
              )}
              {filteredCategories.map((cat) => (
                <div key={cat.id} className="rule-category">
                  <div
                    className="rule-category-label"
                    style={{ color: cat.color }}
                  >
                    {cat.name}
                  </div>
                  <div className="rule-chip-row">
                    {cat.rules.map((r) => (
                      <button
                        key={r.code}
                        className="rule-chip"
                        style={{ borderColor: cat.color, color: cat.color }}
                        onClick={() =>
                          setPendingRule({
                            code: r.code,
                            categoryId: cat.id,
                            color: cat.color,
                            defaultSeverity:
                              r.severity === "variable" ? null : r.severity,
                          })
                        }
                      >
                        {r.code}
                        {r.title ? ` — ${r.title}` : ""}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="severity-step">
            <p className="severity-selected-rule" style={{ color: pendingRule.color }}>
              {pendingRule.code}
            </p>

            <label className="setup-label">Note (optional)</label>
            <textarea
              className="modal-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything specific about this call…"
            />

            <div className="severity-buttons">
              <button
                className="severity-btn severity-minor"
                onClick={() => handleConfirm("minor")}
              >
                Minor
              </button>
              <button
                className="severity-btn severity-major"
                onClick={() => handleConfirm("major")}
              >
                Major
              </button>
            </div>
            <button
              className="modal-close"
              onClick={() => setPendingRule(null)}
            >
              ← Choose a different rule
            </button>
          </div>
        )}

        <button className="modal-close" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}