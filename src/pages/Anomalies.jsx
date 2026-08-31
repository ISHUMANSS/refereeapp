import { useEventData } from "../context/EventDataContext";
import { getRule } from "../utils/rules";
import Header from "../components/Header";
import "./Anomalies.css";

function Anomalies() {
  const { ruleCounts, teams } = useEventData();
  const counts = ruleCounts();

  return (
    <main>
      <Header />
      <div className="anomalies-page">
        <h1>Anomalies</h1>
        <p className="anomalies-subtitle">
          Rules broken most often across all {teams.length} teams this event.
        </p>

        {counts.length === 0 ? (
          <p className="teams-empty">No violations recorded yet.</p>
        ) : (
          <div className="anomaly-list">
            {counts.map((entry, i) => {
              const rule = getRule(entry.ruleCode);
              return (
                <div key={entry.ruleCode} className="anomaly-row">
                  <span className="anomaly-rank">#{i + 1}</span>
                  <span
                    className="badge anomaly-badge"
                    style={{ background: rule?.color || "#999" }}
                  >
                    {entry.ruleCode}
                  </span>
                  <span className="anomaly-title">
                    {rule?.title || rule?.categoryName || "Unknown rule"}
                  </span>
                  <span className="anomaly-breakdown">
                    {entry.minor > 0 && (
                      <span className="severity-tag severity-tag-minor">
                        {entry.minor} minor
                      </span>
                    )}
                    {entry.major > 0 && (
                      <span className="severity-tag severity-tag-major">
                        {entry.major} major
                      </span>
                    )}
                  </span>
                  <span className="anomaly-count">{entry.count}×</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Anomalies;