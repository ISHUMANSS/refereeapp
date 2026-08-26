import { Link } from "react-router-dom";
import { useEventData } from "../context/EventDataContext";
import "./Home.css";

const SECTIONS = [
  {
    to: "/matches",
    title: "Matches",
    description: "View match schedule and open a match to score or referee.",
    disabled: true,
  },
  {
    to: "/teams",
    title: "Teams",
    description: "View teams and assign violations.",
    disabled: false,
  },
  {
    to: "/anomalies",
    title: "Anomalies",
    description: "Full event-wide log of every violation recorded.",
    disabled: true,
  },
  {
    to: "/event/setup",
    title: "Event Setup",
    description: "Configure event details and import teams.",
    disabled: true,
  },
];

function Home() {
  const { teams, violations } = useEventData();

  return (
    <main className="home">
      <h1>VEX Ref</h1>
      <p className="home-subtitle">
        Referee tools for VEX Robotics competitions.
      </p>

      <div className="home-stats">
        <div className="home-stat">
          <span className="home-stat-value">{teams.length}</span>
          <span className="home-stat-label">Teams</span>
        </div>
        <div className="home-stat">
          <span className="home-stat-value">{violations.length}</span>
          <span className="home-stat-label">Violations Logged</span>
        </div>
      </div>

      <div className="home-grid">
        {SECTIONS.map((section) =>
          section.disabled ? (
            <div
              key={section.to}
              className="home-card home-card-disabled"
              aria-disabled="true"
            >
              <h3>{section.title}</h3>
              <p>{section.description}</p>
              <span className="home-card-badge">Coming soon</span>
            </div>
          ) : (
            <Link key={section.to} to={section.to} className="home-card">
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </Link>
          )
        )}
      </div>
    </main>
  );
}

export default Home;