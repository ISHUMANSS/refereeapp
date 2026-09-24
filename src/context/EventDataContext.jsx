import { createContext, useContext, useState, useEffect } from "react";
import { sampleTeams } from "../data/sampleData";

const STORAGE_KEY = "roboref-event-data";
const EventDataContext = createContext(null);

const EMPTY_STATE = { event: null, teams: [], violations: [], inspections: {} };

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...EMPTY_STATE, ...parsed }; // backfill any missing keys, e.g. inspections
    }
  } catch (e) {
    console.error("Failed to load saved data", e);
  }
  return EMPTY_STATE;
}

export function EventDataProvider({ children }) {
  const [data, setData] = useState(loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // ---- Event lifecycle ----
  function createEvent(name, { useSampleData = false, source = "local" } = {}) {
    setData({
      event: {
        id: crypto.randomUUID(),
        name: name.trim(),
        source,
        createdAt: Date.now(),
      },
      teams: useSampleData ? sampleTeams : [],
      violations: [],
      inspections: {},
    });
  }

  function clearEvent() {
    setData(EMPTY_STATE);
  }

  // ---- Teams ----
  function addTeam(number, name) {
    const team = {
      id: crypto.randomUUID(),
      number: number.trim(),
      name: name.trim(),
    };
    setData((prev) => ({ ...prev, teams: [...prev.teams, team] }));
  }

  function removeTeam(teamId) {
    setData((prev) => ({
      ...prev,
      teams: prev.teams.filter((t) => t.id !== teamId),
      violations: prev.violations.filter((v) => v.teamId !== teamId),
    }));
  }

  // ---- Violations ----
  function addViolation(teamId, ruleCode, severity, note = "") {
    const violation = {
      id: crypto.randomUUID(),
      teamId,
      ruleCode,
      severity, // "minor" | "major"
      note: note.trim(),
      timestamp: Date.now(),
    };
    setData((prev) => ({
      ...prev,
      violations: [...prev.violations, violation],
    }));
  }

  function removeViolation(violationId) {
    setData((prev) => ({
      ...prev,
      violations: prev.violations.filter((v) => v.id !== violationId),
    }));
  }

  function violationsForTeam(teamId) {
    return data.violations
      .filter((v) => v.teamId === teamId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  // Counts per rule code across the whole event, sorted most-broken first
  function ruleCounts() {
    const counts = {};
    data.violations.forEach((v) => {
      if (!counts[v.ruleCode]) {
        counts[v.ruleCode] = { ruleCode: v.ruleCode, count: 0, minor: 0, major: 0 };
      }
      counts[v.ruleCode].count += 1;
      counts[v.ruleCode][v.severity] += 1;
    });
    return Object.values(counts).sort((a, b) => b.count - a.count);
  }


  // ---- Inspections ----
  // data.inspections shape: { [teamId]: { passed: bool, note: string, updatedAt: number } }
  function setInspection(teamId, passed, note = "") {
    setData((prev) => ({
      ...prev,
      inspections: {
        ...prev.inspections,
        [teamId]: {
          passed,
          note: note.trim(),
          updatedAt: Date.now(),
        },
      },
    }));
  }

  function clearInspection(teamId) {
    setData((prev) => {
      const { [teamId]: _removed, ...rest } = prev.inspections;
      return { ...prev, inspections: rest };
    });
  }

  function inspectionForTeam(teamId) {
    return data.inspections[teamId] || null;
  }

  const value = {
    event: data.event,
    teams: data.teams,
    violations: data.violations,
    createEvent,
    clearEvent,
    addTeam,
    removeTeam,
    addViolation,
    removeViolation,
    violationsForTeam,
    ruleCounts,
    setInspection,
    clearInspection,
    inspectionForTeam,
  };

  return (
    <EventDataContext.Provider value={value}>
      {children}
    </EventDataContext.Provider>
  );
}

  

export function useEventData() {
  const ctx = useContext(EventDataContext);
  if (!ctx) {
    throw new Error("useEventData must be used within EventDataProvider");
  }
  return ctx;
}