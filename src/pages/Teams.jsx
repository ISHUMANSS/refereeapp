import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEventData } from "../context/EventDataContext";
import { VIOLATION_TYPES } from "../data/sampleData";
import TeamCard from "../components/TeamCard";
import ViolationModal from "../components/ViolationModal";
import "./Teams.css";
import Header from "../components/Header";

export default function Teams() {
  const { teamNumber } = useParams();
  return teamNumber ? (
    <TeamDetail teamNumber={teamNumber} />
  ) : (
    <TeamList />
  );
}

function TeamList() {
  const navigate = useNavigate();
  const { teams, addTeam, removeTeam, violationsForTeam } = useEventData();
  const [numberInput, setNumberInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  function handleAddTeam(e) {
    e.preventDefault();
    if (!numberInput.trim()) return;
    addTeam(numberInput, nameInput);
    setNumberInput("");
    setNameInput("");
  }

  return (
    <div className="teams-page">
      <Header />
      <h1>Teams</h1>

      <form className="add-team-form" onSubmit={handleAddTeam}>
        <input
          placeholder="Team number (e.g. 1234A)"
          value={numberInput}
          onChange={(e) => setNumberInput(e.target.value)}
        />
        <input
          placeholder="Team name (optional)"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <button type="submit">Add Team</button>
      </form>

      <div className="team-grid">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            violations={violationsForTeam(team.id)}
            onClick={() => navigate(`/teams/${team.number}`)}
            onRemove={removeTeam}
          />
        ))}
      </div>
    </div>
  );
}

function TeamDetail({ teamNumber }) {
  const navigate = useNavigate();
  const { teams, violationsForTeam, addViolation, removeViolation } =
    useEventData();
  const [modalOpen, setModalOpen] = useState(false);

  const team = teams.find((t) => t.number === teamNumber);

  if (!team) {
    return (
      <div className="teams-page">
        <p>Team {teamNumber} not found.</p>
        <button onClick={() => navigate("/teams")}>Back to Teams</button>
      </div>
    );
  }

  const violations = violationsForTeam(team.id);

  function handleSelect(typeId) {
    addViolation(team.id, typeId, "");
    setModalOpen(false);
  }

  return (
    <div className="teams-page">
      <button className="back-link" onClick={() => navigate("/teams")}>
        ← Back to Teams
      </button>
      <h1>
        {team.number} — {team.name}
      </h1>

      <button className="assign-btn" onClick={() => setModalOpen(true)}>
        Assign Violation
      </button>

      <h2>Violation Log</h2>
      {violations.length === 0 && <p>No violations recorded.</p>}
      <ul className="violation-list">
        {violations.map((v) => {
          const type = VIOLATION_TYPES.find((t) => t.id === v.type);
          return (
            <li key={v.id} className="violation-list-item">
              <span className="badge" style={{ background: type?.color }}>
                {type?.label}
              </span>
              <span className="violation-time">
                {new Date(v.timestamp).toLocaleTimeString()}
              </span>
              <button onClick={() => removeViolation(v.id)}>✕</button>
            </li>
          );
        })}
      </ul>

      {modalOpen && (
        <ViolationModal
          team={team}
          onSelect={handleSelect}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}