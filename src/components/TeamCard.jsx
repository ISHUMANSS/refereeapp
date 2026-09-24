import { getRule } from "../utils/rules";
import { groupByRule } from "../utils/violations";
import "./TeamCard.css";

export default function TeamCard({ team, violations, inspection, onClick, onRemove }) {
  const grouped = groupByRule(violations);

  return (
    <div className="team-card" onClick={onClick}>
      <div className="team-card-header">
        <span className="team-number">
          {team.number}
          {inspection && (
            <span
              className={`inspected-badge ${
                inspection.passed ? "" : "inspected-badge-fail"
              }`}
              title={inspection.passed ? "Passed inspection" : "Failed inspection"}
            >
              {inspection.passed ? "✓ Inspected" : "✕ Failed Inspection"}
            </span>
          )}
        </span>
        <button
          className="team-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(team.id);
          }}
        >
          ✕
        </button>
      </div>
      <div className="team-name">{team.name}</div>
      <div className="team-badges">
        {grouped.length === 0 && (
          <span className="badge-clean">No violations</span>
        )}
        {grouped.slice(0, 4).map((group) => {
          const rule = getRule(group.ruleCode);
          return (
            <span
              key={group.ruleCode}
              className={`badge ${group.hasMajor ? "badge-major" : ""}`}
              style={{ background: rule?.color || "#999" }}
              title={`${group.ruleCode} — ${group.count} call${
                group.count > 1 ? "s" : ""
              }`}
            >
              {group.ruleCode}
              {group.count > 1 && (
                <span className="badge-count">×{group.count}</span>
              )}
            </span>
          );
        })}
        {grouped.length > 4 && (
          <span className="badge-more">+{grouped.length - 4} more</span>
        )}
      </div>
    </div>
  );
}