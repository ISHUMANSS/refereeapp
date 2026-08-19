import { VIOLATION_TYPES } from "../data/sampleData";
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
        {violations.map((v) => {
          const type = VIOLATION_TYPES.find((t) => t.id === v.type);
          return (
            <span
              key={v.id}
              className="badge"
              style={{ background: type?.color }}
            >
              {type?.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}