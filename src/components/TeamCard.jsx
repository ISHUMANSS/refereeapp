import { getRule } from "../utils/rules";
import "./TeamCard.css";

export default function TeamCard({ team, violations, onClick, onRemove }) {
  return (
    <div className="team-card" onClick={onClick}>
      <div className="team-card-header">
        <span className="team-number">{team.number}</span>
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
        {violations.length === 0 && (
          <span className="badge-clean">No violations</span>
        )}
        {violations.slice(0, 4).map((v) => {
          const rule = getRule(v.ruleCode);
          return (
            <span
              key={v.id}
              className="badge"
              style={{ background: rule?.color || "#999" }}
              title={`${v.ruleCode} (${v.severity})`}
            >
              {v.ruleCode}
            </span>
          );
        })}
        {violations.length > 4 && (
          <span className="badge-more">+{violations.length - 4}</span>
        )}
      </div>
    </div>
  );
}