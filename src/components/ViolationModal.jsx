import { VIOLATION_TYPES } from "../data/sampleData";
import "./ViolationModal.css";

export default function ViolationModal({ team, onSelect, onClose }) {
  if (!team) return null;

  function handleSelect(typeId) {
    const note = "";
    onSelect(typeId, note);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>
          Assign Violation — {team.number} {team.name}
        </h2>
        <div className="violation-options">
          {VIOLATION_TYPES.map((v) => (
            <button
              key={v.id}
              className="violation-option"
              style={{ borderColor: v.color, color: v.color }}
              onClick={() => handleSelect(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
        <button className="modal-close" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}