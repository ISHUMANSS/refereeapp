import { getRule } from "../utils/rules";
import { groupByRule } from "../utils/violations";
import "./TeamCard.css";

function getStatus(inspection, grouped) {
  if (inspection && !inspection.passed) return "status-alert";
  if (grouped.some((g) => g.hasMajor)) return "status-alert";
  if (grouped.length > 0) return "status-warn";
  return "status-clean";
}

function getInspectionBadge(inspection) {
  if (!inspection) {
    return { className: "inspected-badge-pending", label: "Not Inspected" };
  }
  if (inspection.passed) {
    return { className: "", label: "✓ Inspected" };
  }
  return { className: "inspected-badge-fail", label: "✕ Failed" };
}

export default function TeamCard({ team, violations, inspection, onClick, onRemove }) {
  const grouped = groupByRule(violations);
  const status = getStatus(inspection, grouped);
  const inspectionBadge = getInspectionBadge(inspection);

  return (
    <div className={`team-card ${status}`} onClick={onClick}>
      <div className="team-card-header">
        <span className="team-number">{team.number}</span>
        <span
          className={`inspected-badge ${inspectionBadge.className}`}
          title={
            inspection
              ? inspection.passed
                ? "Passed inspection"
                : "Failed inspection"
              : "Not yet inspected"
          }
        >
          {inspectionBadge.label}
        </span>
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